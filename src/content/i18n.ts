export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}

type Service = { num: string; name: string; desc: string };

export type Dictionary = {
  /* meta */
  htmlLang: string;
  metaTitle: string;
  metaDescription: string;

  /* nav */
  navProjects: string;
  navServices: string;
  navAbout: string;
  navContact: string;
  langLabel: string;
  langSwitchAria: string;
  menuOpen: string;
  menuClose: string;
  skipToContent: string;

  /* hero */
  mantra: string;
  ctaContact: string;
  ctaListen: string;
  marquee: string[];

  /* studio */
  pitchKicker: string;
  pitchA: string;
  pitchB: string;
  pitchC: string;
  studioPhotoAlt: string;

  /* projects */
  projTitle: string;
  projAll: string;
  projCount: string;
  filters: { id: string; label: string }[];
  projEmpty: string;
  play: string;
  pause: string;
  audioComingSoon: string;
  filterAria: string;
  projectsPageTitle: string;
  projectsPageIntro: string;
  backHome: string;

  /* services */
  servTitle: string;
  servCount: string;
  services: Service[];
  positioning: string;

  /* testimonials */
  quotesKicker: string;
  quote1: string;
  quote1Tag: string;
  quote1Author: string;
  quote1Role: string;
  quote2: string;
  quote2Tag: string;
  quote2Author: string;
  quote2Role: string;

  /* about */
  aboutKicker: string;
  about: string;
  aboutLiam: string;
  aboutLiamQuote: string;
  portraitAlt: string;

  /* contact */
  contactTitle: string;
  contactGhost: string;
  contactSub: string;
  fName: string;
  fEmail: string;
  fProject: string;
  fProjectOptions: { value: string; label: string }[];
  fMessage: string;
  fSend: string;
  fSending: string;
  fSuccess: string;
  fError: string;
  fRequired: string;
  fInvalidEmail: string;

  /* footer */
  footerRights: string;
  footerNav: string;
  footerSocial: string;
  footerContact: string;
  footerTop: string;
};

