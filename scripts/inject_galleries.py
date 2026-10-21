import os
import json

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CATALOG_PATH = os.path.join(PROJECT_ROOT, 'app', 'src', 'data', 'catalog.ts')
MANIFEST_PATH = os.path.join(PROJECT_ROOT, 'scripts', 'gallery_manifest.json')

with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
    catalog_text = f.read()

# Build TypeScript object string
ts_lines = ["export const BLADE_GALLERY_MAP: Record<string, { url: string; label: string; tag: 'STUDIO' | 'REAL' | 'RECOLOR' | 'ANGLED' | 'COMMUNITY' }[]> = {"]
for blade_code, photos in manifest.items():
    if not photos:
        continue
    ts_lines.append(f"  '{blade_code}': [")
    for p in photos:
        ts_lines.append(f"    {{ url: '{p['url']}', label: '{p['label']}', tag: '{p['tag']}' }},")
    ts_lines.append("  ],")
ts_lines.append("};\n")

gallery_map_ts = "\n".join(ts_lines)

target_hook = "CATALOG_BLADES.forEach((b) => {"
new_loop = """CATALOG_BLADES.forEach((b) => {
  if (BLADE_IMAGE_MAP[b.code_name]) {
    b.image_url = BLADE_IMAGE_MAP[b.code_name];
    if (b.variants[0]) {
      b.variants[0].image_url = BLADE_IMAGE_MAP[b.code_name];
    }
  }
  const studioImg = b.image_url ? [{ url: b.image_url, label: 'Render Oficial de Estudio', tag: 'STUDIO' as const }] : [];
  const extraImgs = BLADE_GALLERY_MAP[b.code_name] || [];
  b.gallery_images = [...studioImg, ...extraImgs];
});"""

old_loop_pattern = """CATALOG_BLADES.forEach((b) => {
  if (BLADE_IMAGE_MAP[b.code_name]) {
    b.image_url = BLADE_IMAGE_MAP[b.code_name];
    if (b.variants[0]) {
      b.variants[0].image_url = BLADE_IMAGE_MAP[b.code_name];
    }
  }
});"""

if old_loop_pattern in catalog_text:
    replacement = gallery_map_ts + "\n" + new_loop
    new_catalog_text = catalog_text.replace(old_loop_pattern, replacement, 1)
    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        f.write(new_catalog_text)
    print("Catalog updated successfully with BLADE_GALLERY_MAP!")
else:
    print("Could not find old loop pattern in catalog.ts")
