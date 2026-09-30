import 'server-only';

import type { Locale } from '@/content/i18n';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createPublicClient } from '@/lib/supabase/server';
import { applyContent } from './fields';

export const CONTENT_CACHE_TAG = 'content';

/**
 * Every saved field, from Next's data cache — same scheme as the projects:
 * /admin/content saves expire the tag, the hourly revalidate only picks up
 * edits made directly in the Supabase dashboard.
 */
async function getStoredContent(): Promise<Map<string, unknown>> {
  if (!isSupabaseConfigured) return new Map();

  const supabase = createPublicClient({ tags: [CONTENT_CACHE_TAG], revalidate: 3600 });
  const { data, error } = await supabase.from('site_content').select('key, value');

  if (error) {
    // The table arrives with a migration; until it is applied, the site simply
    // shows the texts written in the code.
    if (error.code === 'PGRST205' || error.code === '42P01') {
      console.warn('[content] public.site_content is missing — apply the Supabase migrations.');
      return new Map();
    }
    // Anything else: throw, so a background revalidation keeps the last good page.
    throw new Error(`[content] ${error.message}`);
  }

  return new Map(data.map((row) => [row.key, row.value]));
}

/** The site's texts and settings for one locale, with /admin/content edits applied. */
export async function getContent(locale: Locale) {
  return applyContent(locale, await getStoredContent());
}
