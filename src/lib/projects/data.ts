import 'server-only';

import type { Dictionary, Locale } from '@/content/i18n';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createPublicClient } from '@/lib/supabase/server';
import { formatDuration, youTubeThumbnailUrl } from '@/lib/youtube';
import { serviceLabels } from './services';
import { PROJECTS_CACHE_TAG, type ProjectView, type TagView } from './types';

/**
 * Cached in Next's data cache, across requests and (on Vercel) deployments.
 * Back-office saves expire the tag so the next visit is fresh; the hourly
 * revalidate only picks up edits made directly in the Supabase dashboard.
 */
async function getPublishedContent() {
  if (!isSupabaseConfigured) {
    console.warn(
      '[projects] Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    );
    return { projects: [], tags: [] };
  }

  const supabase = createPublicClient({ tags: [PROJECTS_CACHE_TAG], revalidate: 3600 });
  const [projects, tags] = await Promise.all([
    supabase
      .from('projects')
      .select(
        'id, kind, title_fr, title_en, client, description_fr, description_en, services, youtube_id, soundcloud_url, thumbnail, duration_seconds, featured, project_tags(tag_id)',
      )
      .eq('published', true)
      .order('position')
      .order('id'),
    supabase.from('tags').select('id, label_fr, label_en').order('position').order('id'),
  ]);

  // Throw rather than return an empty list: during a background revalidation
  // Next then keeps serving the last good page instead of caching "no projects".
  if (projects.error) throw new Error(`[projects] ${projects.error.message}`);
  if (tags.error) throw new Error(`[projects] ${tags.error.message}`);

  return { projects: projects.data, tags: tags.data };
}

/**
 * @param featuredOnly the home page selection; the projects page lists everything published.
 */
export async function getProjectsForLocale(
  locale: Locale,
  t: Dictionary,
  { featuredOnly = false }: { featuredOnly?: boolean } = {},
): Promise<{ projects: ProjectView[]; tags: TagView[] }> {
  const content = await getPublishedContent();
  const pick = (fr: string, en: string) => (locale === 'en' && en.trim() ? en : fr);

  const labels = new Map(content.tags.map((tag) => [tag.id, pick(tag.label_fr, tag.label_en)]));
  const order = new Map(content.tags.map((tag, index) => [tag.id, index]));
  const usedTagIds = new Set<number>();

  const projects = content.projects
    .filter((row) => !featuredOnly || row.featured)
    .map((row): ProjectView => {
      const tagIds = row.project_tags
        .map((pt) => pt.tag_id)
        .filter((id) => labels.has(id))
        .sort((a, b) => order.get(a)! - order.get(b)!);
      tagIds.forEach((id) => usedTagIds.add(id));

      const kind = row.kind === 'audio' ? 'audio' : 'video';

      return {
        id: String(row.id),
        kind,
        title: pick(row.title_fr, row.title_en),
        client: row.client,
        description: pick(row.description_fr, row.description_en),
        kicker: tagIds.length
          ? labels.get(tagIds[0])!
          : kind === 'audio'
            ? t.kindAudio
            : t.kindVideo,
        services: serviceLabels(row.services),
        tagIds: tagIds.map(String),
        youtubeId: row.youtube_id,
        soundcloudUrl: kind === 'audio' ? row.soundcloud_url : null,
        thumbnailSrc: row.youtube_id
          ? youTubeThumbnailUrl(
              row.youtube_id,
              row.thumbnail === 'maxresdefault' ? 'maxresdefault' : 'mqdefault',
            )
          : null,
        duration: row.duration_seconds != null ? formatDuration(row.duration_seconds) : null,
      };
    });

  // Only tags that would actually show something become filter pills.
  const tags = content.tags
    .filter((tag) => usedTagIds.has(tag.id))
    .map((tag) => ({ id: String(tag.id), label: labels.get(tag.id)! }));

  return { projects, tags };
}
