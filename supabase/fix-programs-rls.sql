-- Perbaikan: aktifkan RLS di public.programs (tabel katalog program ZKC)
-- Konteks: Supabase Security Advisor (email 14 Okt 2026, 04:53 WIB) menandai
-- "Critical issue - Table publicly accessible - rls_disabled_in_public" di
-- proyek zielkidsclub. Dari 14 tabel di schema.sql, public.programs adalah
-- satu-satunya yang TIDAK di-enable RLS-nya di rls.sql.
-- Jalankan di: Supabase Dashboard > proyek zielkidsclub > SQL Editor.
-- Aman untuk situs yang live: tidak ada kode aplikasi yang membaca tabel ini
-- saat ini, dan API routes memakai service_role (bypass RLS by design).

alter table public.programs enable row level security;

create policy "publik baca program aktif"
  on public.programs for select using (is_active = true);

-- Verifikasi: Database > Advisors — peringatan rls_disabled_in_public harus hilang.
