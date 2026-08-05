/**
 * Single place for the values the client still has to supply.
 * Anything left empty degrades gracefully (see Footer / Contact).
 */
export const site = {
  name: 'VOIZ',
  fullName: 'VOIZ · Vortex of Noise',
  founder: 'Liam Grandsard',

  /** Public inbox shown to visitors. Leave empty to hide the mailto fallback. */
  email: '',

  /** TODO(client): real profile URLs. Empty string renders as plain text, not a dead link. */
  social: [
    { label: 'Instagram', href: '' },
    { label: 'LinkedIn', href: '' },
    { label: 'SoundCloud', href: '' },
    { label: 'TikTok', href: '' },
  ],
} as const;

/**
 * Absolute origin, used for canonical URLs, hreflang, sitemap and OG tags.
 * Set NEXT_PUBLIC_SITE_URL once the domain is attached; on Vercel we fall back
 * to the production domain of the project.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return 'http://localhost:3000';
}
