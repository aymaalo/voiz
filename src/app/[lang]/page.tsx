import { notFound } from 'next/navigation';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Nav } from '@/components/sections/Nav';
import { Projects } from '@/components/sections/Projects';
import { Services } from '@/components/sections/Services';
import { Studio } from '@/components/sections/Studio';
import { Testimonials } from '@/components/sections/Testimonials';
import { Marquee } from '@/components/ui/Marquee';
import { isLocale, otherLocale } from '@/content/i18n';
import { getSiteUrl, site as siteInfo } from '@/content/site';
import { getContent } from '@/lib/content/data';
import { getProjectsForLocale } from '@/lib/projects/data';
import { homePath } from '@/lib/routes';

// Projects and texts come from Supabase. Saves in /admin refresh the page immediately;
// this only picks up edits made straight in the Supabase dashboard.
export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const { t, site } = await getContent(lang);
  const siteUrl = getSiteUrl();
  const { projects, tags } = await getProjectsForLocale(lang, t, { featuredOnly: true });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteInfo.fullName,
    alternateName: siteInfo.name,
    description: t.metaDescription,
    url: `${siteUrl}/${lang}`,
    founder: { '@type': 'Person', name: siteInfo.founder },
    knowsLanguage: ['fr', 'en'],
    areaServed: 'FR',
    serviceType: t.services.map((s) => s.name),
    ...(site.email ? { email: site.email } : {}),
    ...(site.social.some((s) => s.href)
      ? { sameAs: site.social.filter((s) => s.href).map((s) => s.href) }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escaped: the texts come from the back-office, and a "</script>" in
        // one must not end the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <Nav locale={lang} t={t} switchHref={homePath(otherLocale(lang))} />

      <main>
        <Hero t={t} site={site} />
        <Studio t={t} site={site} />
        <Projects locale={lang} t={t} projects={projects} tags={tags} />
        <Marquee words={t.marquee} variant="ivoire" />
        <Services t={t} />
        <Testimonials t={t} site={site} />
        <About t={t} site={site} />
        <Contact t={t} locale={lang} site={site} />
      </main>

      <Footer t={t} site={site} />
    </>
  );
}
