'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getAdminSession, LOGIN_PATH, requireAdmin } from '@/lib/admin/auth';
import { PROJECT_SERVICE_IDS } from '@/lib/projects/services';
import { PROJECTS_CACHE_TAG } from '@/lib/projects/types';
import { parseSoundCloudUrl } from '@/lib/soundcloud';
import { parseDuration, parseYouTubeId, youTubeThumbnailUrl, youTubeWatchUrl } from '@/lib/youtube';

export type FormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
};

type Supabase = Awaited<ReturnType<typeof requireAdmin>>['supabase'];

const GENERIC_ERROR = 'Une erreur est survenue. Réessayez dans un instant.';

/** The public pages read projects through this cache tag; expire it on every change. */
function contentChanged() {
  updateTag(PROJECTS_CACHE_TAG);
  revalidatePath('/admin', 'layout');
}

function firstErrors(error: z.ZodError): FormState['fieldErrors'] {
  const { fieldErrors } = z.flattenError(error);
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, messages]) => [key, (messages as string[])[0]]),
  );
}

const id = z.coerce.number().int().positive();

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

const SignInSchema = z.object({
  email: z.email('Adresse email invalide.'),
  password: z.string().min(1, 'Mot de passe requis.'),
});

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };

  const { supabase } = await getAdminSession();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: 'Email ou mot de passe incorrect.' };

  redirect('/admin');
}

export async function signOut() {
  const { supabase } = await getAdminSession();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}

const PasswordSchema = z
  .object({
    password: z.string().min(10, 'Au moins 10 caractères.').max(72, '72 caractères maximum.'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: 'Les deux mots de passe ne correspondent pas.',
  });

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const parsed = PasswordSchema.safeParse({
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return {
      error:
        error.code === 'same_password'
          ? 'Le nouveau mot de passe doit être différent de l’actuel.'
          : error.code === 'weak_password'
            ? 'Mot de passe trop faible.'
            : GENERIC_ERROR,
    };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const ProjectSchema = z
  .object({
    id: id.optional(),
    kind: z.enum(['video', 'audio'], 'Choisissez Vidéo ou Audio.'),
    youtube: z.string().trim().max(500),
    soundcloud: z.string().trim().max(500),
    title_fr: z
      .string()
      .trim()
      .min(1, 'Le titre en français est obligatoire.')
      .max(140, '140 caractères maximum.'),
    title_en: z.string().trim().max(140, '140 caractères maximum.'),
    client: z.string().trim().max(80, '80 caractères maximum.'),
    description_fr: z.string().trim().max(1000, '1000 caractères maximum.'),
    description_en: z.string().trim().max(1000, '1000 caractères maximum.'),
    services: z.array(z.enum(PROJECT_SERVICE_IDS)),
    duration: z
      .string()
      .trim()
      .transform((value, ctx) => {
        const seconds = parseDuration(value);
        if (Number.isNaN(seconds)) {
          ctx.addIssue({ code: 'custom', message: 'Format attendu : 3:42' });
          return z.NEVER;
        }
        return seconds;
      }),
    published: z.boolean(),
    featured: z.boolean(),
    tag_ids: z.array(id),
  })
  .superRefine((v, ctx) => {
    if (v.youtube && !parseYouTubeId(v.youtube)) {
      ctx.addIssue({ code: 'custom', path: ['youtube'], message: 'Ce lien YouTube n’est pas reconnu.' });
    }
    if (v.kind === 'video' && !v.youtube) {
      ctx.addIssue({ code: 'custom', path: ['youtube'], message: 'Collez le lien de la vidéo YouTube.' });
    }
    if (v.kind === 'audio') {
      if (v.soundcloud && !parseSoundCloudUrl(v.soundcloud)) {
        ctx.addIssue({
          code: 'custom',
          path: ['soundcloud'],
          message: 'Ce lien SoundCloud n’est pas reconnu : utilisez le lien d’un morceau ou d’une playlist.',
        });
      }
      if (!v.youtube && !v.soundcloud) {
        ctx.addIssue({
          code: 'custom',
          path: ['soundcloud'],
          message: 'Ajoutez un lien SoundCloud ou YouTube.',
        });
      }
    }
  });

const OEMBED_TIMEOUT = 5000;

/**
 * Asks YouTube whether the video exists and may be embedded, so a broken tile
 * never reaches the site. Network trouble does not block the save.
 */
async function checkEmbeddable(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(youTubeWatchUrl(videoId))}`,
      { cache: 'no-store', signal: AbortSignal.timeout(OEMBED_TIMEOUT) },
    );
    if (res.status === 401 || res.status === 403) {
      return 'Le propriétaire de cette vidéo n’autorise pas sa lecture sur d’autres sites.';
    }
    if (res.status === 400 || res.status === 404) {
      return 'Vidéo introuvable. Vérifiez le lien, et que la vidéo est publique ou non répertoriée.';
    }
  } catch {
    // YouTube unreachable — accept the link rather than lock the editor out.
  }
  return null;
}

/**
 * Turns a SoundCloud link into the canonical page URL the player needs —
 * following on.soundcloud.com share links — and checks it can be embedded.
 */
async function resolveSoundCloud(input: string): Promise<{ url: string } | { error: string }> {
  const link = parseSoundCloudUrl(input);
  if (!link) return { error: 'Ce lien SoundCloud n’est pas reconnu.' };

  let pageUrl = link.url;
  if (link.kind === 'short') {
    try {
      const res = await fetch(link.url, {
        redirect: 'follow',
        cache: 'no-store',
        signal: AbortSignal.timeout(OEMBED_TIMEOUT),
      });
      const resolved = parseSoundCloudUrl(res.url);
      if (!resolved || resolved.kind !== 'page') throw new Error('unresolved');
      pageUrl = resolved.url;
    } catch {
      return {
        error: 'Impossible de lire ce lien court. Collez le lien complet (soundcloud.com/…).',
      };
    }
  }

  try {
    const res = await fetch(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(pageUrl)}`,
      { cache: 'no-store', signal: AbortSignal.timeout(OEMBED_TIMEOUT) },
    );
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      return {
        error: 'Morceau introuvable sur SoundCloud. Vérifiez le lien, et que le morceau n’est pas privé.',
      };
    }
  } catch {
    // SoundCloud unreachable — accept the link rather than lock the editor out.
  }
  return { url: pageUrl };
}

