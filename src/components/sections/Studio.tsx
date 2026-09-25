import Image from 'next/image';
import type { Dictionary } from '@/content/i18n';
import { site } from '@/content/site';

export function Studio({ t }: { t: Dictionary }) {
  const photo: string = site.photos.studio;

  return (
    <section className="relative overflow-hidden">
      {/* Photo 1: stacked above the text on small screens; on desktop it takes
          the right half at full height and melts into the black on its left,
          so it never sits under the copy. */}
      {/* The fades are masks, not black overlays: the page behind has a living
          warm tint, and a painted #06070b edge would show as a seam against it. */}
      {photo ? (
        <div className="vz-fade-studio relative h-[280px] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[58%]">
          <Image
            src={photo}
            alt={t.studioPhotoAlt}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="relative mx-auto max-w-[1280px] px-5 pt-[70px] pb-[90px] md:px-10 md:pt-[150px] md:pb-[150px]">
        <div className={photo ? 'max-w-[640px]' : 'max-w-[860px]'}>
          <p
            data-reveal=""
            className="m-0 text-[clamp(26px,6vw,46px)] leading-[1.22] font-normal tracking-[-.01em] text-pretty md:text-[clamp(30px,3.4vw,46px)]"
          >
            {/* Instrument Serif has a far smaller x-height than Inter, so the
                inline accent is scaled up to sit optically level with it. */}
            {t.pitchA} <span className="font-serif text-[1.12em] text-orange">{t.pitchB}</span>{' '}
            {t.pitchC}
          </p>

          <div
            data-reveal=""
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
            className="mt-8 flex max-w-[560px] flex-col gap-4 md:mt-10"
          >
            {t.pitchBody.map((p) => (
              <p key={p} className="m-0 text-[16px] leading-[1.7] text-ivoire/75 text-pretty md:text-[17px]">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
