import { getEvents } from "@/lib/api";
import OwnerDashboard from "./dashboard";

export const metadata = {
  title: "Portal Owner | Ziel Kids Club",
  description:
    "Portal demo untuk owner Ziel Kids Club: kelola event, sesi kelas, perkembangan siswa, dokumentasi, data siswa, dan akses guru.",
};

export default async function OwnerPage() {
  const initialEvents = await getEvents();
  return <OwnerDashboard initialEvents={initialEvents} />;
}
