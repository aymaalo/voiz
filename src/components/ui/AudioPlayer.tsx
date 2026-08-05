'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Only one excerpt plays at a time across the page. */
let currentlyPlaying: HTMLAudioElement | null = null;

type AudioPlayerProps = {
  src?: string;
  /** Shown before metadata loads, and when no file is wired up yet. */
  duration: string;
  variant?: 'dark' | 'orange';
  labels: { play: string; pause: string; comingSoon: string };
  trackTitle: string;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({
  src,
  duration,
  variant = 'dark',
  labels,
  trackTitle,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  const isOrange = variant === 'orange';
  const accent = isOrange ? '#06070b' : '#FF5300';

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;

    if (a.paused) {
      if (currentlyPlaying && currentlyPlaying !== a) currentlyPlaying.pause();
      currentlyPlaying = a;
      void a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      setCurrent(a.currentTime);
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    };
    const onMeta = () => setTotal(a.duration);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
      if (currentlyPlaying === a) currentlyPlaying = null;
    };

    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnded);

    return () => {
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnded);
      if (currentlyPlaying === a) currentlyPlaying = null;
    };
  }, [src]);

  const seek = (percent: number) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = (percent / 100) * a.duration;
    setProgress(percent);
  };

  const timeLabel = playing || current > 0 ? formatTime(current) : formatTime(total) || duration;

  return (
    <div className="flex items-center gap-[14px]">
      {src ? <audio ref={audioRef} src={src} preload="metadata" /> : null}

      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        aria-label={`${playing ? labels.pause : labels.play} — ${trackTitle}`}
        title={src ? undefined : labels.comingSoon}
        className={`flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full border-[1.5px] text-[15px] transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
          isOrange
            ? 'border-noir text-noir enabled:hover:bg-noir enabled:hover:text-orange'
            : 'border-orange text-orange enabled:hover:bg-orange enabled:hover:text-noir'
        }`}
      >
        <span aria-hidden="true">{playing ? '❙❙' : '▶'}</span>
      </button>

      <div className="relative h-[34px] flex-1">
        {/* The elliptical mask lives on the wrapper so both layers are eased
            identically; progress is a clip, not a width, to keep bars aligned. */}
        <div aria-hidden="true" className="vz-waveform absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(90deg, ${accent} 0 2px, transparent 2px 5px)`,
              opacity: isOrange ? 0.35 : 0.28,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(90deg, ${accent} 0 2px, transparent 2px 5px)`,
              clipPath: `inset(0 ${100 - progress}% 0 0)`,
              opacity: isOrange ? 0.95 : 0.8,
            }}
          />
        </div>
        {src ? (
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={`${trackTitle} — ${formatTime(current)}`}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        ) : null}
      </div>

      <span className={`text-[12px] tabular-nums ${isOrange ? 'opacity-70' : 'text-muted'}`}>
        {src ? timeLabel : duration}
      </span>
    </div>
  );
}
