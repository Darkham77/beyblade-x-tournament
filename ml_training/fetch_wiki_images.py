import urllib.request
import re
import os
from PIL import Image
import io

WIKI_PAGES = {
    'BEAR_SCRATCH': ['BearScratch', 'Savage_Bear_3-60S'],
    'CRIMSON_GARUDA': ['CrimsonGaruda_4-70TP'],
    'SHELTER_DRAKE': ['ShelterDrake_7-80GP'],
    'SHINOBI_KNIFE': ['ShinobiKnife_4-60LF'],
    'GHOST_CIRCLE': ['GhostCircle_0-80GB'],
    'AERO_PEGASUS': ['AeroPegasus_3-70A'],
    'OROCHI_CLUSTER': ['OrochiCluster_6-60LF'],
    'TALON_PTERA': ['Talon_Ptera_3-80B'],
    'ROAR_TYRANNO': ['Roar_Tyranno_9-60GF'],
    'YELL_KONG': ['Yell_Kong_5-60GB'],
    'DRACIEL_SHIELD': ['DracielShield_4-80B'],
    'STORM_PEGASIS': ['StormPegasis_3-70RA'],
    'VICTORY_VALKYRIE': ['VictoryValkyrie_2-60B'],
    'DRAN_BRAVE': ['DranBrave_S_6-60V'],
    'WIZARD_ARC': ['WizardArc_R_4-55LO'],
    'PERSEUS_DARK': ['PerseusDark_B_6-80W'],
    'HELLS_REAPER': ['HellsReaper_T_4-70K'],
    'FOX_BRUSH': ['FoxBrush_J_9-70E'],
    'CERBERUS_FLAME': ['CerberusFlame_W_5-80WB'],
}

OUTPUT_DIR = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\public\images\parts\blades'
GALLERY_DIR = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\public\images\gallery\blades'
os.makedirs(OUTPUT_DIR, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def fetch_page(slug):
    url = f'https://beyblade.fandom.com/wiki/{slug}'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {slug}: {e}")
        return ""

for code_name, slugs in WIKI_PAGES.items():
    lower_name = code_name.lower()
    target_path = os.path.join(OUTPUT_DIR, f"{lower_name}.png")
    gal_folder = os.path.join(GALLERY_DIR, lower_name)
    os.makedirs(gal_folder, exist_ok=True)
    
    found_urls = []
    for slug in slugs:
        html = fetch_page(slug)
        if not html:
            continue
        # Find static wikia images
        matches = re.findall(r'(https://static\.wikia\.nocookie\.net/beyblade/images/[^\s\"\'\>]+)', html)
        for m in matches:
            clean = m.split('/revision')[0]
            if clean.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                if clean not in found_urls and 'avatar' not in clean.lower() and 'icon' not in clean.lower() and 'logo' not in clean.lower():
                    found_urls.append(clean)
    
    print(f"{code_name}: found {len(found_urls)} candidates on wiki")
    
    saved = 0
    for i, img_url in enumerate(found_urls[:4]):
        try:
            req = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
            pil_img = Image.open(io.BytesIO(data)).convert('RGBA')
            # Save gallery image
            g_path = os.path.join(gal_folder, f"{lower_name}_{i}.png")
            pil_img.save(g_path)
            
            # If main doesn't exist, save as main
            if not os.path.exists(target_path):
                pil_img.save(target_path)
                print(f"  Saved main: {target_path}")
            saved += 1
        except Exception as e:
            print(f"  Error downloading {img_url}: {e}")
    
    print(f"{code_name}: saved {saved} images.")
