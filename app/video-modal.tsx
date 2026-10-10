"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

function IconPlay({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function IconClose({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function VideoTestimonialCard({
  name,
  duration,
  quote,
}: {
  name: string;
  duration: string;
  quote: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="flex flex-col rounded-3xl bg-cream-50 p-6 shadow-sm ring-1 ring-bark-500/10">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Putar video testimoni dari ${name}`}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-500 text-white transition hover:-translate-y-[1px] hover:bg-terracotta-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          <IconPlay className="h-6 w-6 translate-x-[1px]" />
        </button>
        <p className="line-clamp-3 text-sm leading-relaxed text-bark-800">{quote}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-bark-500/15 pt-4">
          <p className="font-bold text-bark-900">{name}</p>
          <span className="shrink-0 rounded-full bg-sage-100 px-2.5 py-1 text-xs font-bold text-sage-700">
            {duration}
          </span>
        </div>
      </article>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Video testimoni dari ${name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Tutup jendela"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-bark-950/70"
          />
          <div className="relative w-full max-w-md rounded-3xl bg-cream-50 p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-bark-700 transition hover:bg-bark-500/10"
            >
              <IconClose />
            </button>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600">
              <IconPlay className="h-7 w-7 translate-x-[1px]" />
            </div>
            <h3 className="font-display text-xl font-bold text-bark-900">
              Video Testimoni
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bark-700">
              Video testimoni segera hadir. Ikuti Instagram @zielkidsclub untuk
              update.
            </p>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-terracotta-600"
            >
              Ikuti @zielkidsclub
            </a>
          </div>
        </div>
      )}
    </>
  );
}
