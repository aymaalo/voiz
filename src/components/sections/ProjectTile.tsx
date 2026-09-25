'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import type { Dictionary } from '@/content/i18n';
import type { ProjectView } from '@/lib/projects/types';
import { soundCloudEmbedUrl } from '@/lib/soundcloud';
import { youTubeEmbedUrl } from '@/lib/youtube';

type TileProps = {
  project: ProjectView;
  t: Dictionary;
  /** Only the first tile is worth preloading. */
  priority?: boolean;
  /** Stagger for the scroll-reveal entrance, in ms. */
  revealDelay?: number;
};

/** Every tile fills one identical cell of the grid — see .vz-tile. */
const TILE = 'vz-tile rounded-[6px] transition-transform duration-300';
const SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px';
const KICKER = 'text-[11px] font-bold tracking-[.22em] text-orange uppercase';

function delayVar(revealDelay = 0): React.CSSProperties {
  return { '--reveal-delay': `${revealDelay}ms` } as React.CSSProperties;
}

/** "Title / Client", with the client stepping back a shade. */
function TitleLine({ project }: { project: ProjectView }) {
  return (
    <>
      {project.title}
      {project.client ? (
        <span className="font-normal text-ivoire/70"> / {project.client}</span>
      ) : null}
    </>
  );
}

function fullTitle(project: ProjectView) {
  return project.client ? `${project.title} / ${project.client}` : project.title;
}

/**
 * The selling description stays out of sight until asked for — the grid reads
 * as titles and credits only. Returns the toggle button and the panel that
 * covers the tile, with focus handed back and forth between them.
 */
function useInfoPanel(project: ProjectView, t: Dictionary) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    (open ? closeRef : toggleRef).current?.focus({ preventScroll: true });
  }, [open]);

  if (!project.description) return { toggle: null, panel: null };

  const toggle = (
    <button
      ref={toggleRef}
      type="button"
      onClick={() => setOpen(true)}
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={`${t.moreInfo} — ${fullTitle(project)}`}
      className="relative z-10 flex-none cursor-pointer rounded-full border border-ivoire/30 bg-noir/60 px-3 py-1 text-[11px] font-semibold tracking-[.08em] backdrop-blur-sm transition-colors hover:border-orange hover:text-orange"
    >
      {t.moreInfo} <span aria-hidden="true">+</span>
    </button>
  );

  const panel = open ? (
    <div
      id={panelId}
      role="region"
      aria-label={fullTitle(project)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      className="absolute inset-0 z-20 flex flex-col bg-noir/95 p-5 backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={KICKER}>{project.kicker}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t.close}
          className="-mt-2 -mr-2 flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full text-[15px] text-muted transition-colors hover:bg-orange hover:text-noir"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
      <p className="m-0 mt-1 text-[15px] leading-snug font-bold">
        <TitleLine project={project} />
      </p>
      <p className="m-0 mt-3 min-h-0 flex-1 overflow-y-auto pr-1 text-[13px] leading-[1.6] whitespace-pre-line text-ivoire/85">
        {project.description}
      </p>
    </div>
  ) : null;

  return { toggle, panel };
}

function VideoTile({
  project,
  t,
  priority,
  revealDelay,
  onOpen,
}: TileProps & { onOpen: (project: ProjectView) => void }) {
  const info = useInfoPanel(project, t);

  return (
    <article
      data-reveal="zoom"
      className={`${TILE} group relative overflow-hidden bg-card`}
      style={delayVar(revealDelay)}
    >
      {project.thumbnailSrc ? (
        <span className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
          <Image
            src={project.thumbnailSrc}
            alt=""
            fill
            sizes={SIZES}
            priority={priority}
            className="object-cover"
          />
        </span>
      ) : null}

      {/* The whole tile plays; the info toggle sits above this layer. */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`${project.kicker} · ${fullTitle(project)} — ${t.play}`}
        className="absolute inset-0 cursor-pointer"
      />

      {info.toggle ? <div className="absolute top-3 right-3">{info.toggle}</div> : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(180deg,transparent,rgba(6,7,11,.92)_45%)] p-[18px] pt-12 md:gap-4 md:p-5 md:pt-14">
        <div className="min-w-0">
          <div className={KICKER}>{project.kicker}</div>
          <div className="mt-1 line-clamp-2 text-[16px] leading-snug font-bold text-balance md:text-[17px]">
            <TitleLine project={project} />
          </div>
          {project.services.length ? (
            <div className="mt-1 truncate text-[12px] text-ivoire/65">
              {project.services.join(' · ')}
            </div>
          ) : null}
        </div>
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange text-[14px] text-noir transition-transform duration-300 group-hover:scale-110"
        >
          ▶
        </div>
      </div>

      {info.panel}
    </article>
  );
}

