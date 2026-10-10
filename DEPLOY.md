# Deploy ke Vercel + domain zielkidsclub.com

Dilakukan setelah: repo GitHub `zielkidsclub-web` terisi & project Supabase aktif.

## 1. Sambungkan repo ke Vercel

1. Buka https://vercel.com → sign in (bisa pakai akun GitHub eliya313).
2. **Add New → Project** → pilih repo `zielkidsclub-web` → **Import**.
3. Framework otomatis terdeteksi **Next.js**. Biarkan build command default.
4. Buka **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (jangan pakai prefix NEXT_PUBLIC)
5. **Deploy**. Tunggu ±2 menit → dapat URL `zielkidsclub-web.vercel.app`.

## 2. Pasang domain zielkidsclub.com

1. Di dashboard project Vercel → **Settings → Domains** → tambah `zielkidsclub.com` dan `www.zielkidsclub.com`.
2. Vercel menampilkan instruksi DNS. Umumnya:
   - `A` record `@` → `76.76.21.21`, atau
   - `CNAME` record `www` → `cname.vercel-dns.com`.
3. Atur di tempat domain dibeli (registrar). Propagasi ±5 menit–24 jam.
4. Vercel otomatis menerbitkan sertifikat SSL (HTTPS).

## 3. Verifikasi go-live

- [ ] https://zielkidsclub.com terbuka, logo & QRIS tampil
- [ ] Halaman Event, Artikel, Promo memuat data
- [ ] Wizard /jadwal sampai ringkasan pembayaran
- [ ] Login di /masuk dengan akun owner → redirect ke /owner
- [ ] Portal Guru: tambah/ubah/hapus event tersimpan permanen (cek di Supabase Table Editor)

## 4. Setelah go-live

- Jalankan `supabase/rls.sql` (hardening keamanan).
- Buat akun guru via Portal Owner → Kelola Akses Guru.
- Isi konten awal: event, artikel, promo via portal (tersimpan di database).
