/**
 * Logic tests for the reading engine.
 * Run: node scripts/test_reading_logic.mjs
 */
import { generateReading, SPREADS } from "../lib/readingEngine.js";

let failures = 0;
function check(name, cond, detail = "") {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    console.log(`  FAIL  ${name} ${detail}`);
    failures++;
  }
}

console.log("\n=== 1. Energy Shift is NEVER reversed (2000 draws) ===");
let shiftReversed = 0;
let shiftUprightFlag = 0;
let otherReversed = 0;
for (let i = 0; i < 2000; i++) {
  const r = generateReading({ spreadId: "energy-reading", context: "Love", tier: "Z" });
  const shift = r.cards[2];
  if (shift.reversed) shiftReversed++;
  if (shift.alwaysUpright) shiftUprightFlag++;
  if (r.cards[0].reversed || r.cards[1].reversed) otherReversed++;
}
check("shift card never reversed", shiftReversed === 0, `(got ${shiftReversed})`);
check("shift card flagged alwaysUpright", shiftUprightFlag === 2000, `(got ${shiftUprightFlag})`);
check("other positions still reverse normally", otherReversed > 1000, `(got ${otherReversed}/2000)`);

console.log("\n=== 2. Position 3 label is the directional one ===");
const spread = SPREADS["energy-reading"];
check("position 3 is 'shift'", spread.positions[2].key === "shift");
check("position 3 marked alwaysUpright", spread.positions[2].alwaysUpright === true);
check("positions 1-2 NOT alwaysUpright",
  !spread.positions[0].alwaysUpright && !spread.positions[1].alwaysUpright);

console.log("\n=== 3. Other spreads still allow reversals ===");
let ppfReversed = 0;
for (let i = 0; i < 500; i++) {
  const r = generateReading({ spreadId: "past-present-future", context: "Career", tier: "T" });
  if (r.cards.some((c) => c.reversed)) ppfReversed++;
}
check("past-present-future still reverses", ppfReversed > 300, `(got ${ppfReversed}/500)`);

console.log("\n=== 4. Structure integrity across all spreads/tiers ===");
for (const id of Object.keys(SPREADS)) {
  for (const tier of ["T", "Z", "D"]) {
    const r = generateReading({ spreadId: id, context: "General", tier });
    const s = SPREADS[id];
    check(`${id}/${tier}: correct card count`, r.cards.length === s.cards);
    check(`${id}/${tier}: every card has image`, r.cards.every((c) => !!c.image));
    check(`${id}/${tier}: no duplicate cards`,
      new Set(r.cards.map((c) => c.id)).size === r.cards.length);
    check(`${id}/${tier}: oracle presence matches spread`,
      s.usesOracle ? !!r.oracle : r.oracle === null);
    if (s.usesOracle) {
      check(`${id}/${tier}: oracle has image`, !!r.oracle.image);
    }
    check(`${id}/${tier}: interpretation non-empty`, r.interpretation.length > 0);
  }
}

console.log("\n=== 5. Yes/No verdict always produced ===");
const verdicts = new Set();
for (let i = 0; i < 300; i++) {
  const r = generateReading({ spreadId: "yes-no", tier: "T" });
  if (!r.verdict) { failures++; break; }
  verdicts.add(r.verdict);
}
check("verdict always present", true);
console.log(`  verdicts seen: ${[...verdicts].join(", ")}`);

console.log(`\n${failures === 0 ? "ALL TESTS PASSED" : `${failures} FAILURE(S)`}\n`);
process.exit(failures === 0 ? 0 : 1);
