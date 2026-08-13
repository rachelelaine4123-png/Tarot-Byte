/**
 * Verifies tier -> deck art resolution against the assets actually on disk.
 * Run: node scripts/verify_deck_art.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const src = fs.readFileSync(path.join(root, "lib/deckArt.js"), "utf8");
const mod = await import(
  "data:text/javascript," + encodeURIComponent(src.replace(/^export default .*$/m, ""))
);
const { usesT2, backImageForTier, cardImageForTier } = mod;

const deckSrc = fs.readFileSync(path.join(root, "lib/tarotDeck.js"), "utf8");
const majorIds = [...deckSrc.matchAll(/id:\s*"([^"]+)",\s*name:[^}]*?arcana:\s*"major"/g)].map(m => m[1]);

const majors = majorIds.map(id => ({ id, arcana: "major", image: `/tarot-cards/${id}.png`, name: id }));
const minors = ["ace-of-cups", "king-of-swords", "seven-of-pentacles"].map(id => ({
  id, arcana: "minor", image: `/tarot-cards/${id}.png`, name: id,
}));

let fail = 0;
const check = (label, cond) => { if (!cond) { console.log("  FAIL:", label); fail++; } };
const exists = p => fs.existsSync(path.join(root, "public", p.replace(/^\//, "")));

console.log("majors found in deck:", majors.length);

console.log("\n[T tier] -> T1 art + T1 back");
check("back is T1", backImageForTier("T") === "/oracle/card-back.png");
check("T1 back exists", exists(backImageForTier("T")));
for (const c of [...majors, ...minors]) {
  check(`${c.id} stays T1`, cardImageForTier(c, "T") === c.image);
}

for (const tier of ["Z", "D"]) {
  console.log(`\n[${tier} tier] -> T2 majors, T1 minors, T2 back`);
  check("usesT2", usesT2(tier));
  check("back is T2", backImageForTier(tier) === "/t2-cards/card-back.png");
  check("T2 back exists on disk", exists(backImageForTier(tier)));
  for (const c of majors) {
    const got = cardImageForTier(c, tier);
    check(`${c.id} -> t2 path`, got === `/t2-cards/${c.id}.png`);
    check(`${c.id} art exists on disk`, exists(got));
  }
  for (const c of minors) {
    check(`${c.id} FALLS BACK to T1`, cardImageForTier(c, tier) === c.image);
  }
}

console.log("\n[edge cases]");
check("undefined tier -> T1", backImageForTier(undefined) === "/oracle/card-back.png");
check("null card safe", cardImageForTier(null, "Z") === undefined);
check("card without image safe", cardImageForTier({ id: "x", arcana: "major" }, "Z") === undefined);

console.log(fail === 0 ? "\nALL CHECKS PASSED" : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
