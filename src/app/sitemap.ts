import type { MetadataRoute } from 'next';
import { LOCALES } from '@/content/i18n';
import { getSiteUrl } from '@/content/site';
import { homePath, projectsPath } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  const languages = (path: (l: (typeof LOCALES)[number]) => string) =>
    Object.fromEntries(LOCALES.map((l) => [l, `${base}${path(l)}`]));

  return [
    ...LOCALES.map((lang) => ({
      url: `${base}${homePath(lang)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 1,
      alternates: { languages: languages(homePath) },
    })),
    ...LOCALES.map((lang) => ({
      url: `${base}${projectsPath(lang)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: languages(projectsPath) },
    })),
  ];
}
