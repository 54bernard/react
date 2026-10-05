-- =====================================================================
-- Progrès Habitat — schéma Supabase / PostgreSQL
-- À exécuter dans Supabase > SQL Editor (une seule fois, sur un projet vide).
-- Ensuite, exécuter seed.sql pour les données de départ.
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------------
-- Types énumérés
-- ---------------------------------------------------------------------
create type property_status as enum ('disponible', 'reserve', 'vendu');
create type property_type as enum ('residentiel', 'commercial', 'agricole', 'industriel', 'mixte');
create type payment_option as enum ('comptant', 'echelonne');
create type legal_status as enum ('attestation_attribution', 'acd', 'permis_urbain_habiter', 'titre_foncier');
create type document_type as enum ('attestation_attribution', 'acd', 'permis_urbain_habiter', 'titre_foncier', 'plan', 'autre');
create type lead_source as enum ('site_formulaire', 'site_visite', 'whatsapp', 'telephone', 'facebook', 'bouche_a_oreille', 'autre');
create type lead_status as enum ('nouveau', 'contacte', 'visite_planifiee', 'negociation', 'gagne', 'perdu');
create type appointment_status as enum ('en_attente', 'confirme', 'effectue', 'annule');
create type admin_role as enum ('admin', 'editor');

-- ---------------------------------------------------------------------
-- Fonction utilitaire : mise à jour automatique de updated_at
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Utilisateurs & administrateurs
-- ---------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role admin_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Crée automatiquement le profil public à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Vrai si l'utilisateur connecté est administrateur (utilisé par les règles RLS)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- Zones / localisations
-- ---------------------------------------------------------------------
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city text not null,
  description text,
  image_url text,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Terrains
-- ---------------------------------------------------------------------
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  reference text not null unique,
  title text not null check (char_length(title) between 3 and 140),
  description text not null default '',
  location_id uuid references public.locations (id) on delete set null,
  city text not null,
  district text not null,
  address text,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  price bigint not null check (price >= 0),
  surface integer not null check (surface > 0),
  type property_type not null default 'residentiel',
  status property_status not null default 'disponible',
  payment_options payment_option[] not null default array['comptant']::payment_option[],
  installment_months integer check (installment_months is null or installment_months between 1 and 120),
  legal_status legal_status not null default 'attestation_attribution',
  road_access text,
  has_water boolean not null default false,
  has_electricity boolean not null default false,
  distance_to_paved_road_m integer check (distance_to_paved_road_m is null or distance_to_paved_road_m >= 0),
  topography text,
  nearby jsonb not null default '[]'::jsonb,
  amenities text[] not null default '{}',
  cadastral_plan_url text,
  is_featured boolean not null default false,
  -- Brouillon : is_published = false ; Publié : true ; Archivé : archived_at renseigné (et non publié)
  is_published boolean not null default false,
  archived_at timestamptz,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 170),
  views_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint properties_archived_not_published check (archived_at is null or not is_published)
);

create index properties_published_idx on public.properties (is_published, status, created_at desc);
create index properties_city_idx on public.properties (lower(city));
create index properties_district_idx on public.properties (lower(district));
create index properties_location_idx on public.properties (location_id);
create index properties_price_idx on public.properties (price);
create index properties_surface_idx on public.properties (surface);
create index properties_featured_idx on public.properties (is_featured) where is_featured;
-- Recherche textuelle (ILIKE '%mot%') accélérée par des index trigrammes
create index properties_title_trgm_idx on public.properties using gin (title gin_trgm_ops);
create index properties_district_trgm_idx on public.properties using gin (district gin_trgm_ops);
create index properties_reference_trgm_idx on public.properties using gin (reference gin_trgm_ops);
create index properties_archived_idx on public.properties (archived_at) where archived_at is not null;

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  url text not null,
  storage_path text,
  alt text,
  position integer not null default 0,
  is_main boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index property_images_property_idx on public.property_images (property_id, position);
-- Une seule image principale par terrain
create unique index property_images_one_main_idx on public.property_images (property_id) where is_main;

create table public.property_documents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  name text not null,
  doc_type document_type not null default 'autre',
  file_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index property_documents_property_idx on public.property_documents (property_id);

