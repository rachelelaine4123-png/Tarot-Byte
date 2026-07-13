// app/api/checkout/route.js
//
// POST /api/checkout
// Body: { priceId: string }  (one of the IDs in lib/stripeConfig.js)
//
// Creates a Stripe Checkout Session and returns its URL. The client redirects
// the browser there. On success Stripe sends the customer back to
// /readings?checkout=success and fires a webhook to /api/stripe/webhook.
//
// Graceful degradation: if Stripe or Supabase is not configured, returns 503
// with a helpful message so the site never 500s on a payment attempt.
//
// Requires the user to be signed in (we attach their Supabase user id to the
// checkout metadata so the webhook can credit the right account).
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { stripeReady, STRIPE_PRICES } from "@/lib/stripeConfig";

export async function POST(request) {
  // 1. Config guards.
  if (!stripeReady()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Please check back soon." },
      { status: 503 },
    );
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Account system is not configured yet." },
      { status: 503 },
    );
  }

  // 2. Parse + validate the requested price.
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const { priceId } = body;
  const allowed = Object.values(STRIPE_PRICES);
  if (!priceId || !allowed.includes(priceId)) {
    return NextResponse.json({ error: "unknown price" }, { status: 400 });
  }

  // 3. Require a signed-in user.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Please sign in to purchase." },
      { status: 401 },
    );
  }

  // 4. Build the Checkout Session.
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const isSub =
    priceId === STRIPE_PRICES.sub_monthly || priceId === STRIPE_PRICES.sub_annual;

  // Resolve the success/cancel URLs relative to the request origin.
  const origin = request.headers.get("origin") || "https://www.tarotbyte.app";

  const sessionParams = {
    mode: isSub ? "subscription" : "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    // Carry the Supabase user id through so the webhook can fulfill the
    // correct account. Stripe stores these on the session + invoice.
    metadata: {
      supabase_user_id: user.id,
      email: user.email || "",
    },
    client_reference_id: user.id,
    success_url: `${origin}/readings?checkout=success`,
    cancel_url: `${origin}/readings?checkout=cancelled`,
  };

  // For one-time payments we also pass allow_promotion_codes off by default.
  // For subscriptions, Stripe automatically creates/retrieves the customer.

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout create failed:", err.message);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
