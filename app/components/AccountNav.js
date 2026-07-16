"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount } from "@/lib/useAccount";

// Account-aware nav entry. Shows "Sign in" for guests, and the member's
// email + sign-out for signed-in users. Renders inline so it can sit in the
// existing Nav layout without making the whole nav a client component.
export default function AccountNav() {
  const account = useAccount();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      const { createClient } = await import("@/lib/supabaseClient");
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
        account.refresh();
      }
      // Redirect to home after sign-out.
      if (typeof window !== "undefined") window.location.href = "/";
    } catch {
      setBusy(false);
    }
  }

  if (account.loading) {
    return <span className="muted" style={{ fontSize: "0.85rem" }}>…</span>;
  }

  if (!account.signedIn) {
    return (
      <Link href="/signin" className="btn btn-ghost" style={{ padding: "0.55rem 1.1rem", fontSize: "0.88rem" }}>
        Sign in
      </Link>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <Link
        href="/dashboard"
        className="muted account-email-label"
        style={{ fontSize: "0.82rem", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        title={`${account.email} — My Dashboard`}
      >
        {account.email}
      </Link>
      {account.tier === "subscriber" && (
        <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brass-bright)", border: "1px solid var(--brass)", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
          ✦ Sub
        </span>
      )}
      <button onClick={signOut} disabled={busy} className="btn btn-ghost" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem", cursor: "pointer" }}>
        {busy ? "…" : "Sign out"}
      </button>
    </div>
  );
}
