# TarotByte — Decan Card Art Prompts v2
### Component-Based Generation System · 36 Cards · Canva / Gamma / Magic Media

---

## PART ONE: SYSTEM OVERVIEW

### What These Cards Are
Each of the 36 decan cards is a 10° slice of the zodiac — the engine behind TarotByte's deepest reading layer. They are **not tarot cards** — they are **astral reference objects** that overlay and deepen the meaning of a drawn tarot card. Think of them as the "why and when" behind the "what."

Each decan card carries:
- A **name** (TarotByte original IP)
- A **zodiac sign** + **decan number** (1, 2, or 3)
- A **ruling planet** (Golden Dawn system, public domain)
- An **element** (Fire / Water / Air / Earth)
- A **tarot card pairing** (the card this decan governs)
- A **color palette** keyed to sign + element
- A **visual scene** (the art prompt)

The cards are displayed as a compact reference orb/tile in the reading UI — **not** as full-screen cards. They sit alongside the main tarot card draw. This matters for generation: the art needs to read clearly at a **small size** (approx 160×220px rendered), with strong central focus and bold silhouettes. No fine detail in corners.

---

## PART TWO: THE MASTER STYLE BLOCK

**This is the DNA of the deck. Paste this at the START of every single prompt, before the SCENE line. Do not alter it between cards.**

```
MASTER STYLE BLOCK:

Tarot reference card, vertical 2:3 portrait, ornate Art Nouveau border with fine
brass-and-gold filigree and micro celestial symbols worked into the frame,
deep cosmic night sky background — pure midnight navy #0A0814 fading to deep
indigo #0D1340 — scattered with fine gold star-dust and faint constellation lines,
luminous accents in antique gold #C9A84C and arcane violet-cyan #7B6FD4,
painterly digital illustration, engraving-quality linework, no text, no lettering,
no words, no numbers, no roman numerals, no card titles.
```

**Why no text or numbers?** All labels (card name, sign glyph, planet symbol, element seal, decan number) are rendered by the TarotByte UI as overlaid components in consistent typography. The image layer is pure art. This also means the same image works across any future theme or language.

---

## PART THREE: THE COMPONENT LAYER SPEC
*(For your reference — these are the UI elements the app overlays on every card. You do NOT generate these in the image.)*

Each decan card in the UI has these overlaid components:

| Layer | Component | Position | Content |
|---|---|---|---|
| 1 | **Name badge** | Bottom center | Decan name in Cinzel Decorative, brass gold |
| 2 | **Zodiac glyph** | Top left corner | Sign Unicode symbol (♈♉♊...) |
| 3 | **Ruling planet glyph** | Top right corner | Planet Unicode symbol (☉☽♂♀...) |
| 4 | **Element seal** | Bottom left | Fire/Water/Air/Earth tiny icon |
| 5 | **Decan number** | Bottom right | I / II / III in roman numeral, small |
| 6 | **Orb indicator** | Top center | Small circular badge showing decan degree range (e.g. 0°–10°) |

These are **consistent across all 36 cards** — same position, same font, same size. The art underneath changes. That's the whole system.

---

## PART FOUR: PALETTE GUIDE BY ELEMENT + SIGN
*(Use these to color-correct any card that drifts. Append the PALETTE NOTE to the end of your prompt if needed.)*

### 🔥 FIRE — Wands (Aries, Leo, Sagittarius)
- **Sky base:** Deep midnight navy → ember-black horizon glow
- **Accent:** Warm amber-gold `#C9A84C`, smoldering crimson `#8B1A1A`, spark-orange `#D4632A`
- **Atmosphere:** Smoke, flame lick, heat haze, copper light from below
- **Palette note to append if drifting:** *"strict palette: midnight navy sky, warm amber gold, deep crimson, ember orange, no cool blues or greens"*

### 💧 WATER — Cups (Cancer, Scorpio, Pisces)
- **Sky base:** Deep midnight navy → moonlit silver on water surface
- **Accent:** Soft silver-pearl `#C8D8E8`, teal-cyan `#4A9B8E`, arcane violet `#6B4D8B`
- **Atmosphere:** Moonlight, still water reflections, mist, tide pools, deep ocean dark
- **Palette note to append if drifting:** *"strict palette: midnight navy sky, silver moonlight, teal water, arcane violet, no warm fire tones"*

### 🌬️ AIR — Swords (Libra, Aquarius, Gemini)
- **Sky base:** Deep midnight navy → pale violet-grey horizon, cold stars
- **Accent:** Pale silver `#D8D8E8`, cool lavender `#9B8FBF`, steel-blue `#5A7A9B`
- **Atmosphere:** Wind, storm clouds parting, lightning-edge light, exposed high ground
- **Palette note to append if drifting:** *"strict palette: midnight navy sky, pale silver, lavender, cold steel blue, sharp contrasts, no warm earth tones"*

