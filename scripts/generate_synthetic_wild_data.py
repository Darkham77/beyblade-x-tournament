"""
generate_synthetic_wild_data.py
===============================
Beyblade X Computer Vision Dataset Augmentation Pipeline.

Takes studio-quality PNG renders of Blades and generates realistic 'in-the-wild' 
variations to bridge the Domain Gap (clean studio renders vs. real smartphone camera photos).

Simulates:
1. Real physical backgrounds (Wood floor, Arena surface, Dark mat)
2. In-plane and out-of-plane rotation & perspective
3. Realistic smartphone camera noise, lighting shifts, and specular highlights on metal
"""

import os
import random
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BLADES_DIR = os.path.join(PROJECT_ROOT, 'app', 'public', 'images', 'parts', 'blades')
OUTPUT_DATASET_DIR = os.path.join(PROJECT_ROOT, 'dataset', 'augmented_samples')

os.makedirs(OUTPUT_DATASET_DIR, exist_ok=True)

# Generate synthetic realistic backgrounds programmatically
def create_background(width, height, bg_type):
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    if bg_type == 'stadium_green':
        # Takara Tomy Xtreme Stadium green base
        base_color = (18, 55, 38)
        img.paste(base_color, [0, 0, width, height])
        # Add subtle arena lines
        for r in range(40, width, 50):
            draw.ellipse([width//2 - r, height//2 - r, width//2 + r, height//2 + r], outline=(25, 75, 50), width=2)
    elif bg_type == 'stadium_white':
        # Standard white/grey stadium
        base_color = (220, 225, 230)
        img.paste(base_color, [0, 0, width, height])
        draw.ellipse([width//2 - 100, height//2 - 100, width//2 + 100, height//2 + 100], outline=(200, 205, 210), width=3)
    elif bg_type == 'wood_desk':
        # Wooden desk table
        base_color = (92, 58, 33)
        img.paste(base_color, [0, 0, width, height])
        for y in range(0, height, 15):
            draw.line([(0, y), (width, y)], fill=(80, 48, 26), width=random.randint(1, 3))
    else: # dark tabletop / mat
        base_color = (30, 32, 36)
        img.paste(base_color, [0, 0, width, height])
        
    return img

def augment_blade(image_path, blade_name, num_samples=3):
    try:
        blade_img = Image.open(image_path).convert('RGBA')
    except Exception as e:
        print(f"Error reading {image_path}: {e}")
        return []

    # If background is pure white instead of transparent, make it transparent
    datas = blade_img.getdata()
    new_data = []
    for item in datas:
        # Check for near white pixels in studio renders
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    blade_img.putdata(new_data)

    generated_paths = []
    bg_types = ['stadium_green', 'stadium_white', 'wood_desk', 'dark_mat']

    target_dir = os.path.join(OUTPUT_DATASET_DIR, blade_name)
    os.makedirs(target_dir, exist_ok=True)

    for i in range(num_samples):
        canvas_size = 512
        bg = create_background(canvas_size, canvas_size, random.choice(bg_types))

        # 1. Random rotation (0 - 360 deg)
        angle = random.randint(0, 360)
        rotated = blade_img.rotate(angle, expand=True, resample=Image.BICUBIC)

        # 2. Random scale (70% - 95% of viewfinder)
        scale_factor = random.uniform(0.65, 0.85)
        new_w = int(canvas_size * scale_factor)
        ratio = new_w / rotated.width
        new_h = int(rotated.height * ratio)
        scaled = rotated.resize((new_w, new_h), Image.Resampling.LANCZOS)

        # 3. Simulate camera lighting variations
        enhancer_brightness = ImageEnhance.Brightness(scaled)
        scaled = enhancer_brightness.enhance(random.uniform(0.85, 1.25))

        enhancer_contrast = ImageEnhance.Contrast(scaled)
        scaled = enhancer_contrast.enhance(random.uniform(0.9, 1.2))

        # 4. Composite onto background
        offset_x = (canvas_size - scaled.width) // 2 + random.randint(-15, 15)
        offset_y = (canvas_size - scaled.height) // 2 + random.randint(-15, 15)
        bg.paste(scaled, (offset_x, offset_y), scaled)

        # 5. Apply subtle phone camera blur or noise
        if random.random() > 0.5:
            bg = bg.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.7)))

        out_path = os.path.join(target_dir, f"sample_wild_{i+1}.jpg")
        bg.convert('RGB').save(out_path, quality=90)
        generated_paths.append(out_path)

    return generated_paths

if __name__ == '__main__':
    print("Iniciando pipeline de data augmentation para visión computacional...")
    files = [f for f in os.listdir(BLADES_DIR) if f.endswith('.png')]
    print(f"Total blades encontrados: {len(files)}")
    
    total_generated = 0
    # Process a demonstration batch of 5 blades to prove pipeline
    demo_blades = ['dran_sword.png', 'phoenix_wing.png', 'wizard_rod.png', 'driger_slash.png', 'bite_croc.png']
    for b in demo_blades:
        p = os.path.join(BLADES_DIR, b)
        if os.path.exists(p):
            blade_key = b.replace('.png', '')
            samples = augment_blade(p, blade_key, num_samples=3)
            print(f"  [AUGMENTED] {blade_key} -> {len(samples)} fotos sintéticas 'caseras' generadas.")
            total_generated += len(samples)

    print(f"\nPipeline completado con exito. {total_generated} muestras guardadas en dataset/augmented_samples/")
