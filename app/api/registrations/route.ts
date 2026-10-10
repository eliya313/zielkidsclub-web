import { getAuth, requireRoles, json } from "@/lib/api-auth";

// POST /api/registrations — publik (pendaftaran anak)
// Body: { child_name, birth_date, parent_name, parent_phone, notes,
//         kind: 'trial'|'regular'|'event', class_session_id?, event_id?,
//         event_age_session_id?, package_sessions? }
export async function POST(req: Request) {
  const { supabase } = await getAuth();
  const body = await req.json();
  const {
    child_name, birth_date, parent_name, parent_phone, notes = null,
    kind, class_session_id = null, event_id = null,
    event_age_session_id = null, package_sessions = null,
  } = body;

  if (!child_name || !birth_date || !parent_name || !parent_phone || !kind)
    return json({ error: "Data anak, orang tua, dan jenis kelas wajib diisi" }, 400);
  if (kind !== "event" && !class_session_id)
    return json({ error: "Sesi kelas wajib dipilih" }, 400);
  if (kind === "event" && !event_id)
    return json({ error: "Event wajib dipilih" }, 400);

  // Simpan sebagai calon pendaftar tanpa akun (parent_id null) —
  // admin/guru menindaklanjuti via WhatsApp, lalu mengaitkan ke akun.
  const { data: reg, error } = await supabase
    .from("registrations")
    .insert({
      child_id: null,
      class_session_id,
      event_id,
      event_age_session_id,
      package_sessions,
      sessions_remaining: package_sessions,
      payment_status: "pending",
      notes: `Anak: ${child_name} (${birth_date}) | Ortu: ${parent_name} (${parent_phone})${notes ? ` | ${notes}` : ""}`,
    })
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ registration: reg }, 201);
}

// GET /api/registrations — parent (miliknya), teacher/owner (semua)
export async function GET() {
  const { supabase, user, role } = await getAuth();
  if (!user) return json({ error: "Login dulu" }, 401);

  let q = supabase
    .from("registrations")
    .select("*, children(*)")
    .order("created_at", { ascending: false });
  if (!requireRoles(role, ["teacher", "owner"])) {
    const { data: kids } = await supabase
      .from("children")
      .select("id")
      .eq("parent_id", user.id);
    const ids = (kids ?? []).map((k) => k.id);
    q = q.in("child_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
  }
  const { data, error } = await q;
  if (error) return json({ error: error.message }, 500);
  return json({ registrations: data });
}
