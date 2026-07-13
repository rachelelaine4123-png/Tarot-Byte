// lib/stripeConfig.js
//
// Non-secret Stripe price IDs + display config. These IDs are safe to ship in
// the client bundle (Stripe publishable keys and price IDs are designed to be
// public — only the secret key must stay server-side).
//
// Created live on your Stripe account. To change a price, create a NEW price in
// Stripe and update the ID here (old prices stay associated with old checkouts).
//
// Pricing model (per docs/pricing-analysis.md):
//   - Decan Engine add-on: $2 member / $4 list, + 1 free/month for members
//   - 3-pack: $5 (3 decan credits at a bulk discount)
//   - Subscription: $6.99/month or $49/year (annual is the hero price)
//
export const STRIPE_PRICES = {
  decan_member_single: "price_1TsrbSAs2NGqVjlNy8vSIjot", // $2.00 one-time
  decan_list_single: "price_1TsrbSAs2NGqVjlNjTQ40OhN", // $4.00 one-time
  decan_3pack: "price_1TsrbTAs2NGqVjlNwgdNr4pQ", // $5.00 one-time (3 credits)
  sub_monthly: "price_1TsrbTAs2NGqVjlNdriuqTGm", // $6.99/month
  sub_annual: "price_1TsrbTAs2NGqVjlNoLSsroIJ", // $49.00/year
};

// Human-readable display used by the UI. Kept in sync with the Stripe prices.
export const PRICING = {
  decan: {
    memberSingle: { amount: 2, credits: 1, priceId: STRIPE_PRICES.decan_member_single },
    listSingle: { amount: 4, credits: 1, priceId: STRIPE_PRICES.decan_list_single },
    pack3: { amount: 5, credits: 3, priceId: STRIPE_PRICES.decan_3pack },
  },
  subscription: {
    monthly: { amount: 6.99, interval: "month", priceId: STRIPE_PRICES.sub_monthly },
    annual: { amount: 49, interval: "year", priceId: STRIPE_PRICES.sub_annual },
  },
};

// Helper: is Stripe configured on the server? (secret key present)
export function stripeReady() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Helper: which credits does a given price grant? (from price metadata, but
// hard-coded here as a fallback so fulfillment works even if metadata drifts.)
export function creditsForPrice(priceId) {
  if (priceId === STRIPE_PRICES.decan_member_single) return 1;
  if (priceId === STRIPE_PRICES.decan_list_single) return 1;
  if (priceId === STRIPE_PRICES.decan_3pack) return 3;
  return 0; // subscriptions grant unlimited access, not credits
}

export function isSubscriptionPrice(priceId) {
  return (
    priceId === STRIPE_PRICES.sub_monthly ||
    priceId === STRIPE_PRICES.sub_annual
  );
}
