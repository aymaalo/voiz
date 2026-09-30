'use client';

import { useActionState, useEffect, useId, useState } from 'react';
import { saveContent, type FormState } from '@/app/admin/actions';
import type { Photo } from '@/content/site';
import {
  fieldId,
  joinParagraphs,
  splitParagraphs,
  type ContentField,
  type ContentSection,
  type ContentValue,
  type ListField,
  type ListItem,
  type LocalizedParagraphs,
  type LocalizedText,
  type SubField,
} from '@/lib/content/fields';
import { PhotoInput } from './PhotoInput';
import { buttonClass, inputClass, SubmitButton } from './ui';

type Values = Record<string, ContentValue>;
/** What the inputs hold: the stored values, except paragraphs are one text per language. */
type Draft = Record<string, unknown>;
type Errors = Partial<Record<string, string>>;

const LANGS = [
  { id: 'fr', label: 'Français' },
  { id: 'en', label: 'English' },
] as const;

function toDraft(section: ContentSection, values: Values): Draft {
  return Object.fromEntries(
    section.fields.map((field) => {
      const value = values[fieldId(field)];
      if (field.type !== 'paragraphs') return [fieldId(field), value];
      const { fr, en } = value as LocalizedParagraphs;
      return [fieldId(field), { fr: joinParagraphs(fr, field.split), en: joinParagraphs(en, field.split) }];
    }),
  );
}

/** Mirrors the server's trimming, so a saved form compares equal to what was saved. */
function trimDeep(value: unknown): unknown {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(trimDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, trimDeep(v)]));
  }
  return value;
}

function toPayload(section: ContentSection, draft: Draft): Values {
  return Object.fromEntries(
    section.fields.map((field) => {
      const value = draft[fieldId(field)];
      if (field.type !== 'paragraphs') return [fieldId(field), trimDeep(value) as ContentValue];
      const { fr, en } = value as LocalizedText;
      return [fieldId(field), { fr: splitParagraphs(fr, field.split), en: splitParagraphs(en, field.split) }];
    }),
  );
}

/** The error for a path, or the first one below it ("pitchBody.fr" catches "pitchBody.fr.2"). */
function errorAt(errors: Errors, path: string, exact = false): string | undefined {
  if (errors[path]) return errors[path];
  if (exact) return undefined;
  const nested = Object.keys(errors).find((key) => key.startsWith(`${path}.`));
  return nested ? errors[nested] : undefined;
}

/**
 * Controlled, like the project form: React resets uncontrolled forms after
 * every action, which would wipe the editor's input whenever validation fails.
 */
