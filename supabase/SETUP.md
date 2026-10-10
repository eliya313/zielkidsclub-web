# Panduan Setup Supabase — Ziel Kids Club Webapp

Langkah ini dilakukan sekali oleh Bos di browser (±10 menit).
Setelah selesai, berikan ke Eliya: **Project URL**, **anon key**, dan **service_role key**.

## 1. Buat project

1. Buka https://supabase.com/dashboard → Sign in (bisa pakai akun GitHub eliya313).
2. **New project** → nama: `zielkidsclub` → pilih region **Singapore (Southeast Asia)** → buat password database yang kuat → **Create new project**.
3. Tunggu ±2 menit sampai project aktif.

## 2. Jalankan schema database

1. Di dashboard Supabase, buka **SQL Editor** → **New query**.
2. Buka file `supabase/schema.sql` di repo `zielkidsclub-web`, salin seluruh isinya, tempel ke SQL Editor.
3. **Run**. Harusnya muncul "Success" tanpa error.
4. Cek di **Table Editor**: tabel `profiles`, `children`, `programs`, `class_sessions`, `events`, `event_age_sessions`, `registrations`, `payments`, `development_reports`, `documentations`, `questionnaires`, `articles`, `promos`, `partnerships` sudah ada, dan `programs` sudah terisi 4 baris.

## 3. Buat bucket storage (untuk flyer event & foto dokumentasi)

1. Buka **Storage** → **New bucket**:
   - Nama: `flyers`, **Public** = ON (flyer tampil di web publik).
   - Nama: `docs`, **Public** = OFF (foto dokumentasi anak hanya via API).
2. Selesai.

## 4. Ambil API keys

1. Buka **Project Settings** (ikon gear) → **API**.
2. Salin tiga nilai ini:
   - **Project URL** → `https://xyzcompany.supabase.co`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (klik Reveal untuk melihat; sifatnya rahasia, jangan dibagikan ke siapa pun / jangan commit ke repo)

## 5. Serahkan ke Eliya

Kirim ketiga nilai di atas ke chat. Eliya akan:
- Menyimpannya sebagai environment variable (tidak disimpan di file/memory chat),
- Membuat akun **owner** pertama,
- Mengaktifkan login asli di `/masuk` dan mematikan mode demo.

## 6. (Opsional, nanti) Aktifkan RLS

Schema menyertakan catatan RLS. Untuk tahap awal, API routes sudah membatasi
akses per role di level aplikasi. RLS diaktifkan bertahap sebelum go-live
penuh — Eliya yang kerjakan.
