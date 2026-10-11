"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CtaButton, Price, EmptyState } from "@/components/ui";
import { SITE, waLink, EVENT_CATEGORIES } from "@/lib/site";
import { submitRegistration } from "@/lib/api";
import type {
  ClassSession,
  ZkcEvent,
  RegistrationInput,
} from "@/lib/api";

type Kind = "trial" | "regular" | "event";

const STEP_LABELS = ["Jenis Kelas", "Pilih Sesi", "Data Diri", "Ringkasan & Bayar"];

const KIND_OPTIONS: {
  value: Kind;
  title: string;
  desc: string;
}[] = [
  {
    value: "trial",
    title: "Trial Class",
    desc: "Sesi percobaan satu kali untuk merasakan suasana kelas bersama anak.",
  },
  {
    value: "regular",
    title: "Regular Class",
    desc: "Kelas rutin dengan pendampingan perkembangan anak secara berkelanjutan.",
  },
  {
    value: "event",
    title: "Event",
    desc: "Pop Up Class, talkshow parenting, workshop, dan pelatihan.",
  },
];

const KIND_LABEL: Record<Kind, string> = {
  trial: "Trial Class",
  regular: "Regular Class",
  event: "Event",
};

const PRICE_PENDING_TEXT = "Biaya dikonfirmasi admin";

