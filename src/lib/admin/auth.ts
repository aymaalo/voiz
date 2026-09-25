import 'server-only';

import { redirect } from 'next/navigation';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export const LOGIN_PATH = '/admin/login';

/**
 * Verifies the session server-side (getClaims checks the JWT signature, unlike
 * getSession) and looks the account up in the admins allowlist. Memoised per
 * request so a layout, its page and a server action share one lookup.
 */
export const getAdminSession = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) return { supabase, user: null, isAdmin: false } as const;

  const { data: row } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', claims.sub)
    .maybeSingle();

  return {
    supabase,
    user: { id: claims.sub, email: typeof claims.email === 'string' ? claims.email : null },
    isAdmin: Boolean(row),
  } as const;
});

/** For every back-office page and server action. RLS enforces the same rule in the database. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.user || !session.isAdmin) redirect(LOGIN_PATH);
  return { supabase: session.supabase, user: session.user };
}
