import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi Ziel Kids Club: data apa yang kami kumpulkan, untuk apa, dan bagaimana kami melindunginya.",
};

const SECTIONS = [
  {
    title: "Data yang kami kumpulkan",
    body: [
      "Saat Anda mendaftar trial class, kelas, event, atau menghubungi kami lewat WhatsApp, kami mencatat data yang Anda berikan secara sukarela: nama anak, tanggal lahir anak, nama orang tua, nomor telepon/WhatsApp, dan catatan tambahan yang Anda tulis di formulir.",
      "Kami tidak mengumpulkan data selain yang Anda berikan sendiri, dan tidak menggunakan pelacak iklan pihak ketiga di situs ini.",
    ],
  },
  {
    title: "Untuk apa data digunakan",
    body: [
      "Data digunakan semata-mata untuk keperluan operasional: memproses pendaftaran, mengatur jadwal dan kuota kelas, mengirim pengingat atau informasi kegiatan, serta berkomunikasi mengenai layanan kami.",
    ],
  },
  {
    title: "Penyimpanan dan keamanan",
    body: [
      "Data tersimpan di database layanan kami dengan akses terbatas hanya untuk tim internal yang membutuhkannya (admin, guru, dan owner). Kami mengambil langkah yang wajar untuk melindungi data dari akses yang tidak sah.",
    ],
  },
  {
    title: "Tidak dibagikan ke pihak ketiga",
    body: [
      "Kami tidak menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk keperluan pemasaran. Data hanya dibagikan bila diwajibkan oleh hukum yang berlaku.",
    ],
  },
  {
    title: "Hak Anda",
    body: [
      "Anda berhak meminta salinan, koreksi, atau penghapusan data pribadi Anda yang kami simpan. Hubungi admin kami lewat WhatsApp yang tercantum di situs ini untuk mengajukan permintaan tersebut.",
    ],
  },
  {
    title: "Perubahan kebijakan",
    body: [
      "Kebijakan ini dapat diperbarui dari waktu ke waktu mengikuti perkembangan layanan kami. Versi terbaru selalu tersedia di halaman ini.",
    ],
  },
];

export default function KebijakanPrivasi() {
  return (
    <main className="bg-cream-50">
      <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-600">
          Dokumen Legal
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-bark-900 md:text-4xl">
          Kebijakan Privasi
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-bark-700">
          Terakhir diperbarui: Oktober 2026. Kebijakan ini menjelaskan bagaimana{" "}
          {SITE.name} ({SITE.yayasan}) mengelola data pribadi Anda.
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
