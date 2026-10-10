"use client";

import { useState } from "react";
import {
  SectionHeading,
  CtaButton,
  Badge,
  Price,
  EmptyState,
} from "@/components/ui";
import { OBSERVATION_DOMAINS } from "@/lib/site";

/* Nilai contoh untuk 9 ranah observasi (rentang 60-90). */
const CONTOH_NILAI: Record<string, number> = {
  gross_motor: 78,
  fine_motor: 72,
  sensory: 85,
  attention: 64,
  language: 81,
  socio_emotional: 88,
  independence: 76,
  executive_function: 62,
  adaptive: 90,
};

const CONTOH_SESI = [
  {
    kelas: "Kelas Sensory Play",
    tanggal: "Senin, 12 Oktober 2026",
    jam: "08:00-09:30",
  },
  {
    kelas: "Kelas Practical Life",
    tanggal: "Rabu, 14 Oktober 2026",
    jam: "08:00-09:30",
  },
  {
    kelas: "Circle Time dan Art",
    tanggal: "Jumat, 16 Oktober 2026",
    jam: "10:00-11:30",
  },
];

const CONTOH_GALERI = [
  { kegiatan: "Bermain sensorik", gradasi: "from-sage-200 to-cream-200" },
  { kegiatan: "Melatih motorik halus", gradasi: "from-cream-200 to-mustard-100" },
  { kegiatan: "Waktu lingkaran", gradasi: "from-sage-100 to-sage-300" },
  { kegiatan: "Seni dan prakarya", gradasi: "from-mustard-100 to-cream-300" },
  { kegiatan: "Keterampilan hidup praktis", gradasi: "from-cream-200 to-sage-200" },
  { kegiatan: "Bermain peran", gradasi: "from-sage-200 to-mustard-100" },
];

