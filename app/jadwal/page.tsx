import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { getClassSessions, getUpcomingEvents } from "@/lib/api";
import JadwalWizard from "./wizard";

export const metadata: Metadata = {
  title: "Jadwal dan Pendaftaran",
  description:
    "Daftar Trial Class, Regular Class, atau Event Ziel Kids Club Malang dalam 4 langkah mudah: pilih jenis kelas, pilih sesi, isi data, lalu konfirmasi via WhatsApp.",
};

export default async function JadwalPage() {
  // Server Component: fetch data di server, lalu oper sebagai props
  // ke komponen client (wizard) agar tetap serializable & interaktif.
  const [sessions, events] = await Promise.all([
    getClassSessions(),
    getUpcomingEvents(),
  ]);

  return (
    <div className="bg-cream-50">
      <section className="mx-auto w-full max-w-4xl px-4 py-12 md:py-16">
        <SectionHeading
          title="Jadwal dan Pendaftaran"
          subtitle="Pilih jenis kelas, tentukan sesi yang cocok, isi data diri, lalu selesaikan pendaftaran dalam 4 langkah."
        />
        <div className="mt-10">
          <JadwalWizard sessions={sessions} events={events} />
        </div>
      </section>
    </div>
  );
}
