import type { Metadata } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Ziel Kids Club - Child Development & Early Learning Center Malang",
    template: "%s | Ziel Kids Club",
  },
  description:
    "Ziel Kids Club adalah pusat perkembangan & pembelajaran awal untuk anak usia 6 bulan-6 tahun di Malang. Daftar trial class, regular class, pop up class, dan event parenting.",
  metadataBase: new URL("https://zielkidsclub.com"),
  openGraph: {
    title: "Ziel Kids Club",
    description:
      "Pusat perkembangan & pembelajaran awal untuk anak usia 6 bulan-6 tahun di Malang.",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ziel Kids Club - Child Development & Early Learning Center Malang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ziel Kids Club",
    description:
      "Pusat perkembangan & pembelajaran awal untuk anak usia 6 bulan-6 tahun di Malang.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${lora.variable} ${nunitoSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream-50 text-bark-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <a
          href={`https://wa.me/6285117623313?text=${encodeURIComponent(
            "Halo admin Ziel Kids Club, saya ingin bertanya."
          )}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat WhatsApp admin"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="#ffffff" className="h-7 w-7" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0 1 12 4zm-3.2 4.5c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a7.6 7.6 0 0 1-2.2-1.4 8.3 8.3 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L9.4 8.6c-.2-.4-.4-.6-.6-.6z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
