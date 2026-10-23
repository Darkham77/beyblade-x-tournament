import os
import sys
import glob
import json
import random
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as T
from torchvision import models
from torchvision.models import MobileNet_V3_Small_Weights
from PIL import Image
import onnx
import augmentations

os.environ['PYTHONIOENCODING'] = 'utf-8'

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Training Ratchet Model on: {DEVICE}')

RATCHET_DIR = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\public\images\parts\ratchets'
MODELS_DIR = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\public\models'

with open(os.path.join(MODELS_DIR, 'ratchet_classes.json'), 'r', encoding='utf-8') as f:
    RATCHET_CLASSES = json.load(f)

class_to_idx = {name: i for i, name in enumerate(RATCHET_CLASSES)}
num_classes = len(RATCHET_CLASSES)
print(f'Total Ratchet Classes: {num_classes}')

# Map files in RATCHET_DIR to class
samples = []
for f in os.listdir(RATCHET_DIR):
    if not f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        continue
    # Name format: ratchet_3-60.png
    base = os.path.splitext(f)[0]
    code = base.replace('ratchet_', '').upper()
    if code in class_to_idx:
        samples.append((os.path.join(RATCHET_DIR, f), class_to_idx[code]))
    elif code.lower() in [c.lower() for c in class_to_idx]:
        for c in class_to_idx:
            if c.lower() == code.lower():
                samples.append((os.path.join(RATCHET_DIR, f), class_to_idx[c]))
                break

print(f'Found {len(samples)} base Ratchet sample images.')

# Training transforms for Ratchets:
# - Full 360-degree rotation invariance
# - Color jitter to ignore plastic recolors
# - Flash reflections
train_transforms = T.Compose([
    T.RandomRotation(degrees=180, interpolation=T.InterpolationMode.BILINEAR, expand=False),
    augmentations.SpecularFlashGlare(p=0.45),
    T.RandomResizedCrop(224, scale=(0.85, 1.05), ratio=(0.95, 1.05), interpolation=T.InterpolationMode.BILINEAR),
    T.ColorJitter(brightness=0.35, contrast=0.35, saturation=0.35, hue=0.25),
    T.RandomGrayscale(p=0.20),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

val_transforms = T.Compose([
    T.Resize((224, 224), interpolation=T.InterpolationMode.BILINEAR),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

class AugmentedRatchetDataset(Dataset):
    def __init__(self, samples, transform, samples_per_epoch=1500):
        self.samples = samples
        self.transform = transform
        self.samples_per_epoch = samples_per_epoch

    def __len__(self):
        return self.samples_per_epoch

    def __getitem__(self, idx):
        path, cls_idx = random.choice(self.samples)
        try:
            img = Image.open(path).convert('RGB')
            return self.transform(img), cls_idx
        except Exception:
            path, cls_idx = self.samples[0]
            img = Image.open(path).convert('RGB')
            return self.transform(img), cls_idx

train_ds = AugmentedRatchetDataset(samples, train_transforms, samples_per_epoch=1500)
train_loader = DataLoader(train_ds, batch_size=32, shuffle=True)

# Build Model
weights = MobileNet_V3_Small_Weights.DEFAULT
model = models.mobilenet_v3_small(weights=weights)

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

epochs = 5
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

print(f'\nStarting Ratchet Model Training ({epochs} epochs)...')
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

# Save PyTorch weights
pth_path = r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training\ratchet_mobilenet_v3.pth'
torch.save(model.state_dict(), pth_path)
print(f'PyTorch Ratchet weights saved to: {pth_path}')

# Export ONNX model
onnx_path = os.path.join(MODELS_DIR, 'ratchet_mobilenet_v3.onnx')
dummy_input = torch.randn(1, 3, 224, 224, device='cpu')
model = model.to('cpu').eval()

print('Exporting Ratchet Model to ONNX...')
torch.onnx.export(
    model,
    dummy_input,
    onnx_path,
    export_params=True,
    opset_version=17,
    input_names=['input'],
    output_names=['logits'],
    dynamic_axes={'input': {0: 'batch'}, 'logits': {0: 'batch'}},
    dynamo=False
)

m = onnx.load(onnx_path, load_external_data=True)
onnx.save_model(m, onnx_path, save_as_external_data=False)

data_file = onnx_path + '.data'
if os.path.exists(data_file):
    os.remove(data_file)

size_mb = os.path.getsize(onnx_path) / (1024 * 1024)
print(f'SUCCESS: Ratchet ONNX model exported to {onnx_path} ({size_mb:.2f} MB)')
