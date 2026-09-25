'use client';

import { useEffect, useRef, useState } from 'react';

type YTPlayer = { getDuration(): number; destroy(): void };
type YTEvent = { target: YTPlayer; data: number };
type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host?: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, number>;
      events?: {
        onReady?: (event: YTEvent) => void;
        onStateChange?: (event: YTEvent) => void;
        onError?: (event: YTEvent) => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });
  return apiPromise;
}

const ERRORS: Record<number, string> = {
  2: 'Ce lien ne correspond à aucune vidéo.',
  100: 'Vidéo introuvable ou privée.',
  101: 'Le propriétaire de la vidéo n’autorise pas sa lecture sur d’autres sites.',
  150: 'Le propriétaire de la vidéo n’autorise pas sa lecture sur d’autres sites.',
};

/**
 * Visible preview of the video being linked, so the editor can check it is the
 * right one. It also reads the duration for audio tiles.
 */
export function YouTubePreview({
  videoId,
  onDuration,
}: {
  videoId: string | null;
  onDuration: (seconds: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onDurationRef = useRef(onDuration);
  const [error, setError] = useState<{ videoId: string; message: string } | null>(null);

  useEffect(() => {
    onDurationRef.current = onDuration;
  }, [onDuration]);

  useEffect(() => {
    const host = hostRef.current;
    if (!videoId || !host) return;

    let cancelled = false;
    let player: YTPlayer | null = null;
    // The API replaces this element with its iframe, so React never owns it.
    const mount = document.createElement('div');
    host.appendChild(mount);

    const report = (target: YTPlayer) => {
      const seconds = Math.round(target.getDuration());
      if (seconds > 0) onDurationRef.current(seconds);
    };

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      player = new YT.Player(mount, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        width: '100%',
        height: '100%',
        playerVars: { rel: 0, playsinline: 1 },
        events: {
          onReady: (e) => report(e.target),
          // Some videos only expose their duration once cued or playing.
          onStateChange: (e) => {
            if (e.data === 1 || e.data === 5) report(e.target);
          },
          onError: (e) =>
            setError({
              videoId,
              message: ERRORS[e.data] ?? 'Cette vidéo ne peut pas être lue ici.',
            }),
        },
      });
    });

    return () => {
      cancelled = true;
      player?.destroy();
      host.replaceChildren();
    };
  }, [videoId]);

  const message = error && error.videoId === videoId ? error.message : null;

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-[4px] border border-anthracite bg-noir">
        <div ref={hostRef} className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full" />
        {!videoId ? (
          <p className="absolute inset-0 m-0 flex items-center justify-center p-6 text-center text-[13px] text-muted">
            L’aperçu de la vidéo apparaîtra ici.
          </p>
        ) : null}
      </div>
      {message ? <p className="m-0 mt-2 text-[12px] text-orange">{message}</p> : null}
    </div>
  );
}
