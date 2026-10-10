"use client";

import { useActionState, useState, type FormEvent } from "react";
import { SectionHeading, CtaButton } from "@/components/ui";
import { login } from "./actions";

type FormErrors = {
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MasukPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, submitLogin, submitting] = useActionState(login, null as string | null);

  function validate(): boolean {
    const next: FormErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      next.email = "Email wajib diisi.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Format email tidak valid. Contoh: nama@email.com";
    }

    if (!password) {
      next.password = "Kata sandi wajib diisi.";
    } else if (password.length < 6) {
      next.password = "Kata sandi minimal 6 karakter.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    // Teruskan ke server action login (Supabase Auth).
    // Jika backend belum dikonfigurasi / kredensial salah, tampilkan info jujur.
    const fd = new FormData(event.currentTarget);
    submitLogin(fd);
  }

  const inputClass =
    "w-full rounded-xl border border-bark-500/40 bg-white px-4 py-3 text-bark-900 placeholder:text-bark-500/60 focus:border-terracotta-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500";

  return (
    <section className="mx-auto w-full max-w-md px-4 py-12 md:py-16">
      <SectionHeading
        title="Masuk"
        subtitle="Masuk ke akun Ziel Kids Club Anda. Login resmi akan aktif setelah backend Supabase tersambung."
      />

      <div className="mt-8 rounded-3xl border border-bark-500/20 bg-white p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="masuk-email"
              className="mb-2 block text-sm font-bold text-bark-900"
            >
              Email
            </label>
            <input
              id="masuk-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "masuk-email-error" : undefined}
              className={inputClass}
            />
            {errors.email && (
              <p
                id="masuk-email-error"
                role="alert"
                className="mt-2 text-sm font-semibold text-terracotta-700"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="mt-5">
            <label
              htmlFor="masuk-password"
              className="mb-2 block text-sm font-bold text-bark-900"
            >
              Kata sandi
            </label>
            <input
              id="masuk-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "masuk-password-error" : undefined
              }
              className={inputClass}
            />
            {errors.password && (
              <p
                id="masuk-password-error"
                role="alert"
                className="mt-2 text-sm font-semibold text-terracotta-700"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-full bg-terracotta-500 px-6 py-3 text-base font-bold text-white transition-all hover:-translate-y-[1px] hover:bg-terracotta-600 active:translate-y-[1px] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 disabled:opacity-60"
          >
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {authError && authError !== "NOT_CONFIGURED" && (
          <p role="alert" className="mt-4 text-sm font-semibold text-terracotta-700">
            Login gagal: {authError}
          </p>
        )}
        {authError === "NOT_CONFIGURED" && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-mustard-400/60 bg-mustard-100 p-5"
          >
            <p className="text-sm font-bold uppercase tracking-wide text-bark-900">
              Info
            </p>
            <p className="mt-2 text-sm leading-relaxed text-bark-800">
              Backend Supabase belum tersambung. Login asli akan aktif setelah
              kredensial Supabase dipasang di environment. Untuk demo, gunakan{" "}
              <a
                href="/guru"
                className="font-bold text-terracotta-700 underline underline-offset-2 hover:text-terracotta-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
              >
                Portal Guru
              </a>{" "}
              /{" "}
              <a
                href="/owner"
                className="font-bold text-terracotta-700 underline underline-offset-2 hover:text-terracotta-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
              >
                Portal Owner
              </a>{" "}
              /{" "}
              <a
                href="/orang-tua"
                className="font-bold text-terracotta-700 underline underline-offset-2 hover:text-terracotta-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
              >
                Portal Orang Tua
              </a>
              .
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-xs leading-relaxed text-bark-700">
          Catatan: email dan kata sandi yang Anda masukkan di halaman ini tidak
          dikirim ke mana pun pada tahap ini.
        </p>
      </div>

      <div className="mt-8 text-center">
        <CtaButton href="/" variant="outline">
          Kembali ke Beranda
        </CtaButton>
      </div>
    </section>
  );
}
