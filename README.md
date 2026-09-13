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
| Projects | [Supabase](https://supabase.com) (Postgres + Auth), edited in the `/admin` back-office |
| Hosting | Vercel (public pages are prerendered and refreshed on every back-office save) |

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
| `/admin` | back-office — projects, tags, account (French UI, `noindex`) |
| `/api/contact` | contact form endpoint |
| `/api/keep-alive` | daily Vercel Cron that keeps a free Supabase project awake |
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
      [section]/page.tsx   /fr/projets and /en/projects only (other slugs 404)
      opengraph-image.tsx  1200×630 social card, generated per locale
      not-found.tsx
    admin/                 back-office (its own root layout)
      login/               email + password sign-in
      (dashboard)/         projects list, project editor, tags, account
      actions.ts           every server action — each re-checks the admin session
    api/contact/route.ts   validation, honeypot, throttle, Resend delivery
    api/keep-alive/        daily cron, see "Supabase" below
    globals.css            brand tokens, keyframes, projects mosaic, reduced-motion
    robots.ts, sitemap.ts, icon.svg
  components/
    admin/                 back-office forms and controls
    brand/Logo.tsx         inlined wordmark, inherits currentColor
    sections/              Nav, Hero, Studio, Projects, ProjectTile, VideoLightbox,
                           Services, Testimonials, About, Contact, Footer
    ui/                    Marquee, Equalizer, BackgroundFX, ScrollReveal
  content/
    i18n.ts                every string, FR + EN — the single source of copy
    site.ts                email, social URLs, site origin
  lib/
    admin/auth.ts          session + admins-allowlist check
    projects/              cached public read of projects/tags, localised view models
    supabase/              clients, session proxy, generated database types
    youtube.ts             link parsing, thumbnails, embed URLs, durations
    routes.ts              localised path helpers
  proxy.ts                 refreshes the Supabase session on /admin requests only
supabase/
  migrations/              schema, RLS policies, starting tags
  config.toml              local Supabase (supabase start)
public/
  media/showreel-v1.mp4    hero background (muted 720p H.264, ~4 MB) + its poster frame
  images/                  web-sized photos (studio, testimonials, liam-grandsard, contact)
```

## Projects back-office

Projects are no longer in the code. The client manages them at `/admin`:

- **Projects** — type (video or audio), media links (YouTube for videos;
  SoundCloud and/or YouTube for audio), name in French and English (English falls
  back to French when empty), client, categories, services (fixed list, see
  `src/lib/projects/services.ts`), description, published and "featured on the
  home page" toggles, display order. The editor previews the video or track and
  fills in the duration of audio projects. Saving checks with YouTube/SoundCloud
  that the media exists and may be embedded.
- **Catégories** (the `tags` table) — French/English labels and order. Each
  category used by at least one shown project becomes a filter tab; a project's
  first category is shown on its tile.
- **Account** — change password.

On the site the home page shows the **featured** selection (tabs: Tous, its
categories, and "Plus de projets" → the projects page, which lists everything
published). Tiles show "Name / Client", the category and the services line; the
description stays hidden behind "En savoir plus". Video tiles show the YouTube
thumbnail and open the video in a lightbox; audio tiles keep the waveform design
and swap in the SoundCloud (or YouTube) player when played. The player is always
visible: the providers' policies forbid hidden or audio-only playback.

Photos (studio, testimonials background, Liam's portrait, contact texture) and
the hero showreel are set in `site.photos` / `site.heroVideo` in
`src/content/site.ts`; an empty photo path leaves it out. The files in `public/`
are web-sized copies; the full-resolution originals live in
`VOIZ - SITE WEB DOSSIER/SOURCES V2/`, which is excluded from the build.

To swap the showreel, export a new cut, re-encode it muted (H.264, `-movflags
+faststart`, ~1 Mbit/s at 720p) and give it a **new file name**
(`showreel-v2.mp4`): `/media` is served with a one-year immutable cache. The hero
shows the poster instead of playing for visitors with reduced motion or data
saver on.

A save refreshes the public pages immediately (`updateTag` on the data-cache
tag). Edits made directly in the Supabase dashboard show up within the hour.

## Supabase

### One-time setup (client-owned project)

1. The client creates an organization and a project on
   [supabase.com](https://supabase.com) (region: Paris, `eu-west-3`, is closest
   to the Vercel region), then invites the developer under
   *Organization settings → Team* — the **Developer** role is enough.
2. Apply the schema, either with the CLI:
   ```bash
   supabase login
   supabase link --project-ref <project-ref>
   supabase db push
   ```
   or by pasting `supabase/migrations/*.sql` into the dashboard's SQL editor.
3. *Authentication → Sign In / Providers*: keep **Email** enabled, turn **off**
   "Allow new users to sign up". (The admins allowlist below keeps content safe
   either way, but there is no reason to accept sign-ups.)
4. Create the client's account: *Authentication → Users → Add user → Create new
   user*, with "Auto Confirm User" checked. Then allow it into the back-office
   from the SQL editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'client@example.com';
   ```
   The client can change the password from `/admin/account` after signing in.
5. Copy the project URL and the **publishable** key (*Project Settings → API
   Keys*) into the Vercel environment variables below, and redeploy.

### Access model

Row-level security does the enforcement, not just the app: anyone can read
published projects and tags; only accounts listed in `public.admins` can read
drafts or write anything. Every back-office page and server action also
re-verifies the session and the allowlist.

### Free plan pausing

Supabase pauses free projects after a week without activity, and cached pages
mean the site itself rarely queries the database. `vercel.json` schedules
`/api/keep-alive` daily to prevent that — set `CRON_SECRET` on Vercel. If the
database is ever unreachable, the site keeps serving the last good pages; only
saving in `/admin` stops working. The Pro plan never pauses.

### Local development

Requires Docker.

```bash
supabase start       # applies supabase/migrations; prints the local URL and keys
# .env.local → NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
#              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local publishable key>
npm run dev
```

Create a local user with `supabase status` → Studio, or the Auth admin API, then
insert it into `public.admins` as above. After changing the schema, regenerate
the types: `supabase gen types typescript --local > src/lib/supabase/database.types.ts`.

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
| `NEXT_PUBLIC_SUPABASE_URL` | for projects | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | for projects | Supabase **publishable** key (never the secret key). |
| `CRON_SECRET` | recommended | Any long random string; authorises the daily keep-alive cron. |

Without the Supabase variables the site builds and renders with no projects, and
`/admin` explains what is missing.

Without the three mail variables the form still validates and returns success,
and the submission is logged server-side — so the site can go live before the
mailbox is set up. Swap Resend for any provider by editing the single
`resend.emails.send` call in `src/app/api/contact/route.ts`.

## What the client still needs to supply

These are the only placeholders left; each one degrades gracefully today.

- **Projects** — added by the client in `/admin` (see above), as YouTube links.
- **Social URLs and the public email** — `src/content/site.ts`. Empty social
  entries render as plain text instead of dead links.

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
