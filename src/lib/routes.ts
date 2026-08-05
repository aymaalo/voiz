import type { Locale } from '@/content/i18n';

/** The projects page slug is localised; every other route is the locale root. */
export const PROJECTS_SLUG: Record<Locale, string> = {
  fr: 'projets',
  en: 'projects',
};

export function homePath(locale: Locale): string {
  return `/${locale}`;
}

export function projectsPath(locale: Locale): string {
  return `/${locale}/${PROJECTS_SLUG[locale]}`;
}
