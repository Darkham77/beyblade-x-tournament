import os
import sys
import json
import argparse
import time
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import torch
import torch.nn as nn
from torchvision import models
from torchvision.models import MobileNet_V3_Small_Weights
import torchvision.transforms as T
from PIL import Image

def load_model(mode: str, num_classes: int, weights_path: str):
    weights = MobileNet_V3_Small_Weights.DEFAULT
    model = models.mobilenet_v3_small(weights=weights)
    in_features = model.classifier[0].in_features
    model.classifier = nn.Sequential(
        nn.Linear(in_features, 256),
        nn.Hardswish(),
        nn.Dropout(p=0.25),
        nn.Linear(256, num_classes)
    )
    if os.path.exists(weights_path):
        state = torch.load(weights_path, map_location='cpu')
        model.load_state_dict(state)
    else:
        raise FileNotFoundError(f"Weights file not found at: {weights_path}")
    model.eval()
    return model

def preprocess_image(img_path: str) -> torch.Tensor:
    raw = Image.open(img_path)
    w, h = raw.size

    # Handle transparent PNGs by padding to square on neutral background
    if raw.mode == 'RGBA':
        max_d = max(w, h)
        side = int(max_d * 1.05)
        padded = Image.new('RGB', (side, side), (240, 240, 240))
        padded.paste(raw, ((side - w) // 2, (side - h) // 2), mask=raw.split()[3])
        img = padded.resize((224, 224), Image.Resampling.BILINEAR)
    else:
        img = raw.convert('RGB')
        aspect = w / h
        # Rectangular camera captures: 70% center crop
        if aspect < 0.85 or aspect > 1.15:
            min_dim = min(w, h)
            crop_size = max(160, int(min_dim * 0.70))
            left = (w - crop_size) // 2
            top = (h - crop_size) // 2
            img = img.crop((left, top, left + crop_size, top + crop_size))

        img = img.resize((224, 224), Image.Resampling.BILINEAR)

    # Normalize
    transform = T.Compose([
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return transform(img).unsqueeze(0)

def run_benchmark(mode: str, test_dir: str):
    root_dir = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys'
    models_dir = os.path.join(root_dir, 'app', 'public', 'models')
    
    classes_filename = 'beyblade_classes.json' if mode == 'blade' else f'{mode}_classes.json'
    classes_file = os.path.join(models_dir, classes_filename)
    with open(classes_file, 'r', encoding='utf-8') as f:
        classes = json.load(f)
    class_to_idx = {name.upper(): i for i, name in enumerate(classes)}

    weights_filename = 'beyblade_mobilenet_v3.pth' if mode == 'blade' else f'{mode}_mobilenet_v3.pth'
    weights_path = os.path.join(r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training', weights_filename)
    model = load_model(mode, len(classes), weights_path)

    # Gather test samples: test_dir/<class_name>/<filename>
    test_samples = []
    if not os.path.exists(test_dir):
        print(f"Benchmark directory not found: {test_dir}")
        return

    for root, dirs, files in os.walk(test_dir):
        rel = os.path.relpath(root, test_dir)
        if rel == '.':
            continue
        folder_class = os.path.basename(root).upper()
        if folder_class in class_to_idx:
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    test_samples.append((os.path.join(root, f), folder_class))

    print(f"\n=================================================================")
    print(f"   IN-THE-WILD COMMUNITY BENCHMARK FOR [{mode.upper()}]")
    print(f"   Total Test Images Collected: {len(test_samples)}")
    print(f"=================================================================\n")

    if not test_samples:
        print("No test images found matching model classes.")
        return

    top1_correct = 0
    top3_correct = 0
    total = len(test_samples)
    latencies = []
    results_by_class = defaultdict(lambda: {'total': 0, 'top1': 0, 'top3': 0, 'failures': []})

    for path, true_class in test_samples:
        t0 = time.time()
        tensor = preprocess_image(path)
        with torch.no_grad():
            logits = model(tensor)
            probs = torch.softmax(logits, dim=1)[0]
            top_probs, top_indices = torch.topk(probs, min(3, len(classes)))
        latencies.append((time.time() - t0) * 1000)

        pred_classes = [classes[idx.item()].upper() for idx in top_indices]
        pred_pcts = [prob.item() * 100 for prob in top_probs]

        is_top1 = (pred_classes[0] == true_class)
        is_top3 = (true_class in pred_classes)

        results_by_class[true_class]['total'] += 1
        if is_top1:
            top1_correct += 1
            results_by_class[true_class]['top1'] += 1
        if is_top3:
            top3_correct += 1
            results_by_class[true_class]['top3'] += 1
        else:
            results_by_class[true_class]['failures'].append({
                'file': os.path.basename(path),
                'top1_predicted': f"{pred_classes[0]} ({pred_pcts[0]:.1f}%)"
            })

        mark = "✅ TOP-1" if is_top1 else ("🟡 TOP-3" if is_top3 else "❌ MISS")
        print(f"[{mark}] True: {true_class:8s} | #1: {pred_classes[0]:8s} ({pred_pcts[0]:5.1f}%) | Img: {os.path.basename(path)}")

    top1_acc = (top1_correct / total) * 100
    top3_acc = (top3_correct / total) * 100
    avg_latency = sum(latencies) / len(latencies)

    print(f"\n=================================================================")
    print(f"   FINAL IN-THE-WILD BENCHMARK REPORT: [{mode.upper()}]")
    print(f"=================================================================")
    print(f"   Total Evaluated Samples : {total}")
    print(f"   Top-1 Direct Accuracy   : {top1_acc:.1f}% ({top1_correct}/{total})")
    print(f"   Top-3 Candidate Accuracy: {top3_acc:.1f}% ({top3_correct}/{total})")
    print(f"   Average CPU Latency     : {avg_latency:.1f} ms/frame")
    print(f"=================================================================\n")

    return {
        'mode': mode,
        'total': total,
        'top1_acc': top1_acc,
        'top3_acc': top3_acc,
        'avg_latency': avg_latency,
        'by_class': dict(results_by_class)
    }

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', type=str, required=True, choices=['blade', 'ratchet', 'bit'])
    parser.add_argument('--dir', type=str, required=True)
    args = parser.parse_args()
    run_benchmark(args.mode, args.dir)
