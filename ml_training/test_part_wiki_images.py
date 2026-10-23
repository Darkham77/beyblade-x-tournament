import urllib.request
import json
import re

headers = {'User-Agent': 'Mozilla/5.0'}

def get_images_for_title(title):
    url = f"https://beyblade.fandom.com/api.php?action=query&titles={urllib.parse.quote(title)}&prop=images&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                return [img['title'] for img in pdata.get('images', [])]
    except Exception as e:
        return []
    return []

# Test some ratchets and bits
for test_r in ['Ratchet - 3-60', 'Ratchet - 5-60', 'Ratchet - 9-60', 'Ratchet - 4-60', 'Ratchet - 0-80', 'Bit - Flat', 'Bit - Ball', 'Bit - Needle', 'Bit - Taper']:
    imgs = get_images_for_title(test_r)
    print(f"{test_r}: {len(imgs)} images -> {imgs[:2]}")
