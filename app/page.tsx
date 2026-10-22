import Image from "next/image";
import Link from "next/link";
import {
  SectionHeading,
  CtaButton,
  Badge,
  Price,
  EmptyState,
} from "@/components/ui";
import {
  SITE,
  waLink,
  EVENT_CATEGORIES,
  ARTICLE_CATEGORIES,
  ARTICLE_COVERS,
  OBSERVATION_DOMAINS,
} from "@/lib/site";
import { getUpcomingEvents, getArticles } from "@/lib/api";
import { VideoTestimonialCard } from "./video-modal";
import JsonLd from "@/components/JsonLd";

const VIDEO_THEMES = [
  {
    card: "bg-terracotta-50 ring-terracotta-500/15",
    play: "bg-terracotta-500 hover:bg-terracotta-600 focus-visible:outline-terracotta-500",
    mark: "text-terracotta-300",
    chip: "bg-terracotta-100 text-terracotta-600",
    radius: "rounded-3xl",
  },
  {
    card: "bg-sage-100/70 ring-sage-500/15",
    play: "bg-sage-600 hover:bg-sage-700 focus-visible:outline-sage-600",
    mark: "text-sage-300",
    chip: "bg-sage-200/70 text-sage-700",
    radius: "rounded-tl-[2.25rem] rounded-tr-xl rounded-br-[2.25rem] rounded-bl-xl",
  },
  {
    card: "bg-mustard-100/70 ring-mustard-500/20",
    play: "bg-mustard-600 hover:bg-mustard-700 focus-visible:outline-mustard-600",
    mark: "text-mustard-400",
    chip: "bg-mustard-200/70 text-mustard-700",
    radius: "rounded-[1.75rem]",
  },
];

const VIDEO_TESTIMONIALS = [
  {
    name: "Bunda Rania",
    duration: "1:12",
    quote:
      "Anak saya yang dulu pemalu sekarang berani menyapa dan bermain bersama teman-temannya.",
  },
  {
    name: "Ayah Dimas",
    duration: "0:58",
    quote:
      "Setiap pulang kelas ada cerita baru. Kami jadi tahu cara menemaninya belajar di rumah.",
  },
  {
    name: "Bunda Salsa",
    duration: "1:31",
    quote:
      "Timnya sabar dan komunikatif. Kami selalu tahu apa yang dikerjakan anak di kelas.",
  },
];

const TEXT_TESTIMONIALS = [
  {
    quote:
      "Trial class-nya bikin anak saya langsung betah. Pulang-pulang dia cerita terus tentang permainannya.",
    name: "Bunda Nadia",
    role: "Ibu dari anak usia 2 tahun",
  },
  {
    quote:
      "Gurunya sabar sekali. Anak saya yang tadinya susah diajak kegiatan sekarang lebih tenang mengikuti kelas.",
    name: "Ayah Yoga",
    role: "Ayah dari anak usia 3 tahun",
  },
  {
    quote:
      "Tempatnya bersih, aman, dan hangat. Sebagai orang tua baru, kami merasa sangat terbantu.",
    name: "Bunda Fitri",
    role: "Ibu dari anak usia 18 bulan",
  },
];

