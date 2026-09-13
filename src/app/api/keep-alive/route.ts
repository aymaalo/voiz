import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createPublicClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Daily Vercel Cron (see vercel.json). Supabase pauses free-plan projects after
 * a week without activity; a portfolio whose pages are cached may never query
 * the database on its own, so this does it once a day.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: false, reason: 'supabase_not_configured' });
  }

  const { error } = await createPublicClient().from('tags').select('id').limit(1);
  if (error) {
    console.error('[keep-alive] Supabase query failed', error.message);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
