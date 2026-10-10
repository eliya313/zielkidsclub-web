import { getAuth, requireRoles, json } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase-server";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/teachers/[id] — owner: ubah nama/telepon/status aktif
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const { role } = await getAuth();
  if (!requireRoles(role, ["owner"])) return json({ error: "Tidak diizinkan" }, 403);
  const body = await req.json();
  const patch: Record<string, unknown> = {};
  for (const k of ["full_name", "phone", "is_active"])
    if (body[k] !== undefined) patch[k] = body[k];

  const svc = await createServiceClient();
  const { data, error } = await svc
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .eq("role", "teacher")
    .select()
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ teacher: data });
}

// DELETE /api/teachers/[id] — owner: hapus akses guru
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const { role } = await getAuth();
  if (!requireRoles(role, ["owner"])) return json({ error: "Tidak diizinkan" }, 403);
  const svc = await createServiceClient();
  const { error } = await svc.auth.admin.deleteUser(id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
}
