// TarotByte — Celestial Narrative
// Turns a card's `celestial` object into layered reading text for the T/Z/D tiers.
// This is where the "Majors = fate / Minors = choices" voice lives, and where
// non-decan cards read as AMPLIFIED rather than precise.

import { zodiacLabel, decanLabel } from "./celestial.js";

// --- Decan TITLES (ownable TarotByte IP) ---
// Action/decision-oriented names for each of the 36 decans, keyed by pip id.
// These are what the "Decan Engine" tier surfaces and what the decan art illustrates.
// Punchy, verb-forward, decision-framing — the differentiator no public-domain deck has.
export const DECAN_TITLE = {
  // Aries → Wands 2,3,4
  "two-of-wands": "The First Move",
  "three-of-wands": "The Long Look",
  "four-of-wands": "The Open Door",
  // Leo → Wands 5,6,7
  "five-of-wands": "The Proving Ground",
  "six-of-wands": "The Claimed Win",
  "seven-of-wands": "The Held Line",
  // Sagittarius → Wands 8,9,10
  "eight-of-wands": "The Green Light",
  "nine-of-wands": "The Last Push",
  "ten-of-wands": "The Chosen Load",
  // Cancer → Cups 2,3,4
  "two-of-cups": "The Kept Promise",
  "three-of-cups": "The Named Joy",
  "four-of-cups": "The Missed Offer",
  // Scorpio → Cups 5,6,7
  "five-of-cups": "The Honest Grief",
  "six-of-cups": "The Golden Return",
  "seven-of-cups": "The Clear-Eyed Choice",
  // Pisces → Cups 8,9,10
  "eight-of-cups": "The Quiet Departure",
  "nine-of-cups": "The Granted Wish",
  "ten-of-cups": "The Guarded Home",
  // Libra → Swords 2,3,4
  "two-of-swords": "The Lifted Veil",
  "three-of-swords": "The Clearing Cut",
  "four-of-swords": "The Earned Rest",
  // Aquarius → Swords 5,6,7
  "five-of-swords": "The Costly Win",
  "six-of-swords": "The Calmer Crossing",
  "seven-of-swords": "The Quiet Move",
  // Gemini → Swords 8,9,10
  "eight-of-swords": "The Loosened Cage",
  "nine-of-swords": "The Named Fear",
  "ten-of-swords": "The Clean Ending",
  // Capricorn → Pentacles 2,3,4
  "two-of-pentacles": "The Kept Rhythm",
  "three-of-pentacles": "The First Proof",
  "four-of-pentacles": "The Open Grip",
  // Taurus → Pentacles 5,6,7
  "five-of-pentacles": "The Reached Hand",
  "six-of-pentacles": "The Fair Exchange",
  "seven-of-pentacles": "The Patient Tend",
  // Virgo → Pentacles 8,9,10
  "eight-of-pentacles": "The Devoted Craft",
  "nine-of-pentacles": "The Earned Comfort",
  "ten-of-pentacles": "The Lasting Legacy",
};

