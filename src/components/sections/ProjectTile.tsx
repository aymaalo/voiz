import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { ImageSlot } from '@/components/ui/ImageSlot';
import type { Dictionary, Locale } from '@/content/i18n';
import type { AudioProject, Project, VideoProject } from '@/content/projects';

type TileProps = {
  project: Project;
  locale: Locale;
  t: Dictionary;
  /** Only the first tile is worth preloading. */
  priority?: boolean;
  /** Stagger for the scroll-reveal entrance, in ms. */
  revealDelay?: number;
};

/** Every tile fills one identical cell of the grid — see .vz-tile. */
const TILE = 'vz-tile rounded-[6px] transition-transform duration-300';
const SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px';

function delayVar(revealDelay = 0): React.CSSProperties {
  return { '--reveal-delay': `${revealDelay}ms` } as React.CSSProperties;
}

function VideoTile({
  project,
  locale,
  t,
  priority,
  revealDelay,
}: TileProps & { project: VideoProject }) {
  const body = (
    <>
      <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.06]">
        <ImageSlot
          src={project.image}
          alt={project.title[locale]}
          placeholder={project.placeholder[locale]}
          priority={priority}
          sizes={SIZES}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(180deg,transparent,rgba(6,7,11,.92))] p-[18px] md:gap-4 md:p-5">
        <div>
          <div className="text-[11px] font-bold tracking-[.22em] text-orange uppercase">
            {project.kicker[locale]}
          </div>
          <div className="mt-1 text-[16px] font-bold text-balance md:text-[17px]">
            {project.title[locale]}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange text-[14px] text-noir transition-transform duration-300 group-hover:scale-110"
        >
          ▶
        </div>
      </div>
    </>
  );

  const className = `${TILE} group relative overflow-hidden`;

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        data-reveal="zoom"
        className={className}
        style={delayVar(revealDelay)}
        aria-label={`${project.kicker[locale]} · ${project.title[locale]} — ${t.play}`}
      >
        {body}
      </a>
    );
  }

  return (
    <article data-reveal="zoom" className={className} style={delayVar(revealDelay)}>
      {body}
    </article>
  );
}

function AudioTile({ project, locale, t, revealDelay }: TileProps & { project: AudioProject }) {
  return (
    <article
      data-reveal="zoom"
      className={`${TILE} flex flex-col justify-between border border-anthracite bg-card p-5 transition-colors hover:border-orange`}
      style={delayVar(revealDelay)}
    >
      <span className="text-[11px] font-bold tracking-[.22em] text-orange uppercase">
        {project.kicker[locale]}
      </span>

      {/* Two title lines are always reserved and never exceeded, so every audio
          tile's content block is exactly the same height and the grid cell
          keeps the size its aspect ratio gives it. */}
      <div className="py-3">
        <h3 className="m-0 line-clamp-2 min-h-[2.6em] text-[17px] leading-[1.3] font-bold text-balance md:text-[19px]">
          {project.title[locale]}
        </h3>
        <p className="m-0 mt-1 line-clamp-1 text-[13px] text-muted">{project.subtitle[locale]}</p>
      </div>

      <AudioPlayer
        src={project.audioSrc}
        duration={project.duration}
        variant="dark"
        trackTitle={project.title[locale]}
        labels={{ play: t.play, pause: t.pause, comingSoon: t.audioComingSoon }}
      />
    </article>
  );
}

export function ProjectTile(props: TileProps) {
  return props.project.kind === 'video' ? (
    <VideoTile {...props} project={props.project} />
  ) : (
    <AudioTile {...props} project={props.project} />
  );
}
