import Nav from "../components/Nav";
import Link from "next/link";
import { SPREADS } from "@/lib/readingEngine";

export const metadata = { title: "Readings — TarotByte" };

export default function ReadingsIndex() {
  const free = Object.values(SPREADS).filter((s) => s.tier === "free");
  const member = Object.values(SPREADS).filter((s) => s.tier === "member");

  return (
    <>
      <Nav />
      <main className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="eyebrow">Choose your spread</div>
          <h1 style={{ fontSize: "2.8rem", marginTop: "0.5rem" }}>Readings</h1>
          <p className="muted" style={{ maxWidth: 560, margin: "0.75rem auto 0" }}>
            Two free readings to begin — plus your signature Energy Reading when you join.
          </p>
        </div>

        <div className="eyebrow" style={{ marginBottom: "1rem" }}>Free forever</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginBottom: "3rem" }}>
          {free.map((s) => <SpreadCard key={s.id} s={s} />)}
        </div>

        <div className="eyebrow" style={{ marginBottom: "1rem", color: "var(--brass-bright)" }}>Members — sign up free to unlock</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {member.map((s) => <SpreadCard key={s.id} s={s} />)}
        </div>
      </main>
    </>
  );
}

function SpreadCard({ s }) {
  return (
    <Link href={`/readings/${s.id}`} className="panel" style={{ padding: "1.75rem", display: "block" }}>
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
        {s.cards} card{s.cards > 1 ? "s" : ""}{s.usesOracle ? " + oracle" : ""} · Open →
      </div>
    </Link>
  );
}
