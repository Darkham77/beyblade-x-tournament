from PIL import Image
import math

def is_skin(r, g, b):
    return (r > 90 and g > 40 and b > 20 and 
            r > g and g >= b and 
            (r - g) >= 10 and (r - b) >= 16 and 
            (max(r, g, b) - min(r, g, b)) < 115)

def rgb_to_lab(r, g, b):
    rLin = ((r/255.0 + 0.055)/1.055)**2.4 if r/255.0 > 0.04045 else (r/255.0)/12.92
    gLin = ((g/255.0 + 0.055)/1.055)**2.4 if g/255.0 > 0.04045 else (g/255.0)/12.92
    bLin = ((b/255.0 + 0.055)/1.055)**2.4 if b/255.0 > 0.04045 else (b/255.0)/12.92
    X = (rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805) * 100
    Y = (rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722) * 100
    Z = (rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505) * 100
    fx = (X/95.047)**(1/3) if X/95.047 > 0.008856 else (7.787*(X/95.047)) + 16/116
    fy = (Y/100.0)**(1/3) if Y/100.0 > 0.008856 else (7.787*(Y/100.0)) + 16/116
    fz = (Z/108.883)**(1/3) if Z/108.883 > 0.008856 else (7.787*(Z/108.883)) + 16/116
    return (116*fy - 16, 500*(fx-fy), 200*(fy-fz))

def delta_e(c1, c2):
    return math.hypot(c1[0]-c2[0], c1[1]-c2[1], c1[2]-c2[2])

def hex_to_lab(h):
    h = h.lstrip('#')
    return rgb_to_lab(int(h[:2], 16), int(h[2:4], 16), int(h[4:6], 16))

def detect_beyblade(img_path):
    img = Image.open(img_path).convert('RGB')
    w, h = img.size
    
    # 1. Downscale for fast circle search
    sw = 240
    sh = int(h * (240.0 / w))
    small = img.resize((sw, sh), Image.Resampling.BILINEAR)
    spix = small.load()
    
    best_score = -1
    best_roi = (sw//2, sh//2, 55)
    
    for cy in range(int(sh * 0.25), int(sh * 0.75), 4):
        for cx in range(int(sw * 0.20), int(sw * 0.80), 4):
            for r in (45, 55, 65, 75):
                border_diff = 0
                valid = True
                for a in range(16):
                    theta = a * (2 * math.pi / 16)
                    x_in = int(cx + (r - 6) * math.cos(theta))
                    y_in = int(cy + (r - 6) * math.sin(theta))
                    x_out = int(cx + (r + 6) * math.cos(theta))
                    y_out = int(cy + (r + 6) * math.sin(theta))
                    if 0 <= x_in < sw and 0 <= y_in < sh and 0 <= x_out < sw and 0 <= y_out < sh:
                        p_in = spix[x_in, y_in][:3]
                        p_out = spix[x_out, y_out][:3]
                        lum_in = 0.2126*p_in[0] + 0.7152*p_in[1] + 0.0722*p_in[2]
                        lum_out = 0.2126*p_out[0] + 0.7152*p_out[1] + 0.0722*p_out[2]
                        border_diff += abs(lum_in - lum_out)
                    else:
                        valid = False
                        break
                if valid:
                    core_c = 0
                    for a in range(8):
                        theta = a * (2 * math.pi / 8)
                        cx_in = int(cx + (r * 0.35) * math.cos(theta))
                        cy_in = int(cy + (r * 0.35) * math.sin(theta))
                        p = spix[cx_in, cy_in][:3]
                        ch = max(p) - min(p)
                        if ch > 15 and not is_skin(p[0], p[1], p[2]):
                            core_c += ch
                    dist_center = math.hypot(cx - sw/2, cy - sh/2) / (sw/2)
                    score = (border_diff + core_c * 2.5) * (1.0 - 0.25 * dist_center)
                    if score > best_score:
                        best_score = score
                        best_roi = (cx, cy, r)
                        
    scale = w / float(sw)
    rcx, rcy, rr = int(best_roi[0] * scale), int(best_roi[1] * scale), int(best_roi[2] * scale)
    
    # 2. Extract colors with skin filtering & core clustering
    pix = img.load()
    outer_samples = []
    core_plastic_samples = []
    core_all_samples = []
    
    for y in range(max(0, rcy - rr), min(h, rcy + rr)):
        for x in range(max(0, rcx - rr), min(w, rcx + rr)):
            d = math.hypot(x - rcx, y - rcy)
            r, g, b = pix[x, y][:3]
            lum = 0.2126*r + 0.7152*g + 0.0722*b
            if 20 <= lum <= 245:
                # Outer metal
                if 0.50 * rr <= d <= 0.95 * rr:
                    if not is_skin(r, g, b):
                        outer_samples.append((r, g, b))
                # Inner core
                elif 0.15 * rr <= d <= 0.48 * rr:
                    core_all_samples.append((r, g, b))
                    # Chromatic plastic check
                    chroma = max(r, g, b) - min(r, g, b)
                    # Non-skin distinct plastic (purple, magenta, blue, red, green, yellow):
                    if chroma > 18:
                        is_purp = (r > g + 12 and b > g + 8)
                        is_blue = (b > r + 15 and b > g + 10)
                        is_green = (g > r + 15 and g > b + 15)
                        is_yellow = (r > 130 and g > 100 and b < 60)
                        if is_purp or is_blue or is_green or is_yellow:
                            core_plastic_samples.append((r, g, b))
                            
    out_rgb = [sum(c[i] for c in outer_samples)//len(outer_samples) for i in range(3)] if outer_samples else [128, 128, 128]
    
    if len(core_plastic_samples) > 50:
        in_rgb = [sum(c[i] for c in core_plastic_samples)//len(core_plastic_samples) for i in range(3)]
    elif core_all_samples:
        in_rgb = [sum(c[i] for c in core_all_samples)//len(core_all_samples) for i in range(3)]
    else:
        in_rgb = [100, 100, 100]
        
    return {
        'roi': (rcx, rcy, rr),
        'metal_rgb': out_rgb,
        'core_rgb': in_rgb,
        'metal_lab': rgb_to_lab(*out_rgb),
        'core_lab': rgb_to_lab(*in_rgb),
    }

# Run on both test images
res_phoenix = detect_beyblade('C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded/media_1792629313430_9f360c43.jpg')
res_mammoth = detect_beyblade('C:/Users/Ro/.gemini/antigravity/brain/17ef0e00-e6cc-4ee2-895a-d93e2cac326a/.user_uploaded/media_1792630234184_0eedad10.jpg')

print('Phoenix detected:', res_phoenix['roi'], 'Metal:', '#%02X%02X%02X' % tuple(res_phoenix['metal_rgb']), 'Core:', '#%02X%02X%02X' % tuple(res_phoenix['core_rgb']))
print('Mammoth detected:', res_mammoth['roi'], 'Metal:', '#%02X%02X%02X' % tuple(res_mammoth['metal_rgb']), 'Core:', '#%02X%02X%02X' % tuple(res_mammoth['core_rgb']))
