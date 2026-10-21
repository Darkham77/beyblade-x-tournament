"""
Script de Extracción Automatizada de Imágenes Oficiales de Beyblade X
Fuente: Beyblade Fandom MediaWiki API
Objetivo:
  1. Descargar imágenes PNG en alta definición para la UI del catálogo.
  2. Organizar el dataset base para el entrenamiento del clasificador de visión artificial.
"""

import os
import sys
import json
import urllib.request
import urllib.parse
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://beyblade.fandom.com/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

TARGET_PARTS = {
    'blades': [
        ('Dran_Sword', 'Blade_-_DranSword', 'dran_sword.png'),
        ('Hells_Scythe', 'Blade_-_HellsScythe', 'hells_scythe.png'),
        ('Wizard_Arrow', 'Blade_-_WizardArrow', 'wizard_arrow.png'),
        ('Knight_Shield', 'Blade_-_KnightShield', 'knight_shield.png'),
        ('Knight_Lance', 'Blade_-_KnightLance', 'knight_lance.png'),
        ('Shark_Edge', 'Blade_-_SharkEdge', 'shark_edge.png'),
        ('Leon_Claw', 'Blade_-_LeonClaw', 'leon_claw.png'),
        ('Viper_Tail', 'Blade_-_ViperTail', 'viper_tail.png'),
        ('Rhino_Horn', 'Blade_-_RhinoHorn', 'rhino_horn.png'),
        ('Dran_Dagger', 'Blade_-_DranDagger', 'dran_dagger.png'),
        ('Hells_Chain', 'Blade_-_HellsChain', 'hells_chain.png'),
        ('Phoenix_Wing', 'Blade_-_PhoenixWing', 'phoenix_wing.png'),
        ('Wyvern_Gale', 'Blade_-_WyvernGale', 'wyvern_gale.png'),
        ('Unicorn_Sting', 'Blade_-_UnicornSting', 'unicorn_sting.png'),
        ('Sphinx_Cowl', 'Blade_-_SphinxCowl', 'sphinx_cowl.png'),
        ('Tyranno_Beat', 'Blade_-_TyrannoBeat', 'tyranno_beat.png'),
        ('Weiss_Tiger', 'Blade_-_WeissTiger', 'weiss_tiger.png'),
        ('Black_Shell', 'Blade_-_BlackShell', 'black_shell.png'),
        ('Whale_Wave', 'Blade_-_WhaleWave', 'whale_wave.png'),
        ('Dran_Buster', 'Blade_-_DranBuster', 'dran_buster.png'),
        ('Hells_Hammer', 'Blade_-_HellsHammer', 'hells_hammer.png'),
        ('Wizard_Rod', 'Blade_-_WizardRod', 'wizard_rod.png'),
        ('Shinobi_Shadow', 'Blade_-_ShinobiShadow', 'shinobi_shadow.png'),
        ('Cobalt_Dragoon', 'Blade_-_CobaltDragoon', 'cobalt_dragoon.png'),
        ('Leon_Crest', 'Blade_-_LeonCrest', 'leon_crest.png'),
        ('Phoenix_Rudder', 'Blade_-_PhoenixRudder', 'phoenix_rudder.png'),
        ('Silver_Wolf', 'Blade_-_SilverWolf', 'silver_wolf.png'),
        ('Samurai_Saber', 'Blade_-_SamuraiSaber', 'samurai_saber.png'),
        ('Knight_Mail', 'Blade_-_KnightMail', 'knight_mail.png'),
        ('Impact_Drake', 'Blade_-_ImpactDrake', 'impact_drake.png'),
        ('Cobalt_Drake', 'Blade_-_CobaltDrake', 'cobalt_drake.png'),
    ],
    'ratchets': [
        ('1-60', 'Ratchet_-_1-60', 'ratchet_1-60.png'),
        ('2-60', 'Ratchet_-_2-60', 'ratchet_2-60.png'),
        ('3-60', 'Ratchet_-_3-60', 'ratchet_3-60.png'),
        ('4-60', 'Ratchet_-_4-60', 'ratchet_4-60.png'),
        ('5-60', 'Ratchet_-_5-60', 'ratchet_5-60.png'),
        ('7-60', 'Ratchet_-_7-60', 'ratchet_7-60.png'),
        ('9-60', 'Ratchet_-_9-60', 'ratchet_9-60.png'),
        ('3-70', 'Ratchet_-_3-70', 'ratchet_3-70.png'),
        ('4-70', 'Ratchet_-_4-70', 'ratchet_4-70.png'),
        ('5-70', 'Ratchet_-_5-70', 'ratchet_5-70.png'),
        ('9-70', 'Ratchet_-_9-70', 'ratchet_9-70.png'),
        ('1-80', 'Ratchet_-_1-80', 'ratchet_1-80.png'),
        ('3-80', 'Ratchet_-_3-80', 'ratchet_3-80.png'),
        ('4-80', 'Ratchet_-_4-80', 'ratchet_4-80.png'),
        ('5-80', 'Ratchet_-_5-80', 'ratchet_5-80.png'),
        ('9-80', 'Ratchet_-_9-80', 'ratchet_9-80.png'),
        ('3-85', 'Ratchet_-_3-85', 'ratchet_3-85.png'),
    ],
    'bits': [
        ('Flat', 'Bit_-_Flat', 'bit_flat.png'),
        ('Low_Flat', 'Bit_-_Low_Flat', 'bit_low_flat.png'),
        ('Gear_Flat', 'Bit_-_Gear_Flat', 'bit_gear_flat.png'),
        ('Accel', 'Bit_-_Accel', 'bit_accel.png'),
        ('Rush', 'Bit_-_Rush', 'bit_rush.png'),
        ('Quake', 'Bit_-_Quake', 'bit_quake.png'),
        ('Cyclone', 'Bit_-_Cyclone', 'bit_cyclone.png'),
        ('Level', 'Bit_-_Level', 'bit_level.png'),
        ('Ball', 'Bit_-_Ball', 'bit_ball.png'),
        ('Disc_Ball', 'Bit_-_Disc_Ball', 'bit_disc_ball.png'),
        ('Orb', 'Bit_-_Orb', 'bit_orb.png'),
        ('Glide', 'Bit_-_Glide', 'bit_glide.png'),
        ('Free_Ball', 'Bit_-_Free_Ball', 'bit_free_ball.png'),
        ('Needle', 'Bit_-_Needle', 'bit_needle.png'),
        ('High_Needle', 'Bit_-_High_Needle', 'bit_high_needle.png'),
        ('Gear_Needle', 'Bit_-_Gear_Needle', 'bit_gear_needle.png'),
        ('Hexa', 'Bit_-_Hexa', 'bit_hexa.png'),
        ('Metal_Needle', 'Bit_-_Metal_Needle', 'bit_metal_needle.png'),
        ('Taper', 'Bit_-_Taper', 'bit_taper.png'),
        ('High_Taper', 'Bit_-_High_Taper', 'bit_high_taper.png'),
        ('Point', 'Bit_-_Point', 'bit_point.png'),
        ('Gear_Point', 'Bit_-_Gear_Point', 'bit_gear_point.png'),
        ('Unite', 'Bit_-_Unite', 'bit_unite.png'),
        ('Elevate', 'Bit_-_Elevate', 'bit_elevate.png'),
    ]
}

