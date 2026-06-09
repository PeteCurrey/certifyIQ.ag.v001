file_path = "/Users/petercurrey/.gemini/antigravity/brain/48538349-4141-4346-a635-69b5650c568d/.system_generated/steps/6712/content.md"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()
except Exception as e:
    print("Error reading file:", e)
    exit(1)

# Find all occurrences of the word "london" case-insensitively using simple string methods
html_lower = html.lower()
term = "london"
start_idx = 0
matches = []

while True:
    idx = html_lower.find(term, start_idx)
    if idx == -1:
        break
    matches.append(idx)
    start_idx = idx + len(term)

print(f"Total simple occurrences of 'london': {len(matches)}")

# Print context for each match
for i, idx in enumerate(matches):
    start = max(0, idx - 150)
    end = min(len(html), idx + 150)
    snippet = html[start:end].replace("\n", " ").strip()
    print(f"Match {i+1} at index {idx}:")
    print(f"  ... {snippet} ...\n")
