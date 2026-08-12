import Link from "next/link";

/**
 * LayerExplainer — the "new here?" block for the landing page.
 *
 * The Decan Engine and Astral Threads are original concepts; a first-time
 * visitor has no mental model for either. Before this existed the homepage
 * mentioned "Astral Threads" a dozen times and "Decan" three times, always
 * assuming the reader already knew what they were.
 *
 * This block does three things, in plain language, above the fold-ish:
 *   1. Names the three layers in order of depth.
 *   2. Says what each one actually tells you, with a concrete example.
 *   3. Makes it obvious which are free and which need an account.
 */

const LAYERS = [
  {
    n: "01",
    name: "Classic",
    price: "Free · no account",
    accent: "var(--ink)",
    tagline: "The card and what it means.",
    body:
      "A clean, fast tarot read. You draw, you get the card's meaning in the context of your question. This is tarot the way you already know it.",
    example: "“The Tower — sudden change you didn't choose.”",
  },
  {
    n: "02",
    name: "Astral Threads",
    price: "Free · with an account",
    accent: "var(--arcane)",
    tagline: "Which star sign is behind the card.",
    body:
      "Every tarot card has a fixed zodiac address. This layer reveals it — the sign, element, and ruling planet backing each card you drew — plus a 12-sign celestial card that names the energy running through the whole reading.",
    example: "“The Tower — ruled by Mars. Force, not accident.”",
  },
  {
    n: "03",
    name: "The Decan Engine",
    price: "Subscription or one-time add-on",
    accent: "var(--brass-bright)",
    tagline: "The exact 10° slice of sky.",
    body:
      "Astrologers split each sign into three 10° decans, each with its own sub-ruler. This layer resolves your card to that precise degree — which is why the reading stops feeling general and starts feeling like it's about your week specifically.",
    example: "“Five of Cups — Scorpio, second decan, ruled by Neptune.”",
  },
];

export default function LayerExplainer() {
  return (
    <section className="container" style={{ padding: "1rem 0 3.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
        <div className="eyebrow">New here? Start with this</div>
        <h2 style={{ fontSize: "clamp(1.9rem, 4vw, 2.4rem)", marginTop: "0.5rem" }}>
          One deck. <span className="gold-text">Three layers</span> of depth.
        </h2>
        <p
          className="muted"
          style={{ maxWidth: 620, margin: "0.9rem auto 0", fontSize: "1.03rem" }}
        >
          Every reading uses the same 78 cards. What changes is how much of the sky
          you can see behind them. Start free — go deeper whenever you want.
        </p>
      </div>

      <div className="layer-grid">
        {LAYERS.map((l) => (
          <div key={l.n} className="layer-card">
            <div className="layer-top">
              <span className="layer-num" style={{ color: l.accent }}>
                {l.n}
              </span>
              <span className="layer-price">{l.price}</span>
            </div>
            <h3 className="layer-name" style={{ color: l.accent }}>
              {l.name}
            </h3>
            <p className="layer-tagline">{l.tagline}</p>
            <p className="layer-body">{l.body}</p>
            <div className="layer-example" style={{ borderLeftColor: l.accent }}>
              {l.example}
            </div>
          </div>
        ))}
      </div>

      <div className="layer-cta">
        <Link href="/readings/yes-no" className="btn btn-lg">
          Start free — no account ✦
        </Link>
        <Link href="/guide" className="btn btn-ghost btn-lg">
          How it works in detail
        </Link>
      </div>
    </section>
  );
}
