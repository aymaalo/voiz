/**
 * Everything the client can edit from /admin/content: the sections of the
 * editor, their fields, how each value is stored and validated, and how it is
 * merged over the defaults written in src/content/.
 *
 * Shared by the back-office (forms and server action) and the public site, so
 * nothing here may be server-only.
 *
 * Storage: one row of public.site_content per field, keyed by fieldId(). A key
 * with no row — or with a value that no longer validates — keeps the default.
 */
import { z } from 'zod';
import { getDictionary, type Dictionary, type Locale } from '@/content/i18n';
import { site, type Photo, type PhotoSlot, type SiteContent } from '@/content/site';
import { supabaseUrl } from '@/lib/supabase/env';

// ---------------------------------------------------------------------------
// Field definitions
// ---------------------------------------------------------------------------

type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
type DictionaryTextKey = KeysOfType<Dictionary, string>;
type DictionaryParagraphsKey = KeysOfType<Dictionary, string[]>;

type TextFormat = 'email' | 'url';

type TextOptions = {
  label: string;
  hint?: string;
  max: number;
  multiline?: boolean;
  /** Required unless set — in French for localised fields; English always falls back. */
  optional?: boolean;
  format?: TextFormat;
};

/** One text per language; empty English falls back to French. */
type LocalizedTextField = TextOptions & { type: 'text'; key: DictionaryTextKey; shared?: false };
/** One text for both languages, stored with the site settings. */
type SharedTextField = TextOptions & { type: 'text'; key: 'slogan' | 'email'; shared: true };

export type TextField = LocalizedTextField | SharedTextField;

/** A list of paragraphs (or words), edited as one text box per language. */
export type ParagraphsField = {
  type: 'paragraphs';
  key: DictionaryParagraphsKey;
  label: string;
  hint?: string;
  /** "blank": paragraphs separated by an empty line; "lines": one item per line. */
  split: 'blank' | 'lines';
  itemLabel: string;
  maxItems: number;
  max: number;
};

export type SubField = Omit<TextOptions, 'hint'> & {
  key: string;
  /** Same in both languages — a person's name, a link. */
  shared?: boolean;
  placeholder?: string;
};

/** Repeated cards: services, testimonials, social links. */
export type ListField = {
  type: 'list';
  key: 'services' | 'testimonials' | 'social';
  label: string;
  hint?: string;
  /** Singular, capitalised: "Service", "Témoignage". */
  itemLabel: string;
  /** For the add button: "un service", "un témoignage". */
  addLabel: string;
  minItems: number;
  maxItems: number;
  fields: SubField[];
};

export type PhotoField = {
  type: 'photo';
  key: PhotoSlot;
  label: string;
  hint?: string;
};

export type ContentField = TextField | ParagraphsField | ListField | PhotoField;

