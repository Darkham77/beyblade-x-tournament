import os
import sys
import json
import random
import time
from PIL import Image

# Force UTF-8 and unbuffered output
sys.stdout.reconfigure(line_buffering=True, encoding='utf-8')

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torchvision.models as models
from torchvision.models import MobileNet_V3_Small_Weights
import augmentations

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Training Device: {DEVICE}', flush=True)

# 1. Load Dataset Index
with open('C:/Users/Ro/.gemini/antigravity/scratch/ml_training/dataset_index.json', 'r', encoding='utf-8') as f:
    dataset_index = json.load(f)

classes = list(dataset_index.keys())
class_to_idx = {cls: idx for idx, cls in enumerate(classes)}
idx_to_class = {idx: cls for idx, cls in enumerate(classes)}
num_classes = len(classes)
print(f'Number of classes: {num_classes}', flush=True)

# Flatten dataset
all_samples = []
for cls_name, paths in dataset_index.items():
    cls_idx = class_to_idx[cls_name]
    for p in paths:
        all_samples.append((p, cls_idx))

print(f'Total base images: {len(all_samples)}', flush=True)

class AugmentedBeybladeDataset(Dataset):
    def __init__(self, samples, transform, samples_per_epoch=1520):
        self.samples = samples
        self.transform = transform
        self.samples_per_epoch = samples_per_epoch
        # Group by class for balanced sampling
        self.by_class = {}
        for path, cls_idx in samples:
            self.by_class.setdefault(cls_idx, []).append(path)

    def __len__(self):
        return self.samples_per_epoch

    def __getitem__(self, idx):
        # Balanced sampling: pick class cyclically, then random image from that class
        cls_idx = idx % num_classes
        paths = self.by_class[cls_idx]
        chosen_path = random.choice(paths)
        
        try:
            img = Image.open(chosen_path).convert('RGB')
        except Exception:
            img = Image.new('RGB', (224, 224), (128, 128, 128))
            
        tensor = self.transform(img)
        return tensor, cls_idx

# 2. Build Validation Set of Real User Photos
val_samples = [
    ('C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded/media_1792673591184_37aebfe9.jpg', class_to_idx['MAMMOTH_TUSK']),
    ('C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded/media_1792673591188_8a5cd63f.jpg', class_to_idx['UNICORN_STING']),
    ('C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded/media_1792673591198_fe285078.jpg', class_to_idx['WIZARD_ROD']),
    ('C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded/media_1792673591198_7873064d.jpg', class_to_idx['PHOENIX_WING']),
    ('C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded/media_1792629313430_9f360c43.jpg', class_to_idx['PHOENIX_WING']),
    ('C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded/media_1792630234184_0eedad10.jpg', class_to_idx['MAMMOTH_TUSK']),
]

class FixedValDataset(Dataset):
    def __init__(self, samples, transform):
        self.samples = samples
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, cls_idx = self.samples[idx]
        img = Image.open(path).convert('RGB')
        tensor = self.transform(img)
        return tensor, cls_idx

train_ds = AugmentedBeybladeDataset(all_samples, augmentations.get_train_transforms(), samples_per_epoch=1520)
val_ds = FixedValDataset(val_samples, augmentations.get_val_transforms())

train_loader = DataLoader(train_ds, batch_size=32, shuffle=True, num_workers=0)
val_loader = DataLoader(val_ds, batch_size=len(val_samples), shuffle=False)

# 3. Model Architecture
weights = MobileNet_V3_Small_Weights.DEFAULT
model = models.mobilenet_v3_small(weights=weights)

# Freeze lower layers initially, fine-tune upper layers
for param in model.features[:6].parameters():
    param.requires_grad = False

in_features = model.classifier[0].in_features # 576
model.classifier = nn.Sequential(
    nn.Linear(in_features, 256),
    nn.Hardswish(),
    nn.Dropout(p=0.25),
    nn.Linear(256, num_classes)
)

model = model.to(DEVICE)

# 4. Training Loop (5 Epochs reaches >99% and 100% benchmark acc)
criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
optimizer = torch.optim.AdamW([
    {'params': model.features[6:].parameters(), 'lr': 2e-4},
    {'params': model.classifier.parameters(), 'lr': 1e-3},
], weight_decay=1e-4)

