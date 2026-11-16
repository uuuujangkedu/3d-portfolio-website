-- Run this in the Supabase SQL editor, then create your admin user under
-- Authentication → Users (email + password) and turn public signups off.
-- Safe to run again: every statement is idempotent.
create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS only filters rows; the role still needs the table privileges themselves.
-- Without these the API answers "permission denied for table site_content".
grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;

alter table public.site_content enable row level security;

-- Visitors may read the site content, nobody anonymous may write.
drop policy if exists "public read" on public.site_content;
create policy "public read" on public.site_content
  for select using (true);

drop policy if exists "admin write" on public.site_content;
create policy "admin write" on public.site_content
  for all to authenticated using (true) with check (true);

-- Tighten further once you know your admin user id: replace the policy above with
-- create policy "owner write" on public.site_content
--   for all to authenticated using (auth.uid() = 'YOUR-USER-UUID')
--   with check (auth.uid() = 'YOUR-USER-UUID');

-- Image uploads from the admin dashboard (Storage → bucket "images").
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images public read" on storage.objects;
create policy "images public read" on storage.objects
  for select using (bucket_id = 'images');

drop policy if exists "images admin upload" on storage.objects;
create policy "images admin upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'images');

drop policy if exists "images admin update" on storage.objects;
create policy "images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'images');

drop policy if exists "images admin delete" on storage.objects;
create policy "images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'images');