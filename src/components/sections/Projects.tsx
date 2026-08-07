'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ProjectTile } from '@/components/sections/ProjectTile';
import type { Dictionary, Locale } from '@/content/i18n';
import { projects as allProjects } from '@/content/projects';
import { projectsPath } from '@/lib/routes';

type ProjectsProps = {
  locale: Locale;
  t: Dictionary;
  /** The standalone /projets page drops the section heading and the footer link. */
  variant?: 'home' | 'page';
};

export function Projects({ locale, t, variant = 'home' }: ProjectsProps) {
  const [filter, setFilter] = useState('tous');

  const visible = useMemo(
    () => (filter === 'tous' ? allProjects : allProjects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section
      id="projets"
      className={`relative mx-auto max-w-[1280px] px-5 md:px-10 ${
        variant === 'home' ? 'pb-[100px] md:pb-[140px]' : 'pt-12 pb-[100px] md:pt-[60px] md:pb-[140px]'
      }`}
    >
      {variant === 'home' ? (
        <div data-reveal="" className="mb-10 flex items-baseline gap-4 md:mb-[60px] md:gap-6">
          <h2 className="m-0 text-[clamp(52px,7vw,110px)] leading-none font-black tracking-[-.04em] uppercase">
            {t.projTitle}
          </h2>
          <span className="font-serif text-[clamp(22px,2.6vw,34px)] text-orange italic">
            {t.projCount}
          </span>
        </div>
      ) : null}

      <div
        role="group"
        aria-label={t.filterAria}
        data-reveal=""
        className="mb-8 flex flex-wrap gap-[10px] md:mb-10"
      >
        {t.filters.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={`cursor-pointer rounded-full px-[18px] py-2 text-[12px] tracking-[.12em] uppercase transition hover:-translate-y-[2px] active:scale-95 ${
                active
                  ? 'bg-orange font-bold text-noir'
                  : 'border border-anthracite font-semibold hover:border-orange hover:text-orange'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <div className="vz-grid" data-filtered={filter !== 'tous'}>
          {visible.map((p, i) => (
            <ProjectTile
              key={p.id}
              project={p}
              locale={locale}
              t={t}
              priority={i === 0}
              revealDelay={(i % 4) * 80}
            />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted">{t.projEmpty}</p>
      )}

      {variant === 'home' ? (
        <div data-reveal="" className="mt-[50px] flex justify-center md:mt-[70px]">
          <Link
            href={projectsPath(locale)}
            className="group border-b border-orange font-serif text-[24px] text-orange italic transition-colors hover:text-ivoire md:text-[30px]"
          >
            {t.projAll}{' '}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
