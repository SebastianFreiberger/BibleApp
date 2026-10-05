-- Esquema de base de datos de Your Message Today (YMT)
-- Ejecutar en el SQL Editor de un proyecto Supabase nuevo para recrear el backend.

-- TABLA: perfiles de usuario
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Perfil propio" on public.profiles for all using (auth.uid() = id);

alter table public.profiles
  add column if not exists lang text default 'es',
  add column if not exists bible_version text default 'RV1960',
  add column if not exists theme text default 'dark';

-- Baja "soft": marca la fecha de baja en vez de borrar la fila. Si el usuario
-- vuelve a iniciar sesión, AuthContext la reactiva (pone deleted_at en null).
alter table public.profiles
  add column if not exists deleted_at timestamptz;

-- Trigger: crea el perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TABLA: favoritos
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  reference text not null,
  text text not null,
  version text,
  created_at timestamptz default now()
);
alter table public.favorites enable row level security;
create policy "Favoritos propios" on public.favorites for all using (auth.uid() = user_id);

-- TABLA: días de racha
create table public.streak_days (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  unique(user_id, date)
);
alter table public.streak_days enable row level security;
create policy "Racha propia" on public.streak_days for all using (auth.uid() = user_id);

-- STORAGE: crear manualmente desde el dashboard (Storage → New bucket)
-- Bucket: "avatars" (público), usado para las fotos de perfil.
-- Políticas (Storage → Policies). Sin esto, nadie puede leer ni escribir nada:
create policy "Avatar public read" on storage.objects
  for select to public using (bucket_id = 'avatars');

create policy "Avatar upload own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Avatar update own folder" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
