"use client";

import { useState } from "react";
import { SectionHeading, CtaButton, Badge, EmptyState } from "@/components/ui";
import { SITE, waLink } from "@/lib/site";
import { submitPartnership } from "@/lib/api";

interface PartnershipKind {
  id: string;
  label: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
}

function EventIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <circle cx="12" cy="15" r="2.2" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M2 9.5 12 4l10 5.5" />
      <path d="M6 11.5V17l6 3 6-3v-5.5" />
      <path d="M22 9.5V15" />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
      <path d="M17.5 3.5 21 5l-1.5 3.5" />
    </svg>
  );
}

function PartnerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M8 12.5 10.5 15l7-8" />
      <path d="M12 21c-4.5 0-9-3.2-9-8v-4a1.5 1.5 0 0 1 2.6-1l2.6 2.9a2 2 0 0 0 3-2.6L13.8 4A1.5 1.5 0 0 1 16.5 5v8c0 4.8-4.5 8-4.5 8Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-sage-600"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 13.9c-.2.6-1.2 1.2-1.7 1.3-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5-.3.6-.6.8-.4 1.1.7 1.2 1.6 2 2.8 2.6.3.2.5.1.7-.1l.8-.9c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.4 0 .1 0 .4-.3 1Z" />
    </svg>
  );
}

const KINDS: PartnershipKind[] = [
  {
    id: "event",
    label: "Kerjasama Event",
    description:
      "Adakan pop up class atau playdate Ziel Kids Club di venue Anda, dari hotel, mal, sampai ruang komunitas.",
    benefits: [
      "Program terstruktur untuk anak usia 6 bulan sampai 6 tahun",
      "Tim fasilitator dan peralatan dari Ziel Kids Club",
      "Aktivitas disesuaikan dengan karakter pengunjung venue",
      "Dokumentasi kegiatan untuk kebutuhan promosi Anda",
    ],
    icon: <EventIcon />,
  },
  {
    id: "ekstrakurikuler",
    label: "Ekstrakurikuler Sekolah",
    description:
      "Program stimulasi tumbuh kembang berkala yang dijalankan di sekolah Anda bersama tim kami.",
    benefits: [
      "Jadwal pendampingan mingguan yang konsisten",
      "Observasi perkembangan tiap anak selama program",
      "Laporan ringkas untuk sekolah dan orang tua",
      "Koordinasi rutin dengan guru pendamping",
    ],
    icon: <SchoolIcon />,
  },
  {
    id: "bootcamp",
    label: "Bootcamp Guru",
    description:
      "Pelatihan praktis untuk guru PAUD dan pendidik anak usia dini dengan pendekatan yang teruji.",
    benefits: [
      "Materi praktis berbasis pendekatan Montessori",
      "Simulasi langsung di setting kelas nyata",
      "Modul pelatihan yang bisa dipakai ulang",
      "Sertifikat partisipasi untuk tiap peserta",
    ],
    icon: <TeacherIcon />,
  },
  {
    id: "lainnya",
    label: "Kerjasama Lainnya",
    description:
      "Punya ide kolaborasi lain? Ruang ini terbuka untuk skema yang belum tercakup di atas.",
    benefits: [
      "Skema fleksibel menyesuaikan kebutuhan Anda",
      "Diskusi eksplorasi tanpa komitmen",
      "Pendampingan tim kami dari awal sampai acara berjalan",
    ],
    icon: <PartnerIcon />,
  },
];

type FormState = {
  name: string;
  institution: string;
  kind: string;
  phone: string;
  message: string;
};

type SubmittedState = FormState & { kindLabel: string };

const INITIAL_FORM: FormState = {
  name: "",
  institution: "",
  kind: "",
  phone: "",
  message: "",
};

function validate(values: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!values.name.trim()) errors.name = "Nama wajib diisi.";
  if (!values.institution.trim())
    errors.institution = "Nama institusi wajib diisi.";
  if (!values.kind) errors.kind = "Pilih salah satu jenis kerjasama.";
  const digits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    errors.phone = "Nomor WhatsApp wajib diisi.";
  } else if (digits.length < 9) {
    errors.phone = "Nomor WhatsApp minimal 9 digit angka.";
  }
  if (!values.message.trim())
    errors.message = "Ceritakan singkat rencana kerjasama Anda.";
  return errors;
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-bark-900 placeholder:text-bark-500/60 transition focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-terracotta-500";

