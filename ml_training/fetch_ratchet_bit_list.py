import urllib.request
import json
import re

url = "https://beyblade.fandom.com/api.php?action=parse&page=List_of_Basic_Line_parts&format=json&prop=wikitext"
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        wikitext = data['parse']['wikitext']['*']

    # Find Ratchets
    ratchets = re.findall(r'\[\[Ratchet\s*-\s*([^\]|]+)', wikitext)
    bits = re.findall(r'\[\[Bit\s*-\s*([^\]|]+)', wikitext)
    
    print(f"Found {len(ratchets)} Ratchets on Basic Line:")
    print(sorted(list(set(ratchets))))
    print(f"\nFound {len(bits)} Bits on Basic Line:")
    print(sorted(list(set(bits))))
except Exception as e:
    print("Error:", e)
