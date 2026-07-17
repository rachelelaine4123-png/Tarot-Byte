"""
normalize_cards.py
Pads all tarot/oracle/decan card images to a consistent 2:3.5 portrait ratio
(matching standard tarot card proportions ~1:1.75).

Target sizes:
  tarot-cards/  : 1024x1792  (from 1024x1024)
  oracle/       : 1024x1792  (from 1024x1024)
  decan-cards/  : 1024x1792  (from 512x512, also upscales)

Padding color: (0, 0, 0) — pure black, matches existing card borders.
Cards are centered vertically; the gold border artwork stays exactly as-is.
"""

from PIL import Image
import os
import sys

TARGET_W = 1024
TARGET_H = 1792
PAD_COLOR = (0, 0, 0)

DIRS = [
    "public/tarot-cards",
    "public/oracle",
    "public/decan-cards",
]

def normalize(path):
    img = Image.open(path).convert("RGB")
    src_w, src_h = img.size

    # If already correct, skip
    if src_w == TARGET_W and src_h == TARGET_H:
        print(f"  SKIP (already correct): {path}")
        return

    # Upscale small images (decan 512x512 → 1024x1024) before padding
    if src_w < TARGET_W:
        scale = TARGET_W / src_w
        new_w = int(src_w * scale)
        new_h = int(src_h * scale)
        img = img.resize((new_w, new_h), Image.LANCZOS)
        src_w, src_h = img.size
        print(f"  Upscaled to {src_w}x{src_h}")

    # Create target canvas
    canvas = Image.new("RGB", (TARGET_W, TARGET_H), PAD_COLOR)

    # Center the image on the canvas
    x_off = (TARGET_W - src_w) // 2
    y_off = (TARGET_H - src_h) // 2
    canvas.paste(img, (x_off, y_off))

    canvas.save(path, "PNG", optimize=False)
    print(f"  ✓ {os.path.basename(path):40s}  {src_w}x{src_h} → {TARGET_W}x{TARGET_H}")

def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    total = 0
    for d in DIRS:
        full_dir = os.path.join(base, d)
        if not os.path.isdir(full_dir):
            print(f"  [WARN] directory not found: {full_dir}")
            continue
        print(f"\n📁 {d}")
        files = sorted(f for f in os.listdir(full_dir) if f.lower().endswith(".png"))
        for fname in files:
            fpath = os.path.join(full_dir, fname)
            normalize(fpath)
            total += 1
    print(f"\n✅ Done — processed {total} files.")

if __name__ == "__main__":
    main()
