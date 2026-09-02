import { ImageSlot } from '@/components/ui/ImageSlot';
import type { Dictionary } from '@/content/i18n';

export function Studio({ t }: { t: Dictionary }) {
  return (
    <section className="relative mx-auto max-w-[1280px] px-5 pt-[110px] pb-[90px] md:px-10 md:pt-[150px] md:pb-[130px]">
      <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-[minmax(0,1fr)_380px] md:gap-20">
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
          data-reveal="right"
          style={{ '--reveal-delay': '150ms' } as React.CSSProperties}
          className="relative"
        >
          <div className="h-[240px] md:h-[300px]">
            <ImageSlot
              shape="rounded"
              alt={t.studioPhotoAlt}
              placeholder={t.pitchKicker}
              sizes="(max-width: 900px) 100vw, 380px"
            />
          </div>
          <div className="absolute top-[-22px] left-[-22px] transition-transform duration-300 hover:scale-110">
            <div className="flex h-[74px] w-[74px] animate-[vz-spin_14s_linear_infinite] items-center justify-center rounded-full bg-orange">
              <span aria-hidden="true" className="text-[26px] font-black text-noir">
                ◎
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
