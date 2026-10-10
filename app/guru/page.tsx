import { getEvents } from "@/lib/api";
import GuruDashboard from "./dashboard";

export const metadata = {
  title: "Portal Guru | Ziel Kids Club",
  description:
    "Portal demo untuk guru Ziel Kids Club: kelola event, sesi kelas, perkembangan siswa, dokumentasi, dan data siswa.",
};

export default async function GuruPage() {
  const initialEvents = await getEvents();
  return <GuruDashboard initialEvents={initialEvents} />;
}
