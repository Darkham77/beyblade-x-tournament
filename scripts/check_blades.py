with open(r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\src\data\catalog.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
blades_to_check = ['Driger Slash', 'Dragoon Storm', 'Lightning L-Drago', 'Bite Croc', 'Steel Samurai', 'Mammoth Tusk', 'Dranzer Spiral']
for b in blades_to_check:
    m = re.search(r'name:\s*[\'"]' + re.escape(b) + r'[\'"].*?image_url:\s*([^\,\n\}]+)', text, re.DOTALL)
    if m:
        print(f'{b} -> {m.group(1).strip()}')
    else:
        print(f'{b} -> NOT FOUND')
