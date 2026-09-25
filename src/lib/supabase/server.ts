import 'server-only';

import { createClient as createAnonClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import { supabasePublishableKey, supabaseUrl } from './env';

/** Session-aware client for the back-office: queries run as the signed-in user. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, which cannot write cookies. Safe to
          // ignore: src/proxy.ts refreshes the session on every /admin request.
        }
      },
    },
  });
}

/**
 * Cookie-less client for the public site. It reads as `anon`, so RLS only
 * ever returns published content.
 *
 * With `cache`, every request lands in Next's data cache under those tags, so
 * a server action's updateTag() makes the very next page render refetch.
 * (unstable_cache does not honour updateTag: it serves one stale read first.)
 */
export function createPublicClient(cache?: { tags: string[]; revalidate: number }) {
  return createAnonClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: cache
      ? { fetch: (input, init) => fetch(input, { ...init, next: cache }) }
      : { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}
