import { getAuth, requireRoles, json } from "@/lib/api-auth";

// GET /api/reports?child_id= — parent (anaknya), teacher/owner (semua)
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
    .from("development_reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (childId) q = q.eq("child_id", childId);
  const { data, error } = await q;
  if (error) return json({ error: error.message }, 500);
  return json({ reports: data });
}

// POST /api/reports — teacher/owner
export async function POST(req: Request) {
  const { supabase, user, role } = await getAuth();
  if (!requireRoles(role, ["teacher", "owner"]))
    return json({ error: "Tidak diizinkan" }, 403);
  const body = await req.json();
  const { child_id, period_label, ...domains } = body;
  if (!child_id || !period_label)
    return json({ error: "child_id dan period_label wajib diisi" }, 400);
  const { data, error } = await supabase
    .from("development_reports")
    .insert({ child_id, teacher_id: user!.id, period_label, ...domains })
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ report: data }, 201);
}
