'use client';

import { useEffect } from 'react';

/**
 * Global scroll-reveal driver. Elements opt in with `data-reveal` (optionally
 * "left" | "right" | "zoom", plus a `--reveal-delay` custom property for
 * staggering); observers toggle `data-shown` and globals.css does the actual
 * animating. Appearing triggers slightly after an element clears the bottom
 * edge; disappearing only once it has fully left the viewport, so nothing
 * fades while still readable.
 */
export function ScrollReveal() {
  useEffect(() => {
    const all = () => document.querySelectorAll<HTMLElement>('[data-reveal]');

    // Reduced motion: content is simply visible, now and for any element the
    // projects filter mounts later.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const markAll = () => all().forEach((el) => el.setAttribute('data-shown', ''));
      markAll();
      const mo = new MutationObserver(markAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const showIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.setAttribute('data-shown', '');
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    const hideIO = new IntersectionObserver((entries) => {
      for (const e of entries) if (!e.isIntersecting) e.target.removeAttribute('data-shown');
    });

    const watch = (el: HTMLElement) => {
      showIO.observe(el);
      hideIO.observe(el);
    };
    all().forEach(watch);

    // Project tiles re-mount when the filter changes; pick up newcomers.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches('[data-reveal]')) watch(node);
          node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(watch);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      showIO.disconnect();
      hideIO.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
