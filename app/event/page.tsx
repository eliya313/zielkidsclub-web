// Halaman daftar event Ziel Kids Club.
// Server Component: ambil data lewat getEvents(), saring status
// selesai/dibatalkan, lalu oper ke komponen filter (client).

import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { getEvents } from "@/lib/api";
import { EventFilter } from "./event-filter";
import JsonLd from "@/components/JsonLd";

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

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Event Ziel Kids Club",
    itemListElement: activeEvents.map((event, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: event.name,
        description: event.description,
        startDate: `${event.date}T${event.startTime}:00+07:00`,
        endDate: `${event.date}T${event.endTime}:00+07:00`,
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Malang",
            addressCountry: "ID",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "Ziel Kids Club",
          url: "https://zielkidsclub.com/",
        },
        offers: {
          "@type": "Offer",
          price: event.priceIdr,
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
          url: "https://zielkidsclub.com/jadwal",
        },
      },
    })),
  };

  return (
    <main className="bg-cream-50">
      <JsonLd data={eventSchema} />
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
