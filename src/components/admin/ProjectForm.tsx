'use client';

import Link from 'next/link';
import { useActionState, useCallback, useState } from 'react';
import { saveProject, type FormState } from '@/app/admin/actions';
import { PROJECT_SERVICES } from '@/lib/projects/services';
import { parseSoundCloudUrl } from '@/lib/soundcloud';
import { formatDuration, parseYouTubeId, youTubeWatchUrl } from '@/lib/youtube';
import { SoundCloudPreview } from './SoundCloudPreview';
import { buttonClass, Field, FormError, inputClass, SubmitButton } from './ui';
import { YouTubePreview } from './YouTubePreview';

export type ProjectFormValues = {
  id?: number;
  kind: 'video' | 'audio';
  youtube_id: string | null;
  soundcloud_url: string | null;
  title_fr: string;
  title_en: string;
  client: string;
  description_fr: string;
  description_en: string;
  services: string[];
  duration_seconds: number | null;
  published: boolean;
  featured: boolean;
  tag_ids: number[];
};

type Tag = { id: number; label_fr: string };

const EMPTY: ProjectFormValues = {
  kind: 'video',
  youtube_id: null,
  soundcloud_url: null,
  title_fr: '',
  title_en: '',
  client: '',
  description_fr: '',
  description_en: '',
  services: [],
  duration_seconds: null,
  published: true,
  featured: false,
  tag_ids: [],
};

const KINDS = [
  {
    value: 'video',
    label: 'Vidéo',
    hint: 'Vignette YouTube ; la vidéo s’ouvre en grand.',
  },
  {
    value: 'audio',
    label: 'Audio',
    hint: 'Tuile avec forme d’onde ; SoundCloud ou YouTube joue dans la tuile.',
  },
] as const;

