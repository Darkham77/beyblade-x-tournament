import urllib.request
import json
import re

headers = {'User-Agent': 'Mozilla/5.0'}

for page in ['List_of_Unique_Line_parts', 'List_of_Custom_Line_parts']:
    url = f"https://beyblade.fandom.com/api.php?action=parse&page={page}&format=json&prop=wikitext"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            wikitext = data.get('parse', {}).get('wikitext', {}).get('*', '')

        ratchets = re.findall(r'\[\[Ratchet\s*-\s*([^\]|]+)', wikitext)
        bits = re.findall(r'\[\[Bit\s*-\s*([^\]|]+)', wikitext)
        
        print(f"=== {page} ===")
        print(f"Ratchets ({len(ratchets)}):", sorted(list(set(ratchets))))
        print(f"Bits ({len(bits)}):", sorted(list(set(bits))))
    except Exception as e:
        print(f"Error on {page}:", e)
