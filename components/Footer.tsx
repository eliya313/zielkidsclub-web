import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/program", label: "Program" },
  { href: "/event", label: "Event" },
  { href: "/promo", label: "Promo" },
  { href: "/artikel", label: "Artikel" },
  { href: "/kerjasama", label: "Kerjasama" },
  { href: "/orang-tua", label: "Portal Orang Tua" },
];

export default function Footer() {
  return (
    <footer className="bg-bark-800 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-butterfly.png"
                alt="Logo Ziel Kids Club"
                width={405}
                height={298}
                className="h-11 w-auto"
              />
              <div>
                <p className="font-display text-lg font-bold text-cream-50">
                  Ziel Kids Club
                </p>
                <p className="text-xs text-cream-200">{SITE.tagline}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-cream-200">
              Pusat perkembangan & pembelajaran awal untuk anak usia 6 bulan-6
              tahun di {SITE.city}.
            </p>
          </div>
          <nav aria-label="Navigasi">
            <p className="font-display text-base font-bold text-cream-50">
              Navigasi
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-cream-200 hover:text-mustard-300">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-display text-base font-bold text-cream-50">
              Hubungi Kami
            </p>
            <ul className="mt-3 space-y-2 text-sm text-cream-200">
              <li>
                <a
                  href={`https://wa.me/${SITE.waAdmin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-mustard-300"
                >
                  WhatsApp Admin
                </a>
              </li>
              <li>
                <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-mustard-300">
                  Instagram @zielkidsclub
                </a>
              </li>
              <li>
                <a href={SITE.threads} target="_blank" rel="noreferrer" className="hover:text-mustard-300">
                  Threads @zielkidsclub
                </a>
              </li>
              <li>{SITE.city}, Indonesia</li>
            </ul>
          </div>
          <div>
            <p className="font-display text-base font-bold text-cream-50">
              Program
            </p>
            <ul className="mt-3 space-y-2 text-sm text-cream-200">
              <li>Trial Class</li>
              <li>Regular Class</li>
              <li>Pop Up Class / Playdate</li>
              <li>Kelas Privat</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-cream-100/15 pt-6 text-xs text-cream-200 md:flex-row md:items-center">
          <p>
            © 2026 Ziel Kids Club - bagian dari {SITE.yayasan}.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href="/kebijakan-privasi" className="underline hover:text-mustard-300">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className="underline hover:text-mustard-300">
              Syarat &amp; Ketentuan
            </Link>
            <span className="hidden md:inline">·</span>
            <span>
              Internal:{" "}
              <Link href="/guru" className="underline hover:text-mustard-300">
                Portal Guru
              </Link>{" "}
              ·{" "}
              <Link href="/owner" className="underline hover:text-mustard-300">
                Portal Owner
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
