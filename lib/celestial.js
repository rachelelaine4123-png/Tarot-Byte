// TarotByte — Celestial Correspondence System
// The T / Z / D ladder:
//   T = Tarot only (card + meaning)
//   Z = Tarot + Zodiac  (sign / planet correspondence)
//   D = Tarot + Decans  (exact 10° decan + planetary sub-ruler, pips only)
//
// This is the DERIVED layer: nothing is drawn separately — every card already
// "knows" its celestial address via the fixed Golden Dawn correspondences.
//
// Cards that don't sit on a single decan aren't "missing" one — their energy is
// LARGER than a decan, so they read as AMPLIFIED rather than precise:
//   • Aces   → the pure, undivided ELEMENT itself (source energy)
//   • Majors → a whole PLANET or SIGN — fate / divination (forces acting on you)
//   • Courts → a persona straddling a CUSP (two energies at once)
//   • Pips 2–10 → resolve to a PRECISE decan (choices / everyday behavior)

// --- Sign metadata (element + modality) ---
export const SIGN_INFO = {
  Aries: { element: "Fire", modality: "Cardinal", glyph: "♈", ruler: "Mars" },
  Taurus: { element: "Earth", modality: "Fixed", glyph: "♉", ruler: "Venus" },
  Gemini: { element: "Air", modality: "Mutable", glyph: "♊", ruler: "Mercury" },
  Cancer: { element: "Water", modality: "Cardinal", glyph: "♋", ruler: "Moon" },
  Leo: { element: "Fire", modality: "Fixed", glyph: "♌", ruler: "Sun" },
  Virgo: { element: "Earth", modality: "Mutable", glyph: "♍", ruler: "Mercury" },
  Libra: { element: "Air", modality: "Cardinal", glyph: "♎", ruler: "Venus" },
  Scorpio: { element: "Water", modality: "Fixed", glyph: "♏", ruler: "Mars" },
  Sagittarius: { element: "Fire", modality: "Mutable", glyph: "♐", ruler: "Jupiter" },
  Capricorn: { element: "Earth", modality: "Cardinal", glyph: "♑", ruler: "Saturn" },
  Aquarius: { element: "Air", modality: "Fixed", glyph: "♒", ruler: "Saturn" },
  Pisces: { element: "Water", modality: "Mutable", glyph: "♓", ruler: "Jupiter" },
};

export const PLANET_GLYPH = {
  Mars: "♂", Sun: "☉", Venus: "♀", Mercury: "☿", Moon: "☽",
  Jupiter: "♃", Saturn: "♄",
};

// --- The 36 Decans → Pip cards (Golden Dawn / Chaldean order) ---
// Format: [suit, rank] : { sign, decan (1|2|3), planet }
// Roman numeral for the decan derived from `decan`.
const DECAN_ROMAN = { 1: "I", 2: "II", 3: "III" };

// Each pip's exact decan + planetary sub-ruler.
export const PIP_DECANS = {
  // Wands (Fire): Aries, Leo, Sagittarius
  "two-of-wands": { sign: "Aries", decan: 1, planet: "Mars" },
  "three-of-wands": { sign: "Aries", decan: 2, planet: "Sun" },
  "four-of-wands": { sign: "Aries", decan: 3, planet: "Venus" },
  "five-of-wands": { sign: "Leo", decan: 1, planet: "Saturn" },
  "six-of-wands": { sign: "Leo", decan: 2, planet: "Jupiter" },
  "seven-of-wands": { sign: "Leo", decan: 3, planet: "Mars" },
  "eight-of-wands": { sign: "Sagittarius", decan: 1, planet: "Mercury" },
  "nine-of-wands": { sign: "Sagittarius", decan: 2, planet: "Moon" },
  "ten-of-wands": { sign: "Sagittarius", decan: 3, planet: "Saturn" },

  // Cups (Water): Cancer, Scorpio, Pisces
  "two-of-cups": { sign: "Cancer", decan: 1, planet: "Venus" },
  "three-of-cups": { sign: "Cancer", decan: 2, planet: "Mercury" },
  "four-of-cups": { sign: "Cancer", decan: 3, planet: "Moon" },
  "five-of-cups": { sign: "Scorpio", decan: 1, planet: "Mars" },
  "six-of-cups": { sign: "Scorpio", decan: 2, planet: "Sun" },
  "seven-of-cups": { sign: "Scorpio", decan: 3, planet: "Venus" },
  "eight-of-cups": { sign: "Pisces", decan: 1, planet: "Saturn" },
  "nine-of-cups": { sign: "Pisces", decan: 2, planet: "Jupiter" },
  "ten-of-cups": { sign: "Pisces", decan: 3, planet: "Mars" },

  // Swords (Air): Libra, Aquarius, Gemini
  "two-of-swords": { sign: "Libra", decan: 1, planet: "Moon" },
  "three-of-swords": { sign: "Libra", decan: 2, planet: "Saturn" },
  "four-of-swords": { sign: "Libra", decan: 3, planet: "Jupiter" },
  "five-of-swords": { sign: "Aquarius", decan: 1, planet: "Venus" },
  "six-of-swords": { sign: "Aquarius", decan: 2, planet: "Mercury" },
  "seven-of-swords": { sign: "Aquarius", decan: 3, planet: "Moon" },
  "eight-of-swords": { sign: "Gemini", decan: 1, planet: "Jupiter" },
  "nine-of-swords": { sign: "Gemini", decan: 2, planet: "Mars" },
  "ten-of-swords": { sign: "Gemini", decan: 3, planet: "Sun" },

  // Pentacles (Earth): Capricorn, Taurus, Virgo
  "two-of-pentacles": { sign: "Capricorn", decan: 1, planet: "Jupiter" },
  "three-of-pentacles": { sign: "Capricorn", decan: 2, planet: "Mars" },
  "four-of-pentacles": { sign: "Capricorn", decan: 3, planet: "Sun" },
  "five-of-pentacles": { sign: "Taurus", decan: 1, planet: "Mercury" },
  "six-of-pentacles": { sign: "Taurus", decan: 2, planet: "Moon" },
  "seven-of-pentacles": { sign: "Taurus", decan: 3, planet: "Saturn" },
  "eight-of-pentacles": { sign: "Virgo", decan: 1, planet: "Sun" },
  "nine-of-pentacles": { sign: "Virgo", decan: 2, planet: "Venus" },
  "ten-of-pentacles": { sign: "Virgo", decan: 3, planet: "Mercury" },
};

