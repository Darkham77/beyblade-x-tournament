"""
Descargador de los elementos faltantes identificados en la auditoría:
- 7 Blades (Dranzer Spiral, Driger Slash, Dragoon Storm, Lightning L-Drago, Bite Croc, Steel Samurai, Mammoth Tusk)
- 26 Productos y Sets
"""

import os
import sys
import json
import urllib.request
import urllib.parse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://beyblade.fandom.com/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

BLADES_TODO = [
    ('DRANZER_SPIRAL', 'Dranzer_Spiral_3-80T_(F9584).jpeg', 'dranzer_spiral.png'),
    ('DRIGER_SLASH', 'BladeDrigerSlash.png', 'driger_slash.png'),
    ('DRAGOON_STORM', 'Dragoon_Storm_4-60RA.jpeg', 'dragoon_storm.png'),
    ('LIGHTNING_L_DRAGO', 'BladeLightningL-Drago(UpperType).png', 'lightning_l_drago.png'),
    ('BITE_CROC', 'Bite Croc 3-60LF Infobox.png', 'bite_croc.png'),
    ('STEEL_SAMURAI', 'Steel_Samurai_4-80T.jpeg', 'steel_samurai.png'),
    ('MAMMOTH_TUSK', 'MammothTusk 2-80E.png', 'mammoth_tusk.png'),
]

PRODUCTS_TODO = [
    ('BX-14', 'X Random Booster Vol. 1 Box.jpeg', 'bx_14_box.jpg'),
    ('BX-16', 'ViperTail_(BX-35).png', 'bx_16_box.jpg'),
    ('BX-19', 'RhinoHorn_3-80S_Box.jpeg', 'bx_19_box.jpg'),
    ('BX-24', 'X Random Booster Vol. 2 Box.jpeg', 'bx_24_box.jpg'),
    ('BX-26', 'UnicornSting_5-60GP_Box.jpeg', 'bx_26_box.jpg'),
    ('BX-27', 'SphinxCowl_1-80GF.jpeg', 'bx_27_box.jpg'),
    ('BX-31', 'X Random Booster Vol. 3 Box.jpeg', 'bx_31_box.jpg'),
    ('BX-33', 'WeissTiger_3-60U.png', 'bx_33_box.jpg'),
    ('BX-34', 'CobaltDragoon_(BX-00)_(Metal_Coat_White_J.League_Ver.).png', 'bx_34_box.jpg'),
    ('BX-35', 'X Random Booster Vol. 4 Box.jpeg', 'bx_35_box.jpg'),
    ('BX-36', 'WhaleWave 5-80E.png', 'bx_36_box.jpg'),
    ('UX-04', 'Battle Entry Set UX Box.jpeg', 'ux_04_box.jpg'),
    ('UX-06', 'LeonCrest_7-60GN_Box.jpeg', 'ux_06_box.jpg'),
    ('UX-07', 'PhoenixRudder_Deck_Set_Box.jpeg', 'ux_07_box.jpg'),
    ('UX-08', 'SilverWolf_(UX-21).png', 'ux_08_box.jpg'),
    ('UX-09', 'SamuraiSaber 2-70L.png', 'ux_09_box.jpg'),
    ('UX-10', 'KnightMail_3-85BS.jpeg', 'ux_10_box.jpg'),
    ('UX-11', 'ImpactDrake_9-60LR_Box.jpeg', 'ux_11_box.jpg'),
    ('HAS-ST-03', 'Arrow Wizard 4-80B Box.jpeg', 'has_st_03_box.jpg'),
    ('HAS-ST-04', 'Helm Knight 3-80N Box.jpeg', 'has_st_04_box.jpg'),
    ('HAS-ST-05', 'Keel Shark 3-60LF Box.jpeg', 'has_st_05_box.jpg'),
    ('HAS-ST-06', 'Claw Leon 5-60P Box.jpeg', 'has_st_06_box.jpg'),
    ('HAS-ST-10', 'Soar_Phoenix_5-80H_Box.jpeg', 'has_st_10_box.jpg'),
    ('HAS-DP-01', 'Bite Croc and Sting Unicorn Box.jpeg', 'has_dp_01_box.jpg'),
    ('HAS-DP-02', 'Steel_Samurai_4-80T_Box.jpeg', 'has_dp_02_box.jpg'),
    ('HAS-DP-03', 'Mammoth Tusk and Sword Dran Box.jpeg', 'has_dp_03_box.jpg'),
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
        print(f"Error {file_title}: {e}")
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
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'public', 'images'))
    
    print("=== DESCARGANDO 7 BLADES FALTANTES ===")
    blades_dir = os.path.join(base_dir, 'parts', 'blades')
    for code, wiki_file, local_file in BLADES_TODO:
        dest = os.path.join(blades_dir, local_file)
        url = get_direct_url(wiki_file)
        if url:
            ok = download_file(url, dest)
            if ok:
                print(f"  [OK] Blade {code} -> {local_file}")
            else:
                print(f"  [ERROR VACIO] {code}")
        else:
            print(f"  [NO URL] {code} ({wiki_file})")

    print("\n=== DESCARGANDO 26 PRODUCTOS FALTANTES ===")
    prod_dir = os.path.join(base_dir, 'products')
    for sku, wiki_file, local_file in PRODUCTS_TODO:
        dest = os.path.join(prod_dir, local_file)
        url = get_direct_url(wiki_file)
        if url:
            ok = download_file(url, dest)
            if ok:
                print(f"  [OK] Producto {sku} -> {local_file}")
            else:
                print(f"  [ERROR VACIO] {sku}")
        else:
            print(f"  [NO URL] {sku} ({wiki_file})")

if __name__ == '__main__':
    main()
