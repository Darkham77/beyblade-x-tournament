import os
import sys
import json
import argparse
import torch
import torch.nn as nn
from torchvision import models
from torchvision.models import MobileNet_V3_Small_Weights
import torchvision.transforms as T
from PIL import Image

def get_model(mode: str, num_classes: int, weights_path: str):
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
        print(f"Loaded weights from {weights_path}")
    else:
        print(f"WARNING: Weights file not found at {weights_path}")
    model.eval()
    return model

def preprocess_image(img_path: str) -> torch.Tensor:
    img = Image.open(img_path).convert('RGB')
    w, h = img.size
    aspect = w / h
    # Center crop if rectangular
    if aspect < 0.85 or aspect > 1.15:
        min_dim = min(w, h)
        crop_size = max(160, int(min_dim * 0.70))
        left = (w - crop_size) // 2
        top = (h - crop_size) // 2
        img = img.crop((left, top, left + crop_size, top + crop_size))

    # Resize to 224x224
    img = img.resize((224, 224), Image.Resampling.BILINEAR)

    # Normalize
    transform = T.Compose([
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    tensor = transform(img).unsqueeze(0)
    return tensor

def predict(mode: str, image_path: str):
    root_dir = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys'
    models_dir = os.path.join(root_dir, 'app', 'public', 'models')
    
    classes_file = os.path.join(models_dir, f'{mode}_classes.json')
    if not os.path.exists(classes_file):
        print(f"Classes file missing: {classes_file}")
        return

    with open(classes_file, 'r', encoding='utf-8') as f:
        classes = json.load(f)

    pth_path = os.path.join(r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training', f'{mode}_mobilenet_v3.pth')
    model = get_model(mode, len(classes), pth_path)

    tensor = preprocess_image(image_path)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0]
        top_probs, top_indices = torch.topk(probs, min(5, len(classes)))

    print(f"\n--- PREDICTION FOR [{mode.upper()}]: {os.path.basename(image_path)} ---")
    for rank, (prob, idx) in enumerate(zip(top_probs, top_indices), 1):
        class_name = classes[idx.item()]
        pct = prob.item() * 100
        print(f"#{rank} {class_name:12s} : {pct:6.2f}%")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', type=str, required=True, choices=['blade', 'ratchet', 'bit'])
    parser.add_argument('--image', type=str, required=True)
    args = parser.parse_args()
    predict(args.mode, args.image)
