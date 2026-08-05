import { ImageSlot } from '@/components/ui/ImageSlot';
import type { Dictionary } from '@/content/i18n';

export function Studio({ t }: { t: Dictionary }) {
  return (
    <section className="relative mx-auto max-w-[1280px] px-5 pt-[110px] pb-[90px] md:px-10 md:pt-[150px] md:pb-[130px]">
      <div className="absolute top-[150px] left-10 hidden rotate-180 text-[12px] font-bold tracking-[.4em] text-orange uppercase [writing-mode:vertical-rl] lg:block">
        {t.pitchKicker} · 01
      </div>

      <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-[minmax(0,1fr)_380px] md:gap-20 lg:pl-[90px]">
        <p className="m-0 text-[clamp(26px,6vw,46px)] leading-[1.22] font-normal tracking-[-.01em] text-pretty md:text-[clamp(30px,3.4vw,46px)]">
          {t.pitchA} <span className="font-serif text-orange italic">{t.pitchB}</span> {t.pitchC}
        </p>

        <div className="relative">
          <div className="h-[240px] rotate-2 md:h-[300px]">
            <ImageSlot
              shape="rounded"
              alt={t.studioPhotoAlt}
              placeholder={t.pitchKicker}
              sizes="(max-width: 900px) 100vw, 380px"
            />
          </div>
          <div className="absolute top-[-22px] left-[-22px]">
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
