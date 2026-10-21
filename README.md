# Scanner de Beys (Beyblade X)

Plataforma integral de catalogación, inventario, construcción de combinaciones competitivas y motor de escaneo inteligente por visión artificial para productos **Beyblade X** (Takara Tomy y Hasbro).

---

## 📌 Alcance del Proyecto

Este repositorio concentra la arquitectura y el desarrollo de:
1. **Fase 1: Catálogo Completo, Inventario y Constructor de Beys (Deck Builder)**
   * Catálogo unificado relacional de piezas oficiales (Blades, Ratchets, Bits, Lock Chips) tanto de **Takara Tomy** como de **Hasbro**.
   * Registro individual de piezas por colección física, acabados y variantes de color (Sets, Boosters, Starters, Random Boosters, Premios Rare Bey Get).
   * Constructor de combinaciones (Deck Builder) con cálculo de stats oficiales, peso acumulado y validador de reglas competitivas (Formato 3on3 sin piezas repetidas).
   * **Contrato de Integración API / JSON** listo para exportar mazos y combos hacia el proyecto independiente del **Gestor de Torneos**.

2. **Fase 3: Motor de Escaneo y Visión Artificial (Computer Vision Scanner)**
   * Tubería de inferencia móvil local (Edge AI / TFLite / ONNX) de alta velocidad (<100 ms).
   * Detección y clasificación por etapas: Reconocimiento de tipo de pieza, clasificación geométrica de molde, extracción de colorimetría/acabado y cruce relacional contra el catálogo oficial.
   * Detección por vía rápida para códigos QR / DataMatrix de piezas Hasbro.
   * Interfaz asistida *"Human-in-the-Loop"* para garantizar **0% de alucinaciones y 100% de precisión** en el inventario del usuario.

---

## 📂 Estructura de la Documentación Técnica

* [`docs/01_ARCHITECTURE_AND_ROADMAP.md`](file:///C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/docs/01_ARCHITECTURE_AND_ROADMAP.md): Hoja de ruta paso a paso de 12 semanas, stack tecnológico y metodología de desarrollo.
* [`docs/02_DATABASE_SCHEMA.sql`](file:///C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/docs/02_DATABASE_SCHEMA.sql): Esquema DDL SQL en PostgreSQL/Supabase con tablas, enumeraciones, índices y relaciones íntegras.
* [`docs/03_SCANNER_COMPUTER_VISION.md`](file:///C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/docs/03_SCANNER_COMPUTER_VISION.md): Especificación exhaustiva de la tubería de visión artificial, solución a reflejos/desgaste, generación de dataset sintético (Blender 3D) y entrenamiento.
* [`docs/04_TOURNAMENT_INTEGRATION_API.md`](file:///C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/docs/04_TOURNAMENT_INTEGRATION_API.md): Contrato de integración API y esquema JSON de exportación para conectar con el gestor de torneos externo.
* [`data/seed_catalog_sample.json`](file:///C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/data/seed_catalog_sample.json): Dataset inicial con datos reales de piezas y sets emblemáticos de Takara Tomy y Hasbro.
