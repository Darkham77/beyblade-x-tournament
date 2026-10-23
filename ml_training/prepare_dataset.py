import os
import glob
import json

ROOT = 'C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/public/images'
USER_DIR = 'C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded'
MODELS_DIR = 'C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/public/models'

# Load canonical 57 classes from beyblade_classes.json
with open(os.path.join(MODELS_DIR, 'beyblade_classes.json'), 'r', encoding='utf-8') as f:
    BLADE_CLASSES = json.load(f)

print(f"Loaded {len(BLADE_CLASSES)} canonical Blade classes.")

# Map lowercase folder/file names to class name
NAME_TO_CLASS = {cls_name.lower(): cls_name for cls_name in BLADE_CLASSES}

dataset = {cls_name: [] for cls_name in BLADE_CLASSES}

# 1. Official studio renders in parts/blades/
parts_dir = os.path.join(ROOT, 'parts/blades')
if os.path.exists(parts_dir):
    for f in os.listdir(parts_dir):
        base = os.path.splitext(f)[0].lower()
        if base in NAME_TO_CLASS:
            cls_name = NAME_TO_CLASS[base]
            dataset[cls_name].append(os.path.join(parts_dir, f))

# 2. Gallery photos and recolors in gallery/blades/
gallery_dir = os.path.join(ROOT, 'gallery/blades')
if os.path.exists(gallery_dir):
    for folder in os.listdir(gallery_dir):
        folder_path = os.path.join(gallery_dir, folder)
        folder_lower = folder.lower()
        if os.path.isdir(folder_path) and folder_lower in NAME_TO_CLASS:
            cls_name = NAME_TO_CLASS[folder_lower]
            for f in os.listdir(folder_path):
                if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    dataset[cls_name].append(os.path.join(folder_path, f))

# 3. User uploaded real photos explicitly mapped (Corrected: Dran Sword Red is DRAN_SWORD!)
user_photos_map = [
    ('MAMMOTH_TUSK', os.path.join(USER_DIR, 'media_1792673591184_37aebfe9.jpg')),
    ('MAMMOTH_TUSK', os.path.join(USER_DIR, 'media_1792630234184_0eedad10.jpg')),
    ('UNICORN_STING', os.path.join(USER_DIR, 'media_1792673591188_8a5cd63f.jpg')),
    ('WIZARD_ROD', os.path.join(USER_DIR, 'media_1792673591198_fe285078.jpg')),
    ('PHOENIX_WING', os.path.join(USER_DIR, 'media_1792673591198_7873064d.jpg')),
    ('PHOENIX_WING', os.path.join(USER_DIR, 'media_1792629313430_9f360c43.jpg')),
]

for cls_name, path in user_photos_map:
    if os.path.exists(path) and path not in dataset[cls_name]:
        dataset[cls_name].append(path)

# Verify every single class has at least 1 image
missing = [c for c in BLADE_CLASSES if len(dataset[c]) == 0]
if missing:
    print(f"WARNING: The following classes have NO images: {missing}")
else:
    print(f"SUCCESS: All {len(BLADE_CLASSES)} classes have reference images!")

total_images = sum(len(v) for v in dataset.values())
print(f'Total classes: {len(dataset)}, Total images: {total_images}')

# Save dataset_index.json
out_json = r'C:\Users\Ro\.gemini\antigravity\scratch\ml_training\dataset_index.json'
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(dataset, f, indent=2)

print(f'Saved updated dataset index to {out_json}')
