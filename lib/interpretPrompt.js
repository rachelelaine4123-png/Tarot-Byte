// TarotByte — Claude interpretation contract
//
// ONE place that defines what we ask the model for and what shape we expect
// back. The API route and the fallback builder both import from here so the
// UI can render identically whether or not the AI call succeeded.
//
// Output contract (strict JSON):
// {
//   "cards": [
//     { "keywords": ["...","...","..."], "overview": "a few sentences, length follows the card's weight" }
//   ],
//   "threadLine": "one sentence | null",
//   "synthesis": "several sentences to a couple of paragraphs, ends with a directive takeaway"
// }

export const INTERPRETATION_SCHEMA_HINT = `Return ONLY valid JSON (no markdown fences, no commentary) matching exactly:
{
  "cards": [ { "keywords": ["word","word","word"], "overview": "a few sentences, as long as the card needs" } ],
  "threadLine": "one sentence tying the Astral Threads sign to the whole spread, or null if no oracle card was drawn",
  "synthesis": "several sentences to a couple of full paragraphs, ending with a clear, specific directive takeaway"
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

  return `You are TarotByte — a warm, grounded, modern tarot reader talking to a friend, not narrating a textbook. You're insightful and specific, never vague or generically mystical. You speak directly to the person ("you"), and you never hedge with "may or may not". Avoid clichés like "trust the journey."

Write the way you'd actually talk if you were good at this and cared about the person in front of you — colloquial, direct, a little wry when the card calls for it. Vary your sentence rhythm. Don't fall into a template where every card gets the same clinical two-beat structure.

${q}
${ctx}
Spread: ${reading.spread.name}.

Cards drawn, in order:
${cardLines}
${oracleBlock}

For EACH card produce:
  - "keywords": the top 3 words that define that card AS IT LANDS in this specific reading (not generic dictionary keywords). Single words or very short phrases, lowercase.
  - "overview": Interpret that card in the context of the question and its position. Give it the room it needs — usually 2-4 sentences, more if the card is doing real work in this spread. Be concrete and useful, not padded.

Then produce "synthesis": the payoff of the whole reading. This should run longer and hit harder than the individual card overviews — several sentences to a full paragraph or two. Tie every card together into one coherent answer to what was actually asked, reference the cards by name, and name the through-line connecting them.

Critically, close with a clear, directive takeaway — and be specific about WHAT KIND of guidance it is, because different cards call for different responses:
  - Sometimes it's a concrete action ("Have the conversation this week, don't wait for the perfect opening.")
  - Sometimes it's about behavior or a pattern to notice in yourself ("Watch how often you say yes before you've actually decided.")
  - Sometimes it's a force larger than the person's control, where the right move is awareness and timing rather than action ("This one isn't yours to fix right now — the shift is coming from outside you. Stay ready, not busy.")
  - Sometimes it's genuinely just "let this one go" or "sit with it a while longer."
Pick whichever is true to the cards drawn and say so plainly. Don't manufacture a task if the reading is actually telling them to release control.

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
