'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Dictionary, Locale } from '@/content/i18n';
import { site } from '@/content/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const FIELD =
  'w-full min-w-0 rounded-[4px] border border-noir/35 bg-ivoire px-4 py-[15px] text-[15px] text-noir placeholder:text-noir/65 focus-visible:outline-offset-1';

export function Contact({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const nextErrors: Record<string, string> = {};
    if (!String(data.name).trim()) nextErrors.name = t.fRequired;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) nextErrors.email = t.fInvalidEmail;
    if (!String(data.message).trim()) nextErrors.message = t.fRequired;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-orange px-5 py-[90px] text-noir md:px-10 md:py-[120px]">
      {/* Photo 4 as a duotone: greyscale multiplied into the orange, faded out
          towards the form so the fields keep a clean ground. */}
      {site.photos.contact ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(180deg,#000_0%,#000_40%,transparent_85%)] md:[mask-image:linear-gradient(90deg,#000_0%,#000_35%,transparent_70%)]"
        >
          <Image
            src={site.photos.contact}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover opacity-35 mix-blend-multiply grayscale"
          />
        </div>
      ) : null}

      <div
        aria-hidden="true"
        className="vz-stroke-noir pointer-events-none absolute inset-x-0 top-[18px] text-[64px] font-black tracking-[-.04em] whitespace-nowrap uppercase [-webkit-text-stroke-color:rgba(6,7,11,.22)] [-webkit-text-stroke-width:1.5px] md:text-[120px]"
      >
        {t.contactGhost}
      </div>

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-12 md:grid-cols-[1.1fr_minmax(0,1fr)] md:gap-20">
        <div data-reveal="left">
          <h2 className="m-0 text-[clamp(38px,9vw,80px)] leading-[.95] font-black tracking-[-.04em] uppercase md:text-[clamp(44px,5.5vw,80px)]">
            {t.contactTitle}
          </h2>
          <p className="mt-6 mb-0 max-w-[480px] font-serif text-[21px] leading-[1.35] text-pretty md:mt-[30px] md:text-[25px]">
            {t.contactSub}
          </p>
          {site.email ? (
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-block border-b border-noir/40 text-[14px] font-semibold tracking-[.1em] uppercase transition hover:-translate-y-[2px] hover:border-noir"
            >
              {site.email}
            </a>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          data-reveal="right"
          style={{ '--reveal-delay': '140ms' } as React.CSSProperties}
          className="flex flex-col gap-[14px]"
        >
          {/* Honeypot — bots fill it, humans never see it. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute h-0 w-0 opacity-0"
          />

          <div className="flex flex-col gap-[14px] sm:flex-row">
            <div className="flex-1">
              <label className="sr-only" htmlFor="vz-name">
                {t.fName}
              </label>
              <input
                id="vz-name"
                name="name"
                placeholder={t.fName}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                className={FIELD}
              />
              {errors.name ? <FieldError>{errors.name}</FieldError> : null}
            </div>
            <div className="flex-1">
              <label className="sr-only" htmlFor="vz-email">
                {t.fEmail}
              </label>
              <input
                id="vz-email"
                name="email"
                type="email"
                placeholder={t.fEmail}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                className={FIELD}
              />
              {errors.email ? <FieldError>{errors.email}</FieldError> : null}
            </div>
          </div>

          <div>
            <label className="sr-only" htmlFor="vz-project">
              {t.fProject}
            </label>
            <select id="vz-project" name="project" defaultValue="" className={FIELD}>
              <option value="" disabled>
                {t.fProject}
              </option>
              {t.fProjectOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="sr-only" htmlFor="vz-message">
              {t.fMessage}
            </label>
            <textarea
              id="vz-message"
              name="message"
              rows={4}
              placeholder={t.fMessage}
              aria-invalid={Boolean(errors.message)}
              className={`${FIELD} resize-y`}
            />
            {errors.message ? <FieldError>{errors.message}</FieldError> : null}
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="self-start rounded-full bg-noir px-9 py-4 text-[13px] font-bold tracking-[.1em] text-ivoire uppercase transition hover:scale-[1.04] hover:text-orange active:scale-[.97] disabled:opacity-60"
          >
            {status === 'sending' ? t.fSending : t.fSend}
          </button>

          <p aria-live="polite" className="m-0 min-h-[20px] text-[14px] font-semibold">
            {status === 'sent' ? t.fSuccess : null}
            {status === 'error' ? t.fError : null}
          </p>
        </form>
      </div>
    </section>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="m-0 mt-[6px] text-[12px] font-semibold text-noir/70">{children}</p>;
}
