import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/api";

const BASE = "https://zielkidsclub.com";

const STATIC_ROUTES: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/program", changeFrequency: "monthly", priority: 0.9 },
  { path: "/jadwal", changeFrequency: "weekly", priority: 0.9 },
  { path: "/event", changeFrequency: "weekly", priority: 0.8 },
  { path: "/artikel", changeFrequency: "weekly", priority: 0.8 },
  { path: "/promo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/kerjasama", changeFrequency: "monthly", priority: 0.6 },
  { path: "/kebijakan-privasi", changeFrequency: "monthly", priority: 0.3 },
  { path: "/syarat-ketentuan", changeFrequency: "monthly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/artikel/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified: new Date(),
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...articleEntries,
  ];
}
