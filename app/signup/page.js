"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";
import { useAccount } from "@/lib/useAccount";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(false);
  const account = useAccount();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Real Supabase sign-up. Email confirmation is ON by default in Supabase,
      // so the user gets a magic-link email; they click it and land back signed in.
      const { createClient } = await import("@/lib/supabaseClient");
      const supabase = createClient();
      if (!supabase) {
        setError("Account system is still being set up — please check back shortly.");
        setBusy(false);
        return;
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/success`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setBusy(false);
        return;
      }
      // If email confirmation is required, show the check-your-email state.
      // If confirmation is OFF (dev), the session is created immediately.
      setConfirmEmail(true);
      setBusy(false);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  // If already signed in (e.g. returning member), skip straight to success.
  const alreadyIn = account.signedIn && !account.loading;
  const done = confirmEmail || alreadyIn;

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
                <input
                  type="password" required placeholder="Choose a password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
                <label style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--ink-dim)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input type="checkbox" defaultChecked /> Send me The Weekly Byte newsletter
                </label>
                {error && (
                  <div style={{ padding: "0.7rem 1rem", borderRadius: "8px", background: "rgba(229,57,53,0.12)", border: "1px solid var(--rose)", color: "var(--rose)", fontFamily: "var(--font-ui)", fontSize: "0.85rem" }}>
                    {error}
                  </div>
                )}
                <button type="submit" className="btn btn-lg" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
                  {busy ? "Creating your account…" : "Create my free account ✦"}
                </button>
              </form>
              <p className="muted center" style={{ fontSize: "0.8rem", marginTop: "1.25rem", fontFamily: "var(--font-ui)" }}>
                Paid spreads (Celtic Cross, Horseshoe, 5-Card V) & astrology overlays coming soon.
              </p>
              <p className="muted center" style={{ fontSize: "0.85rem", marginTop: "0.75rem", fontFamily: "var(--font-ui)" }}>
                Already have an account? <Link href="/signin" style={{ color: "var(--brass-bright)", textDecoration: "underline" }}>Sign in</Link>
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✦</div>
              {confirmEmail ? (
                <>
                  <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Check your inbox</h1>
                  <p className="muted" style={{ marginBottom: "1.5rem" }}>
                    We&apos;ve sent a confirmation link to <strong className="gold-text">{email}</strong>. Click it to activate your free account — then you&apos;ll unlock the <strong className="gold-text">Celestial</strong> layer and get <strong className="gold-text">one free Decan Engine add-on</strong> each month.
                  </p>
                  <p className="muted" style={{ fontSize: "0.82rem", fontFamily: "var(--font-ui)", marginBottom: "1.5rem" }}>
                    Didn&apos;t get it? Check spam, or <button onClick={() => { setConfirmEmail(false); }} style={{ background: "none", border: "none", color: "var(--brass-bright)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit" }}>try again</button>.
                  </p>
                </>
              ) : (
                <>
                  <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>You&apos;re in!</h1>
                  <p className="muted" style={{ marginBottom: "1.5rem" }}>
                    Welcome to TarotByte, seeker. You&apos;ve unlocked the <strong className="gold-text">Celestial</strong> layer — every card now reveals its zodiac sign & ruling planet. As a member you also get <strong className="gold-text">one free Decan Engine add-on</strong> each month.
                  </p>
                </>
              )}
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
                Want the deepest reading? <strong className="gold-text">The Decan Engine</strong> pinpoints the exact 10° celestial degree behind every numbered card — and names it. Add it to any reading, or subscribe for unlimited.
              </p>
              <Link href="/readings/energy-reading?unlocked=2" className="btn" style={{ justifyContent: "center", fontSize: "0.9rem" }}>
                ✦ Preview The Decan Engine →
              </Link>
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
