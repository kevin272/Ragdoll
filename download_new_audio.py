import urllib.request
import os

public_dir = "public"

files = {
    "bgm.mp3": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Local%20Forecast%20-%20Elevator.mp3",
    "scream1.ogg": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg",
    "scream2.ogg": "https://upload.wikimedia.org/wikipedia/commons/1/15/Cartoon_Boing_Sound_Effect.ogg",
    "scream3.ogg": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Male_scream_short.ogg"
}

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
urllib.request.install_opener(opener)

for filename, url in files.items():
    filepath = os.path.join(public_dir, filename)
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"Success: {filename}")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")
