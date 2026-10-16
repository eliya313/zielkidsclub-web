import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { getArticles } from "@/lib/api";
import ArticleFilter from "./article-filter";

export const metadata: Metadata = {
  title: "Artikel Parenting & Tumbuh Kembang Anak",
  description:
    "Artikel parenting, stimulasi tumbuh kembang, dan pendekatan Montessori untuk anak usia dini dari tim Ziel Kids Club Malang.",
};

export default async function ArtikelPage() {
  const articles = await getArticles();

  return (
    <main className="bg-cream-50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <SectionHeading
          title="Artikel"
          subtitle="Bacaan singkat tentang parenting, tumbuh kembang, dan pendidikan anak usia dini dari tim Ziel Kids Club."
        />
        <div className="mt-10">
          <ArticleFilter articles={articles} />
        </div>
      </div>
    </main>
  );
}
