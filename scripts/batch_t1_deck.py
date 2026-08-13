"""
Batch processor for the T1 Traditional Deck (crop + reframe treatment).

Applies a single, uniform border + nameplate design across the entire T1
deck, mirroring the T2 (Astral Threads) workflow. Source art is inconsistent
in framing/resolution; this script crops each card's baked-in bottom plaque
band (where present) and recomposites onto a consistent canvas via
apply_border.process_one().

Usage:
    python3 batch_t1_deck.py            # process all currently-available cards
    python3 batch_t1_deck.py --major     # only Major Arcana
    python3 batch_t1_deck.py --wands     # only Wands suit
    python3 batch_t1_deck.py --swords    # only Swords suit

Output: TarotByte/incoming/t1_deck/final/<slug>.png
(slug matches lib/tarotDeck.js ids, e.g. "the-fool", "ace-of-wands")
"""

import os
import sys
import argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from apply_border import process_one

RAW_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "incoming", "t1_deck", "raw")
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "incoming", "t1_deck", "final")

CANVAS = (1024, 1792)
BORDER_COLOR = (0, 0, 0)
BORDER_WIDTH = 40
ACCENT_COLOR = (197, 161, 84)  # brass/gold
ACCENT_WIDTH = 4
OUTER_MARGIN = 24

# slug -> (source filename, nameplate text, crop_top, crop_bottom, crop_left, crop_right)
MAJOR_ARCANA = {
    "the-fool": ("00.png", "The Fool", 0.0, 0.0187, 0.0, 0.0),
    "the-magician": ("01.png", "The Magician", 0.0, 0.0256, 0.0, 0.0),
    "the-high-priestess": ("02.png", "The High Priestess", 0.0, 0.0222, 0.0, 0.0),
    "the-empress": ("03.png", "The Empress", 0.0, 0.0204, 0.0, 0.0),
    "the-emperor": ("04.png", "The Emperor", 0.0, 0.0239, 0.0, 0.0),
    "the-hierophant": ("05.png", "The Hierophant", 0.0, 0.0117, 0.0, 0.0),
    "the-lovers": ("06.png", "The Lovers", 0.0, 0.0169, 0.0, 0.0),
    "the-chariot": ("07.png", "The Chariot", 0.0, 0.0152, 0.0, 0.0),
    "strength": ("08.png", "Strength", 0.0, 0.0222, 0.0, 0.0),
    "the-hermit": ("09.png", "The Hermit", 0.0, 0.0169, 0.0, 0.0),
    "wheel-of-fortune": ("10.png", "Wheel of Fortune", 0.0, 0.0274, 0.0, 0.0),
    "justice": ("11.png", "Justice", 0.0, 0.0152, 0.0, 0.0),
    "the-hanged-man": ("12.png", "The Hanged Man", 0.0, 0.0274, 0.0, 0.0),
    "death": ("13.png", "Death", 0.0, 0.0204, 0.0, 0.0),
    "temperance": ("14.png", "Temperance", 0.0, 0.0308, 0.0, 0.0),
    "the-devil": ("15.png", "The Devil", 0.0, 0.0169, 0.0, 0.0),
    "the-tower": ("t1_the_tower_16.png", "The Tower", 0.0, 0.0152, 0.0, 0.0),
    "the-star": ("17.png", "The Star", 0.0, 0.0204, 0.0, 0.0),
    "the-moon": ("18.png", "The Moon", 0.0, 0.0308, 0.0, 0.0),
    "the-sun": ("19.png", "The Sun", 0.0, 0.0152, 0.0, 0.0),
    "judgement": ("20.png", "Judgement", 0.0, 0.036, 0.0, 0.0),
    "the-world": ("21.png", "The World", 0.0, 0.0222, 0.0, 0.0),
}

