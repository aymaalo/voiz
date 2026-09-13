'use client';

import { useActionState, useState } from 'react';
import { saveTag, type FormState } from '@/app/admin/actions';
import { buttonClass, inputClass, SubmitButton } from './ui';

type Tag = { id: number; label_fr: string; label_en: string };

/** Inline editor for one existing tag. */
export function TagForm({ tag }: { tag: Tag }) {
  const [state, action] = useActionState<FormState, FormData>(saveTag, {});
  // Controlled, so the row keeps its values after React's post-action reset.
  const [labelFr, setLabelFr] = useState(tag.label_fr);
  const [labelEn, setLabelEn] = useState(tag.label_en);
  const dirty = labelFr !== tag.label_fr || labelEn !== tag.label_en;

  return (
    <TagFields
      action={action}
      state={state}
      prefix={`tag-${tag.id}`}
      hidden={<input type="hidden" name="id" value={tag.id} />}
      fr={{ value: labelFr, onChange: (e) => setLabelFr(e.target.value) }}
      en={{ value: labelEn, onChange: (e) => setLabelEn(e.target.value) }}
      submit={
        dirty ? (
          <SubmitButton pendingLabel="…" className={buttonClass.secondary}>
            Enregistrer
          </SubmitButton>
        ) : (
          <span className="min-w-[96px] py-2 text-[12px] text-muted" aria-live="polite">
            {state.ok ? '✓ Enregistré' : ''}
          </span>
        )
      }
    />
  );
}

/** The "add a tag" row. Uncontrolled: React clears it after each successful add. */
export function NewTagForm() {
  const [state, action] = useActionState<FormState, FormData>(saveTag, {});

  return (
    <TagFields
      action={action}
      state={state}
      prefix="tag-new"
      submit={
        <SubmitButton pendingLabel="…" className={buttonClass.secondary}>
          Ajouter
        </SubmitButton>
      }
    />
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function TagFields({
  action,
  state,
  prefix,
  hidden,
  fr,
  en,
  submit,
}: {
  action: (formData: FormData) => void;
  state: FormState;
  prefix: string;
  hidden?: React.ReactNode;
  fr?: InputProps;
  en?: InputProps;
  submit: React.ReactNode;
}) {
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-1 flex-wrap items-start gap-2">
      {hidden}
      <div className="min-w-[160px] flex-1">
        <label htmlFor={`${prefix}-fr`} className="sr-only">
          Nom (FR)
        </label>
        <input
          id={`${prefix}-fr`}
          name="label_fr"
          required
          maxLength={40}
          placeholder="Nom (FR)"
          className={`${inputClass} py-2`}
          aria-invalid={errors.label_fr ? true : undefined}
          {...fr}
        />
        {errors.label_fr ? (
          <p className="m-0 mt-1 text-[12px] text-orange">{errors.label_fr}</p>
        ) : null}
      </div>
      <div className="min-w-[160px] flex-1">
        <label htmlFor={`${prefix}-en`} className="sr-only">
          Nom (EN)
        </label>
        <input
          id={`${prefix}-en`}
          name="label_en"
          maxLength={40}
          placeholder="Nom (EN) — vide : français"
          className={`${inputClass} py-2`}
          aria-invalid={errors.label_en ? true : undefined}
          {...en}
        />
        {errors.label_en ? (
          <p className="m-0 mt-1 text-[12px] text-orange">{errors.label_en}</p>
        ) : null}
      </div>
      {submit}
      {state.error ? <p className="m-0 w-full text-[12px] text-orange">{state.error}</p> : null}
    </form>
  );
}
