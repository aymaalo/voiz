import { ImageSlot } from '@/components/ui/ImageSlot';
import type { Dictionary } from '@/content/i18n';

export function About({ t }: { t: Dictionary }) {
  return (
    <section
      id="about"
      className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-5 pt-[90px] pb-[110px] md:grid-cols-[auto_minmax(0,1fr)] md:gap-[90px] md:px-10 md:pt-[110px] md:pb-[150px]"
    >
      <div className="relative h-[220px] w-[220px] justify-self-center md:h-[260px] md:w-[260px]">
        <ImageSlot
          shape="circle"
          alt={t.portraitAlt}
          placeholder={t.aboutKicker}
          sizes="260px"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-[-30px]">
          <svg viewBox="0 0 200 200" className="h-full w-full animate-[vz-spin_24s_linear_infinite]">
            <defs>
              <path
                id="vz-orbit"
                d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0"
              />
            </defs>
            <text className="fill-orange text-[12.5px] font-bold tracking-[.32em] uppercase">
              <textPath href="#vz-orbit">{t.aboutOrbit}</textPath>
            </text>
          </svg>
        </div>
      </div>

      <div>
        <div className="mb-6 text-[12px] font-bold tracking-[.4em] text-orange uppercase">
          {t.aboutKicker} · 04
        </div>
        <p className="m-0 max-w-[700px] text-[clamp(20px,5vw,30px)] leading-[1.45] text-pretty md:text-[clamp(22px,2.2vw,30px)]">
          {t.about}
        </p>
        <p className="mt-7 mb-0 max-w-[640px] text-[15px] leading-[1.7] text-muted text-pretty md:text-[16px]">
          {t.aboutLiam}
        </p>
        <p className="mt-6 mb-0 max-w-[600px] font-serif text-[19px] leading-[1.5] text-orange text-pretty italic md:text-[20px]">
          « {t.aboutLiamQuote} »
        </p>
      </div>
    </section>
  );
}
