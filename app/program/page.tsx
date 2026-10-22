import type { Metadata } from "next";
import Image from "next/image";
import {
  SectionHeading,
  CtaButton,
  Badge,
  EmptyState,
} from "@/components/ui";
import { OBSERVATION_DOMAINS } from "@/lib/site";
import PackagePicker from "./package-picker";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Program",
  description:
    "Program Ziel Kids Club Malang untuk anak usia 6 bulan - 6 tahun: Trial Class, Regular Class, Pop Up Class / Playdate, dan Privat.",
};

type DomainKey = (typeof OBSERVATION_DOMAINS)[number]["key"];

const DOMAIN_NOTES: Record<DomainKey, string> = {
  gross_motor:
    "Kami mengamati cara anak bergerak bebas, menjaga keseimbangan, dan mengoordinasikan tubuhnya saat bermain.",
  fine_motor:
    "Kami memperhatikan genggaman, ketelitian, dan koordinasi kedua tangan anak saat beraktivitas.",
  sensory:
    "Kami mengamati respons anak terhadap tekstur, suara, cahaya, dan gerakan dalam aktivitas sensori.",
  attention:
    "Kami melihat durasi dan cara anak menjaga fokus saat mengikuti sebuah aktivitas.",
  language:
    "Kami mengamati kosakata, ungkapan, dan cara anak berkomunikasi dua arah dengan orang lain.",
  socio_emotional:
    "Kami memperhatikan cara anak mengekspresikan emosi dan berinteraksi dengan teman serta guru.",
  independence:
    "Kami melihat kemampuan anak merawat diri dan menyelesaikan tugas sederhana secara mandiri.",
  executive_function:
    "Kami mengamati kemampuan anak menunggu giliran, mengikuti langkah, dan berpindah aktivitas.",
  adaptive:
    "Kami memperhatikan bagaimana anak menyesuaikan diri dengan rutinitas dan situasi baru.",
};

function IconEye(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCalendar(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M8 14h3M8 17h5" />
    </svg>
  );
}

function IconSparkle(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function IconUser(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  );
}

