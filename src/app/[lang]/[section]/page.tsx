import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { Nav } from '@/components/sections/Nav';
import { Projects } from '@/components/sections/Projects';
import { JsonLd } from '@/components/seo/JsonLd';
import { Marquee } from '@/components/ui/Marquee';
import { isLocale, LOCALES, otherLocale, type Locale } from '@/content/i18n';
import { getContent } from '@/lib/content/data';
import { getProjectsForLocale } from '@/lib/projects/data';
import { homePath, PROJECTS_SLUG, projectsPath } from '@/lib/routes';
import { pageMetadata, projectsJsonLd } from '@/lib/seo';

/**
 * Only the localised projects slugs resolve here — /fr/projets and /en/projects.
 * Anything else 404s through resolve() below. (Not `dynamicParams = false`:
 * with it, Next 16 fails to regenerate these pages after an on-demand
 * revalidation — NoFallbackError — and keeps serving the stale copy.)
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang, section: PROJECTS_SLUG[lang] }));
}

// See [lang]/page.tsx — /admin saves refresh this page immediately.
export const revalidate = 3600;

function resolve(lang: string, section: string): Locale | null {
  if (!isLocale(lang)) return null;
  return PROJECTS_SLUG[lang] === section ? lang : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}): Promise<Metadata> {
  const { lang, section } = await params;
  const locale = resolve(lang, section);
  if (!locale) return {};

  const { t } = await getContent(locale);
  return pageMetadata({
    locale,
    path: projectsPath,
    title: t.projectsMetaTitle,
    description: t.projectsMetaDescription,
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}) {
  const { lang, section } = await params;
  const locale = resolve(lang, section);
  if (!locale) notFound();

  const { t, site } = await getContent(locale);
  const other = otherLocale(locale);
  const { projects, tags } = await getProjectsForLocale(locale, t);

  return (
    <>
      <JsonLd data={projectsJsonLd(locale, t, projects)} />

      <Nav
        locale={locale}
        t={t}
        switchHref={projectsPath(other)}
        anchorBase={homePath(locale)}
      />

      <main id="top">
        <section className="mx-auto max-w-[1280px] px-5 pt-[130px] pb-4 md:px-10 md:pt-[170px]">
          <Link
            href={homePath(locale)}
            className="text-[12px] font-semibold tracking-[.18em] text-muted uppercase transition-colors hover:text-orange"
          >
            ← {t.backHome}
          </Link>
          <h1 className="mt-6 mb-4 text-[clamp(44px,8vw,110px)] leading-none font-black tracking-[-.04em] uppercase">
            {t.projectsPageTitle}
          </h1>
          <p className="m-0 max-w-[680px] font-serif text-[22px] text-orange md:text-[26px]">
            {t.projectsPageIntro}
          </p>
        </section>

        <Projects locale={locale} t={t} projects={projects} tags={tags} variant="page" />

        <Marquee words={t.marquee} variant="ivoire" />
        <Contact t={t} locale={locale} site={site} />
      </main>

      <Footer t={t} site={site} anchorBase={homePath(locale)} />
    </>
  );
}
