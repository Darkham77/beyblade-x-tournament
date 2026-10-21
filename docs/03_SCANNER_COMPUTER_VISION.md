# Especificación Técnica: Motor de Escaneo y Visión Artificial

Este documento detalla la arquitectura de visión por computador, la tubería de inferencia, la generación del dataset de entrenamiento y las estrategias para resolver las dificultades físicas de las piezas de **Beyblade X** (reflejos de metal fundido, desgastes de batalla y variaciones milimétricas).

---

## 1. El Reto Físico y la Tubería en Cascada (Pipeline)

Para conseguir una precisión absoluta (**100% de exactitud y 0% de alucinaciones en el inventario final**), la aplicación no utiliza un modelo genérico de caja negra, sino una **tubería de inferencia en etapas secuenciales**:

```
                              CÁMARA DEL CELULAR
                                      │
                     [ Resolución 1080p / 30 FPS ]
                                      │
                     ▼                                ▼
            (Ruta A: Hasbro QR)              (Ruta B: Visión Artificial)
       ¿Código DataMatrix detectado?          Sin código físico visible
                     │                                │
                     ├─ SÍ ──► [ Decodificador QR ]   ▼
                     │                 │        [ Preprocesamiento & ROI ]
                     │                 │        - Retícula circular/lateral
                     │                 │        - Normalización CLAHE (Luz)
                     │                 │              │
                     │                 │              ▼
                     │                 │        [ Etapa 1: Clasificador de Molde ]
                     │                 │        - Red Convolucional (YOLOv11-cls)
                     │                 │        - Resultado: Molde (ej: Phoenix Wing)
                     │                 │              │
                     │                 │              ▼
                     │                 │        [ Etapa 2: Extractor de Color & Acabado ]
                     │                 │        - Segmentación de fondo
                     │                 │        - Clustering K-Means en CIE-Lab
                     │                 │        - Detección de brillo metálico / pintura
                     │                 │              │
                     ▼                 ▼              ▼
           ┌─────────────────────────────────────────────────────────┐
           │        MOTOR DE CRUCE RELACIONAL (PostgreSQL)          │
           │  Busca variantes oficiales que coincidan con Molde +    │
           │  Distancia de Color (Delta E) + Acabado                 │
           └───────────────────────────┬─────────────────────────────┘
                                       │
                                       ▼
                       [ INTERFAZ DE CONFIRMACIÓN ]
                       Muestra la ficha técnica oficial exacta:
                       "Phoenix Wing (Rojo Metálico) - Set BX-23"
                       [ Confirmar con 1 Tap ]  [ Ver alternativas ]
```

---

## 2. Las Etapas de la Tubería de Visión

### Etapa 0: Captura Guiada y Normalización Fotométrica
* **Retícula visual activa en la pantalla:**
  * Para **Blades:** Retícula circular frontal. Obliga al usuario a centrar la pieza y evitar ángulos oblicuos.
  * Para **Ratchets y Bits:** Retícula angular inclinada (vista isométrica de 45°). Permite capturar simultáneamente la silueta superior y la altura del perfil.
* **Control de Reflejos (CLAHE):** Se aplica *Contrast Limited Adaptive Histogram Equalization* sobre el canal de luminancia (espacio de color LAB). Esto neutraliza los reflejos intensos del flash o las bombillas sobre el metal fundido (*Die-cast zinc*).

### Etapa 1: Fast-Path para Piezas Hasbro (Decodificación QR)
* Las piezas producidas por Hasbro poseen un microcódigo DataMatrix / QR grabado en la parte inferior.
* Se ejecuta un hilo ultrarrápido con **ZBar / ZXing C++ embebido**:
  * Si el código es legible, devuelve directamente el `hasbro_qr_payload`.
  * La consulta SQL a `part_variants` devuelve de inmediato el SKU exacto con **100% de precisión matemática en menos de 30 milisegundos**, omitiendo la red neuronal.

### Etapa 2: Clasificación de Molde Base (YOLOv11-cls / MobileNetV4)
* **Entrada:** Imagen recortada (*Region of Interest*) escalada a 384x384 píxeles.
* **Salida:** Vector de probabilidades sobre los moldes base registrados (ejemplo: `P(Dran Buster) = 0.97`, `P(Wizard Rod) = 0.02`).
* **¿Por qué este modelo?**
  * La geometría perimetral de las piezas de Beyblade X es única. Aunque una pieza esté pintada de negro, rojo o sea de metal pulido, los puntos de contacto, las hendiduras para el ratchet y los salientes conservan su forma exacta.

