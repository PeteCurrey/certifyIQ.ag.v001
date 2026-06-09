import json
import re

file_path = "/Users/petercurrey/.gemini/antigravity/brain/48538349-4141-4346-a635-69b5650c568d/.system_generated/steps/6712/content.md"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()
except Exception as e:
    print("Error reading file:", e)
    exit(1)

json_blocks = re.findall(r'<script[^>]*type="application/json"[^>]*>(.*?)</script>', html, re.DOTALL)
if not json_blocks:
    print("No JSON block found.")
    exit(1)

print(f"Parsing script block of size {len(json_blocks[0])} bytes...")

try:
    data = json.loads(json_blocks[0])
except Exception as e:
    print("JSON loading failed:", e)
    # Let's try to search inside the raw string if parsing fails
    data = None

# If we have parsed JSON successfully
if data:
    # Recursively find any dictionaries that have a 'slug' key
    video_details = []
    
    def search_dict(obj):
        if isinstance(obj, dict):
            if "slug" in obj and ("video" in str(obj.get("type", "")).lower() or "urls" in obj or "thumbnail" in obj):
                video_details.append(obj)
            for k, v in obj.items():
                search_dict(v)
        elif isinstance(obj, list):
            for item in obj:
                search_dict(item)

    search_dict(data)
    print(f"Found {len(video_details)} video objects in JSON structure.")
    
    london_videos = []
    for v in video_details:
        slug = v.get("slug", "")
        title = v.get("title", "")
        desc = v.get("description", "")
        text_content = f"{slug} {title} {desc}".lower()
        if "london" in text_content:
            london_videos.append(v)
            
    print(f"Found {len(london_videos)} London-related videos in JSON:")
    for lv in london_videos:
        print("Slug:", lv.get("slug"))
        print("Title:", lv.get("title"))
        print("URLs keys:", list(lv.get("urls", {}).keys()) if lv.get("urls") else "No URLs")
        print("Is Premium:", lv.get("isPremium"))
        print("Urls object:", lv.get("urls"))
        print("-" * 40)

else:
    # Fallback to string search for "slug":"..." and "urls"
    # Find all occurrences of "slug":"..." and search for "london" around it
    matches = re.finditer(r'"slug"\s*:\s*"([^"]*london[^"]*)"', html, re.IGNORECASE)
    print("Direct slug regex matches:")
    for m in matches:
        print("Found:", m.group(1))
