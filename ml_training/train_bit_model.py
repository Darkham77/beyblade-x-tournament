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
print(f'Training Bit Model on: {DEVICE}')

BIT_DIR = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\public\images\parts\bits'
MODELS_DIR = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\public\models'

with open(os.path.join(MODELS_DIR, 'bit_classes.json'), 'r', encoding='utf-8') as f:
    BIT_CLASSES = json.load(f)

class_to_idx = {name: i for i, name in enumerate(BIT_CLASSES)}
num_classes = len(BIT_CLASSES)
print(f'Total Bit Classes: {num_classes}')

NAME_MAPPING = {
    'flat': 'F',
    'low_flat': 'LF',
    'gear_flat': 'GF',
    'accel': 'A',
    'rush': 'R',
    'quake': 'Q',
    'cyclone': 'C',
    'level': 'L',
    'low_rush': 'LR',
    'rubber_accel': 'RA',
    'ball': 'B',
    'disc_ball': 'DB',
    'orb': 'O',
    'glide': 'G',
    'free_ball': 'FB',
    'low_orb': 'LO',
    'wall_ball': 'WB',
    'needle': 'N',
    'high_needle': 'HN',
    'gear_needle': 'GN',
    'hexa': 'H',
    'metal_needle': 'MN',
    'bound_spike': 'BS',
    'dot': 'D',
    'wedge': 'W',
    'taper': 'T',
    'high_taper': 'HT',
    'point': 'P',
    'gear_point': 'GP',
    'unite': 'U',
    'elevate': 'E',
    'trans_point': 'TP',
    'vortex': 'V',
}

samples = []
for f in os.listdir(BIT_DIR):
    if not f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        continue
    base = os.path.splitext(f)[0].replace('bit_', '').lower()
    code = NAME_MAPPING.get(base)
    if code and code in class_to_idx:
        samples.append((os.path.join(BIT_DIR, f), class_to_idx[code]))

print(f'Found {len(samples)} base Bit sample images.')

def pad_to_square(img: Image.Image) -> Image.Image:
    w, h = img.size
    max_d = max(w, h)
    side = int(max_d * 1.05)
    new_img = Image.new('RGB', (side, side), (0, 0, 0))
    if img.mode == 'RGBA':
        new_img.paste(img, ((side - w) // 2, (side - h) // 2), mask=img.split()[3])
    else:
        new_img.paste(img.convert('RGB'), ((side - w) // 2, (side - h) // 2))
    return new_img.resize((224, 224), Image.Resampling.BILINEAR)

train_transforms = T.Compose([
    T.RandomHorizontalFlip(p=0.5),
    T.RandomRotation(degrees=16, interpolation=T.InterpolationMode.BILINEAR),
    T.RandomAffine(degrees=0, translate=(0.04, 0.04), scale=(0.94, 1.06)),
    augmentations.SpecularFlashGlare(p=0.30),
    T.ColorJitter(brightness=0.35, contrast=0.35, saturation=0.35, hue=0.35),
    T.RandomGrayscale(p=0.15),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

class AugmentedBitDataset(Dataset):
    def __init__(self, samples, transform, samples_per_epoch=1200):
        self.samples = samples
        self.transform = transform
        self.samples_per_epoch = samples_per_epoch

    def __len__(self):
        return self.samples_per_epoch

    def __getitem__(self, idx):
        path, cls_idx = random.choice(self.samples)
        try:
            img = Image.open(path)
            padded = pad_to_square(img)
            return self.transform(padded), cls_idx
        except Exception:
            path, cls_idx = self.samples[0]
            img = Image.open(path)
            padded = pad_to_square(img)
            return self.transform(padded), cls_idx

train_ds = AugmentedBitDataset(samples, train_transforms, samples_per_epoch=1200)
train_loader = DataLoader(train_ds, batch_size=32, shuffle=True)

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

criterion = nn.CrossEntropyLoss(label_smoothing=0.04)
optimizer = torch.optim.AdamW([
    {'params': model.features[3:].parameters(), 'lr': 3e-4},
    {'params': model.classifier.parameters(), 'lr': 1.2e-3},
], weight_decay=1e-4)

epochs = 12
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

print(f'\nStarting Bit Model Training ({epochs} epochs)...')
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

pth_path = r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training\bit_mobilenet_v3.pth'
torch.save(model.state_dict(), pth_path)
print(f'PyTorch Bit weights saved to: {pth_path}')

onnx_path = os.path.join(MODELS_DIR, 'bit_mobilenet_v3.onnx')
dummy_input = torch.randn(1, 3, 224, 224, device='cpu')
model = model.to('cpu').eval()

print('Exporting Bit Model to ONNX...')
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
print(f'Exported Standalone ONNX: {onnx_path} ({size_mb:.2f} MB)')
