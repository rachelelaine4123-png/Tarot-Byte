import Link from "next/link";
import Nav from "./components/Nav";
import { SPREADS } from "@/lib/readingEngine";
import { asset } from "@/lib/asset";

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <header className="container" style={{ paddingTop: "3.5rem", paddingBottom: "2rem", textAlign: "center" }}>
        <div className="eyebrow" style={{ animation: "fadeUp 0.6s ease both" }}>Digital tarot · celestial oracle · your energy, decoded</div>
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
      </header>

      {/* Floating oracle preview */}
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
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {Object.values(SPREADS).map((s) => (
            <Link key={s.id} href={`/readings/${s.id}`} className="panel" style={{
              padding: "1.75rem", display: "block", transition: "transform 0.2s, box-shadow 0.2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1.35rem" }}>{s.name}</h3>
                <span style={{
                  fontFamily: "var(--font-ui)", fontSize: "0.68rem", letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "0.25rem 0.65rem", borderRadius: "999px",
                  border: `1px solid ${s.tier === "free" ? "var(--arcane-dim)" : "var(--brass)"}`,
                  color: s.tier === "free" ? "var(--arcane)" : "var(--brass-bright)",
                }}>
                  {s.tier === "free" ? "Free" : "Members"}
                </span>
              </div>
              <p className="muted" style={{ fontSize: "0.95rem" }}>{s.description}</p>
              <div style={{ marginTop: "1rem", color: "var(--brass-bright)", fontFamily: "var(--font-ui)", fontSize: "0.9rem" }}>
                {s.cards} card{s.cards > 1 ? "s" : ""}{s.usesOracle ? " + oracle" : ""} · Draw now →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Differentiator */}
      <section className="container" style={{ paddingBottom: "3rem" }}>
        <div className="panel" style={{ padding: "2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center" }}>
          <div>
            <div className="eyebrow">The TarotByte difference</div>
            <h2 style={{ fontSize: "2rem", margin: "0.5rem 0 1rem" }}>An oracle that&apos;s truly ours</h2>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/oracle/capricorn.png")} alt="Astral Threads" style={{ width: "100%", borderRadius: "12px", border: "1px solid var(--brass)", boxShadow: "var(--glow-brass)" }} />
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
          <form action={asset("/signup")} style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap", maxWidth: 460, margin: "0 auto" }}>
            <input
              type="email" placeholder="you@stardust.com" required
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

      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 0", textAlign: "center" }}>
        <div className="container muted" style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--ink)", marginBottom: "0.5rem" }}>
            Tarot<span className="gold-text">Byte</span>
          </div>
          © {new Date().getFullYear()} TarotByte · Readings are for reflection & entertainment · Original art & oracle system © TarotByte
        </div>
      </footer>
    </>
  );
}
