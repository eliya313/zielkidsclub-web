import { getAuth, requireRoles, json } from "@/lib/api-auth";

// GET /api/class-sessions — publik
export async function GET() {
  const { supabase } = await getAuth();
  const { data, error } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("is_active", true)
    .order("session_date", { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ sessions: data });
}

// POST /api/class-sessions — teacher/owner
export async function POST(req: Request) {
  const { supabase, role } = await getAuth();
  if (!requireRoles(role, ["teacher", "owner"]))
    return json({ error: "Tidak diizinkan" }, 403);
  const body = await req.json();
  const {
    program_slug, title, session_date, start_time, end_time,
    quota = 10, age_group = null,
  } = body;
  if (!program_slug || !title || !session_date)
    return json({ error: "program_slug, title, session_date wajib diisi" }, 400);
  const { data, error } = await supabase
    .from("class_sessions")
    .insert({ program_slug, title, session_date, start_time, end_time, quota, age_group })
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ session: data }, 201);
}