### 🪨 EARTH — Pentacles (Capricorn, Taurus, Virgo)
- **Sky base:** Deep midnight navy → deep forest-green horizon or amber dusk
- **Accent:** Antique gold `#C9A84C`, amber-ochre `#9B7A2A`, forest green `#2A5A2A`
- **Atmosphere:** Candlelit workshops, moonlit gardens, golden lamplight, harvest dusk
- **Palette note to append if drifting:** *"strict palette: midnight navy sky, antique gold, amber ochre, deep forest green, warm lamplight, no cool grey or violet"*

---

## PART FIVE: GENERATION SETTINGS & WORKFLOW

### Settings in Canva / Gamma / Magic Media
- **Aspect ratio:** `2:3 portrait` (standard tarot: 400×600 or 512×768 or 1024×1536)
- **Style:** `Painterly illustration` or `Digital art` — avoid "photo" or "3D render"
- **Generate:** 4 variations per card, pick the best, regenerate drifters
- **Quality:** High / Max if the tool offers it

### Batch Size: Do 4–6 at a Time, Same Suit
The model stays stylistically warmer within a single session. Do **all 9 Fire cards** in one run, then all 9 Water, etc. This gives you better color and style cohesion within each suit than mixing signs.

**Recommended session order:**
1. 🔥 Fire — Wands (9 cards: Aries I/II/III, Leo I/II/III, Sagittarius I/II/III)
2. 💧 Water — Cups (9 cards: Cancer I/II/III, Scorpio I/II/III, Pisces I/II/III)
3. 🌬️ Air — Swords (9 cards: Libra I/II/III, Aquarius I/II/III, Gemini I/II/III)
4. 🪨 Earth — Pentacles (9 cards: Capricorn I/II/III, Taurus I/II/III, Virgo I/II/III)

### What to Watch For (Rejection Criteria)
Reject and regenerate any card that has:
- ❌ Text, numbers, or labels of any kind embedded in the art
- ❌ A daytime sky (blue sky + white clouds) — must be night or deep dusk
- ❌ Wrong element palette (e.g. Fire card with teal water tones)
- ❌ Art elements bleeding past the border into black padding
- ❌ No clear central focal point (must read at 160px wide)
- ❌ Corrupted or broken filigree border

### File Naming Convention
Save as: `decan-[sign]-[num]-[slug].png`
Examples:
- `decan-aries-1-the-first-move.png`
- `decan-scorpio-2-golden-return.png`
- `decan-virgo-3-lasting-legacy.png`

This matches the TarotByte file routing exactly.

---

## PART SIX: THE 36 DECAN PROMPTS

### HOW TO USE
For each card below:
1. Copy the **MASTER STYLE BLOCK** from Part Two
2. Add a line break, then paste `SCENE: [the scene text]`
3. Optionally append the suit's **palette note** from Part Four if you want tighter color control
4. Generate 4 variations, pick best

The **Component Summary** under each card is for your reference and for wiring into `tarotDeck.js` — it's not part of the prompt.

---

### 🔥 FIRE — Wands

---

#### THE FIRST MOVE
**Sign:** Aries · **Decan:** I (0°–10°) · **Ruling Planet:** Mars · **Element:** Fire
**Tarot pair:** Two of Wands · **Season window:** ~March 21–30

```
SCENE: a lone armored figure planting a burning torch into unbroken dark earth
at the edge of a vast unmapped terrain, a single red-gold flame erupting
upward, ember sparks rising into the midnight sky, dawn's faint amber glow
just cresting a distant horizon, sense of the first bold act in uncharted space.
```

*Component summary:* zodiac=♈ · planet=♂ · element=🔥 · decan=I · palette: ember-amber on navy

---

#### THE LONG LOOK
**Sign:** Aries · **Decan:** II (10°–20°) · **Ruling Planet:** Sun · **Element:** Fire
**Tarot pair:** Three of Wands · **Season window:** ~March 31–April 9

```
SCENE: a cloaked figure standing on a high dark cliff gripping a glowing staff,
gazing far across a vast golden-amber expanse toward three distant flame-lit
peaks on the horizon, warm solar light silhouetting the figure from behind,
sense of expansive vision and unstoppable forward momentum.
```

*Component summary:* zodiac=♈ · planet=☉ · element=🔥 · decan=II · palette: warm solar gold on navy

---

#### THE OPEN DOOR
**Sign:** Aries · **Decan:** III (20°–30°) · **Ruling Planet:** Venus · **Element:** Fire
**Tarot pair:** Four of Wands · **Season window:** ~April 10–19

```
SCENE: a garlanded archway of four glowing fire-staves wreathed in warm
golden firelight and copper-toned blossoms, lanterns of amber light floating
above a threshold just crossed, rose-gold light spilling through, a sense
of celebratory arrival and a foundation worth honoring.
```