function IconCheck(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export default function ProgramPage() {
  const faqs = [
    {
      q: "Usia berapa anak bisa mengikuti program di Ziel Kids Club?",
      a: "Program kami terbuka untuk anak usia 6 bulan hingga 6 tahun. Setiap kelompok usia mendapat aktivitas yang disesuaikan dengan tahap perkembangannya.",
    },
    {
      q: "Di mana lokasi Ziel Kids Club?",
      a: "Ziel Kids Club berlokasi di Malang, Jawa Timur. Alamat lengkap dan petunjuk arah diberikan admin saat pendaftaran.",
    },
    {
      q: "Bagaimana cara mendaftar Trial Class?",
      a: "Pendaftaran dilakukan lewat halaman Jadwal di website ini dalam 4 langkah: pilih jenis kelas, pilih sesi, isi data anak dan orang tua, lalu konfirmasi pembayaran via WhatsApp ke admin.",
    },
    {
      q: "Apakah orang tua boleh ikut mendampingi di kelas?",
      a: "Pada Pop Up Class / Playdate, orang tua ikut bermain bersama anak. Untuk Trial Class dan Regular Class, mekanisme pendampingan dijelaskan admin saat pendaftaran.",
    },
    {
      q: "Berapa biaya programnya?",
      a: "Biaya berbeda untuk tiap program dan event. Hubungi admin via WhatsApp di +62-851-1762-3313 untuk info biaya terkini.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-cream-50">
      {/* 1. Header halaman */}
      <section className="mx-auto max-w-4xl px-5 pb-12 pt-14 text-center md:pt-20">
        <Badge>Program Kami</Badge>
        <h1 className="mt-4 font-display text-4xl font-bold text-bark-900 md:text-5xl">
          Program Ziel Kids Club
        </h1>
        <p className="mx-auto mt-4 max-w-[65ch] text-base leading-relaxed text-bark-700 md:text-lg">
          Empat cara anak belajar dan berkembang bersama kami, dari sesi
          perkenalan pertama hingga kelas privat yang personal. Setiap program
          dimulai dari observasi, bukan dari asumsi.
        </p>
      </section>

      {/* 2a. Trial Class */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-bark-500/15">
          <div className="relative h-56 md:h-72">
            <Image
              src="/illustrations/ilus-07.jpg"
              alt="Balita menuang air ke gelas, aktivitas practical life Montessori"
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            <div className="flex flex-col justify-center bg-mustard-100 p-8 md:p-12">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mustard-400 text-bark-900">
                  <IconEye className="h-6 w-6" />
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-bark-700">
                  Program 01
                </p>
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-bark-900 md:text-4xl">
                Trial Class
              </h2>
              <p className="mt-3 text-base leading-relaxed text-bark-700">
                Sesi perkenalan untuk melihat kecocokan anak dengan lingkungan,
                guru, dan ritme belajar di Ziel Kids Club.
              </p>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <ul className="space-y-3">
                {[
                  "Anak mencoba satu sesi kelas nyata bersama guru",
                  "Orang tua mendapat ringkasan observasi awal",
                  "Diskusi ringan tentang kebutuhan dan kebiasaan anak",
                  "Tanpa komitmen paket apa pun",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                      <IconCheck className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-relaxed text-bark-900 md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CtaButton href="/jadwal">Daftar</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2b. Regular Class */}
      <section className="bg-sage-50 py-14">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            align="left"
            title="Regular Class"
            subtitle="Kelas rutin dengan ritme belajar yang konsisten. Pilih paket sesuai kebutuhan keluarga, dan kami akan memetakan kebutuhan anak dari sesi ke sesi."
          />
          <div className="relative mt-10 overflow-hidden rounded-[1.25rem] shadow-sm ring-1 ring-bark-500/10">
            <Image
              src="/illustrations/ilus-09.jpg"
              alt="Anak-anak bermain bersama dengan riang di kelas"
              width={1200}
              height={600}
              className="h-56 w-full object-cover md:h-72"
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
            <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-bark-500/15">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-600 text-white">
                  <IconCalendar className="h-6 w-6" />
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-sage-700">
                  Program 02
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Jadwal mingguan yang tetap untuk membangun rutinitas",
                  "Observasi berkelanjutan di 9 ranah perkembangan",
                  "Laporan perkembangan berkala untuk orang tua",
                  "Cocok untuk anak usia 6 bulan - 6 tahun",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                      <IconCheck className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-relaxed text-bark-900 md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CtaButton href="/jadwal">Daftar</CtaButton>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-bark-500/15">
              <PackagePicker />
            </div>
          </div>
        </div>
      </section>

      {/* 2c. Pop Up Class / Playdate */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-bark-500/15">
          <div className="relative h-56 md:h-72">
            <Image
              src="/illustrations/ilus-01.jpg"
              alt="Anak-anak bermain sensori bersama dalam Pop Up Class"
              fill
              className="object-cover"
            />
          </div>
          <div className="border-l-8 border-terracotta-500 p-8 md:p-12">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-700">
              <IconSparkle className="h-6 w-6" />
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta-700">
              Program 03
            </p>
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold text-bark-900 md:text-4xl">
            Pop Up Class / Playdate
          </h2>
          <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-bark-700">
            Event tematik yang diadakan berkala, seringkali bersama orang tua.
            Suasana santai untuk bermain, bersosialisasi, dan merasakan
            pendekatan Ziel Kids Club dari dekat.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: "Tema berbeda tiap sesi",
                text: "Setiap edisi punya tema aktivitas yang dirancang guru untuk kelompok usia.",
              },
              {
                title: "Terbuka untuk umum",
                text: "Tidak perlu menjadi murid reguler untuk ikut serta.",
              },
              {
                title: "Bersama orang tua",
                text: "Orang tua ikut bermain dan melihat langsung cara anak bereksplorasi.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-terracotta-50 p-5"
              >
                <p className="font-bold text-bark-900">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-bark-700">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <EmptyState
              title="Jadwal Pop Up Class berikutnya segera diumumkan"
              hint="Ikuti kanal kami atau hubungi admin untuk info edisi terdekat."
            />
          </div>
          <div className="mt-8">
            <CtaButton href="/jadwal">Daftar</CtaButton>
          </div>
          </div>
        </div>
      </section>

      {/* 2d. Privat */}
      <section className="bg-sage-800 py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-50 text-sage-800">
                  <IconUser className="h-6 w-6" />
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-cream-200">
                  Program 04
                </p>
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-cream-50 md:text-4xl">
                Privat
              </h2>
              <p className="mt-3 max-w-[55ch] text-base leading-relaxed text-cream-200">
                Sesi 1-on-1 antara anak dan guru. Ritme, materi, dan pendekatan
                disesuaikan dengan hasil observasi, sehingga anak berkembang
                dengan cara yang paling nyaman baginya.
              </p>
              <div className="mt-8">
                <CtaButton href="/jadwal">Daftar</CtaButton>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Satu guru mendampingi satu anak penuh selama sesi",
                "Fokus sesuai hasil observasi dan kebutuhan anak",
                "Jadwal fleksibel mengikuti kesepakatan dengan admin",
                "Umpan balik personal untuk orang tua tiap sesi",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-sage-900/60 p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mustard-400 text-bark-900">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-cream-50 md:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Daftar 9 ranah observasi */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <SectionHeading
          align="left"
          title="9 Ranah Observasi"
          subtitle="Di setiap program, kami mengamati dan memetakan kebutuhan anak pada sembilan ranah perkembangan. Hasil observasi menjadi dasar cara kami merespons, bukan label untuk anak."
        />
        <ol className="mt-10 grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {OBSERVATION_DOMAINS.map((domain, i) => (
            <li
              key={domain.key}
              className="flex gap-4 border-t border-bark-500/20 py-5"
            >
              <span className="font-display text-base font-bold text-terracotta-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-bark-900">
                  {domain.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-bark-700">
                  {DOMAIN_NOTES[domain.key]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Prinsip */}
      <section className="bg-bark-900 py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <Badge>Prinsip Kami</Badge>
          <blockquote className="mt-6 space-y-4 font-display text-2xl font-bold leading-snug text-cream-50 md:text-4xl">
            <p>&ldquo;Observe First.&rdquo;</p>
            <p>&ldquo;Understand Before Responding.&rdquo;</p>
            <p className="text-mustard-300">
              &ldquo;Regulation Before Academics.&rdquo;
            </p>
          </blockquote>
          <p className="mx-auto mt-6 max-w-[60ch] text-base leading-relaxed text-cream-200">
            Kami mengamati dulu, memahami kebutuhan anak sebelum merespons, dan
            memastikan anak merasa aman serta teregulasi sebelum diajak
            belajar hal akademis.
          </p>
        </div>
      </section>

      <JsonLd data={faqSchema} />

      {/* 4b. FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <SectionHeading
          align="left"
          title="Pertanyaan yang sering ditanyakan"
          subtitle="Jawaban singkat untuk hal-hal yang paling sering ditanyakan orang tua."
        />
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-[1.25rem] bg-white p-5 shadow-sm ring-1 ring-bark-500/10"
            >
              <summary className="cursor-pointer font-bold text-bark-900 marker:text-terracotta-600">
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-bark-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 5. CTA penutup */}
      <section className="mx-auto max-w-4xl px-5 py-16 text-center">
        <SectionHeading
          title="Siap memulai langkah pertama?"
          subtitle="Pilih program yang paling sesuai, atau mulai dari Trial Class untuk merasakan langsung pengalaman belajar di Ziel Kids Club."
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton href="/jadwal">Daftar Sekarang</CtaButton>
          <CtaButton href="/jadwal" variant="outline">
            Lihat Jadwal Kelas
          </CtaButton>
        </div>
      </section>
    </div>
  );
}
