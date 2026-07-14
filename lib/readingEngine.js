// TarotByte — Reading Engine
// Deterministic shuffle/draw + spread definitions + templated interpretation.
// AI interpretation is an OPTIONAL plug-in point (see interpretReading):
// if an API key/route is available it can enrich text; otherwise templated
// meanings are used so the experience always works with zero cost.

import { TAROT_DECK } from "./tarotDeck.js";
import { ASTRAL_THREADS } from "./oracleDeck.js";
import { celestialFor } from "./celestial.js";
import { celestialLines, readingTone } from "./celestialNarrative.js";

// --- Fisher–Yates shuffle (unbiased) ---
function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawCards(count, { allowReversed = true, deck = TAROT_DECK } = {}) {
  const shuffled = shuffle(deck);
  return shuffled.slice(0, count).map((card) => ({
    ...card,
    reversed: allowReversed ? Math.random() < 0.5 : false,
    celestial: celestialFor(card), // T/Z/D derived layer — always present, revealed by tier
  }));
}

function drawOracle(count = 1) {
  return shuffle(ASTRAL_THREADS).slice(0, count);
}

// --- Spread definitions ---
export const SPREADS = {
  "yes-no": {
    id: "yes-no",
    name: "Yes / No",
    tier: "free",
    cards: 1,
    positions: [{ key: "answer", label: "The Answer" }],
    usesOracle: false,
    contexts: false,
    description: "One card, one clear direction. Ask a yes-or-no question and let the card weigh in.",
  },
  "past-present-future": {
    id: "past-present-future",
    name: "Past · Present · Future",
    tier: "free",
    cards: 3,
    positions: [
      { key: "past", label: "Past" },
      { key: "present", label: "Present" },
      { key: "future", label: "Future" },
    ],
    usesOracle: false,
    contexts: ["Love", "Career", "Fortune"],
    description: "A classic three-card arc across time, focused on the area of life you choose.",
  },
  "energy-reading": {
    id: "energy-reading",
    name: "The Energy Reading",
    tier: "member", // requires signup + subscribe to unlock
    cards: 3,
    positions: [
      { key: "you", label: "You" },
      { key: "current-energy", label: "Current Energy / The Situation" },
      { key: "shift", label: "Outcome / Energy Shift Required" },
    ],
    usesOracle: true, // clarified with an Astral Threads sign card
    contexts: ["Love", "Career", "Fortune", "General"],
    description:
      "TarotByte's signature spread. Three cards map you, your current energy, and the outcome or shift required — then an Astral Threads card clarifies the celestial energy at play.",
  },
};

// --- Yes/No logic: Majors + certain cards lean yes/no ---
function yesNoVerdict(card) {
  // Upright Majors and Wands/Cups tend affirmative; reversed & Swords lean caution.
  const affirmativeSuits = ["wands", "cups", "pentacles"];
  if (card.reversed) return card.arcana === "major" ? "Maybe" : "No, or not yet";
  if (card.arcana === "major") return "Yes";
  if (affirmativeSuits.includes(card.suit)) return card.suit === "swords" ? "Maybe" : "Yes";
  return "Maybe";
}

// --- Templated interpretation builder ---
// NOTE: card.reversed is a BOOLEAN orientation flag; the meaning STRINGS live
// on card.upright / card.reversedMeaning. We normalize here.
function meaningFor(card) {
  return card.reversed ? card.reversedMeaning : card.upright;
}

function templatedText(spread, cards, { context, oracle } = {}) {
  // Context is now shown once as a theme banner at the top of the reading,
  // not repeated on every card line. This keeps each card's interpretation
  // clean and avoids the repetitive "in the context of love" phrasing.
  const lines = [];
  spread.positions.forEach((pos, i) => {
    const card = cards[i];
    const orientation = card.reversed ? " (reversed)" : "";
    lines.push({
      position: pos.label,
      card: `${card.name}${orientation}`,
      text: `${pos.label}: ${card.name}${orientation}. ${meaningFor(card)}`,
    });
  });
  if (spread.usesOracle && oracle) {
    lines.push({
      position: "Astral Threads Clarifier",
      card: `${oracle.sign} — ${oracle.keyword}`,
      text: `The Astral Threads draws ${oracle.sign} (${oracle.keyword}). ${oracle.energy} ${oracle.clarifier}`,
    });
  }
  return lines;
}

// --- Re-derive celestial lines on EXISTING cards without redrawing ---
// Used when a member activates the Decan Engine add-on AFTER a hand is
// already drawn. This re-attaches the deeper celestial lines to the same
// cards instead of shuffling a fresh hand (which was a bug — the user's
// drawn cards would change when they just wanted more depth).
export function rederiveCelestialLines(reading, newTier) {
  if (!reading || !reading.cards) return reading;
  const updatedCards = reading.cards.map((c) => ({
    ...c,
    celestialLines: celestialLines(c, c.celestial, newTier),
  }));
  return {
    ...reading,
    tier: newTier,
    cards: updatedCards,
    tone: newTier === "T" ? null : readingTone(updatedCards),
  };
}

// --- Main entry point ---
// tier: "T" (tarot only) | "Z" (tarot + zodiac) | "D" (tarot + decans)
export function generateReading({ spreadId, context = null, tier = "T" }) {
  const spread = SPREADS[spreadId];
  if (!spread) throw new Error(`Unknown spread: ${spreadId}`);

  const cards = drawCards(spread.cards);
  const oracle = spread.usesOracle ? drawOracle(1)[0] : null;

  const positioned = cards.map((c, i) => ({
    position: spread.positions[i]?.label ?? `Card ${i + 1}`,
    ...c,
    // The layered celestial reading text, gated by the unlocked tier.
    celestialLines: celestialLines(c, c.celestial, tier),
  }));

  const result = {
    spread: { id: spread.id, name: spread.name, positions: spread.positions },
    context,
    tier,
    cards: positioned,
    oracle,
    interpretation: templatedText(spread, cards, { context, oracle }),
    // Reading-level celestial weather (fate vs choices vs source vs persona).
    tone: tier === "T" ? null : readingTone(positioned),
  };

  if (spread.id === "yes-no") {
    result.verdict = yesNoVerdict(cards[0]);
  }

  return result;
}

// --- AI plug-in point (optional; used by an API route later) ---
// Given a reading + optional model client, returns enriched narrative text.
// Kept here so the engine has ONE clear seam for the future AI upgrade.
export async function interpretWithAI(reading, aiClient) {
  if (!aiClient) return reading; // graceful fallback to templated text
  // The API route will implement the actual call. This is the contract:
  // const narrative = await aiClient.generate(buildPrompt(reading));
  // reading.aiNarrative = narrative;
  return reading;
}

export function buildAIPrompt(reading) {
  const cardList = reading.cards
    .map((c) => `${c.position}: ${c.name}${c.reversed ? " (reversed)" : ""}`)
    .join("; ");
  const oracleLine = reading.oracle
    ? ` Astral Threads clarifier: ${reading.oracle.sign} (${reading.oracle.keyword}).`
    : "";
  const ctx = reading.context ? ` Focus area: ${reading.context}.` : "";
  return `You are TarotByte, a warm, insightful, modern tarot reader. Give a cohesive, encouraging interpretation (150-220 words) of this ${reading.spread.name} spread.${ctx} Cards — ${cardList}.${oracleLine} Weave the positions into one flowing reading, end with a gentle actionable takeaway.`;
}

export default generateReading;
