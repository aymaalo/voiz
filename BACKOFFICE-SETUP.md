# VOIZ back-office — setup checklist

Everything needed to take the `/admin` back-office from this repo to the client's
production site. The README covers the same ground in more detail; this is the
short, do-it-in-order version.

---

## 1. Supabase project (owned by the client)

1. **The client** creates an account and an organization on
   [supabase.com](https://supabase.com), then a project.
   - Region: **West EU (Paris)** — closest to the Vercel region (`cdg1`).
   - Save the database password somewhere safe (their password manager).
2. **The client** invites you: *Organization settings → Team → Invite*.
   - Role: **Developer** is enough (database, auth, API keys — no billing).
   - Free plan note: organizations where you are Owner/Administrator may count
     toward *your* 2 free projects, which is another reason to take Developer.

## 2. Apply the database schema

From this repo, with the Supabase CLI:

```bash
supabase login
supabase link --project-ref <project-ref>   # ref = the id in the project URL
supabase db push                            # applies supabase/migrations/
```

Alternative without the CLI: open the project's **SQL editor**, paste the contents
of `supabase/migrations/20260913134458_projects_backoffice.sql`, and run it.

This creates the `projects`, `tags`, `project_tags` and `admins` tables, the
row-level security policies, and the 7 starting categories, in filter order:
Publicité, Cinéma, Spectacle vivant, 3D / Animation (the home page tabs), then
Jeux vidéo, Musique, Corporate (projects page only, as long as no featured
project uses them).

## 3. Authentication settings

In the Supabase dashboard, *Authentication → Sign In / Providers*:

- Keep **Email** enabled (the back-office uses email + password).
- Turn **off** "Allow new users to sign up".

> Don't disable the Email provider itself — that blocks sign-in completely.

## 4. Create the client's admin account

1. *Authentication → Users → Add user → Create new user*
   - Email: the client's address
   - Password: a temporary one (they change it later in `/admin/account`)
   - Check **Auto Confirm User**
2. Allow that account into the back-office — *SQL editor*:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'client@example.com';
   ```

   Repeat for any other account that should have access (yours included, if you
   want to sign in yourself). An account that is signed in but **not** in
   `public.admins` cannot see or change anything.

## 5. Vercel environment variables

*Vercel → Project → Settings → Environment Variables* (Production + Preview):

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → *Project Settings → API Keys* (project URL) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same page — the **publishable** key (`sb_publishable_…`). **Never** the secret key. |
| `CRON_SECRET` | Any long random string (e.g. `openssl rand -hex 32`) |

Then **redeploy**.

`CRON_SECRET` protects `/api/keep-alive`, which Vercel calls daily (configured in
`vercel.json`) so the free Supabase project isn't paused after a week without
activity. On the Supabase Pro plan (~$25/month) projects never pause, and the
cron is harmless.

## 6. Hand over to the client

- Back-office URL: `https://<their-domain>/admin`
- Their email + the temporary password → ask them to change it in **Compte**.
- What they can do: add/edit/reorder/hide/delete projects, choose which ones are
  **mis en avant sur l’accueil** (★ Accueil), manage categories (which become the
  filter tabs), change their password.
- Each project: name (FR/EN), client, categories, services (Sound Direction,
  Sound Design, Original Music, Foley, Dialogue Editing, Mix, Mastering), a short
  description (hidden behind "En savoir plus" on the site), and its media:
  - **Vidéo** → YouTube link (required).
  - **Audio** → SoundCloud link and/or YouTube link; SoundCloud plays if set.
- YouTube videos must be **public or unlisted** (not private), and the video
  owner must allow embedding. SoundCloud tracks must not be private. The editor
  checks both when saving.
- **Home page vs projects page:** the home page shows only featured projects
  (tabs: Tous + their categories + "Plus de projets"); `/fr/projets` shows every
  published project.

## 7. Verify in production

- [ ] `/admin` redirects to the login page when signed out
- [ ] The client can sign in and sees "Projets"
- [ ] Adding a project makes it appear on `/fr/projets` right away
- [ ] Ticking ★ Accueil puts it in the home page selection; unticking removes it
- [ ] Hiding it (Masquer) removes it from the site
- [ ] Video tiles open the lightbox; audio tiles play inside the tile (SoundCloud or YouTube)
- [ ] "En savoir plus" reveals the description; Services open on hover (tap on mobile)
- [ ] `/en/projects` shows English titles (or French when English is empty)
- [ ] Vercel → *Settings → Cron Jobs* lists `/api/keep-alive`

---

## Good to know

- **Saves are live immediately.** Edits made directly in the Supabase dashboard
  (not through `/admin`) appear on the site within an hour.
- **If Supabase is down or paused**, the public site keeps serving the last good
  pages; only saving in `/admin` stops working.
- **The 8 old placeholder projects were removed** (they had no YouTube links).
  Until projects are added, the section reads "Nos projets arrivent très bientôt."
- **Photos and showreel** are in `public/` as web-sized copies (originals in
  `VOIZ - SITE WEB DOSSIER/SOURCES V2/`). Paths live in `src/content/site.ts`.
  A new showreel must get a new file name (`showreel-v2.mp4`) — `/media` is
  cached for a year. See the README for the encoding settings.
- **The players must stay visible.** YouTube's API policies forbid hidden or
  audio-only playback, which is why audio tiles swap in the real player.
- **Services list:** adding a new service to the checkboxes needs a code change
  in two places — `src/lib/projects/services.ts` and the `services` check
  constraint in the migration (new migration for an already-deployed database).
- **Not tested on iPhone.** iOS may require a second tap on YouTube's own play
  button for audio tiles and the lightbox.

## Local development

Requires Docker.

```bash
supabase start          # local Supabase, applies the migrations
npm run build && npx next start   # or: npm run dev
supabase stop           # when done (data is kept in a Docker volume)
```

`.env.local` (gitignored) already points at the local Supabase. If it's missing:

```bash
supabase status -o env   # copy API_URL and PUBLISHABLE_KEY
```

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local publishable key>
CRON_SECRET=local-cron-secret
```

**Local test accounts** (exist only in the local Docker database):

| Email | Password | Access |
|---|---|---|
| `admin@voiz.local` | `voiz-local-admin` | admin |
| `intruder@voiz.local` | `voiz-local-intruder` | signed in, **not** admin (to test refusal) |

`supabase db reset` wipes the local database, including these accounts. To
recreate an admin locally, use Studio (`supabase start` without `-x studio`) →
Authentication → Add user, then run the `insert into public.admins` SQL above.

After any schema change, regenerate the TypeScript types:

```bash
supabase gen types typescript --local > src/lib/supabase/database.types.ts
```
