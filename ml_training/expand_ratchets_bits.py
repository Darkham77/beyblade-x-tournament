import re

catalog_path = r'C:\Users\Ro\.gemini\antigravity\scratch\scanner-de-beys\app\src\data\catalog.ts'
with open(catalog_path, 'r', encoding='utf-8') as f:
    content = f.read()

missing_ratchets = '''  {
    code_name: '2-80',
    display_name: '2-80',
    sides: 2,
    height_mm: 80,
    weight_min_grams: 6.8,
    weight_max_grams: 7.1,
    stats: { burst_resistance: 70, aerodynamics: 85 },
    variants: [
      {
        variant_id: 'var_r_280_red',
        variant_name: '2-80 (Rojo / Negro - BX-31)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#B71C1C',
        included_in_products: ['BX-31'],
      },
    ],
  },
  {
    code_name: '7-80',
    display_name: '7-80',
    sides: 7,
    height_mm: 80,
    weight_min_grams: 7.0,
    weight_max_grams: 7.3,
    stats: { burst_resistance: 85, aerodynamics: 90 },
    variants: [
      {
        variant_id: 'var_r_780_blue',
        variant_name: '7-80 (Azul Cobalto - BX-39)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#0D47A1',
        included_in_products: ['BX-39'],
      },
    ],
  },
  {
    code_name: '4-55',
    display_name: '4-55',
    sides: 4,
    height_mm: 55,
    weight_min_grams: 6.5,
    weight_max_grams: 6.8,
    stats: { burst_resistance: 80, aerodynamics: 85 },
    variants: [
      {
        variant_id: 'var_r_455_yellow',
        variant_name: '4-55 (Ámbar Dorado - CX-02)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#FFB300',
        included_in_products: ['CX-02'],
      },
    ],
  },
  {
    code_name: '6-80',
    display_name: '6-80',
    sides: 6,
    height_mm: 80,
    weight_min_grams: 7.1,
    weight_max_grams: 7.4,
    stats: { burst_resistance: 80, aerodynamics: 90 },
    variants: [
      {
        variant_id: 'var_r_680_purple',
        variant_name: '6-80 (Púrpura Oscuro - CX-03)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#311B92',
        included_in_products: ['CX-03'],
      },
    ],
  },
  {
    code_name: '8-80',
    display_name: '8-80',
    sides: 8,
    height_mm: 80,
    weight_min_grams: 7.2,
    weight_max_grams: 7.5,
    stats: { burst_resistance: 85, aerodynamics: 95 },
    variants: [
      {
        variant_id: 'var_r_880_silver',
        variant_name: '8-80 (Plateado / Gris UX)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#757575',
        included_in_products: ['UX-10'],
      },
    ],
  },
  {
    code_name: '0-60',
    display_name: '0-60',
    sides: 0,
    height_mm: 60,
    weight_min_grams: 6.7,
    weight_max_grams: 7.0,
    stats: { burst_resistance: 75, aerodynamics: 95 },
    variants: [
      {
        variant_id: 'var_r_060_white',
        variant_name: '0-60 (Blanco / Clear)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#FAFAFA',
        included_in_products: ['CX-04'],
      },
    ],
  },
  {
    code_name: '0-70',
    display_name: '0-70',
    sides: 0,
    height_mm: 70,
    weight_min_grams: 6.8,
    weight_max_grams: 7.1,
    stats: { burst_resistance: 75, aerodynamics: 95 },
    variants: [
      {
        variant_id: 'var_r_070_gray',
        variant_name: '0-70 (Gris Neutro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#9E9E9E',
        included_in_products: ['UX-12'],
      },
    ],
  },
'''

missing_bits = '''  {
    code_name: 'D',
    display_name: 'Dot',
    category: 'Defense',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.3,
    weight_max_grams: 2.5,
    stats: { attack: 40, dash: 45, stamina: 85 },
    variants: [
      {
        variant_id: 'var_bit_d_black',
        variant_name: 'Dot (Negro Black Shell - BX-35)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#212121',
        included_in_products: ['BX-35'],
      },
    ],
  },
  {
    code_name: 'W',
    display_name: 'Wedge',
    category: 'Defense',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.4,
    weight_max_grams: 2.6,
    stats: { attack: 50, dash: 60, stamina: 80 },
    variants: [
      {
        variant_id: 'var_bit_w_purple',
        variant_name: 'Wedge (Púrpura Perseus - CX-03)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#4A148C',
        included_in_products: ['CX-03'],
      },
    ],
  },
  {
    code_name: 'WB',
    display_name: 'Wall Ball',
    category: 'Stamina',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.5,
    weight_max_grams: 2.7,
    stats: { attack: 35, dash: 45, stamina: 92 },
    variants: [
      {
        variant_id: 'var_bit_wb_orange',
        variant_name: 'Wall Ball (Naranja Cerberus - CX-08)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#FF6D00',
        included_in_products: ['CX-08'],
      },
    ],
  },
  {
    code_name: 'LO',
    display_name: 'Low Orb',
    category: 'Stamina',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 30, dash: 40, stamina: 90 },
    variants: [
      {
        variant_id: 'var_bit_lo_yellow',
        variant_name: 'Low Orb (Ámbar Wizard Arc - CX-02)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#FFD600',
        included_in_products: ['CX-02'],
      },
    ],
  },
  {
    code_name: 'RA',
    display_name: 'Rubber Accel',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.5,
    weight_max_grams: 2.7,
    stats: { attack: 95, dash: 98, stamina: 30 },
    variants: [
      {
        variant_id: 'var_bit_ra_red',
        variant_name: 'Rubber Accel (Goma Roja Pegasis BX-00)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#D50000',
        included_in_products: ['BX-00'],
      },
    ],
  },
'''

# 1. Insert ratchets before `export const CATALOG_BITS: Bit[] = [`
pos_bits_marker = content.find('export const CATALOG_BITS: Bit[] = [')
if pos_bits_marker != -1:
    pos_ratchets_end = content.rfind('];', 0, pos_bits_marker)
    content = content[:pos_ratchets_end] + missing_ratchets + content[pos_ratchets_end:]
    print("Inserted missing ratchets!")

# 2. Insert bits before `export const CATALOG_PRODUCTS: Product[] = [`
pos_products_marker = content.find('export const CATALOG_PRODUCTS: Product[] = [')
if pos_products_marker != -1:
    pos_bits_end = content.rfind('];', 0, pos_products_marker)
    content = content[:pos_bits_end] + missing_bits + content[pos_bits_end:]
    print("Inserted missing bits!")

with open(catalog_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Catalog updated successfully!")
