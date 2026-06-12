import urllib.request
import os
from gtts import gTTS

public_dir = "public"
if not os.path.exists(public_dir):
    os.makedirs(public_dir)

# Download a royalty-free test BGM
bgm_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
bgm_path = os.path.join(public_dir, "bgm.mp3")
print("Downloading BGM...")
try:
    urllib.request.urlretrieve(bgm_url, bgm_path)
    print("BGM downloaded successfully.")
except Exception as e:
    print(f"Failed to download BGM: {e}")

# Generate screams using gTTS
screams = {
    "scream1.mp3": "Aaaaaaaahhhhhhhhhh!",
    "scream2.mp3": "Oof!",
    "scream3.mp3": "Ouch!"
}

for filename, text in screams.items():
    print(f"Generating {filename}...")
    try:
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(os.path.join(public_dir, filename))
        print(f"{filename} generated.")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")
