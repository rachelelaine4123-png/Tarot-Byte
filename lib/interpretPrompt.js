// TarotByte — Claude interpretation contract
//
// ONE place that defines what we ask the model for and what shape we expect
// back. The API route and the fallback builder both import from here so the
// UI can render identically whether or not the AI call succeeded.
//
// Output contract (strict JSON):
// {
//   "cards": [
//     { "keywords": ["...","...","..."], "overview": "1-2 sentences" }
//   ],
//   "threadLine": "one sentence | null",
//   "synthesis": "1-2 detailed paragraphs"
// }

export const INTERPRETATION_SCHEMA_HINT = `Return ONLY valid JSON (no markdown fences, no commentary) matching exactly:
{
  "cards": [ { "keywords": ["word","word","word"], "overview": "one or two sentences" } ],
  "threadLine": "one sentence tying the Astral Threads sign to the whole spread, or null if no oracle card was drawn",
  "synthesis": "one to two detailed paragraphs"
}
The "cards" array MUST have exactly one entry per drawn tarot card, in the same order given.`;

/**
 * Build the Claude prompt for a reading.
 * `question` is the user's free-text question (may be empty).
 */
export function buildInterpretationPrompt(reading, question) {
  const ctx = reading.context ? `Focus area: ${reading.context}.` : "";
  const q = question?.trim()
    ? `The querent asked: "${question.trim()}"`
    : "The querent did not write a specific question; read to the focus area and the positions themselves.";

  const cardLines = reading.cards
    .map((c, i) => {
      const orient = c.reversed ? "reversed" : "upright";
      const directional = c.alwaysUpright
        ? " [this position is DIRECTIONAL — always upright; it names the shift to move toward]"
        : "";
      const meaning = c.reversed ? c.reversedMeaning : c.upright;
      const thread =
        c.celestial?.sign && reading.tier !== "T"
          ? ` Celestial thread: ${c.celestial.sign}${c.celestial.ruler ? `, ruled by ${c.celestial.ruler}` : ""}${
              reading.tier === "D" && c.celestial.decan ? `, decan ${c.celestial.decan}` : ""
            }.`
          : "";
      return `${i + 1}. Position "${c.position}"${directional}: ${c.name} (${orient}). Established meaning: ${meaning}${thread}`;
    })
    .join("\n");

  const oracleBlock = reading.oracle
    ? `\nAn Astral Threads oracle card was also drawn: ${reading.oracle.sign} — "${reading.oracle.keyword}". ${reading.oracle.energy} ${reading.oracle.clarifier}\nBecause this card is present, ALL cards in this spread are touched by that celestial energy. Write "threadLine" as a single sentence describing how ${reading.oracle.sign} colours the whole reading.`
    : `\nNo oracle card was drawn. Set "threadLine" to null.`;

  return `You are TarotByte — a warm, grounded, modern tarot reader. You are insightful and specific, never vague or generically mystical. You speak directly to the person ("you"), and you never hedge with "may or may not". Avoid clichés like "trust the journey".

${q}
${ctx}
Spread: ${reading.spread.name}.

Cards drawn, in order:
${cardLines}
${oracleBlock}

For EACH card produce:
  - "keywords": the top 3 words that define that card AS IT LANDS in this specific reading (not generic dictionary keywords). Single words or very short phrases, lowercase.
  - "overview": TWO SENTENCES MAXIMUM interpreting that card in the context of the question and its position. Be concrete and useful.

Then produce "synthesis": one to two detailed paragraphs that tie every card together into a single coherent answer to what was asked. Reference the cards by name, name the through-line, and end with a specific, actionable takeaway. This is the payoff of the whole reading — make it genuinely insightful, not a restatement of the individual cards.

${INTERPRETATION_SCHEMA_HINT}`;
}

/**
 * Deterministic fallback used when the AI is unavailable or returns junk.
 * Keeps the SAME shape as the AI response so the UI never has to branch.
 */
export function fallbackInterpretation(reading) {
  const cards = reading.cards.map((c) => {
    const meaning = c.reversed ? c.reversedMeaning : c.upright;
    // First 2 sentences of the established meaning.
    const sentences = meaning.match(/[^.!?]+[.!?]+/g) || [meaning];
    const overview = sentences.slice(0, 2).join(" ").trim();
    return {
      keywords: deriveKeywords(c),
      overview,
    };
  });

  const threadLine = reading.oracle
    ? `${reading.oracle.sign} threads through this entire reading — ${reading.oracle.keyword.toLowerCase()}. ${reading.oracle.clarifier}`
    : null;

  const names = reading.cards.map((c) => c.name).join(", ");
  const synthesis =
    `This spread moves through ${names}. ` +
    reading.cards
      .map((c) => `${c.position} lands on ${c.name}${c.reversed ? " reversed" : ""}: ${firstSentence(c.reversed ? c.reversedMeaning : c.upright)}`)
      .join(" ") +
    (threadLine ? ` ${threadLine}` : "");

  return { cards, threadLine, synthesis, source: "fallback" };
}

function firstSentence(text) {
  const m = text.match(/[^.!?]+[.!?]+/);
  return (m ? m[0] : text).trim();
}

/** Pull 3 short keywords out of a card's own meaning text. */
function deriveKeywords(card) {
  const meaning = card.reversed ? card.reversedMeaning : card.upright;
  const STOP = new Set([
    "the", "and", "you", "your", "that", "this", "with", "from", "for", "not",
    "but", "are", "was", "may", "have", "has", "its", "it's", "what", "when",
    "where", "there", "their", "them", "they", "been", "were", "into", "over",
    "than", "then", "only", "even", "just", "more", "most", "much", "very",
    "can", "will", "would", "could", "should", "here", "now", "already",
    "something", "someone", "everything", "anything", "yourself", "which",
    "while", "about", "after", "before", "again", "still", "way", "one",
  ]);
  const freq = new Map();
  for (const raw of meaning.toLowerCase().match(/[a-z']+/g) || []) {
    if (raw.length < 4 || STOP.has(raw)) continue;
    freq.set(raw, (freq.get(raw) || 0) + 1);
  }
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const picked = ranked.slice(0, 3).map(([w]) => w);
  while (picked.length < 3) picked.push(card.arcana === "major" ? "transformation" : card.suit || "energy");
  return picked;
}
