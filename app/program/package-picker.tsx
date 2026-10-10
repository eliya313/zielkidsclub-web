"use client";

import { useState } from "react";

const PACKAGES = [4, 8, 12, 16] as const;

export default function PackagePicker() {
  const [selected, setSelected] = useState<number>(8);

  return (
    <div>
      <p
        id="label-pilih-paket"
        className="text-sm font-bold uppercase tracking-wide text-bark-700"
      >
        Pilih jumlah sesi
      </p>
      <div
        role="group"
        aria-labelledby="label-pilih-paket"
        className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {PACKAGES.map((count) => {
          const active = selected === count;
          return (
            <button
              key={count}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(count)}
              className={`flex flex-col items-center rounded-2xl border-2 px-4 py-5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-600 active:scale-[0.98] ${
                active
                  ? "border-terracotta-500 bg-terracotta-500 text-white shadow-md"
                  : "border-bark-500/30 bg-white text-bark-900 hover:border-terracotta-500 hover:bg-terracotta-50"
              }`}
            >
              <span className="font-display text-3xl font-bold">{count}</span>
              <span
                className={`mt-1 text-xs font-bold uppercase tracking-wide ${
                  active ? "text-white" : "text-bark-700"
                }`}
              >
                Sesi
              </span>
            </button>
          );
        })}
      </div>
      <div
        aria-live="polite"
        className="mt-4 rounded-2xl border border-sage-500/25 bg-cream-100 p-4"
      >
        <p className="text-sm text-bark-900">
          Paket terpilih:{" "}
          <strong className="font-bold">{selected} sesi</strong> Regular Class.
        </p>
        <p className="mt-1 text-sm text-bark-700">
          Biaya paket dikonfirmasi admin saat pendaftaran.
        </p>
      </div>
    </div>
  );
}
