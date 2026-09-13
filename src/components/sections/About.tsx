import Image from 'next/image';
import type { Dictionary } from '@/content/i18n';
import { site } from '@/content/site';

const BODY = 'm-0 text-[15px] leading-[1.75] text-muted text-pretty md:text-[16px]';
const BLOCK_TITLE =
  'm-0 text-[clamp(28px,4vw,44px)] leading-[1] font-black tracking-[-.03em] uppercase';

export function About({ t }: { t: Dictionary }) {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1280px] px-5 pt-[90px] pb-[100px] md:px-10 md:pt-[110px] md:pb-[140px]"
    >
      <h2
        data-reveal=""
        className="m-0 text-[clamp(52px,7vw,110px)] leading-none font-black tracking-[-.04em] uppercase"
      >
        {t.aboutTitle}
      </h2>

      {/* No rules anywhere — the two block titles and the space between them do
          the separating, which keeps the section quiet. */}
      <article
        data-reveal=""
        className="mt-12 grid grid-cols-1 items-center gap-10 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-16"
      >
        <div>
          <h3 className={BLOCK_TITLE}>{t.aboutVoizTitle}</h3>

          <p className="mt-5 mb-0 max-w-[820px] text-[16px] leading-[1.7] text-pretty md:mt-6 md:text-[17px]">
            {t.aboutVoizLead}
          </p>

          {/* Two parallel notes rather than one long lane. */}
          <div className="mt-7 grid grid-cols-1 gap-x-12 gap-y-5 md:mt-8 md:grid-cols-2">
            {t.aboutVoizBody.map((p) => (
              <p key={p} className={BODY}>
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* The blurred vortex, to the side and low-key. The radial mask fades the
            artwork's own near-black ground so no rectangle edge shows. Desktop
            only: stacked on a phone it would just be one more thing to scroll. */}
        <div
          aria-hidden="true"
          className="pointer-events-none hidden opacity-60 [mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000_55%,transparent_100%)] lg:block"
        >
          <Image
            src="/images/logo-blurred.png"
            alt=""
            width={4500}
            height={3000}
            sizes="400px"
            className="h-auto w-full scale-[1.6]"
          />
        </div>
      </article>

      {/* The founder reads as a profile: portrait on the left, name at the top
          of the column beside it. On a phone the portrait leads, kept to a
          modest width so the bio is still within a thumb's reach. */}
      <article
        data-reveal=""
        style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
        className="mt-[90px] grid grid-cols-1 items-start gap-9 md:mt-[130px] md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:gap-16"
      >
        <div className="relative max-w-[300px] overflow-hidden rounded-[6px] md:max-w-none">
          <Image
            src={site.photos.founder.src}
            alt={t.portraitAlt}
            width={site.photos.founder.width}
            height={site.photos.founder.height}
            sizes="(max-width: 768px) 300px, 340px"
            className="h-auto w-full"
          />
        </div>

        <div className="max-w-[640px] md:pt-2">
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
