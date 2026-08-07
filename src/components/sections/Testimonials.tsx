import type { Dictionary } from '@/content/i18n';

export function Testimonials({ t }: { t: Dictionary }) {
  return (
    <section className="px-5 py-[100px] md:px-10 md:py-[130px]">
      <div className="mx-auto max-w-[1100px]">
        <div
          data-reveal=""
          className="mb-10 text-[12px] font-bold tracking-[.4em] text-orange uppercase md:mb-[50px]"
        >
          {t.quotesKicker}
        </div>

        <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-2 md:gap-11">
          <figure
            data-reveal="left"
            className="relative m-0 flex flex-col gap-[22px] rounded-[6px] border border-anthracite bg-card p-8 transition-[transform,border-color] duration-300 [transform:rotate(-1.2deg)] hover:border-orange hover:[transform:rotate(0deg)] md:px-9 md:py-[38px]"
          >
            <div className="absolute top-[-16px] left-8 rotate-[1.5deg] bg-orange px-[14px] py-[5px] text-[11px] font-bold tracking-[.2em] text-noir uppercase">
              {t.quote1Tag}
            </div>
            <span
              aria-hidden="true"
              className="vz-stroke-orange mt-[14px] font-serif text-[64px] leading-[.4] italic"
            >
              01
            </span>
            <blockquote className="m-0 text-[17px] leading-[1.65] text-pretty md:text-[18px]">
              {t.quote1}
            </blockquote>
            <figcaption className="mt-auto text-[12px] font-semibold tracking-[.18em] text-muted uppercase">
              {t.quote1Author} · <span className="text-orange">{t.quote1Role}</span>
            </figcaption>
          </figure>

          <figure
            data-reveal="right"
            style={{ '--reveal-delay': '140ms' } as React.CSSProperties}
            className="relative m-0 flex flex-col gap-[22px] rounded-[6px] bg-ivoire p-8 text-noir transition-transform duration-300 [transform:rotate(1.2deg)_translateY(0)] hover:[transform:rotate(0deg)_translateY(0)] md:px-9 md:py-[38px] md:[transform:rotate(1.2deg)_translateY(46px)] md:hover:[transform:rotate(0deg)_translateY(46px)]"
          >
            <div className="absolute top-[-16px] left-8 rotate-[-1.5deg] bg-noir px-[14px] py-[5px] text-[11px] font-bold tracking-[.2em] text-ivoire uppercase">
              {t.quote2Tag}
            </div>
            <span
              aria-hidden="true"
              className="vz-stroke-orange mt-[14px] font-serif text-[64px] leading-[.4] italic"
            >
              02
            </span>
            <blockquote className="m-0 text-[17px] leading-[1.65] text-pretty md:text-[18px]">
              {t.quote2}
            </blockquote>
            <figcaption className="mt-auto text-[12px] font-semibold tracking-[.18em] text-anthracite uppercase">
              {t.quote2Author} · <span className="text-orange">{t.quote2Role}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
