import type { Dictionary } from '@/content/i18n';

export function Services({ t }: { t: Dictionary }) {
  return (
    <section id="services" className="mx-auto max-w-[1280px] px-5 py-[100px] md:px-10 md:py-[130px]">
      {/* The lead sits beside the heading rather than under it, so the section
          opens on one composed line instead of two full-width stacks. */}
      <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
        <h2
          data-reveal=""
          className="m-0 text-[clamp(52px,7vw,110px)] leading-none font-black tracking-[-.04em] uppercase"
        >
          {t.servTitle}
        </h2>
        <p
          data-reveal=""
          style={{ '--reveal-delay': '90ms' } as React.CSSProperties}
          className="m-0 max-w-[640px] font-serif text-[clamp(20px,2.4vw,29px)] leading-[1.3] text-ivoire/90 text-pretty lg:pb-[10px]"
        >
          {t.servIntro}
        </p>
      </div>

      {/* Two columns keep each entry to a readable measure (~70 characters);
          full-width rows ran to ~90 and left the right half of the page empty,
          which is what made four of them feel like a wall. */}
      <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-11 md:mt-[90px] md:grid-cols-2 md:gap-y-14">
        {t.services.map((s, i) => (
          <article
            key={s.name}
            data-reveal=""
            style={{ '--reveal-delay': `${(i % 2) * 90}ms` } as React.CSSProperties}
            className="group flex flex-col border-t border-anthracite pt-6 transition-colors duration-300 hover:border-orange md:pt-7"
          >
            <h3 className="m-0 text-[clamp(21px,2.3vw,29px)] font-bold tracking-[-.02em] transition-colors duration-300 group-hover:text-orange">
              {s.name}
            </h3>

            <p className="m-0 mt-[14px] text-[14px] leading-[1.7] text-muted md:text-[15px]">
              {s.desc}
            </p>

            {/* mt-auto pins the objective to the bottom, so both cards in a row
                line theirs up however long the description above runs. */}
            <div className="mt-auto pt-6">
              <div className="mb-[6px] text-[10px] font-bold tracking-[.28em] text-orange uppercase">
                {t.servGoalLabel}
              </div>
              <p className="m-0 text-[14px] leading-[1.6] text-balance md:text-[15px]">{s.goal}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
