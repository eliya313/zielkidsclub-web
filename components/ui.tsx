import type { ReactNode } from "react";
import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  dark = false,
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2
        className={`font-display text-3xl font-bold md:text-4xl ${
          dark ? "text-cream-50" : "text-bark-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-3 max-w-[65ch] text-base leading-relaxed ${
            align === "center" ? "mx-auto" : ""
          } ${dark ? "text-cream-200" : "text-bark-700"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function CtaButton({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  external?: boolean;
}) {
  const styles = {
    primary:
      "bg-terracotta-500 text-white hover:bg-terracotta-600",
    secondary:
      "bg-sage-600 text-white hover:bg-sage-700",
    outline:
      "border-2 border-bark-700 text-bark-800 hover:bg-bark-700 hover:text-cream-50",
  }[variant];
  const cls = `inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-all hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${styles}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sage-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sage-700">
      {children}
    </span>
  );
}

export function Price({ idr }: { idr: number }) {
  if (idr === 0) return <span className="font-bold text-sage-600">Gratis</span>;
  return (
    <span className="font-bold text-bark-900">
      Rp {idr.toLocaleString("id-ID")}
    </span>
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-bark-500/40 bg-cream-100 px-6 py-12 text-center">
      <p className="font-display text-lg font-bold text-bark-800">{title}</p>
      {hint && <p className="mt-2 text-sm text-bark-700">{hint}</p>}
    </div>
  );
}
