import Link from "next/link";
import AccountNav from "./AccountNav";

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
        <Link href="/oracle" className="muted">Astral Threads</Link>
        <Link href="/readings/energy-reading" className="muted" style={{ fontSize: "0.9rem" }}>
          Energy Reading
        </Link>
        <AccountNav />
      </div>
    </nav>
  );
}