WANDS = {
    "ace-of-wands": ("T1_-Ace_of_wands_tarot.png", "Ace of Wands", 0.0, 0.0204, 0.0, 0.0),
    "two-of-wands": ("T1_-_two_of_wands_tarot.png", "Two of Wands", 0.0, 0.0239, 0.0, 0.0),
    "three-of-wands": ("T1_The_Three_of_Wands.png", "Three of Wands", 0.0, 0.0204, 0.0, 0.0),
    "four-of-wands": ("T1_The_Four_of_Wands.png", "Four of Wands", 0.0, 0.0187, 0.0, 0.0),
    "five-of-wands": ("t1_five_of_wands.png", "Five of Wands", 0.0, 0.0413, 0.0, 0.0),
    "six-of-wands": ("T1_SIX_OF_WANDS.png", "Six of Wands", 0.0, 0.0274, 0.0, 0.0),
    "seven-of-wands": ("T1_SEVEN_WANDS.png", "Seven of Wands", 0.0, 0.0152, 0.0, 0.0),
    "eight-of-wands": ("T1_EIGHT_WANDS.png", "Eight of Wands", 0.0, 0.0326, 0.0, 0.0),
    "nine-of-wands": ("T1_NINE_WANDS.png", "Nine of Wands", 0.0, 0.0291, 0.0, 0.0),
    "ten-of-wands": ("T1_TEN_WANDS.png", "Ten of Wands", 0.0, 0.0413, 0.0, 0.0),
    "page-of-wands": ("T1_Page_wands.png", "Page of Wands", 0.0, 0.0222, 0.0, 0.0),
    "knight-of-wands": ("t1_knight_wands.png", "Knight of Wands", 0.0, 0.0117, 0.0, 0.0),
    "queen-of-wands": ("T1_QUEEN_WANDS.png", "Queen of Wands", 0.0, 0.0117, 0.0, 0.0),
    "king-of-wands": ("T1_KING_WANDS.png", "King of Wands", 0.0, 0.0135, 0.0, 0.0),
}

SWORDS = {
    "ace-of-swords": ("T1_ACE_SWORDS.png", "Ace of Swords", 0.0, 0.0256, 0.0, 0.0),
    "two-of-swords": ("T1_TWO_SWORDS.png", "Two of Swords", 0.0, 0.013, 0.0, 0.0),
    "three-of-swords": ("T1_THREE_SWORDS.png", "Three of Swords", 0.0, 0.0256, 0.0, 0.0),
    "four-of-swords": ("T1_FOUR_SWORDS.png", "Four of Swords", 0.0, 0.0152, 0.0, 0.0),
    "five-of-swords": ("T1_FIVE_SWORDS.png", "Five of Swords", 0.0, 0.0187, 0.0, 0.0),
    "six-of-swords": ("T1_SIX_SWORDS.png", "Six of Swords", 0.0, 0.0308, 0.0, 0.0),
    "seven-of-swords": ("T1_SEVEN_SWORDS.png", "Seven of Swords", 0.0, 0.0145, 0.0, 0.0),
    "eight-of-swords": ("T1_EIGHT_SWORDS.png", "Eight of Swords", 0.0, 0.01, 0.0, 0.0),
    "nine-of-swords": ("T1_NINE_SWORDS.png", "Nine of Swords", 0.0, 0.0204, 0.0, 0.0),
    "ten-of-swords": ("T1_TEN_SWORDS.png", "Ten of Swords", 0.0, 0.0169, 0.0, 0.0),
    "page-of-swords": ("T1_PAGE_SWORDS.png", "Page of Swords", 0.0, 0.0234, 0.0, 0.0),
    "knight-of-swords": ("T1_KNIGHT_SWORDS.png", "Knight of Swords", 0.0, 0.0274, 0.0, 0.0),
    "queen-of-swords": ("T1_QUEEN_SWORDS.png", "Queen of Swords", 0.0, 0.01, 0.0, 0.0),
    "king-of-swords": ("T1_KING_SWORDS.png", "King of Swords", 0.0, 0.0107, 0.0, 0.0),
}

CUPS = {
    "ace-of-cups": ("T1_ACE_CUPS.png", "Ace of Cups", 0.0, 0.0169, 0.0, 0.0),
    "two-of-cups": ("T1_2_CUPS.png", "Two of Cups", 0.0, 0.0117, 0.0, 0.0),
    "three-of-cups": ("T1_3_CUPS.png", "Three of Cups", 0.0, 0.0343, 0.0, 0.0),
    "four-of-cups": ("T1_4_CUPS.png", "Four of Cups", 0.0, 0.0482, 0.0, 0.0),
    "five-of-cups": ("T1_5_CUPS.png", "Five of Cups", 0.0, 0.0135, 0.0, 0.0),
    "six-of-cups": ("T1_6_CUPS.png", "Six of Cups", 0.0, 0.0169, 0.0, 0.0),
    # crop_top 0.020 removes a leftover cream plaque band + stray glyphs baked
    # into the top of the source art (rows 0-10 of 576).
    "seven-of-cups": ("T1_7_CUPS.png", "Seven of Cups", 0.020, 0.0256, 0.0, 0.0),
    "eight-of-cups": ("T1_8_CUPS.png", "Eight of Cups", 0.0, 0.0413, 0.0, 0.0),
    "nine-of-cups": ("T1_9_CUPS.png", "Nine of Cups", 0.0, 0.0308, 0.0, 0.0),
    "ten-of-cups": ("T1_10_CUPS.png", "Ten of Cups", 0.0, 0.0222, 0.0, 0.0),
    "page-of-cups": ("T1_PAGE_CUPS.png", "Page of Cups", 0.0, 0.0204, 0.0, 0.0),
    "knight-of-cups": ("T1_KNIGHT_CUPS.png", "Knight of Cups", 0.0, 0.0482, 0.0, 0.0),
    "queen-of-cups": ("T1_QUEEN_CUPS.png", "Queen of Cups", 0.0, 0.0239, 0.0, 0.0),
    "king-of-cups": ("T1_KING_CUPS.png", "King of Cups", 0.0, 0.0308, 0.0, 0.0),
}

