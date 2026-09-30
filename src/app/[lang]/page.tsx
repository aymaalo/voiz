import { notFound } from 'next/navigation';
import { preload } from 'react-dom';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Nav } from '@/components/sections/Nav';
import { Projects } from '@/components/sections/Projects';
import { Services } from '@/components/sections/Services';
import { Studio } from '@/components/sections/Studio';
import { Testimonials } from '@/components/sections/Testimonials';
import { JsonLd } from '@/components/seo/JsonLd';
import { Marquee } from '@/components/ui/Marquee';
import { isLocale, otherLocale } from '@/content/i18n';
import { heroVideo } from '@/content/site';
import { getContent } from '@/lib/content/data';
import { getProjectsForLocale } from '@/lib/projects/data';
import { homePath } from '@/lib/routes';
import { homeJsonLd } from '@/lib/seo';

// Projects and texts come from Supabase. Saves in /admin refresh the page immediately;
// this only picks up edits made straight in the Supabase dashboard.
export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const { t, site } = await getContent(lang);
  const { projects, tags } = await getProjectsForLocale(lang, t, { featuredOnly: true });

  // The hero's poster frame is what paints first (the video only loads after
  // hydration), so it is the page's largest contentful paint: fetch it early.
  preload(heroVideo.poster, { as: 'image', fetchPriority: 'high' });

  return (
    <>
      <JsonLd data={homeJsonLd(lang, t, site)} />

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
