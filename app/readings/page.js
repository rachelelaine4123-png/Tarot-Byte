import Nav from "../components/Nav";
import SpreadCard from "../components/SpreadCard";
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
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "stretch", marginBottom: "3rem" }}>
          {free.map((s) => <SpreadCard key={s.id} s={s} />)}
        </div>

        <div className="eyebrow" style={{ marginBottom: "1rem", color: "var(--brass-bright)" }}>Members — sign up free to unlock</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "stretch" }}>
          {member.map((s) => <SpreadCard key={s.id} s={s} />)}
        </div>
      </main>
    </>
  );
}
