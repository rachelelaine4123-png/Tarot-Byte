// TarotByte — Auth proxy (middleware)
// Runs on every request to refresh the Supabase session cookie. Without this,
// the user's session can appear stale or "logged out" because the access token
// has expired but the cookie hasn't been refreshed.
//
// We keep the matcher tight so static assets / Next internals aren't slowed.
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  // Graceful pass-through when Supabase env vars aren't configured yet
  // (e.g. local dev before keys are set, or a preview without secrets).
  // This prevents the proxy from crashing every request in the absence of keys.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response.cookies.set(name, value);
      },
    },
  });

  // getUser() refreshes the session if the token is expiring and writes the
  // updated cookie back to the response via the setAll() above.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on all routes EXCEPT Next.js internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)",
  ],
};