PENTACLES = {
    "ace-of-pentacles": ("T1_ACE_PENT.png", "Ace of Pentacles", 0.0, 0.0256, 0.0, 0.0),
    "two-of-pentacles": ("T1_2_PENT.png", "Two of Pentacles", 0.0, 0.0291, 0.0, 0.0),
    "three-of-pentacles": ("T1_3_PENT.png", "Three of Pentacles", 0.0, 0.0239, 0.0, 0.0),
    "four-of-pentacles": ("T1_4_PENT.png", "Four of Pentacles", 0.0, 0.043, 0.0, 0.0),
    "five-of-pentacles": ("T1_5_PENT.png", "Five of Pentacles", 0.0, 0.0122, 0.0, 0.0),
    "six-of-pentacles": ("T1_6_PENT.png", "Six of Pentacles", 0.0, 0.0169, 0.0, 0.0),
    "seven-of-pentacles": ("T1_7_PENT.png", "Seven of Pentacles", 0.0, 0.0152, 0.0, 0.0),
    "eight-of-pentacles": ("T1_8_PENT.png", "Eight of Pentacles", 0.0, 0.0135, 0.0, 0.0),
    "nine-of-pentacles": ("T1_9_PENT.png", "Nine of Pentacles", 0.0, 0.0152, 0.0, 0.0),
    "ten-of-pentacles": ("T1_10_PENT.png", "Ten of Pentacles", 0.0, 0.0152, 0.0, 0.0),
    "page-of-pentacles": ("T1_PAGE_PENT.png", "Page of Pentacles", 0.0, 0.0135, 0.0, 0.0),
    "knight-of-pentacles": ("T1_KNIGHT_PENT.png", "Knight of Pentacles", 0.0, 0.0274, 0.0, 0.0),
    "queen-of-pentacles": ("T1_QUEEN_PENT.png", "Queen of Pentacles", 0.0, 0.0169, 0.0, 0.0),
    # crop_top 0.048 removes a stray white Roman numeral "XI" baked into the
    # top of the source art (glyph spans rows 5-25 of 576).
    "king-of-pentacles": ("T1_KING_PENT.png", "King of Pentacles", 0.048, 0.0135, 0.0, 0.0),
}


def run(cards_dict):
    os.makedirs(OUT_DIR, exist_ok=True)
    count = 0
    for slug, (fname, nameplate, ct, cb, cl, cr) in cards_dict.items():
        art_path = os.path.join(RAW_DIR, fname)
        if not os.path.exists(art_path):
            print(f"SKIP {slug}: source file not found: {art_path}")
            continue
        out_path = os.path.join(OUT_DIR, f"{slug}.png")
        process_one(
            art_path, out_path, CANVAS, BORDER_COLOR, BORDER_WIDTH,
            ACCENT_COLOR, ACCENT_WIDTH, OUTER_MARGIN,
            nameplate=nameplate, keyword=None,
            crop_top=ct, crop_bottom=cb, crop_left=cl, crop_right=cr,
        )
        print(f"done {slug}")
        count += 1
    return count


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--major", action="store_true")
    parser.add_argument("--wands", action="store_true")
    parser.add_argument("--swords", action="store_true")
    parser.add_argument("--cups", action="store_true")
    parser.add_argument("--pentacles", action="store_true")
    args = parser.parse_args()

    any_flag = args.major or args.wands or args.swords or args.cups or args.pentacles

    total = 0
    if not any_flag or args.major:
        total += run(MAJOR_ARCANA)
    if not any_flag or args.wands:
        total += run(WANDS)
    if not any_flag or args.swords:
        total += run(SWORDS)
    if not any_flag or args.cups:
        total += run(CUPS)
    if not any_flag or args.pentacles:
        total += run(PENTACLES)

    print(f"\nTotal cards processed: {total}")
    print(f"Output dir: {OUT_DIR}")
