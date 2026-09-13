'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ProjectTile } from '@/components/sections/ProjectTile';
import { VideoLightbox } from '@/components/sections/VideoLightbox';
import type { Dictionary, Locale } from '@/content/i18n';
import type { ProjectView, TagView } from '@/lib/projects/types';
import { projectsPath } from '@/lib/routes';

const ALL = 'all';

type ProjectsProps = {
  locale: Locale;
  t: Dictionary;
  /** Published projects in display order, managed from /admin — featured ones only on home. */
  projects: ProjectView[];
  /** Filter pills — only tags used by at least one of `projects`. */
  tags: TagView[];
  /** Home is the curated selection, with a "more projects" tab to the full page. */
  variant?: 'home' | 'page';
};

export function Projects({ locale, t, projects, tags, variant = 'home' }: ProjectsProps) {
  const [filter, setFilter] = useState(ALL);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [openVideo, setOpenVideo] = useState<ProjectView | null>(null);

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.tagIds.includes(filter))),
    [filter, projects],
  );

  const filters = [{ id: ALL, label: t.filterAll }, ...tags];

  return (
    <section
      id="projets"
      className={`relative mx-auto max-w-[1280px] px-5 md:px-10 ${
        variant === 'home' ? 'pb-[100px] md:pb-[140px]' : 'pt-12 pb-[100px] md:pt-[60px] md:pb-[140px]'
      }`}
    >
      {variant === 'home' ? (
        <h2
          data-reveal=""
          className="m-0 mb-10 text-[clamp(52px,7vw,110px)] leading-none font-black tracking-[-.04em] uppercase md:mb-[60px]"
        >
          {t.projTitle}
        </h2>
      ) : null}

      {tags.length > 0 || variant === 'home' ? (
        <div data-reveal="" className="mb-8 flex flex-wrap gap-[10px] md:mb-10">
          {tags.length > 0 ? (
            <div role="group" aria-label={t.filterAria} className="contents">
              {filters.map((f) => {
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
          ) : null}

          {/* The rest of the catalogue lives on its own page, not in the selection. */}
          {variant === 'home' ? (
            <Link
              href={projectsPath(locale)}
              className="group rounded-full border border-dashed border-ivoire/40 px-[18px] py-2 text-[12px] font-semibold tracking-[.12em] uppercase transition hover:-translate-y-[2px] hover:border-orange hover:text-orange"
            >
              {t.projMore}{' '}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ) : null}
        </div>
      ) : null}

      {visible.length > 0 ? (
        <div className="vz-grid">
          {visible.map((p, i) => (
            <ProjectTile
              key={p.id}
              project={p}
              t={t}
              priority={i === 0}
              revealDelay={(i % 3) * 80}
              activeAudioId={activeAudioId}
              onPlayAudio={setActiveAudioId}
              onOpenVideo={(project) => {
                // Only one thing plays at a time.
                setActiveAudioId(null);
                setOpenVideo(project);
              }}
            />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted">
          {projects.length > 0 ? t.projEmpty : t.projNone}
        </p>
      )}

      <VideoLightbox project={openVideo} tags={tags} t={t} onClose={() => setOpenVideo(null)} />
    </section>
  );
}
