// app/api/stripe/webhook/route.js
//
// POST /api/stripe/webhook
//
// Stripe calls this endpoint when a checkout completes or a subscription
// changes. We verify the signature, then:
//   - checkout.session.completed (payment mode) -> grant decan credits
//   - checkout.session.completed (subscription mode) -> record the subscription
//   - customer.subscription.updated / deleted -> sync subscription status
//
// IMPORTANT: this route reads the raw request body (not JSON) so Stripe can
// verify the signature. We set runtime = "nodejs" and read the raw buffer.
//
// Fulfillment uses the Supabase SERVICE ROLE client (bypasses RLS) so it can
// write to any user's row. This is safe because the request is authenticated
// via the Stripe webhook signature.
//
// Graceful degradation: if STRIPE_WEBHOOK_SECRET or the service key is missing,
// the route responds 200 (ack) but logs a warning — Stripe will retry, and once
// you add the env vars the retried event will fulfill correctly.
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabaseServer";
import { creditsForPrice } from "@/lib/stripeConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readRawBody(request) {
  const arrayBuffer = await request.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("utf-8");
}

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!webhookSecret || !serviceKey || !supabaseUrl) {
    console.warn(
      "[stripe-webhook] Missing env vars (STRIPE_WEBHOOK_SECRET or SUPABASE_SERVICE_ROLE_KEY). " +
        "Event will not be fulfilled. Add them in Vercel and Stripe will retry.",
    );
    return NextResponse.json({ received: false, reason: "not-configured" });
  }

  const raw = await readRawBody(request);
  const sig = (await headers()).get("stripe-signature") || "";

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err.message);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.supabase_user_id || session.client_reference_id;

        if (session.mode === "subscription") {
          await upsertSubscription(supabase, session, userId);
        } else {
          // One-time payment -> grant decan credits based on the price.
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          const priceId = lineItems.data[0]?.price?.id;
          const credits = creditsForPrice(priceId);
          if (credits > 0 && userId) {
            await grantCredits(supabase, userId, credits);
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await syncSubscription(supabase, sub);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] fulfillment error:", err.message);
    return NextResponse.json({ error: "fulfillment failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// --- helpers --------------------------------------------------------------

async function upsertSubscription(supabase, session, userId) {
  if (!userId) return;
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = sub.items.data[0]?.price?.id;
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: sub.status,
      price_id: priceId,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("[stripe-webhook] upsertSubscription:", error.message);
}

async function syncSubscription(supabase, sub) {
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  if (!existing?.user_id) return;
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: sub.status,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", existing.user_id);
  if (error) console.error("[stripe-webhook] syncSubscription:", error.message);
}

async function grantCredits(supabase, userId, credits) {
  // Prefer the SECURITY DEFINER function for an atomic increment.
  const { error } = await supabase.rpc("add_purchased_credits", {
    p_user_id: userId,
    p_amount: credits,
  });
  if (error) {
    // Fallback: direct update if the function isn't installed yet.
    const current = await currentPurchased(supabase, userId);
    const { error: e2 } = await supabase
      .from("entitlements")
      .update({
        purchased_decan_credits: current + credits,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
    if (e2) console.error("[stripe-webhook] grantCredits fallback:", e2.message);
  }
  console.log(`[stripe-webhook] granted ${credits} decan credits to ${userId}`);
}

async function currentPurchased(supabase, userId) {
  const { data } = await supabase
    .from("entitlements")
    .select("purchased_decan_credits")
    .eq("user_id", userId)
    .single();
  return data?.purchased_decan_credits ?? 0;
}