def get_page_images(wiki_title):
    url = f"https://beyblade.fandom.com/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=images&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for _, page_info in pages.items():
                if 'images' in page_info:
                    return [img['title'] for img in page_info['images']]
    except Exception as e:
        print(f"Error consultando imagenes de {wiki_title}: {e}")
    return []

def get_direct_image_url(file_title):
    url = f"https://beyblade.fandom.com/api.php?action=query&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for _, page_info in pages.items():
                imageinfo = page_info.get('imageinfo', [])
                if imageinfo:
                    raw_url = imageinfo[0].get('url', '')
                    if '/revision/latest' in raw_url:
                        return raw_url.split('?')[0]
                    return raw_url
    except Exception as e:
        print(f"Error obteniendo URL de {file_title}: {e}")
    return None

def download_file(image_url, dest_path):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    req = urllib.request.Request(image_url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        content = resp.read()
        if len(content) > 1000:
            with open(dest_path, 'wb') as f:
                f.write(content)
            return True
    return False

def main():
    base_dest = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'public', 'images', 'parts'))
    print(f"Iniciando descarga de imagenes oficiales hacia: {base_dest}\n")

    for category, items in TARGET_PARTS.items():
        print(f"\n=================== CATEGORIA: {category.upper()} ===================")
        cat_dir = os.path.join(base_dest, category)

        for name, wiki_title, filename in items:
            dest_file = os.path.join(cat_dir, filename)
            if os.path.exists(dest_file) and os.path.getsize(dest_file) > 1000:
                print(f"  [YA EXISTE] {name} -> {filename}")
                continue

            images = get_page_images(wiki_title)
            if not images:
                print(f"  [NO ENCONTRADA] {wiki_title}")
                continue

            best_img = None
            for img in images:
                t = img.lower()
                if (category[:-1] in t or name.lower().replace('_', '') in t) and t.endswith('.png'):
                    best_img = img
                    break
            if not best_img:
                for img in images:
                    if img.lower().endswith('.png'):
                        best_img = img
                        break
            if not best_img and images:
                best_img = images[0]

            direct_url = get_direct_image_url(best_img)
            if direct_url:
                try:
                    success = download_file(direct_url, dest_file)
                    if success:
                        size_kb = os.path.getsize(dest_file) / 1024
                        print(f"  [OK DESCARGADO] {name} ({best_img}) -> {size_kb:.1f} KB")
                    else:
                        print(f"  [ARCHIVO VACIO] {name}")
                except Exception as e:
                    print(f"  [FALLO DESCARGA] {name}: {e}")
            else:
                print(f"  [SIN URL] {best_img}")

            time.sleep(0.3)

    print("\n[FIN] Proceso completado exitosamente.")

if __name__ == '__main__':
    main()
