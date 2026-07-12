// GET /api/me — returns the current user's account state.
//
// Response when signed out:
//   { signedIn: false, tier: "free", freeDecanCredits: 0 }
//
// Response when signed in:
//   {
//     signedIn: true,
//     email: "r@tarotbyte.app",
//     tier: "member" | "subscriber",   // resolved via subscription status
//     freeDecanCredits: 1,              // remaining free Decan add-ons this month
//     subscriptionStatus: null | "active" | "past_due" | ...
//     currentPeriodEnd: null | "2025-08-12..."
//   }
//
// The client uses `tier` to gate the reading ladder (Classic/Celestial/Decan)
// and `freeDecanCredits` to decide whether the Decan add-on is free or paid.
//
// Graceful degradation: if Supabase env vars aren't set, returns the "guest"
// shape so the app still works (free tier) without auth configured.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      signedIn: false,
      tier: "free",
      freeDecanCredits: 0,
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in → free tier, no credits.
  if (!user) {
    return NextResponse.json({
      signedIn: false,
      tier: "free",
      freeDecanCredits: 0,
    });
  }

  // Fetch profile + entitlements + subscription in parallel.
  const [profileRes, entRes, subRes] = await Promise.all([
    supabase.from("profiles").select("tier, email").eq("id", user.id).single(),
    supabase
      .from("entitlements")
      .select("free_decan_credits, discount_pct")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  // If the auto-provisioning trigger hasn't created rows yet, fall back gracefully.
  const baseTier = profileRes.data?.tier ?? "member";
  const email = profileRes.data?.email ?? user.email;
  const freeDecanCredits = entRes.data?.free_decan_credits ?? 0;

  // Resolve effective tier: an active subscription upgrades to "subscriber".
  const subscriptionStatus = subRes.data?.status ?? null;
  const currentPeriodEnd = subRes.data?.current_period_end ?? null;
  const tier = subscriptionStatus === "active" ? "subscriber" : baseTier;

  return NextResponse.json({
    signedIn: true,
    email,
    tier,
    freeDecanCredits,
    subscriptionStatus,
    currentPeriodEnd,
  });
}
