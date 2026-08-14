#!/usr/bin/env python3
"""
fix_leo_hue.py

Leo's mane highlights render as golden-yellow (~hue 30) where every other
zodiac card in the front-page row (Aries, Cancer, Virgo, Capricorn, etc.)
uses an orange-red "flame" palette (~hue 15-20). This shifts only the warm,
bright, saturated pixels toward that established hue -- it leaves the cyan
eyes, dark background, and border untouched, since those aren't part of the
"flame" that's supposed to be color-consistent across the deck.
"""
import sys
import colorsys
from PIL import Image

SRC = "public/oracle/leo.png"
OUT = "public/oracle/leo.png"

# Only touch pixels that are warm (candidate hue 0-70), bright, and saturated
# -- i.e. the mane's glow, not the eyes or background.
HUE_MIN, HUE_MAX = 0, 70
SAT_MIN, VAL_MIN = 0.35, 0.30

# Target: shift the peak from ~30-35 down to ~18-20, matching Aries/Virgo/etc.
HUE_SHIFT_DEG = -12


def fix(path_in, path_out, shift_deg=HUE_SHIFT_DEG):
    im = Image.open(path_in).convert("RGB")
    px = im.load()
    w, h = im.size
    shift = shift_deg / 360.0
    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            hh, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            deg = hh * 360
            if HUE_MIN <= deg <= HUE_MAX and s >= SAT_MIN and v >= VAL_MIN:
                new_h = (hh + shift) % 1.0
                nr, ng, nb = colorsys.hsv_to_rgb(new_h, s, v)
                px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255))
                changed += 1
    print(f"pixels shifted: {changed} / {w*h} ({changed/(w*h)*100:.1f}%)")
    im.save(path_out)
    return im


if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    # Dry-run always writes to a scratch path outside public/ so the real
    # source is never touched until the preview is confirmed good.
    out = "/workspace/leo_hue_fixed_preview.png" if dry else OUT
    fix(SRC, out)
    print("wrote", out)
