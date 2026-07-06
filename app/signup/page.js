"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    // BONES: this is where Supabase auth + Resend/Buttondown newsletter will wire in (Phase 2).
    // For now we capture locally and show the success state so the flow is real.
    if (email) setDone(true);
  }

  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 520, paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="panel" style={{ padding: "2.5rem" }}>
          {!done ? (
            <>
              <div className="eyebrow center">Join free</div>
              <h1 style={{ fontSize: "2.2rem", textAlign: "center", margin: "0.5rem 0 0.5rem" }}>
                Unlock your <span className="gold-text">Energy Reading</span>
              </h1>
              <p className="muted center" style={{ marginBottom: "1.75rem" }}>
                Create a free account to access TarotByte&apos;s signature spread, save your readings,
                and get The Weekly Byte in your inbox.
              </p>
              <form onSubmit={submit} className="stack">
                <input
                  type="email" required placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
                <input type="password" placeholder="Choose a password" style={inputStyle} />
                <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--ink-dim)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input type="checkbox" defaultChecked /> Send me The Weekly Byte newsletter
                </label>
                <button type="submit" className="btn btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                  Create my free account ✦
                </button>
              </form>
              <p className="muted center" style={{ fontSize: "0.8rem", marginTop: "1.25rem", fontFamily: "var(--font-ui)" }}>
                Paid spreads (Celtic Cross, Horseshoe, 5-Card V) & astrology overlays coming soon.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✦</div>
              <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>You&apos;re in!</h1>
              <p className="muted" style={{ marginBottom: "1.5rem" }}>
                Welcome to TarotByte, seeker. You&apos;ve unlocked the <strong className="gold-text">Celestial</strong> layer — every card now reveals its zodiac sign &amp; ruling planet. As a member you also get <strong className="gold-text">one free Decan Engine add-on</strong> each month.
              </p>
              <div className="stack" style={{ gap: "0.75rem" }}>
                <Link href="/readings/energy-reading?unlocked=1" className="btn btn-lg" style={{ justifyContent: "center" }}>
                  Open my Energy Reading (Celestial) →
                </Link>
                <Link href="/readings/past-present-future?unlocked=1" className="btn" style={{ justifyContent: "center", background: "transparent", border: "1px solid var(--brass)", color: "var(--brass-bright)" }}>
                  Try Past · Present · Future (Celestial) →
                </Link>
              </div>
              <div className="divider" style={{ margin: "1.5rem 0" }} />
              <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                Want the deepest reading? <strong className="gold-text">The Decan Engine</strong> pinpoints the exact 10° celestial degree behind every numbered card — and names it. Add it to any reading, or subscribe for unlimited.
              </p>
              <Link href="/readings/energy-reading?unlocked=2" className="btn" style={{ justifyContent: "center", fontSize: "0.9rem" }}>
                ✦ Preview The Decan Engine (subscriber demo) →
              </Link>
              <p className="muted" style={{ fontSize: "0.78rem", marginTop: "1.5rem", fontFamily: "var(--font-ui)" }}>
                (Demo flow — real accounts, subscription & email wire in during Phase 2.)
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

const inputStyle = {
  width: "100%", padding: "0.85rem 1.1rem", background: "var(--bg-deep)",
  border: "1px solid var(--border)", borderRadius: "10px", color: "var(--ink)",
  fontFamily: "var(--font-body)", fontSize: "1rem",
};