*Component summary:* zodiac=♈ · planet=♀ · element=🔥 · decan=III · palette: rose-gold copper on navy

---

#### THE PROVING GROUND
**Sign:** Leo · **Decan:** I (120°–130°) · **Ruling Planet:** Saturn · **Element:** Fire
**Tarot pair:** Five of Wands · **Season window:** ~July 23–Aug 1

```
SCENE: five fire-staves crossed in disciplined combat training, sparks flying
where they meet, a carved lion crest glowing amber on the ground between them,
the night sky lit by the friction of practice rather than war, sense of useful
friction that forges mastery.
```

*Component summary:* zodiac=♌ · planet=♄ · element=🔥 · decan=I · palette: amber-crimson on deep navy

---

#### THE CLAIMED WIN
**Sign:** Leo · **Decan:** II (130°–140°) · **Ruling Planet:** Jupiter · **Element:** Fire
**Tarot pair:** Six of Wands · **Season window:** ~Aug 2–11

```
SCENE: a triumphant figure raised on a sunlit golden dais, a single blazing
staff held high overhead, a radiant sunburst halo of amber-gold light behind,
laurel wreath crown, an assembled silhouette of witnesses below, dignified
and earned, a genuine victory fully claimed.
```

*Component summary:* zodiac=♌ · planet=♃ · element=🔥 · decan=II · palette: radiant gold on deep navy

---

#### THE HELD LINE
**Sign:** Leo · **Decan:** III (140°–150°) · **Ruling Planet:** Mars · **Element:** Fire
**Tarot pair:** Seven of Wands · **Season window:** ~Aug 12–22

```
SCENE: a resolute figure on elevated ground holding one staff defensively
across their chest, amber flames rising from below, a lion crest on their
armor catching the firelight, a sense of standing firm from deep conviction
rather than aggression, holding a worthy position alone.
```

*Component summary:* zodiac=♌ · planet=♂ · element=🔥 · decan=III · palette: ember-crimson on dark navy

---

#### THE GREEN LIGHT
**Sign:** Sagittarius · **Decan:** I (240°–250°) · **Ruling Planet:** Mercury · **Element:** Fire
**Tarot pair:** Eight of Wands · **Season window:** ~Nov 22–Dec 1

```
SCENE: eight glowing fire-staves streaking like blazing comets in swift
parallel flight across a deep navy night sky, trailing gold and amber sparks,
an archer's arrows of pure light and momentum, a sense of unstoppable fast
news and a green light suddenly opening wide.
```

*Component summary:* zodiac=♐ · planet=☿ · element=🔥 · decan=I · palette: gold-fire streaks on deep navy

---

#### THE LAST PUSH
**Sign:** Sagittarius · **Decan:** II (250°–260°) · **Ruling Planet:** Moon · **Element:** Fire
**Tarot pair:** Nine of Wands · **Season window:** ~Dec 2–11

```
SCENE: a weary but steel-eyed figure leaning on a single staff, eight upright
staves behind them like a guard at their back, silver moonlight casting long
shadows, bandaged but alert and unbroken, a sense of raw instinct and one
final summoning of will before the finish line.
```

*Component summary:* zodiac=♐ · planet=☽ · element=🔥 · decan=II · palette: moonlit silver on dark navy

---

#### THE CHOSEN LOAD
**Sign:** Sagittarius · **Decan:** III (260°–270°) · **Ruling Planet:** Saturn · **Element:** Fire
**Tarot pair:** Ten of Wands · **Season window:** ~Dec 12–21

```
SCENE: a figure with back bent carrying a bound bundle of ten fire-staves
along a dark road toward a single lit tower window in the distance, dusk-to-
midnight sky, heavy but purposeful steps, a real dream carried at real cost,
sense of a burden chosen and still worth carrying.
```

*Component summary:* zodiac=♐ · planet=♄ · element=🔥 · decan=III · palette: ember-amber lantern glow on navy

---

### 💧 WATER — Cups

---

#### THE KEPT PROMISE
**Sign:** Cancer · **Decan:** I (90°–100°) · **Ruling Planet:** Venus · **Element:** Water
**Tarot pair:** Two of Cups · **Season window:** ~June 21–July 1

```
SCENE: two ornate silver chalices raised toward each other above a calm
moonlit tide pool, a soft luminous caduceus of light rising between them,
pale reflections on still water below, a sense of tender mutual recognition
and a bond that wants safety above all.
```

*Component summary:* zodiac=♋ · planet=♀ · element=💧 · decan=I · palette: silver-pearl on midnight navy

---

#### THE NAMED JOY
**Sign:** Cancer · **Decan:** II (100°–110°) · **Ruling Planet:** Mercury · **Element:** Water
**Tarot pair:** Three of Cups · **Season window:** ~July 2–11

