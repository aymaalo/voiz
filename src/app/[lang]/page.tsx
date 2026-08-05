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
import { getDictionary, isLocale, otherLocale } from '@/content/i18n';
import { getSiteUrl, site } from '@/content/site';
import { homePath } from '@/lib/routes';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);
  const siteUrl = getSiteUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.fullName,
    alternateName: site.name,
    description: t.metaDescription,
    url: `${siteUrl}/${lang}`,
    founder: { '@type': 'Person', name: site.founder },
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
        // Static, author-controlled payload.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Nav locale={lang} t={t} switchHref={homePath(otherLocale(lang))} />

      <main>
        <Hero t={t} />
        <Studio t={t} />
        <Projects locale={lang} t={t} />
        <Marquee words={t.marquee} variant="ivoire" />
        <Services t={t} />
        <Testimonials t={t} />
        <About t={t} />
        <Contact t={t} locale={lang} />
      </main>

      <Footer t={t} />
    </>
  );
}
