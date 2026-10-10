import { getAuth, requireRoles, json } from "@/lib/api-auth";

// GET /api/documentations?child_id= — parent (anaknya), teacher/owner
export async function GET(req: Request) {
  const { supabase, user, role } = await getAuth();
  if (!user) return json({ error: "Login dulu" }, 401);
  const { searchParams } = new URL(req.url);
  const childId = searchParams.get("child_id");

  if (!requireRoles(role, ["teacher", "owner"])) {
    if (!childId) return json({ error: "child_id wajib diisi" }, 400);
    const { data: kid } = await supabase
      .from("children")
      .select("id")
      .eq("id", childId)
      .eq("parent_id", user.id)
      .single();
    if (!kid) return json({ error: "Tidak diizinkan" }, 403);
  }

  let q = supabase
    .from("documentations")
    .select("*")
    .order("activity_date", { ascending: false });
  if (childId) q = q.eq("child_id", childId);
  const { data, error } = await q;
  if (error) return json({ error: error.message }, 500);
  return json({ documentations: data });
}

// POST /api/documentations — teacher/owner
export async function POST(req: Request) {
  const { supabase, user, role } = await getAuth();
  if (!requireRoles(role, ["teacher", "owner"]))
    return json({ error: "Tidak diizinkan" }, 403);
  const { child_id, title, activity_date, notes = null, photo_url = null } = await req.json();
  if (!child_id || !title || !activity_date)
    return json({ error: "child_id, title, activity_date wajib diisi" }, 400);
  const { data, error } = await supabase
    .from("documentations")
    .insert({ child_id, teacher_id: user!.id, title, activity_date, notes, photo_url })
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ documentation: data }, 201);
}
