-- =====================================================================
-- TarotByte — Supabase Schema
-- Run this in Supabase: SQL Editor → paste → Run
-- Creates: profiles, entitlements, readings, subscriptions
-- + Row Level Security (users can only see their own data)
-- + Auto-provisioning (new users get a profile + 1 free decan credit)
-- =====================================================================

-- 1. PROFILES --------------------------------------------------------
-- One row per user. `tier` drives the reading ladder:
--   'free'     → Classic layer only
--   'member'   → Celestial layer + 1 free Decan add-on/mo + member pricing
--   'subscriber' → unlimited Decan Engine (everything)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  tier        text NOT NULL DEFAULT 'member',  -- anyone who signs up is at least 'member'
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. ENTITLEMENTS ----------------------------------------------------
-- Tracks the member's monthly free Decan add-on credit + discount.
-- `free_decan_credits` resets to 1 on the 1st of each month (see trigger).
CREATE TABLE IF NOT EXISTS public.entitlements (
  user_id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  free_decan_credits  int NOT NULL DEFAULT 1,
  credits_reset_at    timestamptz NOT NULL DEFAULT now(),  -- last reset time
  discount_pct        int NOT NULL DEFAULT 50,             -- member pays $2 of the $4 list = 50% off
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- 3. READINGS (saved history) ---------------------------------------
-- Lets members/subscribers revisit past readings.
CREATE TABLE IF NOT EXISTS public.readings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spread_id   text NOT NULL,           -- 'yes-no' | 'past-present-future' | 'energy-reading'
  context     text,                    -- 'Love' | 'Fortune' | 'Career' | null
  tier        text NOT NULL,           -- 'T' | 'Z' | 'D'
  cards_json  jsonb NOT NULL,          -- the full drawn cards + celestial data
  verdict     text,                    -- for yes-no
  tone        jsonb,                   -- reading-level celestial weather
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_readings_user ON public.readings(user_id, created_at DESC);

-- 4. SUBSCRIPTIONS ---------------------------------------------------
-- Mirrors Stripe subscription state. Updated via webhook.
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id   text UNIQUE,
  stripe_subscription_id text,
  status               text NOT NULL DEFAULT 'inactive',  -- 'active' | 'canceled' | 'past_due' | ...
  price_id             text,                              -- which Stripe price they're on
  current_period_end   timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- =====================================================================
-- ROW LEVEL SECURITY — users can only access THEIR OWN rows
-- =====================================================================
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions  ENABLE ROW LEVEL SECURITY;

-- Profiles: read + update own; insert handled by the auto-trigger (service role bypasses RLS)
DROP POLICY IF EXISTS "read own profile" ON public.profiles;
CREATE POLICY "read own profile" ON public.profiles  FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "update own profile" ON public.profiles;
CREATE POLICY "update own profile" ON public.profiles  FOR UPDATE USING (auth.uid() = id);

-- Entitlements: read own (selects drop credits client-side after a free add-on)
DROP POLICY IF EXISTS "read own entitlements" ON public.entitlements;
CREATE POLICY "read own entitlements" ON public.entitlements FOR SELECT USING (auth.uid() = user_id);

-- Readings: full CRUD on own
DROP POLICY IF EXISTS "read own readings" ON public.readings;
CREATE POLICY "read own readings" ON public.readings   FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert own readings" ON public.readings;
CREATE POLICY "insert own readings" ON public.readings   FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete own readings" ON public.readings;
CREATE POLICY "delete own readings" ON public.readings   FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions: read own (writes come from the Stripe webhook / service role)
DROP POLICY IF EXISTS "read own subscription" ON public.subscriptions;
CREATE POLICY "read own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================
-- AUTO-PROVISION: when a new auth user signs up, create their
-- profile + entitlements row automatically.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  INSERT INTO public.entitlements (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Drop existing trigger if re-running, then (re)create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- MONTHLY CREDIT RESET FUNCTION
-- Called by the app on entitlement read (lazy reset):
-- if current month > credits_reset_at's month, reset credits to 1.
-- Run via a Supabase Edge Function cron OR called from /api on read.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.refresh_member_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.entitlements
  SET free_decan_credits = 1,
      credits_reset_at = now(),
      updated_at = now()
  WHERE date_trunc('month', now()) > date_trunc('month', credits_reset_at);
END;
$$;

-- =====================================================================
-- Helper: get a user's effective tier (accounts for active subscription)
-- Used by API routes to gate features without exposing service-role logic.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.get_effective_tier(p_user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT CASE
    WHEN EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = p_user_id AND status = 'active'
        AND current_period_end > now()
    ) THEN 'subscriber'
    WHEN EXISTS (
      SELECT 1 FROM public.profiles WHERE id = p_user_id AND tier IN ('member','subscriber')
    ) THEN 'member'
    ELSE 'free'
  END;
$$;

-- =====================================================================
-- DONE. Verify it worked by running this in the SQL editor:
--   SELECT * FROM public.profiles LIMIT 5;
--   SELECT * FROM public.entitlements LIMIT 5;
-- (both should be empty until your first signup — that's correct)
-- =====================================================================