-- ---------------------------------------------------------------------
-- CRM : prospects (leads) et rendez-vous
-- ---------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 6 and 30),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  property_id uuid references public.properties (id) on delete set null,
  source lead_source not null default 'site_formulaire',
  status lead_status not null default 'nouveau',
  message text check (message is null or char_length(message) <= 2000),
  notes text,
  follow_up_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on public.leads (status, created_at desc);
create index leads_property_idx on public.leads (property_id);
create index leads_follow_up_idx on public.leads (follow_up_at) where follow_up_at is not null;
create index leads_phone_recent_idx on public.leads (phone, created_at desc);
create index leads_created_idx on public.leads (created_at desc);
create index leads_name_trgm_idx on public.leads using gin (name gin_trgm_ops);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads (id) on delete set null,
  property_id uuid references public.properties (id) on delete set null,
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 6 and 30),
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  preferred_date date not null,
  preferred_time text not null,
  message text check (message is null or char_length(message) <= 2000),
  status appointment_status not null default 'en_attente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index appointments_date_idx on public.appointments (preferred_date, status);
create index appointments_created_idx on public.appointments (created_at desc);
create index appointments_property_idx on public.appointments (property_id);

-- ---------------------------------------------------------------------
-- Favoris (anonymes, par appareil) — utilisés pour les statistiques
-- ---------------------------------------------------------------------
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  device_id text not null check (char_length(device_id) between 8 and 64),
  property_id uuid not null references public.properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (device_id, property_id)
);

create index favorites_property_idx on public.favorites (property_id);

-- ---------------------------------------------------------------------
-- Contenus éditoriaux
-- ---------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  content text not null,
  property_label text,
  rating smallint not null default 5 check (rating between 1 and 5),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  position integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faq_position_idx on public.faq (position);