export default function KerjasamaForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>(
    {},
  );
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedState | null>(null);

  function scrollToForm() {
    document
      .getElementById("form-kerjasama")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleCardApply(kindId: string) {
    setForm((f) => ({ ...f, kind: kindId }));
    setErrors((e) => ({ ...e, kind: undefined }));
    setTouched((t) => ({ ...t, kind: true }));
    scrollToForm();
  }

  function setField(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      setErrors(validate({ ...form, [field]: value }));
    }
  }

  function blurField(field: keyof FormState) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    setTouched({
      name: true,
      institution: true,
      kind: true,
      phone: true,
      message: true,
    });
    if (Object.keys(validation).length > 0) {
      const firstInvalid = (
        Object.keys(validation) as (keyof FormState)[]
      )[0];
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }
    setSending(true);
    setSubmitError(null);
    try {
      await submitPartnership({
        name: form.name.trim(),
        institution: form.institution.trim(),
        kind: form.kind,
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      const kindLabel =
        KINDS.find((k) => k.id === form.kind)?.label ?? form.kind;
      setSubmitted({ ...form, kindLabel });
      scrollToForm();
    } catch {
      setSubmitError(
        "Pengajuan belum bisa dikirim saat ini. Silakan coba lagi beberapa saat lagi.",
      );
    } finally {
      setSending(false);
    }
  }

  const cardCtaClasses =
    "inline-flex items-center justify-center rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-[1px] hover:bg-terracotta-600 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2 focus:ring-offset-cream-50 active:translate-y-[1px] active:scale-[0.98]";

  return (
    <div className="bg-cream-50 text-bark-900">
      {/* Header */}
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center md:pt-24">
        <Badge>Kolaborasi</Badge>
        <div className="mt-4">
          <SectionHeading
            title="Bangun Kerjasama dengan Ziel Kids Club"
            subtitle="Kami terbuka berkolaborasi dengan sekolah, hotel, mal, komunitas, dan perusahaan yang peduli pada tumbuh kembang anak usia dini. Pilih skema yang paling cocok, lalu ajukan melalui formulir di bawah."
          />
        </div>
      </section>

      {/* Jenis kerjasama */}
      <section
        aria-labelledby="jenis-heading"
        className="mx-auto max-w-6xl px-4 pb-16"
      >
        <h2 id="jenis-heading" className="sr-only">
          Jenis kerjasama
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {KINDS.map((kind) => (
            <article
              key={kind.id}
              className="flex flex-col rounded-3xl border border-sage-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-600">
                  {kind.icon}
                </span>
                <h3 className="font-display text-xl font-bold text-bark-900">
                  {kind.label}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-bark-700">
                {kind.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2.5">
                {kind.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-bark-800"
                  >
                    <span className="mt-0.5" aria-hidden="true">
                      <CheckIcon />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleCardApply(kind.id)}
                  className={cardCtaClasses}
                >
                  Ajukan Kerjasama
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Form pengajuan */}
      <section
        aria-labelledby="form-heading"
        className="mx-auto max-w-3xl px-4 pb-24"
      >
        <div
          id="form-kerjasama"
          className="scroll-mt-24 rounded-3xl border border-mustard-200 bg-cream-100 p-6 md:p-10"
        >
          {submitted ? (
            <div className="text-center" role="status">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                <CheckIcon />
              </span>
              <h2
                id="form-heading"
                className="mt-4 font-display text-2xl font-bold text-bark-900"
              >
                Pengajuan {submitted.kindLabel} dari {submitted.institution}{" "}
                sudah siap dikirim
              </h2>
              <p className="mx-auto mt-3 max-w-[60ch] text-sm leading-relaxed text-bark-700">
                Terima kasih, {submitted.name}. Tim kami akan menindaklanjuti
                pengajuan Anda melalui WhatsApp ke nomor {submitted.phone}.
                Untuk mempercepat proses, silakan kirim pengajuan ini langsung
                ke admin kami.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CtaButton
                  external
                  variant="primary"
                  href={waLink(
                    `Halo Admin Ziel Kids Club, saya ${submitted.name} dari ${submitted.institution} ingin mengajukan ${submitted.kindLabel}. ${submitted.message} Kontak: ${submitted.phone}`,
                  )}
                >
                  <span className="mr-2 inline-flex" aria-hidden="true">
                    <WhatsAppIcon />
                  </span>
                  Kirim via WhatsApp
                </CtaButton>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setForm(INITIAL_FORM);
                    setErrors({});
                    setTouched({});
                    setSubmitError(null);
                  }}
                  className="inline-flex items-center justify-center rounded-full border-2 border-bark-700 px-6 py-3 text-sm font-bold text-bark-800 transition-all hover:-translate-y-[1px] hover:bg-bark-700 hover:text-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2 focus:ring-offset-cream-100 active:translate-y-[1px] active:scale-[0.98]"
                >
                  Ajukan yang Lain
                </button>
              </div>
            </div>
          ) : (
            <>
              <SectionHeading
                title="Formulir Pengajuan Kerjasama"
                subtitle="Isi data di bawah ini. Semua kolom wajib diisi agar tim kami bisa menindaklanjuti dengan tepat."
              />
              <form
                id="form-kerjasama-inner"
                noValidate
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="field-name"
                    className="mb-1.5 block text-sm font-bold text-bark-900"
                  >
                    Nama Lengkap <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    onBlur={() => blurField("name")}
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    placeholder="Nama Anda"
                    className={`${inputBase} ${
                      errors.name ? "border-terracotta-600" : "border-bark-500/30"
                    }`}
                  />
                  {errors.name && (
                    <p id="err-name" role="alert" className="mt-1.5 text-sm font-semibold text-terracotta-700">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field-institution"
                    className="mb-1.5 block text-sm font-bold text-bark-900"
                  >
                    Institusi / Perusahaan <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-institution"
                    name="institution"
                    type="text"
                    autoComplete="organization"
                    value={form.institution}
                    onChange={(e) => setField("institution", e.target.value)}
                    onBlur={() => blurField("institution")}
                    aria-invalid={errors.institution ? "true" : undefined}
                    aria-describedby={
                      errors.institution ? "err-institution" : undefined
                    }
                    placeholder="Nama sekolah, hotel, mal, atau perusahaan"
                    className={`${inputBase} ${
                      errors.institution
                        ? "border-terracotta-600"
                        : "border-bark-500/30"
                    }`}
                  />
                  {errors.institution && (
                    <p id="err-institution" role="alert" className="mt-1.5 text-sm font-semibold text-terracotta-700">
                      {errors.institution}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field-kind"
                    className="mb-1.5 block text-sm font-bold text-bark-900"
                  >
                    Jenis Kerjasama <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="field-kind"
                    name="kind"
                    value={form.kind}
                    onChange={(e) => setField("kind", e.target.value)}
                    onBlur={() => blurField("kind")}
                    aria-invalid={errors.kind ? "true" : undefined}
                    aria-describedby={errors.kind ? "err-kind" : undefined}
                    className={`${inputBase} ${
                      errors.kind
                        ? "border-terracotta-600"
                        : "border-bark-500/30"
                    } ${form.kind ? "" : "text-bark-500/60"}`}
                  >
                    <option value="" disabled>
                      Pilih jenis kerjasama
                    </option>
                    {KINDS.map((kind) => (
                      <option key={kind.id} value={kind.id}>
                        {kind.label}
                      </option>
                    ))}
                  </select>
                  {errors.kind && (
                    <p id="err-kind" role="alert" className="mt-1.5 text-sm font-semibold text-terracotta-700">
                      {errors.kind}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field-phone"
                    className="mb-1.5 block text-sm font-bold text-bark-900"
                  >
                    Nomor WhatsApp <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    onBlur={() => blurField("phone")}
                    aria-invalid={errors.phone ? "true" : undefined}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                    placeholder="Contoh: 08123456789"
                    className={`${inputBase} ${
                      errors.phone
                        ? "border-terracotta-600"
                        : "border-bark-500/30"
                    }`}
                  />
                  {errors.phone && (
                    <p id="err-phone" role="alert" className="mt-1.5 text-sm font-semibold text-terracotta-700">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field-message"
                    className="mb-1.5 block text-sm font-bold text-bark-900"
                  >
                    Pesan / Rencana Kerjasama <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="field-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    onBlur={() => blurField("message")}
                    aria-invalid={errors.message ? "true" : undefined}
                    aria-describedby={
                      errors.message ? "err-message" : undefined
                    }
                    placeholder="Contoh: Kami ingin mengadakan playdate di lobi hotel pada akhir November 2026 untuk sekitar 30 anak."
                    className={`${inputBase} resize-y ${
                      errors.message
                        ? "border-terracotta-600"
                        : "border-bark-500/30"
                    }`}
                  />
                  {errors.message && (
                    <p id="err-message" role="alert" className="mt-1.5 text-sm font-semibold text-terracotta-700">
                      {errors.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <EmptyState
                    title="Pengajuan belum terkirim"
                    hint={submitError}
                  />
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex w-full items-center justify-center rounded-full bg-terracotta-500 px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-[1px] hover:bg-terracotta-600 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2 focus:ring-offset-cream-100 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {sending ? "Mengirim..." : "Kirim Pengajuan"}
                  </button>
                  <p className="mt-3 text-center text-xs leading-relaxed text-bark-700">
                    Dengan mengirim formulir ini, data Anda digunakan hanya
                    untuk keperluan tindak lanjut kerjasama oleh {SITE.name}.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
