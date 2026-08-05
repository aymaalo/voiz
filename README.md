# VOIZ · Vortex of Noise — site vitrine

Production implementation of the `design_handoff_voiz_vitrine` design, built as a
bilingual (FR/EN) Next.js app and ready to deploy on Vercel.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 — brand tokens declared in `src/app/globals.css` |
| Fonts | `next/font` — Inter 400/500/600/700/900, Instrument Serif italic (self-hosted, no external requests) |
| Contact form | Route handler + Zod validation + [Resend](https://resend.com) |
| Hosting | Vercel (zero-config; every page is statically prerendered) |

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — the form works without it in dev
npm run dev                  # http://localhost:3000 → redirects to /fr
```

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Routes

| URL | Content |
|---|---|
| `/` | 302 → `/fr` |
| `/fr`, `/en` | the one-page site (prerendered) |
| `/fr/projets`, `/en/projects` | full projects listing (prerendered) |
| `/api/contact` | contact form endpoint |
| `/sitemap.xml`, `/robots.txt`, `/fr/opengraph-image` | generated at build |

The FR/EN toggle is a real navigation rather than client state, so both languages
are indexable and carry `canonical` + `hreflang` (`x-default` → `fr`).

## Project layout

```
src/
  app/
    [lang]/
      layout.tsx           root layout — <html lang>, fonts, metadata, background FX
      page.tsx             the one-page site + JSON-LD (ProfessionalService)
      [section]/page.tsx   /fr/projets and /en/projects only (dynamicParams: false)
      opengraph-image.tsx  1200×630 social card, generated per locale
      not-found.tsx
    api/contact/route.ts   validation, honeypot, throttle, Resend delivery
    globals.css            brand tokens, keyframes, projects mosaic, reduced-motion
    robots.ts, sitemap.ts, icon.svg
  components/
    brand/Logo.tsx         inlined wordmark, inherits currentColor
    sections/              Nav, Hero, Studio, Projects, ProjectTile, Services,
                           Testimonials, About, Contact, Footer
    ui/                    Marquee, Equalizer, BackgroundFX, ImageSlot, AudioPlayer
  content/
    i18n.ts                every string, FR + EN — the single source of copy
    projects.ts            the 8 projects: spans, categories, media slots
    site.ts                email, social URLs, site origin
  lib/routes.ts            localised path helpers
public/
  media/anim_voiz.mp4      hero background (landscape + a portrait variant)
  images/, audio/          drop client artwork and excerpts here
```

## Deploying to Vercel

1. Push the repo to GitHub/GitLab (the reference folders are excluded by
   `.vercelignore`, so they never reach the build):
   ```bash
   git init && git add -A && git commit -m "VOIZ vitrine"
   git remote add origin <your-repo-url> && git push -u origin main
   ```
2. **Vercel → Add New → Project → Import**. Framework is detected as Next.js; no
   build settings to change.
3. Add the environment variables below (Production + Preview).
4. Attach the domain, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy so
   canonical URLs, `hreflang`, the sitemap and OG tags point at the real origin.

Alternatively, from this folder: `npx vercel` (preview) / `npx vercel --prod`.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | recommended | Absolute origin for canonical/hreflang/sitemap/OG. Falls back to the Vercel production domain, then `localhost`. |
| `RESEND_API_KEY` | for email | Resend API key. |
| `CONTACT_TO_EMAIL` | for email | Inbox that receives form submissions. |
| `CONTACT_FROM_EMAIL` | for email | Sender — must be on a domain verified in Resend. |

Without the three mail variables the form still validates and returns success,
and the submission is logged server-side — so the site can go live before the
mailbox is set up. Swap Resend for any provider by editing the single
`resend.emails.send` call in `src/app/api/contact/route.ts`.

## What the client still needs to supply

These are the only placeholders left; each one degrades gracefully today.

- **Project images** — `src/content/projects.ts`, add `image: '/images/....jpg'` to
  each video project. Until then a branded placeholder holds the exact layout.
- **Audio excerpts** — drop files in `public/audio/` and set `audioSrc` on the
  audio projects. The player is fully wired (play/pause, seek, progress, one
  track at a time); the transport is disabled while no file is set.
- **Studio photo and Liam's portrait** — pass `src` to the `ImageSlot` in
  `Studio.tsx` and `About.tsx`.
- **Social URLs and the public email** — `src/content/site.ts`. Empty social
  entries render as plain text instead of dead links.
- **Case-study links** — optional `href` on a video project turns its tile into a
  link.

## Notes on the implementation

- **Copy** is verbatim from the design's `fr`/`en` dictionaries, including
  typographic apostrophes and guillemets. All of it lives in `src/content/i18n.ts`.
- **Responsive**: the design prototype was desktop-only (fixed 6-column mosaic,
  380px sidebars). Breakpoints, a mobile sheet menu and mobile tile spans were
  added; the desktop rendering matches the reference.
- **The projects mosaic** keeps the exact designed spans for "Tous" (which tile
  without holes). Filtered views fall back to a uniform 2×2 cell, because the
  bespoke mosaic cannot tile an arbitrary subset gap-free.
- **Accessibility**: skip link, focus-visible rings, labelled form fields with
  inline errors, `aria-pressed` filters, `aria-live` submit status, decorative
  marquees/glyphs hidden from assistive tech, and a full
  `prefers-reduced-motion` opt-out.
- **The logo** is inlined as an SVG component using `currentColor`, replacing the
  prototype's `brightness(0) invert()` filter hack.
- **Security headers** (`nosniff`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`) and long-lived caching for `/media` are set in
  `next.config.ts`.

The original design bundle is kept alongside the app in
`design_handoff_voiz_vitrine/` and `VOIZ - SITE WEB DOSSIER/` for reference; both
are excluded from the build.
