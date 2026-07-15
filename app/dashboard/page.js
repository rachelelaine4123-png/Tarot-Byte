"use client";

// /dashboard — Member account hub.
//
// Shows:
//   • Account status (tier badge, email, subscription renewal date)
//   • Decan Engine credit balance
//   • Reading history — most recent draws at Z or D tier, paginated
//   • Quick-action links
//
// Guests are redirected to /signin?next=/dashboard

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Nav from "../components/Nav";

// ── Constants ─────────────────────────────────────────────────────────────────

const SPREAD_LABELS = {
  "yes-no":              "Yes / No",
  "past-present-future": "Past · Present · Future",
  "energy-reading":      "Energy Reading",
};

const TIER_META = {
  subscriber: {
    label:  "Subscriber ✦",
    color:  "var(--brass-bright)",
    badge:  "linear-gradient(135deg, var(--brass) 0%, var(--brass-bright) 100%)",
    desc:   "Unlimited Decan Engine readings",
  },
  member: {
    label:  "Member",
    color:  "var(--arcane)",
    badge:  "linear-gradient(135deg, var(--arcane-dim) 0%, var(--arcane) 100%)",
    desc:   "Astral Threads + 1 free Decan/month",
  },
  free: {
    label:  "Free",
    color:  "var(--ink-dim)",
    badge:  "var(--border)",
    desc:   "Classic tier — sign up for more",
  },
};