function Pill({
  name,
  value,
  checked,
  onToggle,
  children,
}: {
  name: string;
  value: string | number;
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-orange ${
        checked ? 'border-orange bg-orange text-noir' : 'border-anthracite hover:border-muted'
      }`}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      {children}
    </label>
  );
}

const toggleIn = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

/**
 * Controlled on purpose: React resets uncontrolled forms after every action,
 * which would wipe the editor's input whenever validation fails.
 */
export function ProjectForm({ project, tags }: { project?: ProjectFormValues; tags: Tag[] }) {
  const initial = project ?? EMPTY;
  const [state, action] = useActionState<FormState, FormData>(saveProject, {});

  const [kind, setKind] = useState(initial.kind);
  const [youtube, setYoutube] = useState(initial.youtube_id ? youTubeWatchUrl(initial.youtube_id) : '');
  const [soundcloud, setSoundcloud] = useState(initial.soundcloud_url ?? '');
  const [titleFr, setTitleFr] = useState(initial.title_fr);
  const [titleEn, setTitleEn] = useState(initial.title_en);
  const [client, setClient] = useState(initial.client);
  const [descriptionFr, setDescriptionFr] = useState(initial.description_fr);
  const [descriptionEn, setDescriptionEn] = useState(initial.description_en);
  const [services, setServices] = useState(initial.services);
  const [duration, setDuration] = useState(
    initial.duration_seconds != null ? formatDuration(initial.duration_seconds) : '',
  );
  const [durationTouched, setDurationTouched] = useState(initial.duration_seconds != null);
  const [published, setPublished] = useState(initial.published);
  const [featured, setFeatured] = useState(initial.featured);
  const [tagIds, setTagIds] = useState(initial.tag_ids);

  const videoId = parseYouTubeId(youtube);
  const soundcloudLink = kind === 'audio' ? parseSoundCloudUrl(soundcloud) : null;
  const errors = state.fieldErrors ?? {};

  // Fill the duration from the player unless the editor typed one themselves.
  const handleDuration = useCallback(
    (seconds: number) => {
      if (!durationTouched) setDuration(formatDuration(seconds));
    },
    [durationTouched],
  );

  const invalid = (name: string) =>
    errors[name] ? { 'aria-invalid': true, 'aria-describedby': `${name}-error` } : {};

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
      {project?.id ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="flex flex-col gap-6">
        <FormError message={state.error} />

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-1.5 block text-[13px] font-semibold">Type</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {KINDS.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer gap-3 rounded-[4px] border p-3 transition-colors ${
                  kind === option.value ? 'border-orange bg-orange/10' : 'border-anthracite hover:border-muted'
                }`}
              >
                <input
                  type="radio"
                  name="kind"
                  value={option.value}
                  checked={kind === option.value}
                  onChange={() => setKind(option.value)}
                  className="mt-0.5 accent-orange"
                />
                <span>
                  <span className="block text-[14px] font-semibold">{option.label}</span>
                  <span className="block text-[12px] text-muted">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {kind === 'audio' ? (
          <Field
            label="Lien SoundCloud"
            htmlFor="soundcloud"
            error={errors.soundcloud}
            hint="Facultatif. S’il est renseigné, c’est SoundCloud qui joue sur le site."
          >
            <input
              id="soundcloud"
              name="soundcloud"
              type="text"
              inputMode="url"
              autoComplete="off"
              placeholder="https://soundcloud.com/artiste/morceau"
              value={soundcloud}
              onChange={(e) => {
                const next = parseSoundCloudUrl(e.target.value);
                if (next && next.url !== soundcloudLink?.url) setDurationTouched(false);
                setSoundcloud(e.target.value);
              }}
              className={inputClass}
              {...invalid('soundcloud')}
            />
          </Field>
        ) : (
          <input type="hidden" name="soundcloud" value="" />
        )}

        <Field
          label="Lien YouTube"
          htmlFor="youtube"
          error={errors.youtube}
          hint={
            kind === 'audio'
              ? 'Facultatif si un lien SoundCloud est renseigné. Public ou non répertorié.'
              : 'La vidéo peut être publique ou non répertoriée, mais pas privée.'
          }
        >
          <input
            id="youtube"
            name="youtube"
            // Not type="url": pasted links without https:// and youtu.be/… must pass.
            type="text"
            inputMode="url"
            autoComplete="off"
            required={kind === 'video'}
            placeholder="https://www.youtube.com/watch?v=…"
            value={youtube}
            onChange={(e) => {
              const nextId = parseYouTubeId(e.target.value);
              // A different video brings its own duration.
              if (nextId && nextId !== videoId) setDurationTouched(false);
              setYoutube(e.target.value);
            }}
            className={inputClass}
            {...invalid('youtube')}
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Nom du film / projet (FR)" htmlFor="title_fr" error={errors.title_fr}>
            <input
              id="title_fr"
              name="title_fr"
              required
              maxLength={140}
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              className={inputClass}
              {...invalid('title_fr')}
            />
          </Field>
          <Field
            label="Nom du film / projet (EN)"
            htmlFor="title_en"
            error={errors.title_en}
            hint="Vide : le nom français est utilisé."
          >
            <input
              id="title_en"
              name="title_en"
              maxLength={140}
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className={inputClass}
              {...invalid('title_en')}
            />
          </Field>
        </div>

        <div className="max-w-[420px]">
          <Field
            label="Client"
            htmlFor="client"
            error={errors.client}
            hint="Facultatif. Affiché après le nom : « Nom / Client »."
          >
            <input
              id="client"
              name="client"
              maxLength={80}
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={inputClass}
              {...invalid('client')}
            />
          </Field>
        </div>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-1.5 block text-[13px] font-semibold">Catégories</legend>
          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Pill
                  key={tag.id}
                  name="tag_ids"
                  value={tag.id}
                  checked={tagIds.includes(tag.id)}
                  onToggle={() => setTagIds((ids) => toggleIn(ids, tag.id))}
                >
                  {tag.label_fr}
                </Pill>
              ))}
            </div>
          ) : null}
          <p className="m-0 mt-2 text-[12px] text-muted">
            La première catégorie (dans l’ordre des filtres) s’affiche sur la tuile.{' '}
            <Link href="/admin/tags" className="text-ivoire underline underline-offset-2 hover:text-orange">
              Gérer les catégories
            </Link>
          </p>
        </fieldset>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-1.5 block text-[13px] font-semibold">Prestations</legend>
          <div className="flex flex-wrap gap-2">
            {PROJECT_SERVICES.map((service) => (
              <Pill
                key={service.id}
                name="services"
                value={service.id}
                checked={services.includes(service.id)}
                onToggle={() => setServices((list) => toggleIn(list, service.id))}
              >
                {service.label}
              </Pill>
            ))}
          </div>
          <p className="m-0 mt-2 text-[12px] text-muted">
            Affichées sous le nom, dans cet ordre : « Sound Direction · Sound Design · Mix ».
          </p>
        </fieldset>

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Description (FR)"
            htmlFor="description_fr"
            error={errors.description_fr}
            hint="Courte et vendeuse. Cachée sur la tuile, lisible via « En savoir plus »."
          >
            <textarea
              id="description_fr"
              name="description_fr"
              rows={5}
              maxLength={1000}
              value={descriptionFr}
              onChange={(e) => setDescriptionFr(e.target.value)}
              className={`${inputClass} resize-y`}
              {...invalid('description_fr')}
            />
          </Field>
          <Field
            label="Description (EN)"
            htmlFor="description_en"
            error={errors.description_en}
            hint="Vide : la description française est utilisée."
          >
            <textarea
              id="description_en"
              name="description_en"
              rows={5}
              maxLength={1000}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className={`${inputClass} resize-y`}
              {...invalid('description_en')}
            />
          </Field>
        </div>

        {kind === 'audio' ? (
          <div className="max-w-[200px]">
            <Field
              label="Durée"
              htmlFor="duration"
              error={errors.duration}
              hint="Remplie automatiquement depuis le lecteur."
            >
              <input
                id="duration"
                name="duration"
                placeholder="3:42"
                inputMode="numeric"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setDurationTouched(e.target.value.trim() !== '');
                }}
                className={`${inputClass} tabular-nums`}
                {...invalid('duration')}
              />
            </Field>
          </div>
        ) : (
          <input type="hidden" name="duration" value={duration} />
        )}

        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-center gap-3 text-[14px]">
            <input
              type="checkbox"
              name="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-orange"
            />
            <span>
              <span className="font-semibold">Publié</span>
              <span className="text-muted"> — visible sur la page Projets</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-[14px]">
            <input
              type="checkbox"
              name="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-orange"
            />
            <span>
              <span className="font-semibold">Mettre en avant sur l’accueil</span>
              <span className="text-muted"> — dans la sélection de la page d’accueil</span>
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-anthracite pt-6">
          <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
          <Link href="/admin" className={buttonClass.secondary}>
            Annuler
          </Link>
        </div>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <p className="m-0 mb-1.5 text-[13px] font-semibold">Aperçu</p>
        {soundcloudLink ? (
          <SoundCloudPreview
            url={soundcloudLink.kind === 'page' ? soundcloudLink.url : null}
            onDuration={handleDuration}
          />
        ) : (
          <YouTubePreview videoId={videoId} onDuration={handleDuration} />
        )}
      </aside>
    </form>
  );
}