```
SCENE: three ornate chalices lifted together in a warm circle on a moonlit
shore, ribbons of silver-teal light connecting them in a flowing braid,
three figures half-visible in the glow, a sense of chosen-family celebration
and joy spoken aloud rather than kept private.
```

*Component summary:* zodiac=♋ · planet=☿ · element=💧 · decan=II · palette: teal-silver on deep navy

---

#### THE MISSED OFFER
**Sign:** Cancer · **Decan:** III (110°–120°) · **Ruling Planet:** Moon · **Element:** Water
**Tarot pair:** Four of Cups · **Season window:** ~July 12–22

```
SCENE: a lone figure seated at the water's edge on dark rock, gaze turned
inward or away, three chalices beside them on the shore, a fourth glowing
cup offered from a hand emerging from silver mist — the offering not yet
seen, a sense of a gift present but not received.
```

*Component summary:* zodiac=♋ · planet=☽ · element=💧 · decan=III · palette: silver moonlight on deep navy-black

---

#### THE HONEST GRIEF
**Sign:** Scorpio · **Decan:** I (210°–220°) · **Ruling Planet:** Mars · **Element:** Water
**Tarot pair:** Five of Cups · **Season window:** ~Oct 23–Nov 1

```
SCENE: a cloaked figure standing before three dark chalices spilled and
emptied on dark wet stone, two chalices still upright and glowing behind
them, a single cold shaft of light breaking through deep indigo water-clouds,
a sense of grief acknowledged with teeth — the eyes already turning toward
what still stands.
```

*Component summary:* zodiac=♏ · planet=♂ · element=💧 · decan=I · palette: deep violet-indigo, cold silver on navy

---

#### THE GOLDEN RETURN
**Sign:** Scorpio · **Decan:** II (220°–230°) · **Ruling Planet:** Sun · **Element:** Water
**Tarot pair:** Six of Cups · **Season window:** ~Nov 2–11

```
SCENE: an ancient ornate chalice overflowing with luminous golden flowers
caught in warm amber-gold light, floating above still dark water, soft
nostalgic warmth radiating from the cup itself, memory made radiant,
a sense of tenderness and innocent kindness returning from a long way away.
```

*Component summary:* zodiac=♏ · planet=☉ · element=💧 · decan=II · palette: warm amber-gold on dark water navy

---

#### THE CLEAR-EYED CHOICE
**Sign:** Scorpio · **Decan:** III (230°–240°) · **Ruling Planet:** Venus · **Element:** Water
**Tarot pair:** Seven of Cups · **Season window:** ~Nov 12–21

```
SCENE: seven ornate chalices hovering in shimmering violet-teal mist, each
containing a different luminous vision — a jewel, a laurel crown, a veiled
silhouette, a serpent, a tower, a wealth of coins, a glowing orb — one chalice
among them lit differently, more quietly true, a sense of choosing clearly
with open eyes rather than desire.
```

*Component summary:* zodiac=♏ · planet=♀ · element=💧 · decan=III · palette: violet-teal mist on deep navy

---

#### THE QUIET DEPARTURE
**Sign:** Pisces · **Decan:** I (330°–340°) · **Ruling Planet:** Saturn · **Element:** Water
**Tarot pair:** Eight of Cups · **Season window:** ~Feb 19–Feb 28

```
SCENE: a solitary cloaked figure walking away from eight stacked chalices
toward dark open water under a waning crescent moon, calm and unhurried,
footprints in the wet sand catching the moonlight, a sense of disciplined
release — leaving behind what was real but is no longer enough.
```

*Component summary:* zodiac=♓ · planet=♄ · element=💧 · decan=I · palette: pale silver-grey on deep midnight navy

---

#### THE GRANTED WISH
**Sign:** Pisces · **Decan:** II (340°–350°) · **Ruling Planet:** Jupiter · **Element:** Water
**Tarot pair:** Nine of Cups · **Season window:** ~Mar 1–10

```
SCENE: a contented figure seated before nine luminous chalices arranged in
an arc of golden-pearl light over still dark water, the cups overflowing softly,
an expression of quiet, genuine fulfillment, a sense of a heartfelt wish
that has arrived exactly as hoped without any asterisks.
```

*Component summary:* zodiac=♓ · planet=♃ · element=💧 · decan=II · palette: warm gold-pearl on deep navy

---

#### THE GUARDED HOME
**Sign:** Pisces · **Decan:** III (350°–360°) · **Ruling Planet:** Mars · **Element:** Water
**Tarot pair:** Ten of Cups · **Season window:** ~Mar 11–20

```
SCENE: ten radiant chalices forming a luminous rainbow arc across a midnight
sky over a small warm-lit dwelling beside dark water, a guardian figure
standing watch with open arms below the arc, a sense of love that has
become a home worth standing in front of.
```

*Component summary:* zodiac=♓ · planet=♂ · element=💧 · decan=III · palette: rainbow pearl arc on midnight navy

