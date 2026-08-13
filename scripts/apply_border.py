#!/usr/bin/env python3
"""
apply_border.py
Simpler alternative to apply_frame.py: instead of compositing an ornate
frame PNG, this draws a clean solid-color border (optionally with a thin
inner accent hairline) directly around the card art, then pads to the
site's standard canvas (1024x1792).

Optionally also draws a "nameplate" text block (sign name + keyword) inside
the bottom border band, matching the existing T1 card style (e.g. "ARIES" /
"IGNITION").
"""
import argparse
import os
from PIL import Image, ImageDraw, ImageFont

DEFAULT_CANVAS = (1024, 1792)
FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
FONT_PATH = os.path.join(FONT_DIR, "Cinzel.ttf")


def parse_size(s):
    w, h = s.lower().split("x")
    return (int(w), int(h))


def parse_color(s):
    parts = [int(p) for p in s.split(",")]
    if len(parts) == 3:
        parts.append(255)
    return tuple(parts)


def fit_cover(img, target_w, target_h):
    """Resize + center-crop img to exactly fill (target_w, target_h)."""
    src_w, src_h = img.size
    src_ratio = src_w / src_h
    target_ratio = target_w / target_h
    if src_ratio > target_ratio:
        new_h = target_h
        new_w = int(new_h * src_ratio)
    else:
        new_w = target_w
        new_h = int(new_w / src_ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))


def load_font(size):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except Exception:
        return ImageFont.load_default()


def draw_centered_text(draw, text, cx, cy, font, fill, letter_spacing=0):
    if letter_spacing <= 0:
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        x = cx - w / 2 - bbox[0]
        y = cy - h / 2 - bbox[1]
        draw.text((x, y), text, font=font, fill=fill)
        return w
    # manual letter-spacing
    widths = []
    total = 0
    for ch in text:
        bbox = draw.textbbox((0, 0), ch, font=font)
        w = bbox[2] - bbox[0]
        widths.append(w)
        total += w + letter_spacing
    total -= letter_spacing
    x = cx - total / 2
    bbox_h = draw.textbbox((0, 0), text, font=font)
    h = bbox_h[3] - bbox_h[1]
    y = cy - h / 2 - bbox_h[1]
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + letter_spacing
    return total


def crop_in(img, top_pct=0.0, bottom_pct=0.0, left_pct=0.0, right_pct=0.0):
    """Crop a fractional percentage off each edge to strip baked-in raw-art
    frames/plaques before the new border is applied."""
    w, h = img.size
    left = int(w * left_pct)
    right = w - int(w * right_pct)
    top = int(h * top_pct)
    bottom = h - int(h * bottom_pct)
    return img.crop((left, top, right, bottom))


def process_one(art_path, out_path, canvas_size, border_color, border_width,
                 accent_color, accent_width, outer_margin,
                 nameplate=None, keyword=None, nameplate_color=(240, 198, 116),
                 keyword_color=(197, 161, 84),
                 crop_top=0.0, crop_bottom=0.0, crop_left=0.0, crop_right=0.0):
    canvas_w, canvas_h = canvas_size
    art = Image.open(art_path).convert("RGB")
    if crop_top or crop_bottom or crop_left or crop_right:
        art = crop_in(art, crop_top, crop_bottom, crop_left, crop_right)

    # Reserve extra space at the bottom for the nameplate text, inside the
    # existing bottom border band (so art area shrinks slightly to make room).
    nameplate_h = 130 if nameplate else 0

    inner_w = canvas_w - 2 * outer_margin - 2 * border_width - 2 * accent_width
    inner_h = (canvas_h - 2 * outer_margin - 2 * border_width - 2 * accent_width
               - nameplate_h)
    art_fitted = fit_cover(art, inner_w, inner_h)
    final = Image.new("RGB", (canvas_w, canvas_h), (0, 0, 0))
    draw = ImageDraw.Draw(final)
    border_box = [outer_margin, outer_margin, canvas_w - outer_margin, canvas_h - outer_margin]
    draw.rectangle(border_box, fill=border_color)
    if accent_width > 0:
        accent_box = [
            outer_margin + border_width, outer_margin + border_width,
            canvas_w - outer_margin - border_width, canvas_h - outer_margin - border_width,
        ]
        draw.rectangle(accent_box, fill=accent_color)
    art_x = outer_margin + border_width + accent_width
    art_y = outer_margin + border_width + accent_width
    final.paste(art_fitted, (art_x, art_y))

    if nameplate:
        plate_top = art_y + inner_h
        # The accent rectangle currently covers this zone with gold; repaint
        # it to the border (black) color so gold text is legible on black,
        # matching the existing T1 card nameplate style.
        plate_box = [
            outer_margin + border_width, plate_top,
            canvas_w - outer_margin - border_width,
            canvas_h - outer_margin - border_width,
        ]
        draw.rectangle(plate_box, fill=border_color)

        plate_cx = canvas_w / 2
        # thin gold hairline separating art from nameplate
        sep_y = plate_top + 14
        line_color = accent_color if accent_width > 0 else keyword_color
        draw.line([(art_x + 20, sep_y), (art_x + inner_w - 20, sep_y)],
                  fill=line_color, width=2)
        name_font = load_font(46)
        key_font = load_font(28)
        name_cy = sep_y + 42
        key_cy = sep_y + 88
        draw_centered_text(draw, nameplate.upper(), plate_cx, name_cy, name_font,
                            nameplate_color, letter_spacing=6)
        if keyword:
            draw_centered_text(draw, keyword.upper(), plate_cx, key_cy, key_font,
                                keyword_color, letter_spacing=8)

    final.save(out_path, "PNG", optimize=True)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--canvas-size", default="1024x1792")
    p.add_argument("--border-color", default="0,0,0")
    p.add_argument("--border-width", type=int, default=40)
    p.add_argument("--accent-color", default="197,161,84")  # brass/gold
    p.add_argument("--accent-width", type=int, default=4)
    p.add_argument("--outer-margin", type=int, default=24)
    p.add_argument("--nameplate", default=None, help="Sign name to render, e.g. Aries")
    p.add_argument("--keyword", default=None, help="Keyword to render, e.g. Ignition")
    p.add_argument("--crop-top", type=float, default=0.0, help="Fraction to crop off top, e.g. 0.02")
    p.add_argument("--crop-bottom", type=float, default=0.0, help="Fraction to crop off bottom, e.g. 0.2")
    p.add_argument("--crop-left", type=float, default=0.0, help="Fraction to crop off left, e.g. 0.13")
    p.add_argument("--crop-right", type=float, default=0.0, help="Fraction to crop off right, e.g. 0.13")
    args = p.parse_args()
    canvas_size = parse_size(args.canvas_size)
    border_color = parse_color(args.border_color)
    accent_color = parse_color(args.accent_color)
    os.makedirs(args.output, exist_ok=True)
    files = sorted(f for f in os.listdir(args.input) if f.lower().endswith((".jpg", ".jpeg", ".png")))
    for fname in files:
        in_path = os.path.join(args.input, fname)
        base = os.path.splitext(fname)[0]
        out_path = os.path.join(args.output, base + ".png")
        process_one(in_path, out_path, canvas_size, border_color, args.border_width,
                    accent_color, args.accent_width, args.outer_margin,
                    nameplate=args.nameplate, keyword=args.keyword,
                    crop_top=args.crop_top, crop_bottom=args.crop_bottom,
                    crop_left=args.crop_left, crop_right=args.crop_right)
        print(f"[ok] {fname} -> {out_path}")


if __name__ == "__main__":
    main()
