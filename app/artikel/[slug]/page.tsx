import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge, CtaButton } from "@/components/ui";
import { ARTICLE_CATEGORIES, ARTICLE_COVERS } from "@/lib/site";
import { getArticle, getArticles } from "@/lib/api";
import { formatDateId } from "@/lib/format";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artikel tidak ditemukan" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const categoryLabel =
    ARTICLE_CATEGORIES.find((c) => c.slug === article.category)?.label ??
    article.category;

  const related = (await getArticles())
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  const cover = ARTICLE_COVERS[article.slug];

  return (
    <main className="bg-cream-50">
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-2 text-sm font-bold text-sage-700 underline-offset-4 hover:text-sage-800 hover:underline focus:outline-none focus:ring-2 focus:ring-sage-600/40 rounded"
        >
          <BackIcon />
          Kembali ke Artikel
        </Link>

        <div className="mt-8">
          <Badge>{categoryLabel}</Badge>
          <h1 className="font-display mt-4 text-3xl font-bold leading-tight text-bark-900 md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-bark-600">
            <CalendarIcon />
            <time dateTime={article.publishedAt}>
              {formatDateId(article.publishedAt)}
            </time>
          </p>
        </div>

        {cover && (
          <div className="relative mt-8 h-60 w-full overflow-hidden rounded-3xl shadow-sm ring-1 ring-bark-500/10 md:h-80">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-8 space-y-5">
          {article.body.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-bark-800 md:text-lg md:leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-mustard-100 p-6 md:p-8">
          <p className="font-display text-lg font-bold text-bark-900">
            Ingin melihat langsung cara kami mendampingi anak?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-bark-700">
            Ikuti Trial Class atau Pop Up Class di Ziel Kids Club Malang, dan
            rasakan suasananya bersama anak.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <CtaButton href="/jadwal">Lihat Jadwal</CtaButton>
            <CtaButton href="/event" variant="outline">
              Lihat Acara
            </CtaButton>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="artikel-terkait" className="mt-12">
            <h2
              id="artikel-terkait"
              className="font-display text-xl font-bold text-bark-900 md:text-2xl"
            >
              Artikel terkait
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/artikel/${r.slug}`}
                    className="block rounded-xl border border-bark-500/20 bg-white p-4 transition-colors hover:border-sage-500/50 focus:outline-none focus:ring-2 focus:ring-sage-600/40"
                  >
                    <p className="font-bold text-bark-900">{r.title}</p>
                    <p className="mt-1 text-sm text-bark-700">{r.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
