import re

file_path = "/Users/petercurrey/.gemini/antigravity/brain/48538349-4141-4346-a635-69b5650c568d/.system_generated/steps/6712/content.md"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()
except Exception as e:
    print("Error reading file:", e)
    exit(1)

# Find title
title_match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE)
print("Title:", title_match.group(1) if title_match else "No Title")

# Find headings
print("\nHeadings:")
headings = re.findall(r"<(h1|h2|h3)[^>]*>(.*?)</\1>", html, re.IGNORECASE | re.DOTALL)
for h_type, text in headings:
    clean_text = re.sub(r"<[^>]+>", "", text).strip()
    print(f" - {h_type}: {clean_text}")

# Let's find any text that looks like result count or search status
for pattern in [r"result", r"search", r"found", r"no video", r"sorry", r"oops"]:
    matches = re.findall(rf"[^.!?\n]*?{pattern}[^.!?\n]*?", html, re.IGNORECASE)
    print(f"\nPattern '{pattern}' matches: {len(matches)}")
    for m in matches[:5]:
        print(" -", m.strip()[:100])
