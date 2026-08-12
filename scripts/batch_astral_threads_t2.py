#!/usr/bin/env python3
"""
batch_astral_threads_t2.py
One-command batch runner for the full 12-card Astral Threads T2 deck.
Maps each raw source file to its correct zodiac sign, applies the
appropriate crop-fix (to strip baked-in mismatched plaques/frames) and
draws the standard border + nameplate via apply_border.process_one().
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from apply_border import process_one, parse_color, parse_size  # noqa: E402

RAW_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "incoming", "astral-threads-t2"
)
OUT_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "incoming", "astral_threads_t2_final"
)

# sign: (source filename, keyword, crop_top, crop_bottom, crop_left, crop_right)
CARDS = {
    "Aries":       ("Firefly_(3).jpg", "Ignition",   0.0,  0.20, 0.0,  0.0),
    "Taurus":      ("Firefly_(12).jpg", "Rooting",   0.0,  0.0,  0.0,  0.0),
    "Gemini":      ("Firefly_(6).jpg", "Exchange",   0.0,  0.13, 0.0,  0.0),
    "Cancer":      ("Firefly_(4).jpg", "Tending",    0.0,  0.0,  0.0,  0.0),
    "Leo":         ("Firefly_(7).jpg", "Radiance",   0.0,  0.08, 0.0,  0.0),
    "Virgo":       ("Firefly_(11).jpg", "Refining",  0.0,  0.10, 0.0,  0.0),
    "Libra":       ("Firefly_(8).jpg", "Balancing",  0.0,  0.0,  0.0,  0.0),
    "Scorpio":     ("Firefly_(10).jpg", "Alchemy",   0.0,  0.03, 0.0,  0.0),
    "Sagittarius": ("u8996681298_httpss.mj.runqB0vDPXEz5k_httpss.mj.runNmVjtw0qCQY_d3ecd03e-e457-4e96-88e5-e6e640a2152c_3.png", "Seeking", 0.0, 0.0, 0.0, 0.0),
    "Capricorn":   ("Firefly_(5).jpg", "Ascending",  0.0,  0.0,  0.0,  0.0),
    "Aquarius":    ("Firefly_(2).jpg", "Awakening",  0.02, 0.0,  0.13, 0.13),
    "Pisces":      ("Firefly_(9).jpg", "Dreaming",   0.0,  0.0,  0.0,  0.0),
}

CANVAS_SIZE = parse_size("1024x1792")
BORDER_COLOR = parse_color("0,0,0")
ACCENT_COLOR = parse_color("197,161,84")
BORDER_WIDTH = 40
ACCENT_WIDTH = 4
OUTER_MARGIN = 24


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for sign, (fname, keyword, ct, cb, cl, cr) in CARDS.items():
        in_path = os.path.join(RAW_DIR, fname)
        if not os.path.exists(in_path):
            print(f"[MISSING] {sign}: {in_path}")
            continue
        out_path = os.path.join(OUT_DIR, f"{sign.lower()}.png")
        process_one(
            in_path, out_path, CANVAS_SIZE, BORDER_COLOR, BORDER_WIDTH,
            ACCENT_COLOR, ACCENT_WIDTH, OUTER_MARGIN,
            nameplate=sign, keyword=keyword,
            crop_top=ct, crop_bottom=cb, crop_left=cl, crop_right=cr,
        )
        print(f"[ok] {sign} <- {fname} -> {out_path}")


if __name__ == "__main__":
    main()
