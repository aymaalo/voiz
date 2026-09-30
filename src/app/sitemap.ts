import type { MetadataRoute } from 'next';
import { LOCALES, type Locale } from '@/content/i18n';
import { getSiteUrl } from '@/content/site';
import { CONTENT_CACHE_TAG } from '@/lib/content/data';
import { PROJECTS_CACHE_TAG } from '@/lib/projects/types';
import { homePath, projectsPath } from '@/lib/routes';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createPublicClient } from '@/lib/supabase/server';

// Refreshed with the pages: /admin saves expire both cache tags.
export const revalidate = 3600;

/**
 * When the site last really changed: the latest project or text edit. Google
 * only trusts lastmod when it is accurate, so rather than a build date the
 * field is left out when it cannot be known.
 */
async function lastModified(): Promise<Date | undefined> {
  if (!isSupabaseConfigured) return undefined;

  const supabase = createPublicClient({ tags: [PROJECTS_CACHE_TAG, CONTENT_CACHE_TAG], revalidate: 3600 });
  const latest = (table: 'projects' | 'site_content') =>
    supabase.from(table).select('updated_at').order('updated_at', { ascending: false }).limit(1).maybeSingle();

  const dates = (await Promise.all([latest('projects'), latest('site_content')]))
    .map(({ data }) => data?.updated_at)
    .filter((date): date is string => Boolean(date))
    .sort();

  return dates.length ? new Date(dates[dates.length - 1]) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const modified = await lastModified();

  const entries = (path: (locale: Locale) => string, priority: number) =>
    LOCALES.map((lang) => ({
      url: `${base}${path(lang)}`,
      ...(modified ? { lastModified: modified } : {}),
      changeFrequency: 'monthly' as const,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [l, `${base}${path(l)}`])),
          'x-default': `${base}${path('fr')}`,
        },
      },
    }));

  return [...entries(homePath, 1), ...entries(projectsPath, 0.8)];
}
