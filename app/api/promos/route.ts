import { getAuth, json } from "@/lib/api-auth";

// GET /api/promos — publik (hanya yang aktif)
export async function GET() {
  const { supabase } = await getAuth();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) return json({ error: error.message }, 500);
  return json({ promos: data });
}
