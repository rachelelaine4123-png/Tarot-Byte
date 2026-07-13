-- supabase/migration_purchased_credits.sql
--
-- Phase 3: Stripe add-on credits.
--
-- Members can now BUY decan credits (single $2, 3-pack $5) in addition to the
-- 1 free credit they get each month. Purchased credits never expire and are
-- consumed AFTER the free monthly credit.
--
-- Run this in the Supabase SQL Editor. Safe to re-run (uses IF NOT EXISTS).
--

ALTER TABLE public.entitlements
  ADD COLUMN IF NOT EXISTS purchased_decan_credits int NOT NULL DEFAULT 0;

-- Allow the service role (webhooks) to read/write every row.
-- RLS policies below let users SELECT only their own row; the service role
-- bypasses RLS entirely, so webhook fulfillment works without extra grants.
DROP POLICY IF EXISTS "read own entitlements" ON public.entitlements;
CREATE POLICY "read own entitlements"
  ON public.entitlements FOR SELECT
  USING (auth.uid() = user_id);

-- subscriptions: allow the service role to upsert. Users read their own.
DROP POLICY IF EXISTS "read own subscription" ON public.subscriptions;
CREATE POLICY "read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Helpful: a function the webhook can call to add purchased credits atomically.
CREATE OR REPLACE FUNCTION public.add_purchased_credits(p_user_id uuid, p_amount int)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_total int;
BEGIN
  UPDATE public.entitlements
    SET purchased_decan_credits = purchased_decan_credits + p_amount,
        updated_at = now()
    WHERE user_id = p_user_id
    RETURNING purchased_decan_credits INTO new_total;
  RETURN new_total;
END;
$$;
