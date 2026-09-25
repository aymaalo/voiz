'use client';

import { useEffect, useRef } from 'react';
import { Equalizer } from '@/components/ui/Equalizer';
import { Marquee } from '@/components/ui/Marquee';
import type { Dictionary } from '@/content/i18n';
import { site } from '@/content/site';

export function Hero({ t }: { t: Dictionary }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // A fast-cut showreel is exactly the motion reduced-motion users opt out
    // of, and data savers should not pull 4 MB for a backdrop: both keep the
    // poster frame instead.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (reduced || saveData) return;

    // The muted attribute alone is not always enough for autoplay — Safari and
    // some Chromium builds need the property set before play() is called.
    v.muted = true;
    v.defaultMuted = true;
    v.src = site.heroVideo.src;
    void v.play().catch(() => {
      /* Autoplay blocked: the poster still reads fine. */
    });
  }, []);

  return (
    <header id="top" className="relative h-[100svh] min-h-[600px] overflow-hidden md:min-h-[700px]">
      {/* No src in the markup: it is set on mount, after the motion and
          data-saver checks, so the file is never fetched when not played. */}
      <video
        ref={videoRef}
        poster={site.heroVideo.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full animate-[vz-hero-in_1.8s_ease-out_both] object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          // The showreel is bright, colourful footage, so it sits under a
          // uniform veil plus the vignette; the headline and CTAs stay legible
          // on any frame while the reel still reads as moving picture.
          background:
            'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,83,0,.10) 0%, transparent 60%),' +
            'radial-gradient(ellipse 110% 90% at 50% 35%, transparent 38%, rgba(6,7,11,.92) 100%),' +
            'linear-gradient(180deg, rgba(6,7,11,.35) 0%, rgba(6,7,11,.35) 45%, #06070b 100%),' +
            'rgba(6,7,11,.3)',
        }}
      />

      <div className="absolute right-5 bottom-[92px] left-5 flex flex-col items-start justify-between gap-8 md:right-10 md:bottom-[110px] md:left-10 md:flex-row md:items-end md:gap-10">
        <div data-reveal="">
          <h1
            // The burnt word paints its glitch layer with a ::after copy of
            // itself; naming the heading explicitly keeps screen readers from
            // hearing "Noise" twice.
            aria-label="Vortex of Noise"
            className="m-0 text-[clamp(34px,9vw,58px)] leading-[.9] font-black tracking-[-.03em] uppercase md:text-[clamp(34px,4vw,58px)]"
          >
            {/* NOISE is the word that carries the brand, so it gets the burnt
                treatment; "of" steps back to a light lowercase connector. */}
            Vortex{' '}
            <span className="font-serif text-[.72em] font-normal text-ivoire/80 normal-case">
              of
            </span>{' '}
            Noise
          </h1>
          <p className="mt-3 mb-0 font-serif text-[clamp(20px,2vw,28px)] leading-[1.2] text-orange text-balance">
            {site.slogan}
          </p>
          <p className="mt-[18px] mb-0 max-w-[560px] text-[clamp(15px,1.3vw,19px)] leading-[1.45] text-ivoire/80 text-pretty">
            {t.heroTagline}
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
