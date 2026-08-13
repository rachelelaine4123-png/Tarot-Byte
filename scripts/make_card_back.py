#!/usr/bin/env python3
"""
make_card_back.py

Turns a raw card-back artwork (e.g. a Midjourney render that ships with its
own baked ornate frame) into a finished card back matching the site's
standard canvas and brass border treatment.

This mirrors the "Option A" playbook already validated on the 22 T2 majors:
crop the artist's baked frame off, then re-apply our own border so every
asset in the deck shares one consistent brass edge.

Unlike the face cards there is NO nameplate -- a card back carries no title.
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from apply_border import process_one

CANVAS = (1024, 1792)
BORDER_COLOR = (0, 0, 0)
BORDER_WIDTH = 40
ACCENT_COLOR = (197, 161, 84)
ACCENT_WIDTH = 4
OUTER_MARGIN = 24

# The Midjourney backs carry a thick ornate frame of their own. Crop it off
# so it doesn't double up against the brass border we apply.
DEFAULT_INSET = 0.075


def build(src, out, inset=DEFAULT_INSET):
    process_one(
        src,
        out,
        CANVAS,
        BORDER_COLOR,
        BORDER_WIDTH,
        ACCENT_COLOR,
        ACCENT_WIDTH,
        OUTER_MARGIN,
        nameplate=None,
        keyword=None,
        crop_top=inset,
        crop_bottom=inset,
        crop_left=inset,
        crop_right=inset,
    )
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--inset", type=float, default=DEFAULT_INSET)
    args = ap.parse_args()
    build(args.src, args.out, args.inset)
    print("wrote", args.out)


if __name__ == "__main__":
    main()
