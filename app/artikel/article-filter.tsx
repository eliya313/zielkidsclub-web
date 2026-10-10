"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, EmptyState } from "@/components/ui";
import { ARTICLE_CATEGORIES } from "@/lib/site";
import { formatDateId } from "@/lib/format";
import type { Article } from "@/lib/api";

const categoryLabel = (slug: Article["category"]) =>
  ARTICLE_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function ArticleFilter({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchCategory =
        activeCategory === "semua" || a.category === activeCategory;
      const matchQuery =
        q.length === 0 ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [articles, activeCategory, query]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="cari-artikel"
            className="mb-2 block text-sm font-bold text-bark-800"
          >
            Cari artikel
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bark-500">
              <SearchIcon />
            </span>
            <input
              id="cari-artikel"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik kata kunci judul atau ringkasan"
              className="w-full rounded-full border border-bark-500/30 bg-white py-3 pl-11 pr-4 text-sm text-bark-900 placeholder:text-bark-500 focus:border-sage-600 focus:outline-none focus:ring-2 focus:ring-sage-600/30"
            />
          </div>
        </div>

        <div>
          <span
            id="label-kategori"
            className="mb-2 block text-sm font-bold text-bark-800"
          >
            Kategori
          </span>
          <div
            role="group"
            aria-labelledby="label-kategori"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() => setActiveCategory("semua")}
              aria-pressed={activeCategory === "semua"}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-sage-600/40 ${
                activeCategory === "semua"
                  ? "bg-sage-600 text-white"
                  : "bg-cream-200 text-bark-800 hover:bg-cream-300"
              }`}
            >
              Semua
            </button>
            {ARTICLE_CATEGORIES.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setActiveCategory(c.slug)}
                aria-pressed={activeCategory === c.slug}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-sage-600/40 ${
                  activeCategory === c.slug
                    ? "bg-sage-600 text-white"
                    : "bg-cream-200 text-bark-800 hover:bg-cream-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-6 text-sm text-bark-700"
      >
        Menampilkan {filtered.length} dari {articles.length} artikel
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Tidak ada artikel yang cocok"
            hint="Coba kata kunci lain atau pilih kategori berbeda."
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Link
              key={a.slug}
              href={`/artikel/${a.slug}`}
              className="group flex flex-col rounded-2xl border border-bark-500/20 bg-white p-6 transition-all hover:-translate-y-1 hover:border-sage-500/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sage-600/40"
            >
              <Badge>{categoryLabel(a.category)}</Badge>
              <h3 className="font-display mt-4 text-xl font-bold leading-snug text-bark-900 group-hover:text-sage-700">
                {a.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-bark-700">
                {a.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-bark-600">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon />
                  {formatDateId(a.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-terracotta-600">
                  Baca
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
