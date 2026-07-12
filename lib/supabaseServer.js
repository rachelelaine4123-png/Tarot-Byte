// TarotByte — Supabase server client
// Used inside Next.js API routes (App Router) to read the authenticated
// user's session from cookies, and (when needed) run privileged operations
// with the service-role key.
//
// We use @supabase/ssr's createServerClient so the same cookie scheme works
// across middleware (session refresh) and API routes (session read).
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Returns a Supabase client bound to the incoming request's cookies.
 * Use this in API routes and Server Components to access the current user.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `set` call was invoked from a Server Component — cookies can
            // only be set from a Route Handler or Server Action. This is safe
            // to ignore if middleware is refreshing the session (it is).
          }
        },
      },
    },
  );
}

/**
 * Returns a Supabase client using the service-role key — bypasses RLS.
 * ONLY use on the server, NEVER expose to the client, and only for
// operations that need admin privileges (e.g. webhook-driven updates).
 */
export function createServiceClient() {
  const { createClient: createSupabase } = require("@supabase/supabase-js");
  return createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
}
