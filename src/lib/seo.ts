import type { Metadata } from 'next';
import { LOCALES, otherLocale, type Dictionary, type Locale } from '@/content/i18n';
import { getSiteUrl, site as siteInfo, type Photo, type SiteContent } from '@/content/site';
import type { ProjectView } from '@/lib/projects/types';
import { homePath, projectsPath } from '@/lib/routes';
import { youTubeWatchUrl } from '@/lib/youtube';

const OG_LOCALE: Record<Locale, string> = { fr: 'fr_FR', en: 'en_GB' };

/**
 * Canonical, hreflang, Open Graph and Twitter tags for one page. Every page
 * sets all of them: Next replaces a parent's openGraph wholesale, so a page
 * that sets only a title would otherwise share the home page's URL and text
 * — and, once it sets openGraph at all, would lose the share image drawn by
 * [lang]/opengraph-image, hence the explicit reference.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  /** The page's path in any locale, for the canonical and hreflang links. */
  path: (locale: Locale) => string;
  /** Plain string: goes through the layout's "%s · VOIZ" template. */
  title: string | { absolute: string };
  description: string;
}): Metadata {
  const shareTitle = typeof title === 'string' ? `${title} · VOIZ` : title.absolute;
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: siteInfo.fullName };

  return {
    title,
    description,
    alternates: {
      canonical: path(locale),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, path(l)])),
        'x-default': path('fr'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: siteInfo.fullName,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[otherLocale(locale)]],
      title: shareTitle,
      description,
      url: path(locale),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description, images: [image] },
  };
}

// ---------------------------------------------------------------------------
// Structured data (schema.org JSON-LD)
// ---------------------------------------------------------------------------

/** Stable node ids, so every page's graph points at the same studio and founder. */
function ids(siteUrl: string) {
  return {
    organization: `${siteUrl}/#organization`,
    website: `${siteUrl}/#website`,
    founder: `${siteUrl}/#founder`,
  };
}

function absolute(siteUrl: string, src: string) {
  return src.startsWith('/') ? `${siteUrl}${src}` : src;
}

function imageObject(siteUrl: string, photo: Photo) {
  return {
    '@type': 'ImageObject',
    url: absolute(siteUrl, photo.src),
    width: photo.width,
    height: photo.height,
  };
}

/** A personal profile (linkedin.com/in/…) belongs to the founder, not the studio. */
const isPersonalProfile = (href: string) => /linkedin\.com\/in\//i.test(href);

/** The studio, its website and its founder — the home page's graph. */
export function homeJsonLd(locale: Locale, t: Dictionary, site: SiteContent) {
  const siteUrl = getSiteUrl();
  const id = ids(siteUrl);
  const links = site.social.map((s) => s.href).filter(Boolean);
  const studioLinks = links.filter((href) => !isPersonalProfile(href));
  const founderLinks = links.filter(isPersonalProfile);
  const { studio, founder } = site.photos;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': id.organization,
        name: siteInfo.fullName,
        alternateName: siteInfo.name,
        description: t.metaDescription,
        slogan: site.slogan,
        url: `${siteUrl}${homePath(locale)}`,
        logo: { '@type': 'ImageObject', url: `${siteUrl}/apple-icon.png`, width: 180, height: 180 },
        ...(studio ? { image: imageObject(siteUrl, studio) } : {}),
        address: {
          '@type': 'PostalAddress',
          addressLocality: siteInfo.address.locality,
          addressRegion: siteInfo.address.region,
          addressCountry: siteInfo.address.country,
        },
        areaServed: { '@type': 'Country', name: 'France' },
        knowsLanguage: ['fr', 'en'],
        founder: { '@id': id.founder },
        serviceType: t.services.map((s) => s.name),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t.servTitle,
          itemListElement: t.services.map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.name,
              description: [s.lead, s.detail].filter(Boolean).join(' '),
            },
          })),
        },
        ...(site.email ? { email: site.email } : {}),
        ...(studioLinks.length ? { sameAs: studioLinks } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': id.website,
        url: siteUrl,
        // Google reads the site name from here, so "VOIZ" rather than the domain.
        name: siteInfo.name,
        alternateName: siteInfo.fullName,
        inLanguage: [...LOCALES],
        publisher: { '@id': id.organization },
      },
      {
        '@type': 'Person',
        '@id': id.founder,
        name: siteInfo.founder,
        ...(t.aboutLiamRole ? { jobTitle: t.aboutLiamRole } : {}),
        worksFor: { '@id': id.organization },
        ...(founder ? { image: imageObject(siteUrl, founder) } : {}),
        ...(founderLinks.length ? { sameAs: founderLinks } : {}),
      },
    ],
  };
}

/** Breadcrumb and the list of published projects, for the projects page. */
export function projectsJsonLd(locale: Locale, t: Dictionary, projects: ProjectView[]) {
  const siteUrl = getSiteUrl();
  const id = ids(siteUrl);
  const pageUrl = `${siteUrl}${projectsPath(locale)}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: t.projectsMetaTitle,
        description: t.projectsMetaDescription,
        inLanguage: locale,
        isPartOf: { '@id': id.website },
        about: { '@id': id.organization },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: projects.length,
          itemListElement: projects.map((project, index) => {
            const url = project.soundcloudUrl ?? (project.youtubeId ? youTubeWatchUrl(project.youtubeId) : null);
            return {
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'CreativeWork',
                name: project.client ? `${project.title} / ${project.client}` : project.title,
                genre: project.kicker,
                ...(project.description ? { description: project.description } : {}),
                ...(project.thumbnailSrc ? { image: project.thumbnailSrc } : {}),
                ...(url ? { url } : {}),
                contributor: { '@id': id.organization },
              },
            };
          }),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'VOIZ', item: `${siteUrl}${homePath(locale)}` },
          { '@type': 'ListItem', position: 2, name: t.projectsPageTitle, item: pageUrl },
        ],
      },
    ],
  };
}
