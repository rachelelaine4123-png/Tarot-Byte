import Link from "next/link";
import Nav from "./components/Nav";
import SpreadCard from "./components/SpreadCard";
import { SPREADS } from "@/lib/readingEngine";
import { asset } from "@/lib/asset";

export const metadata = {
  title: "TarotByte — Free Tarot Readings with an Astral Twist",
  description:
    "Free online tarot readings with an astrology-powered twist. Try Yes/No, Past·Present·Future, or your signature Energy Reading. Bite-sized wisdom from the cosmos.",
  alternates: { canonical: "https://www.tarotbyte.app/" },
};

export default function Home() {
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TarotByte",
    url: "https://www.tarotbyte.app",
    description: "Free tarot readings with a celestial twist — an original astrology-powered Astral Threads deck and your signature Energy Reading.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.tarotbyte.app/readings",
      "query-input": "required name=search_string",
    },
  };
  const orgJsonld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TarotByte",
    url: "https://www.tarotbyte.app",
    email: "hello@tarotbyte.app",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonld) }} />
      <Nav />

      {/* Hero */}
      <header className="container" style={{ paddingTop: "3.5rem", paddingBottom: "2rem", textAlign: "center" }}>
        <div className="eyebrow" style={{ animation: "fadeUp 0.6s ease both" }}>Digital tarot · celestial insight · your energy, decoded</div>
        <h1 style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)", margin: "1rem 0", animation: "fadeUp 0.7s ease 0.05s both" }}>
          Bite-sized wisdom<br />from the <span className="gold-text">cosmos</span>.
        </h1>
        <p className="muted" style={{ fontSize: "1.2rem", maxWidth: 620, margin: "0 auto 2rem", animation: "fadeUp 0.8s ease 0.1s both" }}>
          TarotByte pairs the timeless 78-card tarot with an original,
          astrology-powered <strong style={{ color: "var(--arcane)" }}>Astral Threads</strong> —
          for readings that feel personal, clarifying, and a little bit magic.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.9s ease 0.15s both" }}>
          <Link href="/readings/yes-no" className="btn btn-lg">Try a free reading ✦</Link>
          <Link href="/signup" className="btn btn-ghost btn-lg">Unlock your Energy Reading</Link>
        </div>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1.25rem", fontFamily: "var(--font-ui)" }}>
          Want the deepest layer? <Link href="/subscribe" style={{ color: "var(--brass-bright)", textDecoration: "underline", textUnderlineOffset: "2px" }}>See subscription plans →</Link>
        </p>
      </header>

      {/* Floating Astral Threads preview */}
      <section className="container" style={{ padding: "1.5rem 0 3rem" }}>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {["leo", "scorpio", "aquarius", "pisces", "sagittarius"].map((sign, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={sign}
              src={asset(`/oracle/${sign}.png`)}
              alt={sign}
              style={{
                width: "clamp(90px, 15vw, 150px)", borderRadius: "10px",
                border: "1px solid var(--brass)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                transform: `translateY(${i % 2 ? "14px" : "0"}) rotate(${(i - 2) * 3}deg)`,
                animation: `fadeUp 0.7s ease ${0.2 + i * 0.08}s both`,
              }}
            />
          ))}
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* Readings grid */}
      <section className="container" style={{ paddingBottom: "3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="eyebrow">Choose your spread</div>
          <h2 style={{ fontSize: "2.2rem", marginTop: "0.5rem" }}>Readings for every question</h2>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "stretch" }}>
          {Object.values(SPREADS).map((s) => (
            <SpreadCard key={s.id} s={s} />
          ))}
        </div>
      </section>

      {/* Differentiator */}
      <section className="container" style={{ paddingBottom: "3rem" }}>
        <div className="panel" style={{ padding: "2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center" }}>
          <div>
            <div className="eyebrow">The TarotByte difference</div>
            <h2 style={{ fontSize: "2rem", margin: "0.5rem 0 1rem" }}>The <span className="gold-text">Astral Threads</span> — ours alone</h2>
            <p className="muted" style={{ marginBottom: "1rem" }}>
              Most tarot sites stop at the cards. TarotByte layers in the <strong style={{ color: "var(--arcane)" }}>Astral Threads</strong> —
              an original 12-sign celestial deck that clarifies the energy behind every reading.
            </p>
            <p className="muted">
              It powers our signature <strong style={{ color: "var(--brass-bright)" }}>Energy Reading</strong>:
              a three-card map of <em>you</em>, your <em>current energy</em>, and the <em>shift</em> the
              universe is asking for — then an Astral Threads card names the celestial force at play.
            </p>
            <Link href="/oracle" className="btn" style={{ marginTop: "1.5rem" }}>Meet the Astral Threads →</Link>
          </div>
          {/* Fanned-out Astral Threads cards with Capricorn in front */}
          <div style={{ position: "relative", height: "380px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].map((sign, i) => {
              const isFront = sign === "capricorn";
              const offset = i - 10; // center around capricorn (index 10)
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={sign}
                  src={asset(`/oracle/${sign}.png`)}
                  alt={sign}
                  style={{
                    position: "absolute",
                    width: isFront ? "180px" : "160px",
                    borderRadius: "10px",
                    border: "1px solid var(--brass)",
                    boxShadow: isFront ? "var(--glow-brass)" : "0 4px 20px rgba(0,0,0,0.6)",
                    transform: isFront
                      ? "translateY(0px) rotate(0deg)"
                      : `translate(${offset * 8}px, ${Math.abs(offset) * 6}px) rotate(${offset * 4}deg)`,
                    zIndex: isFront ? 12 : 10 - Math.abs(offset),
                    opacity: isFront ? 1 : 0.85,
                    transition: "transform 0.3s ease",
                    objectFit: "cover",
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container" style={{ paddingBottom: "4rem" }}>
        <div className="panel" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div className="eyebrow">The Weekly Byte</div>
          <h2 style={{ fontSize: "1.9rem", margin: "0.5rem 0 0.75rem" }}>Your stars, in your inbox</h2>
          <p className="muted" style={{ maxWidth: 480, margin: "0 auto 1.5rem" }}>
            A short, soulful weekly reading + the cosmic energy ahead. No noise, just signal.
          </p>
          <form method="get" action="/signup" style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap", maxWidth: 460, margin: "0 auto" }}>
            <input
              type="email" name="email" placeholder="you@stardust.com" required
              style={{
                flex: "1 1 240px", padding: "0.85rem 1.1rem", background: "var(--bg-deep)",
                border: "1px solid var(--border)", borderRadius: "999px", color: "var(--ink)",
                fontFamily: "var(--font-body)", fontSize: "1rem",
              }}
            />
            <button type="submit" className="btn">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
