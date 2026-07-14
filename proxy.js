// TarotByte — Auth proxy (formerly middleware in Next.js <16).
// Runs on every request to refresh the Supabase session cookie. Without this,
// the user's session can appear stale or "logged out" because the access token
// has expired but the cookie hasn't been refreshed.
//
// This is the fix for the "auth loop" bug where email confirmation succeeds
// but the session doesn't persist — the session cookie set by /auth/callback
// needs to be refreshed on every navigation for /api/me to see the user.
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Graceful pass-through when Supabase env vars aren't configured yet.
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Set on the request so downstream handlers see the refreshed token.
          request.cookies.set(name, value);
          // Set on the response so the browser persists the refreshed cookie.
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser() refreshes the session if the token is expiring and writes the
  // updated cookies back to the response via the setAll() above.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on all routes EXCEPT Next.js internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|oracle|decan-cards|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)",
  ],
};