/* Ikon SVG inline */
function IkonKalender({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IkonJam({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IkonFoto({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IkonInfo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IkonKeluar({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IkonCek({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PortalOrangTua() {
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [masuk, setMasuk] = useState(false);
  const [galat, setGalat] = useState("");

  const [rating, setRating] = useState<number | null>(null);
  const [komentar, setKomentar] = useState("");
  const [galatKuisioner, setGalatKuisioner] = useState("");
  const [terkirim, setTerkirim] = useState(false);

  function handleMasuk(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim() || !kode.trim()) {
      setGalat("Nama orang tua dan kode anak wajib diisi.");
      return;
    }
    setGalat("");
    setMasuk(true);
  }

  function handleKeluar() {
    setMasuk(false);
    setNama("");
    setKode("");
    setGalat("");
    setRating(null);
    setKomentar("");
    setGalatKuisioner("");
    setTerkirim(false);
  }

  function handleKirimKuisioner(e: React.FormEvent) {
    e.preventDefault();
    if (rating === null) {
      setGalatKuisioner("Pilih nilai 1 sampai 5 terlebih dahulu.");
      return;
    }
    setGalatKuisioner("");
    setTerkirim(true);
  }

  function ulangiKuisioner() {
    setRating(null);
    setKomentar("");
    setTerkirim(false);
  }

  /* ---------- FORM MASUK DEMO ---------- */
  if (!masuk) {
    return (
      <main className="bg-cream-50 px-4 py-16 text-bark-900">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-bark-500/20 bg-cream-100 p-8 shadow-sm">
            <div className="mb-4 flex justify-center">
              <Badge>Demo</Badge>
            </div>
            <SectionHeading
              title="Portal Orang Tua"
              subtitle="Pantau jadwal sesi, dokumentasi kegiatan, dan perkembangan anak dalam satu tempat."
            />
            <p className="mt-4 rounded-2xl bg-mustard-100 px-4 py-3 text-sm leading-relaxed text-bark-800">
              Halaman ini adalah demo. Isi nama dan kode apa pun yang tidak
              kosong untuk masuk. Tidak ada pemeriksaan identitas sungguhan di
              sini.
            </p>
            <form onSubmit={handleMasuk} className="mt-6 space-y-4" noValidate={false}>
              <div>
                <label htmlFor="nama-ortu" className="mb-1 block text-sm font-bold text-bark-800">
                  Nama orang tua
                </label>
                <input
                  id="nama-ortu"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="cth: Ayu Najiba"
                  aria-invalid={galat ? true : undefined}
                  aria-describedby={galat ? "galat-masuk" : undefined}
                  className="w-full rounded-xl border border-bark-500/30 bg-cream-50 px-4 py-3 text-bark-900 placeholder:text-bark-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-600"
                />
              </div>
              <div>
                <label htmlFor="kode-anak" className="mb-1 block text-sm font-bold text-bark-800">
                  Kode anak
                </label>
                <input
                  id="kode-anak"
                  type="text"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="cth: ZKC-001"
                  aria-invalid={galat ? true : undefined}
                  aria-describedby={galat ? "galat-masuk" : undefined}
                  className="w-full rounded-xl border border-bark-500/30 bg-cream-50 px-4 py-3 text-bark-900 placeholder:text-bark-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-600"
                />
              </div>
              {galat && (
                <p id="galat-masuk" role="alert" className="text-sm font-bold text-terracotta-700">
                  {galat}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-[1px] hover:bg-terracotta-600 active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-700"
              >
                Masuk (Demo)
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  /* ---------- DASHBOARD ---------- */
  return (
    <main className="bg-cream-50 px-4 py-12 text-bark-900">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3">
              <Badge>Data contoh</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-bark-900 md:text-4xl">
              Halo, {nama.trim()}!
            </h1>
            <p className="mt-2 text-sm text-bark-700">
              Kode anak: <span className="font-bold">{kode.trim()}</span>
            </p>
            <p className="mt-1 max-w-[65ch] text-sm text-bark-700">
              Seluruh jadwal, foto, angka, dan laporan di halaman ini adalah
              data contoh untuk keperluan demo.
            </p>
          </div>
          <button
            type="button"
            onClick={handleKeluar}
            className="inline-flex items-center gap-2 rounded-full border-2 border-bark-700 px-5 py-2.5 text-sm font-bold text-bark-800 transition-colors hover:bg-bark-700 hover:text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-600"
          >
            <IkonKeluar />
            Keluar
          </button>
        </div>

        {/* (a) Jadwal sesi anak */}
        <section aria-labelledby="judul-jadwal" className="mb-12">
          <div className="mb-5">
            <SectionHeading
              align="left"
              title="Jadwal Sesi Anak"
              subtitle="Tiga sesi berikutnya untuk anak Anda (data contoh)."
            />
          </div>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {CONTOH_SESI.map((sesi) => (
              <li
                key={sesi.kelas}
                className="rounded-2xl border border-bark-500/20 bg-cream-100 p-5"
              >
                <p className="font-display text-lg font-bold text-bark-900">
                  {sesi.kelas}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-bark-700">
                  <span className="text-sage-700">
                    <IkonKalender />
                  </span>
                  {sesi.tanggal}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-bark-700">
                  <span className="text-sage-700">
                    <IkonJam />
                  </span>
                  Pukul {sesi.jam} WIB
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* (b) Galeri dokumentasi */}
        <section aria-labelledby="judul-galeri" className="mb-12">
          <div className="mb-5">
            <SectionHeading
              align="left"
              title="Galeri Dokumentasi"
              subtitle="Cuplikan kegiatan anak selama sesi (gambar contoh)."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTOH_GALERI.map((item) => (
              <figure
                key={item.kegiatan}
                className="overflow-hidden rounded-2xl border border-bark-500/20 bg-cream-100"
              >
                <div
                  className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${item.gradasi}`}
                  role="img"
                  aria-label={`Gambar contoh kegiatan: ${item.kegiatan}`}
                >
                  <span className="text-sage-700">
                    <IkonFoto />
                  </span>
                </div>
                <figcaption className="px-4 py-3 text-sm font-bold text-bark-800">
                  {item.kegiatan}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* (c) Laporan perkembangan */}
        <section aria-labelledby="judul-laporan" className="mb-12">
          <div className="mb-5">
            <SectionHeading
              align="left"
              title="Laporan Perkembangan"
              subtitle="Hasil observasi guru selama program, per ranah (nilai contoh)."
            />
          </div>
          <div className="rounded-2xl border border-bark-500/20 bg-cream-100 p-6">
            <ul className="space-y-4">
              {OBSERVATION_DOMAINS.map((domain) => {
                const nilai = CONTOH_NILAI[domain.key] ?? 0;
                return (
                  <li key={domain.key}>
                    <div className="mb-1 flex items-center justify-between gap-4">
                      <span className="text-sm font-bold text-bark-800">
                        {domain.label}
                      </span>
                      <span className="text-sm font-bold text-sage-700">
                        {nilai}%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={domain.label}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={nilai}
                      className="h-3 w-full overflow-hidden rounded-full bg-bark-500/15"
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sage-500 to-sage-700"
                        style={{ width: `${nilai}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 flex items-start gap-2 rounded-2xl bg-sage-100 px-4 py-3 text-sm leading-relaxed text-sage-800">
              <span className="mt-0.5 shrink-0">
                <IkonInfo />
              </span>
              Pemetaan kebutuhan dalam program, bukan diagnosis.
            </p>
          </div>
        </section>

        {/* (d) Kuisioner */}
        <section aria-labelledby="judul-kuisioner" className="mb-12">
          <div className="mb-5">
            <SectionHeading
              align="left"
              title="Kuisioner Orang Tua"
              subtitle="Ceritakan pengalaman Anda mengikuti program minggu ini."
            />
          </div>
          <div className="rounded-2xl border border-bark-500/20 bg-cream-100 p-6">
            {terkirim ? (
              <div className="py-6 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sage-600 text-white">
                  <IkonCek />
                </span>
                <p className="font-display text-xl font-bold text-bark-900">
                  Terima kasih atas masukannya!
                </p>
                <p className="mx-auto mt-2 max-w-[55ch] text-sm text-bark-700">
                  Jawaban Anda sudah kami terima. Ini halaman demo, jadi
                  jawaban tidak dikirim atau disimpan di mana pun.
                </p>
                <button
                  type="button"
                  onClick={ulangiKuisioner}
                  className="mt-5 rounded-full border-2 border-bark-700 px-5 py-2.5 text-sm font-bold text-bark-800 transition-colors hover:bg-bark-700 hover:text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-600"
                >
                  Isi kuisioner lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleKirimKuisioner}>
                <fieldset>
                  <legend className="mb-3 text-sm font-bold text-bark-800">
                    Secara umum, seberapa puas Anda dengan kegiatan anak minggu
                    ini? (1 = kurang puas, 5 = sangat puas)
                  </legend>
                  <div
                    className="flex flex-wrap gap-3"
                    role="radiogroup"
                    aria-label="Nilai kepuasan 1 sampai 5"
                  >
                    {[1, 2, 3, 4, 5].map((angka) => (
                      <label
                        key={angka}
                        className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 text-base font-bold transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-terracotta-600 ${
                          rating === angka
                            ? "border-terracotta-600 bg-terracotta-500 text-white"
                            : "border-bark-500/40 bg-cream-50 text-bark-800 hover:border-terracotta-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={angka}
                          checked={rating === angka}
                          onChange={() => setRating(angka)}
                          className="sr-only"
                        />
                        <span aria-hidden="true">{angka}</span>
                        <span className="sr-only">Nilai {angka} dari 5</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="mt-5">
                  <label
                    htmlFor="komentar"
                    className="mb-1 block text-sm font-bold text-bark-800"
                  >
                    Komentar atau saran (opsional)
                  </label>
                  <textarea
                    id="komentar"
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    rows={4}
                    placeholder="Tulis kesan, pertanyaan, atau saran Anda di sini"
                    className="w-full rounded-xl border border-bark-500/30 bg-cream-50 px-4 py-3 text-bark-900 placeholder:text-bark-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-600"
                  />
                </div>
                {galatKuisioner && (
                  <p role="alert" className="mt-3 text-sm font-bold text-terracotta-700">
                    {galatKuisioner}
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-5 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-[1px] hover:bg-terracotta-600 active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-700"
                >
                  Kirim Kuisioner
                </button>
              </form>
            )}
          </div>
        </section>

        {/* (e) Perpanjang paket */}
        <section aria-labelledby="judul-paket" className="mb-12">
          <div className="mb-5">
            <SectionHeading
              align="left"
              title="Perpanjang Paket"
              subtitle="Lanjutkan keikutsertaan anak pada periode berikutnya."
            />
          </div>
          <div className="rounded-2xl border border-bark-500/20 bg-cream-100 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-bark-700">Contoh: Paket 8 sesi</p>
                <p className="mt-1 text-lg">
                  <Price idr={1200000} />
                </p>
                <p className="mt-1 text-xs text-bark-700">
                  Harga contoh untuk keperluan demo.
                </p>
              </div>
              <CtaButton href="/jadwal">Perpanjang Paket</CtaButton>
            </div>
            <div className="mt-6">
              <EmptyState
                title="Belum ada riwayat perpanjangan"
                hint="Contoh tampilan saat data riwayat masih kosong."
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
