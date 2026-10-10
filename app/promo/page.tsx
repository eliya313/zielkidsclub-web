import type { Metadata } from "next";
import { SectionHeading, CtaButton, Badge, EmptyState } from "@/components/ui";
import { getPromos } from "@/lib/api";

export const metadata: Metadata = {
  title: "Promo",
  description:
    "Penawaran yang sedang berlaku untuk kelas dan program di Ziel Kids Club, Malang.",
};

/** Format "YYYY-MM-DD" menjadi tanggal Bahasa Indonesia, mis. "31 Oktober 2026". */
function formatTanggal(iso: string): string {
  const cocok = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!cocok) return iso;
  const tanggal = new Date(
    Number(cocok[1]),
    Number(cocok[2]) - 1,
    Number(cocok[3])
  );
  if (Number.isNaN(tanggal.getTime())) return iso;
  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function IkonTag({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6h.008v.008H6V6Z"
      />
    </svg>
  );
}

function IkonKalender({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
      />
    </svg>
  );
}

function IkonPanah({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12l-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

export default async function HalamanPromo() {
  const promos = await getPromos();

  return (
    <div className="bg-cream-50">
      {/* 1. Header halaman */}
      <section className="px-4 pt-12 pb-8 md:pt-16">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            title="Promo"
            subtitle="Penawaran yang sedang berlaku untuk kelas dan program di Ziel Kids Club."
          />
        </div>
      </section>

      {/* 2. Daftar promo */}
      <section className="px-4 pb-12" aria-label="Daftar promo">
        <div className="mx-auto max-w-5xl">
          {promos.length === 0 ? (
            <EmptyState
              title="Belum ada promo saat ini"
              hint="Silakan cek lagi nanti, atau hubungi admin untuk info penawaran terbaru."
            />
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {promos.map((promo) => (
                <li key={promo.id}>
                  <article className="flex h-full flex-col rounded-2xl border border-bark-500/25 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <Badge>Promo</Badge>
                      <span className="text-terracotta-600">
                        <IkonTag />
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-xl font-bold text-bark-900">
                      {promo.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-bark-700">
                      {promo.description}
                    </p>
                    {promo.validUntil && (
                      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-terracotta-700">
                        <IkonKalender />
                        <span>
                          Berlaku hingga{" "}
                          <time dateTime={promo.validUntil}>
                            {formatTanggal(promo.validUntil)}
                          </time>
                        </span>
                      </p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 3. CTA pendaftaran */}
      <section className="px-4 pb-16 md:pb-20" aria-label="Pendaftaran kelas">
        <div className="mx-auto max-w-5xl rounded-3xl bg-sage-800 px-6 py-10 md:py-12">
          <SectionHeading
            title="Tertarik dengan promonya?"
            subtitle="Lihat jadwal kelas yang tersedia dan amankan tempat untuk si kecil."
            dark
          />
          <div className="mt-6 text-center">
            <CtaButton href="/jadwal" variant="primary">
              Daftar Kelas
              <IkonPanah className="ml-2 h-4 w-4" />
            </CtaButton>
            <p className="mt-4 text-xs text-cream-200">
              Syarat dan ketentuan berlaku, konfirmasi ke admin.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
