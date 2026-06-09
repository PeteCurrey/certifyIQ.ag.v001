file_path = "/Users/petercurrey/.gemini/antigravity/brain/48538349-4141-4346-a635-69b5650c568d/.system_generated/steps/6712/content.md"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()
except Exception as e:
    print("Error reading file:", e)
    exit(1)

# Search for any URL matching cdn.coverr.co/.../1080p.mp4 or other mp4
import re
urls = set(re.findall(r'(https?://cdn\.coverr\.co/[^\s"\x5c`]+?\.mp4)', html))
print(f"Found {len(urls)} CDN URLs:")
for u in sorted(list(urls)):
    print(" -", u)
