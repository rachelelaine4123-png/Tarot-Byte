#!/usr/bin/env python3
"""
batch_t2_majors.py

Batch-processes the 22 T2 Major Arcana raw renders into finished cards that
match the shipped T1 deck exactly: 1024x1792 canvas, black border, brass
accent hairline, and a gold Cinzel nameplate band at the bottom.

TREATMENT ("Option A" — crop and reframe)
-----------------------------------------
The T2 raw art ships with a baked-in ornate frame and, on many cards, a
garbled AI-generated pseudo-text plaque along the bottom edge. Rather than
keep that native frame (which letterboxes badly inside our 2:3 canvas and
clashes with T1), we crop the baked frame off all four edges and then apply
the standard T1 border treatment on top. This honors the project directive
to keep both decks visually consistent.

  FRAME_INSET  0.055  removed from top / left / right on every card
  crop_bottom  per-card, see T2_MAJORS below

WHY crop_bottom IS PER-CARD
---------------------------
The bottom edge is the only one that varies, because it carries both the
frame rule AND the garbled plaque text. Automated detection was tried twice
and abandoned:

  * scan_t2_plaques.py  assumed bright/cream plaques (as in T1) and flagged
    0 of 22 — T2's baked text is dark red on dark art.
  * measure_t2_bands.py reported seven cards at 0.14-0.23; every one of
    those was visually disproven as a false hit on interior artwork.

The values below were therefore locked by direct visual inspection of every
card using a magnified bottom-region zoom with a ruler line drawn every 0.01
of card height. 0.075 clears the frame rule and plaque on 20 of 22 cards.
Two genuine exceptions were found:

  the-magician  0.105  a decorative band of glowing circular emblems runs to
                       ~0.10; a 0.075 crop slices it mid-emblem.
  the-tower     0.095  the gold frame sweep is not flat — it curves upward at
                       the left and right edges, peaking near 0.09.

Note the source filename misspelling: "CHARRIOTT" -> slug "the-chariot".

Usage:
    python3 scripts/batch_t2_majors.py
    python3 scripts/batch_t2_majors.py --only the-magician the-tower
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from apply_border import process_one  # noqa: E402

RAW_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..",
                       "incoming", "t2_majors", "raw")
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..",
                       "incoming", "t2_majors", "final")

CANVAS = (1024, 1792)
BORDER_COLOR = (0, 0, 0)
BORDER_WIDTH = 40
ACCENT_COLOR = (197, 161, 84)  # brass/gold
ACCENT_WIDTH = 4
OUTER_MARGIN = 24

# Baked ornate frame thickness on top/left/right, as a fraction of each edge.
FRAME_INSET = 0.055

# Default bottom crop: clears the frame rule plus the garbled plaque text.
DEFAULT_BOTTOM = 0.075

# slug -> (source filename, nameplate text, crop_bottom)
T2_MAJORS = {
    "the-fool": ("T2_-_0_-_FOOL.png", "The Fool", DEFAULT_BOTTOM),
    "the-magician": ("T2_-_I_-_MAGICIAN.png", "The Magician", 0.105),
    "the-high-priestess": ("T2_-_II_-_HIGH_PRIESTESS.png", "The High Priestess", DEFAULT_BOTTOM),
    "the-empress": ("T2_-_III_-_EMPRESS.png", "The Empress", DEFAULT_BOTTOM),
    "the-emperor": ("T2_-_IV_-_EMPEROR.png", "The Emperor", DEFAULT_BOTTOM),
    "the-hierophant": ("T2_-_V_-_HIEROPHANT.png", "The Hierophant", DEFAULT_BOTTOM),
    "the-lovers": ("T2_-_VI_-_LOVERS.png", "The Lovers", DEFAULT_BOTTOM),
    # source filename is misspelled "CHARRIOTT"
    "the-chariot": ("T2_-_VII_-_CHARRIOTT.png", "The Chariot", DEFAULT_BOTTOM),
    "strength": ("T2_-_VIII_-_STRENGTH.png", "Strength", DEFAULT_BOTTOM),
    "the-hermit": ("T2_-_IX_-_HERMIT.png", "The Hermit", DEFAULT_BOTTOM),
    "wheel-of-fortune": ("T2_-_X_-_WHEEL.png", "Wheel of Fortune", DEFAULT_BOTTOM),
    "justice": ("T2_-_XI_-_JUSTICE.png", "Justice", DEFAULT_BOTTOM),
    "the-hanged-man": ("T2_-_XII_-_HANGED_MAN.png", "The Hanged Man", DEFAULT_BOTTOM),
    "death": ("T2_-_XIII_-_DEATH.png", "Death", DEFAULT_BOTTOM),
    "temperance": ("T2_-_XIV_-_TEMPERANCE.png", "Temperance", DEFAULT_BOTTOM),
    "the-devil": ("T2_-_XV_-_DEVIL.png", "The Devil", DEFAULT_BOTTOM),
    "the-tower": ("T2_-_XVI_-_TOWER.png", "The Tower", 0.095),
    "the-star": ("T2_-_XVII_-_STAR.png", "The Star", DEFAULT_BOTTOM),
    "the-moon": ("T2_-_XVIII_-_MOON.png", "The Moon", DEFAULT_BOTTOM),
    "the-sun": ("T2_-_XIX_-_SUN.png", "The Sun", DEFAULT_BOTTOM),
    "judgement": ("T2_-_XX_-_JUDGEMENT.png", "Judgement", DEFAULT_BOTTOM),
    "the-world": ("T2_-_XXI_-_THE_WORLD.png", "The World", DEFAULT_BOTTOM),
}


def run(cards, only=None):
    os.makedirs(OUT_DIR, exist_ok=True)
    count = 0
    missing = []
    for slug, (fname, nameplate, crop_bottom) in cards.items():
        if only and slug not in only:
            continue
        art_path = os.path.join(RAW_DIR, fname)
        if not os.path.exists(art_path):
            print(f"SKIP {slug}: source not found: {fname}")
            missing.append(slug)
            continue
        out_path = os.path.join(OUT_DIR, f"{slug}.png")
        process_one(
            art_path, out_path, CANVAS, BORDER_COLOR, BORDER_WIDTH,
            ACCENT_COLOR, ACCENT_WIDTH, OUTER_MARGIN,
            nameplate=nameplate, keyword=None,
            crop_top=FRAME_INSET, crop_bottom=crop_bottom,
            crop_left=FRAME_INSET, crop_right=FRAME_INSET,
        )
        print(f"done {slug:<20} bottom={crop_bottom}")
        count += 1
    return count, missing


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", nargs="*", default=None,
                        help="Process only these slugs")
    args = parser.parse_args()

    total, missing = run(T2_MAJORS, only=args.only)
    print(f"\nTotal cards processed: {total}")
    if missing:
        print(f"Missing sources: {', '.join(missing)}")
    print(f"Output dir: {os.path.normpath(OUT_DIR)}")
