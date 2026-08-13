/**
 * deckArt.js
 *
 * Resolves which visual deck a reading should render.
 *
 * T1 (the default gold/steampunk deck) ships all 78 cards and is what every
 * reader sees. T2 ("harlectric") is the alternate treatment unlocked by the
 * Astral Threads / Decan add-on, and it currently exists ONLY as the 22
 * Major Arcana.
 *
 * That asymmetry is the important part: a T2 reading that draws a minor
 * arcana card must fall back to the T1 art for that card, or it renders a
 * broken image. Deck selection is therefore per-card, not per-reading.
 */

// Reading tiers, as produced by readingEngine.generateReading():
//   "T" = tarot only            -> T1 art
//   "Z" = tarot + zodiac        -> T2 art (Astral Threads unlocked)
//   "D" = tarot + decans        -> T2 art (Decan Engine unlocked)
const T2_TIERS = new Set(["Z", "D"]);

const T1_BACK = "/oracle/card-back.png";
const T2_BACK = "/t2-cards/card-back.png";

/** True when this tier has unlocked the T2 "harlectric" treatment. */
export function usesT2(tier) {
  return T2_TIERS.has(tier);
}

/**
 * Card back for the face-down state of a tarot card slot.
 * The oracle deck is a separate deck and keeps its own back regardless.
 */
export function backImageForTier(tier) {
  return usesT2(tier) ? T2_BACK : T1_BACK;
}

/**
 * Face art for a single card.
 *
 * Falls back to the card's own (T1) image whenever T2 has no art for it —
 * i.e. for all 56 minor arcana — so mixed spreads still render correctly.
 */
export function cardImageForTier(card, tier) {
  if (!card || !card.image) return card?.image;
  if (!usesT2(tier)) return card.image;
  if (card.arcana !== "major") return card.image;
  return `/t2-cards/${card.id}.png`;
}

export default { usesT2, backImageForTier, cardImageForTier };
