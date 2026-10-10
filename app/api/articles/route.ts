import { getAuth, json } from "@/lib/api-auth";

// GET /api/articles — publik (hanya yang published)
export async function GET() {
  const { supabase } = await getAuth();
  const { data, error } = await supabase
    .from("articles")
    .select("slug,title,category,excerpt,published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) return json({ error: error.message }, 500);
  return json({ articles: data });
}
