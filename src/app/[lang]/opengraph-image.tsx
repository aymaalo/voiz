import { ImageResponse } from 'next/og';
import { getDictionary, isLocale, LOCALES } from '@/content/i18n';

export const alt = 'VOIZ · Vortex of Noise';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/**
 * Best-effort Inter fetch. Google serves TTF to non-browser user agents, which
 * is what satori needs. If anything fails we fall back to the built-in font
 * rather than breaking the build.
 */
async function loadInter(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    }).then((r) => r.text());

    const url = css.match(/src: url\((https:\/\/[^)]+\.(?:ttf|otf))\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : 'fr');

  const [black, regular] = await Promise.all([loadInter(900), loadInter(400)]);
  const fonts = [
    black && { name: 'Inter', data: black, weight: 900 as const, style: 'normal' as const },
    regular && { name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 900 | 400; style: 'normal' }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 80,
          background: '#06070b',
          fontFamily: fonts.length ? 'Inter' : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: 220,
            width: 760,
            height: 760,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,83,0,.30) 0%, transparent 62%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: '-.04em',
            textTransform: 'uppercase',
            color: '#e6e7e2',
            lineHeight: 1,
          }}
        >
          Vortex&nbsp;<span style={{ color: '#3F3F3F' }}>of</span>&nbsp;
          <span style={{ color: '#FF5300' }}>Noise</span>
        </div>
        <div style={{ display: 'flex', marginTop: 26, fontSize: 34, color: 'rgba(230,231,226,.8)' }}>
          {t.mantra}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            fontSize: 21,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: '#FF5300',
            fontWeight: 900,
          }}
        >
          {/* Inter has no ◎, and satori cannot resolve a fallback for it here. */}
          {t.marquee.slice(0, 3).join(' · ')}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
