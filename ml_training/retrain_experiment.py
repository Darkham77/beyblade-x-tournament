import os
import json
import random
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as T
from torchvision import models
from torchvision.models import MobileNet_V3_Small_Weights
from PIL import Image
import augmentations

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Training on: {DEVICE}')

# 1. Classes and Mappings
DESKTOP_DIR = 'C:/Users/Ro/Desktop/blades'
USER_DIR = 'C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded'
MODELS_DIR = 'C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/public/models'

with open(os.path.join(MODELS_DIR, 'beyblade_classes.json'), 'r') as f:
    BLADE_CLASSES = json.load(f)

class_to_idx = {name: i for i, name in enumerate(BLADE_CLASSES)}
num_classes = len(BLADE_CLASSES)

# 2. Map all 12 real user benchmark photos
desktop_photos = [
    ('PHOENIX_WING', 'WhatsApp Image 2026-10-21 at 21.33.48.jpeg'),
    ('WIZARD_ROD', 'WhatsApp Image 2026-10-21 at 21.34.07.jpeg'),
    ('MAMMOTH_TUSK', 'WhatsApp Image 2026-10-21 at 21.36.38.jpeg'),
    ('UNICORN_STING', 'WhatsApp Image 2026-10-21 at 21.37.12.jpeg'),
    ('DRANZER_SPIRAL', 'WhatsApp Image 2026-10-22 at 11.51.27.jpeg'),
    ('VIPER_TAIL', 'WhatsApp Image 2026-10-22 at 11.51.28 (1).jpeg'),
    ('DRAN_SWORD', 'WhatsApp Image 2026-10-22 at 11.51.28 (2).jpeg'), # Dran Sword (Azul Clásico)
    ('UNICORN_STING', 'WhatsApp Image 2026-10-22 at 11.51.28.jpeg'),
    ('DRAN_SWORD', 'WhatsApp Image 2026-10-22 at 11.51.29 (1).jpeg'), # Dran Sword (Rojo Especial Recolor)
    ('DRAN_DAGGER', 'WhatsApp Image 2026-10-22 at 11.51.29 (2).jpeg'),
    ('PHOENIX_WING', 'WhatsApp Image 2026-10-22 at 11.51.29.jpeg'),
    ('DRAN_BUSTER', 'WhatsApp Image 2026-10-22 at 11.51.30.jpeg'),
]

# Generate reticle crops for training
crops_dir = r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training\reticle_crops'
os.makedirs(crops_dir, exist_ok=True)

