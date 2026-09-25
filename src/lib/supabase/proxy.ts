import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from './env';

const LOGIN = '/admin/login';

/**
 * Refreshes the Supabase session cookie for back-office requests and bounces
 * signed-out visitors to the login page. This is only the optimistic check —
 * every admin page and server action re-verifies with requireAdmin().
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Nothing may run between createServerClient and getClaims(), or sessions
  // can silently fail to refresh.
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && request.nextUrl.pathname !== LOGIN) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN;
    url.search = '';
    const redirect = NextResponse.redirect(url);
    // Carry over any cookies getClaims() cleared, so a dead session is dropped.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}