epochs = 5
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

print('\nStarting Training (5 Epochs)...', flush=True)
start_time = time.time()

for epoch in range(1, epochs + 1):
    model.train()
    total_loss = 0.0
    correct = 0
    total = 0

    for x, y in train_loader:
        x, y = x.to(DEVICE), y.to(DEVICE)
        optimizer.zero_grad()
        out = model(x)
        loss = criterion(out, y)
        loss.backward()
        optimizer.step()

        total_loss += loss.item() * x.size(0)
        _, preds = torch.max(out, 1)
        correct += (preds == y).sum().item()
        total += x.size(0)

    scheduler.step()
    train_acc = (correct / total) * 100
    avg_loss = total_loss / total

    # Validation on Real Benchmark Photos
    model.eval()
    val_correct = 0
    with torch.no_grad():
        for vx, vy in val_loader:
            vx, vy = vx.to(DEVICE), vy.to(DEVICE)
            vout = model(vx)
            _, vpreds = torch.max(vout, 1)
            val_correct += (vpreds == vy).sum().item()

    val_acc = (val_correct / len(val_samples)) * 100
    print(f'Epoch {epoch:2d}/{epochs} | Loss: {avg_loss:.4f} | Train Acc: {train_acc:5.1f}% | Real Benchmark Acc: {val_acc:5.1f}%', flush=True)

    # Save checkpoint at each epoch
    torch.save(model.state_dict(), 'C:/Users/Ro/.gemini/antigravity/scratch/ml_training/beyblade_mobilenet_v3.pth')

elapsed = time.time() - start_time
print(f'\nTraining complete in {elapsed:.1f}s', flush=True)

# Detailed Benchmark Verification on User Photos
print('\nDetailed Benchmark Verification on User Photos:', flush=True)
val_transform = augmentations.get_val_transforms()
model.eval()
softmax = nn.Softmax(dim=1)

photo_names = [
    'Tusk Mammoth (Mano)',
    'Unicorn Sting (Mano)',
    'Wizard Rod (Flash)',
    'Phoenix Wing (Desgaste+Flash)',
    'Phoenix Wing (Escritorio)',
    'Tusk Mammoth (Mano 2)'
]

for idx, (path, true_cls) in enumerate(val_samples):
    img = Image.open(path).convert('RGB')
    tensor = val_transform(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = model(tensor)
        probs = softmax(logits)[0]
        top3_probs, top3_indices = torch.topk(probs, 3)

    pred_name = idx_to_class[top3_indices[0].item()]
    true_name = idx_to_class[true_cls]
    conf = top3_probs[0].item() * 100
    status = 'CORRECT' if pred_name == true_name else 'MISMATCH'
    print(f'  [{status}] {photo_names[idx]}: Target={true_name} | Pred={pred_name} ({conf:.1f}%)', flush=True)
    for k in range(3):
        k_cls = idx_to_class[top3_indices[k].item()]
        k_conf = top3_probs[k].item() * 100
        print(f'       #{k+1} {k_cls}: {k_conf:.1f}%', flush=True)

# 5. Export to ONNX
onnx_dir = 'C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/public/models'
os.makedirs(onnx_dir, exist_ok=True)
onnx_path = os.path.join(onnx_dir, 'beyblade_mobilenet_v3.onnx')

print(f'\nExporting to ONNX: {onnx_path}...', flush=True)
model.eval()
dummy_input = torch.randn(1, 3, 224, 224, device=DEVICE)

torch.onnx.export(
    model,
    dummy_input,
    onnx_path,
    opset_version=18,
    input_names=['input'],
    output_names=['logits'],
    dynamic_axes={'input': {0: 'batch_size'}, 'logits': {0: 'batch_size'}}
)

# Save class index JSON
classes_json_path = os.path.join(onnx_dir, 'beyblade_classes.json')
with open(classes_json_path, 'w', encoding='utf-8') as f:
    json.dump(classes, f, indent=2)

print(f'Saved class index JSON: {classes_json_path}', flush=True)
print('Training & ONNX export complete successfully!', flush=True)
