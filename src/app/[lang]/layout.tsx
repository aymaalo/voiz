import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import { notFound } from 'next/navigation';
import { FilmGrain, LivingBackground } from '@/components/ui/BackgroundFX';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getDictionary, isLocale, LOCALES, type Locale } from '@/content/i18n';
import { getSiteUrl } from '@/content/site';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument',
  display: 'swap',
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const t = getDictionary(lang);
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.metaTitle, template: `%s · VOIZ` },
    description: t.metaDescription,
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: '/fr', en: '/en', 'x-default': '/fr' },
    },
    openGraph: {
      type: 'website',
      siteName: 'VOIZ · Vortex of Noise',
      locale: lang === 'fr' ? 'fr_FR' : 'en_GB',
      title: t.metaTitle,
      description: t.metaDescription,
      url: `/${lang}`,
    },
    twitter: { card: 'summary_large_image', title: t.metaTitle, description: t.metaDescription },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#06070b',
  colorScheme: 'dark',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const t = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${instrumentSerif.variable}`}
      // Tells Next the CSS smooth-scrolling is intentional so it can suspend it
      // during route transitions; without this, the post-navigation scroll
      // resets animate and race, gliding the new page down to the footer.
      data-scroll-behavior="smooth"
    >
      <body className="relative min-h-screen bg-noir">
        <ScrollReveal />
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded-full focus:bg-orange focus:px-5 focus:py-3 focus:text-[13px] focus:font-bold focus:text-noir focus:uppercase"
        >
          {t.skipToContent}
        </a>
        <LivingBackground />
        <FilmGrain />
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
