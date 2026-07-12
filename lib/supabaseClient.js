// TarotByte — Supabase browser client
// Used in client components for auth (sign in / sign up / session) and
// direct reads of the user's own data (RLS-protected).
//
// If Supabase env vars aren't set, returns null so callers can guard
// against calling methods on an unconfigured client.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
