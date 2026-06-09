import urllib.request

url = "https://oililyuk.github.io/amado/London.mp4"
req = urllib.request.Request(
    url, 
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }
)

print("Attempting download of:", url)
try:
    with urllib.request.urlopen(req, timeout=15) as response:
        info = response.info()
        print("Status/Info:")
        print("Content type:", info.get_content_type())
        print("Content length:", info.get("Content-Length"))
        
        # Read a tiny chunk to verify it works
        chunk = response.read(100)
        print("First 20 bytes:", chunk[:20])
        print("Looks like MP4?" , b"ftyp" in chunk)
except Exception as e:
    print("Download failed:", e)
