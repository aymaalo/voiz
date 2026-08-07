'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import type { Dictionary, Locale } from '@/content/i18n';
import { otherLocale } from '@/content/i18n';

type NavProps = {
  locale: Locale;
  t: Dictionary;
  /** Same page in the other language — slugs are localised, so pages supply it. */
  switchHref: string;
  /** On the projects page the section anchors have to point back at the home page. */
  anchorBase?: string;
};

export function Nav({ locale, t, switchHref, anchorBase = '' }: NavProps) {
  const [open, setOpen] = useState(false);
  const other = otherLocale(locale);

  const links = [
    { href: `${anchorBase}#projets`, label: t.navProjects },
    { href: `${anchorBase}#services`, label: t.navServices },
    { href: `${anchorBase}#about`, label: t.navAbout },
    { href: `${anchorBase}#contact`, label: t.navContact, accent: true },
  ];

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav
        // mix-blend-difference keeps the nav legible over both the video and the
        // orange contact section without any backdrop of its own.
        className="fixed inset-x-0 top-0 z-50 flex animate-[vz-nav-in_.7s_ease-out_.15s_both] items-center justify-between px-5 py-[18px] mix-blend-difference md:px-10 md:py-[22px]"
      >
        <Link href={`/${locale}`} aria-label="VOIZ" className="flex-none">
          <Logo className="h-8 w-auto text-ivoire md:h-9" />
        </Link>

        <div className="hidden items-center gap-8 text-[12px] font-semibold tracking-[.14em] uppercase md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`transition-colors hover:text-orange ${
                l.accent ? 'border-b-2 border-orange pb-[2px]' : 'vz-link'
              }`}
            >
              {l.label}
            </a>
          ))}
          <Link
            href={switchHref}
            hrefLang={other}
            aria-label={t.langSwitchAria}
            className="rounded-full border border-ivoire/40 px-[13px] py-[6px] text-[11px] font-semibold tracking-[.12em] transition hover:scale-105 hover:border-orange hover:text-orange active:scale-95"
          >
            {t.langLabel}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="vz-mobile-menu"
          aria-label={open ? t.menuClose : t.menuOpen}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-[1.5px] w-5 bg-ivoire transition-transform ${
              open ? 'translate-y-[6.5px] rotate-45' : ''
            }`}
          />
          <span className={`h-[1.5px] w-5 bg-ivoire transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span
            className={`h-[1.5px] w-5 bg-ivoire transition-transform ${
              open ? '-translate-y-[6.5px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      <div
        id="vz-mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex animate-[vz-fade-in_.35s_ease_both] flex-col justify-center gap-2 bg-noir px-8 md:hidden"
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="border-b border-anthracite py-5 text-[26px] font-bold tracking-[-.02em] uppercase transition-[padding-left,color] duration-300 hover:pl-3 hover:text-orange"
          >
            {l.label}
          </a>
        ))}
        <Link
          href={switchHref}
          hrefLang={other}
          onClick={() => setOpen(false)}
          aria-label={t.langSwitchAria}
          className="mt-8 self-start rounded-full border border-ivoire/40 px-5 py-3 text-[12px] font-semibold tracking-[.12em] uppercase"
        >
          {t.langLabel}
        </Link>
      </div>
    </>
  );
}
