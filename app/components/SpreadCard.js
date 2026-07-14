import Link from "next/link";

// Reusable spread card for the readings grid (homepage + /readings).
// Consistent layout: title + badge row, description, then a bottom metadata
// row showing card count, access level, and tier ladder names.
export default function SpreadCard({ s }) {
  const isFree = s.tier === "free";
  const cardCount = `${s.cards} card${s.cards > 1 ? "s" : ""}${s.usesOracle ? " + Astral Threads" : ""}`;

  return (
    <Link
      href={`/readings/${s.id}`}
      className="panel"
      style={{
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Title + badge — aligned consistently with fixed-height badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
          minHeight: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.35rem" }}>{s.name}</h3>
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.25rem 0.65rem",
            borderRadius: "999px",
            whiteSpace: "nowrap",
            border: `1px solid ${isFree ? "var(--arcane-dim)" : "var(--brass)"}`,
            color: isFree ? "var(--arcane)" : "var(--brass-bright)",
          }}
        >
          {isFree ? "Free" : "Members"}
        </span>
      </div>

      {/* Description */}
      <p className="muted" style={{ fontSize: "0.95rem", flex: "1" }}>
        {s.description}
      </p>

      {/* Bottom metadata row — template: cards | access | tiers */}
      <div
        style={{
          marginTop: "1rem",
          paddingTop: "0.85rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem 0.75rem",
          alignItems: "center",
          fontFamily: "var(--font-ui)",
          fontSize: "0.78rem",
        }}
      >
        <span style={{ color: "var(--ink-dim)" }}>{cardCount}</span>
        <span style={{ color: "var(--border)" }}>·</span>
        <span style={{ color: isFree ? "var(--arcane)" : "var(--brass-bright)" }}>
          {isFree ? "Free reading" : "Members only"}
        </span>
        <span style={{ color: "var(--border)" }}>·</span>
        <span style={{ color: "var(--ink-dim)" }}>
          Classic · Astral Threads · Decan Engine
        </span>
      </div>

      <div
        style={{
          marginTop: "0.65rem",
          color: "var(--brass-bright)",
          fontFamily: "var(--font-ui)",
          fontSize: "0.9rem",
        }}
      >
        {isFree ? "Draw now →" : "Open →"}
      </div>
    </Link>
  );
}
