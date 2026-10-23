import re
import json

path = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\src\data\catalog.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

pos_r_start = text.find('export const CATALOG_RATCHETS: Ratchet[] = [')
pos_b_start = text.find('export const CATALOG_BITS: Bit[] = [')
pos_p_start = text.find('export const CATALOG_PRODUCTS: Product[] = [')

r_text = text[pos_r_start:pos_b_start]
b_text = text[pos_b_start:pos_p_start]

ratchet_codes = re.findall(r"code_name:\s*'([^']+)'", r_text)
bit_codes = re.findall(r"code_name:\s*'([^']+)'", b_text)

print(f"Total Ratchets in Catalog: {len(ratchet_codes)}")
print("Ratchets:", ratchet_codes)
print(f"\nTotal Bits in Catalog: {len(bit_codes)}")
print("Bits:", bit_codes)
