import os
import re

catalog_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'src', 'data', 'catalog.ts'))
public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'public'))

with open(catalog_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Blades
blades_section = text.split("export const CATALOG_RATCHETS")[0]
blade_matches = re.findall(r"code_name:\s*'([^']+)',\s*display_name:\s*'([^']+)'", blades_section)

# 2. Ratchets
ratchets_section = text.split("export const CATALOG_RATCHETS")[1].split("export const CATALOG_BITS")[0]
ratchet_matches = re.findall(r"code_name:\s*'([^']+)',\s*display_name:\s*'([^']+)'", ratchets_section)

# 3. Bits
bits_section = text.split("export const CATALOG_BITS")[1].split("export const CATALOG_PRODUCTS")[0]
bit_matches = re.findall(r"code_name:\s*'([^']+)',\s*display_name:\s*'([^']+)'", bits_section)

# 4. Products
prod_section = text.split("export const CATALOG_PRODUCTS")[1].split("const BLADE_IMAGE_MAP")[0]
prod_matches = re.findall(r"sku_code:\s*'([^']+)',[\s\S]*?official_title:\s*'([^']+)'", prod_section)

def check_group(group_name, items):
    print(f"\n=== AUDITORIA: {group_name.upper()} ({len(items)} items) ===")
    missing = 0
    for code, name in items:
        if group_name == 'RATCHETS':
            rel_path = f"images/parts/ratchets/ratchet_{code.lower()}.png"
        elif group_name == 'PRODUCTS':
            map_match = re.search(rf"'{code}':\s*'([^']+)'", text)
            rel_path = map_match.group(1).lstrip('/') if map_match else None
        else:
            map_match = re.search(rf"'{code}':\s*'([^']+)'", text)
            rel_path = map_match.group(1).lstrip('/') if map_match else None

        if not rel_path:
            print(f"  [SIN MAPEAR] {code} ({name})")
            missing += 1
            continue

        disk_path = os.path.join(public_dir, rel_path.replace('/', os.sep))
        if not os.path.exists(disk_path):
            print(f"  [ARCHIVO NO EXISTE] {code} ({name}) -> {rel_path}")
            missing += 1
        else:
            kb = os.path.getsize(disk_path) / 1024
            if kb < 1:
                print(f"  [VACIO] {code} ({name})")
                missing += 1
    if missing == 0:
        print(f"  --> 100% PERFECTO: 0 faltantes.")
    return missing

m1 = check_group('BLADES', blade_matches)
m2 = check_group('RATCHETS', ratchet_matches)
m3 = check_group('BITS', bit_matches)
m4 = check_group('PRODUCTS', prod_matches)

print(f"\n==========================================")
print(f"RESUMEN GLOBAL:")
print(f"Blades faltantes: {m1}")
print(f"Ratchets faltantes: {m2}")
print(f"Bits faltantes: {m3}")
print(f"Productos faltantes: {m4}")
print(f"==========================================")