// --- Aces → the whole element (a triplicity of 3 signs) ---
export const ACE_ELEMENTS = {
  "ace-of-wands": { element: "Fire", signs: ["Aries", "Leo", "Sagittarius"] },
  "ace-of-cups": { element: "Water", signs: ["Cancer", "Scorpio", "Pisces"] },
  "ace-of-swords": { element: "Air", signs: ["Libra", "Aquarius", "Gemini"] },
  "ace-of-pentacles": { element: "Earth", signs: ["Capricorn", "Taurus", "Virgo"] },
};

// --- Court cards → a cusp span (Golden Dawn: last decan of one sign + first two
// of the next). Queens=Cardinal/Water-leaning, Kings=Fixed, Knights=Mutable,
// Pages=elemental (the earthy/receptive part of the suit). We give each a primary
// governing sign + the cusp it straddles for the "persona between two energies" read. ---
export const COURT_SPANS = {
  // Wands (Fire suit)
  "knight-of-wands": { primary: "Scorpio", cusp: ["Scorpio", "Sagittarius"] },
  "queen-of-wands": { primary: "Pisces", cusp: ["Pisces", "Aries"] },
  "king-of-wands": { primary: "Cancer", cusp: ["Cancer", "Leo"] },
  "page-of-wands": { primary: "Fire", cusp: ["Aries", "Leo", "Sagittarius"] },
  // Cups (Water suit)
  "knight-of-cups": { primary: "Aquarius", cusp: ["Aquarius", "Pisces"] },
  "queen-of-cups": { primary: "Gemini", cusp: ["Gemini", "Cancer"] },
  "king-of-cups": { primary: "Libra", cusp: ["Libra", "Scorpio"] },
  "page-of-cups": { primary: "Water", cusp: ["Cancer", "Scorpio", "Pisces"] },
  // Swords (Air suit)
  "knight-of-swords": { primary: "Taurus", cusp: ["Taurus", "Gemini"] },
  "queen-of-swords": { primary: "Virgo", cusp: ["Virgo", "Libra"] },
  "king-of-swords": { primary: "Capricorn", cusp: ["Capricorn", "Aquarius"] },
  "page-of-swords": { primary: "Air", cusp: ["Libra", "Aquarius", "Gemini"] },
  // Pentacles (Earth suit)
  "knight-of-pentacles": { primary: "Leo", cusp: ["Leo", "Virgo"] },
  "queen-of-pentacles": { primary: "Sagittarius", cusp: ["Sagittarius", "Capricorn"] },
  "king-of-pentacles": { primary: "Aries", cusp: ["Aries", "Taurus"] },
  "page-of-pentacles": { primary: "Earth", cusp: ["Capricorn", "Taurus", "Virgo"] },
};

// --- The Archons (Major Arcana) → planet / sign / element (Golden Dawn Hebrew-letter attributions) ---
export const MAJOR_CORRESPONDENCE = {
  "the-fool": { kind: "element", body: "Air" },
  "the-magician": { kind: "planet", body: "Mercury" },
  "the-high-priestess": { kind: "planet", body: "Moon" },
  "the-empress": { kind: "planet", body: "Venus" },
  "the-emperor": { kind: "sign", body: "Aries" },
  "the-hierophant": { kind: "sign", body: "Taurus" },
  "the-lovers": { kind: "sign", body: "Gemini" },
  "the-chariot": { kind: "sign", body: "Cancer" },
  "strength": { kind: "sign", body: "Leo" },
  "the-hermit": { kind: "sign", body: "Virgo" },
  "wheel-of-fortune": { kind: "planet", body: "Jupiter" },
  "justice": { kind: "sign", body: "Libra" },
  "the-hanged-man": { kind: "element", body: "Water" },
  "death": { kind: "sign", body: "Scorpio" },
  "temperance": { kind: "sign", body: "Sagittarius" },
  "the-devil": { kind: "sign", body: "Capricorn" },
  "the-tower": { kind: "planet", body: "Mars" },
  "the-star": { kind: "sign", body: "Aquarius" },
  "the-moon": { kind: "sign", body: "Pisces" },
  "the-sun": { kind: "planet", body: "Sun" },
  "judgement": { kind: "element", body: "Fire" },
  "the-world": { kind: "planet", body: "Saturn" },
};

