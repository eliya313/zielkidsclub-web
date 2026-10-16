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
      <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-cream-50 lg:min-h-[calc(88svh-5rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-mustard-200/50"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-sage-200/40"
        />
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 py-12 md:py-16 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta-600">
              Child Development &amp; Early Learning Center - Malang
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-bark-900 md:text-5xl">
              Anak Tumbuh Bahagia Sejak Dini
            </h1>
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-bark-700">
              Ruang hangat untuk anak usia 6 bulan hingga 6 tahun belajar,
              bermain, dan berkembang sesuai ritmenya, didampingi tim
              berpengalaman.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CtaButton href="/jadwal">Daftar Trial Class</CtaButton>
              <CtaButton href="/program" variant="outline">
                Lihat Program
              </CtaButton>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[3rem] bg-mustard-200/70 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl ring-1 ring-bark-500/10">
              <Image
                src="/illustrations/ilus-08.jpg"
                alt="Guru mendampingi anak-anak bermain dengan mainan kayu di kelas Ziel Kids Club yang hangat"
                width={800}
                height={600}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -left-3 top-8 rounded-2xl bg-sage-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg md:-left-8">
              Usia 6 bln - 6 thn
            </div>
            <div className="absolute -right-3 bottom-8 rounded-2xl bg-terracotta-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg md:-right-8">
              Observe First
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO KEUNGGULAN */}
      <section className="bg-cream-100 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            title="Bukan Sekadar Tempat Bermain"
            subtitle="Kami adalah pusat perkembangan anak yang bekerja dengan prinsip jelas: pahami dulu, baru dampingi."
          />
          <div className="relative mt-10 overflow-hidden rounded-3xl shadow-sm ring-1 ring-bark-500/10">
            <Image
              src="/illustrations/ilus-01.jpg"
              alt="Guru mendampingi tiga balita dalam aktivitas bermain sensori"
              width={1200}
              height={675}
              className="h-56 w-full object-cover md:h-80"
            />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-bark-500/10 md:col-span-2">
              <h3 className="font-display text-2xl font-bold text-bark-900">
                Bukan Daycare, Bukan Klinik Terapi
              </h3>
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-bark-700">
                Ziel Kids Club adalah pusat perkembangan anak, bukan tempat
                penitipan biasa dan bukan klinik terapi. Fokus kami sederhana:
                memahami anak lewat observasi yang cermat, lalu mendampingi
                dengan aktivitas yang tepat untuk tahap perkembangannya.
              </p>
            </div>
            <div className="rounded-3xl bg-sage-600 p-7 text-white shadow-sm">
              <h3 className="font-display text-xl font-bold">Observe First</h3>
              <p className="mt-3 text-sm leading-relaxed text-sage-100">
                Sebelum merespons, kami mengamati. Setiap anak dipetakan
                kebutuhannya terlebih dahulu sebelum aktivitas disusun.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-mustard-100 p-7 shadow-sm ring-1 ring-mustard-500/20 md:col-span-2">
              <h3 className="font-display text-2xl font-bold text-bark-900">
                9 Ranah Observasi
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bark-700">
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
            <div className="rounded-3xl bg-terracotta-50 p-7 shadow-sm ring-1 ring-terracotta-500/15">
              <h3 className="font-display text-xl font-bold text-bark-900">
                Pendampingan Terarah
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bark-700">
                Hasil observasi menjadi acuan aktivitas tiap anak. Orang tua
                mendapat laporan berkala tentang perkembangannya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROGRAM RINGKAS */}
      <section className="bg-cream-50 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow="Pilihan Program"
            align="left"
            title="Program untuk Setiap Tahap"
            subtitle="Pilih format yang paling cocok untuk anak dan jadwal keluarga Anda."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS.map((p) => (
              <article
                key={p.title}
                className={`group flex flex-col bg-white p-6 shadow-sm ring-1 ring-bark-500/10 transition hover:-translate-y-1 hover:shadow-md ${p.radius}`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${p.tile}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {p.icon}
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-bark-900">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-bark-700">
                  {p.desc}
                </p>
                <Link
                  href="/program"
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold transition group-hover:gap-2.5 ${p.link}`}
                  aria-label={`Lihat detail program ${p.title}`}
                >
                  Lihat Program
                  <IconArrow />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BAND EVENT TERDEKAT */}
      <section className="bg-cream-50 pb-12 md:pb-16">
        <div className="mx-auto max-w-6xl px-5">
          {evt ? (
            <div className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-mustard-100 p-7 shadow-sm ring-1 ring-mustard-500/20 md:p-10 lg:grid-cols-[1fr_auto]">
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
                <CtaButton href="/jadwal">Daftar</CtaButton>
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
      <section className="bg-bark-800 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            dark
            eyebrow="Testimoni"
            title="Kata Mereka"
            subtitle="Cerita singkat dari orang tua yang mempercayakan buah hatinya kepada kami."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {TEXT_TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className={`flex flex-col bg-bark-700/60 p-7 ring-1 ring-cream-50/10 ${
                  [
                    "rounded-3xl",
                    "rounded-tl-[2.25rem] rounded-tr-xl rounded-br-[2.25rem] rounded-bl-xl",
                    "rounded-[1.75rem]",
                  ][i % 3]
                }`}
              >
                <blockquote className="flex-1 text-sm leading-relaxed text-cream-100">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 border-t border-cream-50/15 pt-4">
                  <p className="font-bold text-cream-50">{t.name}</p>
                  <p className="mt-1 text-xs text-cream-200">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ARTIKEL TERBARU */}
      <section className="bg-cream-50 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            title="Artikel Terbaru"
            subtitle="Bacaan ringan seputar tumbuh kembang dan parenting dari tim kami."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {articles.map((a, i) => {
              const cover = ARTICLE_COVERS[a.slug];
              const radius = [
                "rounded-3xl",
                "rounded-[1.75rem]",
                "rounded-tl-[2.25rem] rounded-tr-xl rounded-br-[2.25rem] rounded-bl-xl",
              ][i % 3];
              return (
                <Link
                  key={a.slug}
                  href={`/artikel/${a.slug}`}
                  className={`group flex flex-col overflow-hidden bg-white shadow-sm ring-1 ring-bark-500/10 transition hover:-translate-y-1 hover:shadow-md ${radius}`}
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
