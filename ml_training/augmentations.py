import random
import math
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import torchvision.transforms as T
import torch

class SpecularFlashGlare:
    """Randomly adds a phone flash reflection with bloom/falloff."""
    def __init__(self, p=0.45):
        self.p = p

    def __call__(self, img: Image.Image) -> Image.Image:
        if random.random() > self.p:
            return img

        w, h = img.size
        # Pick flash center near blade/core
        fx = random.randint(int(w * 0.25), int(w * 0.75))
        fy = random.randint(int(h * 0.25), int(h * 0.75))
        radius = random.randint(int(min(w, h) * 0.15), int(min(w, h) * 0.40))

        # Create radial glare overlay
        glare = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(glare)
        
        # Multiple concentric circles with decreasing alpha
        for r in range(radius, 5, -8):
            alpha = int(255 * (1.0 - (r / radius) ** 0.5) * 0.85)
            draw.ellipse((fx - r, fy - r, fx + r, fy + r), fill=(255, 255, 255, alpha))

        # Draw intense core
        core_r = max(5, int(radius * 0.25))
        draw.ellipse((fx - core_r, fy - core_r, fx + core_r, fy + core_r), fill=(255, 255, 255, 240))

        glare = glare.filter(ImageFilter.GaussianBlur(radius=random.uniform(4, 9)))
        img_rgba = img.convert('RGBA')
        composite = Image.alpha_composite(img_rgba, glare)
        return composite.convert('RGB')

class FingerOcclusionCutout:
    """Simulates fingers holding the Beyblade on the edges."""
    def __init__(self, p=0.40):
        self.p = p

    def __call__(self, img: Image.Image) -> Image.Image:
        if random.random() > self.p:
            return img

        w, h = img.size
        draw_img = img.copy()
        draw = ImageDraw.Draw(draw_img)

        # Skin tones (warm tans/browns/peaches)
        skin_r = random.randint(140, 220)
        skin_g = random.randint(90, 160)
        skin_b = random.randint(60, 130)

        # Place 1 or 2 finger ovals along outer edge
        for _ in range(random.choice([1, 2])):
            angle = random.uniform(0, 2 * math.pi)
            dist = min(w, h) * random.uniform(0.38, 0.50)
            cx = w / 2 + dist * math.cos(angle)
            cy = h / 2 + dist * math.sin(angle)
            rw = random.randint(int(w * 0.15), int(w * 0.35))
            rh = random.randint(int(h * 0.12), int(h * 0.25))
            draw.ellipse((cx - rw, cy - rh, cx + rw, cy + rh), fill=(skin_r, skin_g, skin_b))

        return draw_img

def get_train_transforms():
    return T.Compose([
        # Beyblades rotate 360 degrees freely, but NEVER flip (spin chirality: Right vs Left spin)
        T.RandomRotation(degrees=180, interpolation=T.InterpolationMode.BILINEAR, expand=False),
        SpecularFlashGlare(p=0.45),
        FingerOcclusionCutout(p=0.40),
        T.RandomResizedCrop(224, scale=(0.80, 1.10), ratio=(0.95, 1.05), interpolation=T.InterpolationMode.BILINEAR),
        T.RandomPerspective(distortion_scale=0.18, p=0.4, interpolation=T.InterpolationMode.BILINEAR),
        T.ColorJitter(brightness=0.35, contrast=0.35, saturation=0.35, hue=0.20),
        T.RandomGrayscale(p=0.15),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

def get_val_transforms():
    return T.Compose([
        T.Resize((224, 224), interpolation=T.InterpolationMode.BILINEAR),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
