import type { Blade, Ratchet, Bit, Product } from '../types/beyblade';

// ============================================================================
// 1. BLADES (CAPAS SUPERIORES DE METAL) - TAKARA TOMY, HASBRO & X-OVER
// ============================================================================
export const CATALOG_BLADES: Blade[] = [
  // --- TAKARA TOMY BASIC LINE (BX) ---
  {
    code_name: 'DRAN_SWORD',
    display_name: 'Dran Sword',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.8,
    weight_max_grams: 35.8,
    stats: { attack: 75, defense: 25, stamina: 25, dash: 80, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_ds_blue',
        variant_name: 'Dran Sword (Azul Clásico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0A4DA2',
        color_secondary_hex: '#E5A823',
        included_in_products: ['BX-01', 'BX-07', 'BX-08'],
      },
      {
        variant_id: 'var_b_ds_red',
        variant_name: 'Dran Sword (Rojo Especial)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'PAINTED_METAL',
        color_primary_hex: '#C00000',
        included_in_products: ['BX-17'],
      },
      {
        variant_id: 'var_b_ds_black',
        variant_name: 'Dran Sword (Negro y Rojo)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'PAINTED_METAL',
        color_primary_hex: '#1A1A1A',
        color_secondary_hex: '#D11A2A',
        included_in_products: ['BX-14-02'],
      },
      {
        variant_id: 'var_b_ds_hasbro',
        variant_name: 'Sword Dran (Hasbro Starter)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0A4DA2',
        hasbro_qr_payload: 'HBX-BLD-SWORD-DRAN-01',
        included_in_products: ['HAS-ST-01'],
      },
    ],
  },
  {
    code_name: 'HELLS_SCYTHE',
    display_name: 'Hells Scythe',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 32.8,
    weight_max_grams: 33.6,
    stats: { attack: 45, defense: 50, stamina: 65, dash: 45, burst_resistance: 55 },
    variants: [
      {
        variant_id: 'var_b_hs_red',
        variant_name: 'Hells Scythe (Rojo Carmesí)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#C00000',
        color_secondary_hex: '#333333',
        included_in_products: ['BX-02', 'BX-08'],
      },
      {
        variant_id: 'var_b_hs_green',
        variant_name: 'Hells Scythe (Verde Esmeralda)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#2E7D32',
        included_in_products: ['BX-14-04'],
      },
      {
        variant_id: 'var_b_hs_hasbro',
        variant_name: 'Scythe Incendio (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#C00000',
        hasbro_qr_payload: 'HBX-BLD-SCYTHE-INC-01',
        included_in_products: ['HAS-ST-02'],
      },
    ],
  },
  {
    code_name: 'WIZARD_ARROW',
    display_name: 'Wizard Arrow',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 31.5,
    weight_max_grams: 32.4,
    stats: { attack: 25, defense: 45, stamina: 80, dash: 30, burst_resistance: 40 },
    variants: [
      {
        variant_id: 'var_b_wa_yellow',
        variant_name: 'Wizard Arrow (Amarillo Clásico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FBC02D',
        included_in_products: ['BX-03', 'BX-05'],
      },
      {
        variant_id: 'var_b_wa_blue',
        variant_name: 'Wizard Arrow (Azul)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#1E88E5',
        included_in_products: ['BX-17'],
      },
      {
        variant_id: 'var_b_wa_hasbro',
        variant_name: 'Arrow Wizard (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FBC02D',
        hasbro_qr_payload: 'HBX-BLD-ARROW-WIZ-01',
        included_in_products: ['HAS-ST-03'],
      },
    ],
  },
  {
    code_name: 'KNIGHT_SHIELD',
    display_name: 'Knight Shield',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 32.2,
    weight_max_grams: 33.1,
    stats: { attack: 20, defense: 80, stamina: 40, dash: 25, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_ks_green',
        variant_name: 'Knight Shield (Verde Oliva)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#558B2F',
        included_in_products: ['BX-04', 'BX-06'],
      },
      {
        variant_id: 'var_b_ks_hasbro',
        variant_name: 'Helm Knight (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#558B2F',
        hasbro_qr_payload: 'HBX-BLD-HELM-KNT-01',
        included_in_products: ['HAS-ST-04'],
      },
    ],
  },
  {
    code_name: 'KNIGHT_LANCE',
    display_name: 'Knight Lance',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 32.9,
    weight_max_grams: 33.8,
    stats: { attack: 30, defense: 85, stamina: 35, dash: 30, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_kl_blue',
        variant_name: 'Knight Lance (Azul Oscuro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0D47A1',
        included_in_products: ['BX-13'],
      },
    ],
  },
  {
    code_name: 'SHARK_EDGE',
    display_name: 'Shark Edge',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.5,
    weight_max_grams: 35.5,
    stats: { attack: 90, defense: 20, stamina: 15, dash: 85, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_se_purple',
        variant_name: 'Shark Edge (Púrpura RB Prize)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#6A1B9A',
        color_secondary_hex: '#00E5FF',
        included_in_products: ['BX-14-01'],
      },
      {
        variant_id: 'var_b_se_yellow',
        variant_name: 'Shark Edge (Amarillo y Negro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FFD600',
        included_in_products: ['BX-20'],
      },
      {
        variant_id: 'var_b_se_hasbro',
        variant_name: 'Keel Shark (Hasbro Starter)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#6A1B9A',
        hasbro_qr_payload: 'HBX-BLD-KEEL-SHK-01',
        included_in_products: ['HAS-ST-05'],
      },
    ],
  },
  {
    code_name: 'LEON_CLAW',
    display_name: 'Leon Claw',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 31.8,
    weight_max_grams: 32.7,
    stats: { attack: 50, defense: 45, stamina: 45, dash: 50, burst_resistance: 55 },
    variants: [
      {
        variant_id: 'var_b_lc_gold',
        variant_name: 'Leon Claw (Dorado / Bronce)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#C5A059',
        included_in_products: ['BX-15'],
      },
      {
        variant_id: 'var_b_lc_hasbro',
        variant_name: 'Claw Leon (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#C5A059',
        hasbro_qr_payload: 'HBX-BLD-CLAW-LEO-01',
        included_in_products: ['HAS-ST-06'],
      },
    ],
  },
  {
    code_name: 'VIPER_TAIL',
    display_name: 'Viper Tail',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.2,
    weight_max_grams: 35.1,
    stats: { attack: 55, defense: 35, stamina: 65, dash: 50, burst_resistance: 50 },
    variants: [
      {
        variant_id: 'var_b_vt_purple',
        variant_name: 'Viper Tail (Violeta Tóxico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#7B1FA2',
        color_secondary_hex: '#76FF03',
        included_in_products: ['BX-16'],
      },
      {
        variant_id: 'var_b_vt_hasbro',
        variant_name: 'Talon Vipe (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#7B1FA2',
        hasbro_qr_payload: 'HBX-BLD-TALON-VIP-01',
        included_in_products: ['HAS-ST-08'],
      },
    ],
  },
  {
    code_name: 'RHINO_HORN',
    display_name: 'Rhino Horn',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 33.2,
    weight_max_grams: 34.1,
    stats: { attack: 35, defense: 75, stamina: 30, dash: 35, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_rh_brown',
        variant_name: 'Rhino Horn (Marrón Tierra)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#75797E',
        color_secondary_hex: '#5D4037',
        included_in_products: ['BX-19'],
      },
      {
        variant_id: 'var_b_rh_hasbro',
        variant_name: 'Horn Rhino (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#5D4037',
        hasbro_qr_payload: 'HBX-BLD-HORN-RHI-01',
        included_in_products: ['HAS-ST-07'],
      },
    ],
  },
  {
    code_name: 'DRAN_DAGGER',
    display_name: 'Dran Dagger',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 35.2,
    weight_max_grams: 36.1,
    stats: { attack: 85, defense: 20, stamina: 20, dash: 88, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_dd_cyan',
        variant_name: 'Dran Dagger (Cyan Metálico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#00ACC1',
        included_in_products: ['BX-20', 'BX-22'],
      },
      {
        variant_id: 'var_b_dd_hasbro',
        variant_name: 'Dagger Dran (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#00ACC1',
        hasbro_qr_payload: 'HBX-BLD-DAGGER-DRN-01',
        included_in_products: ['HAS-ST-09'],
      },
    ],
  },
  {
    code_name: 'HELLS_CHAIN',
    display_name: 'Hells Chain',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.6,
    weight_max_grams: 35.4,
    stats: { attack: 40, defense: 60, stamina: 60, dash: 40, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_hc_red',
        variant_name: 'Hells Chain (Rojo y Oro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#B71C1C',
        color_secondary_hex: '#FFD700',
        included_in_products: ['BX-21'],
      },
    ],
  },
  {
    code_name: 'PHOENIX_WING',
    display_name: 'Phoenix Wing',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 38.0,
    weight_max_grams: 38.9,
    stats: { attack: 85, defense: 50, stamina: 35, dash: 85, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_pw_red',
        variant_name: 'Phoenix Wing (Rojo Pintado Metálico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'PAINTED_METAL',
        color_primary_hex: '#B71234',
        color_secondary_hex: '#F4C430',
        included_in_products: ['BX-23'],
      },
      {
        variant_id: 'var_b_pw_silver',
        variant_name: 'Phoenix Wing (Plata Asian Championship)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'METALLIC_COAT',
        color_primary_hex: '#C0C0C0',
        included_in_products: ['BX-00-EV01'],
      },
      {
        variant_id: 'var_b_pw_hasbro',
        variant_name: 'Soar Phoenix (Hasbro Starter)',
        primary_brand: 'HASBRO',
        finish: 'PAINTED_METAL',
        color_primary_hex: '#B71234',
        hasbro_qr_payload: 'HBX-BLD-SOAR-PHX-01',
        included_in_products: ['HAS-ST-10'],
      },
    ],
  },
  {
    code_name: 'WYVERN_GALE',
    display_name: 'Wyvern Gale',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 33.0,
    weight_max_grams: 33.9,
    stats: { attack: 30, defense: 55, stamina: 70, dash: 35, burst_resistance: 50 },
    variants: [
      {
        variant_id: 'var_b_wg_blue',
        variant_name: 'Wyvern Gale (Verde Azulado RB Prize)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#00897B',
        included_in_products: ['BX-24-01'],
      },
      {
        variant_id: 'var_b_wg_hasbro',
        variant_name: 'Gale Wyvern (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#00897B',
        hasbro_qr_payload: 'HBX-BLD-GALE-WYV-01',
        included_in_products: ['HAS-ST-11'],
      },
    ],
  },
  {
    code_name: 'UNICORN_STING',
    display_name: 'Unicorn Sting',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 33.6,
    weight_max_grams: 34.5,
    stats: { attack: 55, defense: 55, stamina: 50, dash: 55, burst_resistance: 60 },
    variants: [
      {
        variant_id: 'var_b_us_teal',
        variant_name: 'Unicorn Sting (Verde Azulado y Blanco)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#008080',
        color_secondary_hex: '#FFFFFF',
        included_in_products: ['BX-26'],
      },
      {
        variant_id: 'var_b_us_hasbro',
        variant_name: 'Sting Unicorn (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#008080',
        hasbro_qr_payload: 'HBX-BLD-STING-UNI-01',
        included_in_products: ['HAS-ST-12'],
      },
    ],
  },
  {
    code_name: 'SPHINX_COWL',
    display_name: 'Sphinx Cowl',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 33.4,
    weight_max_grams: 34.2,
    stats: { attack: 25, defense: 80, stamina: 40, dash: 25, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_sc_gold',
        variant_name: 'Sphinx Cowl (Oro y Negro RB Prize)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#F57F17',
        color_secondary_hex: '#212121',
        included_in_products: ['BX-27-01'],
      },
    ],
  },
  {
    code_name: 'TYRANNO_BEAT',
    display_name: 'Tyranno Beat',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 37.0,
    weight_max_grams: 38.0,
    stats: { attack: 92, defense: 30, stamina: 20, dash: 88, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_tb_red',
        variant_name: 'Tyranno Beat (Rojo Lava RB Prize)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#D50000',
        color_secondary_hex: '#212121',
        included_in_products: ['BX-31-01'],
      },
      {
        variant_id: 'var_b_tb_hasbro',
        variant_name: 'Roar Tyranno (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#D50000',
        hasbro_qr_payload: 'HBX-BLD-ROAR-TYR-01',
        included_in_products: ['HAS-ST-13'],
      },
    ],
  },
  {
    code_name: 'WEISS_TIGER',
    display_name: 'Weiss Tiger',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.0,
    weight_max_grams: 34.9,
    stats: { attack: 70, defense: 35, stamina: 45, dash: 75, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_wt_white',
        variant_name: 'Weiss Tiger (Blanco Hielo)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#ECEFF1',
        color_secondary_hex: '#00BCD4',
        included_in_products: ['BX-33'],
      },
    ],
  },
  {
    code_name: 'BLACK_SHELL',
    display_name: 'Black Shell',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 33.7,
    weight_max_grams: 34.6,
    stats: { attack: 20, defense: 85, stamina: 45, dash: 20, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_bs_black',
        variant_name: 'Black Shell (Negro Carbón RB Prize)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#212121',
        color_secondary_hex: '#7E57C2',
        included_in_products: ['BX-35-01'],
      },
    ],
  },
  {
    code_name: 'WHALE_WAVE',
    display_name: 'Whale Wave',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 37.2,
    weight_max_grams: 38.2,
    stats: { attack: 88, defense: 40, stamina: 25, dash: 80, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_ww_blue',
        variant_name: 'Whale Wave (Azul Marino RB Prize)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0D47A1',
        color_secondary_hex: '#80D8FF',
        included_in_products: ['BX-36-01'],
      },
    ],
  },

  // --- TAKARA TOMY UNIQUE LINE (UX) ---
  {
    code_name: 'DRAN_BUSTER',
    display_name: 'Dran Buster',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 37.3,
    weight_max_grams: 38.4,
    stats: { attack: 95, defense: 15, stamina: 15, dash: 95, burst_resistance: 80 },
    variants: [
      {
        variant_id: 'var_b_db_blue',
        variant_name: 'Dran Buster (Azul Estándar)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0B5394',
        color_secondary_hex: '#E06666',
        included_in_products: ['UX-01', 'UX-04'],
      },
      {
        variant_id: 'var_b_db_black',
        variant_name: 'Dran Buster (CoroCoro Negro Exclusivo)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'PAINTED_METAL',
        color_primary_hex: '#111111',
        color_secondary_hex: '#CC0000',
        included_in_products: ['UX-00-CC'],
      },
      {
        variant_id: 'var_b_db_hasbro',
        variant_name: 'Buster Dran (Hasbro Starter)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0B5394',
        hasbro_qr_payload: 'HBX-BLD-BUSTER-DRN-01',
        included_in_products: ['HAS-UX-01'],
      },
    ],
  },
  {
    code_name: 'HELLS_HAMMER',
    display_name: 'Hells Hammer',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 33.2,
    weight_max_grams: 34.0,
    stats: { attack: 65, defense: 50, stamina: 45, dash: 60, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_hh_crimson',
        variant_name: 'Hells Hammer (Carmesí Oscuro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#880E4F',
        included_in_products: ['UX-02'],
      },
      {
        variant_id: 'var_b_hh_hasbro',
        variant_name: 'Hammer Incendio (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#880E4F',
        hasbro_qr_payload: 'HBX-BLD-HAMMER-INC-01',
        included_in_products: ['HAS-UX-02'],
      },
    ],
  },
  {
    code_name: 'WIZARD_ROD',
    display_name: 'Wizard Rod',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 35.1,
    weight_max_grams: 35.9,
    stats: { attack: 25, defense: 60, stamina: 96, dash: 30, burst_resistance: 45 },
    variants: [
      {
        variant_id: 'var_b_wzrd_yellow',
        variant_name: 'Wizard Rod (Amarillo Estándar)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#F0C808',
        color_secondary_hex: '#F47A22',
        included_in_products: ['UX-03', 'UX-04'],
      },
      {
        variant_id: 'var_b_wzrd_hasbro',
        variant_name: 'Wand Wizard (Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#F0C808',
        hasbro_qr_payload: 'HBX-BLD-WAND-WIZ-01',
        included_in_products: ['HAS-UX-03'],
      },
    ],
  },
  {
    code_name: 'SHINOBI_SHADOW',
    display_name: 'Shinobi Shadow',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 32.5,
    weight_max_grams: 33.3,
    stats: { attack: 30, defense: 75, stamina: 45, dash: 40, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_ss_purple',
        variant_name: 'Shinobi Shadow (Púrpura y Verde)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#4A148C',
        color_secondary_hex: '#00E676',
        included_in_products: ['UX-05-OLD'],
      },
    ],
  },
  {
    code_name: 'COBALT_DRAGOON',
    display_name: 'Cobalt Dragoon',
    system: 'UX',
    spin_direction: 'LEFT',
    weight_min_grams: 37.8,
    weight_max_grams: 38.7,
    stats: { attack: 88, defense: 40, stamina: 40, dash: 85, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_cd_navy',
        variant_name: 'Cobalt Dragoon (Azul Marino y Cyan)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0D274D',
        color_secondary_hex: '#00E5FF',
        included_in_products: ['UX-05', 'BX-34'],
      },
    ],
  },
  {
    code_name: 'LEON_CREST',
    display_name: 'Leon Crest',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 35.8,
    weight_max_grams: 36.6,
    stats: { attack: 40, defense: 90, stamina: 40, dash: 35, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_lcr_gold',
        variant_name: 'Leon Crest (Oro Metálico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FFB300',
        included_in_products: ['UX-06'],
      },
    ],
  },
  {
    code_name: 'PHOENIX_RUDDER',
    display_name: 'Phoenix Rudder',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 36.2,
    weight_max_grams: 37.1,
    stats: { attack: 45, defense: 45, stamina: 85, dash: 50, burst_resistance: 60 },
    variants: [
      {
        variant_id: 'var_b_pr_orange',
        variant_name: 'Phoenix Rudder (Naranja Fuego Deck Set)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#E65100',
        color_secondary_hex: '#FFD600',
        included_in_products: ['UX-07'],
      },
    ],
  },
  {
    code_name: 'SILVER_WOLF',
    display_name: 'Silver Wolf',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 36.5,
    weight_max_grams: 37.4,
    stats: { attack: 35, defense: 55, stamina: 88, dash: 45, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_sw_silver',
        variant_name: 'Silver Wolf (Gris Plata y Azul)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#CFD8DC',
        color_secondary_hex: '#0288D1',
        included_in_products: ['UX-08'],
      },
    ],
  },
  {
    code_name: 'SAMURAI_SABER',
    display_name: 'Samurai Saber',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 36.8,
    weight_max_grams: 37.7,
    stats: { attack: 85, defense: 35, stamina: 35, dash: 80, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_ssb_crimson',
        variant_name: 'Samurai Saber (Rojo Carmesí y Blanco)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#C62828',
        color_secondary_hex: '#FFFFFF',
        included_in_products: ['UX-09'],
      },
    ],
  },
  {
    code_name: 'KNIGHT_MAIL',
    display_name: 'Knight Mail',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 37.5,
    weight_max_grams: 38.5,
    stats: { attack: 25, defense: 95, stamina: 40, dash: 25, burst_resistance: 85 },
    variants: [
      {
        variant_id: 'var_b_km_silver',
        variant_name: 'Knight Mail (Armadura de Plata Pesada)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#90A4AE',
        included_in_products: ['UX-10'],
      },
    ],
  },
  {
    code_name: 'IMPACT_DRAKE',
    display_name: 'Impact Drake',
    system: 'UX',
    spin_direction: 'RIGHT',
    weight_min_grams: 39.0,
    weight_max_grams: 40.2,
    stats: { attack: 98, defense: 25, stamina: 15, dash: 95, burst_resistance: 85 },
    variants: [
      {
        variant_id: 'var_b_id_blue',
        variant_name: 'Impact Drake (Azul Eléctrico y Goma)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#0D47A1',
        color_secondary_hex: '#FF1744',
        included_in_products: ['UX-11'],
      },
    ],
  },

  // --- PROMOS, LOTTERY & X-OVER REMAKES ---
  {
    code_name: 'COBALT_DRAKE',
    display_name: 'Cobalt Drake',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 38.2,
    weight_max_grams: 39.1,
    stats: { attack: 92, defense: 45, stamina: 30, dash: 88, burst_resistance: 80 },
    variants: [
      {
        variant_id: 'var_b_cdr_blue',
        variant_name: 'Cobalt Drake (Azul Rare Bey Get Battle)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'PAINTED_METAL',
        color_primary_hex: '#002F6C',
        color_secondary_hex: '#00E5FF',
        included_in_products: ['BX-00-DRAKE'],
      },
    ],
  },
  {
    code_name: 'DRANZER_SPIRAL',
    display_name: 'Dranzer Spiral',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 31.0,
    weight_max_grams: 31.8,
    stats: { attack: 55, defense: 40, stamina: 55, dash: 60, burst_resistance: 50 },
    variants: [
      {
        variant_id: 'var_b_dz_blue',
        variant_name: 'Dranzer Spiral (Azul X-Over Clásico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#1565C0',
        included_in_products: ['BX-00-DRANZER'],
      },
    ],
  },
  {
    code_name: 'DRIGER_SLASH',
    display_name: 'Driger Slash',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 32.5,
    weight_max_grams: 33.3,
    stats: { attack: 65, defense: 45, stamina: 45, dash: 65, burst_resistance: 55 },
    variants: [
      {
        variant_id: 'var_b_dg_white',
        variant_name: 'Driger Slash (Blanco X-Over)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FAFAFA',
        included_in_products: ['BX-00-DRIGER'],
      },
    ],
  },
  {
    code_name: 'DRAGOON_STORM',
    display_name: 'Dragoon Storm',
    system: 'BX',
    spin_direction: 'LEFT',
    weight_min_grams: 33.0,
    weight_max_grams: 33.9,
    stats: { attack: 85, defense: 25, stamina: 25, dash: 85, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_ds_storm_white',
        variant_name: 'Dragoon Storm (Blanco X-Over Izquierda)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#FFFFFF',
        color_secondary_hex: '#0288D1',
        included_in_products: ['BX-00-DRAGOON'],
      },
    ],
  },
  {
    code_name: 'LIGHTNING_L_DRAGO',
    display_name: 'Lightning L-Drago',
    system: 'BX',
    spin_direction: 'LEFT',
    weight_min_grams: 34.5,
    weight_max_grams: 35.5,
    stats: { attack: 95, defense: 20, stamina: 20, dash: 90, burst_resistance: 75 },
    variants: [
      {
        variant_id: 'var_b_ldrago_rapid',
        variant_name: 'Lightning L-Drago (Modo Ráfaga)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#37474F',
        color_secondary_hex: '#D50000',
        included_in_products: ['BX-00-LDRAGO'],
      },
      {
        variant_id: 'var_b_ldrago_upper',
        variant_name: 'Lightning L-Drago (Modo Upper)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#37474F',
        color_secondary_hex: '#E0E0E0',
        included_in_products: ['BX-00-LDRAGO-UP'],
      },
    ],
  },

  // --- HASBRO EXCLUSIVES ---
  {
    code_name: 'BITE_CROC',
    display_name: 'Bite Croc',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 32.8,
    weight_max_grams: 33.7,
    stats: { attack: 75, defense: 30, stamina: 35, dash: 70, burst_resistance: 60 },
    variants: [
      {
        variant_id: 'var_b_bc_green',
        variant_name: 'Bite Croc (Verde Lima Hasbro Dual Pack)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#64DD17',
        hasbro_qr_payload: 'HBX-BLD-BITE-CROC-01',
        included_in_products: ['HAS-DP-01'],
      },
    ],
  },
  {
    code_name: 'STEEL_SAMURAI',
    display_name: 'Steel Samurai',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 33.5,
    weight_max_grams: 34.4,
    stats: { attack: 65, defense: 45, stamina: 40, dash: 60, burst_resistance: 65 },
    variants: [
      {
        variant_id: 'var_b_sts_blue',
        variant_name: 'Steel Samurai (Azul Marino Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#1A237E',
        hasbro_qr_payload: 'HBX-BLD-STEEL-SAM-01',
        included_in_products: ['HAS-DP-02'],
      },
    ],
  },
  {
    code_name: 'MAMMOTH_TUSK',
    display_name: 'Mammoth Tusk',
    system: 'BX',
    spin_direction: 'RIGHT',
    weight_min_grams: 34.0,
    weight_max_grams: 34.9,
    stats: { attack: 45, defense: 75, stamina: 35, dash: 40, burst_resistance: 70 },
    variants: [
      {
        variant_id: 'var_b_mt_hasbro_purple',
        variant_name: 'Tusk Mammoth (Set de Batalla Hasbro - Púrpura)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#75797E',
        color_secondary_hex: '#6A123E',
        hasbro_qr_payload: 'HBX-BLD-MAMMOTH-TSK-01',
        included_in_products: ['HAS-SET-01', 'HAS-DP-03'],
      },
      {
        variant_id: 'var_b_mt_orange',
        variant_name: 'Tusk Mammoth (Naranja Óxido Hasbro)',
        primary_brand: 'HASBRO',
        finish: 'STANDARD_RAW_METAL',
        color_primary_hex: '#75797E',
        color_secondary_hex: '#BF360C',
        hasbro_qr_payload: 'HBX-BLD-MAMMOTH-TSK-01',
        included_in_products: ['HAS-DP-03'],
      },
      {
        variant_id: 'var_b_mt_black',
        variant_name: 'Mammoth Tusk (Metal Coat: Black - BX-00)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'PAINTED_METAL',
        color_primary_hex: '#212121',
        color_secondary_hex: '#7B1F4A',
        included_in_products: ['BX-00'],
      },
    ],
  },
  // --- TAKARA TOMY EXPANSIONS & RECENT BX RELEASES ---
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
];

