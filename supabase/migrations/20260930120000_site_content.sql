-- VOIZ back-office: the site's texts and photos, edited from /admin/content.
--
-- One row per editable field. The field list, the value shapes and their
-- validation live in the app (src/lib/content/fields.ts); a key with no row
-- keeps the default written in the code, so an empty table is the site as
-- shipped.
--
-- Access model — same as the projects:
--   anon / authenticated  read every row
--   admins                full read/write
-- plus a public Storage bucket for the photos, writable by admins only.

create table public.site_content (
  key text primary key check (key ~ '^[a-zA-Z][a-zA-Z0-9]{0,63}$'),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.site_content is
  'Texts and photos edited from /admin/content. A missing key uses the default in the code.';

create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;
grant select, insert, update, delete on public.site_content to service_role;

alter table public.site_content enable row level security;

create policy "site_content: public read"
  on public.site_content for select
  to anon, authenticated
  using (true);

create policy "site_content: admin insert"
  on public.site_content for insert
  to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "site_content: admin update"
  on public.site_content for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "site_content: admin delete"
  on public.site_content for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- ---------------------------------------------------------------------------
-- Photos
-- ---------------------------------------------------------------------------
-- Public bucket: the site links the files directly, no signed URLs. The
-- browser uploads straight to Storage with the admin's session, which keeps
-- large photos clear of the ~4.5 MB request limit of Vercel functions.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  10485760, -- 10 MiB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "site-images: admin read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'site-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

create policy "site-images: admin insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'site-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

create policy "site-images: admin update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'site-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

create policy "site-images: admin delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'site-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );
