import os
import re

app_public = os.path.abspath('app/public')
with open('app/src/data/catalog.ts', 'r', encoding='utf-8') as f:
    code = f.read()

paths = re.findall(r"['\"](/images/[^'\"]+)['\"]", code)
print(f"Total image references found in catalog.ts: {len(paths)}")
unique_paths = set(paths)
print(f"Unique paths: {len(unique_paths)}")

missing = 0
for p in unique_paths:
    rel = p.lstrip('/')
    full = os.path.join(app_public, rel.replace('/', os.sep))
    if not os.path.exists(full):
        print('MISSING ON DISK:', p)
        missing += 1

if missing == 0:
    print('--> 100% SUCCESS: All', len(unique_paths), 'referenced images exist on disk!')
