// useAccount — the single client-side source of truth for the user's
// TarotByte account state.
//
// Returns:
//   {
//     loading: boolean,
//     signedIn: boolean,
//     email: string | null,
//     tier: "free" | "member" | "subscriber",
//     freeDecanCredits: number,
//     unlockLevel: 0 | 1 | 2,   // free→0, member→1, subscriber→2
//     refresh: () => void,       // re-fetch /api/me after a change
//   }
//
// `unlockLevel` maps directly onto the old ?unlocked= demo flags so the
// Reading component can switch over with minimal churn.
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useAccount() {
  const [state, setState] = useState({
    loading: true,
    signedIn: false,
    email: null,
    tier: "free",
    freeDecanCredits: 0,
    unlockLevel: 0,
  });
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) throw new Error("not ok");
      const data = await res.json();
      if (!mounted.current) return;
      const unlockLevel =
        data.tier === "subscriber" ? 2 : data.tier === "member" ? 1 : 0;
      setState({
        loading: false,
        signedIn: !!data.signedIn,
        email: data.email ?? null,
        tier: data.tier ?? "free",
        freeDecanCredits: data.freeDecanCredits ?? 0,
        unlockLevel,
      });
    } catch {
      if (mounted.current) {
        setState({
          loading: false,
          signedIn: false,
          email: null,
          tier: "free",
          freeDecanCredits: 0,
          unlockLevel: 0,
        });
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => {
      mounted.current = false;
    };
  }, [refresh]);

  return { ...state, refresh };
}