export function ContentForm({
  section,
  values,
  defaults,
}: {
  section: ContentSection;
  values: Values;
  defaults: Values;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveContent, {});
  const [draft, setDraft] = useState(() => toDraft(section, values));
  const [uploads, setUploads] = useState(0);

  const payload = JSON.stringify(toPayload(section, draft));
  const dirty = payload !== JSON.stringify(toPayload(section, toDraft(section, values)));
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = (id: string, value: unknown) => setDraft((current) => ({ ...current, [id]: value }));
  const defaultDraft = toDraft(section, defaults);
  const isDefault = (id: string) =>
    JSON.stringify(trimDeep(draft[id])) === JSON.stringify(trimDeep(defaultDraft[id]));

  return (
    <form action={action} className="flex max-w-[980px] flex-col gap-10">
      <input type="hidden" name="section" value={section.id} />
      <input type="hidden" name="payload" value={payload} />

      {section.fields.map((field) => {
        const id = fieldId(field);
        return (
          <FieldBlock
            key={id}
            field={field}
            resetLabel={field.type === 'photo' ? 'Photo d’origine' : 'Texte d’origine'}
            onReset={isDefault(id) ? undefined : () => set(id, defaultDraft[id])}
          >
            {field.type === 'text' && field.shared ? (
              <TextInput
                id={id}
                label={field.label}
                srOnlyLabel
                options={field}
                value={draft[id] as string}
                onChange={(value) => set(id, value)}
                error={errorAt(errors, id)}
              />
            ) : field.type === 'text' || field.type === 'paragraphs' ? (
              <LocalizedInputs
                id={id}
                field={field}
                value={draft[id] as LocalizedText}
                onChange={(value) => set(id, value)}
                errors={errors}
              />
            ) : field.type === 'photo' ? (
              <PhotoInput
                id={id}
                slot={field.key}
                value={draft[id] as Photo | null}
                onChange={(value) => set(id, value)}
                onUploadingChange={(uploading) => setUploads((n) => n + (uploading ? 1 : -1))}
                error={errorAt(errors, id)}
              />
            ) : (
              <ListInput
                id={id}
                field={field}
                items={draft[id] as ListItem[]}
                onChange={(items) => set(id, items)}
                errors={errors}
              />
            )}
          </FieldBlock>
        );
      })}

      {/* Stays in view, so a long section never hides the save button. */}
      <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-anthracite bg-noir/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
        <SubmitButton pendingLabel="Enregistrement…" disabled={uploads > 0}>
          Enregistrer
        </SubmitButton>
        <p aria-live="polite" className="m-0 text-[13px]">
          {uploads > 0 ? (
            <span className="text-muted">Téléversement de la photo…</span>
          ) : state.error && dirty ? (
            <span className="text-orange">{state.error}</span>
          ) : dirty ? (
            <span className="text-muted">Modifications non enregistrées</span>
          ) : state.ok ? (
            <span>✓ Enregistré — en ligne</span>
          ) : null}
        </p>
        <a
          href={`/fr${section.anchor}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[13px] text-muted transition-colors hover:text-ivoire"
        >
          Voir sur le site ↗
        </a>
      </div>
    </form>
  );
}

function FieldBlock({
  field,
  resetLabel,
  onReset,
  children,
}: {
  field: ContentField;
  resetLabel: string;
  onReset?: () => void;
  children: React.ReactNode;
}) {
  const headingId = useId();
  return (
    <div role="group" aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h2 id={headingId} className="m-0 text-[16px] font-bold">
            {field.label}
          </h2>
          {field.hint ? <p className="m-0 mt-0.5 text-[12px] text-muted">{field.hint}</p> : null}
        </div>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer text-[12px] text-muted underline-offset-2 transition-colors hover:text-orange hover:underline"
          >
            ↺ {resetLabel}
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

type TextOptions = Pick<SubField, 'max' | 'multiline' | 'optional' | 'format' | 'placeholder'>;

function TextInput({
  id,
  label,
  srOnlyLabel = false,
  options,
  value,
  onChange,
  error,
  placeholder,
  rows,
}: {
  id: string;
  label: string;
  srOnlyLabel?: boolean;
  options: TextOptions;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  /** Set for paragraphs: a larger box without the per-field length cap. */
  rows?: number;
}) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    placeholder: placeholder ?? options.placeholder,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className={srOnlyLabel ? 'sr-only' : 'mb-1.5 block text-[12px] font-semibold text-muted'}
      >
        {label}
      </label>
      {rows ? (
        <textarea {...shared} rows={rows} className={`${inputClass} field-sizing-content min-h-[120px] resize-y leading-relaxed`} />
      ) : options.multiline ? (
        <textarea {...shared} rows={3} maxLength={options.max} className={`${inputClass} field-sizing-content min-h-[76px] resize-y`} />
      ) : (
        <input
          {...shared}
          type={options.format === 'email' ? 'email' : 'text'}
          inputMode={options.format === 'url' ? 'url' : undefined}
          maxLength={options.max}
          className={inputClass}
        />
      )}
      {error ? (
        <p id={errorId} className="m-0 mt-1.5 text-[12px] text-orange">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** French and English side by side; empty English falls back to French. */
function LocalizedInputs({
  id,
  field,
  value,
  onChange,
  errors,
}: {
  id: string;
  field: TextOptions | Extract<ContentField, { type: 'paragraphs' }>;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  errors: Errors;
}) {
  const paragraphs = 'split' in field;
  const rows = paragraphs ? Math.max(4, Math.min(16, value.fr.split('\n').length + 1)) : undefined;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {LANGS.map((lang) => (
        <TextInput
          key={lang.id}
          id={`${id}-${lang.id}`}
          label={lang.label}
          options={paragraphs ? { max: field.max } : field}
          value={value[lang.id]}
          onChange={(next) => onChange({ ...value, [lang.id]: next })}
          error={errorAt(errors, `${id}.${lang.id}`)}
          placeholder={lang.id === 'en' ? 'Vide : le texte français est utilisé' : undefined}
          rows={rows}
        />
      ))}
    </div>
  );
}

function emptyItem(field: ListField): ListItem {
  return Object.fromEntries(field.fields.map((sub) => [sub.key, sub.shared ? '' : { fr: '', en: '' }]));
}

function ListInput({
  id,
  field,
  items,
  onChange,
  errors,
}: {
  id: string;
  field: ListField;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  errors: Errors;
}) {
  const move = (from: number, to: number) => {
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };
  const update = (index: number, key: string, value: LocalizedText | string) =>
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  const listError = errorAt(errors, id, true);

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 ? (
        <p className="m-0 rounded-[6px] border border-dashed border-anthracite p-4 text-[13px] text-muted">
          Aucun élément.
        </p>
      ) : null}

      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map((item, index) => (
          <li key={index} className="rounded-[6px] border border-anthracite bg-card p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h3 className="m-0 mr-auto text-[13px] font-bold tracking-[.12em] text-orange uppercase">
                {field.itemLabel} {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label={`Monter « ${field.itemLabel} ${index + 1} »`}
                className={buttonClass.icon}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === items.length - 1}
                aria-label={`Descendre « ${field.itemLabel} ${index + 1} »`}
                className={buttonClass.icon}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                disabled={items.length <= field.minItems}
                className={`${buttonClass.danger} disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Retirer
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {field.fields.map((sub) => {
                const path = `${id}.${index}.${sub.key}`;
                const value = item[sub.key];
                return sub.shared ? (
                  <div key={sub.key} className="md:max-w-[calc(50%-8px)]">
                    <TextInput
                      id={path}
                      label={sub.label}
                      options={sub}
                      value={value as string}
                      onChange={(next) => update(index, sub.key, next)}
                      error={errorAt(errors, path)}
                    />
                  </div>
                ) : (
                  <div key={sub.key} className="grid gap-4 md:grid-cols-2">
                    {LANGS.map((lang) => (
                      <TextInput
                        key={lang.id}
                        id={`${path}-${lang.id}`}
                        label={`${sub.label} · ${lang.label}`}
                        options={sub}
                        value={(value as LocalizedText)[lang.id]}
                        onChange={(next) => update(index, sub.key, { ...(value as LocalizedText), [lang.id]: next })}
                        error={errorAt(errors, `${path}.${lang.id}`)}
                        placeholder={lang.id === 'en' ? 'Vide : le français est utilisé' : undefined}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {listError ? <p className="m-0 text-[12px] text-orange">{listError}</p> : null}

      <div>
        <button
          type="button"
          onClick={() => onChange([...items, emptyItem(field)])}
          disabled={items.length >= field.maxItems}
          className={buttonClass.secondary}
        >
          + Ajouter {field.addLabel}
        </button>
        {items.length >= field.maxItems ? (
          <span className="ml-3 text-[12px] text-muted">{field.maxItems} au maximum.</span>
        ) : null}
      </div>
    </div>
  );
}
