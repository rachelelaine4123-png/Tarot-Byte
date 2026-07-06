import Nav from "../components/Nav";
import Link from "next/link";
import { RADIANT_ORACLE } from "@/lib/oracleDeck";
import { asset } from "@/lib/asset";

export const metadata = { title: "The Radiant Oracle — TarotByte" };

export default function OraclePage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem", maxWidth: 640, margin: "0 auto 2.5rem" }}>
          <div className="eyebrow">Original · astrology-powered · ours alone</div>
          <h1 style={{ fontSize: "2.8rem", marginTop: "0.5rem" }}>The <span className="gold-text">Radiant Oracle</span></h1>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Twelve celestial energies — one for each sign of the zodiac — hand-crafted for TarotByte.
            Drawn alongside your tarot to clarify the cosmic force at play.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {RADIANT_ORACLE.map((o) => (
            <div key={o.id} className="panel" style={{ overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(o.image)} alt={o.sign} style={{ width: "100%", display: "block" }} />
              <div style={{ padding: "1.1rem 1.25rem 1.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ fontSize: "1.2rem" }}>{o.sign}</h3>
                  <span className="muted" style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{o.element}</span>
                </div>
                <div style={{ color: "var(--arcane)", fontFamily: "var(--font-ui)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0.35rem 0 0.6rem" }}>
                  {o.keyword}
                </div>
                <p className="muted" style={{ fontSize: "0.9rem" }}>{o.energy}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/signup" className="btn btn-lg">Unlock the Energy Reading →</Link>
        </div>
      </main>
    </>
  );
}
