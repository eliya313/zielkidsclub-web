import { getAuth, json } from "@/lib/api-auth";

type Params = { params: Promise<{ slug: string }> };

// GET /api/articles/[slug] — publik
export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const { supabase } = await getAuth();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return json({ error: "Artikel tidak ditemukan" }, 404);
  return json({ article: data });
}
