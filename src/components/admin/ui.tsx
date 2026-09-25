'use client';

import { useFormStatus } from 'react-dom';

/** Shared look for the back-office — the site's tokens, in a quieter register. */
export const inputClass =
  'w-full rounded-[4px] border border-anthracite bg-noir px-3 py-2.5 text-[14px] text-ivoire outline-none transition-colors placeholder:text-muted/60 focus:border-orange aria-invalid:border-orange';

export const buttonClass = {
  primary:
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-orange px-5 py-2.5 text-[13px] font-bold text-noir transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60',
  secondary:
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-anthracite px-4 py-2 text-[13px] font-semibold transition-colors hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-anthracite disabled:hover:text-ivoire',
  icon: 'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-anthracite text-[13px] transition-colors hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-anthracite disabled:hover:text-ivoire',
  danger:
    'inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:text-orange',
};

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="m-0 mt-1.5 text-[12px] text-orange">
          {error}
        </p>
      ) : hint ? (
        <p className="m-0 mt-1.5 text-[12px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  className = buttonClass.primary,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="m-0 rounded-[4px] border border-orange/60 bg-orange/10 px-4 py-3 text-[13px]">
      {message}
    </p>
  );
}
