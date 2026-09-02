import type { Dictionary } from '@/content/i18n';

/** Per-card tilt and vertical offset — the scattered-polaroid look the brand
 *  asked to keep here. Index-matched to t.testimonials. */
const LOOK = [
  { tilt: '-1.2deg', shift: '0px', reveal: 'left', delay: 0 },
  { tilt: '1.2deg', shift: '38px', reveal: 'zoom', delay: 120 },
  { tilt: '-0.9deg', shift: '14px', reveal: 'right', delay: 240 },
] as const;

export function Testimonials({ t }: { t: Dictionary }) {
  return (
    <section className="px-5 py-[100px] md:px-10 md:py-[130px]">
      <div className="mx-auto max-w-[1180px]">
        <div
          data-reveal=""
          className="mb-10 text-[12px] font-bold tracking-[.4em] text-orange uppercase md:mb-[50px]"
        >
          {t.quotesKicker}
        </div>

        <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-3 md:gap-8">
          {t.testimonials.map((q, i) => {
            const look = LOOK[i] ?? LOOK[0];
            // Cards straighten on hover; the vertical offset only kicks in once
            // they sit side by side, otherwise it just adds dead space.
            const style = {
              '--tilt': look.tilt,
              '--shift': look.shift,
              '--reveal-delay': `${look.delay}ms`,
            } as React.CSSProperties;
            const frame =
              'relative m-0 flex flex-col gap-[22px] rounded-[6px] p-8 transition-transform duration-300 [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)] md:px-8 md:py-9 md:[transform:rotate(var(--tilt))_translateY(var(--shift))] md:hover:[transform:rotate(0deg)_translateY(var(--shift))]';

            // No copy yet — a branded stand-in rather than an empty cell, so
            // the row still reads as three.
            if (!q.quote) {
              return (
                <div
                  key={i}
                  data-reveal={look.reveal}
                  style={style}
                  aria-hidden="true"
                  className={`${frame} min-h-[240px] items-center justify-center gap-3 border border-dashed border-anthracite bg-card text-center`}
                >
                  <span className="text-[34px] leading-none text-orange/25">◎</span>
                  <span className="text-[10px] font-semibold tracking-[.22em] text-muted/70 uppercase">
                    {t.quotePlaceholder}
                  </span>
                </div>
              );
            }

            const inverted = i === 1;

            return (
              <figure
                key={i}
                data-reveal={look.reveal}
                style={style}
                className={`${frame} ${
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
                <blockquote className="m-0 mt-3 text-[17px] leading-[1.65] text-pretty md:text-[17px]">
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
