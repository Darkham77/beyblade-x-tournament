import os
import sys
import json
import torch
import torch.nn as nn
from torchvision import models
import onnx

os.environ['PYTHONIOENCODING'] = 'utf-8'

MODELS_DIR = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\public\models'
PTH_PATH = r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training\beyblade_mobilenet_v3.pth'
ONNX_PATH = os.path.join(MODELS_DIR, 'beyblade_mobilenet_v3.onnx')

with open(os.path.join(MODELS_DIR, 'beyblade_classes.json'), 'r', encoding='utf-8') as f:
    BLADE_CLASSES = json.load(f)

num_classes = len(BLADE_CLASSES)
print(f"Exporting model for {num_classes} classes...")

model = models.mobilenet_v3_small(weights=None)
in_features = model.classifier[0].in_features
model.classifier = nn.Sequential(
    nn.Linear(in_features, 256),
    nn.Hardswish(),
    nn.Dropout(p=0.25),
    nn.Linear(256, num_classes)
)

state_dict = torch.load(PTH_PATH, map_location='cpu')
model.load_state_dict(state_dict)
model.eval()

dummy_input = torch.randn(1, 3, 224, 224)

print("Exporting PyTorch to ONNX...")
# Use legacy TorchScript-based exporter or set dynamo=False to avoid \u2705 print in cp1252
torch.onnx.export(
    model,
    dummy_input,
    ONNX_PATH,
    export_params=True,
    opset_version=17,
    input_names=['input'],
    output_names=['logits'],
    dynamic_axes={'input': {0: 'batch'}, 'logits': {0: 'batch'}},
    dynamo=False
)

print("Consolidating ONNX model to single self-contained file...")
m = onnx.load(ONNX_PATH, load_external_data=True)
onnx.save_model(m, ONNX_PATH, save_as_external_data=False)

data_file = ONNX_PATH + '.data'
if os.path.exists(data_file):
    os.remove(data_file)

size_mb = os.path.getsize(ONNX_PATH) / (1024 * 1024)
print(f"SUCCESS: ONNX model exported to {ONNX_PATH} ({size_mb:.2f} MB)")
