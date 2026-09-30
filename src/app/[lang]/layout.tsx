import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { FilmGrain, LivingBackground } from '@/components/ui/BackgroundFX';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getDictionary, isLocale, LOCALES, type Locale } from '@/content/i18n';
import { getSiteUrl } from '@/content/site';
import { getContent } from '@/lib/content/data';
import { homePath } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { instrumentSerif, inter } from '../fonts';
import '../globals.css';

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

  const { t } = await getContent(lang);

  // The home page's tags; the projects page replaces them with its own.
  return {
    metadataBase: new URL(getSiteUrl()),
    ...pageMetadata({
      locale: lang,
      path: homePath,
      title: { absolute: t.metaTitle },
      description: t.metaDescription,
    }),
    title: { default: t.metaTitle, template: `%s · VOIZ` },
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
