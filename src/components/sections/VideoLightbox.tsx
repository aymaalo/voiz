'use client';

import { useEffect, useRef } from 'react';
import type { Dictionary } from '@/content/i18n';
import type { ProjectView, TagView } from '@/lib/projects/types';
import { youTubeEmbedUrl } from '@/lib/youtube';

type VideoLightboxProps = {
  project: ProjectView | null;
  tags: TagView[];
  t: Dictionary;
  onClose: () => void;
};

/**
 * Native <dialog>: focus trapping, Esc and the top layer come for free. The
 * iframe only exists while a project is open, so closing stops playback.
 */
export function VideoLightbox({ project, tags, t, onClose }: VideoLightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
    if (!project) return;

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [project]);

  const labels = project
    ? tags.filter((tag) => project.tagIds.includes(tag.id)).map((tag) => tag.label)
    : [];

  return (
    <dialog
      ref={ref}
      // Esc fires `cancel` synchronously; route it through state like every
      // other close path. `close` alone is dispatched late, or not at all
      // while the tab is in the background, leaving the video playing.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={onClose}
      // A click on the dialog element itself is a click on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={project ? [project.title, project.client].filter(Boolean).join(' / ') : undefined}
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(1100px,calc(100vw-32px))] max-w-none overflow-y-auto bg-transparent p-0 text-ivoire backdrop:bg-noir/85 backdrop:backdrop-blur-sm"
    >
      {project ? (
        <div className="rounded-[6px] border border-anthracite bg-card">
          <div className="flex items-center justify-between gap-4 py-2 pr-2 pl-5">
            <span className="text-[11px] font-bold tracking-[.22em] text-orange uppercase">
              {project.kicker}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[17px] text-muted transition-colors hover:bg-orange hover:text-noir"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="relative aspect-video w-full bg-noir">
            {project.youtubeId ? (
              <iframe
                src={youTubeEmbedUrl(project.youtubeId)}
                title={project.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : null}
          </div>

          <div className="p-5 md:p-7">
            <h2 className="m-0 text-[22px] leading-tight font-bold text-balance md:text-[28px]">
              {project.title}
              {project.client ? (
                <span className="font-normal text-ivoire/70"> / {project.client}</span>
              ) : null}
            </h2>
            {project.services.length ? (
              <p className="m-0 mt-2 text-[13px] tracking-[.02em] text-ivoire/70">
                {project.services.join(' · ')}
              </p>
            ) : null}
            {project.description ? (
              <p className="m-0 mt-3 max-w-[760px] text-[15px] leading-relaxed whitespace-pre-line text-muted">
                {project.description}
              </p>
            ) : null}
            {labels.length > 1 ? (
              <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                {labels.map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-anthracite px-3 py-1 text-[11px] font-semibold tracking-[.12em] uppercase"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
