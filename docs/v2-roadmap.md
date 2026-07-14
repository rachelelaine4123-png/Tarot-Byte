# TarotByte — v2 Roadmap

Captured from user UX feedback after the v1 naming + connected-box sprint.
These are the next-generation ideas the user envisioned. They are **not** in the
current build — this document exists so the vision isn't lost.

---

## 1. Animated connected-box layout (gears / mech-pipe)

**Current (v1):** Static connector lines link each card to its interpretation box.

**v2 vision:** The connector lines become animated — gears turning, mech-pipe
segments sliding into place, or energy flowing down the line when a card is
revealed. The feel is steampunk-clockwork: the reading "assembles" itself.

- Card reveal triggers a downward animation along the connector to the interp box
- Decan Engine activation could animate an extra gear layer clicking into place
- Subtle, not distracting — should feel mechanical and satisfying, not busy

## 2. Expandable interpretation layers

**Current (v1):** All layers (Classic / Astral Threads / Decan) show at once
based on tier.

**v2 vision:** Each interpretation box is expandable. The user sees the Classic
meaning first, then can expand to reveal the Astral Threads layer, then expand
again for the Decan Engine detail. This lets a reader control their own depth
without being overwhelmed.

- Collapsed by default at the user's current tier
- Smooth height transition on expand
- A small "go deeper" affordance on each box

## 3. Summary box with key influencers

**Current (v1):** The summary panel shows the verdict, astral weather, and
upsell/addon cards.

**v2 vision:** A dedicated "Key Influencers" box that surfaces the dominant
energies in the reading — the most significant planets, signs, and elements —
as a visual key. The user described it as "these are the key influencers in
your reading" with symbols/pictures.

- Pull the most-represented planet, sign, and element from the drawn cards
- Render as a row of glyphs (☉ ☽ ♀ ♂ ♃ ♄ / ♈ ♉ ♊ … / Fire Earth Air Water)
- Each glyph links to its meaning in the guide
- Gives the reader a quick visual scan of what's driving the reading

## 4. Symbols and pictures inline in interpretation text

**Current (v1):** Interpretation text is prose only.

**v2 vision:** The interpretation text weaves in the actual glyphs and card art
inline — a small planet glyph next to the planet name, a mini card thumbnail
in the interp box, the sign glyph beside the sign mention. Makes the reading
feel rich and illustrated rather than text-only.

- Inline planet glyphs (☉ ☽ ☿ ♀ ♂ ♃ ♄) next to planet mentions
- Inline sign glyphs (♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓) next to sign mentions
- Mini card art in the interpretation box header

## 5. Reading-level theme banner polish

**Current (v1):** A single "Your Focus" banner shows the selected context
(love, career, etc.) at the top of the summary.

**v2 vision:** The theme banner could be more prominent and carry through
visually — a subtle colored border or watermark on every interp box that
matches the theme, so the context is felt rather than just stated once.

---

## Implementation notes

- The connected-box layout CSS (`.reading-board`, `.connector-line`,
  `.interp-box`, etc.) is already in `globals.css` and ready to be enhanced
  with animations
- `celestialNarrative.js` already has `SIGN_QUALITIES`, `SUIT_MEANING`, and
  `COURT_PERSONA` maps — the key-influencers summary can derive from the same
  data
- The glyphs are already in `celestial.js` (`PLANET_GLYPH`, `SIGN_INFO` glyph
  fields) — inline rendering is a display-layer change, not a data change
- All v2 work should preserve the current T / Z / D tier ladder and credit model
