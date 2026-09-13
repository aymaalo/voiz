'use client';

import { useId, useRef, useState } from 'react';
import type { Dictionary } from '@/content/i18n';

export function Services({ t }: { t: Dictionary }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="mx-auto max-w-[1280px] px-5 pt-[100px] pb-[80px] md:px-10 md:pt-[130px] md:pb-[100px]"
    >
      {/* The lead sits beside the heading rather than under it, so the section
          opens on one composed line instead of two full-width stacks. */}
      <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
        <h2
          data-reveal=""
          className="m-0 text-[clamp(52px,7vw,110px)] leading-none font-black tracking-[-.04em] uppercase"
        >
          {t.servTitle}
        </h2>
        <p
          data-reveal=""
          style={{ '--reveal-delay': '90ms' } as React.CSSProperties}
          className="m-0 max-w-[640px] font-serif text-[clamp(20px,2.4vw,29px)] leading-[1.3] text-ivoire/90 text-pretty lg:pb-[10px]"
        >
          {t.servIntro}
        </p>
      </div>

      {/* Hover is tracked on the grid as a whole: a card opens when the mouse
          enters it and everything closes only when the mouse leaves the grid.
          The cards carry their own side padding instead of a column gap, so
          the hover zones touch and crossing between two cards never passes
          over "nothing" (which used to close, then reopen, a card). */}
      <div
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(null)}
        className="-mx-5 mt-14 grid grid-cols-1 md:mt-[90px] md:grid-cols-2 md:gap-y-10 lg:grid-cols-4"
      >
        {t.services.map((s, i) => (
          <ServiceCard
            key={s.name}
            service={s}
            index={i}
            open={open === i}
            onHover={() => setOpen(i)}
            onToggle={() => setOpen((current) => (current === i ? null : i))}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Name and one-line lead always show; the detail appears on hover. From md up
 * the detail's space is always reserved and only its opacity changes, so an
 * opening card never pushes the rest of the page. On phones it is a regular
 * tap-to-open disclosure, where content moving down is expected.
 */
function ServiceCard({
  service,
  index,
  open,
  onHover,
  onToggle,
}: {
  service: Dictionary['services'][number];
  index: number;
  open: boolean;
  onHover: () => void;
  onToggle: () => void;
}) {
  const panelId = useId();
  // A mouse click lands on a card hover has already opened — it must not close it.
  const lastPointer = useRef<string>('');

  return (
    <article
      data-reveal=""
      style={{ '--reveal-delay': `${(index % 4) * 80}ms` } as React.CSSProperties}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onHover()}
      onPointerDown={(e) => {
        lastPointer.current = e.pointerType;
      }}
      className="px-5"
    >
      <div
        className={`flex h-full flex-col border-t pt-6 pb-4 transition-colors duration-300 md:pt-7 ${
          open ? 'border-orange' : 'border-anthracite'
        }`}
      >
        <h3 className="m-0">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => {
              if (lastPointer.current !== 'mouse') onToggle();
              lastPointer.current = '';
            }}
            className={`flex w-full cursor-pointer items-start justify-between gap-4 text-left text-[clamp(21px,2.1vw,27px)] leading-tight font-bold tracking-[-.02em] uppercase transition-colors duration-300 ${
              open ? 'text-orange' : ''
            }`}
          >
            {service.name}
            <span
              aria-hidden="true"
              className={`mt-1 text-[18px] font-normal transition-transform duration-300 [@media(hover:hover)]:hidden ${
                open ? 'rotate-45' : ''
              }`}
            >
              +
            </span>
          </button>
        </h3>

        <p className="m-0 mt-3 text-[15px] leading-[1.5] text-ivoire/85 md:text-[16px]">
          {service.lead}
        </p>

        {/* Phones: 0fr → 1fr animates the height open. md+: always 1fr, so the
            space is held and only the text fades and settles into place.
            inert keeps hidden text out of the tab order and accessibility tree. */}
        <div
          id={panelId}
          inert={!open}
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:grid-rows-[1fr] ${
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div
            className={`overflow-hidden transition-transform duration-300 ease-out ${
              open ? 'translate-y-0' : 'md:translate-y-2'
            }`}
          >
            <p className="m-0 pt-4 text-[14px] leading-[1.7] text-muted md:text-[15px]">
              {service.detail}
            </p>
            <p className="m-0 pt-3 text-[14px] leading-[1.6] font-semibold text-balance md:text-[15px]">
              <span aria-hidden="true" className="text-orange">
                →{' '}
              </span>
              {service.goal}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
