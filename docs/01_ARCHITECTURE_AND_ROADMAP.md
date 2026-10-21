# Hoja de Ruta y Arquitectura General: Scanner de Beys

Este documento describe la arquitectura tecnológica global y el plan de ejecución de 12 semanas para desarrollar **Scanner de Beys**, enfocado en la **Fase 1 (Catálogo, Colección y Constructor)** y la **Fase 3 (Motor de Escáner IA con Cámara)**, dejando una capa de comunicación lista para el gestor de torneos externo.

---

## 1. Stack Tecnológico Recomendado

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENTE (MÓVIL)                        │
│                  Flutter (Dart) o React Native (Expo)                  │
│  - Control nativo de cámara (resolución 1080p, retículas de enfoque)  │
│  - Inferencia de IA On-Device (TFLite / ONNX Runtime Mobile)           │
│  - Soporte offline local con SQLite / WatermelonDB / Supabase Cache    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / WebSockets
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
┌──────────────────────────────┐        ┌───────────────────────────────┐
│       MOTOR DE VISIÓN        │        │      BACKEND & BASE DATOS     │
│   YOLOv11-cls + FastSAM      │        │       Supabase (PostgreSQL)   │
│ - Detección local en móvil    │        │ - Catálogo oficial relacional │
│ - Fallback Cloud en FastAPI  │        │ - Autenticación de usuarios   │
│   (Python) para análisis de  │        │ - Exportador JSON de mazos    │
│   alta resolución            │        │   para gestor de torneos      │
└──────────────────────────────┘        └───────────────────────────────┘
```

---

## 2. Plan de Ejecución de 12 Semanas (Hoja de Ruta)

### Hito 1: Núcleo de Datos y Modelado del Catálogo (Semanas 1 a 3)
* **Semana 1: Esquema de Base de Datos y Configuración**
  * Despliegue de Supabase con el esquema relacional (`parts`, `part_variants`, `products_sets`, `user_inventory`, `decks`).
  * Configuración de políticas de seguridad RLS (Row Level Security) e índices de búsqueda rápida.
* **Semana 2: Curaduría y Carga Masiva de Datos Oficiales**
  * Extracción y normalización de productos Takara Tomy (líneas BX, UX, CX) y Hasbro (Wave 1, 2, 3+).
  * Poblamiento de los primeros 150+ registros entre Blades, Ratchets, Bits y Sets con estadísticas oficiales (Ataque, Defensa, Resistencia, Dash, Burst Resistance) y rangos de peso reales.
* **Semana 3: Interfaz del Catálogo y Filtros Avanzados**
  * Pantalla de exploración con búsqueda por texto, marca (Takara Tomy / Hasbro), sistema (BX / UX / CX) y tipo (Ataque, Defensa, Resistencia, Balance).
  * Vista de detalle de pieza con ficha técnica completa y listado de sets donde se puede conseguir.

### Hito 2: Colección Personal, Deck Builder y API de Torneos (Semanas 4 a 6)
* **Semana 4: Gestión de Inventario Personal ("Mis Beys")**
  * Registro de piezas adquiridas por el usuario, indicando variante de color, condición (Nuevo / En uso) y notas personales.
  * Agrupación visual por piezas sueltas y Beys completos montados.
* **Semana 5: Constructor de Combinaciones (Deck Builder)**
  * Ensamblador dinámico `Blade + Ratchet + Bit`.
  * Gráfico de radar automático de estadísticas combinadas y cálculo de peso total estimado.
  * Validador de reglas para formato competitivo **3on3 (WBO / Takara Tomy)**: prohibición de piezas repetidas en un mismo mazo.
* **Semana 6: Contrato y Exportación hacia el Gestor de Torneos**
  * Generación del payload JSON estandarizado para cada mazo registrado.
  * Funcionalidad de exportación por código QR o API directa (`POST /api/v1/tournaments/decks/export`) para transferir el mazo al gestor de torneos externo sin fricción.

### Hito 3: Dataset de Entrenamiento y Tubería de Visión Artificial (Semanas 7 a 9)
* **Semana 7: Recopilación y Generación del Dataset**
  * Generación de datos sintéticos mediante scripts de Blender usando modelos 3D (.STL / .OBJ) con renderizado bajo diferentes mapas de luz HDRI, reflejos metálicos y rayones.
  * Aumentación fotométrica masiva con Albumentations (rotaciones 360°, cambios de exposición, simulación de reflejos especulares de flash).
* **Semana 8: Entrenamiento de los Modelos de Clasificación**
  * Entrenamiento del clasificador de moldes base con YOLOv11-cls / MobileNetV4.
  * Módulo de segmentación para aislar la pieza del fondo y extraer la paleta de colores dominantes (K-Means Clustering).
  * Integración del decodificador ZBar / ZXing para lectura instantánea de micro códigos QR de Hasbro.
* **Semana 9: Optimización y Conversión para Dispositivos Móviles**
  * Cuantización del modelo a `INT8 / FP16` para ONNX Runtime Mobile / TFLite.
  * Benchmarking en dispositivos gama media y alta (tiempo de inferencia objetivo: <80 ms por cuadro).

### Hito 4: Integración del Escáner en la App Móvil y Pruebas Reales (Semanas 10 a 12)
* **Semana 10: Interfaz de la Cámara y Guías de Encuadre**
  * Implementación de la vista de cámara en tiempo real con retículas visuales (círculo guía para Blades y vista de perfil para Bits/Ratchets).
  * Detección de estabilidad de cámara antes de procesar el cuadro para evitar imágenes borrosas.
* **Semana 11: Tubería Híbrida Asistida (Confirmación en 1 Tap)**
  * Flujo de resolución: Inferencia -> Mapeo relacional -> Tarjeta de confirmación visual.
  * Interfaz de selección rápida en caso de que una pieza comparta molde con múltiples sets (ejemplo: Dran Sword en BX-01 vs BX-08).
* **Semana 12: Pruebas de Campo, Calibración de Desgaste y Lanzamiento**
  * Pruebas de campo con piezas reales desgastadas en batalla, con pintura descascarillada y en diferentes condiciones de iluminación (sala de torneo, luz natural, sombra).
  * Ajuste fino de umbrales de confianza y lanzamiento de la versión Beta.

---

## 3. Matriz de Riesgos y Mitigación

| Riesgo Técnico | Impacto | Probabilidad | Estrategia de Mitigación |
| :--- | :---: | :---: | :--- |
| **Reflejos en metal confunden la IA** | Alto | Alta | Normalización de color por histogramas locales y generación sintética con mapas de luz reflectantes en el entrenamiento. |
| **Confusión entre Ratchet 60 vs 80** | Medio | Alta | La retícula de la cámara exige encuadre lateral a 45°; si la confianza es <90%, se presenta un selector rápido de dos opciones (60 u 80). |
| **Diferencias entre TT y Hasbro en piezas idénticas** | Medio | Media | Priorizar lectura del código QR Hasbro; si no existe código físico en la pieza, se cataloga por molde y el usuario selecciona la marca con un toque. |
| **Latencia alta en celulares antiguos** | Alto | Media | Modelo ligero cuantizado en INT8 (<15 MB) ejecutado directamente en la NPU/GPU del teléfono sin depender de conexión a internet. |
