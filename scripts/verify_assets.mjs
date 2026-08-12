/**
 * Verify every card image referenced by the data model exists on disk,
 * and report the distinct aspect ratios so the UI can be matched to the art.
 *
 * Run: node scripts/verify_assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

/** Minimal PNG header reader: bytes 16-24 hold width/height big-endian. */
function pngSize(file) {
  const fd = fs.openSync(file, "r");
  const buf = Buffer.alloc(24);
  fs.readSync(fd, buf, 0, 24, 0);
  fs.closeSync(fd);
  if (buf.toString("ascii", 1, 4) !== "PNG") return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

async function main() {
  const { TAROT_DECK } = await import("../lib/tarotDeck.js");
  const { ASTRAL_THREADS } = await import("../lib/oracleDeck.js");

  const refs = [
    ...TAROT_DECK.map((c) => ({ group: "tarot", id: c.id, image: c.image })),
    ...ASTRAL_THREADS.map((c) => ({ group: "oracle", id: c.id, image: c.image })),
    { group: "oracle", id: "card-back", image: "/oracle/card-back.png" },
  ];

  let missing = 0;
  const sizes = new Map();

  for (const r of refs) {
    const file = path.join(PUBLIC, r.image);
    if (!fs.existsSync(file)) {
      console.log(`MISSING  ${r.group}/${r.id} -> ${r.image}`);
      missing++;
      continue;
    }
    const s = pngSize(file);
    if (s) {
      const key = `${r.group} ${s.w}x${s.h} (ratio ${(s.w / s.h).toFixed(3)})`;
      sizes.set(key, (sizes.get(key) || 0) + 1);
    }
  }

  // decan cards are referenced dynamically by celestial.js
  const decanDir = path.join(PUBLIC, "decan-cards");
  const decanFiles = fs.existsSync(decanDir)
    ? fs.readdirSync(decanDir).filter((f) => f.endsWith(".png"))
    : [];
  for (const f of decanFiles) {
    const s = pngSize(path.join(decanDir, f));
    if (s) {
      const key = `decan ${s.w}x${s.h} (ratio ${(s.w / s.h).toFixed(3)})`;
      sizes.set(key, (sizes.get(key) || 0) + 1);
    }
  }

  console.log(`\nchecked ${refs.length} referenced images, ${decanFiles.length} decan files`);
  console.log(`missing: ${missing}\n`);
  console.log("dimensions found:");
  for (const [k, v] of [...sizes.entries()].sort()) {
    console.log(`  ${v.toString().padStart(3)} x  ${k}`);
  }

  process.exit(missing > 0 ? 1 : 0);
}

main();
