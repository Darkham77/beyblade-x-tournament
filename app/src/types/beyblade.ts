export type PartType = 'BLADE' | 'RATCHET' | 'BIT' | 'LOCK_CHIP';
export type Brand = 'TAKARA_TOMY' | 'HASBRO';
export type SpinDirection = 'RIGHT' | 'LEFT' | 'DUAL';
export type BladeSystem = 'BX' | 'UX' | 'CX';
export type FinishType = 'STANDARD_RAW_METAL' | 'PAINTED_METAL' | 'METALLIC_COAT' | 'TRANSLUCENT';

export interface BaseStats {
  attack: number;
  defense: number;
  stamina: number;
  dash: number;
  burst_resistance: number;
}

export interface PartVariant {
  variant_id: string;
  variant_name: string;
  primary_brand: Brand;
  finish: FinishType;
  color_primary_hex: string;
  color_secondary_hex?: string;
  hasbro_qr_payload?: string;
  image_url?: string;
  included_in_products: string[];
}

export interface Blade {
  code_name: string;
  display_name: string;
  system: BladeSystem;
  spin_direction: SpinDirection;
  weight_min_grams: number;
  weight_max_grams: number;
  image_url?: string;
  stats: BaseStats;
  variants: PartVariant[];
}

export interface Ratchet {
  code_name: string;
  display_name: string;
  sides: number;
  height_mm: number;
  weight_min_grams: number;
  weight_max_grams: number;
  image_url?: string;
  stats: {
    burst_resistance: number;
    aerodynamics: number;
  };
  variants: PartVariant[];
}

export interface Bit {
  code_name: string;
  display_name: string;
  category: 'Attack' | 'Defense' | 'Stamina' | 'Balance' | 'Attack / Dash';
  burst_resistance_tier: 'NORMAL' | 'HIGH';
  weight_min_grams: number;
  weight_max_grams: number;
  image_url?: string;
  stats: {
    attack: number;
    dash: number;
    stamina: number;
  };
  variants: PartVariant[];
}

export interface Product {
  sku_code: string;
  brand: Brand;
  product_type: 'STARTER' | 'BOOSTER' | 'RANDOM_BOOSTER' | 'SET' | 'DECK_SET';
  official_title: string;
  release_date: string;
  barcode_jan_upc: string;
}

export interface BeyCombo {
  slot: number;
  custom_label: string;
  blade: Blade;
  bladeVariant: PartVariant;
  ratchet: Ratchet;
  ratchetVariant: PartVariant;
  bit: Bit;
  bitVariant: PartVariant;
  calculatedWeight: number;
  compositeStats: BaseStats;
}

export interface TournamentDeck {
  deck_name: string;
  combos: [BeyCombo | null, BeyCombo | null, BeyCombo | null];
  is_wbo_legal: boolean;
  legal_reason?: string;
}
