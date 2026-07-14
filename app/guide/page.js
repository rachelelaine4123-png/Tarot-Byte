import Link from "next/link";

export const metadata = {
  title: "How TarotByte Reads — The Guide",
  description:
    "Understand TarotByte's two dimensions, three reading layers, the Archons, the Suits, the Astral Threads, and the Decan Engine.",
};

export default function GuidePage() {
  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem", maxWidth: "860px" }}>
      <p className="eyebrow">TarotByte Guide</p>
      <h1 style={{ fontSize: "2.8rem", lineHeight: 1.1, marginTop: "0.5rem" }}>
        How TarotByte <span className="gold-text">Reads</span>
      </h1>
      <p className="muted" style={{ fontSize: "1.05rem", marginTop: "1rem", maxWidth: "640px" }}>
        Every TarotByte reading is built on two dimensions that work together: the cards themselves,
        and an original astrology overlay we call the <strong className="gold-text">Astral Threads</strong>.
        Here's how the pieces fit, what each layer adds, and why the deeper layers feel so specific.
      </p>

      <div className="divider" />

      {/* ---- Two dimensions ---- */}
      <Section title="The Two Dimensions">
        <p>
          A traditional tarot deck has 78 cards. TarotByte keeps all 78 and renames the two great divisions to
          match the celestial theme:
        </p>
        <div className="guide-callout">
          <p><strong className="gold-text">The Archons</strong> — what most decks call the Major Arcana. These
          are the 22 governing forces: fate, archetype, the big energies acting on you. When an Archon shows
          up, something larger than daily life is in motion.</p>
          <p><strong className="gold-text">The Suits</strong> — the Minor Arcana. These are the 56 cards of
          everyday choices: Wands (Fire, will), Cups (Water, feeling), Swords (Air, mind), and Pentacles
          (Earth, resource). They describe the texture of your day-to-day situation.</p>
        </div>
        <p>
          That's the first dimension. The second dimension is the <strong className="gold-text">Astral
          Threads</strong> — TarotByte's original astrology overlay. Every card in the deck already "knows"
          its zodiac address through the fixed Golden Dawn correspondences. We don't draw separate astrology
          cards; we read the address that's already woven into each tarot card.
        </p>
      </Section>

      {/* ---- Three layers ---- */}
      <Section title="The Three Reading Layers">
        <p>
          You can read at three depths. Each layer adds information; none of them change the cards you drew.
        </p>
        <div className="guide-callout">
          <p><strong style={{ color: "var(--arcane)" }}>Classic (free)</strong> — the card and its meaning.
          This is a clean, fast tarot read. Available to everyone, no account needed.</p>
          <p><strong style={{ color: "var(--arcane)" }}>Astral Threads (free membership)</strong> — adds the
          zodiac layer. Each card's ruling sign, element, and planet are revealed, so you can see which
          celestial energy is backing the card. A King of Pentacles isn't just "mastery of resources" — it
          carries the cusp energy of Aries and Taurus, the assertive pioneer meeting the steadfast builder.</p>
          <p><strong style={{ color: "var(--brass-bright)" }}>The Decan Engine (subscription or add-on)</strong>
          — the deepest layer. Each numbered pip resolves to an exact 10° decan with its own planetary
          sub-ruler, so a single card can read as precise as "the second decan of Aries, ruled by the Sun."
          This is where TarotByte gets uncannily specific.</p>
        </div>
      </Section>

      {/* ---- Why some cards are "amplified" ---- */}
      <Section title="Why Some Cards Read as 'Amplified'">
        <p>
          The 36 numbered pips (2 through 10 of each suit) each map to one exact decan. But four kinds of cards
          don't sit on a single decan — their energy is <em>larger</em> than one 10° slice. Instead of forcing
          them onto a precise degree, the Decan Engine reads them as <strong>amplified</strong>:
        </p>
        <ul className="guide-list">
          <li><strong className="gold-text">Aces</strong> → the pure, undivided element itself (source energy).
          The Ace of Wands is all of Fire — Aries, Leo, and Sagittarius at once.</li>
          <li><strong className="gold-text">Archons</strong> → a whole planet or sign. They're fate-level
          forces, so they read as the full ruling body rather than one slice of it.</li>
          <li><strong className="gold-text">Court cards</strong> → a persona straddling a cusp between two
          signs. The reading describes the tension and blend of both energies.</li>
          <li><strong className="gold-text">Pips 2–10</strong> → resolve to a <em>precise</em> decan. This is
          where the Decan Engine is at its most exact.</li>
        </ul>
        <p className="muted" style={{ fontSize: "0.9rem" }}>
          So when you see "amplified" on a card, it's not an error — it means that card's energy is too big to
          pin to a single degree, and the engine is telling you so.
        </p>
      </Section>

      {/* ---- The Astral Threads Clarifier ---- */}
      <Section title="The Astral Threads Clarifier">
        <p>
          Some spreads add an extra card drawn from the 12-sign Astral Threads oracle deck. This is the
          <strong className="gold-text"> Clarifier</strong> — a single zodiac energy that sits alongside your
          tarot draw and colors the whole reading.
        </p>
        <p>
          Think of it as the ambient weather for your reading. If your cards describe a situation and the
          Clarifier lands on Aries, the engine reads the whole spread through the lens of ignition, courage,
          and acting first. If it lands on Taurus, the same cards read through patience, stability, and
          building slowly. It doesn't change your cards — it tells you which celestial mood to bring to them.
        </p>
      </Section>

      {/* ---- Astral Weather ---- */}
      <Section title="Astral Weather">
        <p>
          At the bottom of your reading you'll sometimes see an <strong className="gold-text">Astral
          Weather</strong> line. This is a reading-level summary of the overall balance — how many Archons
          (fate) versus Suits (choices) versus Aces (source) versus Courts (personas) appeared in your draw.
        </p>
        <p>
          It's a quick way to sense the "temperature" of the reading: a fate-heavy spread feels different from
          a choices-heavy one, and the Weather line names that in a single sentence.
        </p>
      </Section>

      {/* ---- The planets ---- */}
      <Section title="What the Planets Rule Over">
        <p>
          When a card carries a planetary correspondence, that planet describes the <em>kind</em> of energy at
          work. Here's a quick key to what each ruling planet governs:
        </p>
        <ul className="guide-list">
          <li><strong style={{ color: "var(--brass-bright)" }}>☉ Sun</strong> — identity, vitality, the
          conscious self, what you're meant to shine at.</li>
          <li><strong style={{ color: "var(--brass-bright)" }}>☽ Moon</strong> — emotion, instinct, memory,
          the undercurrent beneath the surface.</li>
          <li><strong style={{ color: "var(--brass-bright)" }}>☿ Mercury</strong> — communication, thought,
          exchange, how information moves.</li>
          <li><strong style={{ color: "var(--brass-bright)" }}>♀ Venus</strong> — attraction, value,
          relationship, what you love and what loves you back.</li>
          <li><strong style={{ color: "var(--brass-bright)" }}>♂ Mars</strong> — drive, assertion, conflict,
          the force that pushes forward.</li>
          <li><strong style={{ color: "var(--brass-bright)" }}>♃ Jupiter</strong> — expansion, meaning, faith,
          growth and the bigger picture.</li>
          <li><strong style={{ color: "var(--brass-bright)" }}>♄ Saturn</strong> — structure, limit, mastery,
          the long work and what it costs.</li>
        </ul>
      </Section>

      <div className="divider" />

      <div style={{ textAlign: "center" }}>
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Ready to see it in action?
        </p>
        <Link href="/readings/energy-reading" className="btn btn-lg">
          Draw my cards ✦
        </Link>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/oracle" className="muted" style={{ fontFamily: "var(--font-ui)", fontSize: "0.9rem" }}>
            Browse the Astral Threads deck →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <details className="guide-section" open>
      <summary className="guide-summary">{title}</summary>
      <div className="guide-body">{children}</div>
    </details>
  );
}
