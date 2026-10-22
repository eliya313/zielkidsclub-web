"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE, waLink } from "@/lib/site";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/program", label: "Program" },
  { href: "/event", label: "Event" },
  { href: "/promo", label: "Promo" },
  { href: "/artikel", label: "Artikel" },
  { href: "/kerjasama", label: "Kerjasama" },
  { href: "/orang-tua", label: "Portal Orang Tua" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-bark-800 shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px]">
        <Link href="/" className="flex items-center gap-3" aria-label="Ziel Kids Club - Beranda">
          <span className="inline-flex items-center rounded-full bg-cream-100 p-1.5">
            <Image
              src="/logo-zkc.png"
              alt="Logo Ziel Kids Club"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
          </span>
          <span className="font-display text-xl font-bold text-cream-50">
            Ziel Kids Club
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-mustard-400/20 text-mustard-300"
                    : "text-cream-100 hover:bg-cream-100/10 hover:text-cream-50"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <a
            href={waLink("Halo admin Ziel Kids Club, saya ingin bertanya tentang kelas.")}
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-full bg-terracotta-500 px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Daftar Sekarang
          </a>
        </nav>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-cream-100 hover:bg-cream-100/10 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-cream-100/10 px-4 pb-4 lg:hidden" aria-label="Navigasi seluler">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                pathname === n.href
                  ? "bg-mustard-400/20 text-mustard-300"
                  : "text-cream-100 hover:bg-cream-100/10"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <a
            href={waLink("Halo admin Ziel Kids Club, saya ingin bertanya tentang kelas.")}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block rounded-full bg-terracotta-500 px-4 py-2.5 text-center text-sm font-bold text-white"
          >
            Daftar Sekarang
          </a>
        </nav>
      )}
    </header>
  );
}
