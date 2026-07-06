import Link from "next/link";

export default function Nav() {
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1.1rem 0", position: "relative", zIndex: 2,
    }} className="container">
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--ink)" }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700,
          letterSpacing: "0.04em",
        }}>
          Tarot<span className="gold-text">Byte</span>
        </span>
      </Link>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", fontFamily: "var(--font-ui)", fontSize: "0.92rem" }}>
        <Link href="/readings" className="muted">Readings</Link>
        <Link href="/oracle" className="muted">The Oracle</Link>
        <Link href="/readings/energy-reading" className="btn btn-ghost" style={{ padding: "0.55rem 1.1rem" }}>
          Energy Reading
        </Link>
      </div>
    </nav>
  );
}
