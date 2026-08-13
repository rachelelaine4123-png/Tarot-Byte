#!/usr/bin/env python3
"""
apply_frame.py
Composites a transparent-center frame/border PNG on top of raw card art,
then resizes the result to match the site's existing card standard
(1024x1792, matching /public/oracle, /public/tarot-cards, /public/decan-cards).

This runs OUTSIDE Canva/digiKam/Adobe — it's a standalone batch script you
(or the agent) run on a folder of raw art + one frame file. It does NOT
require any manual layer work per card; the same frame is stamped onto
every image in the input folder automatically.

USAGE
-----
python3 scripts/apply_frame.py \
    --frame path/to/frame.png \
    --input path/to/raw_art_folder \
    --output path/to/output_folder \
    [--art-size 1024x1536] [--canvas-size 1024x1792]

WHAT IT DOES
------------
1. Loads the frame PNG (must have a transparent/alpha-cut center — the
   "hole" where the art shows through).
2. Loads each raw art image, center-crops/resizes it to fill the frame's
   inner opening (so art fills edge-to-edge behind the border, no gaps).
3. Alpha-composites: art on the bottom layer, frame border on top.
4. Pads the result onto the standard 1024x1792 canvas (same as every
   other card set in the app) so it drops in without any CSS changes.
5. Saves as PNG, named to match the input filename (or a provided map).

NOTES
-----
- If your frame PNG's opening isn't a perfect rectangle (e.g. ornate
  arches), this script still works — it fills a rectangular bounding
  box behind the frame, and the frame's own opaque border simply masks
  whatever art peeks out past the ornate edge.
- Run a single test image first with --input pointed at a folder that
  contains just one file, inspect the output, then batch the rest.
"""

import argparse
import os
import sys
from PIL import Image

DEFAULT_CANVAS = (1024, 1792)


def parse_size(s):
    w, h = s.lower().split("x")
    return (int(w), int(h))


def fit_cover(img, target_w, target_h):
    """Resize + center-crop img to exactly fill (target_w, target_h),
    like CSS object-fit: cover."""
    src_w, src_h = img.size
    src_ratio = src_w / src_h
    target_ratio = target_w / target_h

    if src_ratio > target_ratio:
        # source is wider than target -> match height, crop width
        new_h = target_h
        new_w = int(new_h * src_ratio)
    else:
        # source is taller than target -> match width, crop height
        new_w = target_w
        new_h = int(new_w / src_ratio)

    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))


def composite_one(art_path, frame_img, art_size, canvas_size, out_path):
    art = Image.open(art_path).convert("RGBA")
    art_w, art_h = art_size

    # 1. Make the art exactly fill the frame's opening size
    art_fitted = fit_cover(art, art_w, art_h)

    # 2. Build a canvas the size of the frame, paste art behind it,
    #    centered (assumes frame's transparent hole is centered — true
    #    for the TarotByte border assets).
    frame_w, frame_h = frame_img.size
    layer = Image.new("RGBA", (frame_w, frame_h), (0, 0, 0, 0))
    paste_x = (frame_w - art_w) // 2
    paste_y = (frame_h - art_h) // 2
    layer.paste(art_fitted, (paste_x, paste_y))

    # 3. Composite frame (with its transparent center) on top
    composited = Image.alpha_composite(layer, frame_img)

    # 4. Pad/center onto the standard site canvas size
    canvas_w, canvas_h = canvas_size
    if (frame_w, frame_h) != (canvas_w, canvas_h):
        # scale composited image to fit within canvas, preserving ratio
        scale = min(canvas_w / frame_w, canvas_h / frame_h)
        new_w, new_h = int(frame_w * scale), int(frame_h * scale)
        composited = composited.resize((new_w, new_h), Image.LANCZOS)
        final = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 255))
        ox = (canvas_w - new_w) // 2
        oy = (canvas_h - new_h) // 2
        final.paste(composited, (ox, oy), composited)
    else:
        final = composited

    final.convert("RGB").save(out_path, "PNG", optimize=True)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--frame", required=True, help="Path to transparent-center frame PNG")
    p.add_argument("--input", required=True, help="Folder of raw card art (jpg/png)")
    p.add_argument("--output", required=True, help="Folder to write composited cards")
    p.add_argument("--art-size", default=None,
                    help="WxH of the frame's inner opening in px, e.g. 820x1500. "
                         "If omitted, uses 80%% of the frame's own dimensions.")
    p.add_argument("--canvas-size", default="1024x1792",
                    help="Final output canvas size (default matches existing card sets)")
    args = p.parse_args()

    frame_img = Image.open(args.frame).convert("RGBA")
    fw, fh = frame_img.size

    if args.art_size:
        art_size = parse_size(args.art_size)
    else:
        art_size = (int(fw * 0.8), int(fh * 0.8))

    canvas_size = parse_size(args.canvas_size)

    os.makedirs(args.output, exist_ok=True)

    files = sorted(
        f for f in os.listdir(args.input)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    )
    if not files:
        print(f"No image files found in {args.input}")
        sys.exit(1)

    print(f"Frame: {args.frame} ({fw}x{fh})")
    print(f"Art opening target: {art_size[0]}x{art_size[1]}")
    print(f"Final canvas: {canvas_size[0]}x{canvas_size[1]}")
    print(f"Processing {len(files)} file(s)...\n")

    for fname in files:
        in_path = os.path.join(args.input, fname)
        base, _ = os.path.splitext(fname)
        out_path = os.path.join(args.output, base + ".png")
        composite_one(in_path, frame_img, art_size, canvas_size, out_path)
        print(f"  ✓ {fname} → {os.path.basename(out_path)}")

    print(f"\nDone. Output in {args.output}")


if __name__ == "__main__":
    main()