### Etapa 3: Extracción de Color y Textura (Colorimetría Científica)
Una vez identificado el molde (ejemplo: *Dran Sword*), se aísla la pieza eliminando el fondo mediante una máscara binaria.
1. La imagen se convierte al espacio de color **CIE-L\*a\*b\*** (que replica la percepción del ojo humano frente a la luz).
2. Se ejecuta un algoritmo **K-Means (k=3)** sobre los píxeles no metálicos para extraer:
   * **Color primario:** Tono dominante del plástico (ej: Azul `#0048BA`).
   * **Color secundario:** Detalles pintados o engranajes (ej: Amarillo `#FFCC00`).
3. Se calcula la distancia euclidiana perceptual ($\Delta E_{00}$) entre los colores extraídos y las variantes oficiales de ese molde registradas en la base de datos.

### Etapa 4: Cruce y Resolución de Ambigüedades
* Si el molde y el color solo existen en un único set (ejemplo: *Phoenix Wing Rojo* del set *BX-23*), el sistema lo presenta como coincidencia directa (99% certeza).
* **El caso de piezas idénticas en múltiples sets:**
  * Ejemplo: El *Dran Sword 3-60F* azul clásico viene tanto en el **Starter BX-01** como en el set **BX-08 3on3 Deck Set**.
  * La pieza física es idéntica molécula a molécula. En este caso, la app informa al usuario: *"Detectado: Dran Sword Azul (Original). ¿De qué set lo conseguiste?"* mostrando las cajas de BX-01 y BX-08 para que toque la suya.

---

## 3. Estrategia del Dataset: Generación Sintética con Blender 3D

Para no tener que tomar manualmente 20,000 fotografías de piezas reales, el dataset se entrena con un enfoque híbrido: **85% datos sintéticos fotorrealistas + 15% fotos reales de validación**.

```python
# Concepto del Script generador de Dataset Sintético en Blender (Python API)
# Se ejecuta en lote para generar variaciones infinitas de cada pieza.

import bpy
import random
import math

def generate_synthetic_samples(part_mesh_path, output_dir, samples_count=500):
    # 1. Cargar el modelo 3D (.OBJ / .STL) de la pieza
    bpy.ops.wm.obj_import(filepath=part_mesh_path)
    part = bpy.context.selected_objects[0]
    
    # 2. Configurar cámara y render en ciclos fotorrealistas
    cam = bpy.data.objects['Camera']
    
    for i in range(samples_count):
        # Variar rotación de la pieza (0 a 360 grados)
        part.rotation_euler = (
            math.radians(random.uniform(-10, 10)), # Ligera inclinación
            math.radians(random.uniform(-10, 10)),
            math.radians(random.uniform(0, 360))   # Giro libre
        )
        
        # Variar entorno de iluminación (HDRI aleatorio: cuarto oscuro, torneo, sol directo)
        hdri_environment = get_random_hdri_texture()
        bpy.data.worlds['World'].node_tree.nodes['Environment'].image = hdri_environment
        
        # Simular desgaste físico (Rayones en el metal shader)
        part.material_slots[0].material.node_tree.nodes['Roughness'].default_value = random.uniform(0.1, 0.45)
        part.material_slots[0].material.node_tree.nodes['Metallic'].default_value = random.uniform(0.85, 1.0)
        
        # Renderizar y guardar imagen con su etiqueta correspondiente
        bpy.context.scene.render.filepath = f"{output_dir}/sample_{i}.png"
        bpy.ops.render.render(write_still=True)
```

### Aumentaciones Fotométricas Adicionales (Librería Albumentations):
* **Specular Glare:** Añadir manchas blancas semitransparentes simulando reflejos de luces de techo de centros de convenciones.
* **Motion Blur:** Simular el ligero temblor del pulso del usuario.
* **Color Temperature Jitter:** Simular balances de blancos cálidos (2700K) y fríos (6500K).

---

## 4. Despliegue en el Teléfono Móvil (Edge AI)

Para que el usuario no dependa de tener cobertura de internet en los torneos y la app responda al instante:

1. **Formato:** Los pesos entrenados en PyTorch se exportan a **ONNX** y se cuantizan a enteros de 8 bits (**TFLite INT8**).
2. **Tamaño del modelo:** Menor a **18 Megabytes** (fácil de integrar directamente en el binario de la app).
3. **Aceleración por Hardware:**
   * **iOS:** CoreML / Apple Neural Engine (ANE).
   * **Android:** NNAPI / GPU Delegate.
4. **Tiempo de inferencia:** Entre **45 ms y 85 ms** en teléfonos estándar (Snapdragon 778G / A13 Bionic o superiores).
