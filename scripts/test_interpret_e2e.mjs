/**
 * End-to-end test of /api/interpret against a running dev/prod server.
 * Runs several realistic reading scenarios and validates the response shape.
 *
 * Run: node scripts/test_interpret_e2e.mjs [baseUrl]
 */
import { generateReading } from "../lib/readingEngine.js";

const BASE = process.argv[2] || "http://localhost:3000";

const SCENARIOS = [
  { name: "Yes/No · guest · T", spreadId: "yes-no", tier: "T", context: null,
    question: "Should I take the job offer in another city?" },
  { name: "Past/Present/Future · Career · T", spreadId: "past-present-future", tier: "T",
    context: "Career", question: "Why does my career feel stuck?" },
  { name: "Energy Reading · Love · Z (oracle)", spreadId: "energy-reading", tier: "Z",
    context: "Love", question: "Is this relationship worth repairing?" },
  { name: "Energy Reading · Fortune · D (decans)", spreadId: "energy-reading", tier: "D",
    context: "Fortune", question: "Will my finances improve this year?" },
  { name: "Energy Reading · no question", spreadId: "energy-reading", tier: "Z",
    context: "General", question: "" },
];

let failures = 0;
function check(name, cond, detail = "") {
  if (cond) console.log(`    PASS  ${name}`);
  else { console.log(`    FAIL  ${name} ${detail}`); failures++; }
}

async function run() {
  for (const s of SCENARIOS) {
    console.log(`\n=== ${s.name} ===`);
    const reading = generateReading({ spreadId: s.spreadId, context: s.context, tier: s.tier });

    const t0 = Date.now();
    let data;
    try {
      const res = await fetch(`${BASE}/api/interpret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reading, question: s.question }),
      });
      data = await res.json();
      console.log(`    (${res.status}, ${((Date.now() - t0) / 1000).toFixed(1)}s, source=${data.source})`);
    } catch (e) {
      console.log(`    FAIL  request threw: ${e.message}`);
      failures++;
      continue;
    }

    check("one entry per card", data.cards?.length === reading.cards.length,
      `(got ${data.cards?.length} vs ${reading.cards.length})`);
    check("every card has 1-3 keywords",
      data.cards?.every((c) => c.keywords.length >= 1 && c.keywords.length <= 3));
    // Overviews are now colloquial and card-weight-dependent (~2-4 sentences
    // typically), not hard-capped at 2 — just sanity-check they're not empty
    // and not runaway-long.
    check("every overview is 1-6 sentences",
      data.cards?.every((c) => {
        const n = (c.overview.match(/[.!?]+/g) || []).length;
        return n >= 1 && n <= 6;
      }),
      `(counts: ${data.cards?.map((c) => (c.overview.match(/[.!?]+/g) || []).length).join(",")})`);
    // Synthesis should run noticeably longer now that it's meant to be the
    // payoff of the reading, not a one-liner recap.
    check("synthesis is substantial", (data.synthesis?.length || 0) > 350,
      `(len ${data.synthesis?.length})`);
    if (reading.oracle) {
      check("threadLine present when oracle drawn", !!data.threadLine);
    } else {
      check("threadLine null when no oracle", data.threadLine === null || !data.threadLine);
    }

    // Show a sample so we can eyeball quality
    const c0 = data.cards?.[0];
    if (c0) {
      console.log(`    e.g. ${reading.cards[0].position} — ${reading.cards[0].name}${reading.cards[0].reversed ? " (rev)" : ""}`);
      console.log(`         keywords: ${c0.keywords.join(" · ")}`);
      console.log(`         overview: ${c0.overview}`);
    }
    if (data.threadLine) console.log(`    thread: ${data.threadLine}`);
    if (data.synthesis) console.log(`    synth : ${data.synthesis.slice(0, 260)}…`);
  }

  console.log(`\n${failures === 0 ? "ALL E2E TESTS PASSED" : `${failures} FAILURE(S)`}\n`);
  process.exit(failures === 0 ? 0 : 1);
}

run();