const fr: Dictionary = {
  htmlLang: 'fr',
  metaTitle: 'VOIZ · Vortex of Noise — Sound design & post-production audio',
  metaDescription:
    'VOIZ · Vortex of Noise — studio de direction artistique sonore, sound design, musique originale, mixage et mastering. Le son comme matière vivante.',

  navProjects: 'Projets',
  navServices: 'Services',
  navAbout: 'About',
  navContact: 'Contact',
  langLabel: 'FR → EN',
  langSwitchAria: 'Switch to English',
  menuOpen: 'Ouvrir le menu',
  menuClose: 'Fermer le menu',
  skipToContent: 'Aller au contenu',

  mantra: 'Le son comme matière vivante.',
  ctaContact: 'Nous contacter',
  ctaListen: 'Écouter',
  marquee: [
    'Direction artistique',
    'Sound design',
    'Musique originale',
    'Post-production',
    'Mixage',
    'Mastering',
  ],

  pitchKicker: 'Le studio',
  pitchA: 'Comme un vortex en mouvement,',
  pitchB: 'chaque son prend vie,',
  pitchC:
    'porte une émotion et captive l’attention. Chaque détail est travaillé pour faire résonner votre histoire.',
  studioPhotoAlt: 'Le studio VOIZ',

  projTitle: 'Projets',
  projAll: 'Tous les projets',
  projCount: '(08)',
  filters: [
    { id: 'tous', label: 'Tous' },
    { id: 'cinema', label: 'Cinéma' },
    { id: 'publicite', label: 'Publicité' },
    { id: 'spectacle', label: 'Spectacle vivant' },
    { id: 'jeux-video', label: 'Jeux vidéo' },
    { id: 'musique', label: 'Musique' },
  ],
  projEmpty: 'Aucun projet dans cette catégorie pour le moment.',
  play: 'Lecture',
  pause: 'Pause',
  audioComingSoon: 'Extrait bientôt disponible',
  filterAria: 'Filtrer les projets par catégorie',
  projectsPageTitle: 'Tous les projets',
  projectsPageIntro:
    'Cinéma, publicité, spectacle vivant, jeux vidéo, musique · une sélection de créations sonores signées VOIZ.',
  backHome: 'Retour à l’accueil',

  servTitle: 'Services',
  servCount: '(05)',
  services: [
    {
      num: '01',
      name: 'Direction artistique sonore & accompagnement',
      desc: 'Définition de l’univers sonore et de l’identité audio, propositions créatives en lien avec l’image, suivi artistique tout au long de la production.',
    },
    {
      num: '02',
      name: 'Sound design & conception sonore',
      desc: 'Effets, textures, ambiances et éléments narratifs sur mesure. Sampling, transformation, saturation : une approche émotionnelle, immersive et cinématique.',
    },
    {
      num: '03',
      name: 'Musique originale & composition',
      desc: 'Composition adaptée au rythme et à l’intention du projet · de l’urbain au rock, de l’acoustique à l’orchestral.',
    },
    {
      num: '04',
      name: 'Studio & post-production audio',
      desc: 'Enregistrement voix et instruments, montage, mixage stéréo et immersif, mastering et livrables.',
    },
    {
      num: '05',
      name: 'Musique · artistes',
      desc: 'DA sonore pour artistes, enregistrement, mixage, mastering, composition et arrangements.',
    },
  ],
  positioning:
    'Nous accompagnons les créateurs d’images et de mouvements, à donner une âme sonore à leurs projets.',

  quotesKicker: 'Ils nous font confiance',
  quote1:
    'Professionnel, réactif et force de proposition, VOIZ a grandement contribué à la qualité du film que j’ai réalisé. Je les recommande vivement !',
  quote1Tag: 'Court-métrage',
  quote1Author: 'David Le Royer',
  quote1Role: 'Réalisateur',
  quote2: 'Le travail de VOIZ allie émotion forte et subtilité technique.',
  quote2Tag: 'Composition',
  quote2Author: 'Paul Guédon',
  quote2Role: 'Compositeur',

  aboutKicker: 'À propos',
  about:
    'Une esthétique sonore moderne, organique, parfois abrasive, souvent cinématique. Des sons qui respirent, vibrent, se déforment et racontent.',
  aboutLiam:
    'Diplômé en ingénierie du son, Liam Grandsard a évolué plusieurs années dans l’industrie musicale, en studio comme sur scène, en produisant et mixant des artistes rap, R&B et pop-rock. Depuis 2023, il se consacre au son à l’image. Enfant, il réalisait déjà des courts-métrages avec le rêve de devenir réalisateur · il est finalement devenu réalisateur sonore. Du cloud rap au post-punk, de l’électronique au sound design, une approche instinctive, immersive, toujours au service de l’émotion.',
  aboutLiamQuote:
    'Faire ressentir, surprendre, émouvoir. Brut, émotif, hybride et vivant : voilà mon univers sonore.',
  portraitAlt: 'Portrait de Liam Grandsard, fondateur de VOIZ',

  contactTitle: 'Construisons votre projet sonore dès aujourd’hui',
  contactGhost: 'Contact · Contact · Contact',
  contactSub:
    'Restons pro et clair : parlez-nous de votre image, de votre scène, de votre univers.',
  fName: 'Nom',
  fEmail: 'Email',
  fProject: 'Type de projet (pub, ciné, spectacle…)',
  fProjectOptions: [
    { value: 'publicite', label: 'Publicité' },
    { value: 'cinema', label: 'Cinéma · court-métrage' },
    { value: 'spectacle', label: 'Spectacle vivant' },
    { value: 'jeux-video', label: 'Jeux vidéo' },
    { value: 'musique', label: 'Musique · artiste' },
    { value: 'motion', label: 'Motion design · habillage' },
    { value: 'autre', label: 'Autre' },
  ],
  fMessage: 'Message',
  fSend: 'Envoyer',
  fSending: 'Envoi…',
  fSuccess: 'Message envoyé. Nous vous répondons très vite.',
  fError: 'L’envoi a échoué. Réessayez ou écrivez-nous directement.',
  fRequired: 'Ce champ est requis.',
  fInvalidEmail: 'Adresse email invalide.',

  footerRights: '© 2026 VOIZ · Vortex of Noise',
  footerNav: 'Menu',
  footerSocial: 'Réseaux',
  footerContact: 'Contact',
  footerTop: 'Retour en haut',
};

