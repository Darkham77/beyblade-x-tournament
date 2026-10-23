import re

with open('C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/src/data/catalog.ts', 'r', encoding='utf-8') as f:
    content = f.read()

blades = re.findall(r"code_name:\s*'([A-Z_0-9]+)',\s*display_name:\s*'([^']+)'", content)
print(f'Total blades: {len(blades)}')

for code, name in blades:
    pos = content.find(f"code_name: '{code}'")
    if pos != -1:
        chunk = content[pos:pos+1600]
        if 'STANDARD_RAW_METAL' in chunk:
            colors = re.findall(r"color_primary_hex:\s*'([^']+)'", chunk)
            sec_colors = re.findall(r"color_secondary_hex:\s*'([^']+)'", chunk)
            vnames = re.findall(r"variant_name:\s*'([^']+)'", chunk)
            print(f'{code:18s} ({name:18s}) | prim={colors} | sec={sec_colors}')