// ============================================================================
// 2. RATCHETS (DISCOS INTERMEDIOS DE ALTURA Y SALIENTES)
// ============================================================================
export const CATALOG_RATCHETS: Ratchet[] = [
  // --- 60 mm de altura ---
  {
    code_name: '1-60',
    display_name: '1-60',
    sides: 1,
    height_mm: 60,
    weight_min_grams: 6.1,
    weight_max_grams: 6.4,
    stats: { burst_resistance: 80, aerodynamics: 60 },
    variants: [
      {
        variant_id: 'var_r_160_blue',
        variant_name: '1-60 (Azul / Negro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#0B5394',
        included_in_products: ['UX-01'],
      },
    ],
  },
  {
    code_name: '2-60',
    display_name: '2-60',
    sides: 2,
    height_mm: 60,
    weight_min_grams: 6.0,
    weight_max_grams: 6.3,
    stats: { burst_resistance: 70, aerodynamics: 65 },
    variants: [
      {
        variant_id: 'var_r_260_navy',
        variant_name: '2-60 (Azul Marino)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#0D274D',
        included_in_products: ['UX-05', 'BX-34'],
      },
    ],
  },
  {
    code_name: '3-60',
    display_name: '3-60',
    sides: 3,
    height_mm: 60,
    weight_min_grams: 6.1,
    weight_max_grams: 6.4,
    stats: { burst_resistance: 60, aerodynamics: 75 },
    variants: [
      {
        variant_id: 'var_r_360_red',
        variant_name: '3-60 (Rojo / Negro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#C00000',
        included_in_products: ['BX-01', 'BX-08'],
      },
      {
        variant_id: 'var_r_360_white',
        variant_name: '3-60 (Blanco / Claro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#EEEEEE',
        included_in_products: ['BX-03'],
      },
    ],
  },
  {
    code_name: '4-60',
    display_name: '4-60',
    sides: 4,
    height_mm: 60,
    weight_min_grams: 6.2,
    weight_max_grams: 6.5,
    stats: { burst_resistance: 65, aerodynamics: 70 },
    variants: [
      {
        variant_id: 'var_r_460_black',
        variant_name: '4-60 (Negro / Rojo)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#212121',
        included_in_products: ['BX-02', 'BX-22'],
      },
    ],
  },
  {
    code_name: '5-60',
    display_name: '5-60',
    sides: 5,
    height_mm: 60,
    weight_min_grams: 6.3,
    weight_max_grams: 6.6,
    stats: { burst_resistance: 70, aerodynamics: 70 },
    variants: [
      {
        variant_id: 'var_r_560_red',
        variant_name: '5-60 (Rojo / Naranja)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#B71234',
        included_in_products: ['BX-23'],
      },
      {
        variant_id: 'var_r_560_gold',
        variant_name: '5-60 (Dorado Leon Claw)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#C5A059',
        included_in_products: ['BX-15'],
      },
    ],
  },
  {
    code_name: '7-60',
    display_name: '7-60',
    sides: 7,
    height_mm: 60,
    weight_min_grams: 6.3,
    weight_max_grams: 6.6,
    stats: { burst_resistance: 75, aerodynamics: 80 },
    variants: [
      {
        variant_id: 'var_r_760_gold',
        variant_name: '7-60 (Oro Leon Crest)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#FFB300',
        included_in_products: ['UX-06'],
      },
    ],
  },
  {
    code_name: '9-60',
    display_name: '9-60',
    sides: 9,
    height_mm: 60,
    weight_min_grams: 6.4,
    weight_max_grams: 6.7,
    stats: { burst_resistance: 85, aerodynamics: 85 },
    variants: [
      {
        variant_id: 'var_r_960_green',
        variant_name: '9-60 (Verde / Negro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#2E7D32',
        included_in_products: ['UX-03'],
      },
      {
        variant_id: 'var_r_960_clear_blue',
        variant_name: '9-60 (Azul Translúcido)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#1E88E5',
        included_in_products: ['BX-24'],
      },
    ],
  },

  // --- 70 mm de altura ---
  {
    code_name: '1-70',
    display_name: '1-70',
    sides: 1,
    height_mm: 70,
    weight_min_grams: 6.3,
    weight_max_grams: 6.6,
    stats: { burst_resistance: 75, aerodynamics: 60 },
    variants: [
      {
        variant_id: 'var_r_170_yellow',
        variant_name: '1-70 (Amarillo / Negro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#FDD835',
        included_in_products: ['BX-35'],
      },
    ],
  },
  {
    code_name: '2-70',
    display_name: '2-70',
    sides: 2,
    height_mm: 70,
    weight_min_grams: 6.2,
    weight_max_grams: 6.5,
    stats: { burst_resistance: 70, aerodynamics: 65 },
    variants: [
      {
        variant_id: 'var_r_270_red',
        variant_name: '2-70 (Rojo Samurai)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#C62828',
        included_in_products: ['UX-09'],
      },
    ],
  },
  {
    code_name: '3-70',
    display_name: '3-70',
    sides: 3,
    height_mm: 70,
    weight_min_grams: 6.3,
    weight_max_grams: 6.6,
    stats: { burst_resistance: 65, aerodynamics: 70 },
    variants: [
      {
        variant_id: 'var_r_370_crimson',
        variant_name: '3-70 (Carmesí Hells Hammer)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#880E4F',
        included_in_products: ['UX-02'],
      },
    ],
  },
  {
    code_name: '4-70',
    display_name: '4-70',
    sides: 4,
    height_mm: 70,
    weight_min_grams: 6.4,
    weight_max_grams: 6.7,
    stats: { burst_resistance: 70, aerodynamics: 68 },
    variants: [
      {
        variant_id: 'var_r_470_red',
        variant_name: '4-70 (Rojo Tyranno)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#D50000',
        included_in_products: ['BX-31'],
      },
    ],
  },
  {
    code_name: '5-70',
    display_name: '5-70',
    sides: 5,
    height_mm: 70,
    weight_min_grams: 6.5,
    weight_max_grams: 6.8,
    stats: { burst_resistance: 72, aerodynamics: 68 },
    variants: [
      {
        variant_id: 'var_r_570_orange',
        variant_name: '5-70 (Naranja Wizard Rod Booster)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#FB8C00',
        included_in_products: ['UX-03'],
      },
    ],
  },
  {
    code_name: '7-70',
    display_name: '7-70',
    sides: 7,
    height_mm: 70,
    weight_min_grams: 6.5,
    weight_max_grams: 6.8,
    stats: { burst_resistance: 76, aerodynamics: 75 },
    variants: [
      {
        variant_id: 'var_r_770_teal',
        variant_name: '7-70 (Verde Azulado)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#00897B',
        included_in_products: ['BX-36'],
      },
    ],
  },
  {
    code_name: '9-70',
    display_name: '9-70',
    sides: 9,
    height_mm: 70,
    weight_min_grams: 6.6,
    weight_max_grams: 6.9,
    stats: { burst_resistance: 82, aerodynamics: 80 },
    variants: [
      {
        variant_id: 'var_r_970_orange',
        variant_name: '9-70 (Naranja Fuego Phoenix Rudder)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#E65100',
        included_in_products: ['UX-07'],
      },
    ],
  },

  // --- 80 mm de altura ---
  {
    code_name: '1-80',
    display_name: '1-80',
    sides: 1,
    height_mm: 80,
    weight_min_grams: 6.4,
    weight_max_grams: 6.7,
    stats: { burst_resistance: 70, aerodynamics: 55 },
    variants: [
      {
        variant_id: 'var_r_180_purple',
        variant_name: '1-80 (Púrpura Shinobi)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#4A148C',
        included_in_products: ['UX-05-OLD'],
      },
    ],
  },
  {
    code_name: '3-80',
    display_name: '3-80',
    sides: 3,
    height_mm: 80,
    weight_min_grams: 6.5,
    weight_max_grams: 6.8,
    stats: { burst_resistance: 55, aerodynamics: 65 },
    variants: [
      {
        variant_id: 'var_r_380_yellow',
        variant_name: '3-80 (Amarillo / Negro)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#FBC02D',
        included_in_products: ['BX-04'],
      },
      {
        variant_id: 'var_r_380_silver',
        variant_name: '3-80 (Plata Silver Wolf)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#B0BEC5',
        included_in_products: ['UX-08'],
      },
    ],
  },
  {
    code_name: '4-80',
    display_name: '4-80',
    sides: 4,
    height_mm: 80,
    weight_min_grams: 6.5,
    weight_max_grams: 6.8,
    stats: { burst_resistance: 60, aerodynamics: 65 },
    variants: [
      {
        variant_id: 'var_r_480_green',
        variant_name: '4-80 (Verde Wizard Arrow)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#388E3C',
        included_in_products: ['BX-03'],
      },
    ],
  },
  {
    code_name: '5-80',
    display_name: '5-80',
    sides: 5,
    height_mm: 80,
    weight_min_grams: 6.6,
    weight_max_grams: 6.9,
    stats: { burst_resistance: 65, aerodynamics: 65 },
    variants: [
      {
        variant_id: 'var_r_580_purple',
        variant_name: '5-80 (Violeta Viper Tail)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#7B1FA2',
        included_in_products: ['BX-16'],
      },
    ],
  },
  {
    code_name: '9-80',
    display_name: '9-80',
    sides: 9,
    height_mm: 80,
    weight_min_grams: 6.7,
    weight_max_grams: 7.0,
    stats: { burst_resistance: 78, aerodynamics: 75 },
    variants: [
      {
        variant_id: 'var_r_980_gold',
        variant_name: '9-80 (Oro Sphinx Cowl)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#F57F17',
        included_in_products: ['BX-27'],
      },
    ],
  },

  // --- 85 mm Especial ---
  {
    code_name: '3-85',
    display_name: '3-85',
    sides: 3,
    height_mm: 85,
    weight_min_grams: 6.7,
    weight_max_grams: 7.1,
    stats: { burst_resistance: 50, aerodynamics: 60 },
    variants: [
      {
        variant_id: 'var_r_385_silver',
        variant_name: '3-85 (Plata Knight Mail)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#78909C',
        included_in_products: ['UX-10'],
      },
    ],
  },
  {
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
  {
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
];

// ============================================================================
// 3. BITS (PUNTAS DE RENDIMIENTO & ENGRANAJE XTREME DASH)
// ============================================================================
export const CATALOG_BITS: Bit[] = [
  // --- TIPO ATAQUE ---
  {
    code_name: 'F',
    display_name: 'Flat',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.1,
    weight_max_grams: 2.3,
    stats: { attack: 85, dash: 85, stamina: 15 },
    variants: [
      {
        variant_id: 'var_bit_flat_blue',
        variant_name: 'Flat (Azul Clásico)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#0A4DA2',
        included_in_products: ['BX-01', 'BX-08'],
      },
    ],
  },
  {
    code_name: 'LF',
    display_name: 'Low Flat',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.0,
    weight_max_grams: 2.2,
    stats: { attack: 92, dash: 90, stamina: 12 },
    variants: [
      {
        variant_id: 'var_bit_lf_purple',
        variant_name: 'Low Flat (Púrpura Shark Edge)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#6A1B9A',
        included_in_products: ['BX-14-01'],
      },
    ],
  },
  {
    code_name: 'GF',
    display_name: 'Gear Flat',
    category: 'Attack / Dash',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 95, dash: 98, stamina: 10 },
    variants: [
      {
        variant_id: 'var_bit_gf_red',
        variant_name: 'Gear Flat (Rojo Carmesí Phoenix)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#B71234',
        included_in_products: ['BX-23'],
      },
    ],
  },
  {
    code_name: 'A',
    display_name: 'Accel',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 90, dash: 92, stamina: 12 },
    variants: [
      {
        variant_id: 'var_bit_a_blue',
        variant_name: 'Accel (Azul Claro Dran Buster)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#0288D1',
        included_in_products: ['UX-01'],
      },
    ],
  },
  {
    code_name: 'R',
    display_name: 'Rush',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.1,
    weight_max_grams: 2.3,
    stats: { attack: 80, dash: 88, stamina: 20 },
    variants: [
      {
        variant_id: 'var_bit_r_cyan',
        variant_name: 'Rush (Cyan Dran Dagger)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#00ACC1',
        included_in_products: ['BX-20', 'BX-22'],
      },
    ],
  },
  {
    code_name: 'Q',
    display_name: 'Quake',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.3,
    weight_max_grams: 2.5,
    stats: { attack: 96, dash: 85, stamina: 8 },
    variants: [
      {
        variant_id: 'var_bit_q_red',
        variant_name: 'Quake (Rojo Tyranno Beat)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#D50000',
        included_in_products: ['BX-31'],
      },
    ],
  },
  {
    code_name: 'C',
    display_name: 'Cyclone',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 88, dash: 86, stamina: 18 },
    variants: [
      {
        variant_id: 'var_bit_c_navy',
        variant_name: 'Cyclone (Azul Marino Dragoon)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#0D274D',
        included_in_products: ['UX-05', 'BX-34'],
      },
    ],
  },
  {
    code_name: 'L',
    display_name: 'Level',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 85, dash: 88, stamina: 16 },
    variants: [
      {
        variant_id: 'var_bit_l_crimson',
        variant_name: 'Level (Rojo Samurai Saber)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#C62828',
        included_in_products: ['UX-09'],
      },
    ],
  },
  {
    code_name: 'LR',
    display_name: 'Left Rubber',
    category: 'Attack',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.4,
    weight_max_grams: 2.6,
    stats: { attack: 98, dash: 92, stamina: 8 },
    variants: [
      {
        variant_id: 'var_bit_lr_red',
        variant_name: 'Left Rubber (Goma Roja Impact Drake)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#FF1744',
        included_in_products: ['UX-11'],
      },
    ],
  },

  // --- TIPO RESISTENCIA (STAMINA) ---
  {
    code_name: 'B',
    display_name: 'Ball',
    category: 'Stamina',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.1,
    weight_max_grams: 2.3,
    stats: { attack: 10, dash: 20, stamina: 96 },
    variants: [
      {
        variant_id: 'var_bit_ball_yellow',
        variant_name: 'Ball (Amarillo Translúcido)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#F0C808',
        included_in_products: ['BX-03', 'BX-08'],
      },
    ],
  },
  {
    code_name: 'DB',
    display_name: 'Disc Ball',
    category: 'Stamina',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.4,
    weight_max_grams: 2.6,
    stats: { attack: 15, dash: 25, stamina: 98 },
    variants: [
      {
        variant_id: 'var_bit_db_orange',
        variant_name: 'Disc Ball (Naranja Wizard Rod)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#FF9800',
        included_in_products: ['UX-03'],
      },
    ],
  },
  {
    code_name: 'O',
    display_name: 'Orb',
    category: 'Stamina',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.1,
    weight_max_grams: 2.3,
    stats: { attack: 15, dash: 25, stamina: 92 },
    variants: [
      {
        variant_id: 'var_bit_o_purple',
        variant_name: 'Orb (Violeta Viper Tail)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#7B1FA2',
        included_in_products: ['BX-16'],
      },
    ],
  },
  {
    code_name: 'G',
    display_name: 'Glide',
    category: 'Stamina',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 15, dash: 30, stamina: 94 },
    variants: [
      {
        variant_id: 'var_bit_g_orange',
        variant_name: 'Glide (Naranja Phoenix Rudder)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#E65100',
        included_in_products: ['UX-07'],
      },
    ],
  },
  {
    code_name: 'FB',
    display_name: 'Free Ball',
    category: 'Stamina',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.3,
    weight_max_grams: 2.5,
    stats: { attack: 12, dash: 28, stamina: 97 },
    variants: [
      {
        variant_id: 'var_bit_fb_silver',
        variant_name: 'Free Ball (Gris Silver Wolf)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#90A4AE',
        included_in_products: ['UX-08'],
      },
    ],
  },

  // --- TIPO DEFENSA ---
  {
    code_name: 'N',
    display_name: 'Needle',
    category: 'Defense',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.1,
    weight_max_grams: 2.3,
    stats: { attack: 15, dash: 15, stamina: 65 },
    variants: [
      {
        variant_id: 'var_bit_n_green',
        variant_name: 'Needle (Verde Knight Shield)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#558B2F',
        included_in_products: ['BX-04'],
      },
    ],
  },
  {
    code_name: 'HN',
    display_name: 'High Needle',
    category: 'Defense',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 20, dash: 20, stamina: 60 },
    variants: [
      {
        variant_id: 'var_bit_hn_blue',
        variant_name: 'High Needle (Azul Knight Lance)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#0D47A1',
        included_in_products: ['BX-13'],
      },
    ],
  },
  {
    code_name: 'GN',
    display_name: 'Gear Needle',
    category: 'Defense',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.3,
    weight_max_grams: 2.5,
    stats: { attack: 35, dash: 65, stamina: 55 },
    variants: [
      {
        variant_id: 'var_bit_gn_gold',
        variant_name: 'Gear Needle (Oro Sphinx Cowl)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#F57F17',
        included_in_products: ['BX-27', 'UX-06'],
      },
    ],
  },
  {
    code_name: 'H',
    display_name: 'Hexa',
    category: 'Defense',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 30, dash: 45, stamina: 70 },
    variants: [
      {
        variant_id: 'var_bit_h_crimson',
        variant_name: 'Hexa (Carmesí Hells Hammer)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#880E4F',
        included_in_products: ['UX-02'],
      },
    ],
  },
  {
    code_name: 'MN',
    display_name: 'Metal Needle',
    category: 'Defense',
    burst_resistance_tier: 'NORMAL',
    weight_min_grams: 2.6,
    weight_max_grams: 2.8,
    stats: { attack: 20, dash: 20, stamina: 65 },
    variants: [
      {
        variant_id: 'var_bit_mn_purple',
        variant_name: 'Metal Needle (Punta de Metal Shinobi)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#4A148C',
        included_in_products: ['UX-05-OLD'],
      },
    ],
  },
  {
    code_name: 'BS',
    display_name: 'Bound Spike',
    category: 'Defense',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.4,
    weight_max_grams: 2.6,
    stats: { attack: 25, dash: 30, stamina: 70 },
    variants: [
      {
        variant_id: 'var_bit_bs_silver',
        variant_name: 'Bound Spike (Resorte Knight Mail)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#78909C',
        included_in_products: ['UX-10'],
      },
    ],
  },

  // --- TIPO BALANCE ---
  {
    code_name: 'T',
    display_name: 'Taper',
    category: 'Balance',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.1,
    weight_max_grams: 2.3,
    stats: { attack: 60, dash: 65, stamina: 55 },
    variants: [
      {
        variant_id: 'var_bit_t_red',
        variant_name: 'Taper (Rojo Hells Scythe)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#D32F2F',
        included_in_products: ['BX-02'],
      },
    ],
  },
  {
    code_name: 'HT',
    display_name: 'High Taper',
    category: 'Balance',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 65, dash: 70, stamina: 50 },
    variants: [
      {
        variant_id: 'var_bit_ht_red',
        variant_name: 'High Taper (Rojo Hells Chain)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#B71C1C',
        included_in_products: ['BX-21'],
      },
    ],
  },
  {
    code_name: 'P',
    display_name: 'Point',
    category: 'Balance',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.2,
    weight_max_grams: 2.4,
    stats: { attack: 65, dash: 70, stamina: 60 },
    variants: [
      {
        variant_id: 'var_bit_p_gold',
        variant_name: 'Point (Oro Leon Claw)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#C5A059',
        included_in_products: ['BX-15'],
      },
    ],
  },
  {
    code_name: 'GP',
    display_name: 'Gear Point',
    category: 'Balance',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.3,
    weight_max_grams: 2.5,
    stats: { attack: 75, dash: 85, stamina: 50 },
    variants: [
      {
        variant_id: 'var_bit_gp_teal',
        variant_name: 'Gear Point (Teal Unicorn Sting)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#008080',
        included_in_products: ['BX-26'],
      },
    ],
  },
  {
    code_name: 'U',
    display_name: 'Unite',
    category: 'Balance',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.3,
    weight_max_grams: 2.5,
    stats: { attack: 70, dash: 75, stamina: 58 },
    variants: [
      {
        variant_id: 'var_bit_u_white',
        variant_name: 'Unite (Goma / Plástico Weiss Tiger)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'OPAQUE_SOLID' as any,
        color_primary_hex: '#ECEFF1',
        included_in_products: ['BX-33'],
      },
    ],
  },
  {
    code_name: 'E',
    display_name: 'Elevate',
    category: 'Balance',
    burst_resistance_tier: 'HIGH',
    weight_min_grams: 2.4,
    weight_max_grams: 2.6,
    stats: { attack: 65, dash: 80, stamina: 62 },
    variants: [
      {
        variant_id: 'var_bit_e_blue',
        variant_name: 'Elevate (Azul Whale Wave)',
        primary_brand: 'TAKARA_TOMY',
        finish: 'TRANSLUCENT',
        color_primary_hex: '#0D47A1',
        included_in_products: ['BX-36'],
      },
    ],
  },
  {
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
  {
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
];

// ============================================================================
// 4. PRODUCTOS Y SETS COMERCIALES (TAKARA TOMY & HASBRO)
// ============================================================================
export const CATALOG_PRODUCTS: Product[] = [
  // --- TAKARA TOMY BX SERIES ---
  {
    sku_code: 'BX-01',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Dran Sword 3-60F (String Launcher Incl.)',
    release_date: '2023-07-15',
    barcode_jan_upc: '4904810910541',
  },
  {
    sku_code: 'BX-02',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Hells Scythe 4-60T (Ripcord Launcher Incl.)',
    release_date: '2023-07-15',
    barcode_jan_upc: '4904810910558',
  },
  {
    sku_code: 'BX-03',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Wizard Arrow 4-80B',
    release_date: '2023-07-15',
    barcode_jan_upc: '4904810910565',
  },
  {
    sku_code: 'BX-04',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Knight Shield 3-80N',
    release_date: '2023-07-15',
    barcode_jan_upc: '4904810910572',
  },
  {
    sku_code: 'BX-07',
    brand: 'TAKARA_TOMY',
    product_type: 'SET',
    official_title: 'Start Dash Set (Dran Sword 3-60F Special + Stadium + Launcher Grip)',
    release_date: '2023-07-15',
    barcode_jan_upc: '4904810910602',
  },
  {
    sku_code: 'BX-08',
    brand: 'TAKARA_TOMY',
    product_type: 'DECK_SET',
    official_title: '3on3 Deck Set (Hells Scythe 3-80B, Wizard Arrow 4-60N, Dran Sword 3-60F)',
    release_date: '2023-07-15',
    barcode_jan_upc: '4904810910619',
  },
  {
    sku_code: 'BX-13',
    brand: 'TAKARA_TOMY',
    product_type: 'BOOSTER',
    official_title: 'Booster Knight Lance 4-80HN',
    release_date: '2023-08-10',
    barcode_jan_upc: '4904810912880',
  },
  {
    sku_code: 'BX-14',
    brand: 'TAKARA_TOMY',
    product_type: 'RANDOM_BOOSTER',
    official_title: 'Random Booster Vol. 1 (Shark Edge 3-60LF Prize)',
    release_date: '2023-09-09',
    barcode_jan_upc: '4904810912897',
  },
  {
    sku_code: 'BX-15',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Leon Claw 5-60P',
    release_date: '2023-10-07',
    barcode_jan_upc: '4904810912903',
  },
  {
    sku_code: 'BX-16',
    brand: 'TAKARA_TOMY',
    product_type: 'BOOSTER',
    official_title: 'Booster Viper Tail 5-80O',
    release_date: '2023-10-07',
    barcode_jan_upc: '4904810912910',
  },
  {
    sku_code: 'BX-17',
    brand: 'TAKARA_TOMY',
    product_type: 'SET',
    official_title: 'Battle Entry Set (Dran Sword Red + Wizard Arrow Blue + Xtreme Stadium)',
    release_date: '2023-10-21',
    barcode_jan_upc: '4904810912927',
  },
  {
    sku_code: 'BX-19',
    brand: 'TAKARA_TOMY',
    product_type: 'BOOSTER',
    official_title: 'Booster Rhino Horn 3-80S',
    release_date: '2023-11-02',
    barcode_jan_upc: '4904810912941',
  },
  {
    sku_code: 'BX-20',
    brand: 'TAKARA_TOMY',
    product_type: 'DECK_SET',
    official_title: 'Dran Dagger Deck Set (Dran Dagger 4-60R + Knight Shield + Shark Edge)',
    release_date: '2023-11-18',
    barcode_jan_upc: '4904810912958',
  },
  {
    sku_code: 'BX-21',
    brand: 'TAKARA_TOMY',
    product_type: 'DECK_SET',
    official_title: 'Hells Chain Deck Set (Hells Chain 5-60HT + Knight Lance + Wizard Arrow)',
    release_date: '2023-11-18',
    barcode_jan_upc: '4904810912965',
  },
  {
    sku_code: 'BX-23',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Phoenix Wing 9-60GF (String Launcher Incl.)',
    release_date: '2023-12-27',
    barcode_jan_upc: '4904810912989',
  },
  {
    sku_code: 'BX-24',
    brand: 'TAKARA_TOMY',
    product_type: 'RANDOM_BOOSTER',
    official_title: 'Random Booster Vol. 2 (Wyvern Gale 5-80GB Prize)',
    release_date: '2024-01-27',
    barcode_jan_upc: '4904810912996',
  },
  {
    sku_code: 'BX-26',
    brand: 'TAKARA_TOMY',
    product_type: 'BOOSTER',
    official_title: 'Booster Unicorn Sting 5-60GP',
    release_date: '2024-02-22',
    barcode_jan_upc: '4904810914402',
  },
  {
    sku_code: 'BX-27',
    brand: 'TAKARA_TOMY',
    product_type: 'RANDOM_BOOSTER',
    official_title: 'Random Booster Sphinx Cowl Select (Sphinx Cowl 9-80GN Prize)',
    release_date: '2024-02-22',
    barcode_jan_upc: '4904810914419',
  },
  {
    sku_code: 'BX-31',
    brand: 'TAKARA_TOMY',
    product_type: 'RANDOM_BOOSTER',
    official_title: 'Random Booster Vol. 3 (Tyranno Beat 4-70Q Prize)',
    release_date: '2024-04-27',
    barcode_jan_upc: '4904810914433',
  },
  {
    sku_code: 'BX-33',
    brand: 'TAKARA_TOMY',
    product_type: 'BOOSTER',
    official_title: 'Booster Weiss Tiger 3-60U',
    release_date: '2024-06-29',
    barcode_jan_upc: '4904810914457',
  },
  {
    sku_code: 'BX-34',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Cobalt Dragoon 2-60C (Left Spin String Launcher Incl.)',
    release_date: '2024-07-13',
    barcode_jan_upc: '4904810914488',
  },
  {
    sku_code: 'BX-35',
    brand: 'TAKARA_TOMY',
    product_type: 'RANDOM_BOOSTER',
    official_title: 'Random Booster Vol. 4 (Black Shell 4-60D Prize)',
    release_date: '2024-07-13',
    barcode_jan_upc: '4904810914495',
  },
  {
    sku_code: 'BX-36',
    brand: 'TAKARA_TOMY',
    product_type: 'RANDOM_BOOSTER',
    official_title: 'Random Booster Whale Wave Select (Whale Wave 5-80E Prize)',
    release_date: '2024-09-14',
    barcode_jan_upc: '4904810914501',
  },

  // --- TAKARA TOMY UNIQUE LINE (UX) ---
  {
    sku_code: 'UX-01',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Dran Buster 1-60A (Ripcord Launcher Incl.)',
    release_date: '2024-03-30',
    barcode_jan_upc: '4904810914440',
  },
  {
    sku_code: 'UX-02',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Hells Hammer 3-70H',
    release_date: '2024-03-30',
    barcode_jan_upc: '4904810914457',
  },
  {
    sku_code: 'UX-03',
    brand: 'TAKARA_TOMY',
    product_type: 'BOOSTER',
    official_title: 'Booster Wizard Rod 5-70DB',
    release_date: '2024-03-30',
    barcode_jan_upc: '4904810914464',
  },
  {
    sku_code: 'UX-04',
    brand: 'TAKARA_TOMY',
    product_type: 'SET',
    official_title: 'Battle Entry Set UX (Dran Buster + Wizard Rod + Stadium)',
    release_date: '2024-03-30',
    barcode_jan_upc: '4904810914471',
  },
  {
    sku_code: 'UX-06',
    brand: 'TAKARA_TOMY',
    product_type: 'BOOSTER',
    official_title: 'Booster Leon Crest 7-60GN',
    release_date: '2024-08-10',
    barcode_jan_upc: '4904810914518',
  },
  {
    sku_code: 'UX-07',
    brand: 'TAKARA_TOMY',
    product_type: 'DECK_SET',
    official_title: 'Phoenix Rudder Deck Set (Phoenix Rudder 9-70G + Wyvern Gale + Sphinx Cowl)',
    release_date: '2024-09-14',
    barcode_jan_upc: '4904810914525',
  },
  {
    sku_code: 'UX-08',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Silver Wolf 3-80FB',
    release_date: '2024-10-12',
    barcode_jan_upc: '4904810914532',
  },
  {
    sku_code: 'UX-09',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Samurai Saber 2-70L (Hold Launcher Incl.)',
    release_date: '2024-11-09',
    barcode_jan_upc: '4904810914549',
  },
  {
    sku_code: 'UX-10',
    brand: 'TAKARA_TOMY',
    product_type: 'BOOSTER',
    official_title: 'Booster Knight Mail 3-85BS',
    release_date: '2024-12-07',
    barcode_jan_upc: '4904810914556',
  },
  {
    sku_code: 'UX-11',
    brand: 'TAKARA_TOMY',
    product_type: 'STARTER',
    official_title: 'Starter Impact Drake 9-60LR',
    release_date: '2024-12-27',
    barcode_jan_upc: '4904810914563',
  },

  // --- HASBRO STARTERS & DUAL PACKS ---
  {
    sku_code: 'HAS-ST-01',
    brand: 'HASBRO',
    product_type: 'STARTER',
    official_title: 'Beyblade X Sword Dran 3-60F Starter Pack',
    release_date: '2024-06-01',
    barcode_jan_upc: '195166249483',
  },
  {
    sku_code: 'HAS-ST-02',
    brand: 'HASBRO',
    product_type: 'STARTER',
    official_title: 'Beyblade X Scythe Incendio 4-60T Starter Pack',
    release_date: '2024-06-01',
    barcode_jan_upc: '195166249490',
  },
  {
    sku_code: 'HAS-ST-03',
    brand: 'HASBRO',
    product_type: 'STARTER',
    official_title: 'Beyblade X Arrow Wizard 4-80B Starter Pack',
    release_date: '2024-06-01',
    barcode_jan_upc: '195166249506',
  },
  {
    sku_code: 'HAS-ST-04',
    brand: 'HASBRO',
    product_type: 'STARTER',
    official_title: 'Beyblade X Helm Knight 3-80N Starter Pack',
    release_date: '2024-06-01',
    barcode_jan_upc: '195166249513',
  },
  {
    sku_code: 'HAS-ST-05',
    brand: 'HASBRO',
    product_type: 'STARTER',
    official_title: 'Beyblade X Keel Shark 3-60LF Starter Pack',
    release_date: '2024-08-01',
    barcode_jan_upc: '195166249520',
  },
  {
    sku_code: 'HAS-ST-06',
    brand: 'HASBRO',
    product_type: 'STARTER',
    official_title: 'Beyblade X Claw Leon 5-60P Starter Pack',
    release_date: '2024-08-01',
    barcode_jan_upc: '195166249537',
  },
  {
    sku_code: 'HAS-ST-10',
    brand: 'HASBRO',
    product_type: 'STARTER',
    official_title: 'Beyblade X Soar Phoenix 9-60GF Deluxe Starter',
    release_date: '2024-08-01',
    barcode_jan_upc: '195166249544',
  },
  {
    sku_code: 'HAS-DP-01',
    brand: 'HASBRO',
    product_type: 'SET',
    official_title: 'Beyblade X Dual Pack: Bite Croc 3-60F & Sting Unicorn 4-80P',
    release_date: '2024-09-01',
    barcode_jan_upc: '195166249551',
  },
  {
    sku_code: 'HAS-DP-02',
    brand: 'HASBRO',
    product_type: 'SET',
    official_title: 'Beyblade X Dual Pack: Steel Samurai 4-80HN & Claw Leon 3-80F',
    release_date: '2024-09-01',
    barcode_jan_upc: '195166249568',
  },
  {
    sku_code: 'HAS-DP-03',
    brand: 'HASBRO',
    product_type: 'SET',
    official_title: 'Beyblade X Dual Pack: Mammoth Tusk 3-60T & Sword Dran 4-60LF',
    release_date: '2024-10-01',
    barcode_jan_upc: '195166249575',
  },
];

// ============================================================================
// VINCULACIÓN DINÁMICA DE IMÁGENES OFICIALES (PNG AISLADOS)
// ============================================================================
const BLADE_IMAGE_MAP: Record<string, string> = {
  'DRAN_SWORD': '/images/parts/blades/dran_sword.png',
  'HELLS_SCYTHE': '/images/parts/blades/hells_scythe.png',
  'WIZARD_ARROW': '/images/parts/blades/wizard_arrow.png',
  'KNIGHT_SHIELD': '/images/parts/blades/knight_shield.png',
  'KNIGHT_LANCE': '/images/parts/blades/knight_lance.png',
  'SHARK_EDGE': '/images/parts/blades/shark_edge.png',
  'LEON_CLAW': '/images/parts/blades/leon_claw.png',
  'VIPER_TAIL': '/images/parts/blades/viper_tail.png',
  'RHINO_HORN': '/images/parts/blades/rhino_horn.png',
  'DRAN_DAGGER': '/images/parts/blades/dran_dagger.png',
  'HELLS_CHAIN': '/images/parts/blades/hells_chain.png',
  'PHOENIX_WING': '/images/parts/blades/phoenix_wing.png',
  'WYVERN_GALE': '/images/parts/blades/wyvern_gale.png',
  'UNICORN_STING': '/images/parts/blades/unicorn_sting.png',
  'SPHINX_COWL': '/images/parts/blades/sphinx_cowl.png',
  'TYRANNO_BEAT': '/images/parts/blades/tyranno_beat.png',
  'WEISS_TIGER': '/images/parts/blades/weiss_tiger.png',
  'BLACK_SHELL': '/images/parts/blades/black_shell.png',
  'WHALE_WAVE': '/images/parts/blades/whale_wave.png',
  'DRAN_BUSTER': '/images/parts/blades/dran_buster.png',
  'HELLS_HAMMER': '/images/parts/blades/hells_hammer.png',
  'WIZARD_ROD': '/images/parts/blades/wizard_rod.png',
  'SHINOBI_SHADOW': '/images/parts/blades/shinobi_shadow.png',
  'COBALT_DRAGOON': '/images/parts/blades/cobalt_dragoon.png',
  'LEON_CREST': '/images/parts/blades/leon_crest.png',
  'PHOENIX_RUDDER': '/images/parts/blades/phoenix_rudder.png',
  'SILVER_WOLF': '/images/parts/blades/silver_wolf.png',
  'SAMURAI_SABER': '/images/parts/blades/samurai_saber.png',
  'KNIGHT_MAIL': '/images/parts/blades/knight_mail.png',
  'IMPACT_DRAKE': '/images/parts/blades/impact_drake.png',
  'COBALT_DRAKE': '/images/parts/blades/cobalt_drake.png',
  'DRANZER_SPIRAL': '/images/parts/blades/dranzer_spiral.png',
  'DRIGER_SLASH': '/images/parts/blades/driger_slash.png',
  'DRAGOON_STORM': '/images/parts/blades/dragoon_storm.png',
  'LIGHTNING_L_DRAGO': '/images/parts/blades/lightning_l_drago.png',
  'BITE_CROC': '/images/parts/blades/bite_croc.png',
  'STEEL_SAMURAI': '/images/parts/blades/steel_samurai.png',
  'MAMMOTH_TUSK': '/images/parts/blades/mammoth_tusk.png',
  'BEAR_SCRATCH': '/images/parts/blades/bear_scratch.png',
  'CRIMSON_GARUDA': '/images/parts/blades/crimson_garuda.png',
  'SHELTER_DRAKE': '/images/parts/blades/shelter_drake.png',
  'SHINOBI_KNIFE': '/images/parts/blades/shinobi_knife.png',
  'GHOST_CIRCLE': '/images/parts/blades/ghost_circle.png',
  'AERO_PEGASUS': '/images/parts/blades/aero_pegasus.png',
  'OROCHI_CLUSTER': '/images/parts/blades/orochi_cluster.png',
  'TALON_PTERA': '/images/parts/blades/talon_ptera.png',
  'ROAR_TYRANNO': '/images/parts/blades/roar_tyranno.png',
  'YELL_KONG': '/images/parts/blades/yell_kong.png',
  'DRACIEL_SHIELD': '/images/parts/blades/draciel_shield.png',
  'STORM_PEGASIS': '/images/parts/blades/storm_pegasis.png',
  'VICTORY_VALKYRIE': '/images/parts/blades/victory_valkyrie.png',
  'DRAN_BRAVE': '/images/parts/blades/dran_brave.png',
  'WIZARD_ARC': '/images/parts/blades/wizard_arc.png',
  'PERSEUS_DARK': '/images/parts/blades/perseus_dark.png',
  'HELLS_REAPER': '/images/parts/blades/hells_reaper.png',
  'FOX_BRUSH': '/images/parts/blades/fox_brush.png',
  'CERBERUS_FLAME': '/images/parts/blades/cerberus_flame.png',
};

const BIT_IMAGE_MAP: Record<string, string> = {
  'F': '/images/parts/bits/bit_flat.png',
  'LF': '/images/parts/bits/bit_low_flat.png',
  'GF': '/images/parts/bits/bit_gear_flat.png',
  'A': '/images/parts/bits/bit_accel.png',
  'R': '/images/parts/bits/bit_rush.png',
  'Q': '/images/parts/bits/bit_quake.png',
  'C': '/images/parts/bits/bit_cyclone.png',
  'L': '/images/parts/bits/bit_level.png',
  'LR': '/images/parts/bits/bit_low_rush.png',
  'B': '/images/parts/bits/bit_ball.png',
  'DB': '/images/parts/bits/bit_disc_ball.png',
  'O': '/images/parts/bits/bit_orb.png',
  'G': '/images/parts/bits/bit_glide.png',
  'FB': '/images/parts/bits/bit_free_ball.png',
  'N': '/images/parts/bits/bit_needle.png',
  'HN': '/images/parts/bits/bit_high_needle.png',
  'GN': '/images/parts/bits/bit_gear_needle.png',
  'H': '/images/parts/bits/bit_hexa.png',
  'MN': '/images/parts/bits/bit_metal_needle.png',
  'BS': '/images/parts/bits/bit_bound_spike.png',
  'T': '/images/parts/bits/bit_taper.png',
  'HT': '/images/parts/bits/bit_high_taper.png',
  'P': '/images/parts/bits/bit_point.png',
  'GP': '/images/parts/bits/bit_gear_point.png',
  'U': '/images/parts/bits/bit_unite.png',
  'E': '/images/parts/bits/bit_elevate.png',
  'TP': '/images/parts/bits/bit_trans_point.png',
  'V': '/images/parts/bits/bit_vortex.png',
  'D': '/images/parts/bits/bit_dot.png',
  'W': '/images/parts/bits/bit_wedge.png',
  'WB': '/images/parts/bits/bit_wall_ball.png',
  'LO': '/images/parts/bits/bit_low_orb.png',
  'RA': '/images/parts/bits/bit_rubber_accel.png',
};

// Enriquecer objetos en memoria
export const BLADE_GALLERY_MAP: Record<string, { url: string; label: string; tag: 'STUDIO' | 'REAL' | 'RECOLOR' | 'ANGLED' | 'COMMUNITY' }[]> = {
  "AERO_PEGASUS": [
    {
      "url": "/images/gallery/blades/aero_pegasus/aero_pegasus_1.png",
      "label": "aero pegasus Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/aero_pegasus/aero_pegasus_2.png",
      "label": "aero pegasus Variante #2",
      "tag": "REAL"
    }
  ],
  "BLACK_SHELL": [
    {
      "url": "/images/gallery/blades/black_shell/black_shell_460d.jpg",
      "label": "black shell Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "CERBERUS_FLAME": [
    {
      "url": "/images/gallery/blades/cerberus_flame/cerberus_flame_1.png",
      "label": "cerberus flame Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/cerberus_flame/cerberus_flame_2.png",
      "label": "cerberus flame Variante #2",
      "tag": "REAL"
    }
  ],
  "COBALT_DRAGOON": [
    {
      "url": "/images/gallery/blades/cobalt_dragoon/cobalt_dragoon_260c.jpg",
      "label": "cobalt dragoon Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/cobalt_dragoon/cobalt_dragoon_angled.jpg",
      "label": "cobalt dragoon Perspectiva Angular",
      "tag": "ANGLED"
    },
    {
      "url": "/images/gallery/blades/cobalt_dragoon/cobalt_dragoon_black.png",
      "label": "cobalt dragoon Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "COBALT_DRAKE": [
    {
      "url": "/images/gallery/blades/cobalt_drake/cobalt_drake_bx46.png",
      "label": "cobalt drake Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "CRIMSON_GARUDA": [
    {
      "url": "/images/gallery/blades/crimson_garuda/crimson_garuda_1.png",
      "label": "crimson garuda Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/crimson_garuda/crimson_garuda_2.png",
      "label": "crimson garuda Variante #2",
      "tag": "REAL"
    }
  ],
  "DRACIEL_SHIELD": [
    {
      "url": "/images/gallery/blades/draciel_shield/draciel_shield_1.png",
      "label": "draciel shield Variante #1",
      "tag": "REAL"
    }
  ],
  "DRAGOON_STORM": [
    {
      "url": "/images/gallery/blades/dragoon_storm/dragoon_storm_460ra.jpg",
      "label": "dragoon storm Variante #1",
      "tag": "REAL"
    }
  ],
  "DRANZER_SPIRAL": [
    {
      "url": "/images/gallery/blades/dranzer_spiral/dranzer_spiral_380t.jpg",
      "label": "dranzer spiral Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/dranzer_spiral/dranzer_spiral_angled.jpg",
      "label": "dranzer spiral Perspectiva Angular",
      "tag": "ANGLED"
    },
    {
      "url": "/images/gallery/blades/dranzer_spiral/dranzer_spiral_black.png",
      "label": "dranzer spiral Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "DRAN_BRAVE": [
    {
      "url": "/images/gallery/blades/dran_brave/dran_brave_1.png",
      "label": "dran brave Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/dran_brave/dran_brave_2.png",
      "label": "dran brave Variante #2",
      "tag": "REAL"
    }
  ],
  "DRAN_BUSTER": [
    {
      "url": "/images/gallery/blades/dran_buster/dran_buster_barca.png",
      "label": "dran buster Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/dran_buster/dran_buster_black.png",
      "label": "dran buster Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/dran_buster/dran_buster_cyan.png",
      "label": "dran buster Variante #3",
      "tag": "REAL"
    }
  ],
  "DRAN_DAGGER": [
    {
      "url": "/images/gallery/blades/dran_dagger/dran_dagger_bx00.png",
      "label": "dran dagger Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/dran_dagger/dran_dagger_bx31.png",
      "label": "dran dagger Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "DRAN_SWORD": [
    {
      "url": "/images/gallery/blades/dran_sword/dran_sword_bx14_black_red.png",
      "label": "dran sword Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/dran_sword/dran_sword_collab.jpg",
      "label": "dran sword Variante #2",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/dran_sword/dran_sword_metal_coat_blue.jpg",
      "label": "dran sword Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/dran_sword/dran_sword_metal_coat_red.jpg",
      "label": "dran sword Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/dran_sword/dran_sword_red_ver.jpg",
      "label": "dran sword Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "DRIGER_SLASH": [
    {
      "url": "/images/gallery/blades/driger_slash/driger_slash_480p.jpg",
      "label": "driger slash Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/driger_slash/driger_slash_angled.jpg",
      "label": "driger slash Perspectiva Angular",
      "tag": "ANGLED"
    }
  ],
  "FOX_BRUSH": [
    {
      "url": "/images/gallery/blades/fox_brush/fox_brush_1.png",
      "label": "fox brush Variante #1",
      "tag": "REAL"
    }
  ],
  "GHOST_CIRCLE": [
    {
      "url": "/images/gallery/blades/ghost_circle/ghost_circle_1.png",
      "label": "ghost circle Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/ghost_circle/ghost_circle_2.png",
      "label": "ghost circle Variante #2",
      "tag": "REAL"
    }
  ],
  "HELLS_CHAIN": [
    {
      "url": "/images/gallery/blades/hells_chain/hells_chain_560ht.jpg",
      "label": "hells chain Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/hells_chain/hells_chain_angled.jpg",
      "label": "hells chain Perspectiva Angular",
      "tag": "ANGLED"
    },
    {
      "url": "/images/gallery/blades/hells_chain/hells_chain_black.png",
      "label": "hells chain Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "HELLS_HAMMER": [
    {
      "url": "/images/gallery/blades/hells_hammer/hells_hammer_370h.jpg",
      "label": "hells hammer Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/hells_hammer/hells_hammer_angled.jpg",
      "label": "hells hammer Perspectiva Angular",
      "tag": "ANGLED"
    },
    {
      "url": "/images/gallery/blades/hells_hammer/hells_hammer_blue.png",
      "label": "hells hammer Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "HELLS_REAPER": [
    {
      "url": "/images/gallery/blades/hells_reaper/hells_reaper_1.png",
      "label": "hells reaper Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/hells_reaper/hells_reaper_2.png",
      "label": "hells reaper Variante #2",
      "tag": "REAL"
    }
  ],
  "HELLS_SCYTHE": [
    {
      "url": "/images/gallery/blades/hells_scythe/hells_scythe_380f.jpg",
      "label": "hells scythe Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/hells_scythe/hells_scythe_480lf.png",
      "label": "hells scythe Variante #2",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/hells_scythe/hells_scythe_bx08.png",
      "label": "hells scythe Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/hells_scythe/hells_scythe_gold.jpg",
      "label": "hells scythe Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "IMPACT_DRAKE": [
    {
      "url": "/images/gallery/blades/impact_drake/impact_drake_960lr.jpg",
      "label": "impact drake Variante #1",
      "tag": "REAL"
    }
  ],
  "KNIGHT_LANCE": [
    {
      "url": "/images/gallery/blades/knight_lance/knight_lance_360lf.jpg",
      "label": "knight lance Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/knight_lance/knight_lance_bx21.png",
      "label": "knight lance Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "KNIGHT_MAIL": [
    {
      "url": "/images/gallery/blades/knight_mail/knight_mail_navy.png",
      "label": "knight mail Variante #1",
      "tag": "REAL"
    }
  ],
  "KNIGHT_SHIELD": [
    {
      "url": "/images/gallery/blades/knight_shield/knight_shield_bx06.png",
      "label": "knight shield Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/knight_shield/knight_shield_bx08.png",
      "label": "knight shield Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/knight_shield/knight_shield_bx20.png",
      "label": "knight shield Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/knight_shield/knight_shield_gold.png",
      "label": "knight shield Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "LEON_CLAW": [
    {
      "url": "/images/gallery/blades/leon_claw/leon_claw_gold.jpg",
      "label": "leon claw Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "LEON_CREST": [
    {
      "url": "/images/gallery/blades/leon_crest/leon_crest_760gn.jpg",
      "label": "leon crest Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/leon_crest/leon_crest_angled.jpg",
      "label": "leon crest Perspectiva Angular",
      "tag": "ANGLED"
    }
  ],
  "LIGHTNING_L_DRAGO": [
    {
      "url": "/images/gallery/blades/lightning_l_drago/lightning_l_drago_rapid.jpg",
      "label": "lightning l drago Variante #1",
      "tag": "REAL"
    }
  ],
  "MAMMOTH_TUSK": [
    {
      "url": "/images/gallery/blades/mammoth_tusk/tusk_mammoth_360t.jpg",
      "label": "mammoth tusk Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/mammoth_tusk/user_tusk_mammoth.jpg",
      "label": "mammoth tusk (Foto Real de Usuario)",
      "tag": "REAL"
    }
  ],
  "OROCHI_CLUSTER": [
    {
      "url": "/images/gallery/blades/orochi_cluster/orochi_cluster_1.png",
      "label": "orochi cluster Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/orochi_cluster/orochi_cluster_2.png",
      "label": "orochi cluster Variante #2",
      "tag": "REAL"
    }
  ],
  "PERSEUS_DARK": [
    {
      "url": "/images/gallery/blades/perseus_dark/perseus_dark_1.png",
      "label": "perseus dark Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/perseus_dark/perseus_dark_2.png",
      "label": "perseus dark Variante #2",
      "tag": "REAL"
    }
  ],
  "PHOENIX_RUDDER": [
    {
      "url": "/images/gallery/blades/phoenix_rudder/phoenix_rudder_970g.jpg",
      "label": "phoenix rudder Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/phoenix_rudder/phoenix_rudder_angled.png",
      "label": "phoenix rudder Perspectiva Angular",
      "tag": "ANGLED"
    }
  ],
  "PHOENIX_WING": [
    {
      "url": "/images/gallery/blades/phoenix_wing/phoenix_wing_980db.jpg",
      "label": "phoenix wing Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/phoenix_wing/phoenix_wing_black.png",
      "label": "phoenix wing Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/phoenix_wing/phoenix_wing_bx35.png",
      "label": "phoenix wing Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/phoenix_wing/user_phoenix_wing.jpg",
      "label": "phoenix wing (Foto Real de Usuario)",
      "tag": "REAL"
    }
  ],
  "RHINO_HORN": [
    {
      "url": "/images/gallery/blades/rhino_horn/rhino_horn_380s.jpg",
      "label": "rhino horn Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/rhino_horn/rhino_horn_angled.jpg",
      "label": "rhino horn Perspectiva Angular",
      "tag": "ANGLED"
    }
  ],
  "ROAR_TYRANNO": [
    {
      "url": "/images/gallery/blades/roar_tyranno/roar_tyranno_1.png",
      "label": "roar tyranno Variante #1",
      "tag": "REAL"
    }
  ],
  "SAMURAI_SABER": [
    {
      "url": "/images/gallery/blades/samurai_saber/samurai_saber_270l.png",
      "label": "samurai saber Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/samurai_saber/samurai_saber_angled.png",
      "label": "samurai saber Perspectiva Angular",
      "tag": "ANGLED"
    }
  ],
  "SHARK_EDGE": [
    {
      "url": "/images/gallery/blades/shark_edge/shark_edge_560gf.jpg",
      "label": "shark edge Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/shark_edge/shark_edge_bx20.png",
      "label": "shark edge Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/shark_edge/shark_edge_bx31.png",
      "label": "shark edge Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "SHELTER_DRAKE": [
    {
      "url": "/images/gallery/blades/shelter_drake/shelter_drake_1.png",
      "label": "shelter drake Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/shelter_drake/shelter_drake_2.png",
      "label": "shelter drake Variante #2",
      "tag": "REAL"
    }
  ],
  "SHINOBI_KNIFE": [
    {
      "url": "/images/gallery/blades/shinobi_knife/shinobi_knife_2.png",
      "label": "shinobi knife Variante #1",
      "tag": "REAL"
    }
  ],
  "SHINOBI_SHADOW": [
    {
      "url": "/images/gallery/blades/shinobi_shadow/shinobi_shadow_180mn.jpg",
      "label": "shinobi shadow Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/shinobi_shadow/shinobi_shadow_angled.jpg",
      "label": "shinobi shadow Perspectiva Angular",
      "tag": "ANGLED"
    }
  ],
  "SPHINX_COWL": [
    {
      "url": "/images/gallery/blades/sphinx_cowl/sphinx_cowl_180gf.jpg",
      "label": "sphinx cowl Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/sphinx_cowl/sphinx_cowl_ux07.png",
      "label": "sphinx cowl Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "STEEL_SAMURAI": [
    {
      "url": "/images/gallery/blades/steel_samurai/steel_samurai_angled.jpg",
      "label": "steel samurai Perspectiva Angular",
      "tag": "ANGLED"
    }
  ],
  "STORM_PEGASIS": [
    {
      "url": "/images/gallery/blades/storm_pegasis/storm_pegasis_1.png",
      "label": "storm pegasis Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/storm_pegasis/storm_pegasis_2.png",
      "label": "storm pegasis Variante #2",
      "tag": "REAL"
    }
  ],
  "TALON_PTERA": [
    {
      "url": "/images/gallery/blades/talon_ptera/talon_ptera_1.png",
      "label": "talon ptera Variante #1",
      "tag": "REAL"
    }
  ],
  "TYRANNO_BEAT": [
    {
      "url": "/images/gallery/blades/tyranno_beat/tyranno_beat_red.png",
      "label": "tyranno beat Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/tyranno_beat/tyranno_beat_side.jpg",
      "label": "tyranno beat Perspectiva Angular",
      "tag": "ANGLED"
    }
  ],
  "UNICORN_STING": [
    {
      "url": "/images/gallery/blades/unicorn_sting/unicorn_sting_370d.jpg",
      "label": "unicorn sting Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/unicorn_sting/unicorn_sting_560gp.jpg",
      "label": "unicorn sting Variante #2",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/unicorn_sting/user_unicorn_sting.jpg",
      "label": "unicorn sting (Foto Real de Usuario)",
      "tag": "REAL"
    }
  ],
  "VICTORY_VALKYRIE": [
    {
      "url": "/images/gallery/blades/victory_valkyrie/victory_valkyrie_1.png",
      "label": "victory valkyrie Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/victory_valkyrie/victory_valkyrie_2.png",
      "label": "victory valkyrie Variante #2",
      "tag": "REAL"
    }
  ],
  "VIPER_TAIL": [
    {
      "url": "/images/gallery/blades/viper_tail/viper_tail_bx35.png",
      "label": "viper tail Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/viper_tail/viper_tail_bx35_06.png",
      "label": "viper tail Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "WEISS_TIGER": [
    {
      "url": "/images/gallery/blades/weiss_tiger/weiss_tiger_360u.jpg",
      "label": "weiss tiger Variante #1",
      "tag": "REAL"
    }
  ],
  "WHALE_WAVE": [
    {
      "url": "/images/gallery/blades/whale_wave/whale_wave_blue.jpg",
      "label": "whale wave Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "WIZARD_ARC": [
    {
      "url": "/images/gallery/blades/wizard_arc/wizard_arc_1.png",
      "label": "wizard arc Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/wizard_arc/wizard_arc_2.png",
      "label": "wizard arc Variante #2",
      "tag": "REAL"
    }
  ],
  "WIZARD_ARROW": [
    {
      "url": "/images/gallery/blades/wizard_arrow/wizard_arrow_480gb.jpg",
      "label": "wizard arrow Variante #1",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/wizard_arrow/wizard_arrow_blue.png",
      "label": "wizard arrow Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/wizard_arrow/wizard_arrow_bx05.png",
      "label": "wizard arrow Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/wizard_arrow/wizard_arrow_bx08.png",
      "label": "wizard arrow Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "WIZARD_ROD": [
    {
      "url": "/images/gallery/blades/wizard_rod/user_wizard_rod.jpg",
      "label": "wizard rod (Foto Real de Usuario)",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/blades/wizard_rod/wizard_rod_bx35.png",
      "label": "wizard rod Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/wizard_rod/wizard_rod_gold.png",
      "label": "wizard rod Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/wizard_rod/wizard_rod_special.jpg",
      "label": "wizard rod Variante #4",
      "tag": "REAL"
    }
  ],
  "WYVERN_GALE": [
    {
      "url": "/images/gallery/blades/wyvern_gale/wyvern_gale_bx24.png",
      "label": "wyvern gale Recolor / Colorway",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/blades/wyvern_gale/wyvern_gale_ux07.png",
      "label": "wyvern gale Recolor / Colorway",
      "tag": "RECOLOR"
    }
  ],
  "YELL_KONG": [
    {
      "url": "/images/gallery/blades/yell_kong/yell_kong_1.png",
      "label": "yell kong Variante #1",
      "tag": "REAL"
    }
  ]
};

export const RATCHET_GALLERY_MAP: Record<string, { url: string; label: string; tag: 'STUDIO' | 'REAL' | 'RECOLOR' | 'ANGLED' | 'COMMUNITY' }[]> = {
  "0-80": [
    {
      "url": "/images/gallery/ratchets/0-80/variant_01.png",
      "label": "0-80 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "1-60": [
    {
      "url": "/images/gallery/ratchets/1-60/variant_01.png",
      "label": "1-60 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/1-60/variant_02.png",
      "label": "1-60 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/1-60/variant_03.png",
      "label": "1-60 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/1-60/variant_05.png",
      "label": "1-60 Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    }
  ],
  "1-80": [
    {
      "url": "/images/gallery/ratchets/1-80/variant_01.png",
      "label": "1-80 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "2-60": [
    {
      "url": "/images/gallery/ratchets/2-60/variant_01.png",
      "label": "2-60 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "2-80": [
    {
      "url": "/images/gallery/ratchets/2-80/variant_01.png",
      "label": "2-80 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "3-60": [
    {
      "url": "/images/gallery/ratchets/3-60/variant_01.png",
      "label": "3-60 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-60/variant_02.png",
      "label": "3-60 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-60/variant_03.png",
      "label": "3-60 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-60/variant_04.png",
      "label": "3-60 Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-60/variant_06.png",
      "label": "3-60 Colorway / Variante Oficial #5",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-60/variant_07.png",
      "label": "3-60 Colorway / Variante Oficial #6",
      "tag": "RECOLOR"
    }
  ],
  "3-80": [
    {
      "url": "/images/gallery/ratchets/3-80/variant_01.png",
      "label": "3-80 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-80/variant_02.png",
      "label": "3-80 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-80/variant_03.png",
      "label": "3-80 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-80/variant_04.png",
      "label": "3-80 Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-80/variant_05.png",
      "label": "3-80 Colorway / Variante Oficial #5",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-80/variant_06.png",
      "label": "3-80 Colorway / Variante Oficial #6",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-80/variant_07.png",
      "label": "3-80 Colorway / Variante Oficial #7",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-80/variant_08.png",
      "label": "3-80 Colorway / Variante Oficial #8",
      "tag": "RECOLOR"
    }
  ],
  "3-85": [
    {
      "url": "/images/gallery/ratchets/3-85/variant_01.png",
      "label": "3-85 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-85/variant_03.png",
      "label": "3-85 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/3-85/variant_04.png",
      "label": "3-85 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    }
  ],
  "4-60": [
    {
      "url": "/images/gallery/ratchets/4-60/variant_01.png",
      "label": "4-60 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-60/variant_02.png",
      "label": "4-60 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-60/variant_04.png",
      "label": "4-60 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-60/variant_05.png",
      "label": "4-60 Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-60/variant_06.png",
      "label": "4-60 Colorway / Variante Oficial #5",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-60/variant_07.png",
      "label": "4-60 Colorway / Variante Oficial #6",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-60/variant_08.png",
      "label": "4-60 Colorway / Variante Oficial #7",
      "tag": "RECOLOR"
    }
  ],
  "4-70": [
    {
      "url": "/images/gallery/ratchets/4-70/variant_01.png",
      "label": "4-70 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-70/variant_02.png",
      "label": "4-70 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-70/variant_03.png",
      "label": "4-70 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    }
  ],
  "4-80": [
    {
      "url": "/images/gallery/ratchets/4-80/variant_01.png",
      "label": "4-80 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-80/variant_02.png",
      "label": "4-80 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-80/variant_03.png",
      "label": "4-80 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/4-80/variant_05.png",
      "label": "4-80 Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    }
  ],
  "5-60": [
    {
      "url": "/images/gallery/ratchets/5-60/variant_01.png",
      "label": "5-60 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/5-60/variant_03.png",
      "label": "5-60 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/5-60/variant_04.png",
      "label": "5-60 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/5-60/variant_05.png",
      "label": "5-60 Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    }
  ],
  "5-70": [
    {
      "url": "/images/gallery/ratchets/5-70/user_wizard_rod_570.jpg",
      "label": "5-70 Foto Real de Usuario",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/ratchets/5-70/variant_01.png",
      "label": "5-70 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/5-70/variant_02.png",
      "label": "5-70 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/5-70/variant_04.png",
      "label": "5-70 Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    }
  ],
  "5-80": [
    {
      "url": "/images/gallery/ratchets/5-80/variant_01.png",
      "label": "5-80 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/5-80/variant_03.png",
      "label": "5-80 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/ratchets/5-80/variant_04.png",
      "label": "5-80 Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    }
  ],
  "7-80": [
    {
      "url": "/images/gallery/ratchets/7-80/variant_01.png",
      "label": "7-80 Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "9-60": [
    {
      "url": "/images/gallery/ratchets/9-60/user_phoenix_wing_960.jpg",
      "label": "9-60 Foto Real de Usuario",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/ratchets/9-60/variant_01.png",
      "label": "9-60 Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ]
};

export const BIT_GALLERY_MAP: Record<string, { url: string; label: string; tag: 'STUDIO' | 'REAL' | 'RECOLOR' | 'ANGLED' | 'COMMUNITY' }[]> = {
  "A": [
    {
      "url": "/images/gallery/bits/A/user_accel_tip.jpg",
      "label": "A Foto Real de Usuario",
      "tag": "REAL"
    },
    {
      "url": "/images/gallery/bits/A/variant_01.png",
      "label": "A Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "B": [
    {
      "url": "/images/gallery/bits/B/variant_01.png",
      "label": "B Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/B/variant_02.png",
      "label": "B Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/B/variant_04.png",
      "label": "B Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/B/variant_05.png",
      "label": "B Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    }
  ],
  "BS": [
    {
      "url": "/images/gallery/bits/BS/variant_01.png",
      "label": "BS Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/BS/variant_02.png",
      "label": "BS Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "C": [
    {
      "url": "/images/gallery/bits/C/user_cyclone_gear.jpg",
      "label": "C Foto Real de Usuario",
      "tag": "REAL"
    }
  ],
  "D": [
    {
      "url": "/images/gallery/bits/D/variant_01.png",
      "label": "D Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "DB": [
    {
      "url": "/images/gallery/bits/DB/variant_02.png",
      "label": "DB Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/DB/variant_03.png",
      "label": "DB Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/DB/variant_04.png",
      "label": "DB Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    }
  ],
  "E": [
    {
      "url": "/images/gallery/bits/E/variant_02.png",
      "label": "E Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/E/variant_03.png",
      "label": "E Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/E/variant_04.png",
      "label": "E Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    }
  ],
  "F": [
    {
      "url": "/images/gallery/bits/F/variant_02.png",
      "label": "F Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/F/variant_03.png",
      "label": "F Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/F/variant_04.png",
      "label": "F Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/F/variant_05.png",
      "label": "F Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    }
  ],
  "GF": [
    {
      "url": "/images/gallery/bits/GF/variant_02.png",
      "label": "GF Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/GF/variant_03.png",
      "label": "GF Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "GN": [
    {
      "url": "/images/gallery/bits/GN/variant_02.png",
      "label": "GN Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "GP": [
    {
      "url": "/images/gallery/bits/GP/variant_02.png",
      "label": "GP Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "H": [
    {
      "url": "/images/gallery/bits/H/variant_02.png",
      "label": "H Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "LF": [
    {
      "url": "/images/gallery/bits/LF/variant_02.png",
      "label": "LF Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/LF/variant_03.png",
      "label": "LF Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "LO": [
    {
      "url": "/images/gallery/bits/LO/variant_02.png",
      "label": "LO Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "LR": [
    {
      "url": "/images/gallery/bits/LR/variant_01.png",
      "label": "LR Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/LR/variant_02.png",
      "label": "LR Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "MN": [
    {
      "url": "/images/gallery/bits/MN/variant_02.png",
      "label": "MN Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "N": [
    {
      "url": "/images/gallery/bits/N/variant_02.png",
      "label": "N Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/N/variant_03.png",
      "label": "N Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/N/variant_04.png",
      "label": "N Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    }
  ],
  "O": [
    {
      "url": "/images/gallery/bits/O/variant_02.png",
      "label": "O Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/O/variant_03.png",
      "label": "O Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "P": [
    {
      "url": "/images/gallery/bits/P/variant_02.png",
      "label": "P Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/P/variant_03.png",
      "label": "P Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "Q": [
    {
      "url": "/images/gallery/bits/Q/variant_02.png",
      "label": "Q Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/Q/variant_03.png",
      "label": "Q Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "R": [
    {
      "url": "/images/gallery/bits/R/variant_02.png",
      "label": "R Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/R/variant_03.png",
      "label": "R Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    }
  ],
  "RA": [
    {
      "url": "/images/gallery/bits/RA/variant_01.png",
      "label": "RA Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "T": [
    {
      "url": "/images/gallery/bits/T/variant_01.png",
      "label": "T Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/T/variant_02.png",
      "label": "T Colorway / Variante Oficial #2",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/T/variant_03.png",
      "label": "T Colorway / Variante Oficial #3",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/T/variant_04.png",
      "label": "T Colorway / Variante Oficial #4",
      "tag": "RECOLOR"
    },
    {
      "url": "/images/gallery/bits/T/variant_05.png",
      "label": "T Colorway / Variante Oficial #5",
      "tag": "RECOLOR"
    }
  ],
  "TP": [
    {
      "url": "/images/gallery/bits/TP/variant_01.png",
      "label": "TP Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ],
  "V": [
    {
      "url": "/images/gallery/bits/V/variant_02.png",
      "label": "V Colorway / Variante Oficial #1",
      "tag": "RECOLOR"
    }
  ]
};

CATALOG_BLADES.forEach((b) => {
  const mappedUrl = BLADE_IMAGE_MAP[b.code_name] || `/images/parts/blades/${b.code_name.toLowerCase()}.png`;
  b.image_url = mappedUrl;
  if (b.variants[0]) {
    b.variants[0].image_url = mappedUrl;
  }
  const studioImg = b.image_url ? [{ url: b.image_url, label: 'Render Oficial de Estudio', tag: 'STUDIO' as const }] : [];
  const extraImgs = BLADE_GALLERY_MAP[b.code_name] || [];
  b.gallery_images = [...studioImg, ...extraImgs];
});

CATALOG_RATCHETS.forEach((r) => {
  r.image_url = `/images/parts/ratchets/ratchet_${r.code_name.toLowerCase()}.png`;
  if (r.variants[0]) {
    r.variants[0].image_url = r.image_url;
  }
  const studioImg = r.image_url ? [{ url: r.image_url, label: 'Render Oficial de Estudio', tag: 'STUDIO' as const }] : [];
  const extraImgs = RATCHET_GALLERY_MAP[r.code_name] || [];
  r.gallery_images = [...studioImg, ...extraImgs];
});

CATALOG_BITS.forEach((bit) => {
  const mappedUrl = BIT_IMAGE_MAP[bit.code_name] || `/images/parts/bits/bit_${bit.display_name.toLowerCase().replace(/\s+/g, '_')}.png`;
  bit.image_url = mappedUrl;
  if (bit.variants[0]) {
    bit.variants[0].image_url = mappedUrl;
  }
  const studioImg = bit.image_url ? [{ url: bit.image_url, label: 'Render Oficial de Estudio', tag: 'STUDIO' as const }] : [];
  const extraImgs = BIT_GALLERY_MAP[bit.code_name] || [];
  bit.gallery_images = [...studioImg, ...extraImgs];
});

const PRODUCT_BOX_MAP: Record<string, string> = {
  'BX-01': '/images/products/bx_01_box.jpg',
  'BX-02': '/images/products/bx_02_box.jpg',
  'BX-03': '/images/products/bx_03_box.jpg',
  'BX-04': '/images/products/bx_04_box.jpg',
  'BX-07': '/images/products/bx_07_box.jpg',
  'BX-08': '/images/products/bx_08_box.jpg',
  'BX-13': '/images/products/bx_13_box.jpg',
  'BX-14': '/images/products/bx_14_box.jpg',
  'BX-15': '/images/products/bx_15_box.jpg',
  'BX-16': '/images/products/bx_16_box.jpg',
  'BX-17': '/images/products/bx_17_box.jpg',
  'BX-19': '/images/products/bx_19_box.jpg',
  'BX-20': '/images/products/bx_20_box.jpg',
  'BX-21': '/images/products/bx_21_box.jpg',
  'BX-23': '/images/products/bx_23_box.jpg',
  'BX-24': '/images/products/bx_24_box.jpg',
  'BX-26': '/images/products/bx_26_box.jpg',
  'BX-27': '/images/products/bx_27_box.jpg',
  'BX-31': '/images/products/bx_31_box.jpg',
  'BX-33': '/images/products/bx_33_box.jpg',
  'BX-34': '/images/products/bx_34_box.jpg',
  'BX-35': '/images/products/bx_35_box.jpg',
  'BX-36': '/images/products/bx_36_box.jpg',
  'UX-01': '/images/products/ux_01_box.jpg',
  'UX-02': '/images/products/ux_02_box.jpg',
  'UX-03': '/images/products/ux_03_box.jpg',
  'UX-04': '/images/products/ux_04_box.jpg',
  'UX-06': '/images/products/ux_06_box.jpg',
  'UX-07': '/images/products/ux_07_box.jpg',
  'UX-08': '/images/products/ux_08_box.jpg',
  'UX-09': '/images/products/ux_09_box.jpg',
  'UX-10': '/images/products/ux_10_box.jpg',
  'UX-11': '/images/products/ux_11_box.jpg',
  'HAS-ST-01': '/images/products/has_st_01_box.jpg',
  'HAS-ST-02': '/images/products/has_st_02_box.jpg',
  'HAS-ST-03': '/images/products/has_st_03_box.jpg',
  'HAS-ST-04': '/images/products/has_st_04_box.jpg',
  'HAS-ST-05': '/images/products/has_st_05_box.jpg',
  'HAS-ST-06': '/images/products/has_st_06_box.jpg',
  'HAS-ST-10': '/images/products/has_st_10_box.jpg',
  'HAS-DP-01': '/images/products/has_dp_01_box.jpg',
  'HAS-DP-02': '/images/products/has_dp_02_box.jpg',
  'HAS-DP-03': '/images/products/has_dp_03_box.jpg',
};

CATALOG_PRODUCTS.forEach((p) => {
  if (PRODUCT_BOX_MAP[p.sku_code]) {
    p.box_image_url = PRODUCT_BOX_MAP[p.sku_code];
  }
});

