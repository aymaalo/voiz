'use client';

import { useEffect, useRef } from 'react';
import { Equalizer } from '@/components/ui/Equalizer';
import { Marquee } from '@/components/ui/Marquee';
import type { Dictionary } from '@/content/i18n';

export function Hero({ t }: { t: Dictionary }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // The muted attribute alone is not always enough for autoplay — Safari and
    // some Chromium builds need the property set before play() is called.
    v.muted = true;
    v.defaultMuted = true;
    void v.play().catch(() => {
      /* Autoplay blocked: the poster/gradient still reads fine. */
    });
  }, []);

  return (
    <header id="top" className="relative h-[100svh] min-h-[600px] overflow-hidden md:min-h-[700px]">
      <video
        ref={videoRef}
        src="/media/anim_voiz.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full animate-[vz-hero-in_1.8s_ease-out_both] object-cover opacity-90"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,83,0,.14) 0%, transparent 60%),' +
            'radial-gradient(ellipse 110% 90% at 50% 35%, transparent 45%, rgba(6,7,11,.9) 100%),' +
            'linear-gradient(180deg, transparent 55%, #06070b 100%)',
        }}
      />

      <div className="absolute right-5 bottom-[92px] left-5 flex flex-col items-start justify-between gap-8 md:right-10 md:bottom-[110px] md:left-10 md:flex-row md:items-end md:gap-10">
        <div data-reveal="">
          <h1 className="m-0 text-[clamp(34px,9vw,58px)] leading-[.9] font-black tracking-[-.03em] uppercase md:text-[clamp(34px,4vw,58px)]">
            {/* One serif-orange counterpoint, like the section headings — not a
                style per word. */}
            Vortex{' '}
            <span className="font-serif text-[.92em] font-normal text-orange normal-case italic">
              of
            </span>{' '}
            Noise
          </h1>
          <p className="mt-[14px] mb-0 font-serif text-[clamp(16px,1.4vw,20px)] text-ivoire/80 italic">
            {t.mantra}
          </p>
        </div>

        <div
          data-reveal=""
          style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
          className="flex flex-none flex-wrap items-center gap-[14px]"
        >
          <a
            href="#contact"
            className="rounded-full bg-orange px-8 py-4 text-[13px] font-bold tracking-[.1em] text-noir uppercase transition hover:scale-[1.05] hover:bg-ivoire active:scale-[.97] md:px-[34px]"
          >
            {t.ctaContact}
          </a>
          <a
            href="#projets"
            className="flex items-center gap-3 rounded-full border border-ivoire/40 px-6 py-[14px] text-[13px] font-semibold tracking-[.1em] uppercase transition hover:scale-[1.05] hover:border-orange hover:text-orange active:scale-[.97] md:px-7"
          >
            <Equalizer />
            {t.ctaListen}
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <Marquee words={t.marquee} variant="orange" />
      </div>
    </header>
  );
}
