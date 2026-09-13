'use client';

import { useEffect, useRef } from 'react';
import { soundCloudEmbedUrl } from '@/lib/soundcloud';

type SCWidget = {
  bind(event: string, listener: () => void): void;
  getDuration(callback: (ms: number) => void): void;
};
type SCNamespace = {
  Widget: ((iframe: HTMLIFrameElement) => SCWidget) & { Events: { READY: string } };
};

declare global {
  interface Window {
    SC?: SCNamespace;
  }
}

let apiPromise: Promise<SCNamespace> | null = null;

function loadWidgetApi(): Promise<SCNamespace> {
  if (window.SC?.Widget) return Promise.resolve(window.SC);
  apiPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => (window.SC ? resolve(window.SC) : reject(new Error('SC missing')));
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return apiPromise;
}

/**
 * Visible SoundCloud player for the editor, so the right track is linked. It
 * also reads the duration for the audio tile.
 */
export function SoundCloudPreview({
  url,
  onDuration,
}: {
  /** Canonical page URL, or null for a short link that is resolved on save. */
  url: string | null;
  onDuration: (seconds: number) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onDurationRef = useRef(onDuration);

  useEffect(() => {
    onDurationRef.current = onDuration;
  }, [onDuration]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!url || !iframe) return;

    let cancelled = false;
    loadWidgetApi()
      .then((SC) => {
        if (cancelled) return;
        const widget = SC.Widget(iframe);
        widget.bind(SC.Widget.Events.READY, () =>
          widget.getDuration((ms) => {
            if (!cancelled && ms > 0) onDurationRef.current(Math.round(ms / 1000));
          }),
        );
      })
      .catch(() => {
        /* No duration — the field stays editable. */
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-[4px] border border-anthracite bg-noir">
      {url ? (
        <iframe
          // Remount per track so the widget API binds to a fresh player.
          key={url}
          ref={iframeRef}
          src={soundCloudEmbedUrl(url, { autoplay: false })}
          title="Aperçu SoundCloud"
          allow="autoplay"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <p className="absolute inset-0 m-0 flex items-center justify-center p-6 text-center text-[13px] text-muted">
          Lien court : l’aperçu apparaîtra après l’enregistrement.
        </p>
      )}
    </div>
  );
}
