// Helper format tanggal Indonesia. Pure function - aman dipakai
// Server Component maupun Client Component.

export function formatDateId(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
