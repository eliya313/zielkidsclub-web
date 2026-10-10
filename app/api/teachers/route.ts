import { getAuth, requireRoles, json } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase-server";

// GET /api/teachers — owner: daftar akses guru
export async function GET() {
  const { role } = await getAuth();
  if (!requireRoles(role, ["owner"])) return json({ error: "Tidak diizinkan" }, 403);
  const svc = await createServiceClient();
  const { data, error } = await svc
    .from("profiles")
    .select("id, full_name, phone, is_active, created_at")
    .eq("role", "teacher")
    .order("created_at", { ascending: false });
  if (error) return json({ error: error.message }, 500);
  return json({ teachers: data });
}

// POST /api/teachers — owner: buat akun guru (email + password + nama)
export async function POST(req: Request) {
  const { role } = await getAuth();
  if (!requireRoles(role, ["owner"])) return json({ error: "Tidak diizinkan" }, 403);
  const { email, password, full_name, phone = null } = await req.json();
  if (!email || !password || !full_name)
    return json({ error: "email, password, full_name wajib diisi" }, 400);

  const svc = await createServiceClient();
  const { data: created, error: e1 } = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (e1) return json({ error: e1.message }, 500);

  const { error: e2 } = await svc.from("profiles").insert({
    id: created.user.id,
    full_name,
    role: "teacher",
    phone,
  });
  if (e2) return json({ error: e2.message }, 500);
  return json({ teacher: { id: created.user.id, full_name } }, 201);
}
