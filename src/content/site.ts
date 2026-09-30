export type Photo = { src: string; width: number; height: number };

export type PhotoSlot = 'studio' | 'testimonials' | 'founder' | 'contact';

export type SocialLink = { label: string; href: string };

/**
 * The part of `site` the client can change from /admin/content. The values in
 * `site` below are the defaults: what shows until a field is saved there.
 */
export type SiteContent = {
  /** Brand line under "Vortex of Noise" in the hero. English in both locales. */
  slogan: string;
  /** Public inbox shown to visitors. Empty hides the mailto fallback. */
  email: string;
  /** Empty href renders as plain text, not a dead link. */
  social: SocialLink[];
  /** null simply leaves the photo out; every section still reads cleanly without it. */
  photos: Record<PhotoSlot, Photo | null>;
};

/**
 * Single place for the values the client still has to supply.
 * Anything left empty degrades gracefully (see Footer / Contact).
 */
export const site = {
  name: 'VOIZ',
  fullName: 'VOIZ · Vortex of Noise',
  founder: 'Liam Grandsard',
  /** For search engines' local results; the studio has no public street address. */
  address: { locality: 'Nantes', region: 'Pays de la Loire', country: 'FR' },
  slogan: 'Turning noise into sounds people remember',

  /**
   * Photos from the V2 feedback, web-sized copies (full-resolution originals are
   * in "VOIZ - SITE WEB DOSSIER/SOURCES V2", outside the build).
   */
  photos: {
    /** Photo 1 — studio presentation, full height on the right, fading into black. */
    studio: { src: '/images/studio.jpg', width: 2000, height: 1421 },
    /** Photo 2 — dimmed background behind the testimonials. */
    testimonials: { src: '/images/testimonials.jpg', width: 2400, height: 1600 },
    /** Photo 3 — Liam's portrait in About. */
    founder: { src: '/images/liam-grandsard.jpg', width: 1000, height: 1478 },
    /** Photo 4 — duotone texture behind the contact heading. */
    contact: { src: '/images/contact.jpg', width: 2400, height: 1549 },
  },

  email: 'hello@voizaudio.com',

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/voiz.audio/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/liam-grandsard-5974b627b/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@voizaudio' },
  ],
} satisfies SiteContent & Record<string, unknown>;

/**
 * Hero background. /media is served with a one-year immutable cache, so a new
 * cut must get a new file name (showreel-v2.mp4), never overwrite this one.
 */
export const heroVideo = { src: '/media/showreel-v1.mp4', poster: '/media/showreel-v1-poster.jpg' };

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