// --- Decan meanings (the deep D-tier text for the 36 pips) ---
// Original, concise, launch-usable. Keyed by pip id.
export const DECAN_MEANING = {
  "two-of-wands": "Mars in Aries lights the fuse: raw will meets a blank map. The pull to conquer new ground is strongest at the very start — choose your horizon before you charge.",
  "three-of-wands": "Sun in Aries turns the spark into a stage. Your vision is visible now; others can see the flame. Momentum rewards the bold, patient look outward.",
  "four-of-wands": "Venus in Aries softens fire into celebration. A foundation worth marking — pleasure, welcome, and a threshold crossed together.",
  "five-of-wands": "Saturn in Leo disciplines the ego's roar. Friction here is the grind that forges skill; the clash is practice, not war.",
  "six-of-wands": "Jupiter in Leo crowns the confident. Expansion meets applause — a genuine win, amplified. Wear it graciously and it grows.",
  "seven-of-wands": "Mars in Leo defends the throne. Hold your ground from conviction, not fear; the high position is worth the stand.",
  "eight-of-wands": "Mercury in Sagittarius fires the arrows. Swift news, fast travel, ideas in flight — say yes to momentum while it's hot.",
  "nine-of-wands": "Moon in Sagittarius guards the tired seeker. One more push; your instincts are weary but sharp. Rest the body, trust the aim.",
  "ten-of-wands": "Saturn in Sagittarius makes the vision heavy. The dream is real but the load is real too — carry only what still serves the goal.",
  "two-of-cups": "Venus in Cancer is love that nests. Tender mutual recognition — a bond that wants safety and softness to grow.",
  "three-of-cups": "Mercury in Cancer is joy shared in words. Celebration, chosen family, feelings spoken aloud — connection multiplies when named.",
  "four-of-cups": "Moon in Cancer turns inward and broods. A gift is offered but you're gazing elsewhere; the feeling is real, the timing is yours.",
  "five-of-cups": "Mars in Scorpio is grief with teeth. Loss cuts deep here — but the intensity is also the medicine. Turn and see what still stands.",
  "six-of-cups": "Sun in Scorpio warms the past into gold. Memory, innocence, a kindness returning — nostalgia lit from within, not a trap.",
  "seven-of-cups": "Venus in Scorpio is seductive illusion. So many desires shimmer; not all are yours. Feel deeply, then choose with clear eyes.",
  "eight-of-cups": "Saturn in Pisces walks away from the shallows. A quiet, disciplined departure toward something deeper — the leaving is the growth.",
  "nine-of-cups": "Jupiter in Pisces overflows the wish-cup. Contentment expands; a heartfelt want fulfilled. Savor it — and don't stop at pleasure.",
  "ten-of-cups": "Mars in Pisces fights for the dream of home. Emotional fulfillment worth protecting — passion in service of belonging.",
  "two-of-swords": "Moon in Libra balances with a blindfold. A stalemate held by feeling, not fact. Lift the veil; an honest choice is waiting.",
  "three-of-swords": "Saturn in Libra is the hard, clearing truth. Heartache that teaches — the pain is structured, and structure heals.",
  "four-of-swords": "Jupiter in Libra blesses the rest. Recovery expands what it touches — stillness now is generous, not lazy.",
  "five-of-swords": "Venus in Aquarius wins, but at a cost to the tribe. Ask if being right is worth the distance it makes.",
  "six-of-swords": "Mercury in Aquarius charts the calmer crossing. A thoughtful transition — carry the lesson, leave the weight.",
  "seven-of-swords": "Moon in Aquarius moves in the quiet. Strategy, solo action, a clever detour — check that the cleverness stays honest.",
  "eight-of-swords": "Jupiter in Gemini magnifies the mental trap. The cage is bigger in the mind than in the world — talk it out and it loosens.",
  "nine-of-swords": "Mars in Gemini sharpens 3am worry. Anxious thoughts with an edge — name them on paper and they lose their blade.",
  "ten-of-swords": "Sun in Gemini lights the ending clearly. A painful finish, fully seen — and dawn is already in the frame.",
  "two-of-pentacles": "Jupiter in Capricorn juggles with ambition. Many demands, handled with grace — expansion is possible if you keep the rhythm.",
  "three-of-pentacles": "Mars in Capricorn builds with drive. Skilled collaboration, early proof of craft — effort here compounds.",
  "four-of-pentacles": "Sun in Capricorn holds the treasure proudly. Security shines — just watch that holding on doesn't become clutching.",
  "five-of-pentacles": "Mercury in Taurus counts what's scarce. Hardship feels slow and material — but help is closer and more practical than it looks.",
  "six-of-pentacles": "Moon in Taurus gives from a full store. Generosity that feels safe and mutual — fair exchange nourishes both sides.",
  "seven-of-pentacles": "Saturn in Taurus makes patience a discipline. Your investment ripens on the earth's clock, not yours. Tend, don't yank.",
  "eight-of-pentacles": "Sun in Virgo glorifies the craft. Devoted, detailed practice — mastery is visible in the small, repeated act.",
  "nine-of-pentacles": "Venus in Virgo perfects earned comfort. Refined, independent abundance — luxury with discernment, pleasure well-kept.",
  "ten-of-pentacles": "Mercury in Virgo records the legacy. Lasting wealth in the details — systems, family, the fine print of security.",
};

