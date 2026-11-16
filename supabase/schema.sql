-- Run this in the Supabase SQL editor, then create your admin user under
-- Authentication → Users (email + password) and turn public signups off.
create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Visitors may read the site content, nobody anonymous may write.
create policy "public read" on public.site_content
  for select using (true);

create policy "admin write" on public.site_content
  for all to authenticated using (true) with check (true);

-- Tighten further once you know your admin user id: replace the policy above with
-- create policy "owner write" on public.site_content
--   for all to authenticated using (auth.uid() = 'YOUR-USER-UUID')
--   with check (auth.uid() = 'YOUR-USER-UUID');
