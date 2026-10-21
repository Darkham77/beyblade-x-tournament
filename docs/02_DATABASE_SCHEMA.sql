-- =============================================================================
-- ESQUEMA DE BASE DE DATOS: SCANNER DE BEYS (BEYBLADE X)
-- Motor: PostgreSQL 15+ / Supabase
-- =============================================================================

-- Extensiones recomendadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Búsquedas difusas de texto

-- -----------------------------------------------------------------------------
-- 1. TIPOS ENUMERADOS
-- -----------------------------------------------------------------------------

CREATE TYPE part_type_enum AS ENUM (
    'BLADE',
    'RATCHET',
    'BIT',
    'LOCK_CHIP' -- Para el sistema Custom Line (CX)
);

CREATE TYPE brand_enum AS ENUM (
    'TAKARA_TOMY',
    'HASBRO'
);

CREATE TYPE spin_direction_enum AS ENUM (
    'RIGHT',
    'LEFT',
    'DUAL'
);

CREATE TYPE blade_system_enum AS ENUM (
    'BX',  -- Basic Line
    'UX',  -- Unique Line
    'CX'   -- Custom Line
);

CREATE TYPE finish_type_enum AS ENUM (
    'STANDARD_RAW_METAL',
    'PAINTED_METAL',
    'GOLD_ACCENT',
    'TRANSLUCENT_PLASTIC',
    'OPAQUE_SOLID',
    'METALLIC_COAT'
);

CREATE TYPE product_type_enum AS ENUM (
    'STARTER',
    'BOOSTER',
    'RANDOM_BOOSTER',
    'SET',
    'DECK_SET',
    'BATTLE_ENTRY_SET',
    'EVENT_PRIZE',
    'COROCORO_EXCLUSIVE',
    'RARE_BEY_GET_BATTLE'
);

CREATE TYPE item_condition_enum AS ENUM (
    'MINT_NEW',
    'LIGHTLY_USED',
    'BATTLE_DAMAGED',
    'WORN_OUT'
);

-- -----------------------------------------------------------------------------
-- 2. CATÁLOGO MAESTRO DE MOLDES BASE (PARTS_MASTER)
-- Representa el diseño base de ingeniería (ej: "Dran Sword", "3-60", "Flat")
-- -----------------------------------------------------------------------------

CREATE TABLE parts_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_type part_type_enum NOT NULL,
    code_name VARCHAR(50) NOT NULL UNIQUE, -- Ej: "DRAN_SWORD", "3-60", "F"
    display_name VARCHAR(100) NOT NULL,    -- Ej: "Dran Sword", "3-60", "Flat"
    system blade_system_enum DEFAULT 'BX',
    spin_direction spin_direction_enum DEFAULT 'RIGHT',
    
    -- Especificaciones de ingeniería
    weight_min_grams NUMERIC(4,2) NOT NULL,
    weight_max_grams NUMERIC(4,2) NOT NULL,
    ratchet_sides INT CHECK (ratchet_sides BETWEEN 1 AND 12), -- Solo Ratchets (ej: 3, 4, 5, 9)
    ratchet_height_mm INT CHECK (ratchet_height_mm IN (60, 70, 80)), -- Solo Ratchets
    bit_category VARCHAR(50), -- Ej: "Flat", "Ball", "Needle", "Gear Point", "Dash"
    
    -- Estadísticas oficiales (Rango estándar 0 - 100 o escala oficial TT)
    stat_attack INT DEFAULT 0,
    stat_defense INT DEFAULT 0,
    stat_stamina INT DEFAULT 0,
    stat_dash INT DEFAULT 0,
    stat_burst_resistance INT DEFAULT 0,

    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_parts_master_type ON parts_master(part_type);
