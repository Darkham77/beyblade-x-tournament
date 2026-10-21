"""
Descargador y Verificador de Empaques y Cajas Oficiales de Beyblade X
Fuente: Beyblade Fandom Gallery
"""

import os
import json
import urllib.request
import urllib.parse
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://beyblade.fandom.com/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

TARGET_BOXES = [
    ('BX-01', 'DranSword 3-60F Box.jpeg', 'bx_01_box.jpg'),
    ('BX-02', 'HellsScythe 4-60T Box.jpeg', 'bx_02_box.jpg'),
    ('BX-03', 'WizardArrow 4-80B Box.jpeg', 'bx_03_box.jpg'),
    ('BX-04', 'KnightShield 3-80N Box.jpeg', 'bx_04_box.jpg'),
    ('BX-07', 'Start Dash Set Box.jpeg', 'bx_07_box.jpg'),
    ('BX-08', '3on3 Deck Set Box.jpeg', 'bx_08_box.jpg'),
    ('BX-13', 'KnightLance 4-80HN Box.jpeg', 'bx_13_box.jpg'),
    ('BX-14', 'Random Booster Vol. 1 Box.jpeg', 'bx_14_box.jpg'),
    ('BX-15', 'LeonClaw 5-60P Box.jpeg', 'bx_15_box.jpg'),
    ('BX-16', 'ViperTail 5-80O Box.jpeg', 'bx_16_box.jpg'),
    ('BX-17', 'Battle Entry Set Box.jpeg', 'bx_17_box.jpg'),
    ('BX-20', 'DranDagger Deck Set Box.jpeg', 'bx_20_box.jpg'),
    ('BX-21', 'HellsChain Deck Set Box.jpeg', 'bx_21_box.jpg'),
    ('BX-23', 'PhoenixWing 9-60GF Box.jpeg', 'bx_23_box.jpg'),
    ('UX-01', 'DranBuster 1-60A Box.jpeg', 'ux_01_box.jpg'),
    ('UX-02', 'HellsHammer 3-70H Box.jpeg', 'ux_02_box.jpg'),
    ('UX-03', 'WizardRod 5-70DB Box.jpeg', 'ux_03_box.jpg'),
    ('UX-04', 'Battle Entry Set UX Box.jpeg', 'ux_04_box.jpg'),
    ('HAS-ST-01', 'Sword Dran 3-60F Box.jpeg', 'has_st_01_box.jpg'),
    ('HAS-ST-02', 'Scythe Incendio 4-60T Box.jpeg', 'has_st_02_box.jpg'),
]

def get_direct_url(file_title):
    url = f"https://beyblade.fandom.com/api.php?action=query&titles=File:{urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for _, p in data.get('query', {}).get('pages', {}).items():
                if 'imageinfo' in p and p['imageinfo']:
                    raw = p['imageinfo'][0]['url']
                    return raw.split('?')[0]
    except Exception as e:
        print(f"Error consultando {file_title}: {e}")
    return None

def download_file(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        content = resp.read()
        if len(content) > 1000:
            with open(dest, 'wb') as f:
                f.write(content)
            return True
    return False

def main():
    dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'public', 'images', 'products'))
    print(f"Descargando empaques de productos oficiales hacia: {dest_dir}\n")

    for sku, wiki_file, local_name in TARGET_BOXES:
        dest = os.path.join(dest_dir, local_name)
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            print(f"  [YA EXISTE] {sku} -> {local_name}")
            continue

        url = get_direct_url(wiki_file)
        if url:
            try:
                ok = download_file(url, dest)
                if ok:
                    kb = os.path.getsize(dest) / 1024
                    print(f"  [OK DESCARGADO] {sku} ({wiki_file}) -> {kb:.1f} KB")
                else:
                    print(f"  [VACIO] {sku}")
            except Exception as e:
                print(f"  [FALLO] {sku}: {e}")
        else:
            print(f"  [NO ENCONTRADO] {sku} ({wiki_file})")

    print("\nProceso de empaques completado.")

if __name__ == '__main__':
    main()