---

### 🌬️ AIR — Swords

---

#### THE LIFTED VEIL
**Sign:** Libra · **Decan:** I (180°–190°) · **Ruling Planet:** Moon · **Element:** Air
**Tarot pair:** Two of Swords · **Season window:** ~Sept 23–Oct 2

```
SCENE: a blindfolded figure seated on pale stone with two crossed silver
swords, the blindfold beginning to lift and loosen, balanced scales of
cold pale light hovering on either side, a moonlit open sea stretching
behind, a sense of an honest choice finally being faced without avoidance.
```

*Component summary:* zodiac=♎ · planet=☽ · element=🌬️ · decan=I · palette: cold silver-pale on deep midnight navy

---

#### THE CLEARING CUT
**Sign:** Libra · **Decan:** II (190°–200°) · **Ruling Planet:** Saturn · **Element:** Air
**Tarot pair:** Three of Swords · **Season window:** ~Oct 3–12

```
SCENE: three silver swords passing cleanly and precisely through a luminous
heart-shaped cloud that is dissolving into silver rain, the sky clearing above
as the clouds part, structured and decisive rather than cruel, a sense of
a truth that clarifies and ultimately heals rather than simply wounds.
```

*Component summary:* zodiac=♎ · planet=♄ · element=🌬️ · decan=II · palette: steel-silver, clearing sky on navy

---

#### THE EARNED REST
**Sign:** Libra · **Decan:** III (200°–210°) · **Ruling Planet:** Jupiter · **Element:** Air
**Tarot pair:** Four of Swords · **Season window:** ~Oct 13–22

```
SCENE: a serene armored figure lying in full repose beneath three suspended
silver swords above, one sword laid beneath them, soft cathedral-window
light filtering down in cool lavender-gold beams, absolute stillness,
a sense of rest that has been genuinely earned and is generously taken.
```

*Component summary:* zodiac=♎ · planet=♃ · element=🌬️ · decan=III · palette: lavender-gold cathedral light on navy

---

#### THE COSTLY WIN
**Sign:** Aquarius · **Decan:** I (300°–310°) · **Ruling Planet:** Venus · **Element:** Air
**Tarot pair:** Five of Swords · **Season window:** ~Jan 20–29

```
SCENE: a solitary figure gathering scattered silver swords under a cold
windswept violet-grey sky, two other figures walking away in the distance
with heads bowed, hollow victory, the cost visible in the posture of those
leaving, a sense of a win that came at a price to those who trusted.
```

*Component summary:* zodiac=♒ · planet=♀ · element=🌬️ · decan=I · palette: cold violet-grey on deep navy

---

#### THE CALMER CROSSING
**Sign:** Aquarius · **Decan:** II (310°–320°) · **Ruling Planet:** Mercury · **Element:** Air
**Tarot pair:** Six of Swords · **Season window:** ~Jan 30–Feb 8

```
SCENE: a small wooden boat carrying a cloaked figure and six upright silver
swords gliding silently across still dark water toward a calm far shore
just visible in cold blue-silver light, a thoughtful crossing in progress,
a sense of carrying the lesson and deliberately leaving the weight behind.
```

*Component summary:* zodiac=♒ · planet=☿ · element=🌬️ · decan=II · palette: cold blue-silver water on midnight navy

---

#### THE QUIET MOVE
**Sign:** Aquarius · **Decan:** III (320°–330°) · **Ruling Planet:** Moon · **Element:** Air
**Tarot pair:** Seven of Swords · **Season window:** ~Feb 9–18

```
SCENE: a lone figure moving carefully through silver moonlit mist carrying
several swords with deliberate quiet, pale stars above, a strategic detour
through unmarked territory, a sense of solo action that requires both
intelligence and honesty to execute without becoming deception.
```

*Component summary:* zodiac=♒ · planet=☽ · element=🌬️ · decan=III · palette: moonlit silver-mist on deep navy

---

#### THE LOOSENED CAGE
**Sign:** Gemini · **Decan:** I (60°–70°) · **Ruling Planet:** Jupiter · **Element:** Air
**Tarot pair:** Eight of Swords · **Season window:** ~May 21–31

```
SCENE: a lightly bound standing figure surrounded by eight silver swords
planted in the earth in a loose circle, the fabric bindings visibly loosening
and one sword beginning to lift away on its own, cold dawn light breaking
at the horizon, a sense of a mental trap whose door has always been open
and is now finally noticed.
```

*Component summary:* zodiac=♊ · planet=♃ · element=🌬️ · decan=I · palette: cold dawn silver on deep navy

---

#### THE NAMED FEAR
**Sign:** Gemini · **Decan:** II (70°–80°) · **Ruling Planet:** Mars · **Element:** Air
**Tarot pair:** Nine of Swords · **Season window:** ~June 1–10