const en: Dictionary = {
  htmlLang: 'en',
  metaTitle: 'VOIZ · Vortex of Noise — Sound design & audio post-production',
  metaDescription:
    'VOIZ · Vortex of Noise — sonic art direction, sound design, original music, mixing and mastering studio. Sound as living matter.',

  navProjects: 'Projects',
  navServices: 'Services',
  navAbout: 'About',
  navContact: 'Contact',
  langLabel: 'EN → FR',
  langSwitchAria: 'Passer en français',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  skipToContent: 'Skip to content',

  mantra: 'Sound as living matter.',
  ctaContact: 'Get in touch',
  ctaListen: 'Listen',
  marquee: [
    'Art direction',
    'Sound design',
    'Original music',
    'Post-production',
    'Mixing',
    'Mastering',
  ],

  pitchKicker: 'The studio',
  pitchA: 'Like a vortex in motion,',
  pitchB: 'every sound comes alive,',
  pitchC:
    'carries an emotion and captures attention. Every detail is crafted to make your story resonate.',
  studioPhotoAlt: 'The VOIZ studio',

  projTitle: 'Projects',
  projAll: 'All projects',
  projCount: '(08)',
  filters: [
    { id: 'tous', label: 'All' },
    { id: 'cinema', label: 'Film' },
    { id: 'publicite', label: 'Advertising' },
    { id: 'spectacle', label: 'Live performance' },
    { id: 'jeux-video', label: 'Video games' },
    { id: 'musique', label: 'Music' },
  ],
  projEmpty: 'No projects in this category yet.',
  play: 'Play',
  pause: 'Pause',
  audioComingSoon: 'Excerpt coming soon',
  filterAria: 'Filter projects by category',
  projectsPageTitle: 'All projects',
  projectsPageIntro:
    'Film, advertising, live performance, video games, music · a selection of sonic work by VOIZ.',
  backHome: 'Back home',

  servTitle: 'Services',
  servCount: '(05)',
  services: [
    {
      num: '01',
      name: 'Sonic art direction & guidance',
      desc: 'Defining the sonic universe and audio identity, creative proposals tied to the image, artistic supervision throughout production.',
    },
    {
      num: '02',
      name: 'Sound design & sonic conception',
      desc: 'Bespoke effects, textures, atmospheres and narrative elements. Sampling, transformation, saturation: an emotional, immersive, cinematic approach.',
    },
    {
      num: '03',
      name: 'Original music & composition',
      desc: 'Composition tuned to the project’s rhythm and intent · from urban to rock, acoustic to orchestral.',
    },
    {
      num: '04',
      name: 'Studio & audio post-production',
      desc: 'Voice and instrument recording, editing, stereo and immersive mixing, mastering and deliverables.',
    },
    {
      num: '05',
      name: 'Music · artists',
      desc: 'Sonic art direction for artists, recording, mixing, mastering, composition and arrangements.',
    },
  ],
  positioning: 'We help creators of images and motion give their projects a sonic soul.',

  quotesKicker: 'They trust us',
  quote1:
    'Professional, responsive and full of ideas, VOIZ greatly contributed to the quality of the film I directed. I highly recommend them!',
  quote1Tag: 'Short film',
  quote1Author: 'David Le Royer',
  quote1Role: 'Director',
  quote2: 'VOIZ’s work combines strong emotion with technical subtlety.',
  quote2Tag: 'Composition',
  quote2Author: 'Paul Guédon',
  quote2Role: 'Composer',

  aboutKicker: 'About',
  about:
    'A modern, organic sonic aesthetic · sometimes abrasive, often cinematic. Sounds that breathe, vibrate, distort and tell stories.',
  aboutLiam:
    'A sound engineering graduate, Liam Grandsard spent years in the music industry, in the studio and on stage, producing and mixing rap, R&B and pop-rock artists. Since 2023 he has devoted himself to sound for picture. As a child he was already making short films, dreaming of becoming a director · he ended up a sound director. From cloud rap to post-punk, electronics to sound design: an instinctive, immersive approach, always in service of emotion.',
  aboutLiamQuote:
    'Make people feel, surprise, move. Raw, emotive, hybrid and alive: that is my sonic universe.',
  portraitAlt: 'Portrait of Liam Grandsard, founder of VOIZ',

  contactTitle: 'Let’s build your sound project today',
  contactGhost: 'Contact · Contact · Contact',
  contactSub: 'Clear and professional: tell us about your film, your stage, your universe.',
  fName: 'Name',
  fEmail: 'Email',
  fProject: 'Project type (ad, film, live…)',
  fProjectOptions: [
    { value: 'publicite', label: 'Advertising' },
    { value: 'cinema', label: 'Film · short film' },
    { value: 'spectacle', label: 'Live performance' },
    { value: 'jeux-video', label: 'Video games' },
    { value: 'musique', label: 'Music · artist' },
    { value: 'motion', label: 'Motion design · branding' },
    { value: 'autre', label: 'Other' },
  ],
  fMessage: 'Message',
  fSend: 'Send',
  fSending: 'Sending…',
  fSuccess: 'Message sent. We will get back to you shortly.',
  fError: 'Sending failed. Try again or email us directly.',
  fRequired: 'This field is required.',
  fInvalidEmail: 'Invalid email address.',

  footerRights: '© 2026 VOIZ · Vortex of Noise',
  footerNav: 'Menu',
  footerSocial: 'Social',
  footerContact: 'Contact',
  footerTop: 'Back to top',
};

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
