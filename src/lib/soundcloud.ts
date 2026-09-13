/**
 * SoundCloud helpers shared by the site and the back-office. No server-only
 * imports, so client components can use them too.
 */

const PAGE_HOSTS = new Set(['soundcloud.com', 'www.soundcloud.com', 'm.soundcloud.com']);
const SHORT_HOST = 'on.soundcloud.com';

export type SoundCloudLink =
  /** A track or playlist page, normalised to https://soundcloud.com/… */
  | { kind: 'page'; url: string }
  /** An on.soundcloud.com share link — must be resolved server-side first. */
  | { kind: 'short'; url: string };

export function parseSoundCloudUrl(input: string): SoundCloudLink | null {
  const value = input.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const path = url.pathname.replace(/\/+$/, '');

  if (host === SHORT_HOST && path.length > 1) {
    return { kind: 'short', url: `https://${SHORT_HOST}${path}` };
  }
  // At least artist/track (or artist/sets/playlist); a bare profile has nothing to play.
  if (PAGE_HOSTS.has(host) && path.split('/').filter(Boolean).length >= 2) {
    // Drop tracking parameters (?si=, utm_…): the page path is the identity.
    return { kind: 'page', url: `https://soundcloud.com${path}` };
  }
  return null;
}

/** The official embeddable player, in the site's orange. */
export function soundCloudEmbedUrl(pageUrl: string, { autoplay }: { autoplay: boolean }): string {
  const params = new URLSearchParams({
    url: pageUrl,
    color: '#ff5300',
    auto_play: String(autoplay),
    visual: 'true',
    hide_related: 'true',
    show_comments: 'false',
    show_reposts: 'false',
    show_teaser: 'false',
  });
  return `https://w.soundcloud.com/player/?${params}`;
}
