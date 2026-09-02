export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}

type Service = { name: string; desc: string; goal: string };

/** An empty `quote` renders the "coming soon" card — see Testimonials. */
type Testimonial = { quote: string; tag: string; author: string; role: string };

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
  homeAria: string;

  /* hero */
  heroTagline: string;
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
  servIntro: string;
  servGoalLabel: string;
  services: Service[];

  /* testimonials */
  quotesKicker: string;
  quotePlaceholder: string;
  testimonials: Testimonial[];

  /* about */
  aboutTitle: string;
  aboutVoizTitle: string;
  aboutVoizLead: string;
  aboutVoizBody: string[];
  aboutLiamTitle: string;
  aboutLiamRole: string;
  aboutLiamBody: string[];
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
  footerTagline: string;
  footerRights: string;
  footerNav: string;
  footerSocial: string;
  footerContact: string;
  footerTop: string;
};

const fr: Dictionary = {
  htmlLang: 'fr',
  metaTitle: 'VOIZ · Vortex of Noise — Création et post-production sonore',
  metaDescription:
    'VOIZ · Vortex of Noise — agence de création et de post-production sonore pour l’image et les expériences immersives. Sound direction, sound design, musique originale, mixage et mastering.',

  navProjects: 'Projets',
  navServices: 'Services',
  navAbout: 'À propos',
  navContact: 'Contact',
  langLabel: 'FR → EN',
  langSwitchAria: 'Switch to English',
  menuOpen: 'Ouvrir le menu',
  menuClose: 'Fermer le menu',
  skipToContent: 'Aller au contenu',
  homeAria: 'VOIZ · retour à l’accueil',

  heroTagline:
    'Agence de création et de post-production sonore pour l’image et les expériences immersives.',
  ctaContact: 'Nous contacter',
  ctaListen: 'Écouter',
  marquee: [
    'Sound direction',
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
  servIntro:
    'Nous accompagnons les créateurs et les marques à révéler l’âme sonore de leurs projets, pour capter leur audience.',
  servGoalLabel: 'Objectif',
  services: [
    {
      name: 'Sound Direction',
      desc: 'Définition de l’identité sonore du projet : intentions, références, choix esthétiques, rôle de la musique, du sound design, des voix et des ambiances.',
      goal: 'Construire une direction claire et puissante avant de produire.',
    },
    {
      name: 'Sound Creation',
      desc: 'Création de la matière sonore : sound design, musique originale, textures, ambiances, foley, voix et éléments sonores sur mesure.',
      goal: 'Donner au projet une vraie personnalité sonore.',
    },
    {
      name: 'Audio Post-Production',
      desc: 'Travail technique et créatif sur l’audio existant : montage son, nettoyage et édition, mixage 2.0 et 5.1, mastering, adaptations et livrables.',
      goal: 'Transformer les éléments bruts en bande-son propre, cohérente et prête à être diffusée.',
    },
    {
      name: 'Full Sound Production',
      desc: 'Prise en charge complète de la chaîne sonore : direction, création, montage, dialogues, sound design, musique, mixage et livraison finale.',
      goal: 'Un seul interlocuteur pour gérer tout le son du projet, du brief au master.',
    },
  ],

  quotesKicker: 'Ils nous ont fait confiance',
  quotePlaceholder: 'Témoignage à venir',
  testimonials: [
    {
      quote:
        'Professionnel, réactif et force de proposition, VOIZ a grandement contribué à la qualité du film que j’ai réalisé. Je les recommande vivement !',
      tag: 'Court-métrage',
      author: 'David Le Royer',
      role: 'Réalisateur',
    },
    {
      quote: 'Le travail de VOIZ allie émotion forte et subtilité technique.',
      tag: 'Composition',
      author: 'Paul Guédon',
      role: 'Compositeur',
    },
    // TODO(client): troisième témoignage — texte à fournir.
    { quote: '', tag: '', author: '', role: '' },
  ],

  aboutTitle: 'À propos',
  aboutVoizTitle: 'VOIZ',
  aboutVoizLead:
    'VOIZ est votre partenaire de création sonore, capable de prendre en charge l’ensemble de vos besoins, à la fois techniques et artistiques.',
  aboutVoizBody: [
    'Notre force repose sur un savoir-faire à 360°, porté par une esthétique hybride et contemporaine, ayant pris racine dans l’industrie musicale actuelle. Nous avons un studio complet à disposition, ainsi qu’un réseau de musiciens varié.',
    'Le savoir-faire passé en réalisation vidéo apporte également à VOIZ une compréhension concrète de l’image, du rythme et de la narration, avec une sensibilité particulière pour l’audiovisuel et le spectacle vivant.',
  ],
  aboutLiamTitle: 'Liam Grandsard',
  aboutLiamRole: 'Fondateur de VOIZ',
  aboutLiamBody: [
    'Diplômé en ingénierie du son, Liam Grandsard a évolué plusieurs années dans l’industrie musicale, en studio comme sur scène, produisant et mixant des artistes R&B, rap et pop-rock au sein d’un label parisien.',
    'Plus jeune, il réalisait clips et courts-métrages avec l’ambition de devenir réalisateur d’images. Finalement, il est devenu réalisateur sonore.',
    'Depuis 2023, il se consacre au son à l’image en tant que sound designer, mixeur et compositeur. Forgée par des années de composition, de mixage et de montage son, son approche se situe à la croisée de l’émotion brute artistique et de la précision technique.',
    'Du hip-hop au post-punk, en passant par l’orchestral et l’atmosphérique, cette esthétique contrastée et hybride constitue aujourd’hui le cœur de son univers sonore qu’il développe sous le nom de Sheï Turner.',
  ],
  portraitAlt: 'Portrait de Liam Grandsard, fondateur de VOIZ',

  contactTitle: 'Construisons votre projet sonore dès aujourd’hui',
  contactGhost: 'Contact · Contact · Contact',
  contactSub:
    'Parlez-nous de vos envies sonores, de votre image, de votre scène ou simplement de votre univers.',
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

  footerTagline: 'Agence de création et de post-production sonore',
  footerRights: '© 2026 VOIZ · Vortex of Noise',
  footerNav: 'Menu',
  footerSocial: 'Réseaux',
  footerContact: 'Contact',
  footerTop: 'Retour en haut',
};

const en: Dictionary = {
  htmlLang: 'en',
  metaTitle: 'VOIZ · Vortex of Noise — Sound creation & audio post-production',
  metaDescription:
    'VOIZ · Vortex of Noise — a sound creation and post-production agency for picture and immersive experiences. Sound direction, sound design, original music, mixing and mastering.',

  navProjects: 'Projects',
  navServices: 'Services',
  navAbout: 'About',
  navContact: 'Contact',
  langLabel: 'EN → FR',
  langSwitchAria: 'Passer en français',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  skipToContent: 'Skip to content',
  homeAria: 'VOIZ · back to home',

  heroTagline:
    'A sound creation and post-production agency for picture and immersive experiences.',
  ctaContact: 'Get in touch',
  ctaListen: 'Listen',
  marquee: [
    'Sound direction',
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
  servIntro:
    'We help creators and brands reveal the sonic soul of their projects, and capture their audience.',
  servGoalLabel: 'Goal',
  services: [
    {
      name: 'Sound Direction',
      desc: 'Defining the project’s sonic identity: intentions, references, aesthetic choices, the role of music, sound design, voices and atmospheres.',
      goal: 'Build a clear, powerful direction before anything is produced.',
    },
    {
      name: 'Sound Creation',
      desc: 'Creating the sonic material: sound design, original music, textures, atmospheres, foley, voices and bespoke sound elements.',
      goal: 'Give the project a sonic personality of its own.',
    },
    {
      name: 'Audio Post-Production',
      desc: 'Technical and creative work on existing audio: sound editing, cleanup, 2.0 and 5.1 mixing, mastering, adaptations and deliverables.',
      goal: 'Turn raw elements into a clean, coherent soundtrack ready to be released.',
    },
    {
      name: 'Full Sound Production',
      desc: 'Full ownership of the sound chain: direction, creation, editing, dialogue, sound design, music, mixing and final delivery.',
      goal: 'A single point of contact for all the sound on the project, from brief to master.',
    },
  ],

  quotesKicker: 'They trusted us',
  quotePlaceholder: 'Testimonial coming soon',
  testimonials: [
    {
      quote:
        'Professional, responsive and full of ideas, VOIZ greatly contributed to the quality of the film I directed. I highly recommend them!',
      tag: 'Short film',
      author: 'David Le Royer',
      role: 'Director',
    },
    {
      quote: 'VOIZ’s work combines strong emotion with technical subtlety.',
      tag: 'Composition',
      author: 'Paul Guédon',
      role: 'Composer',
    },
    // TODO(client): third testimonial — copy to be supplied.
    { quote: '', tag: '', author: '', role: '' },
  ],

  aboutTitle: 'About',
  aboutVoizTitle: 'VOIZ',
  aboutVoizLead:
    'VOIZ is your sound creation partner, able to take on every one of your needs — technical and artistic alike.',
  aboutVoizBody: [
    'Our strength rests on a 360° skill set, carried by a hybrid, contemporary aesthetic rooted in today’s music industry. We have a fully equipped studio at our disposal, along with a wide network of musicians.',
    'A background in video directing also gives VOIZ a concrete understanding of image, rhythm and narrative, with a particular sensitivity to audiovisual work and live performance.',
  ],
  aboutLiamTitle: 'Liam Grandsard',
  aboutLiamRole: 'Founder of VOIZ',
  aboutLiamBody: [
    'A sound engineering graduate, Liam Grandsard spent several years in the music industry, in the studio and on stage, producing and mixing R&B, rap and pop-rock artists for a Parisian label.',
    'Growing up he made music videos and short films, aiming to become a film director. He ended up a sound director instead.',
    'Since 2023 he has devoted himself to sound for picture as a sound designer, mixer and composer. Forged by years of composing, mixing and sound editing, his approach sits at the crossroads of raw artistic emotion and technical precision.',
    'From hip-hop to post-punk by way of the orchestral and the atmospheric, this contrasted, hybrid aesthetic is today the core of the sonic world he develops under the name Sheï Turner.',
  ],
  portraitAlt: 'Portrait of Liam Grandsard, founder of VOIZ',

  contactTitle: 'Let’s build your sound project today',
  contactGhost: 'Contact · Contact · Contact',
  contactSub:
    'Tell us about your sonic ambitions, your picture, your stage — or simply your universe.',
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

  footerTagline: 'Sound creation and post-production agency',
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
