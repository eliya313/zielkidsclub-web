import { getAuth, requireRoles, json } from "@/lib/api-auth";

// POST /api/partnerships — publik
export async function POST(req: Request) {
  const { supabase } = await getAuth();
  const { name, institution = null, kind, phone, message = null } = await req.json();
  if (!name || !kind || !phone)
    return json({ error: "Nama, jenis kerjasama, dan no WhatsApp wajib diisi" }, 400);
  const { data, error } = await supabase
    .from("partnerships")
    .insert({ name, institution, kind, phone, message })
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ partnership: data }, 201);
}

// GET /api/partnerships — owner
export async function GET() {
  const { supabase, role } = await getAuth();
  if (!requireRoles(role, ["owner"])) return json({ error: "Tidak diizinkan" }, 403);
  const { data, error } = await supabase
    .from("partnerships")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return json({ error: error.message }, 500);
  return json({ partnerships: data });
}
