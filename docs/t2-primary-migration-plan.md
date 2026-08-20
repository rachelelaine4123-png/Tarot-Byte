# T2 as Primary Deck — Migration Plan

Status: proposal, pending sign-off. Written after the pip audit in
`deck-audit-and-tier-math.md`.

## The decision

T2 (the newer art style, the one that matches Astral Threads) becomes the
canonical look for TarotByte. T1 — the 36 existing files in
`public/decan-cards/` — stops being the deck of record.

This is the right call and the evidence supports it beyond the aesthetic
argument. Three separate findings all point the same direction. T2 fills its
canvas, T2 counts correctly where T1 did not, and T2 is the only style that
covers the full 78-card surface once the 42 new aces, courts and majors land.
T1 was never going to get there without regenerating the entire deck anyway.

## What the verification actually found

Four new T2 files were supplied as replacements for the four cards the audit
flagged as miscounted. Every one of them was counted independently rather than
trusted, because the standing rule from the audit is that the generator does
not reliably honor pip counts above roughly seven and the prompt text cannot be
used as evidence of what the image contains.

The Six of Pentacles is correct at six. The arc reads cleanly as three
foreground discs and three behind, with no ambiguity at the crop boundary.

The Eight of Cups is correct at eight. A strictly non-overlapping left and
right split gives three cups fully left, three fully right, and two straddling
the seam counted once.

The Eight of Wands is correct at eight. A horizontal scanline at the lower
third of the shaft field returned ten dark runs, of which the first and last
are the card's own black border, leaving eight interior shafts. Two independent
visual passes at higher magnification agree.

The Nine of Pentacles arrived as two variants. Variant B is disqualified on
legibility rather than on count. Its pentacles merge into indistinct overlapping
dome forms and the bottom-center element renders as a blue mechanical disc that
does not read as a pentacle at all. No count is worth recording for it.

Variant A is correct at nine. This one took the longest to settle because the
central tree trunk splits the coin field and every automated approach failed in
a different direction. Color-gated blob detection kept only four to six
components on a card with visibly more. Brightness-run scanning returned almost
nothing because the coins are orange and never cross a luma threshold that
would separate them from the surrounding fire. What resolved it was abandoning
detectors entirely and viewing two strictly non-overlapping vertical halves of
the coin field at high resolution. The left half shows four full pentacles. The
right half shows four full pentacles plus the left edge of a ninth at the seam,
which belongs to the left half's bottom-center medallion and is therefore not
double counted. Four plus four plus the shared center medallion gives nine. The
earlier reads that converged on seven were counting a single row band at a time
and losing the discs that sit partially behind the trunk.

So variant A is the one to use.

## Defects that still need fixing before these ship

All four new files carry baked-in text or numerals rendered into the artwork
itself. This is the same class of defect already present in T2's `justice.png`,
which has the word LIBRA burned into the image.

The Eight of Wands has an "8" digit sitting in the upper left of the
composition. The Eight of Cups has a faint strip of illegible text along the
bottom edge. The Nine of Pentacles variant A is the worst of the set — it
carries a title bar reading "THE OF PENTACILES", which drops the numeral
entirely and misspells the suit, and it also has a "9" medallion at top center.

None of these are fatal. The bottom text strips can be cropped, since the art
above them is intact and the cards are already going to be normalized. The
in-composition numerals are harder because they sit inside the artwork rather
than at an edge. The realistic options are to regenerate those specific cards
with an explicit no-text instruction, or to accept the numerals as a stylistic
choice and apply them consistently across the whole deck so they look
deliberate rather than like a generation artifact. The inconsistent case — some
cards with numerals, most without — is the one outcome to avoid.

The broader lesson is that the generation prompt needs an explicit negative on
text, and every regenerated card needs its pip count verified individually
before it enters the deck. The prompt asking for eight of something is not
evidence that eight of something was drawn.

## The padding win

This is the part that makes the T2 decision straightforwardly correct rather
than merely preferable.

Every one of the 36 T1 files is 1024×1792, but the actual artwork occupies only
31 to 57 percent of that canvas. The rest is black padding. The worst case is
four-of-swords, where the real art is 570×1010 inside a 1024×1792 file — under
a third of the pixels are doing any work. Effective resolution across the T1
deck is roughly 700×1020 regardless of the nominal file size, and every byte of
that padding is being paid for on every card render.

T2 runs 92 to 100 percent content. The padding problem simply does not exist in
the new style. Switching to T2 primary fixes a real production cost, not just a
look.

## What "T2 primary" requires operationally

### Resolution

T2 is not internally consistent. Of the 42 incoming files, 24 are 384×576, 16
are 896×1344, and 2 are 512×512. The good news is that 40 of the 42 are already
at a 2:3 aspect ratio, which is standard tarot proportion, so those only need
scaling rather than reframing. The two exceptions are `the-fool.png` and
`the-magician.png`, both square at 512×512. Those two need either regeneration
at 2:3 or a deliberate crop decision, and given that the Fool and the Magician
are the two most recognizable cards in the deck, regeneration is worth it.

The target should be a single normalized size for the whole deck. 896×1344 is
the natural choice since it is the largest native size present, it is 2:3, and
upscaling the 384×576 files to it is a lossy-but-acceptable operation while
downscaling the 896×1344 files to match the smaller ones would throw away real
detail on the sixteen best assets. Serve WebP alongside PNG and the bandwidth
question resolves itself.

### Directory and naming

The incoming 42 already use the correct kebab-case slugs — `ace-of-cups.png`,
`the-hanged-man.png`, `wheel-of-fortune.png` and so on — which match the
existing naming convention in `public/decan-cards/`. That is a meaningful
convenience and should not be disturbed.

The cleanest structure is a new `public/cards/` directory holding the full
normalized T2 deck, with `public/decan-cards/` left in place untouched until
the cutover is verified in production. Two directories briefly coexisting is
cheaper than a broken deck render. Once T2 is confirmed live and correct, T1
gets deleted rather than kept as a fallback — a fallback in a visibly different
art style is worse than no fallback, because a mixed-style spread reads as
broken rather than as degraded.

### Coverage

T2 currently covers the 42 aces, courts and majors, plus the four verified pip
replacements. The remaining pips still need generating in T2 before the cutover
can happen, and that generation run is the right moment to apply the two
lessons from this audit: no text in the prompt, and per-card count verification
after the fact rather than trust in the prompt.

## Recommended sequence

Normalize the 42 incoming files to 896×1344 and drop them into `public/cards/`.
Regenerate the Fool and the Magician at 2:3. Crop the bottom text strips off the
Eight of Cups and decide the numeral question for the Eight of Wands and Nine of
Pentacles. Generate the remaining T2 pips. Verify every pip count above six
individually. Then cut over and delete T1.

Nothing in that sequence requires code changes beyond the asset path, which is
the main reason this is a good migration to do now rather than alongside the
tier restructure.
