'use client';

import { useActionState } from 'react';
import { changePassword, type FormState } from '@/app/admin/actions';
import { Field, FormError, inputClass, SubmitButton } from './ui';

export function PasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(changePassword, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={state.error} />
      {state.ok ? (
        <p role="status" className="m-0 rounded-[4px] border border-anthracite px-4 py-3 text-[13px]">
          Mot de passe modifié.
        </p>
      ) : null}
      <Field
        label="Nouveau mot de passe"
        htmlFor="password"
        error={errors.password}
        hint="Au moins 10 caractères."
      >
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={72}
          className={inputClass}
        />
      </Field>
      <Field label="Confirmer" htmlFor="confirm" error={errors.confirm}>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          className={inputClass}
        />
      </Field>
      <div>
        <SubmitButton pendingLabel="Enregistrement…">Changer le mot de passe</SubmitButton>
      </div>
    </form>
  );
}
