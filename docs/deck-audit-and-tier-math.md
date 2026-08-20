# TarotByte — Deck Audit + Tier Math

## Part 1 — Card count math for the new ladder

Rule: Astral Threads adds **one** oracle card to the whole reading (grounds + surrounds,
single combo move). The Decan Engine adds **one decan card per tarot card** (1:1).

| Tarot draw | Classic (T) | Astral Threads (Z) | Decan Engine (D) |
|---|---|---|---|
| 3-card | 3 | 3 + 1 = **4** | 3 + 1 + 3 = **7** |
| 5-card | 5 | 5 + 1 = **6** | 5 + 1 + 5 = **11** |

The 3-card line matches exactly what you said (4 and 7).
The 5-card line gives **11, not 13**. 13 only happens if the astral layer also
goes 1:1 (5 tarot + 5 astral + ... ) or if decans double up. Worth deciding
explicitly rather than letting it fall out of the code.

Recommendation: **cap the flagship at 7.** Three tarot + one astral + three decans is
already the densest reading on the market and it stays narratively legible — the
astral is the single "curveball" voice, and each tarot card gets exactly one decan
gloss. Eleven cards turns the Decan Engine into a wall again, which is the exact
problem the restructure is meant to kill. Keep the 5-card as a Classic/Astral option
(5 and 6) and don't offer decans on it, or offer decans on only the 3 "spine"
positions of the 5-card.

## Part 2 — Scope of the style critique

My concern was **T1 vs T2** — a mismatch between the existing 36-card decan deck and
the new 42. Not a mismatch inside T2.

- T1 (existing 36): ornate gold filigree border, cosmic navy + antique gold, painterly, 4:7 ratio, 1024x1792.
- T2 (new 42): no gold border, high-saturation orange/red on blue, hard neon linework, 2:3 ratio.

Shuffled into one deck they read as two different products.

There *are* two smaller problems inside T2, but they're mechanical, not stylistic:
1. **Baked-in text** — `justice.png` has "LIBRA" rendered into the art; `queen-of-swords.png` has a garbled text strip.
2. **Resolution inconsistency** — 2 cards at 512x512, 24 at 384x576, 16 at 896x1344. None match the 1024x1792 of T1.

## Part 3 — Pip audit of the existing 36 (triggered by the 8 of Cups catch)

You were right, and it isn't isolated.

### Confirmed wrong
| Card | Should be | Actually shows |
|---|---|---|
| eight-of-cups | 8 | **10** (1+2+3+4 pyramid) |
| eight-of-wands | 8 | **10** arrows |
| six-of-pentacles | 6 | **7** (5 in field + 2 passed hand-to-hand) |
| nine-of-pentacles | 9 | **8** coins |

### Confirmed correct
two/three/four/five/seven/eight/**ten**-of-pentacles all check out. Ten-of-pentacles
is a clean 10 in the arch — an earlier count of 8 was my crop artifact, not a defect.
Cups two/three/four/five/seven/nine/ten check out. Swords two/three/nine/ten check out.

### Still suspect, not yet confirmed
six-of-cups, four-of-swords, eight-of-swords, nine-of-wands, and the unverified
wands/swords mid-numbers.

### Pattern
Errors cluster at the high end (8, 9, 10). The generation pass did not reliably honor
counts above about seven. Any regeneration needs explicit per-card count verification,
not a trust-the-prompt approach.

## Part 4 — Separate production finding: every card is black-padded

All 36 PNGs in `public/decan-cards/` are 1024x1792, but the actual artwork occupies
only **31%-57%** of that canvas. The rest is black padding.

Examples: four-of-swords art is 570x1010 (31% of canvas), eight-of-cups 696x1017
(39%), ten-of-pentacles 705x1023 (39%). The best cards top out around 1023x1023 (57%).

Two consequences:
1. Effective art resolution is roughly 700x1020, not 1024x1792 — cards are softer than the file dimensions suggest.
2. You are shipping and paying CDN bandwidth for a large amount of pure black.

Fix is cheap: batch-crop to content bounds and re-upscale. This also means any prior
visual QA done with percentage-based crops was aiming at the wrong region.

## Method note

Reliable counting required cropping to true content bounds first
(threshold `sum(RGB) > 40` per row/column), then non-overlapping sub-crops at high
resolution. Automated blob detection was unreliable — it false-positived on skin and
gold fabric — and single-pass visual counts drifted. Both were discarded.