const PAGE_SIZE = 8;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [account,     setAccount]     = useState(null);
  const [acctLoading, setAcctLoading] = useState(true);
  const [readings,    setReadings]    = useState([]);
  const [total,       setTotal]       = useState(0);
  const [readLoading, setReadLoading] = useState(true);
  const [offset,      setOffset]      = useState(0);

  // Load account state from /api/me
  const loadAccount = useCallback(async () => {
    setAcctLoading(true);
    try {
      const res  = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      setAccount(data);
    } catch {
      setAccount({ signedIn: false });
    } finally {
      setAcctLoading(false);
    }
  }, []);

  // Load one page of reading history
  const loadReadings = useCallback(async (off) => {
    setReadLoading(true);
    try {
      const res  = await fetch(`/api/readings?limit=${PAGE_SIZE}&offset=${off}`, { cache: "no-store" });
      const data = await res.json();
      setReadings(data.readings ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setReadings([]);
    } finally {
      setReadLoading(false);
    }
  }, []);

  useEffect(() => { loadAccount(); }, [loadAccount]);
  useEffect(() => { loadReadings(offset); }, [loadReadings, offset]);

  // Redirect guests once we know they're not signed in
  useEffect(() => {
    if (!acctLoading && account && !account.signedIn) {
      window.location.href = "/signin?next=/dashboard";
    }
  }, [acctLoading, account]);

  // Show nothing during the redirect or while loading for the first time
  if (acctLoading || (!account?.signedIn && !acctLoading)) {
    return (
      <>
        <Nav />
        <main className="container" style={{ maxWidth: 860, paddingTop: "3rem", paddingBottom: "5rem", textAlign: "center" }}>
          <p className="muted" style={{ fontFamily: "var(--font-ui)", marginTop: "4rem" }}>Loading…</p>
        </main>
      </>
    );
  }

  const tier    = account.tier ?? "free";
  const tierMeta = TIER_META[tier] ?? TIER_META.free;
  const credits = account.freeDecanCredits ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 860, paddingTop: "2.5rem", paddingBottom: "5rem" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "2rem" }}>
          <p className="eyebrow">Account</p>
          <h1 style={{ fontSize: "2.4rem", lineHeight: 1.1, marginTop: "0.4rem" }}>
            Your <span className="gold-text">Dashboard</span>
          </h1>
        </div>

        {/* ── Status cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}>

          {/* Membership */}
          <StatCard>
            <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Membership</div>
            <div style={{
              display: "inline-block",
              background: tierMeta.badge,
              borderRadius: "999px",
              padding: "0.25rem 0.85rem",
              fontFamily: "var(--font-ui)",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: tier === "subscriber" ? "#1a1408" : "var(--ink)",
              letterSpacing: "0.04em",
              marginBottom: "0.5rem",
            }}>
              {tierMeta.label}
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--ink-dim)", lineHeight: 1.5 }}>
              {tierMeta.desc}
            </p>
            {account.currentPeriodEnd && (
              <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "var(--ink-dim)", marginTop: "0.4rem" }}>
                Renews {new Date(account.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            )}
            {tier !== "subscriber" && (
              <Link href="/subscribe" className="btn" style={{ marginTop: "1rem", display: "inline-flex", fontSize: "0.82rem", padding: "0.5rem 1rem" }}>
                Upgrade ✦
              </Link>
            )}
          </StatCard>

          {/* Decan Credits */}
          <StatCard>
            <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Decan Engine</div>
            {tier === "subscriber" ? (
              <>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--brass-bright)", lineHeight: 1 }}>
                  Unlimited
                </div>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--ink-dim)", marginTop: "0.4rem" }}>
                  Included with subscription
                </p>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.2rem",
                    lineHeight: 1,
                    color: credits > 0 ? "var(--brass-bright)" : "var(--ink-dim)",
                  }}>
                    {credits}
                  </span>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--ink-dim)" }}>
                    credit{credits !== 1 ? "s" : ""} left
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--ink-dim)", marginTop: "0.35rem", lineHeight: 1.45 }}>
                  {credits > 0
                    ? "Free monthly credit — resets 1st of each month"
                    : "Monthly credit used — draw again or add more"}
                </p>
                <Link href="/readings/energy-reading" className="btn" style={{
                  marginTop: "1rem", display: "inline-flex", fontSize: "0.82rem",
                  padding: "0.5rem 1rem", background: "transparent",
                  border: "1px solid var(--arcane)", color: "var(--arcane)",
                }}>
                  Draw now →
                </Link>
              </>
            )}
          </StatCard>

          {/* Account info */}
          <StatCard>
            <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Account</div>
            <p style={{
              fontFamily: "var(--font-ui)", fontSize: "0.88rem",
              color: "var(--ink)", wordBreak: "break-all", lineHeight: 1.4,
            }}>
              {account.email}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "1rem" }}>
              <Link href="/readings" style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--arcane)" }}>
                New reading →
              </Link>
              <Link href="/subscribe" style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--brass-bright)" }}>
                Manage subscription →
              </Link>
              <SignOutButton />
            </div>
          </StatCard>

        </div>

        {/* ── Divider ── */}
        <div className="divider" style={{ margin: "0 0 2rem" }} />

        {/* ── Reading History ── */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.4rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h2 style={{ fontSize: "1.5rem" }}>
              Reading <span className="gold-text">History</span>
            </h2>
            {total > 0 && (
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--ink-dim)" }}>
                {total} reading{total !== 1 ? "s" : ""} saved
              </span>
            )}
          </div>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--ink-dim)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
            Astral Threads and Decan Engine readings are saved automatically.
            Classic draws are ephemeral.
          </p>

          {readLoading ? (
            <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
              <p className="muted" style={{ fontFamily: "var(--font-ui)", fontSize: "0.88rem" }}>Loading readings…</p>
            </div>
          ) : readings.length === 0 ? (
            <EmptyHistory tier={tier} />
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {readings.map((r) => (
                  <ReadingRow key={r.id} reading={r} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: "flex", gap: "0.75rem", justifyContent: "center",
                  alignItems: "center", marginTop: "1.75rem",
                }}>
                  <button
                    disabled={offset === 0}
                    onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                    style={{
                      fontFamily: "var(--font-ui)", fontSize: "0.82rem",
                      padding: "0.5rem 1.1rem", borderRadius: "999px",
                      border: "1px solid var(--border)", background: "transparent",
                      color: offset === 0 ? "var(--ink-dim)" : "var(--brass-bright)",
                      cursor: offset === 0 ? "not-allowed" : "pointer",
                      opacity: offset === 0 ? 0.45 : 1,
                    }}
                  >
                    ← Newer
                  </button>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--ink-dim)" }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={offset + PAGE_SIZE >= total}
                    onClick={() => setOffset(offset + PAGE_SIZE)}
                    style={{
                      fontFamily: "var(--font-ui)", fontSize: "0.82rem",
                      padding: "0.5rem 1.1rem", borderRadius: "999px",
                      border: "1px solid var(--border)", background: "transparent",
                      color: offset + PAGE_SIZE >= total ? "var(--ink-dim)" : "var(--brass-bright)",
                      cursor: offset + PAGE_SIZE >= total ? "not-allowed" : "pointer",
                      opacity: offset + PAGE_SIZE >= total ? 0.45 : 1,
                    }}
                  >
                    Older →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </main>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ children }) {
  return (
    <div className="panel" style={{ padding: "1.4rem 1.5rem" }}>
      {children}
    </div>
  );
}

