import { getAuth, requireRoles, json } from "@/lib/api-auth";

// GET /api/events?category=popup&status=upcoming — publik
export async function GET(req: Request) {
  const { supabase } = await getAuth();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  let q = supabase
    .from("events")
    .select("*, event_age_sessions(*)")
    .order("event_date", { ascending: true });
  if (category) q = q.eq("category", category);
  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return json({ error: error.message }, 500);
  return json({ events: data });
}

// POST /api/events — teacher/owner
export async function POST(req: Request) {
  const { supabase, role } = await getAuth();
  if (!requireRoles(role, ["teacher", "owner"]))
    return json({ error: "Tidak diizinkan" }, 403);

  const body = await req.json();
  const {
    name, category, event_date, start_time, end_time, location,
    price_idr = 0, quota = null, description = null, flyer_url = null,
    status = "upcoming", age_sessions = [],
  } = body;
  if (!name || !category || !event_date)
    return json({ error: "nama, category, event_date wajib diisi" }, 400);

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      name, category, event_date, start_time, end_time, location,
      price_idr, quota, description, flyer_url, status,
    })
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);

  if (Array.isArray(age_sessions) && age_sessions.length > 0) {
    const rows = age_sessions.map((s: Record<string, string>) => ({
      event_id: event.id,
      label: s.label,
      age_range: s.age_range,
      start_time: s.start_time || null,
      end_time: s.end_time || null,
    }));
    const { error: e2 } = await supabase.from("event_age_sessions").insert(rows);
    if (e2) return json({ error: e2.message }, 500);
  }
  return json({ event }, 201);
}
