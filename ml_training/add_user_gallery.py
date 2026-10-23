with open('C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/src/data/catalog.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Add to PHOENIX_WING gallery
text = text.replace(
    "'PHOENIX_WING': [",
    "'PHOENIX_WING': [\n    { url: '/images/gallery/blades/phoenix_wing/user_phoenix_wing.jpg', label: 'Phoenix Wing 9-60GF (Foto Real del Usuario)', tag: 'REAL' },"
)

# Add to UNICORN_STING gallery
text = text.replace(
    "'UNICORN_STING': [",
    "'UNICORN_STING': [\n    { url: '/images/gallery/blades/unicorn_sting/user_unicorn_sting.jpg', label: 'Unicorn Sting 5-60GP (Foto Real del Usuario)', tag: 'REAL' },"
)

# Add to WIZARD_ROD gallery
text = text.replace(
    "'WIZARD_ROD': [",
    "'WIZARD_ROD': [\n    { url: '/images/gallery/blades/wizard_rod/user_wizard_rod.jpg', label: 'Wizard Rod 5-70DB (Foto Real del Usuario)', tag: 'REAL' },"
)

# Add to MAMMOTH_TUSK gallery
text = text.replace(
    "'MAMMOTH_TUSK': [",
    "'MAMMOTH_TUSK': [\n    { url: '/images/gallery/blades/mammoth_tusk/user_tusk_mammoth.jpg', label: 'Tusk Mammoth 3-60T (Foto Real del Usuario)', tag: 'REAL' },"
)

with open('C:/Users/Ro/.gemini/antigravity/scratch/scanner-de-beys/app/src/data/catalog.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Catalog gallery successfully updated!')
