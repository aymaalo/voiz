import { Logo } from '@/components/brand/Logo';
import type { Dictionary } from '@/content/i18n';
import { site } from '@/content/site';

export function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="flex flex-col gap-10 px-5 pt-14 pb-10 md:gap-[50px] md:px-10 md:pt-[70px]">
      <Logo className="h-[clamp(60px,14vw,180px)] w-auto self-center text-ivoire" />

      <div className="flex flex-col gap-4 border-t border-anthracite pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-5 md:gap-6">
          {site.social.map((s) =>
            s.href ? (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-orange"
              >
                {s.label}
              </a>
            ) : (
              // No URL supplied yet — render the label rather than a dead link.
              <span key={s.label} className="opacity-60">
                {s.label}
              </span>
            ),
          )}
        </div>
        <div>{t.footerRights}</div>
      </div>
    </footer>
  );
}
