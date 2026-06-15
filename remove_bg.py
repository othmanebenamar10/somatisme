from PIL import Image
import os

LOGO_PATHS = [
    r"client\public\brands\ADF.png",
    r"client\public\brands\Coca-cola.png",
    r"client\public\brands\FATER.png",
    r"client\public\brands\Leaderfood.png",
    r"client\public\brands\Scantech Australia.png",
    r"client\public\brands\Somachame.png",
    r"client\public\brands\bimbo.png",
    r"client\public\brands\danone.png",
    r"client\public\brands\ocp.png",
    r"client\public\brands\safran.png",
    r"client\public\brands\somasteel.png",
    r"client\public\brands\sonasid.png",
    r"client\public\pg.png",
]

def remove_white_bg(path, threshold=240):
    img = Image.open(path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        if r >= threshold and g >= threshold and b >= threshold:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    img.putdata(new_data)
    # Save back as PNG (overwrites original)
    img.save(path, "PNG")
    print(f"✅ {os.path.basename(path)}")

base = os.path.dirname(os.path.abspath(__file__))
for rel in LOGO_PATHS:
    full = os.path.join(base, rel)
    if os.path.exists(full):
        try:
            remove_white_bg(full)
        except Exception as e:
            print(f"❌ {rel}: {e}")
    else:
        print(f"⚠️  Fichier introuvable: {rel}")

print("\nTerminé.")
