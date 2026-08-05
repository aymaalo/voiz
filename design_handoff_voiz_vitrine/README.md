# Handoff: VOIZ · Vortex of Noise — Site vitrine one-page

## Overview
One-page marketing site (vitrine) for VOIZ, a French sound design & audio post-production agency. Dark, immersive, sound-driven aesthetic. Sections: Hero (video) → ticker → Le studio → Projets (mosaic grid) → ticker → Services → Avis clients → À propos → Contact → Footer. Bilingual FR/EN via a nav toggle. A separate Projects page is planned but not yet designed (the home grid links to it).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, NOT production code to copy directly. Recreate these designs in the target codebase's environment (React, Vue, Astro, etc.) using its established patterns. If no environment exists yet, a lightweight static or React setup is appropriate for this site.

`VOIZ Site v2.dc.html` uses a proprietary component runtime (`support.js`, `image-slot.js`); ignore those mechanics. Read the file for markup structure, exact inline styles, and the `class Component` logic block at the bottom for all FR/EN copy strings and interaction logic.

## Fidelity
**High-fidelity.** Colors, typography, spacing and copy are final (from the client's brand guide and content document). Recreate pixel-perfectly. `<image-slot>` elements are image placeholders — real project photos/videos to be supplied by the client.

## Design Tokens
Colors (brand guide, exact):
- Noir (bg): `#06070b`
- Orange (accent): `#FF5300`
- Ivoire (text): `#e6e7e2`
- Anthracite (borders, muted): `#3F3F3F`
- Muted text: `#a3a4a0`; card bg: `#0b0c11`

Typography:
- **Inter** (Google Fonts, 400–900): all body text, nav, buttons, headings
- **Instrument Serif** italic (Google Fonts): taglines, decorative numerals, positioning quotes
- **CC Regeneration Bold**: logo only (already in the SVG asset — never set text in it)

Other: border-radius 6px (cards/tiles), 999px (pills/buttons); section padding ~110–130px vertical, 40px horizontal; max content width 1280px (1100px for quotes).

## Global Effects
- Film grain: fixed full-viewport SVG turbulence noise, opacity .05, pointer-events none, above everything (z-index 60)
- Living background: two fixed radial orange glows (`rgba(255,83,0,.09)` and `.07`, ~55–60vw circles) drifting slowly — keyframed translate/scale loops of 18s and 24s, ease-in-out infinite
- Smooth scrolling, anchor links; `::selection` orange
- Links default ivoire, hover orange

## Screens / Sections (single page)

### Nav (fixed)
Fixed top, `mix-blend-mode: difference`, no background/border. Left: white logo SVG (h 36px, forced white via `filter:brightness(0) invert(.98)`). Right: uppercase 12px/600 links (Projets, Services, About, Contact — Contact has 2px orange bottom border) + FR→EN pill toggle (1px ivoire-40% border, radius 999px). Toggle swaps the whole page copy between the `fr` and `en` string objects.

### Hero (100vh, min 700px)
- Background video `assets/anim_voiz.mp4` (brand vortex animation), object-fit cover, opacity .9, autoplay/muted/loop. IMPORTANT: set `video.muted = true` programmatically before `play()` — attribute alone fails autoplay in some runtimes.
- Overlay gradient: orange mystic glow `radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,83,0,.14), transparent 60%)` + dark vignette + fade to `#06070b` at bottom 55–100%.
- Bottom row (left/right, 110px above marquee): left = H1 "VORTEX OF NOISE." (Inter 900, clamp(34px,4vw,58px), "OF" outline via text-stroke ivoire, "NOISE" orange) + mantra « Le son comme matière vivante. » (Instrument Serif italic ~17–21px, ivoire 80%). Right = 2 pill CTAs: "Nous contacter" (orange bg, dark text → ivoire on hover) and "Écouter" (outlined, with a 4-bar animated equalizer icon, orange bars, staggered scaleY loop).
- Bottom edge: orange marquee ticker (bg `#FF5300`, dark text, 15px/700 uppercase, letter-spacing .22em): "DIRECTION ARTISTIQUE ◎ SOUND DESIGN ◎ MUSIQUE ORIGINALE ◎ POST-PRODUCTION ◎ MIXAGE ◎ MASTERING" scrolling left, 28s linear infinite (duplicate content, translateX 0→-50%). A second identical ticker with ivoire bg sits between Projets and Services.

### Le studio
Vertical rotated kicker "LE STUDIO · 01" (orange, 12px, letter-spacing .4em) on the left margin. Grid: pitch text (clamp 30–46px, Inter 400) with the phrase "chaque son prend vie," in Instrument Serif italic orange, + 380px photo slot rotated 2deg with a spinning orange vortex badge (74px circle, ◎ glyph, 14s rotation) overlapping its top-left corner.

### Projets
- Header: "PROJETS" (Inter 900, clamp 52–110px, uppercase) + "(08)" in Instrument Serif italic orange.
- Filter pills: Tous (active: orange bg) / Cinéma / Publicité / Spectacle vivant / Jeux vidéo / Musique (outlined, hover orange).
- Mosaic grid: 6 columns, `grid-auto-rows:128px`, `grid-auto-flow:dense`, gap 20px. Tiles (col×row spans): 01 video 4×2, 02 audio 2×2, 03 video portrait 2×4, 04 video 2×2, 05 audio 2×2, 06 video 2×2, 07 audio 2×2 (orange bg variant), 08 video 6×2. No holes.
- Video tiles: image placeholder, outline numeral (Instrument italic 44px, text-stroke ivoire) top-left, bottom gradient plate with orange category kicker + bold title + orange circular play button (40–46px).
- Audio tiles: card bg `#0b0c11`, 1px `#3F3F3F` border, rotated ±1deg (straighten + orange border on hover); header row = outline numeral orange + "AUDIO" kicker; title + role; player row = outlined circular play (fills orange on hover) + dashed waveform strip (repeating-linear-gradient 2px bars, eased by an elliptical mask) + duration. Tile 07: orange bg, dark text/waveform.
- Titles (FR): 01 « Court-métrage · conception sonore & mixage intégral » / 02 « EP "Inner Garden" · mix & mastering » / 03 « Spectacle vivant · création sonore » / 04 « Publicité · DA sonore & textures immersives » / 05 « Expérience immersive · création personnelle » / 06 « Trailer · sound design & mix (Jeux vidéo) » / 07 « Single · artiste rap, prod mix & mastering » / 08 « Motion design · identité sonore & habillage ».
- Below: centered link "Tous les projets →" (Instrument italic 30px orange, underlined) → future Projects page.

### Services
Header "SERVICES" + "(05)". Five rows, grid `76px 1fr`, 1px `#3F3F3F` top borders, hover = whole row orange bg with dark text. Row = Instrument italic numeral (44px, opacity .9) + name (Inter 700, clamp 24–36px) + description (15px, 65%). Content = the five services with full descriptions (see logic block). Section closes with centered orange Instrument italic quote: « Nous accompagnons les créateurs d'images et de mouvements, à donner une âme sonore à leurs projets. »

### Avis clients
Kicker "ILS NOUS FONT CONFIANCE". Two cards side by side, tilted ±1.2deg (straighten on hover), right card offset 46px down. Card 1: dark (`#0b0c11`, border `#3F3F3F`, hover orange border) with orange "COURT-MÉTRAGE" tag stitched over the top edge; Card 2: ivoire bg, dark text, dark "COMPOSITION" tag. Inside: outline numeral 01/02 (orange stroke, Instrument italic 64px), quote in Inter 18px/1.65 (NOT serif — legibility), signature 12px uppercase with orange role. Quotes verbatim from client doc (David Le Royer · Réalisateur, Paul Guédon · Compositeur).

### À propos
Grid: 260px circular portrait slot with rotating orbital text ring (SVG textPath "FONDATEUR · VORTEX OF NOISE ·…", orange, 24s spin) + text column: kicker "À PROPOS · 04", VOIZ vision (clamp 22–30px), Liam Grandsard bio (16px muted, full parcours: ingénierie du son, rap/R&B/pop-rock, son à l'image depuis 2023, réalisateur sonore, cloud rap → post-punk), closing personal quote in Instrument italic orange 20px.

### Contact
Full-width orange section (`#FF5300`, dark text). Ghost outline text "CONTACT · CONTACT · CONTACT" (120px, text-stroke dark 22%) across the top. Left: H2 « Construisons votre projet sonore dès aujourd'hui » (Inter 900, clamp 44–80px, uppercase) + sub in Instrument italic 24px. Right: form — Nom + Email side by side, Type de projet, Message textarea, all ivoire `#e6e7e2` fields with dark text, dark 35% borders, radius 4px, dark placeholder (65%); submit = dark pill button "ENVOYER" (text hovers orange). Grid columns `1.1fr minmax(0,1fr)` (minmax prevents input min-width overflow).

### Footer
Giant centered logo (clamp 80–180px, white filter), then bottom row split by 1px `#3F3F3F` top border: social links (Instagram, LinkedIn, SoundCloud, TikTok) left, "© 2026 VOIZ · Vortex of Noise" right, 13px muted.

## Interactions & Behavior
- FR/EN toggle: single state variable `lang`; all copy lives in two parallel string objects (see logic block in the HTML — use them verbatim as i18n dictionaries)
- Anchor navigation with smooth scroll (#top, #projets, #services, #about, #contact)
- Hover states as described per section (rows turn orange, cards straighten, play buttons fill, links turn orange)
- Hero video: programmatic muted+play fallback
- Filter pills are visual only in the prototype — wire them to actually filter the grid in production
- Audio players are visual placeholders — integrate a real player (native `<audio>` or SoundCloud embeds) with the same play-button + waveform look
- Form: no backend in prototype; fields nom, email, projet (should become a dropdown: pub, ciné, spectacle, jeux vidéo…), message

## State Management
- `lang: 'fr' | 'en'`
- Production additions: active project filter, per-track playback state, form submission state

## Assets (in `assets/`)
- `logo-blanc.svg` / `logo-noir.svg` — VOIZ logo (CC Regeneration + vortex). NOTE: the SVG paths have no fill; the prototype forces white via CSS filter. In production add `fill:#e6e7e2` to the SVG or export a properly filled white version.
- `anim_voiz.mp4` — brand vortex animation (hero background, 1920×1080; a 1080×1920 portrait version exists in the client dossier)
- `logo-blurred.png` — blurred logo variant (unused, available)
- Google Fonts: Inter (400,500,600,700,900), Instrument Serif (italic)
- Project images/photos: placeholders — request from client

## Files
- `VOIZ Site v2.dc.html` — the hi-fi design (this is the reference; template markup at top, all copy + logic in the `class Component` script at the bottom)
- `VOIZ Wireframes.dc.html` — earlier wireframe exploration (context only)
- `assets/` — logos + video

## Brand rules (from the client's brand guide)
- Never overlay the lettering on the filled vortex sign, never invert the sign, never place lettering above the sign
- Inter for running text; Instrument (Serif) for taglines; CC Regeneration only in the logo
- The four brand colors above are exhaustive — no other hues; avoid emoji
