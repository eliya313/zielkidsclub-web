import { getAuth, requireRoles, json } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/events/[id] — publik
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const { supabase } = await getAuth();
  const { data, error } = await supabase
    .from("events")
    .select("*, event_age_sessions(*)")
    .eq("id", id)
    .single();
  if (error) return json({ error: "Event tidak ditemukan" }, 404);
  return json({ event: data });
}

// PATCH /api/events/[id] — teacher/owner
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const { supabase, role } = await getAuth();
  if (!requireRoles(role, ["teacher", "owner"]))
    return json({ error: "Tidak diizinkan" }, 403);

  const body = await req.json();
  const allowed = [
    "name", "category", "event_date", "start_time", "end_time", "location",
    "price_idr", "quota", "description", "flyer_url", "status",
  ];
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (body[k] !== undefined) patch[k] = body[k];

  const { data, error } = await supabase
    .from("events")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);

  if (Array.isArray(body.age_sessions)) {
    await supabase.from("event_age_sessions").delete().eq("event_id", id);
    if (body.age_sessions.length > 0) {
      const rows = body.age_sessions.map((s: Record<string, string>) => ({
        event_id: id,
        label: s.label,
        age_range: s.age_range,
        start_time: s.start_time || null,
        end_time: s.end_time || null,
      }));
      await supabase.from("event_age_sessions").insert(rows);
    }
  }
  return json({ event: data });
}

// DELETE /api/events/[id] — teacher/owner
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const { supabase, role } = await getAuth();
  if (!requireRoles(role, ["teacher", "owner"]))
    return json({ error: "Tidak diizinkan" }, 403);
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
}
