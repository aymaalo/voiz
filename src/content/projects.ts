import type { Locale } from './i18n';

export type FilterId = 'tous' | 'cinema' | 'publicite' | 'spectacle' | 'jeux-video' | 'musique';

type Localized = Record<Locale, string>;

type Common = {
  id: string;
  /** Drives the filter pills. */
  category: Exclude<FilterId, 'tous'>;
  /** Display label on the tile — not always the same as the filter category. */
  kicker: Localized;
  title: Localized;
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
};

export type Project = VideoProject | AudioProject;

export const projects: Project[] = [
  {
    id: 'court-metrage',
    kind: 'video',
    category: 'cinema',
    kicker: { fr: 'Cinéma', en: 'Film' },
    title: {
      fr: 'Court-métrage · conception sonore & mixage intégral',
      en: 'Short film · full sound design & mix',
    },
    placeholder: { fr: 'Court-métrage · image clé', en: 'Short film · key frame' },
  },
  {
    id: 'inner-garden',
    kind: 'audio',
    category: 'musique',
    kicker: { fr: 'Audio', en: 'Audio' },
    title: { fr: 'EP « Inner Garden »', en: 'EP “Inner Garden”' },
    subtitle: { fr: 'Musique · mix & mastering', en: 'Music · mix & mastering' },
    duration: '3:42',
  },
  {
    id: 'spectacle-vivant',
    kind: 'video',
    category: 'spectacle',
    kicker: { fr: 'Spectacle vivant', en: 'Live performance' },
    title: { fr: 'Création sonore', en: 'Sound creation' },
    placeholder: {
      fr: 'Spectacle vivant · image clé',
      en: 'Live performance · key frame',
    },
  },
  {
    id: 'publicite',
    kind: 'video',
    category: 'publicite',
    kicker: { fr: 'Publicité', en: 'Advertising' },
    title: {
      fr: 'DA sonore & textures immersives',
      en: 'Sonic art direction & immersive textures',
    },
    placeholder: { fr: 'Publicité · image clé', en: 'Advertising · key frame' },
  },
  {
    id: 'experience-immersive',
    kind: 'audio',
    category: 'musique',
    kicker: { fr: 'Audio', en: 'Audio' },
    title: { fr: 'Expérience immersive', en: 'Immersive experience' },
    subtitle: {
      fr: 'Création personnelle · sound design & musique',
      en: 'Personal work · sound design & music',
    },
    duration: '2:18',
  },
  {
    id: 'trailer-jeu-video',
    kind: 'video',
    category: 'jeux-video',
    kicker: { fr: 'Jeux vidéo', en: 'Video games' },
    title: { fr: 'Trailer · sound design & mix', en: 'Trailer · sound design & mix' },
    placeholder: { fr: 'Jeu vidéo · image clé', en: 'Video game · key frame' },
  },
  {
    id: 'single-rap',
    kind: 'audio',
    category: 'musique',
    kicker: { fr: 'Audio', en: 'Audio' },
    title: { fr: 'Single · artiste rap', en: 'Single · rap artist' },
    subtitle: {
      fr: 'Musique · prod, mix & mastering',
      en: 'Music · production, mix & mastering',
    },
    duration: '2:56',
  },
  {
    id: 'motion-design',
    kind: 'video',
    category: 'publicite',
    kicker: { fr: 'Motion design', en: 'Motion design' },
    title: { fr: 'Identité sonore & habillage', en: 'Sonic identity & branding' },
    placeholder: { fr: 'Motion design · image clé', en: 'Motion design · key frame' },
  },
];
