// Halaman daftar event Ziel Kids Club.
// Server Component: ambil data lewat getEvents(), saring status
// selesai/dibatalkan, lalu oper ke komponen filter (client).

import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { getEvents } from "@/lib/api";
import { EventFilter } from "./event-filter";

export const metadata: Metadata = {
  title: "Event | Ziel Kids Club",
  description:
    "Jadwal Pop Up Class, Talkshow Parenting, Workshop Montessori, dan Pelatihan Guru dari Ziel Kids Club Malang.",
};

export default async function EventPage() {
  const allEvents = await getEvents();
  const activeEvents = allEvents.filter(
    (event) => event.status !== "completed" && event.status !== "cancelled"
  );

  return (
    <main className="bg-cream-50">
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 md:px-8 md:pt-16">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-terracotta-600">
          Kegiatan Kami
        </p>
        <SectionHeading
          title="Event Ziel Kids Club"
          subtitle="Pilih kegiatan yang paling cocok untuk keluarga Anda: Pop Up Class, Talkshow Parenting, Workshop Montessori, dan Pelatihan Guru. Semua event terbuka untuk umum selama kuota tersedia."
        />
      </section>

      <section
        aria-label="Daftar event"
        className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-20"
      >
        <EventFilter events={activeEvents} />
      </section>
    </main>
  );
}
