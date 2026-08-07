import { Logo } from '@/components/brand/Logo';
import type { Dictionary } from '@/content/i18n';
import { site } from '@/content/site';

type FooterProps = {
  t: Dictionary;
  /** On the projects page the section anchors have to point back at the home page. */
  anchorBase?: string;
};

const LINK = 'w-fit text-[14px] text-muted transition hover:translate-x-1 hover:text-orange';

export function Footer({ t, anchorBase = '' }: FooterProps) {
  const nav = [
    { href: `${anchorBase}#projets`, label: t.navProjects },
    { href: `${anchorBase}#services`, label: t.navServices },
    { href: `${anchorBase}#about`, label: t.navAbout },
    { href: `${anchorBase}#contact`, label: t.navContact },
  ];

  return (
    <footer className="flex flex-col gap-10 px-5 pt-14 pb-10 md:gap-[50px] md:px-10 md:pt-[70px]">
      <div data-reveal="zoom" className="flex flex-col items-center gap-5 self-center text-center">
        <Logo className="h-[clamp(60px,14vw,180px)] w-auto text-ivoire" />
        <p className="m-0 font-serif text-[17px] text-orange italic md:text-[19px]">{t.mantra}</p>
      </div>

      <div
        data-reveal=""
        className="grid grid-cols-1 gap-10 border-t border-anthracite pt-10 sm:grid-cols-3 md:pt-12"
      >
        <FooterCol title={t.footerNav}>
          {nav.map((l) => (
            <a key={l.href} href={l.href} className={LINK}>
              {l.label}
            </a>
          ))}
        </FooterCol>

        <FooterCol title={t.footerSocial}>
          {site.social.map((s) =>
            s.href ? (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                {s.label}
              </a>
            ) : (
              // No URL supplied yet — render the label rather than a dead link.
              <span key={s.label} className="w-fit text-[14px] text-muted opacity-60">
                {s.label}
              </span>
            ),
          )}
        </FooterCol>

        <FooterCol title={t.footerContact}>
          {site.email ? (
            <a href={`mailto:${site.email}`} className={LINK}>
              {site.email}
            </a>
          ) : null}
          <a href={`${anchorBase}#contact`} className={LINK}>
            {t.ctaContact}
          </a>
        </FooterCol>
      </div>

      <div className="flex flex-col gap-4 border-t border-anthracite pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>{t.footerRights}</div>
        <a
          href="#top"
          className="w-fit text-[12px] font-semibold tracking-[.18em] uppercase transition hover:-translate-y-[2px] hover:text-orange"
        >
          {t.footerTop} ↑
        </a>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 text-[11px] font-bold tracking-[.3em] text-orange uppercase">{title}</div>
      {children}
    </div>
  );
}