-- Paramètres de l'entreprise : une seule ligne (id = 1)
create table public.settings (
  id smallint primary key default 1 check (id = 1),
  company_name text not null default 'Progrès Habitat',
  tagline text not null default 'Bâtissons votre avenir ensemble',
  phone text not null,
  whatsapp text not null,
  email text,
  address text not null,
  city text not null default 'Ouagadougou',
  country text not null default 'Burkina Faso',
  opening_hours text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  linkedin_url text,
  key_figures jsonb not null default '[]'::jsonb,
  founded_year smallint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Triggers updated_at
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'users', 'admins', 'locations', 'properties', 'property_images', 'property_documents',
    'leads', 'appointments', 'favorites', 'testimonials', 'faq', 'settings'
  ] loop
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Compteur de vues (appelé par le site public, sans exposer la table en écriture)
-- ---------------------------------------------------------------------
create or replace function public.increment_property_view(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.properties
     set views_count = views_count + 1
   where slug = p_slug and is_published;
$$;

grant execute on function public.increment_property_view(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Gestion des administrateurs (réservée aux administrateurs « admin »)
-- Les comptes sont créés dans Supabase > Authentication ; ces fonctions
-- leur donnent (ou retirent) l'accès au back-office.
-- ---------------------------------------------------------------------
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid() and role = 'admin');
$$;

create or replace function public.list_admin_users()
returns table (user_id uuid, email text, role admin_role, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès refusé' using errcode = '42501';
  end if;
  return query
    select a.user_id, u.email::text, a.role, a.created_at, u.last_sign_in_at
      from public.admins a
      join auth.users u on u.id = a.user_id
     order by a.created_at;
end;
$$;

create or replace function public.grant_admin(p_email text, p_role admin_role default 'editor')
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare v_user uuid;
begin
  if not public.is_super_admin() then
    raise exception 'Seul un administrateur peut gérer les accès.' using errcode = '42501';
  end if;
  select id into v_user from auth.users where lower(email) = lower(trim(p_email));
  if v_user is null then
    raise exception 'Aucun compte avec cet e-mail. Créez-le d''abord dans Supabase > Authentication.' using errcode = 'P0002';
  end if;
  insert into public.admins (user_id, role) values (v_user, p_role)
  on conflict (user_id) do update set role = excluded.role;
end;
$$;

create or replace function public.revoke_admin(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Seul un administrateur peut gérer les accès.' using errcode = '42501';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'Vous ne pouvez pas retirer votre propre accès.' using errcode = '42501';
  end if;
  delete from public.admins where user_id = p_user_id;
end;
$$;

revoke all on function public.list_admin_users() from public, anon;
revoke all on function public.grant_admin(text, admin_role) from public, anon;
revoke all on function public.revoke_admin(uuid) from public, anon;
grant execute on function public.list_admin_users() to authenticated;
grant execute on function public.grant_admin(text, admin_role) to authenticated;
grant execute on function public.revoke_admin(uuid) to authenticated;

-- Anti-spam : refuse plus de 3 demandes du même numéro en 10 minutes
create or replace function public.check_lead_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.leads
       where phone = new.phone and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'Trop de demandes envoyées. Réessayez dans quelques minutes.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger leads_rate_limit before insert on public.leads
  for each row execute function public.check_lead_rate_limit();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.admins enable row level security;
alter table public.locations enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_documents enable row level security;
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.favorites enable row level security;
alter table public.testimonials enable row level security;
alter table public.faq enable row level security;
alter table public.settings enable row level security;

-- users : chacun voit et modifie son profil ; les admins voient tout
create policy "users_select_own" on public.users for select using (id = auth.uid() or public.is_admin());
create policy "users_update_own" on public.users for update using (id = auth.uid()) with check (id = auth.uid());

-- admins : lecture par les admins uniquement (ajout via SQL Editor)
create policy "admins_select" on public.admins for select using (public.is_admin() or user_id = auth.uid());

-- Lecture publique des contenus publiés
create policy "locations_public_read" on public.locations for select using (true);
create policy "properties_public_read" on public.properties for select using (is_published or public.is_admin());
create policy "images_public_read" on public.property_images for select
  using (exists (select 1 from public.properties p where p.id = property_id and (p.is_published or public.is_admin())));
create policy "documents_public_read" on public.property_documents for select
  using (exists (select 1 from public.properties p where p.id = property_id and (p.is_published or public.is_admin())));
create policy "testimonials_public_read" on public.testimonials for select using (is_published or public.is_admin());
create policy "faq_public_read" on public.faq for select using (is_published or public.is_admin());
create policy "settings_public_read" on public.settings for select using (true);

-- Écriture réservée aux administrateurs
create policy "locations_admin_write" on public.locations for all using (public.is_admin()) with check (public.is_admin());
create policy "properties_admin_write" on public.properties for all using (public.is_admin()) with check (public.is_admin());
create policy "images_admin_write" on public.property_images for all using (public.is_admin()) with check (public.is_admin());
create policy "documents_admin_write" on public.property_documents for all using (public.is_admin()) with check (public.is_admin());
create policy "testimonials_admin_write" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "faq_admin_write" on public.faq for all using (public.is_admin()) with check (public.is_admin());
create policy "settings_admin_write" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Leads & rendez-vous : le public peut seulement CRÉER (formulaires), jamais lire
create policy "leads_public_insert" on public.leads for insert
  with check (status = 'nouveau' and notes is null and follow_up_at is null);
create policy "leads_admin_all" on public.leads for all using (public.is_admin()) with check (public.is_admin());

create policy "appointments_public_insert" on public.appointments for insert
  with check (status = 'en_attente' and preferred_date >= current_date);
create policy "appointments_admin_all" on public.appointments for all using (public.is_admin()) with check (public.is_admin());

-- Favoris : insertion/suppression anonymes par identifiant d'appareil, lecture admin
create policy "favorites_public_insert" on public.favorites for insert with check (true);
create policy "favorites_public_delete" on public.favorites for delete using (true);
create policy "favorites_admin_read" on public.favorites for select using (public.is_admin());

-- ---------------------------------------------------------------------
-- Stockage des fichiers (Supabase Storage)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('property-images', 'property-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('property-documents', 'property-documents', false, 15728640, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "property_images_public_read" on storage.objects for select
  using (bucket_id = 'property-images');
create policy "property_images_admin_insert" on storage.objects for insert
  with check (bucket_id = 'property-images' and public.is_admin());
create policy "property_images_admin_update" on storage.objects for update
  using (bucket_id = 'property-images' and public.is_admin());
create policy "property_images_admin_delete" on storage.objects for delete
  using (bucket_id = 'property-images' and public.is_admin());

create policy "property_documents_admin_all" on storage.objects for all
  using (bucket_id = 'property-documents' and public.is_admin())
  with check (bucket_id = 'property-documents' and public.is_admin());
