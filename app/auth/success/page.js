import Nav from "../../components/Nav";
import Link from "next/link";

export const metadata = { title: "Welcome to TarotByte" };

export default function AuthSuccessPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 520, paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="panel" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✦</div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>You&apos;re in!</h1>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>
            Welcome to TarotByte, seeker. Your email is confirmed and your account is active.
            You&apos;ve unlocked the <strong className="gold-text">Celestial</strong> layer — every card now
            reveals its zodiac sign & ruling planet. As a member you also get{" "}
            <strong className="gold-text">one free Decan Engine add-on</strong> each month.
          </p>
          <div className="stack" style={{ gap: "0.75rem" }}>
            <Link href="/readings/energy-reading" className="btn btn-lg" style={{ justifyContent: "center" }}>
              Open my Energy Reading (Celestial) →
            </Link>
            <Link href="/readings/past-present-future" className="btn" style={{ justifyContent: "center", background: "transparent", border: "1px solid var(--brass)", color: "var(--brass-bright)" }}>
              Try Past · Present · Future (Celestial) →
            </Link>
          </div>
          <div className="divider" style={{ margin: "1.5rem 0" }} />
          <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
            Want the deepest reading? <strong className="gold-text">The Decan Engine</strong> pinpoints the
            exact 10° celestial degree behind every numbered card — and names it. Add it to any reading, or
            subscribe for unlimited.
          </p>
          <Link href="/readings/energy-reading?unlocked=2" className="btn" style={{ justifyContent: "center", fontSize: "0.9rem" }}>
            ✦ Preview The Decan Engine →
          </Link>
        </div>
      </main>
    </>
  );
}
