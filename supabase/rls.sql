-- ============================================================
-- Ziel Kids Club — RLS policies (tahap hardening, sebelum go-live)
-- Jalankan SETELAH supabase/schema.sql, di Supabase SQL Editor.
-- Catatan: API routes memakai service_role untuk operasi tulis
-- sehingga RLS tidak memblokir backend; policy di bawah melindungi
-- akses langsung via anon key.
-- ============================================================

-- ---------- aktifkan RLS ----------
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.class_sessions enable row level security;
alter table public.events enable row level security;
alter table public.event_age_sessions enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;
alter table public.development_reports enable row level security;
alter table public.documentations enable row level security;
alter table public.questionnaires enable row level security;
alter table public.articles enable row level security;
alter table public.promos enable row level security;
alter table public.partnerships enable row level security;

-- ---------- helper: role pemanggil ----------
create or replace function public.my_role()
returns text language sql stable as $$
  select role from public.profiles where id = auth.uid()
$$;

-- ---------- profiles ----------
create policy "pengguna baca profil sendiri"
  on public.profiles for select using (id = auth.uid());
create policy "owner baca semua profil"
  on public.profiles for select using (public.my_role() = 'owner');

-- ---------- konten publik (baca bebas) ----------
create policy "publik baca sesi aktif"
  on public.class_sessions for select using (is_active = true);
create policy "publik baca event"
  on public.events for select using (true);
create policy "publik baca sesi usia event"
  on public.event_age_sessions for select using (true);
create policy "publik baca artikel terbit"
  on public.articles for select using (is_published = true);
create policy "publik baca promo aktif"
  on public.promos for select using (is_active = true);

-- ---------- tulis: hanya guru/owner (via service_role dari API) ----------
-- Tidak ada policy insert/update/delete untuk anon di tabel operasional;
-- semua tulis lewat API routes yang memakai service_role key.

-- ---------- data anak: hanya pemiliknya ----------
create policy "ortu baca data anaknya"
  on public.children for select using (parent_id = auth.uid());
create policy "guru/owner baca semua anak"
  on public.children for select using (public.my_role() in ('teacher','owner'));

create policy "ortu baca laporan anaknya"
  on public.development_reports for select using (
    child_id in (select id from public.children where parent_id = auth.uid())
  );
create policy "guru/owner baca semua laporan"
  on public.development_reports for select using (public.my_role() in ('teacher','owner'));

create policy "ortu baca dokumentasi anaknya"
  on public.documentations for select using (
    child_id in (select id from public.children where parent_id = auth.uid())
  );
create policy "guru/owner baca semua dokumentasi"
  on public.documentations for select using (public.my_role() in ('teacher','owner'));

-- ---------- pendaftaran: tamu boleh insert (tanpa auth) ----------
create policy "tamu boleh mendaftar"
  on public.registrations for insert with check (true);
create policy "ortu baca pendaftaran anaknya"
  on public.registrations for select using (
    child_id in (select id from public.children where parent_id = auth.uid())
  );
create policy "guru/owner baca semua pendaftaran"
  on public.registrations for select using (public.my_role() in ('teacher','owner'));

-- ---------- kerjasama: tamu boleh insert ----------
create policy "tamu boleh mengajukan kerjasama"
  on public.partnerships for insert with check (true);
create policy "owner baca pengajuan"
  on public.partnerships for select using (public.my_role() = 'owner');