const PROGRAMS = [
  {
    title: "Trial Class",
    desc: "Sesi perkenalan 60 menit untuk merasakan suasana kelas sebelum bergabung.",
    icon: (
      <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5z" />
    ),
    tile: "bg-terracotta-100 text-terracotta-600",
    link: "text-terracotta-600",
    radius: "rounded-3xl",
  },
  {
    title: "Regular Class",
    desc: "Kelas rutin dengan aktivitas yang disesuaikan tahap perkembangan anak.",
    icon: (
      <path d="M16 19v-1.5a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 17.5V19M6 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm11.5 8v-1.5a2.5 2.5 0 0 0-2.5-2.5h-1M14.5 4.6a3.5 3.5 0 0 1 0 6.8" />
    ),
    tile: "bg-sage-100 text-sage-700",
    link: "text-sage-700",
    radius: "rounded-tl-[2.25rem] rounded-tr-xl rounded-br-[2.25rem] rounded-bl-xl",
  },
  {
    title: "Pop Up Class / Playdate",
    desc: "Kelas tematik dan playdate seru untuk eksplorasi bersama keluarga.",
    icon: (
      <path d="M12 20.5S3.5 15.4 3.5 9.6A4.6 4.6 0 0 1 8.1 5c1.6 0 3 .9 3.9 2.2A4.6 4.6 0 0 1 15.9 5a4.6 4.6 0 0 1 4.6 4.6c0 5.8-8.5 10.9-8.5 10.9z" />
    ),
    tile: "bg-mustard-100 text-mustard-700",
    link: "text-mustard-700",
    radius: "rounded-[1.75rem]",
  },
  {
    title: "Kelas Privat",
    desc: "Pendampingan satu lawan satu dengan jadwal yang fleksibel.",
    icon: (
      <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6L12 16.7l-5.4 2.9 1.1-6L3.2 9.4l6.1-.8L12 3z" />
    ),
    tile: "bg-cream-200 text-bark-700",
    link: "text-bark-800",
    radius: "rounded-tl-xl rounded-tr-[2.25rem] rounded-br-xl rounded-bl-[2.25rem]",
  },
];

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatTanggal(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_ID[m - 1]} ${y}`;
}

function labelOf(
  list: readonly { slug: string; label: string }[],
  slug: string
): string {
  return list.find((c) => c.slug === slug)?.label ?? slug;
}

function IconCal({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

function IconPin({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.6 12 21 12 21z" />
      <circle cx="12" cy="10.8" r="2.3" />
    </svg>
  );
}

function IconArrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default async function Home() {
  const evts = await getUpcomingEvents();
  const evt = evts[0];
  const articles = (await getArticles()).slice(0, 3);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "ChildCare",
    "@id": "https://zielkidsclub.com/#organisasi",
    name: "Ziel Kids Club",
    description:
      "Pusat perkembangan dan pembelajaran awal untuk anak usia 6 bulan hingga 6 tahun di Malang. Program: Trial Class, Regular Class, Pop Up Class/Playdate, dan Privat dengan pendekatan Montessori.",
    url: "https://zielkidsclub.com/",
    logo: "https://zielkidsclub.com/logo-zkc.png",
    image: "https://zielkidsclub.com/illustrations/ilus-08.jpg",
    telephone: "+62-851-1762-3313",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Malang",
      addressRegion: "Jawa Timur",
      addressCountry: "ID",
    },
    sameAs: [SITE.instagram, SITE.threads],
    parentOrganization: {
      "@type": "Organization",
      name: SITE.yayasan,
    },
  };

  return (
    <main>
      <JsonLd data={orgSchema} />
      {/* 1. HERO */}
      <section className="texture-paper relative overflow-hidden bg-cream-50">
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-10 pt-12 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-600">
              Child Development &amp; Early Learning Center - Malang
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.15] text-bark-900 md:text-[3.4rem] md:leading-[1.08]">
              Anak Tumbuh <em className="text-terracotta-600">Bahagia</em>{" "}
              Sejak Dini
            </h1>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-bark-700 md:text-lg">
              Ruang hangat untuk anak 6 bulan hingga 6 tahun belajar dan
              bermain sesuai ritmenya, didampingi tim berpengalaman.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton href="/jadwal">Daftar Sekarang</CtaButton>
              <CtaButton href="/program" variant="outline">
                Lihat Program
              </CtaButton>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-sm bg-mustard-300"
            />
            <div className="relative -rotate-1 rounded-sm bg-white p-2.5 pb-3 shadow-md ring-1 ring-bark-500/10">
              <div className="relative overflow-hidden rounded-[2px]">
                <Image
                  src="/illustrations/ilus-08.jpg"
                  alt="Guru mendampingi anak-anak bermain dengan mainan kayu di kelas Ziel Kids Club yang hangat"
                  width={800}
                  height={600}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
              <p className="px-1.5 pb-1 pt-3 font-display text-sm italic text-bark-700">
                Bermain, bereksplorasi, bertumbuh. Setiap hari di Ziel Kids
                Club.
              </p>
            </div>
            <div className="absolute -left-3 -top-4 -rotate-6 rounded-full bg-sage-600 px-4 py-2 text-xs font-bold text-white shadow-md md:-left-6">
              Usia 6 bln - 6 thn
            </div>
          </div>
        </div>
        <div className="relative mx-auto max-w-6xl px-5 pb-12">
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-bark-500/20 pt-5 text-sm font-semibold text-bark-700">
            <li>Malang, Jawa Timur</li>
            <li aria-hidden="true" className="text-terracotta-500">•</li>
            <li>Pendekatan Montessori</li>
            <li aria-hidden="true" className="text-terracotta-500">•</li>
            <li>Observasi 9 ranah perkembangan</li>
            <li aria-hidden="true" className="text-terracotta-500">•</li>
            <li>Laporan berkala untuk orang tua</li>
          </ul>
        </div>
      </section>

      {/* 2. BENTO KEUNGGULAN */}
      <section className="bg-cream-100 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            align="left"
            title="Bukan Sekadar Tempat Bermain"
            subtitle="Kami adalah pusat perkembangan anak yang bekerja dengan prinsip jelas: pahami dulu, baru dampingi."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="reveal rounded-[1.25rem] bg-white p-7 shadow-sm ring-1 ring-bark-500/10 md:col-span-2 md:p-8">
              <h3 className="font-display text-2xl font-bold text-bark-900">
                Bukan Daycare, Bukan Klinik Terapi
              </h3>
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-bark-700 md:text-base">
                Ziel Kids Club adalah pusat perkembangan anak, bukan tempat
                penitipan biasa dan bukan klinik terapi. Fokus kami sederhana:
                memahami anak lewat observasi yang cermat, lalu mendampingi
                dengan aktivitas yang tepat untuk tahap perkembangannya.
              </p>
            </div>
            <div className="reveal relative min-h-52 overflow-hidden rounded-[1.25rem] shadow-sm ring-1 ring-bark-500/10">
              <Image
                src="/illustrations/ilus-01.jpg"
                alt="Guru mendampingi tiga balita dalam aktivitas bermain sensori"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="reveal rounded-[1.25rem] bg-mustard-100 p-7 shadow-sm ring-1 ring-mustard-500/20 md:col-span-2 md:p-8">
              <h3 className="font-display text-2xl font-bold text-bark-900">
                9 Ranah Observasi
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bark-700 md:text-base">
                Observasi kami mencakup sembilan ranah perkembangan anak:
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {OBSERVATION_DOMAINS.map((d) => (
                  <li
                    key={d.key}
                    className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-bark-800 shadow-sm"
                  >
                    {d.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal rounded-[1.25rem] bg-sage-600 p-7 text-white shadow-sm md:p-8">
              <h3 className="font-display text-xl font-bold">Observe First</h3>
              <p className="mt-3 text-sm leading-relaxed text-sage-100">
                Sebelum merespons, kami mengamati. Setiap anak dipetakan
                kebutuhannya terlebih dahulu sebelum aktivitas disusun.
              </p>
            </div>
            <div className="reveal rounded-[1.25rem] bg-white p-7 shadow-sm ring-1 ring-bark-500/10 md:col-span-3 md:flex md:items-center md:gap-8 md:p-8">
              <h3 className="font-display text-xl font-bold text-bark-900 md:shrink-0 md:text-2xl">
                Pendampingan Terarah
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bark-700 md:mt-0 md:text-base">
                Hasil observasi menjadi acuan aktivitas tiap anak. Orang tua
                mendapat laporan berkala tentang perkembangannya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROGRAM RINGKAS */}
      <section className="texture-paper bg-cream-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            align="left"
            title="Program untuk Setiap Tahap"
            subtitle="Pilih format yang paling cocok untuk anak dan jadwal keluarga Anda."
          />
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
            <article className="reveal lg:col-span-2">
              <div className="relative overflow-hidden rounded-[1.25rem] shadow-sm ring-1 ring-bark-500/10">
                <Image
                  src="/illustrations/ilus-07.jpg"
                  alt="Balita menuang air ke gelas dalam aktivitas practical life Montessori"
                  width={800}
                  height={500}
                  className="h-52 w-full object-cover lg:h-60"
                />
                <span className="absolute left-4 top-4 rounded-full bg-terracotta-500 px-3 py-1 text-xs font-bold text-white shadow">
                  Mulai dari sini
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-bark-900">
                Trial Class
              </h3>
              <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-bark-700 md:text-base">
                Sesi perkenalan 60 menit untuk merasakan suasana kelas sebelum
                bergabung. Cara paling aman untuk melihat kecocokan anak
                dengan lingkungan dan guru kami.
              </p>
              <Link
                href="/jadwal"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-terracotta-600 transition hover:gap-2.5"
              >
                Daftar Sekarang
                <IconArrow />
              </Link>
            </article>
            <div className="lg:col-span-3">
              {PROGRAMS.slice(1).map((prog, i) => (
                <article
                  key={prog.title}
                  className="reveal group flex items-start gap-5 border-t border-bark-500/20 py-6 transition-colors first:border-t-0 first:pt-0 hover:bg-cream-100/60 lg:px-3"
                >
                  <span className="font-display text-lg font-bold text-terracotta-500">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-bark-900">
                      {prog.title}
                    </h3>
                    <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-bark-700">
                      {prog.desc}
                    </p>
                  </div>
                  <Link
                    href="/program"
                    className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-sage-700 transition group-hover:gap-2.5"
                    aria-label={`Lihat detail program ${prog.title}`}
                  >
                    <span className="hidden sm:inline">Detail</span>
                    <IconArrow />
                  </Link>
                </article>
              ))}
              <p className="mt-2 border-t border-bark-500/20 pt-5 text-sm text-bark-700 lg:px-3">
                Belum yakin program mana yang cocok?{" "}
                <a
                  href={waLink(
                    "Halo Ziel Kids Club, saya ingin konsultasi program yang cocok untuk anak saya."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-terracotta-600 underline decoration-terracotta-300 underline-offset-4 hover:decoration-terracotta-600"
                >
                  Tanya admin lewat WhatsApp
                </a>
                , gratis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BAND EVENT TERDEKAT */}
      <section className="bg-cream-50 pb-12 md:pb-16">
        <div className="mx-auto max-w-6xl px-5">
          {evt ? (
            <div className="grid grid-cols-1 items-center gap-8 rounded-[1.25rem] bg-mustard-100 p-7 shadow-sm ring-1 ring-mustard-500/20 md:p-10 lg:grid-cols-[1fr_auto]">
              <div>
                <Badge>{labelOf(EVENT_CATEGORIES, evt.category)}</Badge>
                <h2 className="mt-3 font-display text-2xl font-bold text-bark-900 md:text-3xl">
                  {evt.name}
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm text-bark-800">
                  <li className="flex items-center gap-2.5">
                    <IconCal className="h-4 w-4 shrink-0 text-terracotta-600" />
                    <span>
                      {formatTanggal(evt.date)} | {evt.startTime} -{" "}
                      {evt.endTime} WIB
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IconPin className="h-4 w-4 shrink-0 text-terracotta-600" />
                    <span>{evt.location}</span>
                  </li>
                </ul>
                <p className="mt-4 text-lg">
                  <Price idr={evt.priceIdr} />
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <CtaButton href="/jadwal">Daftar Sekarang</CtaButton>
                <CtaButton href="/event" variant="outline">
                  Lihat Semua Event
                </CtaButton>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Belum ada event terjadwal"
              hint="Pantau terus, event seru untuk anak dan orang tua segera hadir."
            />
          )}
        </div>
      </section>

      {/* 5. TESTIMONI VIDEO */}
      <section className="bg-cream-100 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            align="left"
            title="Cerita dari Para Orang Tua"
            subtitle="Dengarkan pengalaman mereka membersamai anak di Ziel Kids Club."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {VIDEO_TESTIMONIALS.map((v, i) => (
              <VideoTestimonialCard
                key={v.name}
                name={v.name}
                duration={v.duration}
                quote={v.quote}
                theme={VIDEO_THEMES[i % VIDEO_THEMES.length]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONI TEKS (selingan gelap) */}
      <section className="bg-bark-800 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            dark
            align="left"
            title="Kata Mereka"
            subtitle="Cerita singkat dari orang tua yang mempercayakan buah hatinya kepada kami."
          />
          <figure className="reveal mt-10 max-w-3xl">
            <span
              aria-hidden="true"
              className="font-display text-6xl font-bold leading-none text-mustard-400"
            >
              &ldquo;
            </span>
            <blockquote className="mt-1 font-display text-2xl font-medium leading-snug text-cream-50 md:text-[1.8rem]">
              {TEXT_TESTIMONIALS[0].quote}
            </blockquote>
            <figcaption className="mt-5">
              <p className="font-bold text-cream-50">
                {TEXT_TESTIMONIALS[0].name}
              </p>
              <p className="mt-0.5 text-sm text-cream-200">
                {TEXT_TESTIMONIALS[0].role}
              </p>
            </figcaption>
          </figure>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {TEXT_TESTIMONIALS.slice(1).map((t) => (
              <figure key={t.name} className="reveal border-t border-cream-50/15 pt-6">
                <blockquote className="text-base leading-relaxed text-cream-100">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4">
                  <p className="font-bold text-cream-50">{t.name}</p>
                  <p className="mt-0.5 text-xs text-cream-200">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ARTIKEL TERBARU */}
      <section className="bg-cream-50 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              title="Artikel Terbaru"
              subtitle="Bacaan ringan seputar tumbuh kembang dan parenting dari tim kami."
            />
            <Link
              href="/artikel"
              className="inline-flex items-center gap-1.5 pb-1 text-sm font-bold text-terracotta-600 transition hover:gap-2.5"
            >
              Semua artikel
              <IconArrow />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {articles.map((a) => {
              const cover = ARTICLE_COVERS[a.slug];
              return (
                <Link
                  key={a.slug}
                  href={`/artikel/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-sm ring-1 ring-bark-500/10 transition hover:-translate-y-1 hover:shadow-md"
                >
                  {cover && (
                    <div className="relative h-44 w-full shrink-0 overflow-hidden">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <Badge>
                      {labelOf(ARTICLE_CATEGORIES, a.category)}
                    </Badge>
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug text-bark-900">
                      {a.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-bark-700">
                      {a.excerpt}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-bark-500/15 pt-4">
                      <span className="text-xs font-semibold text-bark-700">
                        {formatTanggal(a.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-terracotta-600 transition group-hover:gap-2.5">
                        Baca
                        <IconArrow />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CTA KERJASAMA */}
      <section className="bg-cream-100 py-14 md:py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <SectionHeading
            title="Mari Berkolaborasi"
            subtitle="Sekolah, komunitas, atau brand yang ingin menghadirkan kegiatan anak yang bermakna? Kami terbuka untuk kerjasama."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CtaButton href="/kerjasama">Ajukan Kerjasama</CtaButton>
            <CtaButton
              href={waLink(
                "Halo Ziel Kids Club, saya ingin berdiskusi tentang peluang kerjasama."
              )}
              variant="outline"
              external
            >
              Chat WhatsApp
            </CtaButton>
          </div>
          <p className="mt-6 text-sm text-bark-700">
            Atau kunjungi kami langsung di {SITE.city} dan lihat sendiri
            suasananya.
          </p>
        </div>
      </section>
    </main>
  );
}
