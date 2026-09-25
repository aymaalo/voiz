import Image from 'next/image';
import type { Dictionary } from '@/content/i18n';
import { site } from '@/content/site';

/** Per-card tilt and vertical offset — the scattered-polaroid look the brand
 *  asked to keep here. Two columns: the right-hand card of each row drops. */
const LOOK = [
  { tilt: '-1.2deg', shift: '0px', reveal: 'left' },
  { tilt: '1.2deg', shift: '38px', reveal: 'right' },
  { tilt: '0.9deg', shift: '0px', reveal: 'left' },
  { tilt: '-0.9deg', shift: '38px', reveal: 'right' },
] as const;

export function Testimonials({ t }: { t: Dictionary }) {
  const photo: string = site.photos.testimonials;

  return (
    <section className="relative overflow-hidden px-5 py-[100px] md:px-10 md:py-[140px]">
      {/* Photo 2, dimmed well back and faded into the page at both edges so the
          cards stay the subject. */}
      {photo ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 [mask-image:linear-gradient(180deg,transparent_0%,#000_22%,#000_78%,transparent_100%)]"
        >
          <Image src={photo} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        </div>
      ) : null}

      <div className="relative mx-auto max-w-[1000px]">
        <div
          data-reveal=""
          className="mb-10 text-[12px] font-bold tracking-[.4em] text-orange uppercase md:mb-[60px]"
        >
          {t.quotesKicker}
        </div>

        <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
          {t.testimonials.map((q, i) => {
            const look = LOOK[i % LOOK.length];
            // Cards straighten on hover; the vertical offset only kicks in once
            // they sit side by side, otherwise it just adds dead space.
            const style = {
              '--tilt': look.tilt,
              '--shift': look.shift,
              '--reveal-delay': `${(i % 2) * 120}ms`,
            } as React.CSSProperties;
            // Checkerboard: one ivory card per row, alternating sides.
            const inverted = i % 4 === 1 || i % 4 === 2;

            return (
              <figure
                key={q.author}
                data-reveal={look.reveal}
                style={style}
                className={`relative m-0 flex flex-col gap-[22px] rounded-[6px] p-8 transition-transform duration-300 [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)] md:px-9 md:py-10 md:[transform:rotate(var(--tilt))_translateY(var(--shift))] md:hover:[transform:rotate(0deg)_translateY(var(--shift))] ${
                  inverted
                    ? 'bg-ivoire text-noir'
                    : 'border border-anthracite bg-card transition-[transform,border-color] hover:border-orange'
                }`}
              >
                <div
                  className={`absolute top-[-16px] left-8 px-[14px] py-[5px] text-[11px] font-bold tracking-[.2em] uppercase ${
                    inverted
                      ? 'rotate-[-1.5deg] bg-noir text-ivoire'
                      : 'rotate-[1.5deg] bg-orange text-noir'
                  }`}
                >
                  {q.tag}
                </div>
                <blockquote className="m-0 mt-3 text-[17px] leading-[1.65] text-pretty md:text-[18px]">
                  {q.quote}
                </blockquote>
                <figcaption
                  className={`mt-auto text-[12px] font-semibold tracking-[.18em] uppercase ${
                    inverted ? 'text-anthracite' : 'text-muted'
                  }`}
                >
                  {q.author} · <span className="text-orange">{q.role}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
