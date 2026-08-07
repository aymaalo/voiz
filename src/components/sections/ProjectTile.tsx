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

function spanVars(project: Project, revealDelay = 0): React.CSSProperties {
  const { cs, rs, csSm, rsSm } = project.span;
  return {
    '--cs': cs,
    '--rs': rs,
    '--cs-sm': csSm,
    '--rs-sm': rsSm,
    '--reveal-delay': `${revealDelay}ms`,
  } as React.CSSProperties;
}

function VideoTile({
  project,
  locale,
  t,
  priority,
  revealDelay,
}: TileProps & { project: VideoProject }) {
  const big = project.span.cs >= 4;

  const body = (
    <>
      <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.06]">
        <ImageSlot
          src={project.image}
          alt={project.title[locale]}
          placeholder={project.placeholder[locale]}
          priority={priority}
          sizes={big ? '(max-width: 900px) 100vw, 860px' : '(max-width: 900px) 100vw, 420px'}
        />
      </div>
      <span
        aria-hidden="true"
        className="vz-stroke-ivoire pointer-events-none absolute top-[14px] left-[18px] font-serif text-[34px] leading-none italic md:text-[44px]"
      >
        {project.num}
      </span>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(180deg,transparent,rgba(6,7,11,.92))] p-[18px] md:gap-4 md:p-5">
        <div>
          <div className="text-[11px] font-bold tracking-[.22em] text-orange uppercase">
            {project.kicker[locale]}
          </div>
          <div className={`mt-1 font-bold ${big ? 'text-[17px] md:text-[19px]' : 'text-[16px]'}`}>
            {project.title[locale]}
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`flex flex-none items-center justify-center rounded-full bg-orange text-noir transition-transform duration-300 group-hover:scale-110 ${
            big ? 'h-[46px] w-[46px] text-[16px]' : 'h-10 w-10 text-[14px]'
          }`}
        >
          ▶
        </div>
      </div>
    </>
  );

  const className =
    'vz-tile group relative overflow-hidden rounded-[6px] transition-transform duration-300';

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        data-reveal="zoom"
        className={className}
        style={spanVars(project, revealDelay)}
        aria-label={`${project.kicker[locale]} · ${project.title[locale]} — ${t.play}`}
      >
        {body}
      </a>
    );
  }

  return (
    <article data-reveal="zoom" className={className} style={spanVars(project, revealDelay)}>
      {body}
    </article>
  );
}

function AudioTile({ project, locale, t, revealDelay }: TileProps & { project: AudioProject }) {
  const isOrange = project.variant === 'orange';

  return (
    <article
      data-reveal="zoom"
      className={`vz-tile flex flex-col justify-between rounded-[6px] p-5 transition-[transform,border-color] duration-300 [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)] md:p-6 ${
        isOrange ? 'bg-orange text-noir' : 'border border-anthracite bg-card hover:border-orange'
      }`}
      style={
        { ...spanVars(project, revealDelay), '--tilt': `${project.tilt}deg` } as React.CSSProperties
      }
    >
      <div className="flex items-baseline justify-between">
        <span
          aria-hidden="true"
          className={`font-serif text-[34px] leading-none italic md:text-[40px] ${
            isOrange ? 'vz-stroke-noir' : 'vz-stroke-orange'
          }`}
        >
          {project.num}
        </span>
        <span
          className={`text-[11px] font-bold tracking-[.22em] uppercase ${
            isOrange ? '' : 'text-orange'
          }`}
        >
          {project.kicker[locale]}
        </span>
      </div>

      <div className="py-3">
        <h3 className="m-0 text-[17px] font-bold md:text-[19px]">{project.title[locale]}</h3>
        <p className={`m-0 mt-1 text-[13px] ${isOrange ? 'opacity-70' : 'text-muted'}`}>
          {project.subtitle[locale]}
        </p>
      </div>

      <AudioPlayer
        src={project.audioSrc}
        duration={project.duration}
        variant={isOrange ? 'orange' : 'dark'}
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
