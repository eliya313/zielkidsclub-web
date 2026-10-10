import { getAuth, json } from "@/lib/api-auth";

// GET /api/me — sesi + profil + role
export async function GET() {
  const { user, role } = await getAuth();
  if (!user) return json({ user: null, role: null });
  return json({
    user: { id: user.id, email: user.email },
    role,
  });
}
