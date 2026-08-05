import type { Locale } from './i18n';

export type FilterId = 'tous' | 'cinema' | 'publicite' | 'spectacle' | 'jeux-video' | 'musique';

type Localized = Record<Locale, string>;

type Span = {
  /** Desktop mosaic: 6-column grid, 128px rows. */
  cs: number;
  rs: number;
  /** Mobile: 2-column grid, 104px rows. */
  csSm: number;
  rsSm: number;
};

type Common = {
  id: string;
  num: string;
  /** Drives the filter pills. */
  category: Exclude<FilterId, 'tous'>;
  /** Display label on the tile — not always the same as the filter category. */
  kicker: Localized;
  title: Localized;
  span: Span;
};

export type VideoProject = Common & {
  kind: 'video';
  /** TODO(client): key frame. Undefined renders the branded placeholder. */
  image?: string;
  placeholder: Localized;
  /** Optional link to the full case study / showreel. */
  href?: string;
};

export type AudioProject = Common & {
  kind: 'audio';
  subtitle: Localized;
  duration: string;
  /** TODO(client): file in /public/audio. Undefined disables the transport. */
  audioSrc?: string;
  /** Tile 07 is the inverted, orange-on-noir variant. */
  variant?: 'orange';
  /** Tilt in degrees, straightened on hover. */
  tilt: number;
};

export type Project = VideoProject | AudioProject;

export const projects: Project[] = [
  {
    id: 'court-metrage',
    num: '01',
    kind: 'video',
    category: 'cinema',
    kicker: { fr: 'Cinéma', en: 'Film' },
    title: {
      fr: 'Court-métrage · conception sonore & mixage intégral',
      en: 'Short film · full sound design & mix',
    },
    placeholder: { fr: 'Court-métrage · image clé', en: 'Short film · key frame' },
    span: { cs: 4, rs: 2, csSm: 2, rsSm: 3 },
  },
  {
    id: 'inner-garden',
    num: '02',
    kind: 'audio',
    category: 'musique',
    kicker: { fr: 'Audio', en: 'Audio' },
    title: { fr: 'EP « Inner Garden »', en: 'EP “Inner Garden”' },
    subtitle: { fr: 'Musique · mix & mastering', en: 'Music · mix & mastering' },
    duration: '3:42',
    tilt: 1,
    span: { cs: 2, rs: 2, csSm: 2, rsSm: 2 },
  },
  {
    id: 'spectacle-vivant',
    num: '03',
    kind: 'video',
    category: 'spectacle',
    kicker: { fr: 'Spectacle vivant', en: 'Live performance' },
    title: { fr: 'Création sonore', en: 'Sound creation' },
    placeholder: {
      fr: 'Spectacle · image clé (portrait)',
      en: 'Live show · key frame (portrait)',
    },
    span: { cs: 2, rs: 4, csSm: 2, rsSm: 4 },
  },
  {
    id: 'publicite',
    num: '04',
    kind: 'video',
    category: 'publicite',
    kicker: { fr: 'Publicité', en: 'Advertising' },
    title: {
      fr: 'DA sonore & textures immersives',
      en: 'Sonic art direction & immersive textures',
    },
    placeholder: { fr: 'Publicité · image clé', en: 'Advertising · key frame' },
    span: { cs: 2, rs: 2, csSm: 2, rsSm: 2 },
  },
  {
    id: 'experience-immersive',
    num: '05',
    kind: 'audio',
    category: 'musique',
    kicker: { fr: 'Audio', en: 'Audio' },
    title: { fr: 'Expérience immersive', en: 'Immersive experience' },
    subtitle: {
      fr: 'Création personnelle · sound design & musique',
      en: 'Personal work · sound design & music',
    },
    duration: '2:18',
    tilt: -1,
    span: { cs: 2, rs: 2, csSm: 2, rsSm: 2 },
  },
  {
    id: 'trailer-jeu-video',
    num: '06',
    kind: 'video',
    category: 'jeux-video',
    kicker: { fr: 'Jeux vidéo', en: 'Video games' },
    title: { fr: 'Trailer · sound design & mix', en: 'Trailer · sound design & mix' },
    placeholder: { fr: 'Jeu vidéo · image clé', en: 'Video game · key frame' },
    span: { cs: 2, rs: 2, csSm: 2, rsSm: 2 },
  },
  {
    id: 'single-rap',
    num: '07',
    kind: 'audio',
    category: 'musique',
    kicker: { fr: 'Audio', en: 'Audio' },
    title: { fr: 'Single · artiste rap', en: 'Single · rap artist' },
    subtitle: {
      fr: 'Musique · prod, mix & mastering',
      en: 'Music · production, mix & mastering',
    },
    duration: '2:56',
    tilt: 1,
    variant: 'orange',
    span: { cs: 2, rs: 2, csSm: 2, rsSm: 2 },
  },
  {
    id: 'motion-design',
    num: '08',
    kind: 'video',
    category: 'publicite',
    kicker: { fr: 'Motion design', en: 'Motion design' },
    title: { fr: 'Identité sonore & habillage', en: 'Sonic identity & branding' },
    placeholder: { fr: 'Motion design · image clé', en: 'Motion design · key frame' },
    span: { cs: 6, rs: 2, csSm: 2, rsSm: 3 },
  },
];