// --- Amplified text for non-decan cards (Z-tier depth without a decan) ---
export function amplifiedText(card, cel) {
  switch (cel.mode) {
    case "source": // Aces
      return `As an Ace, this is the element of ${cel.element} in its pure, undivided form — source energy before it splits into any single degree. It touches all of ${cel.signs.join(", ")} at once. Read it as a beginning switched fully on: raw ${elementFlavor(cel.element)}.`;
    case "fate": // Majors
      if (cel.kind === "element") {
        return `A Major of the element ${cel.body} — this is a governing force, not a fine degree. Majors speak the language of fate: something larger than daily choice is moving through the reading. Meet it, don't manage it.`;
      }
      if (cel.kind === "planet") {
        return `A Major ruled by ${cel.body} — an archetypal, planet-sized force acting on you. Majors are the headlines of a reading: destiny, timing, the hand you're dealt. This is about what's being asked of you.`;
      }
      return `A Major carrying the whole sign of ${cel.body} — a season of life, not a single day. Majors read as fate and divination: a big current you're inside of. Align with it rather than resist.`;
    case "persona": // Courts
      if (cel.cusp.length === 3) {
        return `A Page — the receptive, elemental face of its suit (${cel.cusp.join(", ")}). Read it as a person, message, or mode of being that carries the whole element's promise: curious, unformed, full of potential.`;
      }
      return `A Court card straddling the ${cel.cusp[0]}–${cel.cusp[1]} cusp — a persona holding two energies at once. Courts point to people, personalities, or ways of behaving. Ask: who is this in your life — or which part of you?`;
    default:
      return "";
  }
}

function elementFlavor(el) {
  return {
    Fire: "drive, passion, and the will to begin",
    Water: "feeling, intuition, and emotional truth",
    Air: "thought, clarity, and the spoken word",
    Earth: "body, resource, and the material world",
  }[el] || "elemental potential";
}

// --- Build the layered lines for a single card, given the highest unlocked tier ---
// tier: "T" | "Z" | "D"
export function celestialLines(card, cel, tier) {
  const lines = [];
  if (tier === "T") return lines; // no celestial layer

  // Z tier: always available (zodiac/planet address + depth)
  const zLabel = zodiacLabel(cel);
  if (cel.mode === "precise") {
    // pip at Z tier: show sign + planet, but hold the decan detail for D
    lines.push({
      tier: "Z",
      label: zLabel, // e.g. "Sun in Scorpio"
      text: `${card.name} carries ${zLabel} — ${cel.modality.toLowerCase()} ${cel.element.toLowerCase()}. The zodiac colours this card with ${cel.sign}'s signature.`,
    });
  } else {
    lines.push({ tier: "Z", label: zLabel, text: amplifiedText(card, cel) });
  }

  // D tier: only pips have a precise decan; others show an "amplified" note.
  if (tier === "D") {
    if (cel.mode === "precise") {
      lines.push({
        tier: "D",
        title: DECAN_TITLE[card.id], // ownable IP, e.g. "The Golden Return"
        label: decanLabel(cel), // "Scorpio · Decan II"
        text: `${DECAN_MEANING[card.id]} (${cel.dates})`,
      });
    } else {
      lines.push({
        tier: "D",
        label: "Amplified",
        text: amplifiedNote(cel),
      });
    }
  }
  return lines;
}

function amplifiedNote(cel) {
  switch (cel.mode) {
    case "source":
      return "No single decan — an Ace is the whole element at once. At the decan layer it reads as maximum amplification: pure, concentrated source energy.";
    case "fate":
      return "No single decan — a Major is fate-sized. At the decan layer it reads as a governing headline: the universe is moving here, not just your choices.";
    case "persona":
      return "No single decan — a Court spans a cusp. At the decan layer it reads as a person or persona carrying more than one energy.";
    default:
      return "";
  }
}

// --- Reading-level tone: interpret the MIX of cards drawn ---
// Returns a short banner line describing the overall celestial weather.
export function readingTone(cardsWithCelestial) {
  const counts = { fate: 0, choices: 0, source: 0, persona: 0 };
  cardsWithCelestial.forEach((c) => {
    const r = c.celestial?.register;
    if (r && counts[r] !== undefined) counts[r] += 1;
  });
  const total = cardsWithCelestial.length || 1;

  if (counts.fate >= Math.ceil(total / 2)) {
    return { key: "fate", text: "The Majors dominate — this reading is about fate, not fine control. The universe is moving; your work is to align with what's being asked of you." };
  }
  if (counts.choices >= Math.ceil(total / 2)) {
    return { key: "choices", text: "The numbered cards lead — this reading is about your choices and everyday behaviour. Small, precise moves shift the outcome. You have the wheel." };
  }
  if (counts.source >= 1 && total <= 3) {
    return { key: "source", text: "An Ace is present — raw elemental force is switched on. A pure beginning underlies this reading." };
  }
  if (counts.persona >= Math.ceil(total / 2)) {
    return { key: "persona", text: "Court cards feature strongly — this reading is about people and personas. Ask who these figures are in your life, or which parts of you they name." };
  }
  return { key: "mixed", text: "A blend of fate and choice — some of this is being handed to you, some is yours to steer. Read the headlines, then act on the details." };
}
