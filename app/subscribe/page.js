"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";
import { useAccount } from "@/lib/useAccount";
import { PRICING } from "@/lib/stripeConfig";

// /subscribe — the subscription purchase page.
// Shows the $6.99/mo + $49/yr plans. If the visitor is signed in, clicking a
// plan redirects to Stripe Checkout. If not, it sends them to /signup first
// with a redirect-back param so they return here after confirming email.
export default function SubscribePage() {
  const account = useAccount();
  const [busy, setBusy] = useState(null); // "monthly" | "annual" | null
  const [error, setError] = useState(null);

  async function choosePlan(plan) {
    setBusy(plan);
    setError(null);
    if (!account.signedIn) {
      // Send them to sign up with a redirect-back param. The signup flow
      // carries this through the email confirmation so they land back here.
      window.location.href = "/signup?next=/subscribe";
      return;
    }
    const priceId =
      plan === "annual"
        ? PRICING.subscription.annual.priceId
        : PRICING.subscription.monthly.priceId;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout unavailable.");
        setBusy(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not reach the payment server. Please try again.");
      setBusy(null);
    }
  }

  const loading = account.loading;

  // Identical feature list for both plans — the only difference is the
  // "2 months free" line on annual. This keeps the panels the same height
  // and communicates that both plans offer the same product.
  const sharedFeatures = [
    "Unlimited Decan Engine readings",
    "All current & future spreads",
    "Saved reading history",
    "Cancel anytime",
  ];

  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 760, paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="eyebrow">TarotByte Unlimited</div>
          <h1 style={{ fontSize: "2.6rem", margin: "0.5rem 0" }}>
            Unlimited <span className="gold-text">Decan Engine</span> readings
          </h1>
          <p className="muted" style={{ maxWidth: 540, margin: "0 auto", fontSize: "1.05rem" }}>
            Every reading at the deepest layer — the exact 10° celestial degree behind every numbered card, with its named decan, ruling planet, and calendar window. Plus saved reading history and every future paid spread.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "stretch" }}>
          {/* Monthly */}
          <div className="panel subscribe-panel" style={{ padding: "2rem", textAlign: "center", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-dim)", marginBottom: "0.6rem" }}>
              Monthly
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", color: "var(--ink)" }}>
              $6.99<span style={{ fontSize: "1rem", color: "var(--ink-dim)" }}>/mo</span>
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--ink-dim)", marginBottom: "0.5rem", minHeight: "1.2rem" }}>
              Billed monthly
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.75rem 0 1.5rem", textAlign: "left", fontFamily: "var(--font-ui)", fontSize: "0.9rem", color: "var(--ink-dim)", flexGrow: 1 }}>
              {sharedFeatures.map((f) => (
                <li key={f} style={{ marginBottom: "0.5rem" }}>✦ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => choosePlan("monthly")}
              className="btn btn-lg"
              disabled={loading || busy !== null}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {busy === "monthly" ? "Redirecting…" : "Subscribe monthly"}
            </button>
          </div>

          {/* Annual — hero */}
          <div className="panel subscribe-panel" style={{
            padding: "2rem", textAlign: "center",
            border: "1px solid var(--brass)", boxShadow: "var(--glow-brass)",
            position: "relative", display: "flex", flexDirection: "column",
          }}>
            <div style={{
              position: "absolute", top: "-0.7rem", left: "50%", transform: "translateX(-50%)",
              background: "var(--brass)", color: "var(--bg-deep)", fontFamily: "var(--font-ui)",
              fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "0.25rem 0.75rem", borderRadius: "20px", fontWeight: 700,
            }}>
              Best value
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--brass-bright)", marginBottom: "0.6rem" }}>
              Annual
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", color: "var(--brass-bright)" }}>
              $49<span style={{ fontSize: "1rem", color: "var(--ink-dim)" }}>/yr</span>
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--ink-dim)", marginBottom: "0.5rem", minHeight: "1.2rem" }}>
              ≈ $4.08/mo · <span className="gold-text">2 months free</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.75rem 0 1.5rem", textAlign: "left", fontFamily: "var(--font-ui)", fontSize: "0.9rem", color: "var(--ink-dim)", flexGrow: 1 }}>
              {sharedFeatures.map((f) => (
                <li key={f} style={{ marginBottom: "0.5rem" }}>✦ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => choosePlan("annual")}
              className="btn btn-lg"
              disabled={loading || busy !== null}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {busy === "annual" ? "Redirecting…" : "Subscribe yearly"}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ textAlign: "center", color: "var(--rose)", marginTop: "1.5rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}

        {account.signedIn && !loading && (
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "var(--ink-dim)" }}>
            Signed in as <strong>{account.email}</strong> · {account.tier === "subscriber" ? "you're already a subscriber ✦" : `currently ${account.tier}`}
          </p>
        )}

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <p className="muted" style={{ fontSize: "0.85rem", maxWidth: 520, margin: "0 auto 0.75rem" }}>
            Prefer pay-as-you-go? As a member you get <strong>1 free Decan add-on each month</strong>, then just <strong>$2/reading</strong> (or a <strong>$5 3-pack</strong>). No subscription needed.
          </p>
          <Link href="/readings/energy-reading" className="btn" style={{ fontSize: "0.9rem", background: "transparent", border: "1px solid var(--arcane)", color: "var(--arcane)" }}>
            ← Back to readings
          </Link>
        </div>
      </main>
    </>
  );
}
