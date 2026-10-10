-- ============================================================
-- Ziel Kids Club — Supabase schema (Postgres)
-- Draft v1 — 10 Okt 2026
-- Jalankan di Supabase SQL Editor (project zielkidsclub)
-- ============================================================

-- ---------- helper ----------
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- profiles (terhubung ke auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('parent','teacher','owner')),
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ---------- children (data anak) ----------
create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  birth_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_children_updated before update on public.children
  for each row execute function public.handle_updated_at();
create index idx_children_parent on public.children(parent_id);

-- ---------- programs ----------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- trial | regular | popup | private
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- class_sessions (jadwal sesi kelas) ----------
create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  program_slug text not null references public.programs(slug),
  title text not null,
  session_date date not null,
  start_time time not null,
  end_time time not null,
  quota int not null default 10,
  teacher_id uuid references public.profiles(id),
  age_group text,                          -- mis. "1-2 tahun"
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_class_sessions_updated before update on public.class_sessions
  for each row execute function public.handle_updated_at();
create index idx_class_sessions_date on public.class_sessions(session_date);

-- ---------- events ----------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('popup','talkshow','workshop','training')),
  event_date date not null,
  start_time time,
  end_time time,
  location text,
  price_idr int not null default 0,        -- 0 = gratis
  quota int,
  description text,
  flyer_url text,
  status text not null default 'upcoming' check (status in ('upcoming','ongoing','completed','cancelled')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_events_updated before update on public.events
  for each row execute function public.handle_updated_at();
create index idx_events_date on public.events(event_date);

-- ---------- event_age_sessions (pilihan sesi per usia pada event) ----------
create table public.event_age_sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  label text not null,                     -- mis. "Sesi Toddler"
  age_range text not null,                 -- mis. "2-3 tahun"
  start_time time,
  end_time time,
  created_at timestamptz not null default now()
);
create index idx_event_age_sessions_event on public.event_age_sessions(event_id);

-- ---------- registrations (pendaftaran anak ke sesi/event) ----------
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children(id) on delete cascade, -- null = pendaftar tamu (konfirmasi via WA)
  class_session_id uuid references public.class_sessions(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  event_age_session_id uuid references public.event_age_sessions(id) on delete set null,
  package_sessions int,                     -- untuk regular: 4/8/12/16
  sessions_remaining int,
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed','refunded')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (class_session_id is not null and event_id is null) or
    (event_id is not null and class_session_id is null)
  )
);
create trigger trg_registrations_updated before update on public.registrations
  for each row execute function public.handle_updated_at();
create index idx_registrations_child on public.registrations(child_id);

-- ---------- payments ----------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  amount_idr int not null,
  method text not null default 'qris',
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_payments_registration on public.payments(registration_id);

-- ---------- development_reports (laporan 9 ranah observasi) ----------
create table public.development_reports (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  teacher_id uuid references public.profiles(id),
  period_label text not null,               -- mis. "Oktober 2026"
  gross_motor smallint check (gross_motor between 1 and 5),
  fine_motor smallint check (fine_motor between 1 and 5),
  sensory smallint check (sensory between 1 and 5),
  attention smallint check (attention between 1 and 5),
  language smallint check (language between 1 and 5),
  socio_emotional smallint check (socio_emotional between 1 and 5),
  independence smallint check (independence between 1 and 5),
  executive_function smallint check (executive_function between 1 and 5),
  adaptive smallint check (adaptive between 1 and 5),
  notes text,
  created_at timestamptz not null default now()
);
create index idx_dev_reports_child on public.development_reports(child_id);

-- ---------- documentations (dokumentasi per anak) ----------
create table public.documentations (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  teacher_id uuid references public.profiles(id),
  title text not null,
  activity_date date not null,
  notes text,
  photo_url text,
  created_at timestamptz not null default now()
);
create index idx_documentations_child on public.documentations(child_id);

-- ---------- questionnaires ----------
create table public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children(id) on delete set null,
  parent_id uuid references public.profiles(id) on delete set null,
  answers jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------- articles ----------
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null check (category in ('parenting','tumbuh-kembang','montessori','early-childhood')),
  excerpt text,
  body_md text not null,
  cover_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_articles_updated before update on public.articles
  for each row execute function public.handle_updated_at();

-- ---------- promos ----------
create table public.promos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  valid_until date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- partnerships (pengajuan kerjasama) ----------
create table public.partnerships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  institution text,
  kind text not null,                       -- event | ekstrakurikuler | bootcamp | lainnya
  phone text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','done')),
  created_at timestamptz not null default now()
);

-- ---------- seed: programs ----------
insert into public.programs (slug, name, description) values
  ('trial','Trial Class','Kelas percobaan untuk merasakan pengalaman belajar di Ziel Kids Club.'),
  ('regular','Regular Class','Kelas reguler dengan paket 4x, 8x, 12x, atau 16x sesi.'),
  ('popup','Pop Up Class / Playdate','Kelas tematik dan playdate terbuka untuk umum.'),
  ('private','Privat','Kelas privat sesuai kebutuhan anak.');

-- ============================================================
-- ROW LEVEL SECURITY: aktifkan per tabel di Supabase dashboard
-- sesuai kebutuhan (auth: parent hanya miliknya, teacher/owner
-- via custom claims atau tabel profiles).
-- Draft RLS minimal (sesuaikan sebelum produksi):
-- ============================================================
-- alter table public.profiles enable row level security;
-- (tambahkan policies sesuai peran)