/** maxresdefault only exists for HD uploads; mqdefault always does. */
async function pickThumbnail(videoId: string): Promise<'maxresdefault' | 'mqdefault'> {
  try {
    const res = await fetch(youTubeThumbnailUrl(videoId, 'maxresdefault'), {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(OEMBED_TIMEOUT),
    });
    return res.ok ? 'maxresdefault' : 'mqdefault';
  } catch {
    return 'mqdefault';
  }
}

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const parsed = ProjectSchema.safeParse({
    id: formData.get('id') || undefined,
    kind: formData.get('kind'),
    youtube: formData.get('youtube') ?? '',
    soundcloud: formData.get('soundcloud') ?? '',
    title_fr: formData.get('title_fr') ?? '',
    title_en: formData.get('title_en') ?? '',
    client: formData.get('client') ?? '',
    description_fr: formData.get('description_fr') ?? '',
    description_en: formData.get('description_en') ?? '',
    services: formData.getAll('services'),
    duration: formData.get('duration') ?? '',
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
    tag_ids: formData.getAll('tag_ids'),
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };

  const {
    id: projectId,
    youtube,
    soundcloud,
    tag_ids: tagIds,
    duration,
    services,
    ...fields
  } = parsed.data;
  const youtubeId = youtube ? parseYouTubeId(youtube) : null;

  let previous: { youtube_id: string | null; soundcloud_url: string | null } = {
    youtube_id: null,
    soundcloud_url: null,
  };
  if (projectId) {
    const { data } = await supabase
      .from('projects')
      .select('youtube_id, soundcloud_url')
      .eq('id', projectId)
      .maybeSingle();
    if (!data) return { error: 'Ce projet n’existe plus.' };
    previous = data;
  }

  if (youtubeId && youtubeId !== previous.youtube_id) {
    const problem = await checkEmbeddable(youtubeId);
    if (problem) return { fieldErrors: { youtube: problem } };
  }

  // SoundCloud only plays on audio tiles; a video keeps none.
  let soundcloudUrl: string | null = null;
  if (fields.kind === 'audio' && soundcloud) {
    const unchanged = parseSoundCloudUrl(soundcloud)?.url === previous.soundcloud_url;
    if (unchanged) {
      soundcloudUrl = previous.soundcloud_url;
    } else {
      const resolved = await resolveSoundCloud(soundcloud);
      if ('error' in resolved) return { fieldErrors: { soundcloud: resolved.error } };
      soundcloudUrl = resolved.url;
    }
  }

  const row = {
    ...fields,
    services: PROJECT_SERVICE_IDS.filter((s) => services.includes(s)),
    youtube_id: youtubeId,
    soundcloud_url: soundcloudUrl,
    // Re-checked on every save: YouTube can take a while to produce the HD still.
    thumbnail: youtubeId ? await pickThumbnail(youtubeId) : 'mqdefault',
    duration_seconds: duration,
  };

  let savedId = projectId;

  if (projectId) {
    const { data, error } = await supabase
      .from('projects')
      .update(row)
      .eq('id', projectId)
      .select('id');
    if (error || !data?.length) return { error: GENERIC_ERROR };
  } else {
    // New projects go to the top of the list.
    const { data: first } = await supabase
      .from('projects')
      .select('position')
      .order('position')
      .limit(1)
      .maybeSingle();

    const { data, error } = await supabase
      .from('projects')
      .insert({ ...row, position: (first?.position ?? 1) - 1 })
      .select('id')
      .single();
    if (error || !data) return { error: GENERIC_ERROR };
    savedId = data.id;
  }

  const tagsError = await syncProjectTags(supabase, savedId!, tagIds);
  if (tagsError) return { error: tagsError };

  contentChanged();
  redirect(`/admin?saved=${savedId}`);
}

