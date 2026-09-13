import type { Metadata, Viewport } from 'next';
import { getSiteUrl } from '@/content/site';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { instrumentSerif, inter } from '../fonts';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: 'Back-office', template: '%s · Back-office VOIZ' },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#06070b',
  colorScheme: 'dark',
};

/** Root layout for /admin — separate from the public [lang] tree. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen bg-noir">
        {isSupabaseConfigured ? (
          children
        ) : (
          <main className="mx-auto max-w-[560px] px-5 py-24">
            <h1 className="m-0 mb-4 text-[28px] font-black">Back-office non configuré</h1>
            <p className="m-0 text-muted">
              Renseignez <code>NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
              <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> dans les variables
              d’environnement, puis redéployez. Voir le README.
            </p>
          </main>
        )}
      </body>
    </html>
  );
}
