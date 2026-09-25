/**
 * YouTube helpers shared by the site and the back-office. No server-only
 * imports, so client components can use them too.
 */

const ID = /^[A-Za-z0-9_-]{11}$/;

const HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

/**
 * Accepts every link shape people copy from YouTube — watch, youtu.be share
 * links, shorts, live, embed — or a bare video id. Returns null otherwise.
 */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  let candidate: string | null = null;

  if (host === 'youtu.be') {
    candidate = url.pathname.split('/')[1] ?? null;
  } else if (HOSTS.has(host)) {
    const [first, second] = url.pathname.split('/').filter(Boolean);
    if (first === 'watch') candidate = url.searchParams.get('v');
    else if (first && ['embed', 'shorts', 'live', 'v'].includes(first)) candidate = second ?? null;
  }

  return candidate && ID.test(candidate) ? candidate : null;
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export type ThumbnailQuality = 'maxresdefault' | 'mqdefault';

export function youTubeThumbnailUrl(id: string, quality: ThumbnailQuality): string {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
}

/** Privacy-enhanced embed; `autoplay` because it is only mounted on a click. */
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/** "3:42", "1:02:03" or plain seconds → seconds. Empty → null; invalid → NaN. */
export function parseDuration(input: string): number | null {
  const value = input.trim();
  if (!value) return null;
  if (!/^\d+(:\d{1,2}){0,2}$/.test(value)) return Number.NaN;

  const parts = value.split(':').map(Number);
  if (parts.slice(1).some((p) => p >= 60)) return Number.NaN;
  return parts.reduce((total, part) => total * 60 + part, 0);
}
