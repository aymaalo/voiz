'use client';

import { useActionState } from 'react';
import { signIn, type FormState } from '@/app/admin/actions';
import { Field, FormError, inputClass, SubmitButton } from './ui';

export function LoginForm() {
  const [state, action] = useActionState<FormState, FormData>(signIn, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={state.error} />
      <Field label="Email" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </Field>
      <Field label="Mot de passe" htmlFor="password" error={errors.password}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>
    </form>
  );
}
