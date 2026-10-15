import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan penggunaan layanan Ziel Kids Club: pendaftaran, pembayaran, pembatalan, dan tata tertib.",
};

const SECTIONS = [
  {
    title: "Pendaftaran",
    body: [
      "Pendaftaran trial class, regular class, kelas privat, dan event dilakukan melalui formulir di situs ini atau lewat WhatsApp admin. Pendaftaran dianggap sah setelah dikonfirmasi oleh tim kami.",
      "Data yang Anda isi (nama anak, tanggal lahir, nama orang tua, nomor kontak) harus benar agar kami dapat menghubungi dan melayani Anda dengan baik.",
    ],
  },
  {
    title: "Usia peserta",
    body: [
      "Layanan kami diperuntukkan bagi anak usia 6 bulan hingga 6 tahun. Beberapa program atau event dapat memiliki batasan usia yang lebih spesifik dan akan diinformasikan pada tiap pengumuman.",
    ],
  },
  {
    title: "Pembayaran",
    body: [
      "Biaya program dan event diinformasikan sebelum pendaftaran dikonfirmasi. Pembayaran dilakukan sesuai instruksi yang diberikan tim kami (termasuk via QRIS yang tersedia).",
    ],
  },
  {
    title: "Pembatalan dan penjadwalan ulang",
    body: [
      "Pembatalan atau penjadwalan ulang harap diinformasikan minimal H-1 melalui WhatsApp admin agar kuota dapat dialihkan. Ketentuan pengembalian dana mengikuti kebijakan tiap program dan akan dijelaskan saat pendaftaran.",
    ],
  },
  {
    title: "Tata tertib selama kegiatan",
    body: [
      "Orang tua/wali wajib mendampingi anak selama kegiatan berlangsung kecuali ditentukan lain oleh tim. Demi kenyamanan bersama, harap menjaga kebersihan area, tidak merokok di lingkungan kelas, dan mengikuti arahan tim selama sesi.",
    ],
  },
  {
    title: "Dokumentasi",
    body: [
      "Tim kami terkadang mendokumentasikan kegiatan untuk keperluan arsip dan publikasi (misalnya media sosial). Bila Anda keberatan anak Anda difoto/direkam untuk publikasi, sampaikan kepada tim sebelum sesi dimulai.",
    ],
  },
  {
    title: "Batasan layanan",
    body: [
      "Ziel Kids Club adalah pusat perkembangan anak, bukan klinik terapi dan bukan layanan medis. Observasi dan pendampingan kami tidak menggantikan diagnosis atau penanganan tenaga kesehatan profesional.",
    ],
  },
  {
    title: "Perubahan ketentuan",
    body: [
      "Ketentuan ini dapat diperbarui mengikuti perkembangan layanan. Versi terbaru selalu tersedia di halaman ini.",
    ],
  },
];

export default function SyaratKetentuan() {
  return (
    <main className="bg-cream-50">
      <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-600">
          Dokumen Legal
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-bark-900 md:text-4xl">
          Syarat &amp; Ketentuan
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-bark-700">
          Terakhir diperbarui: Oktober 2026. Dengan menggunakan layanan{" "}
          {SITE.name}, Anda menyetujui ketentuan berikut.
        </p>
        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-bold text-bark-900">
                {s.title}
              </h2>
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="mt-3 text-sm leading-relaxed text-bark-700 md:text-base"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
