import Image from 'next/image';
import type { Dictionary } from '@/content/i18n';

const BODY = 'm-0 text-[15px] leading-[1.75] text-muted text-pretty md:text-[16px]';
const BLOCK_TITLE =
  'm-0 text-[clamp(28px,4vw,44px)] leading-[1] font-black tracking-[-.03em] uppercase';

export function About({ t }: { t: Dictionary }) {
  return (
    <section
      id="about"
      // No bottom padding: the founder's cut-out is bottom-aligned in the last
      // row, so it stands directly on the orange contact section below.
      className="mx-auto max-w-[1280px] px-5 pt-[90px] pb-0 md:px-10 md:pt-[110px]"
    >
      <h2
        data-reveal=""
        className="m-0 text-[clamp(52px,7vw,110px)] leading-none font-black tracking-[-.04em] uppercase"
      >
        {t.aboutTitle}
      </h2>

      {/* No rules anywhere — the two block titles and the space between them do
          the separating, which keeps the section quiet. */}
      <article data-reveal="" className="mt-12 md:mt-16">
        <h3 className={BLOCK_TITLE}>{t.aboutVoizTitle}</h3>

        <p className="mt-5 mb-0 max-w-[820px] text-[16px] leading-[1.7] text-pretty md:mt-6 md:text-[17px]">
          {t.aboutVoizLead}
        </p>

        {/* Two parallel notes rather than one long lane. */}
        <div className="mt-7 grid grid-cols-1 gap-x-16 gap-y-5 md:mt-8 md:grid-cols-2">
          {t.aboutVoizBody.map((p) => (
            <p key={p} className={BODY}>
              {p}
            </p>
          ))}
        </div>
      </article>

      {/* The founder reads as a profile: the cut-out on the left, and the name at
          the top of the column beside it so the two never look interchangeable.
          Text comes first in the DOM and is re-ordered on desktop, so the small
          screen reads name -> bio -> figure rather than figure first. */}
      <article
        data-reveal=""
        style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
        className="mt-[90px] grid grid-cols-1 gap-9 md:mt-[130px] md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-16"
      >
        {/* self-end keeps the figure on the section's bottom edge even when the
            bio beside it runs taller, so its feet always meet the orange. */}
        <div className="order-2 self-end md:order-1">
          <Image
            src="/images/liam.png"
            alt={t.portraitAlt}
            width={365}
            height={942}
            sizes="(max-width: 768px) 240px, 300px"
            className="h-auto w-[210px] sm:w-[240px] md:w-full"
          />
        </div>

        <div className="order-1 max-w-[640px] self-start md:order-2">
          <h3 className={BLOCK_TITLE}>{t.aboutLiamTitle}</h3>
          <div className="mt-3 text-[11px] font-bold tracking-[.26em] text-orange uppercase">
            {t.aboutLiamRole}
          </div>

          {/* gap, not space-y: the paragraphs' own m-0 wins over space-y's
              margin and the gaps collapse. */}
          <div className="mt-6 flex flex-col gap-[18px] md:mt-7">
            {t.aboutLiamBody.map((p) => (
              <p key={p} className={BODY}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