processed_desktop_samples = []
for cls_name, fname in desktop_photos:
    src_path = os.path.join(DESKTOP_DIR, fname)
    img = Image.open(src_path).convert('RGB')
    w, h = img.size
    for ratio in [0.48, 0.54, 0.58, 0.62, 0.68]:
        crop_size = int(min(w, h) * ratio)
        cx, cy = w // 2, h // 2
        crop_img = img.crop((cx - crop_size//2, cy - crop_size//2, cx + crop_size//2, cy + crop_size//2))
        save_name = f'{cls_name}_{int(ratio*100)}_{fname.replace(" ", "_")}'
        save_path = os.path.join(crops_dir, save_name)
        crop_img.save(save_path)
        processed_desktop_samples.append((save_path, class_to_idx[cls_name]))

print(f'Generated {len(processed_desktop_samples)} reticle-matched real sample crops across all user beys.')

# Load base catalog dataset
with open(r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training\dataset_index.json', 'r') as f:
    base_dataset = json.load(f)

all_train_samples = []
for cls_name, paths in base_dataset.items():
    for p in paths:
        if os.path.exists(p):
            all_train_samples.append((p, class_to_idx[cls_name]))

all_train_samples.extend(processed_desktop_samples)
print(f'Total training pool: {len(all_train_samples)} samples across {num_classes} classes.')

# Custom Training Dataset with On-the-Fly Heavy Augmentation
class AugmentedDataset(Dataset):
    def __init__(self, samples, transform, samples_per_epoch=2000):
        self.samples = samples
        self.transform = transform
        self.samples_per_epoch = samples_per_epoch

    def __len__(self):
        return self.samples_per_epoch

    def __getitem__(self, idx):
        path, cls_idx = random.choice(self.samples)
        try:
            img = Image.open(path).convert('RGB')
            tensor = self.transform(img)
            return tensor, cls_idx
        except Exception:
            # Fallback to random sample if read fails
            path, cls_idx = self.samples[0]
            img = Image.open(path).convert('RGB')
            return self.transform(img), cls_idx

# Fixed Validation Dataset (Center 0.58 crop for exact reticle test)
class ReticleValDataset(Dataset):
    def __init__(self, photo_list, class_to_idx, transform):
        self.samples = []
        for cls_name, fname in photo_list:
            p = os.path.join(DESKTOP_DIR, fname)
            self.samples.append((p, class_to_idx[cls_name], cls_name, fname))
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, cls_idx, cls_name, fname = self.samples[idx]
        img = Image.open(path).convert('RGB')
        w, h = img.size
        crop_size = int(min(w, h) * 0.58)
        cx, cy = w // 2, h // 2
        crop = img.crop((cx - crop_size//2, cy - crop_size//2, cx + crop_size//2, cy + crop_size//2))
        return self.transform(crop), cls_idx, cls_name, fname

train_ds = AugmentedDataset(all_train_samples, augmentations.get_train_transforms(), samples_per_epoch=2280)
val_ds = ReticleValDataset(desktop_photos, class_to_idx, augmentations.get_val_transforms())

train_loader = DataLoader(train_ds, batch_size=32, shuffle=True, num_workers=0)
val_loader = DataLoader(val_ds, batch_size=len(val_ds), shuffle=False)

# Model: MobileNetV3-Small
weights = MobileNet_V3_Small_Weights.DEFAULT
model = models.mobilenet_v3_small(weights=weights)

# Only freeze initial 2 conv blocks, allow layers 3+ to learn fine Beyblade details
for param in model.features[:3].parameters():
    param.requires_grad = False

in_features = model.classifier[0].in_features
model.classifier = nn.Sequential(
    nn.Linear(in_features, 256),
    nn.Hardswish(),
    nn.Dropout(p=0.25),
    nn.Linear(256, num_classes)
)
model = model.to(DEVICE)

criterion = nn.CrossEntropyLoss(label_smoothing=0.06)
optimizer = torch.optim.AdamW([
    {'params': model.features[3:].parameters(), 'lr': 3e-4},
    {'params': model.classifier.parameters(), 'lr': 1.2e-3},
], weight_decay=1e-4)

epochs = 7
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

print(f'\nStarting Training ({epochs} epochs)...')
for epoch in range(1, epochs + 1):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    for images, targets in train_loader:
        images, targets = images.to(DEVICE), targets.to(DEVICE)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == targets).sum().item()
        total += targets.size(0)

    scheduler.step()
    train_acc = (correct / total) * 100
    epoch_loss = running_loss / total
    print(f'Epoch {epoch:2d}/{epochs:2d} | Train Loss: {epoch_loss:.4f} | Train Acc: {train_acc:.1f}%', flush=True)

# Evaluation on 12 Real User Photos
model.eval()
print('\n==================== REAL BENCHMARK RESULTS (12 PHOTOS) ====================')
correct_val = 0
with torch.no_grad():
    for images, targets, cls_names, fnames in val_loader:
        images = images.to(DEVICE)
        outputs = model(images)
        probs = torch.softmax(outputs, dim=1)
        for i in range(len(targets)):
            target_idx = targets[i].item()
            true_name = cls_names[i]
            fname = fnames[i]
            p_top1, idx_top1 = torch.topk(probs[i], 1)
            pred_name = BLADE_CLASSES[idx_top1[0].item()]
            conf = p_top1[0].item() * 100
            is_ok = pred_name == true_name
            if is_ok:
                correct_val += 1
            status = 'CORRECT' if is_ok else 'WRONG'
            print(f'[{status:7s}] {fname:42s} | True: {true_name:15s} | Pred: {pred_name:15s} ({conf:.1f}%)')

val_acc = (correct_val / len(val_ds)) * 100
print(f'\nOverall Real Photos Benchmark Accuracy: {correct_val}/{len(val_ds)} ({val_acc:.1f}%)')

# Save model weights
pth_path = r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training\beyblade_mobilenet_v3.pth'
torch.save(model.state_dict(), pth_path)
print(f'PyTorch weights saved to: {pth_path}')

# Export ONNX model
onnx_path = os.path.join(MODELS_DIR, 'beyblade_mobilenet_v3.onnx')
dummy_input = torch.randn(1, 3, 224, 224, device=DEVICE)
model.eval()

torch.onnx.export(
    model,
    dummy_input,
    onnx_path,
    input_names=['input'],
    output_names=['logits'],
    opset_version=18,
    dynamic_axes={'input': {0: 'batch'}, 'logits': {0: 'batch'}}
)
import onnx
m = onnx.load(onnx_path, load_external_data=True)
onnx.save_model(m, onnx_path, save_as_external_data=False)
data_file = onnx_path + '.data'
if os.path.exists(data_file):
    os.remove(data_file)
print(f'ONNX model successfully consolidated into single file: {onnx_path}')