function ReadingRow({ reading }) {
  const [open, setOpen] = useState(false);

  const date      = new Date(reading.created_at);
  const dateStr   = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr   = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const label     = SPREAD_LABELS[reading.spread_id] ?? reading.spread_id;
  const cards     = reading.cards_json?.cards ?? [];
  const oracle    = reading.cards_json?.oracle;
  const tierLabel = reading.tier === "D" ? "Decan Engine" : reading.tier === "Z" ? "Astral Threads" : "Classic";
  const tierColor = reading.tier === "D" ? "var(--brass-bright)" : reading.tier === "Z" ? "var(--arcane)" : "var(--ink-dim)";

  return (
    <div
      className="panel"
      onClick={() => setOpen((o) => !o)}
      style={{ padding: "1rem 1.25rem", cursor: "pointer", transition: "border-color 0.15s ease" }}
    >
      {/* Row summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.98rem", color: "var(--ink)" }}>
            {label}
          </span>
          {reading.context && (
            <span style={{
              fontFamily: "var(--font-ui)", fontSize: "0.7rem",
              background: "rgba(92,225,230,0.1)", border: "1px solid var(--arcane-dim)",
              borderRadius: "999px", padding: "0.12rem 0.55rem", color: "var(--arcane)",
            }}>
              {reading.context}
            </span>
          )}
          {reading.verdict && (
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", color: "var(--brass-bright)" }}>
              {reading.verdict}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", color: tierColor, letterSpacing: "0.05em" }}>
            ✦ {tierLabel}
          </span>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", color: "var(--ink-dim)" }}>
            {dateStr} · {timeStr}
          </span>
          <span style={{
            color: "var(--arcane)", fontSize: "0.72rem",
            display: "inline-block",
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "none",
          }}>▶</span>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div
          style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {cards.map((card, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: "0.68rem",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "var(--arcane)", minWidth: "80px", paddingTop: "0.1rem", flexShrink: 0,
                }}>
                  {card.position}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.92rem", color: "var(--brass-bright)" }}>
                    {card.name}{card.reversed ? " (Rev.)" : ""}
                  </div>
                  {card.celestialLines?.map((cl, j) => (
                    <div key={j} style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", color: "var(--ink-dim)", marginTop: "0.1rem" }}>
                      {cl.label} — {cl.text?.slice(0, 90)}{cl.text?.length > 90 ? "…" : ""}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Oracle clarifier */}
            {oracle && (
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", borderTop: "1px solid var(--border)", paddingTop: "0.55rem", marginTop: "0.2rem" }}>
                <div style={{
                  fontFamily: "var(--font-ui)", fontSize: "0.68rem",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "var(--rose)", minWidth: "80px", paddingTop: "0.1rem", flexShrink: 0,
                }}>
                  Clarifier
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.92rem", color: "var(--rose)" }}>
                  {oracle.sign} · {oracle.keyword}
                </div>
              </div>
            )}
          </div>

          {/* Tone / Astral Weather */}
          {reading.cards_json?.tone && (
            <div style={{
              marginTop: "0.85rem", padding: "0.65rem 0.9rem",
              background: "rgba(212,162,76,0.07)", borderLeft: "2px solid var(--brass)",
              borderRadius: "0 8px 8px 0",
            }}>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--brass-bright)", marginBottom: "0.2rem" }}>
                ✦ Astral Weather
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.83rem", color: "var(--ink-dim)", margin: 0, lineHeight: 1.5 }}>
                {reading.cards_json.tone.text}
              </p>
            </div>
          )}

          {/* Draw again CTA */}
          <div style={{ marginTop: "0.85rem" }}>
            <Link
              href={`/readings/${reading.spread_id}`}
              className="btn"
              style={{ fontSize: "0.8rem", padding: "0.45rem 1rem", background: "transparent", border: "1px solid var(--arcane)", color: "var(--arcane)" }}
            >
              Draw again →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyHistory({ tier }) {
  return (
    <div className="panel" style={{ padding: "3rem 2rem", textAlign: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.65rem", color: "var(--brass-bright)" }}>✦</div>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--brass-bright)", marginBottom: "0.5rem" }}>
        No readings saved yet
      </p>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--ink-dim)", maxWidth: 360, margin: "0 auto 1.4rem", lineHeight: 1.55 }}>
        {tier === "free"
          ? "Sign in and draw at Astral Threads depth to start building your history."
          : "Draw at Astral Threads or Decan Engine depth and your readings appear here automatically."}
      </p>
      <Link href="/readings/energy-reading" className="btn">
        Draw my cards ✦
      </Link>
    </div>
  );
}

function SignOutButton() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      const { createClient } = await import("@/lib/supabaseClient");
      const supabase = createClient();
      if (supabase) await supabase.auth.signOut();
      window.location.href = "/";
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={signOut}
      disabled={busy}
      style={{
        fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--ink-dim)",
        background: "none", border: "none", cursor: "pointer", padding: 0,
        textAlign: "left", opacity: busy ? 0.5 : 1,
      }}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
