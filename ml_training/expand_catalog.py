import re

catalog_path = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\src\data\catalog.ts'
with open(catalog_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_blades = '''  // --- TAKARA TOMY EXPANSIONS & RECENT BX RELEASES ---
  {
    code_name: 'BEAR_SCRATCH',
    display_name: 'Bear Scratch',
    hasbro_name: 'Savage Bear',
    release_code: 'BX-37',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 29.2,
    weight_max_grams: 30.8,
    stats: { attack: 55, defense: 60, stamina: 35, dash: 50, burst_resistance: 55 },
    variants: [
      {
        variant_id: 'var_b_bs_brown',
        variant_name: 'Bear Scratch (Marrón Grizzly - BX-37)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#6D4C41',
        color_secondary_hex: '#FFD54F',
        included_in_products: ['BX-37'],
      },
      {
        variant_id: 'var_b_bs_hasbro',
        variant_name: 'Savage Bear (Verde Militar Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#33691E',
        color_secondary_hex: '#FF6F00',
        hasbro_qr_payload: 'HBX-BLD-SAVAGE-BEAR-01',
        included_in_products: ['HAS-DP-04'],
      },
    ],
  },
  {
    code_name: 'CRIMSON_GARUDA',
    display_name: 'Crimson Garuda',
    release_code: 'BX-38',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.5,
    weight_max_grams: 35.8,
    stats: { attack: 65, defense: 50, stamina: 65, dash: 55, burst_resistance: 60 },
    variants: [
      {
        variant_id: 'var_b_cg_red',
        variant_name: 'Crimson Garuda (Rojo Carmín / Oro - BX-38)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#B71C1C',
        color_secondary_hex: '#FBC02D',
        included_in_products: ['BX-38'],
      },
    ],
  },
  {
    code_name: 'SHELTER_DRAKE',
    display_name: 'Shelter Drake',
    release_code: 'BX-39',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 35.0,
    weight_max_grams: 36.4,
    stats: { attack: 40, defense: 75, stamina: 65, dash: 45, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_sd_prize',
        variant_name: 'Shelter Drake (Azul Cobalto Prize - BX-39 01)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0D47A1',
        color_secondary_hex: '#CFD8DC',
        included_in_products: ['BX-39'],
      },
      {
        variant_id: 'var_b_sd_yellow',
        variant_name: 'Shelter Drake (Amarillo / Negro - BX-39 02)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FBC02D',
        color_secondary_hex: '#212121',
        included_in_products: ['BX-39'],
      },
    ],
  },
  // --- UNIQUE LINE (UX) EXPANSIONS ---
  {
    code_name: 'SHINOBI_KNIFE',
    display_name: 'Shinobi Knife',
    hasbro_name: 'Knife Shinobi',
    release_code: 'UX-07',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 32.0,
    weight_max_grams: 33.4,
    stats: { attack: 70, defense: 40, stamina: 40, dash: 75, burst_resistance: 50 },
    variants: [
      {
        variant_id: 'var_b_sk_purple',
        variant_name: 'Shinobi Knife (Púrpura Sombra - UX-07)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#4A148C',
        color_secondary_hex: '#9E9E9E',
        included_in_products: ['UX-07'],
      },
    ],
  },
  {
    code_name: 'GHOST_CIRCLE',
    display_name: 'Ghost Circle',
    hasbro_name: 'Circle Ghost',
    release_code: 'UX-12',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 28.0,
    weight_max_grams: 29.6,
    stats: { attack: 20, defense: 55, stamina: 75, dash: 40, burst_resistance: 45 },
    variants: [
      {
        variant_id: 'var_b_gc_white',
        variant_name: 'Ghost Circle (Blanco Espectral / Violeta - UX-12 01)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#ECEFF1',
        color_secondary_hex: '#7E57C2',
        included_in_products: ['UX-12'],
      },
      {
        variant_id: 'var_b_gc_hasbro',
        variant_name: 'Circle Ghost (Teal / Amarillo Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#00897B',
        color_secondary_hex: '#FDD835',
        hasbro_qr_payload: 'HBX-BLD-CIRCLE-GHOST-01',
        included_in_products: ['HAS-DP-05'],
      },
    ],
  },
  {
    code_name: 'AERO_PEGASUS',
    display_name: 'Aero Pegasus',
    release_code: 'UX-00',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 37.5,
    weight_max_grams: 39.2,
    stats: { attack: 85, defense: 35, stamina: 55, dash: 85, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_ap_blue_coat',
        variant_name: 'Aero Pegasus (Metal Coat: Blue - Rare App Prize)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'PAINTED_METAL',
        color_primary_hex: '#1565C0',
        color_secondary_hex: '#90CAF9',
        included_in_products: ['UX-00', 'BX-00'],
      },
      {
        variant_id: 'var_b_ap_white',
        variant_name: 'Aero Pegasus (Blanco Puro All-in-One)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FFFFFF',
        color_secondary_hex: '#42A5F5',
        included_in_products: ['UX-04-SET'],
      },
    ],
  },
  {
    code_name: 'OROCHI_CLUSTER',
    display_name: 'Orochi Cluster',
    hasbro_name: 'Coil Orochi',
    release_code: 'UX-00',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 35.5,
    weight_max_grams: 37.1,
    stats: { attack: 75, defense: 60, stamina: 40, dash: 70, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_oc_corocoro',
        variant_name: 'Orochi Cluster (Verde Esmeralda CoroCoro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#1B5E20',
        color_secondary_hex: '#FFD700',
        included_in_products: ['UX-00'],
      },
      {
        variant_id: 'var_b_oc_hasbro',
        variant_name: 'Coil Orochi (Púrpura Hasbro Dual Pack)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#4A148C',
        color_secondary_hex: '#00B4D8',
        hasbro_qr_payload: 'HBX-BLD-COIL-OROCHI-01',
        included_in_products: ['HAS-DP-06'],
      },
    ],
  },
  // --- HASBRO EXCLUSIVES ---
  {
    code_name: 'TALON_PTERA',
    display_name: 'Talon Ptera',
    release_code: 'HAS-ST-05',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 33.0,
    weight_max_grams: 34.4,
    stats: { attack: 45, defense: 40, stamina: 75, dash: 50, burst_resistance: 55 },
    variants: [
      {
        variant_id: 'var_b_tp_orange',
        variant_name: 'Talon Ptera (Naranja Fuego Hasbro Starter)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#E65100',
        color_secondary_hex: '#0288D1',
        hasbro_qr_payload: 'HBX-BLD-TALON-PTERA-01',
        included_in_products: ['HAS-ST-05'],
      },
    ],
  },
  {
    code_name: 'ROAR_TYRANNO',
    display_name: 'Roar Tyranno',
    release_code: 'HAS-ST-06',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.5,
    weight_max_grams: 35.9,
    stats: { attack: 80, defense: 35, stamina: 35, dash: 75, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_rt_red',
        variant_name: 'Roar Tyranno (Rojo Furia Hasbro Starter)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#C62828',
        color_secondary_hex: '#212121',
        hasbro_qr_payload: 'HBX-BLD-ROAR-TYRANNO-01',
        included_in_products: ['HAS-ST-06'],
      },
    ],
  },
  {
    code_name: 'YELL_KONG',
    display_name: 'Yell Kong',
    release_code: 'HAS-ST-07',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 35.0,
    weight_max_grams: 36.6,
    stats: { attack: 70, defense: 65, stamina: 35, dash: 50, burst_resistance: 60 },
    variants: [
      {
        variant_id: 'var_b_yk_yellow',
        variant_name: 'Yell Kong (Amarillo Mostaza Hasbro Starter)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#F9A825',
        color_secondary_hex: '#4E342E',
        hasbro_qr_payload: 'HBX-BLD-YELL-KONG-01',
        included_in_products: ['HAS-ST-07'],
      },
    ],
  },
  // --- X-OVER PROJECT RETRO REMAKES ---
  {
    code_name: 'DRACIEL_SHIELD',
    display_name: 'Draciel Shield',
    release_code: 'BX-00',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.0,
    weight_max_grams: 35.3,
    stats: { attack: 25, defense: 85, stamina: 55, dash: 35, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_draciel_green',
        variant_name: 'Draciel Shield (Verde Clásico 25th Anniv)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#2E7D32',
        color_secondary_hex: '#37474F',
        included_in_products: ['BX-00'],
      },
    ],
  },
  {
    code_name: 'STORM_PEGASIS',
    display_name: 'Storm Pegasis',
    release_code: 'BX-00',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 35.5,
    weight_max_grams: 36.9,
    stats: { attack: 85, defense: 30, stamina: 40, dash: 85, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_sp_blue',
        variant_name: 'Storm Pegasis (Azul MFB Clásico 15th Anniv)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#1976D2',
        color_secondary_hex: '#D32F2F',
        included_in_products: ['BX-00'],
      },
    ],
  },
  {
    code_name: 'VICTORY_VALKYRIE',
    display_name: 'Victory Valkyrie',
    release_code: 'BX-00',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 35.2,
    weight_max_grams: 36.6,
    stats: { attack: 85, defense: 30, stamina: 35, dash: 85, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_vv_blue',
        variant_name: 'Victory Valkyrie (Azul Burst Clásico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0288D1',
        color_secondary_hex: '#E53935',
        included_in_products: ['BX-00'],
      },
    ],
  },
  // --- CUSTOM LINE (CX) MODULAR SYSTEM ---
  {
    code_name: 'DRAN_BRAVE',
    display_name: 'Dran Brave',
    release_code: 'CX-01',
    system: 'CX',
    spin_direction: 'RIGHT',
    weight_min_grams: 44.5,
    weight_max_grams: 46.2,
    is_modular: true,
    cx_components: {
      lock_chip: 'Dran Chip',
      main_blade: 'Brave Metal',
      assist_blade: 'Slash Assist',
    },
    stats: { attack: 90, defense: 30, stamina: 40, dash: 90, burst_resistance: 80 },
    variants: [
      {
        variant_id: 'var_b_db_blue',
        variant_name: 'Dran Brave (Azul / Llama Roja - CX-01)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0D47A1',
        color_secondary_hex: '#FF1744',
        included_in_products: ['CX-01'],
      },
    ],
  },
  {
    code_name: 'WIZARD_ARC',
    display_name: 'Wizard Arc',
    release_code: 'CX-02',
    system: 'CX',
    spin_direction: 'RIGHT',
    weight_min_grams: 43.5,
    weight_max_grams: 45.1,
    is_modular: true,
    cx_components: {
      lock_chip: 'Wizard Chip',
      main_blade: 'Arc Metal',
      assist_blade: 'Stamina Assist',
    },
    stats: { attack: 35, defense: 60, stamina: 90, dash: 45, burst_resistance: 60 },
    variants: [
      {
        variant_id: 'var_b_wa_yellow',
        variant_name: 'Wizard Arc (Ámbar Dorado - CX-02)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FFB300',
        color_secondary_hex: '#3E2723',
        included_in_products: ['CX-02'],
      },
    ],
  },
  {
    code_name: 'PERSEUS_DARK',
    display_name: 'Perseus Dark',
    release_code: 'CX-03',
    system: 'CX',
    spin_direction: 'RIGHT',
    weight_min_grams: 45.0,
    weight_max_grams: 46.9,
    is_modular: true,
    cx_components: {
      lock_chip: 'Perseus Chip',
      main_blade: 'Dark Metal',
      assist_blade: 'Defense Assist',
    },
    stats: { attack: 60, defense: 85, stamina: 55, dash: 50, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_pd_purple',
        variant_name: 'Perseus Dark (Púrpura Oscuro / Gunmetal - CX-03)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#311B92',
        color_secondary_hex: '#424242',
        included_in_products: ['CX-03'],
      },
    ],
  },
  {
    code_name: 'HELLS_REAPER',
    display_name: 'Hells Reaper',
    release_code: 'CX-05',
    system: 'CX',
    spin_direction: 'RIGHT',
    weight_min_grams: 44.0,
    weight_max_grams: 45.6,
    is_modular: true,
    cx_components: {
      lock_chip: 'Hells Chip',
      main_blade: 'Reaper Metal',
      assist_blade: 'Balance Assist',
    },
    stats: { attack: 75, defense: 60, stamina: 70, dash: 65, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_hr_crimson',
        variant_name: 'Hells Reaper (Rojo Carmesí / Obsidiana - CX-05)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#B71C1C',
        color_secondary_hex: '#212121',
        included_in_products: ['CX-05'],
      },
    ],
  },
  {
    code_name: 'FOX_BRUSH',
    display_name: 'Fox Brush',
    release_code: 'CX-06',
    system: 'CX',
    spin_direction: 'RIGHT',
    weight_min_grams: 43.0,
    weight_max_grams: 44.7,
    is_modular: true,
    cx_components: {
      lock_chip: 'Fox Chip',
      main_blade: 'Brush Metal',
      assist_blade: 'Agile Assist',
    },
    stats: { attack: 65, defense: 50, stamina: 75, dash: 80, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_fb_white',
        variant_name: 'Fox Brush (Blanco Kitsune / Rojo - CX-06)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FAFAFA',
        color_secondary_hex: '#D50000',
        included_in_products: ['CX-06'],
      },
    ],
  },
  {
    code_name: 'CERBERUS_FLAME',
    display_name: 'Cerberus Flame',
    release_code: 'CX-08',
    system: 'CX',
    spin_direction: 'RIGHT',
    weight_min_grams: 45.5,
    weight_max_grams: 47.2,
    is_modular: true,
    cx_components: {
      lock_chip: 'Cerberus Chip',
      main_blade: 'Flame Metal',
      assist_blade: 'Triple Guard Assist',
    },
    stats: { attack: 70, defense: 85, stamina: 50, dash: 55, burst_resistance: 80 },
    variants: [
      {
        variant_id: 'var_b_cf_orange',
        variant_name: 'Cerberus Flame (Fuego Naranja / Bronce - CX-08)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FF6D00',
        color_secondary_hex: '#795548',
        included_in_products: ['CX-08'],
      },
    ],
  },
'''

new_ratchets = '''  {
    code_name: '6-60',
    display_name: '6-60',
    sides: 6,
    height_mm: 60,
    weight_min_grams: 6.4,
    weight_max_grams: 6.7,
    stats: { burst_resistance: 75, aerodynamics: 80 },
    variants: [
      {
        variant_id: 'var_r_660_green',
        variant_name: '6-60 (Verde Esmeralda CoroCoro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#1B5E20',
        included_in_products: ['UX-00'],
      },
    ],
  },
  {
    code_name: '0-80',
    display_name: '0-80',
    sides: 0,
    height_mm: 80,
    weight_min_grams: 6.9,
    weight_max_grams: 7.2,
    stats: { burst_resistance: 70, aerodynamics: 95 },
    variants: [
      {
        variant_id: 'var_r_080_white',
        variant_name: '0-80 (Blanco / Violeta Espectral)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#ECEFF1',
        included_in_products: ['UX-12'],
      },
    ],
  },
  {
    code_name: 'S6-60',
    display_name: 'S6-60',
    sides: 6,
    height_mm: 60,
    weight_min_grams: 6.8,
    weight_max_grams: 7.1,
    stats: { burst_resistance: 85, aerodynamics: 85 },
    variants: [
      {
        variant_id: 'var_r_s660_blue',
        variant_name: 'S6-60 (Azul Cobalto CX-01)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#0D47A1',
        included_in_products: ['CX-01'],
      },
    ],
  },
'''

new_bits = '''  {
    code_name: 'TP',
    display_name: 'Trans Point',
    category: 'Balance',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.3,
    weight_max_grams: 2.5,
    stats: { attack: 65, dash: 65, stamina: 75 },
    variants: [
      {
        variant_id: 'var_bit_tp_red',
        variant_name: 'Trans Point (Rojo Translúcido - BX-38)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#C62828',
        included_in_products: ['BX-38'],
      },
    ],
  },
  {
    code_name: 'V',
    display_name: 'Vortex',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.4,
    weight_max_grams: 2.6,
    stats: { attack: 90, dash: 95, stamina: 40 },
    variants: [
      {
        variant_id: 'var_bit_v_blue',
        variant_name: 'Vortex (Azul Neón - CX-01)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#0288D1',
        included_in_products: ['CX-01'],
      },
    ],
  },
'''

# 1. Insert new blades before `];\n\n// ======= 2. RATCHETS`
pos_ratchets_marker = content.find('export const CATALOG_RATCHETS: Ratchet[] = [')
if pos_ratchets_marker != -1:
    # Find the closing `];` before this marker
    pos_blades_end = content.rfind('];', 0, pos_ratchets_marker)
    content = content[:pos_blades_end] + new_blades + content[pos_blades_end:]
    print('Blades inserted successfully!')

# 2. Insert new ratchets before `];\n\n// ======= 3. BITS`
pos_bits_marker = content.find('export const CATALOG_BITS: Bit[] = [')
if pos_bits_marker != -1:
    pos_ratchets_end = content.rfind('];', 0, pos_bits_marker)
    content = content[:pos_ratchets_end] + new_ratchets + content[pos_ratchets_end:]
    print('Ratchets inserted successfully!')

# 3. Insert new bits before `];\n\n// ======= 4. PRODUCTOS`
pos_products_marker = content.find('export const CATALOG_PRODUCTS: Product[] = [')
if pos_products_marker != -1:
    pos_bits_end = content.rfind('];', 0, pos_products_marker)
    content = content[:pos_bits_end] + new_bits + content[pos_bits_end:]
    print('Bits inserted successfully!')

with open(catalog_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Catalog expanded successfully!')