export type ContentSection = {
  id: string;
  title: string;
  description: string;
  /** Where the section sits on the home page, for the "see on the site" link. Empty: the top. */
  anchor: string;
  fields: ContentField[];
};

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    id: 'accueil',
    title: 'Haut de page',
    description: 'Slogan, accroche, boutons et bandeau défilant, sur la vidéo d’ouverture.',
    anchor: '#top',
    fields: [
      {
        type: 'text',
        key: 'slogan',
        shared: true,
        label: 'Slogan',
        hint: 'Sous « Vortex of Noise ». Le même en français et en anglais.',
        max: 120,
      },
      { type: 'text', key: 'heroTagline', label: 'Accroche', max: 220, multiline: true },
      { type: 'text', key: 'ctaContact', label: 'Bouton « Nous contacter »', max: 40 },
      { type: 'text', key: 'ctaListen', label: 'Bouton « Écouter »', max: 40 },
      {
        type: 'paragraphs',
        key: 'marquee',
        label: 'Bandeau défilant',
        hint: 'Un élément par ligne. Le bandeau défile aussi entre Projets et Services.',
        split: 'lines',
        itemLabel: 'élément',
        maxItems: 12,
        max: 40,
      },
    ],
  },
  {
    id: 'studio',
    title: 'Présentation du studio',
    description: 'La grande phrase d’introduction, ses paragraphes et la photo du studio.',
    anchor: '#studio',
    fields: [
      {
        type: 'photo',
        key: 'studio',
        label: 'Photo du studio',
        hint: 'Paysage, 2000 px de large environ. Sur ordinateur elle occupe la moitié droite, fondue dans le noir.',
      },
      {
        type: 'text',
        key: 'studioPhotoAlt',
        label: 'Description de la photo',
        hint: 'Lue par les lecteurs d’écran et les moteurs de recherche.',
        max: 160,
        optional: true,
      },
      { type: 'text', key: 'pitchA', label: 'Grande phrase — début', max: 160 },
      {
        type: 'text',
        key: 'pitchB',
        label: 'Grande phrase — passage en orange',
        hint: 'Affiché en italique orange, entre le début et la fin.',
        max: 160,
        optional: true,
      },
      { type: 'text', key: 'pitchC', label: 'Grande phrase — fin', max: 200, optional: true },
      {
        type: 'paragraphs',
        key: 'pitchBody',
        label: 'Paragraphes',
        hint: 'Séparez les paragraphes par une ligne vide.',
        split: 'blank',
        itemLabel: 'paragraphe',
        maxItems: 6,
        max: 800,
      },
    ],
  },
  {
    id: 'projets',
    title: 'Projets — textes',
    description:
      'Titres et textes autour des projets. Les projets eux-mêmes se gèrent dans l’onglet Projets.',
    anchor: '#projets',
    fields: [
      { type: 'text', key: 'projTitle', label: 'Titre de la section (accueil)', max: 40 },
      { type: 'text', key: 'projMore', label: 'Lien « Plus de projets »', max: 40 },
      { type: 'text', key: 'projectsPageTitle', label: 'Titre de la page Projets', max: 40 },
      {
        type: 'text',
        key: 'projectsPageIntro',
        label: 'Introduction de la page Projets',
        max: 240,
        multiline: true,
      },
      { type: 'text', key: 'moreInfo', label: 'Bouton « En savoir plus » des tuiles', max: 30 },
      {
        type: 'text',
        key: 'projNone',
        label: 'Message quand aucun projet n’est en ligne',
        max: 160,
      },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    description: 'L’introduction et les cartes de services (le détail s’ouvre au survol).',
    anchor: '#services',
    fields: [
      { type: 'text', key: 'servTitle', label: 'Titre', max: 40 },
      { type: 'text', key: 'servIntro', label: 'Introduction', max: 400, multiline: true },
      {
        type: 'list',
        key: 'services',
        label: 'Services',
        hint: 'Quatre services tiennent sur une ligne sur grand écran.',
        itemLabel: 'Service',
        addLabel: 'un service',
        minItems: 1,
        maxItems: 8,
        fields: [
          { key: 'name', label: 'Nom', max: 60 },
          { key: 'lead', label: 'Accroche (toujours visible)', max: 160 },
          { key: 'detail', label: 'Détail (au survol)', max: 400, multiline: true },
          { key: 'goal', label: 'Objectif (au survol, après →)', max: 200 },
        ],
      },
    ],
  },
  {
    id: 'temoignages',
    title: 'Témoignages',
    description: 'Les citations de clients et la photo derrière elles.',
    anchor: '#temoignages',
    fields: [
      { type: 'text', key: 'quotesKicker', label: 'Titre', max: 60 },
      {
        type: 'photo',
        key: 'testimonials',
        label: 'Photo de fond',
        hint: 'Paysage, 2400 px de large environ. Affichée très assombrie derrière les cartes.',
      },
      {
        type: 'list',
        key: 'testimonials',
        label: 'Témoignages',
        hint: 'Présentés par deux, en quinconce.',
        itemLabel: 'Témoignage',
        addLabel: 'un témoignage',
        minItems: 1,
        maxItems: 12,
        fields: [
          { key: 'quote', label: 'Citation', max: 500, multiline: true },
          { key: 'author', label: 'Auteur', max: 80, shared: true },
          { key: 'role', label: 'Fonction', max: 60 },
          { key: 'tag', label: 'Étiquette', max: 40, placeholder: 'Publicité, Court-métrage…' },
        ],
      },
    ],
  },
  {
    id: 'a-propos',
    title: 'À propos',
    description: 'La présentation de VOIZ, puis celle du fondateur avec son portrait.',
    anchor: '#about',
    fields: [
      { type: 'text', key: 'aboutTitle', label: 'Titre de la section', max: 40 },
      { type: 'text', key: 'aboutVoizTitle', label: 'Studio — titre', max: 60 },
      {
        type: 'text',
        key: 'aboutVoizLead',
        label: 'Studio — introduction',
        max: 500,
        multiline: true,
      },
      {
        type: 'paragraphs',
        key: 'aboutVoizBody',
        label: 'Studio — paragraphes',
        hint: 'Séparez les paragraphes par une ligne vide. Affichés côte à côte sur ordinateur.',
        split: 'blank',
        itemLabel: 'paragraphe',
        maxItems: 6,
        max: 1000,
      },
      {
        type: 'photo',
        key: 'founder',
        label: 'Portrait du fondateur',
        hint: 'Vertical de préférence, 1000 px de large environ. Affiché dans ses proportions.',
      },
      {
        type: 'text',
        key: 'portraitAlt',
        label: 'Description du portrait',
        hint: 'Lue par les lecteurs d’écran et les moteurs de recherche.',
        max: 160,
        optional: true,
      },
      { type: 'text', key: 'aboutLiamTitle', label: 'Fondateur — nom', max: 60 },
      { type: 'text', key: 'aboutLiamRole', label: 'Fondateur — fonction', max: 60, optional: true },
      {
        type: 'paragraphs',
        key: 'aboutLiamBody',
        label: 'Fondateur — paragraphes',
        hint: 'Séparez les paragraphes par une ligne vide.',
        split: 'blank',
        itemLabel: 'paragraphe',
        maxItems: 8,
        max: 1000,
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact et réseaux',
    description: 'Le bloc orange du formulaire, l’email public et les liens vers les réseaux.',
    anchor: '#contact',
    fields: [
      { type: 'text', key: 'contactTitle', label: 'Titre', max: 80 },
      { type: 'text', key: 'contactSub', label: 'Texte', max: 400, multiline: true },
      {
        type: 'photo',
        key: 'contact',
        label: 'Photo de fond',
        hint: 'Paysage. Affichée en noir et blanc, fondue dans l’orange à gauche du formulaire.',
      },
      {
        type: 'text',
        key: 'email',
        shared: true,
        label: 'Email public',
        hint: 'Affiché sous le texte et dans le pied de page ; vide, il est masqué. Les messages du formulaire, eux, arrivent à l’adresse réglée sur le serveur.',
        max: 120,
        optional: true,
        format: 'email',
      },
      {
        type: 'list',
        key: 'social',
        label: 'Réseaux sociaux',
        hint: 'Dans le pied de page. Sans lien, le nom s’affiche sans être cliquable.',
        itemLabel: 'Réseau',
        addLabel: 'un réseau',
        minItems: 0,
        maxItems: 8,
        fields: [
          { key: 'label', label: 'Nom', max: 40, shared: true, placeholder: 'Instagram' },
          {
            key: 'href',
            label: 'Lien',
            max: 300,
            shared: true,
            optional: true,
            format: 'url',
            placeholder: 'https://…',
          },
        ],
      },
    ],
  },
  {
    id: 'pied-de-page',
    title: 'Pied de page',
    description: 'La phrase sous le logo et la mention de copyright.',
    anchor: '#contact',
    fields: [
      { type: 'text', key: 'footerTagline', label: 'Phrase sous le logo', max: 160 },
      { type: 'text', key: 'footerRights', label: 'Mention de copyright', max: 80 },
    ],
  },
  {
    id: 'referencement',
    title: 'Référencement',
    description:
      'Les titres et descriptions que montrent Google et les aperçus de liens partagés, pour l’accueil et la page Projets.',
    anchor: '',
    fields: [
      {
        type: 'text',
        key: 'metaTitle',
        label: 'Accueil — titre',
        hint: 'Environ 60 caractères au plus, au-delà Google le coupe.',
        max: 90,
      },
      {
        type: 'text',
        key: 'metaDescription',
        label: 'Accueil — description',
        hint: 'Environ 155 caractères au plus.',
        max: 300,
        multiline: true,
      },
      {
        type: 'text',
        key: 'projectsMetaTitle',
        label: 'Page Projets — titre',
        hint: 'Suivi de « · VOIZ » dans Google. Environ 55 caractères au plus.',
        max: 90,
      },
      {
        type: 'text',
        key: 'projectsMetaDescription',
        label: 'Page Projets — description',
        hint: 'Environ 155 caractères au plus.',
        max: 300,
        multiline: true,
      },
    ],
  },
];

export function getSection(id: string): ContentSection | undefined {
  return CONTENT_SECTIONS.find((section) => section.id === id);
}

/** The site_content key. Photos are prefixed: "testimonials" is also a list. */
export function fieldId(field: ContentField): string {
  return field.type === 'photo'
    ? `photo${field.key[0].toUpperCase()}${field.key.slice(1)}`
    : field.key;
}

export const ALL_FIELDS = CONTENT_SECTIONS.flatMap((section) => section.fields);

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------

export type LocalizedText = { fr: string; en: string };
export type LocalizedParagraphs = { fr: string[]; en: string[] };
/** Localised sub-fields hold { fr, en }; shared ones a plain string. */
export type ListItem = Record<string, LocalizedText | string>;

/**
 * Stored value per field type:
 *   text        LocalizedText, or string when shared
 *   paragraphs  LocalizedParagraphs
 *   list        ListItem[]
 *   photo       Photo | null
 */
export type ContentValue = LocalizedText | string | LocalizedParagraphs | ListItem[] | Photo | null;

export const PHOTO_BUCKET = 'site-images';

/** Public URL prefix of the photo bucket; only these and the built-in photos are accepted. */
export const photoBucketUrl = `${supabaseUrl}/storage/v1/object/public/${PHOTO_BUCKET}/`;

const DEFAULT_PHOTO_SRCS = new Set(Object.values(site.photos).map((photo) => photo.src));

/** The object path inside the bucket, or null for a built-in photo. */
export function photoObjectPath(src: string): string | null {
  return supabaseUrl && src.startsWith(photoBucketUrl) ? src.slice(photoBucketUrl.length) : null;
}

/** The value in the code, in stored form. */
export function defaultValue(field: ContentField): ContentValue {
  const fr = getDictionary('fr');
  const en = getDictionary('en');

  switch (field.type) {
    case 'text':
      return field.shared ? site[field.key] : { fr: fr[field.key], en: en[field.key] };
    case 'paragraphs':
      return { fr: [...fr[field.key]], en: [...en[field.key]] };
    case 'photo':
      return site.photos[field.key];
    case 'list': {
      const frItems: Record<string, string>[] =
        field.key === 'social' ? site.social : fr[field.key];
      const enItems: Record<string, string>[] =
        field.key === 'social' ? site.social : en[field.key];
      return frItems.map((item, index) =>
        Object.fromEntries(
          field.fields.map((sub) => [
            sub.key,
            sub.shared
              ? (item[sub.key] ?? '')
              : { fr: item[sub.key] ?? '', en: enItems[index]?.[sub.key] ?? '' },
          ]),
        ),
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function textSchema(
  { max, format }: { max: number; format?: TextFormat },
  requiredMessage: string | null,
) {
  let schema = z.string().trim().max(max, `${max} caractères maximum.`);
  if (requiredMessage) schema = schema.min(1, requiredMessage);
  if (format === 'email') {
    return schema.refine((v) => !v || z.email().safeParse(v).success, 'Adresse email invalide.');
  }
  if (format === 'url') {
    return schema.refine(
      (v) => !v || (/^https?:\/\/\S+$/.test(v) && URL.canParse(v)),
      'Lien invalide : il doit commencer par https://',
    );
  }
  return schema;
}

function localizedSchema(options: TextOptions) {
  return z.object({
    fr: textSchema(options, options.optional ? null : 'Obligatoire en français.'),
    en: textSchema(options, null),
  });
}

const PhotoSchema = z
  .object({
    src: z
      .string()
      .max(500)
      .refine(
        (src) => DEFAULT_PHOTO_SRCS.has(src) || (photoObjectPath(src) ?? '').length > 0,
        'Photo non reconnue. Téléversez-la à nouveau.',
      ),
    width: z.number().int().min(1).max(20000),
    height: z.number().int().min(1).max(20000),
  })
  .nullable();

export function fieldSchema(field: ContentField): z.ZodType<ContentValue> {
  switch (field.type) {
    case 'text':
      return field.shared
        ? textSchema(field, field.optional ? null : 'Ce champ est obligatoire.')
        : localizedSchema(field);
    case 'paragraphs': {
      const item = z.string().trim().min(1).max(field.max, `Un ${field.itemLabel} dépasse ${field.max} caractères.`);
      const tooMany = `${field.maxItems} ${field.itemLabel}s maximum.`;
      return z.object({
        fr: z.array(item).min(1, `Au moins un ${field.itemLabel} en français.`).max(field.maxItems, tooMany),
        en: z.array(item).max(field.maxItems, tooMany),
      });
    }
    case 'photo':
      return PhotoSchema;
    case 'list':
      return z
        .array(
          z.object(
            Object.fromEntries(
              field.fields.map((sub) => [
                sub.key,
                sub.shared
                  ? textSchema(sub, sub.optional ? null : 'Ce champ est obligatoire.')
                  : localizedSchema(sub),
              ]),
            ),
          ),
        )
        .min(field.minItems, `Gardez au moins ${field.minItems} élément.`)
        .max(field.maxItems, `${field.maxItems} éléments maximum.`) as z.ZodType<ListItem[]>;
  }
}

// ---------------------------------------------------------------------------
// Form representation — paragraphs are edited as one text box per language
// ---------------------------------------------------------------------------

export function splitParagraphs(text: string, split: ParagraphsField['split']): string[] {
  return text
    .split(split === 'blank' ? /\n\s*\n/ : /\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function joinParagraphs(items: string[], split: ParagraphsField['split']): string {
  return items.join(split === 'blank' ? '\n\n' : '\n');
}

// ---------------------------------------------------------------------------
// Merging over the defaults
// ---------------------------------------------------------------------------

/** The stored value if it still validates, else the code's default. */
export function resolveValue(field: ContentField, stored: unknown): ContentValue {
  if (stored === undefined) return defaultValue(field);
  const parsed = fieldSchema(field).safeParse(stored);
  if (parsed.success) return parsed.data;
  console.warn(`[content] "${fieldId(field)}" no longer validates; using the default.`);
  return defaultValue(field);
}

/**
 * The dictionary and site settings for one locale, with every saved field
 * applied. English falls back to French wherever it was left empty.
 */
export function applyContent(
  locale: Locale,
  stored: ReadonlyMap<string, unknown>,
): { t: Dictionary; site: SiteContent } {
  const t: Dictionary = { ...getDictionary(locale) };
  const content: SiteContent = {
    slogan: site.slogan,
    email: site.email,
    social: site.social,
    photos: { ...site.photos },
  };

  const pick = (value: LocalizedText) => (locale === 'en' && value.en ? value.en : value.fr);
  // Written through a loose view: which key takes which shape is guaranteed
  // by the field definitions and their schemas, not by the compiler.
  const dict = t as unknown as Record<string, unknown>;

  for (const field of ALL_FIELDS) {
    const raw = stored.get(fieldId(field));
    if (raw === undefined) continue;
    const value = resolveValue(field, raw);

    switch (field.type) {
      case 'text':
        if (field.shared) content[field.key] = value as string;
        else dict[field.key] = pick(value as LocalizedText);
        break;
      case 'paragraphs': {
        const { fr, en } = value as LocalizedParagraphs;
        dict[field.key] = locale === 'en' && en.length ? en : fr;
        break;
      }
      case 'photo':
        content.photos[field.key] = value as Photo | null;
        break;
      case 'list': {
        const items = (value as ListItem[]).map((item) =>
          Object.fromEntries(
            Object.entries(item).map(([key, v]) => [key, typeof v === 'string' ? v : pick(v)]),
          ),
        );
        if (field.key === 'social') content.social = items as SiteContent['social'];
        else dict[field.key] = items;
        break;
      }
    }
  }

  return { t, site: content };
}
