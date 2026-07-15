// GET  /api/readings  — paginated reading history for the signed-in user
// POST /api/readings  — save a completed reading to the DB (fire-and-forget)
//
// GET  params:  ?limit=20&offset=0  (max limit 50)
// POST body:    { spreadId, context, tier, cards_json, verdict }
//
// POST is intentionally best-effort: guests and DB errors return
// { saved: false } with status 200 so the reading UI never breaks.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ readings: [], total: 0, signedIn: false });
  }

  const { searchParams } = new URL(request.url);
  const limit  = Math.min(parseInt(searchParams.get("limit")  || DEFAULT_LIMIT, 10), MAX_LIMIT);
  const offset = Math.max(parseInt(searchParams.get("offset") || 0, 10), 0);

  const { data, error, count } = await supabase
    .from("readings")
    .select("id, created_at, spread_id, context, tier, cards_json, verdict, tone", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ readings: [], total: 0, error: error.message });
  }

  return NextResponse.json({ readings: data ?? [], total: count ?? 0 });
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Best-effort: guests silently return saved:false
  if (!user) {
    return NextResponse.json({ saved: false, reason: "guest" });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ saved: false, reason: "bad_json" });
  }

  const { spreadId, context, tier, cards_json, verdict } = body;

  // Only persist Z (Astral Threads) and D (Decan Engine) readings.
  // Classic (T) readings are ephemeral by design.
  if (!tier || tier === "T") {
    return NextResponse.json({ saved: false, reason: "ephemeral_tier" });
  }

  if (!spreadId || typeof spreadId !== "string") {
    return NextResponse.json({ saved: false, reason: "missing_spread" });
  }

  const { data, error } = await supabase
    .from("readings")
    .insert({
      user_id:   user.id,
      spread_id: spreadId,
      context:   context  || null,
      tier,
      cards_json: cards_json ?? null,
      verdict:   verdict  || null,
      tone:      cards_json?.tone || null,
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.warn("[readings] insert error:", error.message);
    return NextResponse.json({ saved: false, reason: "db_error" });
  }

  return NextResponse.json({ saved: true, id: data.id, created_at: data.created_at });
}
