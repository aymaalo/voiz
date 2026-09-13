'use client';

import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { buttonClass } from './ui';

/**
 * Two-step destructive button: the first click arms it, the second submits the
 * surrounding form. Disarms itself after a few seconds.
 */
export function ConfirmSubmit({
  label = 'Supprimer',
  confirmLabel = 'Confirmer la suppression',
  ariaLabel,
}: {
  label?: string;
  confirmLabel?: string;
  ariaLabel?: string;
}) {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  if (armed || pending) {
    return (
      <button
        type="submit"
        disabled={pending}
        className={`${buttonClass.danger} bg-orange/15 text-orange`}
      >
        {pending ? 'Suppression…' : confirmLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setArmed(true)}
      aria-label={ariaLabel}
      className={buttonClass.danger}
    >
      {label}
    </button>
  );
}
