-- VOIZ back-office: the projects featured on the site, the tags that drive the
-- filter pills, and the allowlist of accounts allowed to edit them.
--
-- Access model
--   anon / authenticated  read published projects, their tags, and every tag
--   admins                full read/write on projects, tags and project_tags
--
-- Being signed in is not enough to write: the account must also be listed in
-- public.admins. That keeps the content safe even if public sign-ups are left
-- enabled on the Supabase project.

-- ---------------------------------------------------------------------------
-- Admin allowlist
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Accounts allowed to use the back-office. Add rows from the SQL editor.';

alter table public.admins enable row level security;

grant select on public.admins to authenticated;
grant select, insert, update, delete on public.admins to service_role;

-- An account can only see its own row, which is all the app needs to answer
-- "am I an admin?". Rows are managed from the dashboard, never from the app.
create policy "admins: read own row"
  on public.admins for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Tags
-- ---------------------------------------------------------------------------
create table public.tags (
  id bigint generated always as identity primary key,
  label_fr text not null check (char_length(btrim(label_fr)) between 1 and 40),
  label_en text not null default '' check (char_length(label_en) <= 40),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

comment on column public.tags.label_en is 'Empty falls back to label_fr on the site.';
comment on column public.tags.position is 'Order of the filter pills, ascending.';

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('video', 'audio')),
  title_fr text not null check (char_length(btrim(title_fr)) between 1 and 140),
  title_en text not null default '' check (char_length(title_en) <= 140),
  client text not null default '' check (char_length(client) <= 80),
  description_fr text not null default '' check (char_length(description_fr) <= 1000),
  description_en text not null default '' check (char_length(description_en) <= 1000),
  -- Credits line on the card, from a fixed vocabulary so every card reads the same.
  services text[] not null default '{}'
    check (services <@ array[
      'sound-direction', 'sound-design', 'original-music', 'foley',
      'dialogue-editing', 'mix', 'mastering'
    ]::text[]),
  youtube_id text check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  soundcloud_url text check (soundcloud_url ~ '^https://soundcloud\.com/[^\s]+$'),
  -- Which YouTube still to show. maxresdefault does not exist for every video,
  -- so the app checks on save and falls back to mqdefault (16:9, no bars).
  thumbnail text not null default 'mqdefault'
    check (thumbnail in ('maxresdefault', 'mqdefault')),
  duration_seconds integer check (duration_seconds between 0 and 86400),
  published boolean not null default true,
  featured boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Videos play from YouTube; audio from SoundCloud or YouTube.
  constraint projects_media_check check (
    case kind
      when 'video' then youtube_id is not null
      else youtube_id is not null or soundcloud_url is not null
    end
  )
);

comment on column public.projects.title_en is 'Empty falls back to title_fr on the site.';
comment on column public.projects.client is 'Shown after the title as "Title / Client". Same in both languages.';
comment on column public.projects.description_en is 'Empty falls back to description_fr on the site.';
comment on column public.projects.soundcloud_url is 'Audio only. When set, the tile plays SoundCloud instead of YouTube.';
comment on column public.projects.featured is 'Shown in the home page selection. Every published project is on the projects page.';
comment on column public.projects.position is 'Display order, ascending.';

-- The site lists published projects in display order.
create index projects_published_position_idx on public.projects (position) where published;

create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Project ↔ tag
-- ---------------------------------------------------------------------------
create table public.project_tags (
  project_id bigint not null references public.projects (id) on delete cascade,
  tag_id bigint not null references public.tags (id) on delete cascade,
  primary key (project_id, tag_id)
);

-- The primary key covers project_id; tag_id needs its own for cascades.
create index project_tags_tag_id_idx on public.project_tags (tag_id);

-- ---------------------------------------------------------------------------
-- Data API exposure and row-level security
-- ---------------------------------------------------------------------------
grant select on public.tags, public.projects, public.project_tags to anon;
grant select, insert, update, delete
  on public.tags, public.projects, public.project_tags to authenticated;
grant select, insert, update, delete
  on public.tags, public.projects, public.project_tags to service_role;

alter table public.tags enable row level security;
alter table public.projects enable row level security;
alter table public.project_tags enable row level security;

-- Reads. One SELECT policy per role: anon has no privileges on admins, so the
-- allowlist check can only appear in the authenticated policies.
create policy "tags: public read"
  on public.tags for select
  to anon, authenticated
  using (true);

create policy "projects: anon read published"
  on public.projects for select
  to anon
  using (published);

-- Admins must also see unpublished drafts.
create policy "projects: signed-in read published, admins read all"
  on public.projects for select
  to authenticated
  using (
    published
    or exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

create policy "project_tags: anon read for published projects"
  on public.project_tags for select
  to anon
  using (
    exists (select 1 from public.projects p where p.id = project_id and p.published)
  );

create policy "project_tags: signed-in read for published, admins read all"
  on public.project_tags for select
  to authenticated
  using (
    exists (select 1 from public.projects p where p.id = project_id and p.published)
    or exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

-- Writes. Each policy checks the allowlist; the subquery on admins runs under
-- that table's own "read own row" policy, so no SECURITY DEFINER helper is
-- needed.
create policy "tags: admin insert"
  on public.tags for insert
  to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "tags: admin update"
  on public.tags for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "tags: admin delete"
  on public.tags for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "projects: admin insert"
  on public.projects for insert
  to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "projects: admin update"
  on public.projects for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "projects: admin delete"
  on public.projects for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "project_tags: admin insert"
  on public.project_tags for insert
  to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "project_tags: admin delete"
  on public.project_tags for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- ---------------------------------------------------------------------------
-- Starting categories. The first four are the home page selection's tabs;
-- the projects page adds the other three.
-- ---------------------------------------------------------------------------
insert into public.tags (label_fr, label_en, position) values
  ('Publicité', 'Advertising', 1),
  ('Cinéma', 'Film', 2),
  ('Spectacle vivant', 'Live performance', 3),
  ('3D / Animation', '3D / Animation', 4),
  ('Jeux vidéo', 'Video games', 5),
  ('Musique', 'Music', 6),
  ('Corporate', 'Corporate', 7);
