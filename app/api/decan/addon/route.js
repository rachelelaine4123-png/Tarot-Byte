// POST /api/decan/addon — consumes one of the member's free monthly Decan
// add-on credits. Called when a member powers up a reading with the Decan
// Engine and still has a free credit available.
//
// Returns:
//   200 { ok: true, freeDecanCredits: <remaining> }
//   401 { error: "not signed in" }
//   409 { error: "no free credits" }
//   503 { error: "supabase not configured" }  (env vars missing)
//
// This decrements on the server so the credit actually persists across
// sessions/devices. (Stripe checkout for the paid $2 path comes next phase.)
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "supabase not configured" },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  // Fetch current credits. Consume free credits first, then purchased.
  const { data: ent, error } = await supabase
    .from("entitlements")
    .select("free_decan_credits, purchased_decan_credits")
    .eq("user_id", user.id)
    .single();

  if (error || !ent) {
    return NextResponse.json({ error: "entitlements not found" }, { status: 500 });
  }

  const total = (ent.free_decan_credits || 0) + (ent.purchased_decan_credits || 0);
  if (total <= 0) {
    return NextResponse.json(
      { error: "no credits", checkout: true },
      { status: 409 },
    );
  }

  // Decrement free first; when free hits 0, start on purchased.
  let patch;
  if (ent.free_decan_credits > 0) {
    patch = { free_decan_credits: ent.free_decan_credits - 1 };
  } else {
    patch = { purchased_decan_credits: (ent.purchased_decan_credits || 0) - 1 };
  }
  patch.updated_at = new Date().toISOString();

  const { data: updated, error: updErr } = await supabase
    .from("entitlements")
    .update(patch)
    .eq("user_id", user.id)
    .select("free_decan_credits, purchased_decan_credits")
    .single();

  if (updErr) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    freeDecanCredits: (updated.free_decan_credits || 0) + (updated.purchased_decan_credits || 0),
  });
}
