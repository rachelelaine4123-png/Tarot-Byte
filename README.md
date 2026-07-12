# TarotByte ✦

A traditional tarot reading site with a celestial twist. Every card sits at a real astrological address — TarotByte reveals it through a three-tier reading ladder.

**Live domain:** [tarotbyte.app](https://tarotbyte.app) *(deploy in progress)*

---

## The Reading Ladder (T / Z / D)

| Tier | Name | What it reveals | Access |
|------|------|-----------------|--------|
| **T** | **Classic** | The cards and their timeless meaning | Free |
| **Z** | **Celestial** | Each card's zodiac sign & ruling planet | Free member (email signup) |
| **D** | **The Decan Engine** | The exact 10° celestial degree behind every card — with a named decan | Add-on ($2 member / $4 list) or subscription |

The **Decan Engine** maps each of the 36 numbered pip cards to one of the 36 zodiac decans (Golden Dawn / Chaldean system) and surfaces an original, action-oriented **decan name** (e.g. Six of Cups → *The Golden Return*, Scorpio Decan II). Cards without a single decan (Aces, Majors, Courts) read as **amplified** rather than precise — Majors as fate, Minors as choices.

## Features
- Two free readings: **Yes/No** and **3-card Past · Present · Future** (Love / Fortune / Career focus)
- Signature **Energy Reading** (You · Current Energy · Outcome) clarified by an original **Astral Threads** card
- **The Weekly Byte** newsletter signup
- Original 12-sign Astral Threads deck (100% original IP)
- 36 named decans (original TarotByte IP)

## Tech Stack
- **Next.js** (App Router, JavaScript)
- **Supabase** — auth, database, saved readings *(Phase C)*
- **Stripe** — add-on + subscription payments *(Phase D)*
- **Resend / Beehiiv** — email + newsletter *(Phase E)*
- **OpenAI / Anthropic** — live AI reading narration *(Phase F)*
- Hosted on **Vercel**

## Project Structure
```
app/                 # Next.js App Router pages
  components/         # Reading.js, Nav.js
  readings/[spread]/  # dynamic reading pages (yes-no, past-present-future, energy-reading)
  oracle/             # Astral Threads showcase
  signup/             # member signup flow
lib/
  tarotDeck.js         # 78-card Rider–Waite–Smith deck data
  oracleDeck.js        # 12 original Astral Threads cards
  celestial.js         # 36-decan lookup + celestial correspondence engine
  celestialNarrative.js# decan names, meanings, amplified-vs-precise narrative
  readingEngine.js     # shuffle, draw, spread logic, tier assembly
  asset.js             # asset path helper
public/oracle/       # oracle card art + card back
docs/                # pricing-analysis.md, decan-art-prompts.md, launch-checklist.md
```

## Local Development
```bash
npm install
cp .env.example .env.local   # then fill in real keys (never commit .env.local)
npm run dev                  # http://localhost:3000
```

## Environment Variables
See [`.env.example`](./.env.example) for the full list. Real values go in `.env.local` (local) and the Vercel dashboard (production) — **never** committed to this public repo.

## Deployment
Auto-deploys to Vercel on every push to `main`. See [`docs/launch-checklist.md`](./docs/launch-checklist.md) for the full go-live roadmap.

## Disclaimer
Readings are for reflection & entertainment.
