/**
 * Single place for the values the client still has to supply.
 * Anything left empty degrades gracefully (see Footer / Contact).
 */
export const site = {
  name: 'VOIZ',
  fullName: 'VOIZ · Vortex of Noise',
  founder: 'Liam Grandsard',

  /**
   * Photos from the V2 feedback, web-sized copies (full-resolution originals are
   * in "VOIZ - SITE WEB DOSSIER/SOURCES V2", outside the build). An empty path
   * simply leaves the photo out, so the section still reads cleanly without it.
   */
  photos: {
    /** Photo 1 — studio presentation, full height on the right, fading into black. */
    studio: '/images/studio.jpg',
    /** Photo 2 — dimmed background behind the testimonials. */
    testimonials: '/images/testimonials.jpg',
    /** Photo 3 — Liam's portrait in About. */
    founder: { src: '/images/liam-grandsard.jpg', width: 1000, height: 1478 },
    /** Photo 4 — duotone texture behind the contact heading. */
    contact: '/images/contact.jpg',
  },

  /**
   * Hero background. /media is served with a one-year immutable cache, so a new
   * cut must get a new file name (showreel-v2.mp4), never overwrite this one.
   */
  heroVideo: { src: '/media/showreel-v1.mp4', poster: '/media/showreel-v1-poster.jpg' },

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
