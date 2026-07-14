"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";
import { useAccount } from "@/lib/useAccount";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const account = useAccount();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { createClient } = await import("@/lib/supabaseClient");
      const supabase = createClient();
      if (!supabase) {
        setError("Account system is still being set up — please check back shortly.");
        setBusy(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setBusy(false);
        return;
      }
      // Success — refresh account state and redirect to readings.
      account.refresh();
      window.location.href = "/readings";
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  async function sendReset(e) {
    e.preventDefault();
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabaseClient");
      const supabase = createClient();
      if (!supabase) {
        setError("Account system is still being set up — please check back shortly.");
        setBusy(false);
        return;
      }
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/success`,
      });
      if (resetError) {
        setError(resetError.message);
        setBusy(false);
        return;
      }
      setResetSent(true);
      setBusy(false);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  // If already signed in, redirect to readings.
  if (account.signedIn && !account.loading) {
    return (
      <>
        <Nav />
        <main className="container" style={{ maxWidth: 520, paddingTop: "3rem", paddingBottom: "5rem" }}>
          <div className="panel" style={{ padding: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✦</div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>You&apos;re already signed in</h1>
            <p className="muted" style={{ marginBottom: "1.5rem" }}>
              Welcome back, <strong className="gold-text">{account.email}</strong>. You&apos;re all set.
            </p>
            <Link href="/readings/energy-reading" className="btn btn-lg" style={{ justifyContent: "center" }}>
              Go to my readings →
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="container" style={{ maxWidth: 520, paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="panel" style={{ padding: "2.5rem" }}>
          {resetSent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✦</div>
              <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Check your inbox</h1>
              <p className="muted" style={{ marginBottom: "1.5rem" }}>
                We&apos;ve sent a password reset link to <strong className="gold-text">{email}</strong>.
                Click it to choose a new password.
              </p>
              <button onClick={() => { setShowReset(false); setResetSent(false); }} className="btn" style={{ justifyContent: "center" }}>
                ← Back to sign in
              </button>
            </div>
          ) : showReset ? (
            <>
              <div className="eyebrow center">Reset password</div>
              <h1 style={{ fontSize: "2rem", textAlign: "center", margin: "0.5rem 0 0.5rem" }}>
                Forgot your password?
              </h1>
              <p className="muted center" style={{ marginBottom: "1.75rem" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={sendReset} className="stack">
                <input
                  type="email" required placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
                {error && <ErrorBox message={error} />}
                <button type="submit" className="btn btn-lg" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
                  {busy ? "Sending reset link…" : "Send reset link ✦"}
                </button>
              </form>
              <p className="muted center" style={{ fontSize: "0.85rem", marginTop: "1.25rem", fontFamily: "var(--font-ui)" }}>
                <button onClick={() => setShowReset(false)} style={{ background: "none", border: "none", color: "var(--brass-bright)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit" }}>
                  ← Back to sign in
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="eyebrow center">Welcome back</div>
              <h1 style={{ fontSize: "2.2rem", textAlign: "center", margin: "0.5rem 0 0.5rem" }}>
                Sign in to <span className="gold-text">TarotByte</span>
              </h1>
              <p className="muted center" style={{ marginBottom: "1.75rem" }}>
                Pick up where you left off — your saved readings and Astral Threads layer are waiting.
              </p>
              <form onSubmit={submit} className="stack">
                <input
                  type="email" required placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="password" required placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
                {error && <ErrorBox message={error} />}
                <button type="submit" className="btn btn-lg" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
                  {busy ? "Signing in…" : "Sign in ✦"}
                </button>
              </form>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.25rem", fontFamily: "var(--font-ui)", fontSize: "0.85rem" }}>
                <button onClick={() => setShowReset(true)} style={{ background: "none", border: "none", color: "var(--ink-dim)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit" }}>
                  Forgot password?
                </button>
                <span className="muted">
                  New here? <Link href="/signup" style={{ color: "var(--brass-bright)", textDecoration: "underline" }}>Create an account</Link>
                </span>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function ErrorBox({ message }) {
  return (
    <div style={{ padding: "0.7rem 1rem", borderRadius: "8px", background: "rgba(229,57,53,0.12)", border: "1px solid var(--rose)", color: "var(--rose)", fontFamily: "var(--font-ui)", fontSize: "0.85rem" }}>
      {message}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.85rem 1.1rem", background: "var(--bg-deep)",
  border: "1px solid var(--border)", borderRadius: "10px", color: "var(--ink)",
  fontFamily: "var(--font-body)", fontSize: "1rem",
};