function formatDateId(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeRange(start: string, end: string): string {
  const t = (s: string) => s.replace(":", ".");
  return `${t(start)} - ${t(end)}`;
}

function eventCategoryLabel(slug: string): string {
  return EVENT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

function priceTextFor(kind: Kind, ev?: ZkcEvent): string {
  if (kind === "event" && ev) {
    return ev.priceIdr === 0
      ? "Gratis"
      : `Rp ${ev.priceIdr.toLocaleString("id-ID")}`;
  }
  return PRICE_PENDING_TEXT;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 10.5 8.5 15 16 6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12.5 4 6.5 10l6 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M7.5 4l6 6-6 6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="14" height="12" rx="2" />
      <path d="M3 8.5h14M7 2.5v3M13 2.5v3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6.5V10l2.5 1.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M10 17.5s5.5-4.8 5.5-9.3A5.5 5.5 0 1 0 4.5 8.2c0 4.5 5.5 9.3 5.5 9.3Z" />
      <circle cx="10" cy="8" r="1.8" />
    </svg>
  );
}

const inputCls = (invalid: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-2.5 text-base text-bark-900 placeholder:text-bark-500/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 ${
    invalid
      ? "border-terracotta-700"
      : "border-bark-500/40 focus:border-terracotta-500"
  }`;

const cardCls = (selected: boolean) =>
  `relative block w-full cursor-pointer rounded-2xl border-2 bg-white p-5 text-left transition-all focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:ring-offset-2 focus-within:ring-offset-cream-50 ${
    selected
      ? "border-terracotta-500 bg-terracotta-50 shadow-md"
      : "border-bark-500/30 hover:border-bark-500/60 hover:shadow-sm"
  }`;

export default function JadwalWizard({
  sessions,
  events,
}: {
  sessions: ClassSession[];
  events: ZkcEvent[];
}) {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<Kind | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const submittedRef = useRef(false);
  // Tanggal hari ini untuk batas max tanggal lahir - dihitung di client
  // via useEffect agar aman saat prerender (tidak dievaluasi di server).
  const [todayIso, setTodayIso] = useState("");
  useEffect(() => {
    setTodayIso(new Date().toISOString().slice(0, 10));
  }, []);

  const kindSessions =
    kind === "trial" || kind === "regular"
      ? sessions.filter((s) => s.program === kind)
      : [];

  const selectedSession: ClassSession | undefined =
    kind !== "event" ? kindSessions.find((s) => s.id === selectedId) : undefined;
  const selectedEvent: ZkcEvent | undefined =
    kind === "event" ? events.find((e) => e.id === selectedId) : undefined;

  const itemName =
    kind === "event"
      ? selectedEvent?.name ?? ""
      : selectedSession?.title ?? "";

  const sessionLabel =
    kind === "event" && selectedEvent
      ? `${formatDateId(selectedEvent.date)}, ${formatTimeRange(
          selectedEvent.startTime,
          selectedEvent.endTime
        )}`
      : selectedSession
        ? `${formatDateId(selectedSession.date)}, ${formatTimeRange(
            selectedSession.startTime,
            selectedSession.endTime
          )}`
        : "";

  const priceText = priceTextFor(
    kind ?? "trial",
    kind === "event" ? selectedEvent : undefined
  );

  const waMessage = `Halo Admin Ziel Kids Club, saya ${parentName} mendaftar ${itemName} sesi ${sessionLabel} sebesar ${priceText} untuk anak ${childName}. Bukti transfer menyusul.`;

  // Panggil submitRegistration (mock) sekali saat pengguna sampai di ringkasan.
  useEffect(() => {
    if (step !== 3 || submittedRef.current || !kind) return;
    submittedRef.current = true;
    const input: RegistrationInput = {
      childName: childName.trim(),
      birthDate,
      parentName: parentName.trim(),
      parentPhone: parentPhone.replace(/\D/g, ""),
      notes: notes.trim() || undefined,
      kind,
      sessionId: selectedSession?.id,
      eventId: selectedEvent?.id,
    };
    submitRegistration(input).catch(() => {
      submittedRef.current = false;
    });
  }, [
    step,
    kind,
    childName,
    birthDate,
    parentName,
    parentPhone,
    notes,
    selectedSession,
    selectedEvent,
  ]);

  function validateForm(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!childName.trim()) next.childName = "Nama anak wajib diisi.";
    if (!birthDate) {
      next.birthDate = "Tanggal lahir wajib diisi.";
    } else if (todayIso && birthDate > todayIso) {
      next.birthDate = "Tanggal lahir tidak boleh di masa depan.";
    }
    if (!parentName.trim()) next.parentName = "Nama orang tua wajib diisi.";
    const digits = parentPhone.replace(/\D/g, "");
    if (!parentPhone.trim()) {
      next.parentPhone = "Nomor WhatsApp wajib diisi.";
    } else if (digits.length < 9) {
      next.parentPhone = "Nomor WhatsApp minimal 9 digit angka.";
    }
    return next;
  }

  function blurValidate(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateForm());
  }

  function goNext() {
    if (step === 0) {
      if (kind) setStep(1);
      return;
    }
    if (step === 1) {
      if (selectedSession || selectedEvent) setStep(2);
      return;
    }
    if (step === 2) {
      const next = validateForm();
      setErrors(next);
      setTouched({
        childName: true,
        birthDate: true,
        parentName: true,
        parentPhone: true,
      });
      if (Object.keys(next).length === 0) setStep(3);
      return;
    }
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function jumpTo(target: number) {
    if (target < step) setStep(target);
  }

  const canNext =
    (step === 0 && !!kind) ||
    (step === 1 && !!(selectedSession || selectedEvent)) ||
    step === 2;

  return (
    <div className="rounded-3xl border border-bark-500/20 bg-cream-100 p-5 shadow-sm md:p-8">
      {/* Indikator langkah 1-4 */}
      <nav aria-label="Langkah pendaftaran">
        <ol className="flex items-start justify-between gap-1 md:gap-2">
          {STEP_LABELS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex flex-1 items-start">
                <div className="flex w-full flex-col items-center gap-2 text-center">
                  {done ? (
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Kembali ke langkah ${i + 1}: ${label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-600 text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2"
                    >
                      <CheckIcon />
                    </button>
                  ) : (
                    <span
                      aria-current={current ? "step" : undefined}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        current
                          ? "bg-terracotta-500 text-white ring-2 ring-terracotta-500 ring-offset-2 ring-offset-cream-100"
                          : "bg-bark-500/15 text-bark-700"
                      }`}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-bold leading-tight md:text-xs ${
                      current ? "text-bark-900" : "text-bark-700"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`mx-1 mt-4 h-0.5 w-full min-w-2 rounded ${
                      done ? "bg-sage-600" : "bg-bark-500/20"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-8">
        {/* LANGKAH (a): pilih jenis kelas */}
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-xl font-bold text-bark-900">
              Pilih jenis kelas
            </legend>
            <p className="mt-1 text-sm text-bark-700">
              Tentukan dulu jenis pendaftaran yang diinginkan.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4">
              {KIND_OPTIONS.map((opt) => {
                const selected = kind === opt.value;
                return (
                  <label key={opt.value} className={cardCls(selected)}>
                    <input
                      type="radio"
                      name="kind"
                      value={opt.value}
                      checked={selected}
                      onChange={() => {
                        setKind(opt.value);
                        setSelectedId(null);
                      }}
                      className="sr-only"
                    />
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block text-base font-bold text-bark-900">
                          {opt.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-bark-700">
                          {opt.desc}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected
                            ? "border-terracotta-500 bg-terracotta-500 text-white"
                            : "border-bark-500/40 text-transparent"
                        }`}
                      >
                        <CheckIcon />
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* LANGKAH (b): pilih sesi */}
        {step === 1 && kind && (
          <fieldset>
            <legend className="font-display text-xl font-bold text-bark-900">
              Pilih sesi {KIND_LABEL[kind]}
            </legend>
            <p className="mt-1 text-sm text-bark-700">
              Pilih satu sesi yang paling cocok dengan jadwal keluarga.
            </p>

            {kind !== "event" && (
              <div className="mt-5 grid grid-cols-1 gap-4">
                {kindSessions.length === 0 ? (
                  <EmptyState
                    title="Belum ada sesi tersedia"
                    hint="Silakan hubungi admin untuk menanyakan jadwal terbaru."
                  />
                ) : (
                  kindSessions.map((s) => {
                    const selected = selectedId === s.id;
                    return (
                      <label key={s.id} className={cardCls(selected)}>
                        <input
                          type="radio"
                          name="session"
                          value={s.id}
                          checked={selected}
                          onChange={() => setSelectedId(s.id)}
                          className="sr-only"
                        />
                        <span className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="block text-base font-bold text-bark-900">
                              {s.title}
                            </span>
                            <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-bark-700">
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarIcon />
                                {formatDateId(s.date)}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <ClockIcon />
                                {formatTimeRange(s.startTime, s.endTime)} WIB
                              </span>
                            </span>
                            <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-bark-700">
                              {s.ageGroup && (
                                <span>Usia: {s.ageGroup}</span>
                              )}
                              <span>Kuota: {s.quota} anak</span>
                            </span>
                            <span className="mt-2 block text-sm font-semibold text-bark-800">
                              {PRICE_PENDING_TEXT}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                              selected
                                ? "border-terracotta-500 bg-terracotta-500 text-white"
                                : "border-bark-500/40 text-transparent"
                            }`}
                          >
                            <CheckIcon />
                          </span>
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            )}

            {kind === "event" && (
              <div className="mt-5 grid grid-cols-1 gap-4">
                {events.length === 0 ? (
                  <EmptyState
                    title="Belum ada event tersedia"
                    hint="Silakan hubungi admin untuk menanyakan jadwal event terbaru."
                  />
                ) : (
                  events.map((ev) => {
                    const selected = selectedId === ev.id;
                    return (
                      <label key={ev.id} className={cardCls(selected)}>
                        <input
                          type="radio"
                          name="event"
                          value={ev.id}
                          checked={selected}
                          onChange={() => setSelectedId(ev.id)}
                          className="sr-only"
                        />
                        <span className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="inline-flex items-center rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-bold text-sage-700">
                              {eventCategoryLabel(ev.category)}
                            </span>
                            <span className="mt-1.5 block text-base font-bold text-bark-900">
                              {ev.name}
                            </span>
                            <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-bark-700">
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarIcon />
                                {formatDateId(ev.date)}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <ClockIcon />
                                {formatTimeRange(ev.startTime, ev.endTime)} WIB
                              </span>
                            </span>
                            <span className="mt-1.5 flex items-start gap-1.5 text-sm text-bark-700">
                              <PinIcon />
                              {ev.location}
                            </span>
                            {ev.ageSessions.length > 0 && (
                              <span className="mt-1.5 block text-sm text-bark-700">
                                Sesi usia:{" "}
                                {ev.ageSessions
                                  .map(
                                    (a) =>
                                      `${a.label} (${a.ageRange}) ${formatTimeRange(a.startTime, a.endTime)}`
                                  )
                                  .join("; ")}
                              </span>
                            )}
                            {typeof ev.quota === "number" && (
                              <span className="mt-1.5 block text-sm text-bark-700">
                                {typeof ev.participants === "number"
                                  ? `Terisi ${ev.participants} dari ${ev.quota} peserta`
                                  : `Kuota: ${ev.quota} peserta`}
                              </span>
                            )}
                            <span className="mt-2 block text-sm">
                              <Price idr={ev.priceIdr} />
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                              selected
                                ? "border-terracotta-500 bg-terracotta-500 text-white"
                                : "border-bark-500/40 text-transparent"
                            }`}
                          >
                            <CheckIcon />
                          </span>
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </fieldset>
        )}

        {/* LANGKAH (c): form data */}
        {step === 2 && (
          <div>
            <h3 className="font-display text-xl font-bold text-bark-900">
              Isi data pendaftaran
            </h3>
            <p className="mt-1 text-sm text-bark-700">
              Data ini dipakai admin untuk menyiapkan sesi anak.
            </p>


            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                goNext();
              }}
              className="mt-5 grid grid-cols-1 gap-5"
            >
              <div>
                <label
                  htmlFor="childName"
                  className="mb-1.5 block text-sm font-bold text-bark-900"
                >
                  Nama anak <span aria-hidden="true" className="text-terracotta-600">*</span>
                </label>
                <input
                  id="childName"
                  type="text"
                  autoComplete="off"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  onBlur={() => blurValidate("childName")}
                  aria-invalid={!!errors.childName && touched.childName}
                  aria-describedby={
                    errors.childName && touched.childName
                      ? "childName-error"
                      : undefined
                  }
                  placeholder="Contoh: Aisyah Putri"
                  className={inputCls(!!errors.childName && touched.childName)}
                />
                {errors.childName && touched.childName && (
                  <p
                    id="childName-error"
                    role="alert"
                    className="mt-1.5 text-sm font-semibold text-terracotta-700"
                  >
                    {errors.childName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="birthDate"
                  className="mb-1.5 block text-sm font-bold text-bark-900"
                >
                  Tanggal lahir anak{" "}
                  <span aria-hidden="true" className="text-terracotta-600">*</span>
                </label>
                <input
                  id="birthDate"
                  type="date"
                  max={todayIso || undefined}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  onBlur={() => blurValidate("birthDate")}
                  aria-invalid={!!errors.birthDate && touched.birthDate}
                  aria-describedby={
                    errors.birthDate && touched.birthDate
                      ? "birthDate-error"
                      : undefined
                  }
                  className={inputCls(!!errors.birthDate && touched.birthDate)}
                />
                {errors.birthDate && touched.birthDate && (
                  <p
                    id="birthDate-error"
                    role="alert"
                    className="mt-1.5 text-sm font-semibold text-terracotta-700"
                  >
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="parentName"
                  className="mb-1.5 block text-sm font-bold text-bark-900"
                >
                  Nama orang tua{" "}
                  <span aria-hidden="true" className="text-terracotta-600">*</span>
                </label>
                <input
                  id="parentName"
                  type="text"
                  autoComplete="name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  onBlur={() => blurValidate("parentName")}
                  aria-invalid={!!errors.parentName && touched.parentName}
                  aria-describedby={
                    errors.parentName && touched.parentName
                      ? "parentName-error"
                      : undefined
                  }
                  placeholder="Contoh: Budi Santoso"
                  className={inputCls(!!errors.parentName && touched.parentName)}
                />
                {errors.parentName && touched.parentName && (
                  <p
                    id="parentName-error"
                    role="alert"
                    className="mt-1.5 text-sm font-semibold text-terracotta-700"
                  >
                    {errors.parentName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="parentPhone"
                  className="mb-1.5 block text-sm font-bold text-bark-900"
                >
                  Nomor WhatsApp{" "}
                  <span aria-hidden="true" className="text-terracotta-600">*</span>
                </label>
                <input
                  id="parentPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  onBlur={() => blurValidate("parentPhone")}
                  aria-invalid={!!errors.parentPhone && touched.parentPhone}
                  aria-describedby={
                    errors.parentPhone && touched.parentPhone
                      ? "parentPhone-error"
                      : "parentPhone-hint"
                  }
                  placeholder="Contoh: 0812 3456 7890"
                  className={inputCls(
                    !!errors.parentPhone && touched.parentPhone
                  )}
                />
                {errors.parentPhone && touched.parentPhone ? (
                  <p
                    id="parentPhone-error"
                    role="alert"
                    className="mt-1.5 text-sm font-semibold text-terracotta-700"
                  >
                    {errors.parentPhone}
                  </p>
                ) : (
                  <p id="parentPhone-hint" className="mt-1.5 text-sm text-bark-700">
                    Minimal 9 digit angka, diawali 08 atau 62.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="mb-1.5 block text-sm font-bold text-bark-900"
                >
                  Catatan{" "}
                  <span className="font-normal text-bark-700">(opsional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: anak alergi kacang, atau preferensi jadwal."
                  className={`${inputCls(false)} resize-y`}
                />
              </div>
            </form>
          </div>
        )}

        {/* LANGKAH (d): ringkasan + pembayaran */}
        {step === 3 && (
          <div>
            <h3 className="font-display text-xl font-bold text-bark-900">
              Ringkasan pendaftaran
            </h3>
            <p className="mt-1 text-sm text-bark-700">
              Periksa kembali data berikut sebelum melakukan pembayaran.
            </p>

            <dl className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-bark-500/20 bg-white p-5">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-bark-700">
                  Jenis pendaftaran
                </dt>
                <dd className="mt-0.5 text-base font-semibold text-bark-900">
                  {kind ? KIND_LABEL[kind] : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-bark-700">
                  {kind === "event" ? "Event" : "Kelas"}
                </dt>
                <dd className="mt-0.5 text-base font-semibold text-bark-900">
                  {itemName || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-bark-700">
                  Sesi terpilih
                </dt>
                <dd className="mt-0.5 text-base font-semibold text-bark-900">
                  {sessionLabel || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-bark-700">
                  Anak
                </dt>
                <dd className="mt-0.5 text-base font-semibold text-bark-900">
                  {childName}
                  {birthDate && (
                    <span className="font-normal text-bark-700">
                      {" "}
                      ({formatDateId(birthDate)})
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-bark-700">
                  Orang tua
                </dt>
                <dd className="mt-0.5 text-base font-semibold text-bark-900">
                  {parentName}
                  <span className="block text-sm font-normal text-bark-700">
                    {parentPhone}
                  </span>
                </dd>
              </div>
              {notes.trim() && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-bark-700">
                    Catatan
                  </dt>
                  <dd className="mt-0.5 text-base text-bark-900">
                    {notes.trim()}
                  </dd>
                </div>
              )}
            </dl>

            {/* RINGKASAN PEMBAYARAN */}
            <h4 className="mt-8 font-display text-lg font-bold text-bark-900">
              Ringkasan Pembayaran
            </h4>
            <div className="mt-4 rounded-2xl border border-bark-500/20 bg-white p-5">
              <div className="flex items-center justify-between gap-4 border-b border-bark-500/15 pb-4">
                <span className="text-sm font-bold text-bark-700">
                  Total pembayaran
                </span>
                <span className="text-lg">
                  {kind === "event" && selectedEvent ? (
                    <Price idr={selectedEvent.priceIdr} />
                  ) : (
                    <span className="font-bold text-bark-900">
                      {PRICE_PENDING_TEXT}
                    </span>
                  )}
                </span>
              </div>

              <figure className="mt-5">
                <Image
                  src="/qris-zkc.jpg"
                  alt={`Kode QRIS ${SITE.name} untuk pembayaran pendaftaran`}
                  width={800}
                  height={800}
                  className="mx-auto h-auto w-full max-w-sm rounded-2xl border border-bark-500/20"
                />
                <figcaption className="mt-2 text-center text-sm text-bark-700">
                  QRIS {SITE.name}
                </figcaption>
              </figure>

              <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-bark-700">
                Scan QRIS untuk membayar, lalu konfirmasi via WhatsApp.
              </p>

              <div className="mt-4 flex justify-center">
                <CtaButton href={waLink(waMessage)} external={true}>
                  Konfirmasi via WhatsApp
                </CtaButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigasi */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-bark-700 px-6 py-3 text-sm font-bold text-bark-800 transition-all hover:-translate-y-[1px] hover:bg-bark-700 hover:text-cream-50 active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100"
          >
            <ArrowLeftIcon />
            Kembali
          </button>
        ) : (
          <span />
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            aria-disabled={!canNext}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-[1px] hover:bg-terracotta-600 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100"
          >
            Lanjut
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
}