async function syncProjectTags(supabase: Supabase, projectId: number, tagIds: number[]) {
  const { data: current, error } = await supabase
    .from('project_tags')
    .select('tag_id')
    .eq('project_id', projectId);
  if (error) return GENERIC_ERROR;

  const wanted = new Set(tagIds);
  const existing = new Set(current.map((row) => row.tag_id));
  const toAdd = [...wanted].filter((tagId) => !existing.has(tagId));
  const toRemove = [...existing].filter((tagId) => !wanted.has(tagId));

  if (toAdd.length) {
    const { error: insertError } = await supabase
      .from('project_tags')
      .insert(toAdd.map((tagId) => ({ project_id: projectId, tag_id: tagId })));
    if (insertError) return 'Le projet est enregistré, mais un tag n’existe plus. Rechargez la page.';
  }

  if (toRemove.length) {
    const { error: deleteError } = await supabase
      .from('project_tags')
      .delete()
      .eq('project_id', projectId)
      .in('tag_id', toRemove);
    if (deleteError) return GENERIC_ERROR;
  }

  return null;
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const projectId = id.parse(formData.get('id'));

  await supabase.from('projects').delete().eq('id', projectId);
  contentChanged();
}

export async function setProjectPublished(formData: FormData) {
  const { supabase } = await requireAdmin();
  const projectId = id.parse(formData.get('id'));
  const published = formData.get('published') === 'true';

  await supabase.from('projects').update({ published }).eq('id', projectId);
  contentChanged();
}

export async function setProjectFeatured(formData: FormData) {
  const { supabase } = await requireAdmin();
  const projectId = id.parse(formData.get('id'));
  const featured = formData.get('featured') === 'true';

  await supabase.from('projects').update({ featured }).eq('id', projectId);
  contentChanged();
}

const Direction = z.enum(['up', 'down']);

/**
 * Swaps a row with its neighbour and renumbers the whole list 0..n, which also
 * heals duplicate positions. Lists here are a few dozen rows at most.
 */
function reorder<T extends { id: number; position: number }>(
  rows: T[],
  targetId: number,
  direction: 'up' | 'down',
) {
  const from = rows.findIndex((row) => row.id === targetId);
  const to = direction === 'up' ? from - 1 : from + 1;
  if (from < 0 || to < 0 || to >= rows.length) return [];

  const next = [...rows];
  [next[from], next[to]] = [next[to], next[from]];
  return next
    .map((row, index) => ({ id: row.id, position: index, changed: row.position !== index }))
    .filter((row) => row.changed);
}

export async function moveProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const projectId = id.parse(formData.get('id'));
  const direction = Direction.parse(formData.get('direction'));

  const { data } = await supabase
    .from('projects')
    .select('id, position')
    .order('position')
    .order('id');

  await Promise.all(
    reorder(data ?? [], projectId, direction).map(({ id: rowId, position }) =>
      supabase.from('projects').update({ position }).eq('id', rowId),
    ),
  );
  contentChanged();
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

const TagSchema = z.object({
  id: id.optional(),
  label_fr: z.string().trim().min(1, 'Nom en français obligatoire.').max(40, '40 caractères maximum.'),
  label_en: z.string().trim().max(40, '40 caractères maximum.'),
});

export async function saveTag(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const parsed = TagSchema.safeParse({
    id: formData.get('id') || undefined,
    label_fr: formData.get('label_fr') ?? '',
    label_en: formData.get('label_en') ?? '',
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };

  const { id: tagId, ...fields } = parsed.data;

  if (tagId) {
    const { data, error } = await supabase.from('tags').update(fields).eq('id', tagId).select('id');
    if (error || !data?.length) return { error: GENERIC_ERROR };
  } else {
    // New tags go to the end of the filter bar.
    const { data: last } = await supabase
      .from('tags')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { error } = await supabase
      .from('tags')
      .insert({ ...fields, position: (last?.position ?? 0) + 1 });
    if (error) return { error: GENERIC_ERROR };
  }

  contentChanged();
  return { ok: true };
}

export async function deleteTag(formData: FormData) {
  const { supabase } = await requireAdmin();
  const tagId = id.parse(formData.get('id'));

  await supabase.from('tags').delete().eq('id', tagId);
  contentChanged();
}

export async function moveTag(formData: FormData) {
  const { supabase } = await requireAdmin();
  const tagId = id.parse(formData.get('id'));
  const direction = Direction.parse(formData.get('direction'));

  const { data } = await supabase.from('tags').select('id, position').order('position').order('id');

  await Promise.all(
    reorder(data ?? [], tagId, direction).map(({ id: rowId, position }) =>
      supabase.from('tags').update({ position }).eq('id', rowId),
    ),
  );
  contentChanged();
}
