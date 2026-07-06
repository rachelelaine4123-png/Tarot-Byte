# TarotByte — "Hook It Up To The World" Launch Checklist

Everything to take TarotByte from the current static demo to a real, live, transacting product. Ordered so each step unblocks the next. Each item notes **what it's for**, **cost**, **rough effort**, and **who does it (you vs. me/agent)**.

Legend: 💰 cost · ⏱ effort · 👤 you · 🤖 me (agent can do it) · 🤝 both

---

## PHASE A — Foundations (do these first, in order)

### 1. 🤝 Git + GitHub (version control) — DO THIS FIRST
- **What for:** every other service (Vercel, deploy previews, collaborators) hooks into a Git repo. It's also your undo button and backup.
- **💰** Free.
- **⏱** 15 min.
- **Steps:**
  1. 👤 Create a free GitHub account (if you don't have one) at github.com.
  2. 👤 Create a new **private** repo named `tarotbyte`.
  3. 🤖 I can initialize git in the project, write a `.gitignore` (Next.js), and give you the exact push commands. You paste your repo URL and run them (or I can if you give me a token — your call).
  4. Commit early, commit often. Every feature = a commit.
- **Gotcha:** never commit secret keys (Stripe/Supabase/API keys). We'll use `.env.local` which `.gitignore` excludes automatically.

### 2. 👤 Domain — secure tarotbyte.io
- **What for:** your brand address; also needed before email + Stripe look legit.
- **💰** ~**$35–$45/year** for `.io` (it's pricier than `.com`). Budget-friendly alt: `.co` (~$30) or grab `tarotbyte.com` too if available (~$12) and redirect.
- **⏱** 20 min.
- **Where:** Cloudflare Registrar (at-cost, no markup, free privacy) is the best value. Namecheap and Porkbun are also good.
- **Steps:**
  1. 👤 Search + buy `tarotbyte.io`.
  2. 👤 Turn ON WHOIS privacy (free at Cloudflare/Porkbun).
  3. 👤 Leave DNS at the registrar for now; we point it at Vercel in Phase B.
- **Recommendation:** buy `tarotbyte.io` (your pick) **and** `tarotbyte.com` if free — cheap insurance against a copycat, and .com forwards to .io.

### 3. 🤖 Move the app to a real Next.js hosting target
- **What for:** the current build is a *static export* (great for the demo). To do logins, payments, and AI narration you need **server-side** capability. Vercel runs Next.js natively (they make Next.js).
- **⏱** I do the config; you click a few buttons.
- **Steps:**
  1. 🤖 I remove `output: "export"` and the basePath hacks (only needed for the S3 demo).
  2. 👤 Connect the GitHub repo to Vercel (below).

---

## PHASE B — Hosting & Deploy (Vercel)

### 4. 🤝 Vercel account + connect repo
- **What for:** production hosting, automatic deploys on every git push, free preview URLs for every branch, built-in SSL.
- **💰** **Free** (Hobby plan) is plenty to launch. Pro is $20/mo only if you outgrow it.
- **⏱** 30 min.
- **Steps:**
  1. 👤 Sign up at vercel.com **with your GitHub account** (one click).
  2. 👤 "Import Project" → pick the `tarotbyte` repo → Vercel auto-detects Next.js → Deploy.
  3. You immediately get a `tarotbyte.vercel.app` URL that redeploys on every push.
- **Gotcha:** environment variables (keys) get added in Vercel's dashboard, NOT in the repo. I'll give you the exact list of names to paste.

### 5. 👤🤝 Point tarotbyte.io at Vercel
- **What for:** your real domain serves the app with HTTPS.
- **⏱** 20 min + DNS propagation (minutes to a few hours).
- **Steps:**
  1. 👤 In Vercel → Project → Settings → Domains → add `tarotbyte.io` and `www.tarotbyte.io`.
  2. 👤 Vercel shows you 1–2 DNS records to add at your registrar (an A record or CNAME). Copy them into Cloudflare/registrar DNS.
  3. SSL is automatic + free once DNS resolves.

---

## PHASE C — Accounts & Data (Supabase)

### 6. 🤝 Supabase project (auth + database)
- **What for:** user accounts (email/password + Google login), storing members, subscription status, saved readings, and the "1 free decan add-on/month" counter.
- **💰** **Free** tier covers 50k monthly active users + 500MB DB — way more than launch needs. Pro is $25/mo later.
- **⏱** 1–2 hrs (mostly me wiring it).
- **Steps:**
  1. 👤 Create a free account at supabase.com → new project (pick a region near your users). Save the DB password.
  2. 👤 Copy the **Project URL** and **anon public key** → give to me (or paste into Vercel env vars). The **service_role key** stays secret (server only).
  3. 🤖 I build the schema:
     - `profiles` (id, email, tier, created_at)
     - `entitlements` (user_id, free_decan_credits, credits_reset_at, discount_pct)
     - `readings` (user_id, spread, cards_json, tier, created_at) — saved history
     - `subscriptions` (user_id, stripe_customer_id, status, current_period_end)
  4. 🤖 I wire Supabase Auth into the signup page (replacing the current demo `setDone(true)`).
  5. 🤖 I replace the `?unlocked=1/2` demo flags with **real** tier checks from the logged-in user.
- **Gotcha:** enable Row Level Security (RLS) so users can only read their own data — I'll write those policies.

### 7. 🤖 Turn the demo unlock flags into real gating
- **What for:** right now Celestial/Decan unlock via URL params (`?unlocked=1`). After Supabase, the tier comes from the actual account + subscription.
- Depends on #6.

---

## PHASE D — Payments (Stripe)

### 8. 🤝 Stripe account
- **What for:** charge for the $2/$4 Decan add-on and the subscription; manage the member's free monthly credit + discount.
- **💰** No monthly fee. Stripe takes **2.9% + $0.30 per transaction**. (On a $2 add-on that's ~$0.36, so net ~$1.64 — fine, but it's why bundling/subscription beats lots of tiny charges.)
- **⏱** 2–3 hrs (me), plus your account setup + bank details.
- **Steps:**
  1. 👤 Create a Stripe account. To go live you'll enter business info + a bank account for payouts. (Test mode works instantly without this.)
  2. 👤 In Stripe → Products, create:
     - **Decan Engine add-on** — one-time $4 (list) — I'll apply the $2 member price via a coupon/price logic.
     - **TarotByte Subscriber** — recurring, e.g. $5.99/mo and $49/yr.
  3. 👤 Copy **Publishable key** + **Secret key** (test keys first) → env vars.
  4. 🤖 I build:
     - Stripe Checkout for the add-on button (replaces the current stub).
     - Stripe Checkout / Billing Portal for subscriptions.
     - A **webhook** endpoint (`/api/stripe/webhook`) so when a payment succeeds, Supabase updates the user's tier/credits automatically.
  5. 👤 Add the webhook URL + signing secret in Stripe dashboard (I'll tell you exactly where).
- **Gotcha:** ALWAYS build/test in Stripe **test mode** first (fake card `4242 4242 4242 4242`). Flip to live keys only when everything works.
- **Order:** Stripe depends on Supabase (#6) being done, because payment success has to write to a user record.

---

## PHASE E — Email & Newsletter (The Weekly Byte)

### 9. 🤝 Transactional + newsletter email
- **What for:** account confirmation / password reset emails, AND "The Weekly Byte" newsletter.
- **💰** Options:
  - **Resend** — 3,000 emails/mo free, dev-friendly, great for transactional. Best default.
  - **Buttondown** or **Beehiiv** — better if you want the *newsletter* to feel like a real publication (subscriber management, archives). Beehiiv has a free tier.
  - Supabase can send auth emails itself to start (fine for launch).
- **⏱** 1–2 hrs.
- **Steps:**
  1. 👤 Pick one (Resend for transactional; add Beehiiv/Buttondown later for the newsletter proper).
  2. 👤 Verify your domain (add DNS records at registrar) so emails come from `hello@tarotbyte.io` and don't hit spam.
  3. 🤖 I wire the newsletter signup checkbox to the provider's API and set up auth email templates.
- **Gotcha:** domain verification (SPF/DKIM DNS records) is the step people skip — without it your email lands in spam. Takes 15 min + propagation.

---

## PHASE F — The AI Reading (make it feel alive)

### 10. 🤝 Live AI narration
- **What for:** right now interpretations are template-assembled from your data files. Live AI (e.g. OpenAI/Anthropic) can weave the card + reversed + celestial + decan into a warm, unique paragraph per reading — your real differentiator.
- **💰** Pay-per-use. With a small, well-designed prompt and a cheap model, each reading costs **fractions of a cent**. Budget maybe **$5–$20/mo** at early volume. **Set a spending cap** in the provider dashboard so you can't be surprised.
- **⏱** 2–3 hrs (me).
- **Steps:**
  1. 👤 Create an API account (OpenAI or Anthropic), add a payment method, **set a monthly usage limit** (e.g. $20).
  2. 👤 Give me the API key → it goes in Vercel env vars (server-side only, never in the browser).
  3. 🤖 I build a `/api/reading` route that takes the drawn cards + celestial data and returns AI narration, gated by tier (Classic = short, Decan = deep).
- **Gotcha:** keep the AI *grounded* — I'll feed it your card/decan data and instruct it to interpret only those, so it stays on-brand and can't hallucinate wild claims. Keep the "for reflection & entertainment" disclaimer.

---

## PHASE G — Launch polish (before you tell people)

### 11. 🤖 Legal + trust basics
- **What for:** credibility + covering yourself.
- **Items:** Privacy Policy, Terms of Service, the "for entertainment/reflection" disclaimer (you already have the tone), a cookie/consent note if you add analytics. 🤖 I can draft all of these.
- **💰** Free (I draft; a lawyer review is optional later).

### 12. 🤝 Analytics
- **What for:** see what's working (which readings, which upsells convert).
- **💰** Free: **Vercel Analytics** (privacy-friendly, one toggle) or **Plausible** ($9/mo) / **PostHog** (free tier, more powerful).
- **⏱** 15 min.

### 13. 🤝 Pre-launch QA pass
- 🤖 I test the full funnel end-to-end in Stripe/Supabase **test mode**: sign up → get free credit → use free decan → pay $2 for a second → subscribe → unlimited → cancel via billing portal.
- 👤 You do a "friends & family" soft test with a few real people before public launch.

---

## COST SUMMARY (to actually go live)

| Item | Cost to start | Ongoing |
|---|---|---|
| Git / GitHub | Free | Free |
| Domain (tarotbyte.io) | ~$40/yr | ~$40/yr |
| Vercel hosting | Free (Hobby) | $0 (until you scale) |
| Supabase | Free | $0 (until you scale) |
| Stripe | Free | 2.9% + $0.30 per charge |
| Email (Resend free / Beehiiv free) | Free | $0 to start |
| AI narration | ~$5 credit | ~$5–$20/mo at early volume |
| Analytics | Free | $0 |
| **TOTAL to launch** | **~$40–$50 (basically just the domain)** | **~$5–$20/mo + Stripe fees** |

**This fits your ~$100 budget with room to spare.** The domain is your only real upfront cost; everything else has a free tier that carries you well past launch, and the AI/Stripe costs only grow *with* revenue.

---

## RECOMMENDED ORDER (the critical path)
1. **Git + GitHub** (unblocks everything)
2. **Domain** (buy it before someone else does)
3. **Vercel** (real hosting + auto-deploy) — I convert the app off static export first
4. **Supabase** (accounts, tiers, saved readings, credit counter)
5. **Stripe** (add-on + subscription; depends on Supabase)
6. **Email** (auth + newsletter; verify domain)
7. **AI narration** (the magic; set a spend cap)
8. **Legal + analytics + QA**, then soft launch

## What I can start on RIGHT NOW (no accounts needed from you)
- Convert the app off static export → real Next.js (ready for Vercel).
- Scaffold the API routes as stubs (`/api/reading`, `/api/stripe/*`) so they're ready to fill in.
- Write the `.gitignore`, `.env.example` (the list of keys you'll need), Privacy Policy + ToS drafts.
- Build the Supabase schema SQL + Stripe product config as ready-to-paste scripts.

Just tell me which service you want to tackle first, and I'll prep everything on my side so your part is only "create account → paste key."
