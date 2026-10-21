import os
import re

app_public = os.path.abspath('app/public')
with open('app/src/data/catalog.ts', 'r', encoding='utf-8') as f:
    code = f.read()

ratchet_codes = re.findall(r"code_name:\s*'([0-9]-[0-9]+)',\s*display_name:", code)
print(f"Total ratchets found in catalog.ts: {len(ratchet_codes)}")

missing = 0
for c in ratchet_codes:
    filename = f"ratchet_{c.lower()}.png"
    p = os.path.join(app_public, "images", "parts", "ratchets", filename)
    if not os.path.exists(p):
        print(f"MISSING RATCHET: {c} -> {p}")
        missing += 1

if missing == 0:
    print(f"--> 100% SUCCESS: All {len(ratchet_codes)} ratchets exist on disk!")
