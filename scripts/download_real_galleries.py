import os
import sys
import urllib.request
import urllib.parse
import json
import re

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://beyblade.fandom.com/'
}

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, 'app', 'public')
GALLERY_BASE_DIR = os.path.join(PUBLIC_DIR, 'images', 'gallery', 'blades')

# High quality curated real photos, recolors, and angled shots from the wiki
REAL_PHOTOS_MANIFEST = {
    'DRAN_SWORD': [
        ('DranSword Metal Coat Blue.jpg', 'dran_sword_metal_coat_blue.jpg', 'Metal Coat Azul (Foto Real)', 'REAL'),
        ('DranSword (Metal Coat Red).jpeg', 'dran_sword_metal_coat_red.jpg', 'Metal Coat Rojo (Foto Real)', 'REAL'),
        ('DranSword (BX-14 03).png', 'dran_sword_bx14_black_red.png', 'BX-14 Negro y Rojo (Recolor)', 'RECOLOR'),
        ('DranSword 3-60F (Red Ver.).jpeg', 'dran_sword_red_ver.jpg', 'Dran Sword Edición Roja (Foto Real)', 'REAL'),
        ('DranSword 3-60F (Katsushika City Collaboration Ver; 1).jpg', 'dran_sword_collab.jpg', 'Colaboración Katsushika (Foto Real)', 'REAL'),
    ],
    'HELLS_SCYTHE': [
        ('HellsScythe 3-80F.jpg', 'hells_scythe_380f.jpg', 'Hells Scythe 3-80F (Foto Real)', 'REAL'),
        ('HellsScythe 4-60T (Metal Coat Gold).jpg', 'hells_scythe_gold.jpg', 'Metal Coat Dorado (Foto Real)', 'REAL'),
        ('HellsScythe (BX-08).png', 'hells_scythe_bx08.png', 'BX-08 Deck Set (Recolor)', 'RECOLOR'),
        ('HellsScythe 4-80LF.png', 'hells_scythe_480lf.png', 'Hells Scythe Verde 4-80LF (Recolor)', 'RECOLOR'),
    ],
    'WIZARD_ARROW': [
        ('WizardArrow 4-80GB.jpeg', 'wizard_arrow_480gb.jpg', 'Wizard Arrow 4-80GB (Foto Real)', 'REAL'),
        ('WizardArrow (BX-05).png', 'wizard_arrow_bx05.png', 'BX-05 Booster Negro (Recolor)', 'RECOLOR'),
        ('WizardArrow (BX-08).png', 'wizard_arrow_bx08.png', 'BX-08 Deck Set Naranja (Recolor)', 'RECOLOR'),
        ('WizardArrow 4-80B (Blue Ver.).png', 'wizard_arrow_blue.png', 'Wizard Arrow Azul (Recolor)', 'RECOLOR'),
    ],
    'KNIGHT_SHIELD': [
        ('KnightShield Metal Coat Gold.png', 'knight_shield_gold.png', 'Metal Coat Dorado (Foto Real)', 'REAL'),
        ('KnightShield (BX-06).png', 'knight_shield_bx06.png', 'BX-06 Booster Azul (Recolor)', 'RECOLOR'),
        ('KnightShield (BX-08).png', 'knight_shield_bx08.png', 'BX-08 Deck Set Verde (Recolor)', 'RECOLOR'),
        ('KnightShield (BX-20).png', 'knight_shield_bx20.png', 'BX-20 Edición Blanca (Recolor)', 'RECOLOR'),
    ],
    'KNIGHT_LANCE': [
        ('KnightLance 3-60LF.jpeg', 'knight_lance_360lf.jpg', 'Knight Lance 3-60LF (Foto Real)', 'REAL'),
        ('KnightLance (BX-21).png', 'knight_lance_bx21.png', 'BX-21 Set Especial (Recolor)', 'RECOLOR'),
    ],
    'SHARK_EDGE': [
        ('SharkEdge 5-60GF.jpg', 'shark_edge_560gf.jpg', 'Shark Edge 5-60GF (Foto Real)', 'REAL'),
        ('SharkEdge (BX-20).png', 'shark_edge_bx20.png', 'BX-20 Púrpura (Recolor)', 'RECOLOR'),
        ('SharkEdge (BX-31 05).png', 'shark_edge_bx31.png', 'BX-31 Random Booster (Recolor)', 'RECOLOR'),
    ],
    'LEON_CLAW': [
        ('LeonClaw (Metal Coat Gold).jpg', 'leon_claw_gold.jpg', 'Metal Coat Dorado (Foto Real)', 'REAL'),
    ],
    'VIPER_TAIL': [
        ('ViperTail (BX-35).png', 'viper_tail_bx35.png', 'BX-35 Random Booster (Recolor)', 'RECOLOR'),
        ('ViperTail (BX-35 06).png', 'viper_tail_bx35_06.png', 'BX-35 Variante Azul (Recolor)', 'RECOLOR'),
    ],
    'RHINO_HORN': [
        ('RhinoHorn 3-80S.jpeg', 'rhino_horn_380s.jpg', 'Rhino Horn 3-80S (Foto Real)', 'REAL'),
        ('RhinoHorn 3-80S (Angled View).jpeg', 'rhino_horn_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
    ],
    'DRAN_DAGGER': [
        ('DranDagger (BX-00).png', 'dran_dagger_bx00.png', 'BX-00 Metal Coat Negro (Recolor)', 'RECOLOR'),
        ('DranDagger (BX-31 04).png', 'dran_dagger_bx31.png', 'BX-31 Random Booster (Recolor)', 'RECOLOR'),
    ],
    'HELLS_CHAIN': [
        ('HellsChain 5-60HT.jpeg', 'hells_chain_560ht.jpg', 'Hells Chain 5-60HT (Foto Real)', 'REAL'),
        ('HellsChain 5-60HT (Angled View).jpeg', 'hells_chain_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
        ('HellsChain (Metal Coat Black) (BX-00).png', 'hells_chain_black.png', 'Metal Coat Negro (Recolor)', 'RECOLOR'),
    ],
    'PHOENIX_WING': [
        ('PhoenixWing 9-80DB.jpg', 'phoenix_wing_980db.jpg', 'Phoenix Wing 9-80DB (Foto Real)', 'REAL'),
        ('PhoenixWing 9-60GF Metal Coat Black.png', 'phoenix_wing_black.png', 'Metal Coat Negro (Recolor)', 'RECOLOR'),
        ('PhoenixWing (BX-35 05).png', 'phoenix_wing_bx35.png', 'BX-35 Random Booster Azul (Recolor)', 'RECOLOR'),
    ],
    'WYVERN_GALE': [
        ('WyvernGale (BX-24 02).png', 'wyvern_gale_bx24.png', 'BX-24 Random Booster (Recolor)', 'RECOLOR'),
        ('WyvernGale (UX-07).png', 'wyvern_gale_ux07.png', 'UX-07 Set Especial (Recolor)', 'RECOLOR'),
    ],
    'UNICORN_STING': [
        ('UnicornSting 3-70D.jpeg', 'unicorn_sting_370d.jpg', 'Unicorn Sting 3-70D (Foto Real)', 'REAL'),
        ('UnicornSting 5-60GP.jpg', 'unicorn_sting_560gp.jpg', 'Unicorn Sting 5-60GP (Foto Real)', 'REAL'),
    ],
    'SPHINX_COWL': [
        ('SphinxCowl 1-80GF.jpeg', 'sphinx_cowl_180gf.jpg', 'Sphinx Cowl 1-80GF (Foto Real)', 'REAL'),
        ('SphinxCowl (UX-07).png', 'sphinx_cowl_ux07.png', 'UX-07 Edición Especial (Recolor)', 'RECOLOR'),
    ],
    'TYRANNO_BEAT': [
        ('TyrannoBeat 1-60RA (Side_View).jpeg', 'tyranno_beat_side.jpg', 'Vista de Perfil 1-60RA (Foto Real)', 'ANGLED'),
        ('TyrannoBeat (Metal Coat Red).png', 'tyranno_beat_red.png', 'Metal Coat Rojo (Recolor)', 'RECOLOR'),
    ],
    'WEISS_TIGER': [
        ('WeissTiger 3-60U.jpeg', 'weiss_tiger_360u.jpg', 'Weiss Tiger 3-60U (Foto Real)', 'REAL'),
    ],
    'BLACK_SHELL': [
        ('BlackShell 4-60D.jpg', 'black_shell_460d.jpg', 'Black Shell 4-60D (Foto Real)', 'REAL'),
        ('BlackShell (BX-35 02).png', 'black_shell_bx35.png', 'BX-35 Random Booster (Recolor)', 'RECOLOR'),
    ],
    'WHALE_WAVE': [
        ('WhaleWave 1-80GF (Metal Coat Blue Fishing Spirits Wonder Ver.).jpg', 'whale_wave_blue.jpg', 'Edición Especial Pesca (Foto Real)', 'REAL'),
    ],
    'DRAN_BUSTER': [
        ('DranBuster (Metal Coat Cyan).png', 'dran_buster_cyan.png', 'Metal Coat Cian (Recolor)', 'RECOLOR'),
        ('DranBuster (Metal Coat Black).png', 'dran_buster_black.png', 'Metal Coat Negro (Recolor)', 'RECOLOR'),
        ('DranBuster 1-60A (Metal Coat Blue FC Barcelona Ver.).png', 'dran_buster_barca.png', 'FC Barcelona Edición Oficial (Recolor)', 'RECOLOR'),
    ],
    'HELLS_HAMMER': [
        ('HellsHammer 3-70H.jpg', 'hells_hammer_370h.jpg', 'Hells Hammer 3-70H (Foto Real)', 'REAL'),
        ('HellsHammer 3-70H (Angled View).jpg', 'hells_hammer_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
        ('HellsHammer (Metal Coat Blue).png', 'hells_hammer_blue.png', 'Metal Coat Azul (Recolor)', 'RECOLOR'),
    ],
    'WIZARD_ROD': [
        ('WizardRod 5-70DB (Special Ver.).jpg', 'wizard_rod_special.jpg', 'Wizard Rod Edición Especial (Foto Real)', 'REAL'),
        ('WizardRod (Metal Coat Gold).png', 'wizard_rod_gold.png', 'Metal Coat Dorado (Recolor)', 'RECOLOR'),
        ('WizardRod (BX-35 04).png', 'wizard_rod_bx35.png', 'BX-35 Random Booster (Recolor)', 'RECOLOR'),
    ],
    'SHINOBI_SHADOW': [
        ('ShinobiShadow 1-80MN.jpeg', 'shinobi_shadow_180mn.jpg', 'Shinobi Shadow 1-80MN (Foto Real)', 'REAL'),
        ('ShinobiShadow 1-80MN (Angled View).jpeg', 'shinobi_shadow_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
    ],
    'COBALT_DRAGOON': [
        ('Cobalt Dragoon 2-60C.jpeg', 'cobalt_dragoon_260c.jpg', 'Cobalt Dragoon 2-60C (Foto Real)', 'REAL'),
        ('CobaltDragoon 2-60C (Angled View).jpeg', 'cobalt_dragoon_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
        ('CobaltDragoon 2-60C (Metal Coat Black).png', 'cobalt_dragoon_black.png', 'Metal Coat Negro (Recolor)', 'RECOLOR'),
    ],
    'LEON_CREST': [
        ('LeonCrest 7-60GN.jpeg', 'leon_crest_760gn.jpg', 'Leon Crest 7-60GN (Foto Real)', 'REAL'),
        ('LeonCrest 7-60GN (Angled View).jpeg', 'leon_crest_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
    ],
    'PHOENIX_RUDDER': [
        ('PhoenixRudder 9-70G.jpeg', 'phoenix_rudder_970g.jpg', 'Phoenix Rudder 9-70G (Foto Real)', 'REAL'),
        ('PhoenixRudder 9-70G (Angled View).png', 'phoenix_rudder_angled.png', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
    ],
    'SAMURAI_SABER': [
        ('SamuraiSaber 2-70L.png', 'samurai_saber_270l.png', 'Samurai Saber 2-70L (Foto Real)', 'REAL'),
        ('SamuraiSaber 2-70L (Angled View).png', 'samurai_saber_angled.png', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
    ],
    'KNIGHT_MAIL': [
        ('KnightMail (Metal Coat Navy).png', 'knight_mail_navy.png', 'Metal Coat Azul Marino (Recolor)', 'RECOLOR'),
    ],
    'IMPACT_DRAKE': [
        ('ImpactDrake 9-60LR.jpg', 'impact_drake_960lr.jpg', 'Impact Drake 9-60LR (Foto Real)', 'REAL'),
    ],
    'COBALT_DRAKE': [
        ('CobaltDrake 4-60F.jpg', 'cobalt_drake_460f.jpg', 'Cobalt Drake 4-60F (Foto Real Rara)', 'REAL'),
        ('CobaltDrake (BX-46).png', 'cobalt_drake_bx46.png', 'BX-46 Clear Ver. (Recolor)', 'RECOLOR'),
    ],
    'DRANZER_SPIRAL': [
        ('DranzerSpiral 3-80T.jpeg', 'dranzer_spiral_380t.jpg', 'Dranzer Spiral 3-80T (Foto Real)', 'REAL'),
        ('DranzerSpiral 3-80T (Angled View).jpeg', 'dranzer_spiral_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
        ('DranzerSpiral (BX-00; Black Ver).png', 'dranzer_spiral_black.png', 'Edición Negra BX-00 (Recolor)', 'RECOLOR'),
    ],
    'DRIGER_SLASH': [
        ('DrigerSlash 4-80P.jpeg', 'driger_slash_480p.jpg', 'Driger Slash 4-80P (Foto Real)', 'REAL'),
        ('DrigerSlash 4-80P (Angled View).jpeg', 'driger_slash_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
    ],
    'DRAGOON_STORM': [
        ('DragoonStorm 4-60RA.jpeg', 'dragoon_storm_460ra.jpg', 'Dragoon Storm 4-60RA (Foto Real)', 'REAL'),
    ],
    'LIGHTNING_L_DRAGO': [
        ('Lightning L-Drago 1-60F (Rapid-Hit Type).jpeg', 'lightning_l_drago_rapid.jpg', 'Lightning L-Drago Rapid-Hit (Foto Real)', 'REAL'),
    ],
    'BITE_CROC': [
        ('Bite Croc 3-60LF.jpeg', 'bite_croc_360lf.jpg', 'Bite Croc 3-60LF Hasbro (Foto Real)', 'REAL'),
    ],
    'STEEL_SAMURAI': [
        ('Steel Samurai 4-80T.jpeg', 'steel_samurai_480t.jpg', 'Steel Samurai 4-80T Hasbro (Foto Real)', 'REAL'),
        ('Steel Samurai 4-80T (Angled View).jpeg', 'steel_samurai_angled.jpg', 'Perspectiva 3D Angular (Foto Real)', 'ANGLED'),
    ],
    'MAMMOTH_TUSK': [
        ('Tusk Mammoth 3-60T.jpeg', 'tusk_mammoth_360t.jpg', 'Mammoth Tusk 3-60T Hasbro (Foto Real)', 'REAL'),
    ],
}

def resolve_wiki_url(file_name):
    url = f"https://beyblade.fandom.com/api.php?action=query&titles=File:{urllib.parse.quote(file_name)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for _, v in data.get('query', {}).get('pages', {}).items():
                if 'imageinfo' in v and len(v['imageinfo']) > 0:
                    return v['imageinfo'][0]['url'].split('?')[0]
    except Exception as e:
        print(f"Error querying {file_name}: {e}")
    return None

def download_file(url, target_path):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            with open(target_path, 'wb') as f:
                f.write(content)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    print("=== DESCARGANDO FOTOS REALES, ÁNGULOS Y VARIANTES PARA LA GALERÍA ===")
    total_downloaded = 0
    gallery_manifest_out = {}

    for blade_code, photos in REAL_PHOTOS_MANIFEST.items():
        blade_dir = os.path.join(GALLERY_BASE_DIR, blade_code.lower())
        os.makedirs(blade_dir, exist_ok=True)
        gallery_manifest_out[blade_code] = []

        for wiki_file, local_filename, label, tag in photos:
            dest_path = os.path.join(blade_dir, local_filename)
            rel_web_path = f"/images/gallery/blades/{blade_code.lower()}/{local_filename}"

            if not os.path.exists(dest_path) or os.path.getsize(dest_path) < 1000:
                print(f"Buscando en Wiki: {wiki_file}...")
                img_url = resolve_wiki_url(wiki_file)
                if img_url:
                    if download_file(img_url, dest_path):
                        print(f"  [OK] Descargado: {local_filename} ({os.path.getsize(dest_path)} bytes)")
                        total_downloaded += 1
                else:
                    print(f"  [FAIL] No se encontró URL para: {wiki_file}")
            else:
                total_downloaded += 1

            if os.path.exists(dest_path) and os.path.getsize(dest_path) >= 1000:
                gallery_manifest_out[blade_code].append({
                    'url': rel_web_path,
                    'label': label,
                    'tag': tag
                })

    print(f"\nTotal fotos reales descargadas/verificadas: {total_downloaded}")
    
    # Save manifest for catalog.ts integration
    manifest_path = os.path.join(PROJECT_ROOT, 'scripts', 'gallery_manifest.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(gallery_manifest_out, f, indent=2, ensure_ascii=False)
    print(f"Manifiesto guardado en: {manifest_path}")

if __name__ == '__main__':
    main()
