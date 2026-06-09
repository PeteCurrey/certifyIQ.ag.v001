import json

log_path = "/Users/petercurrey/.gemini/antigravity/brain/48538349-4141-4346-a635-69b5650c568d/.system_generated/logs/transcript.jsonl"

try:
    with open(log_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            try:
                obj = json.loads(line)
                tool_calls = obj.get("tool_calls", [])
                for tc in tool_calls:
                    args = tc.get("args", {})
                    args_str = json.dumps(args)
                    if "hero-video.mp4" in args_str and ("urllib" in args_str or "curl" in args_str or "wget" in args_str or "python" in args_str):
                        print(f"Step {obj.get('step_index')}: {tc.get('name')}")
                        print("Arguments:", args)
                        print("-" * 50)
            except Exception as e:
                pass
except Exception as e:
    print("Error reading transcript:", e)