```
SCENE: a figure sitting upright in the dark, hands open, nine silver swords
arranged on the wall above as luminous lines, the figure holds a piece of
parchment on which anxious shadows have been written down and are now
dissolving into fading smoke, a sense of fear named and therefore disarmed.
```

*Component summary:* zodiac=♊ · planet=♂ · element=🌬️ · decan=II · palette: dark indigo, cold silver on deep navy

---

#### THE CLEAN ENDING
**Sign:** Gemini · **Decan:** III (80°–90°) · **Ruling Planet:** Sun · **Element:** Air
**Tarot pair:** Ten of Swords · **Season window:** ~June 11–20

```
SCENE: ten silver swords laid to rest along a dark still horizon, points
toward the earth, as a clear gold-white sun rises behind distant hills,
the night fully spent and acknowledged, no avoidance, a painful chapter
fully witnessed with the new dawn already present and unhurried.
```

*Component summary:* zodiac=♊ · planet=☉ · element=🌬️ · decan=III · palette: cold silver at rest, gold dawn on navy-black

---

### 🪨 EARTH — Pentacles

---

#### THE KEPT RHYTHM
**Sign:** Capricorn · **Decan:** I (270°–280°) · **Ruling Planet:** Jupiter · **Element:** Earth
**Tarot pair:** Two of Pentacles · **Season window:** ~Dec 22–31

```
SCENE: a poised figure in amber candlelight juggling two glowing golden
pentacle coins linked by a luminous infinity ribbon of light, steady ships
navigating a dark stormy sea behind, a sense of many demands held with
natural grace rather than strain, rhythm mastered.
```

*Component summary:* zodiac=♑ · planet=♃ · element=🪨 · decan=I · palette: amber-gold lamplight on deep navy

---

#### THE FIRST PROOF
**Sign:** Capricorn · **Decan:** II (280°–290°) · **Ruling Planet:** Mars · **Element:** Earth
**Tarot pair:** Three of Pentacles · **Season window:** ~Jan 1–9

```
SCENE: an artisan's hands carving the third glowing golden pentacle into
a cathedral stone archway, warm workshop lantern light, two collaborators
nearby reviewing a blueprint spread on dark stone, a sense of early skilled
proof of craft recognized and building toward something real.
```

*Component summary:* zodiac=♑ · planet=♂ · element=🪨 · decan=II · palette: warm amber workshop on deep navy

---

#### THE OPEN GRIP
**Sign:** Capricorn · **Decan:** III (290°–300°) · **Ruling Planet:** Sun · **Element:** Earth
**Tarot pair:** Four of Pentacles · **Season window:** ~Jan 10–19

```
SCENE: a crowned figure seated before a golden city skyline, holding four
radiant gold pentacle coins — the arms beginning to open slightly rather
than clutch, warm solar light on the face, a sense of security so genuine
it no longer needs to hoard, treasure held with an open hand.
```

*Component summary:* zodiac=♑ · planet=☉ · element=🪨 · decan=III · palette: warm gold city-glow on midnight navy

---

#### THE REACHED HAND
**Sign:** Taurus · **Decan:** I (30°–40°) · **Ruling Planet:** Mercury · **Element:** Earth
**Tarot pair:** Five of Pentacles · **Season window:** ~April 20–29

```
SCENE: two travelers in cold blue-silver snow passing a glowing amber
stained-glass window in which five pentacle symbols shine warm gold,
one traveler extending a hand toward the other in the dark, warm light
within reach, a sense of aid much closer than despair makes it feel.
```

*Component summary:* zodiac=♉ · planet=☿ · element=🪨 · decan=I · palette: cold blue-snow contrast with amber warmth on navy

---

#### THE FAIR EXCHANGE
**Sign:** Taurus · **Decan:** II (40°–50°) · **Ruling Planet:** Moon · **Element:** Earth
**Tarot pair:** Six of Pentacles · **Season window:** ~April 30–May 9

```
SCENE: a generous figure holding balanced golden scales in warm moonlight,
six glowing pentacle coins arranged in a gentle arc, two kneeling figures
receiving with open hands below, a sense of safe mutual generosity where
the giving and receiving are equally honored.
```

*Component summary:* zodiac=♉ · planet=☽ · element=🪨 · decan=II · palette: warm silver-gold moonlight on navy

---

#### THE PATIENT TEND
**Sign:** Taurus · **Decan:** III (50°–60°) · **Ruling Planet:** Saturn · **Element:** Earth
**Tarot pair:** Seven of Pentacles · **Season window:** ~May 10–20

```
SCENE: a farmer leaning on a hoe in amber dusk light, patiently regarding
a dark vine heavy with seven ripening glowing golden pentacles, earth-tone
twilight, the crop not yet ready, a sense of deep investment ripening at
its own pace on the earth's schedule, not the farmer's.
```

