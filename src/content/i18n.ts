export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}

/** `lead` is always visible; `detail` and `goal` open on hover / tap — see Services. */
type Service = { name: string; lead: string; detail: string; goal: string };

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

  /* studio — pitchB is the orange serif accent between A and C */
  pitchA: string;
  pitchB: string;
  pitchC: string;
  pitchBody: string[];
  studioPhotoAlt: string;

  /* projects */
  projTitle: string;
  projMore: string;
  moreInfo: string;
  filterAll: string;
  projEmpty: string;
  projNone: string;
  play: string;
  close: string;
  kindVideo: string;
  kindAudio: string;
  filterAria: string;
  projectsPageTitle: string;
  projectsPageIntro: string;
  backHome: string;

  /* services */
  servTitle: string;
  servIntro: string;
  services: Service[];

  /* testimonials */
  quotesKicker: string;
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
    'VOIZ · Vortex of Noise — studio de création sonore et de post-production pour l’image et la scène, basé à Nantes. Sound direction, sound design, musique originale, mixage et mastering.',

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

  heroTagline: 'Création sonore & post-production pour l’image et la scène.',
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

  pitchA: 'Comme un vortex en mouvement,',
  pitchB: 'chaque son converge',
  pitchC: 'pour donner force, rythme et identité à l’image.',
  pitchBody: [
    'VOIZ réunit culture de l’image, musique et ingénierie sonore pour penser le son dans son ensemble, dédié aux histoires et images intenses.',
    'De la direction sonore au master final, création et technique ne font qu’un.',
  ],
  studioPhotoAlt: 'Le studio VOIZ',

  projTitle: 'Projets',
  projMore: 'Plus de projets',
  moreInfo: 'En savoir plus',
  filterAll: 'Tous',
  projEmpty: 'Aucun projet dans cette catégorie pour le moment.',
  projNone: 'Nos projets arrivent très bientôt.',
  play: 'Lecture',
  close: 'Fermer',
  kindVideo: 'Vidéo',
  kindAudio: 'Audio',
  filterAria: 'Filtrer les projets par catégorie',
  projectsPageTitle: 'Projets',
  projectsPageIntro: 'Retrouvez une sélection plus vaste de nos réalisations.',
  backHome: 'Retour à l’accueil',

  servTitle: 'Services',
  servIntro:
    'Nous accompagnons les créateurs et les marques à révéler l’âme sonore de leurs projets, pour capter leur audience.',
  services: [
    {
      name: 'Sound Direction',
      lead: 'Définir l’identité sonore du projet.',
      detail:
        'Intentions, références, parti pris esthétique, place de la musique, du sound design, des voix et des ambiances.',
      goal: 'Donner une direction claire avant de produire.',
    },
    {
      name: 'Sound Creation',
      lead: 'Créer la matière sonore.',
      detail:
        'Sound design, musique originale, Foley, textures, ambiances, voix et éléments sur mesure.',
      goal: 'Donner au projet une identité sonore forte et reconnaissable.',
    },
    {
      name: 'Audio Post-Production',
      lead: 'Construire et finaliser la bande-son.',
      detail:
        'Montage son et dialogues, nettoyage, édition, mixage stéréo / 5.1, mastering et livrables.',
      goal: 'Une bande-son propre, cohérente et prête à diffuser.',
    },
    {
      name: 'Full Sound Production',
      lead: 'Confier toute la chaîne sonore à VOIZ.',
      detail: 'Direction, création, musique, montage, sound design, mixage et livraison.',
      goal: 'Un seul partenaire, du brief au master.',
    },
  ],

  quotesKicker: 'Ils nous ont fait confiance',
  testimonials: [
    {
      quote: 'VOIZ allie efficacité, réactivité et solide connaissance du son.',
      tag: 'Publicité',
      author: 'Jordan Vedrenne',
      role: 'Réalisateur',
    },
    {
      quote:
        'VOIZ est maintenant notre partenaire sonore idéal pour nos spectacles : sensibilité artistique, maîtrise musicale et technique vont de pair !',
      tag: 'Spectacle vivant',
      author: 'Kathryn Mederos Syssoyeva',
      role: 'Metteuse en scène',
    },
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
  ],

  aboutTitle: 'À propos',
  aboutVoizTitle: 'VOIZ',
  aboutVoizLead:
    'VOIZ est un studio de création sonore et de post-production dédié à la publicité, au cinéma et au spectacle vivant, basé à Nantes.',
  aboutVoizBody: [
    'Notre approche s’appuie sur une expérience antérieure en réalisation vidéo, ainsi que sur une solide culture de la musique et de la technique du son. Cette complémentarité nous permet de comprendre autant l’intention derrière l’image que sa fabrication sonore.',
    'VOIZ a un penchant pour les thèmes sombres, dramatiques, bruts et horrifiques : là où le son surprend, transforme et marque.',
  ],
  aboutLiamTitle: 'Liam Grandsard',
  aboutLiamRole: 'Fondateur',
  aboutLiamBody: [
    'Diplômé en ingénierie du son, Liam Grandsard évolue d’abord dans l’industrie musicale, en studio comme sur scène, produisant et mixant des artistes R&B, rap et pop-rock au sein d’un label parisien.',
    'Avant le son, il réalisait clips et courts-métrages avec l’ambition de devenir réalisateur. Cette culture de l’image l’accompagne lorsqu’il se tourne pleinement vers la post-production sonore en 2023.',
    'Aujourd’hui sound designer, mixeur et compositeur, il développe une approche à la croisée de l’émotion brute et de la précision technique, nourrie autant par la musique contemporaine que par le cinéma.',
    'Du hip-hop au post-punk, de l’orchestral aux textures atmosphériques et électro, cette culture hybride façonne aujourd’hui son identité sonore.',
  ],
  portraitAlt: 'Portrait de Liam Grandsard, fondateur de VOIZ',

  contactTitle: 'Parlons de votre projet.',
  contactGhost: 'Contact · Contact · Contact',
  contactSub:
    'Parlez-nous de votre image, de votre scène ou de votre univers. Nous construirons ensemble l’approche sonore adaptée.',
  fName: 'Nom',
  fEmail: 'Email',
  fProject: 'Type de projet',
  fProjectOptions: [
    { value: 'publicite', label: 'Publicité' },
    { value: 'cinema', label: 'Cinéma' },
    { value: 'spectacle', label: 'Spectacle vivant' },
    { value: 'animation', label: '3D / Animation' },
    { value: 'jeux-video', label: 'Jeux vidéo' },
    { value: 'musique', label: 'Musique' },
    { value: 'corporate', label: 'Corporate' },
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
    'VOIZ · Vortex of Noise — a sound creation and post-production studio for screen and stage, based in Nantes. Sound direction, sound design, original music, mixing and mastering.',

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

  heroTagline: 'Sound creation & post-production for screen and stage.',
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

  pitchA: 'Like a vortex in motion,',
  pitchB: 'every sound converges',
  pitchC: 'to give the picture power, rhythm and identity.',
  pitchBody: [
    'VOIZ brings together visual culture, music and sound engineering to think about sound as a whole, in service of intense stories and images.',
    'From sound direction to the final master, creation and technique are one.',
  ],
  studioPhotoAlt: 'The VOIZ studio',

  projTitle: 'Projects',
  projMore: 'More projects',
  moreInfo: 'Learn more',
  filterAll: 'All',
  projEmpty: 'No projects in this category yet.',
  projNone: 'Our projects are coming very soon.',
  play: 'Play',
  close: 'Close',
  kindVideo: 'Video',
  kindAudio: 'Audio',
  filterAria: 'Filter projects by category',
  projectsPageTitle: 'Projects',
  projectsPageIntro: 'Explore a wider selection of our work.',
  backHome: 'Back home',

  servTitle: 'Services',
  servIntro:
    'We help creators and brands reveal the sonic soul of their projects, and capture their audience.',
  services: [
    {
      name: 'Sound Direction',
      lead: 'Define the project’s sonic identity.',
      detail:
        'Intentions, references, aesthetic stance, and the place of music, sound design, voices and atmospheres.',
      goal: 'Set a clear direction before production.',
    },
    {
      name: 'Sound Creation',
      lead: 'Create the sonic material.',
      detail:
        'Sound design, original music, Foley, textures, atmospheres, voices and bespoke elements.',
      goal: 'Give the project a strong, recognisable sonic identity.',
    },
    {
      name: 'Audio Post-Production',
      lead: 'Build and finalise the soundtrack.',
      detail:
        'Sound and dialogue editing, cleanup, editing, stereo / 5.1 mixing, mastering and deliverables.',
      goal: 'A clean, coherent soundtrack, ready to broadcast.',
    },
    {
      name: 'Full Sound Production',
      lead: 'Entrust the entire sound chain to VOIZ.',
      detail: 'Direction, creation, music, editing, sound design, mixing and delivery.',
      goal: 'One partner, from brief to master.',
    },
  ],

  quotesKicker: 'They trusted us',
  testimonials: [
    {
      quote: 'VOIZ combines efficiency, responsiveness and a solid knowledge of sound.',
      tag: 'Advertising',
      author: 'Jordan Vedrenne',
      role: 'Director',
    },
    {
      quote:
        'VOIZ is now our ideal sound partner for our shows: artistic sensitivity, musical mastery and technical skill go hand in hand!',
      tag: 'Live performance',
      author: 'Kathryn Mederos Syssoyeva',
      role: 'Stage director',
    },
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
  ],

  aboutTitle: 'About',
  aboutVoizTitle: 'VOIZ',
  aboutVoizLead:
    'VOIZ is a sound creation and post-production studio dedicated to advertising, film and live performance, based in Nantes.',
  aboutVoizBody: [
    'Our approach draws on a background in video directing and a solid grounding in music and sound engineering. That combination lets us understand the intention behind a picture as much as how its sound is made.',
    'VOIZ has a taste for dark, dramatic, raw and horrific themes: where sound surprises, transforms and leaves its mark.',
  ],
  aboutLiamTitle: 'Liam Grandsard',
  aboutLiamRole: 'Founder',
  aboutLiamBody: [
    'A sound engineering graduate, Liam Grandsard started out in the music industry, in the studio and on stage, producing and mixing R&B, rap and pop-rock artists for a Parisian label.',
    'Before sound, he directed music videos and short films, aiming to become a filmmaker. That visual culture stayed with him when he turned fully to sound post-production in 2023.',
    'Now a sound designer, mixer and composer, he has developed an approach at the crossroads of raw emotion and technical precision, fed as much by contemporary music as by cinema.',
    'From hip-hop to post-punk, from orchestral writing to atmospheric and electronic textures, this hybrid culture shapes his sonic identity today.',
  ],
  portraitAlt: 'Portrait of Liam Grandsard, founder of VOIZ',

  contactTitle: 'Let’s talk about your project.',
  contactGhost: 'Contact · Contact · Contact',
  contactSub:
    'Tell us about your picture, your stage or your world. Together, we’ll shape the right sound approach.',
  fName: 'Name',
  fEmail: 'Email',
  fProject: 'Project type',
  fProjectOptions: [
    { value: 'publicite', label: 'Advertising' },
    { value: 'cinema', label: 'Film' },
    { value: 'spectacle', label: 'Live performance' },
    { value: 'animation', label: '3D / Animation' },
    { value: 'jeux-video', label: 'Video games' },
    { value: 'musique', label: 'Music' },
    { value: 'corporate', label: 'Corporate' },
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