function AudioTile({
  project,
  t,
  revealDelay,
  active,
  onToggle,
}: TileProps & { active: boolean; onToggle: (id: string | null) => void }) {
  const playRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasActive = useRef(active);
  const info = useInfoPanel(project, t);

  // The button that was clicked unmounts on each swap; hand focus to its
  // counterpart so keyboard users are not dropped back at the top of the page.
  useEffect(() => {
    if (active === wasActive.current) return;
    wasActive.current = active;
    (active ? closeRef : playRef).current?.focus({ preventScroll: true });
  }, [active]);

  const playerSrc = project.soundcloudUrl
    ? soundCloudEmbedUrl(project.soundcloudUrl, { autoplay: true })
    : project.youtubeId
      ? youTubeEmbedUrl(project.youtubeId)
      : null;

  // One <article> in both states so the scroll-reveal state survives the swap.
  return (
    <article
      data-reveal="zoom"
      className={`${TILE} relative flex flex-col overflow-hidden border bg-card transition-colors ${
        active ? 'border-orange' : 'justify-between border-anthracite p-5 hover:border-orange'
      }`}
      style={delayVar(revealDelay)}
    >
      {active && playerSrc ? (
        <>
          <div className="flex flex-none items-center justify-between gap-3 py-2 pr-2 pl-4">
            <p className="m-0 min-w-0 truncate text-[13px] font-bold">
              <span className={`mr-2 ${KICKER}`}>{project.kicker}</span>
              <TitleLine project={project} />
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onToggle(null)}
              aria-label={`${t.close} — ${fullTitle(project)}`}
              className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full text-[15px] text-muted transition-colors hover:bg-orange hover:text-noir"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          {/* The provider's own player, visible, as YouTube's and SoundCloud's terms require. */}
          <div className="relative min-h-0 flex-1 bg-noir">
            <iframe
              src={playerSrc}
              title={fullTitle(project)}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex min-h-[26px] items-start justify-between gap-3">
            <span className={`${KICKER} pt-1`}>{project.kicker}</span>
            {info.toggle}
          </div>

          {/* Two title lines are always reserved and never exceeded, so every audio
              tile's content block is exactly the same height and the grid cell
              keeps the size its aspect ratio gives it. */}
          <div className="py-2">
            <h3 className="m-0 line-clamp-2 min-h-[2.6em] text-[17px] leading-[1.3] font-bold text-balance md:text-[19px]">
              <TitleLine project={project} />
            </h3>
            <p className="m-0 mt-1 min-h-[1.5em] truncate text-[12px] text-muted">
              {project.services.join(' · ')}
            </p>
          </div>

          <div className="flex items-center gap-[14px]">
            <button
              ref={playRef}
              type="button"
              onClick={() => onToggle(project.id)}
              disabled={!playerSrc}
              aria-label={`${t.play} — ${fullTitle(project)}`}
              className="flex h-[46px] w-[46px] flex-none cursor-pointer items-center justify-center rounded-full border-[1.5px] border-orange text-[15px] text-orange transition-colors hover:bg-orange hover:text-noir disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true">▶</span>
            </button>
            <div aria-hidden="true" className="vz-waveform relative h-[34px] flex-1">
              <div
                className="absolute inset-0"
                style={{
                  background: 'repeating-linear-gradient(90deg, #FF5300 0 2px, transparent 2px 5px)',
                  opacity: 0.28,
                }}
              />
            </div>
            {project.duration ? (
              <span className="text-[12px] text-muted tabular-nums">{project.duration}</span>
            ) : null}
          </div>

          {info.panel}
        </>
      )}
    </article>
  );
}

export function ProjectTile({
  project,
  activeAudioId,
  onPlayAudio,
  onOpenVideo,
  ...rest
}: TileProps & {
  activeAudioId: string | null;
  onPlayAudio: (id: string | null) => void;
  onOpenVideo: (project: ProjectView) => void;
}) {
  return project.kind === 'video' ? (
    <VideoTile {...rest} project={project} onOpen={onOpenVideo} />
  ) : (
    <AudioTile
      {...rest}
      project={project}
      active={activeAudioId === project.id}
      onToggle={onPlayAudio}
    />
  );
}
