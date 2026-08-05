import type { Dictionary } from '@/content/i18n';

export function Services({ t }: { t: Dictionary }) {
  return (
    <section id="services" className="mx-auto max-w-[1280px] px-5 py-[100px] md:px-10 md:py-[130px]">
      <div className="mb-10 flex items-baseline gap-4 md:mb-[60px] md:gap-6">
        <h2 className="m-0 text-[clamp(52px,7vw,110px)] leading-none font-black tracking-[-.04em] uppercase">
          {t.servTitle}
        </h2>
        <span className="font-serif text-[clamp(22px,2.6vw,34px)] text-orange italic">
          {t.servCount}
        </span>
      </div>

      <div className="flex flex-col">
        {t.services.map((s) => (
          <div
            key={s.num}
            className="grid grid-cols-[48px_1fr] items-center gap-5 border-t border-anthracite px-3 py-7 transition-colors hover:bg-orange hover:text-noir md:grid-cols-[76px_1fr] md:gap-7 md:px-5 md:py-[34px]"
          >
            <div aria-hidden="true" className="font-serif text-[32px] opacity-90 italic md:text-[44px]">
              {s.num}
            </div>
            <div>
              <h3 className="m-0 text-[clamp(20px,5vw,36px)] font-bold tracking-[-.02em] md:text-[clamp(24px,2.6vw,36px)]">
                {s.name}
              </h3>
              <p className="m-0 mt-[6px] max-w-[560px] text-[14px] opacity-65 md:text-[15px]">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
        <div className="border-t border-anthracite" />
      </div>

      <p className="mx-auto mt-[50px] mb-0 max-w-[820px] text-center font-serif text-[clamp(20px,2.4vw,32px)] leading-[1.35] text-orange text-pretty italic md:mt-[70px]">
        « {t.positioning} »
      </p>
    </section>
  );
}