CREATE INDEX idx_parts_master_display_name ON parts_master USING gin(display_name gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- 3. VARIANTES DE COLOR Y MATERIALES (PART_VARIANTS)
-- Representa una pieza física real producida con un colorway específico.
-- -----------------------------------------------------------------------------

CREATE TABLE part_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_master_id UUID NOT NULL REFERENCES parts_master(id) ON DELETE CASCADE,
    variant_name VARCHAR(150) NOT NULL, -- Ej: "Dran Sword (Blue Classic)", "Phoenix Wing (Red)"
    primary_brand brand_enum NOT NULL DEFAULT 'TAKARA_TOMY',
    finish finish_type_enum NOT NULL DEFAULT 'STANDARD_RAW_METAL',
    
    -- Colorimetría para el motor de visión
    color_primary_hex VARCHAR(7) NOT NULL,   -- Ej: "#0A4DA2" (Azul dominante)
    color_secondary_hex VARCHAR(7),          -- Ej: "#FFD700" (Detalles amarillos)
    color_tertiary_hex VARCHAR(7),
    is_translucent BOOLEAN DEFAULT FALSE,

    -- Identificadores automáticos
    hasbro_qr_payload VARCHAR(255) UNIQUE,   -- Datos de decodificación si es pieza Hasbro
    mold_marking_code VARCHAR(50),           -- Código microscópico grabado en el plástico (si aplica)
    
    image_front_url TEXT,
    image_side_url TEXT,
    image_iso_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_part_variants_master ON part_variants(part_master_id);
CREATE INDEX idx_part_variants_hasbro_qr ON part_variants(hasbro_qr_payload) WHERE hasbro_qr_payload IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 4. PRODUCTOS COMERCIALES / SETS (PRODUCTS_SETS)
-- Representa el producto que se compra en tienda (BX-01, UX-01, Dual Pack Hasbro, etc.)
-- -----------------------------------------------------------------------------

CREATE TABLE products_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku_code VARCHAR(50) NOT NULL UNIQUE,    -- Ej: "BX-01", "UX-01", "HAS-W1-01"
    brand brand_enum NOT NULL,
    product_type product_type_enum NOT NULL,
    official_title VARCHAR(200) NOT NULL,
    release_date DATE,
    barcode_jan_upc VARCHAR(20),            -- Código de barras de la caja (EAN/JAN/UPC)
    box_art_image_url TEXT,
    is_limited_edition BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_products_sets_sku ON products_sets(sku_code);
CREATE INDEX idx_products_sets_brand ON products_sets(brand);

-- -----------------------------------------------------------------------------
-- 5. RELACIÓN PRODUCTO -> PIEZAS INCLUIDAS (PRODUCT_PARTS)
-- Mapea qué variantes exactas vienen dentro de cada set
-- -----------------------------------------------------------------------------

CREATE TABLE product_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products_sets(id) ON DELETE CASCADE,
    part_variant_id UUID NOT NULL REFERENCES part_variants(id) ON DELETE CASCADE,
    quantity_included INT DEFAULT 1,
    is_guaranteed BOOLEAN DEFAULT TRUE, -- FALSE si es un Random Booster donde la pieza es aleatoria
    slot_label VARCHAR(50),             -- Ej: "Main Blade", "Spare Ratchet"
    UNIQUE(product_id, part_variant_id)
);

CREATE INDEX idx_product_parts_composite ON product_parts(product_id, part_variant_id);

-- -----------------------------------------------------------------------------
-- 6. INVENTARIO FÍSICO DEL USUARIO (USER_INVENTORY)
-- -----------------------------------------------------------------------------

CREATE TABLE user_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Referencia a auth.users (Supabase)
    part_variant_id UUID NOT NULL REFERENCES part_variants(id) ON DELETE RESTRICT,
    condition item_condition_enum NOT NULL DEFAULT 'LIGHTLY_USED',
    measured_weight_grams NUMERIC(4,2), -- Peso exacto pesado por el usuario en su báscula
    notes TEXT,
    acquired_at DATE DEFAULT CURRENT_DATE,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_user_inventory_user ON user_inventory(user_id);
CREATE INDEX idx_user_inventory_part ON user_inventory(part_variant_id);

-- -----------------------------------------------------------------------------
-- 7. COMBINACIONES ARMADAS (USER_COMBOS)
-- Una combinación individual Blade + Ratchet + Bit (+ opcional Lock Chip)
-- -----------------------------------------------------------------------------

CREATE TABLE user_combos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    combo_name VARCHAR(100), -- Nombre personalizado (ej: "Dran Buster Destructor")
    
    -- Componentes (apuntan a las piezas físicas del inventario del usuario)
    inventory_blade_id UUID NOT NULL REFERENCES user_inventory(id) ON DELETE RESTRICT,
    inventory_ratchet_id UUID NOT NULL REFERENCES user_inventory(id) ON DELETE RESTRICT,
    inventory_bit_id UUID NOT NULL REFERENCES user_inventory(id) ON DELETE RESTRICT,
    inventory_lock_chip_id UUID REFERENCES user_inventory(id) ON DELETE RESTRICT,

    calculated_weight_grams NUMERIC(4,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_user_combos_user ON user_combos(user_id);

-- -----------------------------------------------------------------------------
-- 8. MAZOS COMPETITIVOS (TOURNAMENT_DECKS)
-- Mazo de 3 Beys (Formato oficial 3on3)
-- -----------------------------------------------------------------------------

CREATE TABLE tournament_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    deck_name VARCHAR(100) NOT NULL DEFAULT 'Mi Deck 3on3',
    combo_slot_1 UUID NOT NULL REFERENCES user_combos(id) ON DELETE RESTRICT,
    combo_slot_2 UUID NOT NULL REFERENCES user_combos(id) ON DELETE RESTRICT,
    combo_slot_3 UUID NOT NULL REFERENCES user_combos(id) ON DELETE RESTRICT,
    is_wbo_legal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 9. VISTA DETALLADA PARA EL ESCÁNER Y LA APP (V_PARTS_CATALOG_FULL)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE VIEW v_parts_catalog_full AS
SELECT 
    pv.id AS variant_id,
    pm.id AS master_id,
    pm.part_type,
    pm.code_name AS master_code,
    pm.display_name AS part_name,
    pv.variant_name,
    pv.primary_brand,
    pv.finish,
    pv.color_primary_hex,
    pv.color_secondary_hex,
    pv.hasbro_qr_payload,
    pm.system,
    pm.spin_direction,
    pm.weight_min_grams,
    pm.weight_max_grams,
    pm.stat_attack,
    pm.stat_defense,
    pm.stat_stamina,
    pm.stat_dash,
    pm.stat_burst_resistance,
    pv.image_front_url,
    pv.image_side_url
FROM part_variants pv
JOIN parts_master pm ON pv.part_master_id = pm.id;