*Component summary:* zodiac=♉ · planet=♄ · element=🪨 · decan=III · palette: amber-earth dusk on deep navy

---

#### THE DEVOTED CRAFT
**Sign:** Virgo · **Decan:** I (150°–160°) · **Ruling Planet:** Sun · **Element:** Earth
**Tarot pair:** Eight of Pentacles · **Season window:** ~Aug 23–Sept 1

```
SCENE: a craftsman bent over a workbench in warm lamplight, carving the
eighth of eight identical glowing golden pentacles with meticulous care,
seven completed pieces displayed behind, tools arranged precisely, a sense
of devoted mastery where the process is the reward as much as the product.
```

*Component summary:* zodiac=♍ · planet=☉ · element=🪨 · decan=I · palette: warm lamplight amber on deep navy

---

#### THE EARNED COMFORT
**Sign:** Virgo · **Decan:** II (160°–170°) · **Ruling Planet:** Venus · **Element:** Earth
**Tarot pair:** Nine of Pentacles · **Season window:** ~Sept 2–11

```
SCENE: an elegant solitary figure in a lush moonlit garden, golden pentacle
coins resting among flowering vines to either side, a hooded falcon perched
on the wrist, distant estate architecture in deep blue dark, a sense of
independent self-made abundance enjoyed without apology.
```

*Component summary:* zodiac=♍ · planet=♀ · element=🪨 · decan=II · palette: gold-garden amber on midnight navy

---

#### THE LASTING LEGACY
**Sign:** Virgo · **Decan:** III (170°–180°) · **Ruling Planet:** Mercury · **Element:** Earth
**Tarot pair:** Ten of Pentacles · **Season window:** ~Sept 12–22

```
SCENE: a multigenerational family gathered beneath a stone archway glowing
with ten golden pentacle symbols, an ancestral estate visible beyond in
deep navy moonlight, a small leather ledger and ring of keys in the foreground,
a sense of lasting wealth that lives in careful tended details.
```

*Component summary:* zodiac=♍ · planet=☿ · element=🪨 · decan=III · palette: antique gold-amber on deep navy

---

## PART SEVEN: FULL PROMPT EXAMPLE (copy-paste ready)

Here is a complete assembled prompt for **The First Move**, ready to paste directly:

```
Tarot reference card, vertical 2:3 portrait, ornate Art Nouveau border with fine
brass-and-gold filigree and micro celestial symbols worked into the frame,
deep cosmic night sky background — pure midnight navy #0A0814 fading to deep
indigo #0D1340 — scattered with fine gold star-dust and faint constellation lines,
luminous accents in antique gold #C9A84C and arcane violet-cyan #7B6FD4,
painterly digital illustration, engraving-quality linework, no text, no lettering,
no words, no numbers, no roman numerals, no card titles.

SCENE: a lone armored figure planting a burning torch into unbroken dark earth
at the edge of a vast unmapped terrain, a single red-gold flame erupting
upward, ember sparks rising into the midnight sky, dawn's faint amber glow
just cresting a distant horizon, sense of the first bold act in uncharted space.
```

---

## PART EIGHT: QUICK REFERENCE TABLE — All 36 Decans

