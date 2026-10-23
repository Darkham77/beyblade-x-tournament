import json

MODELS_DIR = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\public\models'

ratchet_classes = [
    '1-60', '1-70', '1-80',
    '2-60', '2-70', '2-80',
    '3-60', '3-70', '3-80', '3-85',
    '4-55', '4-60', '4-70', '4-80',
    '5-60', '5-70', '5-80',
    '6-60', '6-80', 'S6-60',
    '7-60', '7-70', '7-80',
    '8-80',
    '9-60', '9-70', '9-80',
    '0-60', '0-70', '0-80'
]

bit_classes = [
    'F', 'LF', 'GF', 'A', 'R', 'Q', 'C', 'L', 'LR', 'RA',
    'B', 'DB', 'O', 'G', 'FB', 'LO', 'WB',
    'N', 'HN', 'GN', 'H', 'MN', 'BS', 'D', 'W',
    'T', 'HT', 'P', 'GP', 'U', 'E', 'TP', 'V'
]

with open(f'{MODELS_DIR}/ratchet_classes.json', 'w', encoding='utf-8') as f:
    json.dump(ratchet_classes, f, indent=2)

with open(f'{MODELS_DIR}/bit_classes.json', 'w', encoding='utf-8') as f:
    json.dump(bit_classes, f, indent=2)

print(f"Saved {len(ratchet_classes)} ratchet classes and {len(bit_classes)} bit classes.")
