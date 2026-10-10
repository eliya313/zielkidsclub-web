"use client";

// Filter kategori + grid kartu event.
// Menerima daftar event aktif dari page.tsx (Server Component) sebagai props.

import { useMemo, useState } from "react";
import { Badge, Price, CtaButton, EmptyState } from "@/components/ui";
import { EVENT_CATEGORIES } from "@/lib/site";
import type { ZkcEvent } from "@/lib/api";

type CategoryFilter = "all" | (typeof EVENT_CATEGORIES)[number]["slug"];

function categoryLabel(slug: string): string {
  const found = EVENT_CATEGORIES.find((c) => c.slug === slug);
  return found ? found.label : slug;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function IconCalendar({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

function IconClock({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function IconPin({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconTicket({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />
      <path d="M13 6v2M13 11v2M13 16v2" />
    </svg>
  );
}

export function EventFilter({ events }: { events: ZkcEvent[] }) {
  const [active, setActive] = useState<CategoryFilter>("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? events
        : events.filter((event) => event.category === active),
    [active, events]
  );

  const pills: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    ...EVENT_CATEGORIES.map((c) => ({ value: c.slug as CategoryFilter, label: c.label })),
  ];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter kategori event"
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:justify-center md:px-0"
      >
        {pills.map((pill) => {
          const isActive = active === pill.value;
          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => setActive(pill.value)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 ${
                isActive
                  ? "bg-terracotta-500 text-white shadow-sm"
                  : "border border-bark-500/40 bg-white text-bark-800 hover:border-terracotta-500 hover:text-terracotta-600"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Belum ada event pada kategori ini"
            hint="Coba pilih kategori lain atau cek lagi beberapa hari ke depan."
          />
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <li key={event.id}>
              <article className="flex h-full flex-col rounded-3xl border border-bark-500/15 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{categoryLabel(event.category)}</Badge>
                </div>

                <h3 className="font-display mt-4 text-xl font-bold leading-snug text-bark-900">
                  {event.name}
                </h3>

                <dl className="mt-4 space-y-2.5 text-sm text-bark-800">
                  <div className="flex items-start gap-2.5">
                    <dt className="sr-only">Tanggal</dt>
                    <IconCalendar className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage-600" />
                    <dd>{formatDate(event.date)}</dd>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <dt className="sr-only">Waktu</dt>
                    <IconClock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage-600" />
                    <dd>
                      {event.startTime} sampai {event.endTime} WIB
                    </dd>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <dt className="sr-only">Lokasi</dt>
                    <IconPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage-600" />
                    <dd>{event.location}</dd>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <dt className="sr-only">Harga tiket</dt>
                    <IconTicket className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage-600" />
                    <dd>
                      <Price idr={event.priceIdr} />
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-bark-700">
                  {event.description}
                </p>

                <div className="mt-auto pt-6">
                  <CtaButton href="/jadwal">Daftar</CtaButton>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
