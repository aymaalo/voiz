import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { Nav } from '@/components/sections/Nav';
import { Projects } from '@/components/sections/Projects';
import { Marquee } from '@/components/ui/Marquee';
import { getDictionary, isLocale, LOCALES, otherLocale, type Locale } from '@/content/i18n';
import { homePath, PROJECTS_SLUG, projectsPath } from '@/lib/routes';

/**
 * Only the localised projects slugs resolve here — /fr/projets and /en/projects.
 * Anything else 404s, since dynamicParams is off.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang, section: PROJECTS_SLUG[lang] }));
}

export const dynamicParams = false;

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

  const t = getDictionary(locale);
  return {
    title: t.projectsPageTitle,
    description: t.projectsPageIntro,
    alternates: {
      canonical: projectsPath(locale),
      languages: { fr: projectsPath('fr'), en: projectsPath('en'), 'x-default': projectsPath('fr') },
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}) {
  const { lang, section } = await params;
  const locale = resolve(lang, section);
  if (!locale) notFound();

  const t = getDictionary(locale);
  const other = otherLocale(locale);

  return (
    <>
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
          <p className="m-0 max-w-[680px] font-serif text-[20px] text-orange italic md:text-[24px]">
            {t.projectsPageIntro}
          </p>
        </section>

        <Projects locale={locale} t={t} variant="page" />

        <Marquee words={t.marquee} variant="ivoire" />
        <Contact t={t} locale={locale} />
      </main>

      <Footer t={t} anchorBase={homePath(locale)} />
    </>
  );
}
