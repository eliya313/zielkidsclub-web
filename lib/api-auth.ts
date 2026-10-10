import { createClient } from "@/lib/supabase-server";

export type Role = "parent" | "teacher" | "owner";

export async function getAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null as Role | null };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return { supabase, user, role: (profile?.role as Role) ?? null };
}

export function requireRoles(role: Role | null, allowed: Role[]) {
  return role !== null && allowed.includes(role);
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}