// Ordinal date range for a decan (approx, for flavor). Sign start dates.
const SIGN_START = {
  Aries: [3, 21], Taurus: [4, 20], Gemini: [5, 21], Cancer: [6, 21],
  Leo: [7, 23], Virgo: [8, 23], Libra: [9, 23], Scorpio: [10, 23],
  Sagittarius: [11, 22], Capricorn: [12, 22], Aquarius: [1, 20], Pisces: [2, 19],
};
const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function decanDateRange(sign, decan) {
  const [m, d] = SIGN_START[sign];
  const startDay = d + (decan - 1) * 10;
  const endDay = startDay + 9;
  // rough month rollover handling
  const fmt = (mon, day) => {
    let mm = mon, dd = day;
    const daysIn = [31,28,31,30,31,30,31,31,30,31,30,31][mm - 1];
    if (dd > daysIn) { dd -= daysIn; mm = mm === 12 ? 1 : mm + 1; }
    return `${MONTH[mm - 1]} ${dd}`;
  };
  return `${fmt(m, startDay)} – ${fmt(m, endDay)}`;
}

// ============================================================
// Main API: attach a `celestial` object to a card.
// Returns one of these shapes on card.celestial:
//   mode: "precise"   (pips)   → { mode, tier:"D", sign, decan, decanRoman, planet, glyph, planetGlyph, dates, element, modality, register }
//   mode: "source"    (aces)   → { mode, tier:"Z", element, signs, register }
//   mode: "fate"      (majors) → { mode, tier:"Z", kind, body, glyph, register }
//   mode: "persona"   (courts) → { mode, tier:"Z", primary, cusp, register }
// `register` groups cards for reading-level tone.
// ============================================================
export function celestialFor(card) {
  // Pips (2–10) → precise decan
  if (PIP_DECANS[card.id]) {
    const d = PIP_DECANS[card.id];
    const info = SIGN_INFO[d.sign];
    return {
      mode: "precise",
      tier: "D",
      register: "choices",
      sign: d.sign,
      decan: d.decan,
      decanRoman: DECAN_ROMAN[d.decan],
      planet: d.planet,
      glyph: info.glyph,
      planetGlyph: PLANET_GLYPH[d.planet],
      element: info.element,
      modality: info.modality,
      dates: decanDateRange(d.sign, d.decan),
    };
  }
  // Aces → whole element (source energy)
  if (ACE_ELEMENTS[card.id]) {
    const a = ACE_ELEMENTS[card.id];
    return {
      mode: "source",
      tier: "Z",
      register: "source",
      element: a.element,
      signs: a.signs,
    };
  }
  // Courts → persona on a cusp
  if (COURT_SPANS[card.id]) {
    const c = COURT_SPANS[card.id];
    return {
      mode: "persona",
      tier: "Z",
      register: "persona",
      primary: c.primary,
      cusp: c.cusp,
      glyph: SIGN_INFO[c.primary]?.glyph || null,
    };
  }
  // Majors → planet / sign / element (fate)
  if (MAJOR_CORRESPONDENCE[card.id]) {
    const m = MAJOR_CORRESPONDENCE[card.id];
    return {
      mode: "fate",
      tier: "Z",
      register: "fate",
      kind: m.kind, // planet | sign | element
      body: m.body,
      glyph: m.kind === "planet" ? PLANET_GLYPH[m.body] : (m.kind === "sign" ? SIGN_INFO[m.body]?.glyph : null),
    };
  }
  // Fallback (shouldn't happen)
  return { mode: "none", tier: "T", register: "neutral" };
}

// A short, human label for the Z tier (the "zodiac address").
export function zodiacLabel(cel) {
  switch (cel.mode) {
    case "precise":
      return `${cel.planet} in ${cel.sign}`;
    case "source":
      return `The element of ${cel.element}`;
    case "persona":
      return cel.cusp.length === 2
        ? `${cel.cusp[0]}–${cel.cusp[1]} cusp`
        : `${cel.element || cel.primary} personified`;
    case "fate":
      return cel.kind === "element" ? `The element of ${cel.body}` : cel.body;
    default:
      return "";
  }
}

// A short label for the D tier (the exact decan) — only meaningful for pips.
export function decanLabel(cel) {
  if (cel.mode === "precise") {
    return `${cel.sign} · Decan ${cel.decanRoman}`;
  }
  return null; // non-pips have no single decan
}