| # | Name | Sign | Decan | Planet | Element | Tarot Pair | File Name |
|---|---|---|---|---|---|---|---|
| 1 | The First Move | Aries | I | ♂ Mars | 🔥 | Two of Wands | decan-aries-1-first-move.png |
| 2 | The Long Look | Aries | II | ☉ Sun | 🔥 | Three of Wands | decan-aries-2-long-look.png |
| 3 | The Open Door | Aries | III | ♀ Venus | 🔥 | Four of Wands | decan-aries-3-open-door.png |
| 4 | The Proving Ground | Leo | I | ♄ Saturn | 🔥 | Five of Wands | decan-leo-1-proving-ground.png |
| 5 | The Claimed Win | Leo | II | ♃ Jupiter | 🔥 | Six of Wands | decan-leo-2-claimed-win.png |
| 6 | The Held Line | Leo | III | ♂ Mars | 🔥 | Seven of Wands | decan-leo-3-held-line.png |
| 7 | The Green Light | Sagittarius | I | ☿ Mercury | 🔥 | Eight of Wands | decan-sagittarius-1-green-light.png |
| 8 | The Last Push | Sagittarius | II | ☽ Moon | 🔥 | Nine of Wands | decan-sagittarius-2-last-push.png |
| 9 | The Chosen Load | Sagittarius | III | ♄ Saturn | 🔥 | Ten of Wands | decan-sagittarius-3-chosen-load.png |
| 10 | The Kept Promise | Cancer | I | ♀ Venus | 💧 | Two of Cups | decan-cancer-1-kept-promise.png |
| 11 | The Named Joy | Cancer | II | ☿ Mercury | 💧 | Three of Cups | decan-cancer-2-named-joy.png |
| 12 | The Missed Offer | Cancer | III | ☽ Moon | 💧 | Four of Cups | decan-cancer-3-missed-offer.png |
| 13 | The Honest Grief | Scorpio | I | ♂ Mars | 💧 | Five of Cups | decan-scorpio-1-honest-grief.png |
| 14 | The Golden Return | Scorpio | II | ☉ Sun | 💧 | Six of Cups | decan-scorpio-2-golden-return.png |
| 15 | The Clear-Eyed Choice | Scorpio | III | ♀ Venus | 💧 | Seven of Cups | decan-scorpio-3-clear-eyed-choice.png |
| 16 | The Quiet Departure | Pisces | I | ♄ Saturn | 💧 | Eight of Cups | decan-pisces-1-quiet-departure.png |
| 17 | The Granted Wish | Pisces | II | ♃ Jupiter | 💧 | Nine of Cups | decan-pisces-2-granted-wish.png |
| 18 | The Guarded Home | Pisces | III | ♂ Mars | 💧 | Ten of Cups | decan-pisces-3-guarded-home.png |
| 19 | The Lifted Veil | Libra | I | ☽ Moon | 🌬️ | Two of Swords | decan-libra-1-lifted-veil.png |
| 20 | The Clearing Cut | Libra | II | ♄ Saturn | 🌬️ | Three of Swords | decan-libra-2-clearing-cut.png |
| 21 | The Earned Rest | Libra | III | ♃ Jupiter | 🌬️ | Four of Swords | decan-libra-3-earned-rest.png |
| 22 | The Costly Win | Aquarius | I | ♀ Venus | 🌬️ | Five of Swords | decan-aquarius-1-costly-win.png |
| 23 | The Calmer Crossing | Aquarius | II | ☿ Mercury | 🌬️ | Six of Swords | decan-aquarius-2-calmer-crossing.png |
| 24 | The Quiet Move | Aquarius | III | ☽ Moon | 🌬️ | Seven of Swords | decan-aquarius-3-quiet-move.png |
| 25 | The Loosened Cage | Gemini | I | ♃ Jupiter | 🌬️ | Eight of Swords | decan-gemini-1-loosened-cage.png |
| 26 | The Named Fear | Gemini | II | ♂ Mars | 🌬️ | Nine of Swords | decan-gemini-2-named-fear.png |
| 27 | The Clean Ending | Gemini | III | ☉ Sun | 🌬️ | Ten of Swords | decan-gemini-3-clean-ending.png |
| 28 | The Kept Rhythm | Capricorn | I | ♃ Jupiter | 🪨 | Two of Pentacles | decan-capricorn-1-kept-rhythm.png |
| 29 | The First Proof | Capricorn | II | ♂ Mars | 🪨 | Three of Pentacles | decan-capricorn-2-first-proof.png |
| 30 | The Open Grip | Capricorn | III | ☉ Sun | 🪨 | Four of Pentacles | decan-capricorn-3-open-grip.png |
| 31 | The Reached Hand | Taurus | I | ☿ Mercury | 🪨 | Five of Pentacles | decan-taurus-1-reached-hand.png |
| 32 | The Fair Exchange | Taurus | II | ☽ Moon | 🪨 | Six of Pentacles | decan-taurus-2-fair-exchange.png |
| 33 | The Patient Tend | Taurus | III | ♄ Saturn | 🪨 | Seven of Pentacles | decan-taurus-3-patient-tend.png |
| 34 | The Devoted Craft | Virgo | I | ☉ Sun | 🪨 | Eight of Pentacles | decan-virgo-1-devoted-craft.png |
| 35 | The Earned Comfort | Virgo | II | ♀ Venus | 🪨 | Nine of Pentacles | decan-virgo-2-earned-comfort.png |
| 36 | The Lasting Legacy | Virgo | III | ☿ Mercury | 🪨 | Ten of Pentacles | decan-virgo-3-lasting-legacy.png |

---

## PART NINE: REJECTION CHEAT SHEET

Post this near your workspace while generating:

```
❌ REJECT IF:
  — Any text, numbers, or letters visible anywhere in the art
  — Daytime sky (blue sky, white fluffy clouds, sunlight from above)
  — Wrong suit palette (e.g. warm fire tones on a Water card)
  — Art bleeds outside the border into black padding
  — No clear strong central focal point (test: squint — can you read it?)
  — Broken, asymmetric, or corrupt filigree border

✅ KEEP IF:
  — Deep midnight navy background, night sky, stars
  — Strong single focal subject centered and bold
  — Gold/brass border with fine filigree intact on all four sides
  — Suit-appropriate atmospheric palette
  — No text anywhere
  — Reads clearly as a small thumbnail
```

---

*TarotByte · Astral Threads IP · Decan Art System v2*
*Master style, component spec, palette guide, 36 scene prompts, rejection criteria*
