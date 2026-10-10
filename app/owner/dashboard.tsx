"use client";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  SectionHeading,
  CtaButton,
  Badge,
  Price,
  EmptyState,
} from "@/components/ui";
import { EVENT_CATEGORIES, OBSERVATION_DOMAINS } from "@/lib/site";
import type {
  AgeSession,
  ClassSession,
  EventCategory,
  ZkcEvent,
} from "@/lib/api";

/* ================= Tipe lokal ================= */

type TabId = "event" | "sesi" | "observasi" | "dokumentasi" | "siswa" | "guru";
type EventPhase = "mendatang" | "berlangsung" | "selesai";

interface EventFormState {
  name: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  priceIdr: string;
  quota: string;
  description: string;
}

interface AgeSessionDraft {
  label: string;
  ageRange: string;
  startTime: string;
  endTime: string;
}

interface Observation {
  id: string;
  studentId: string;
  date: string;
  notes: Record<string, string>;
}

interface DocItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string | null;
}

interface Pupil {
  id: string;
  name: string;
  program: "Reguler" | "Privat";
  packageSessions: number;
  usedSessions: number;
  payment: "Lunas" | "Menunggu" | "Jatuh tempo";
}

interface Teacher {
  id: string;
  name: string;
  role: "Teacher" | "Asisten" | "Admin";
  status: "active" | "inactive";
}

/* ================= Data contoh lokal ================= */

const SAMPLE_STUDENTS = [
  { id: "st-1", name: "Aisyah", age: "3 tahun 2 bulan" },
  { id: "st-2", name: "Bima", age: "2 tahun 6 bulan" },
  { id: "st-3", name: "Citra", age: "4 tahun 1 bulan" },
];

const SAMPLE_PUPILS: Pupil[] = [
  { id: "st-1", name: "Aisyah", program: "Reguler", packageSessions: 12, usedSessions: 5, payment: "Lunas" },
  { id: "st-2", name: "Bima", program: "Reguler", packageSessions: 8, usedSessions: 8, payment: "Lunas" },
  { id: "st-3", name: "Citra", program: "Privat", packageSessions: 16, usedSessions: 3, payment: "Menunggu" },
  { id: "st-4", name: "Dimas", program: "Reguler", packageSessions: 12, usedSessions: 10, payment: "Jatuh tempo" },
];

const SAMPLE_ENROLLMENTS: Record<string, string[]> = {
  "cs-1": ["Aisyah", "Bima"],
  "cs-2": ["Citra", "Dimas"],
  "cs-3": ["Aisyah", "Citra", "Dimas"],
};

const SEED_SESSIONS: ClassSession[] = [
  { id: "cs-1", program: "trial", title: "Trial Class Pagi", date: "2026-10-19", startTime: "09:00", endTime: "10:00", quota: 8, ageGroup: "1-2 tahun" },
  { id: "cs-2", program: "trial", title: "Trial Class Sore", date: "2026-10-21", startTime: "15:00", endTime: "16:00", quota: 8, ageGroup: "2-3 tahun" },
  { id: "cs-3", program: "regular", title: "Regular Class Pagi", date: "2026-10-20", startTime: "09:00", endTime: "10:30", quota: 10, ageGroup: "2-3 tahun" },
];

const SEED_TEACHERS: Teacher[] = [
  { id: "t-1", name: "Fitria Hardiyanti", role: "Teacher", status: "active" },
  { id: "t-2", name: "Contoh Asisten", role: "Asisten", status: "active" },
  { id: "t-3", name: "Contoh Admin", role: "Admin", status: "inactive" },
];

const DOC_CATEGORIES = ["Kegiatan Kelas", "Event", "Fasilitas", "Lainnya"];

const PROGRAM_LABELS: Record<ClassSession["program"], string> = {
  trial: "Trial",
  regular: "Reguler",
  private: "Privat",
};

const PHASE_LABEL: Record<EventPhase, string> = {
  mendatang: "Mendatang",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
};

/* ================= Util & gaya ================= */

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-terracotta-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-bark-500/40 bg-white px-5 py-2.5 text-sm font-bold text-bark-800 transition-colors hover:bg-bark-700 hover:text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600";
const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-full border border-terracotta-500/60 bg-white px-4 py-2 text-sm font-bold text-terracotta-600 transition-colors hover:bg-terracotta-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500";
const inputCls =
  "w-full rounded-xl border border-bark-500/40 bg-white px-3.5 py-2.5 text-sm text-bark-900 placeholder:text-bark-500/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta-500";
const labelCls = "mb-1.5 block text-sm font-bold text-bark-800";
const cardCls =
  "rounded-2xl border border-bark-500/25 bg-white p-5 shadow-sm";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Fase tampilan dipetakan dari field status event (deterministik, aman prerender). */
function eventPhase(status: ZkcEvent["status"]): EventPhase {
  if (status === "completed") return "selesai";
  if (status === "ongoing") return "berlangsung";
  return "mendatang";
}

function categoryLabel(slug: EventCategory): string {
  return EVENT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

/* ================= Ikon SVG inline ================= */

function Icon({ children, className = "h-4 w-4" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const IconCalendar = () => (
  <Icon>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </Icon>
);

const IconClock = () => (
  <Icon>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

const IconChart = () => (
  <Icon>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </Icon>
);

const IconImage = () => (
  <Icon>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </Icon>
);

const IconUsers = () => (
  <Icon>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

const IconKey = () => (
  <Icon>
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </Icon>
);

const IconPlus = () => (
  <Icon>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);

const IconTrash = () => (
  <Icon>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Icon>
);

const IconEdit = () => (
  <Icon>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Icon>
);

const TABS: { id: TabId; label: string; icon: () => ReactNode }[] = [
  { id: "event", label: "Event", icon: IconCalendar },
  { id: "sesi", label: "Sesi Kelas", icon: IconClock },
  { id: "observasi", label: "Perkembangan Siswa", icon: IconChart },
  { id: "dokumentasi", label: "Dokumentasi", icon: IconImage },
  { id: "siswa", label: "Data Siswa", icon: IconUsers },
  { id: "guru", label: "Kelola Akses Guru", icon: IconKey },
];

/* ================= Form kosong ================= */

const EMPTY_EVENT_FORM: EventFormState = {
  name: "",
  category: "popup",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  priceIdr: "",
  quota: "",
  description: "",
};

const EMPTY_AGE_DRAFT: AgeSessionDraft = {
  label: "",
  ageRange: "",
  startTime: "",
  endTime: "",
};

/* ================= Komponen utama ================= */

export default function OwnerDashboard({
  initialEvents,
}: {
  initialEvents: ZkcEvent[];
}) {
  const [authed, setAuthed] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [tab, setTab] = useState<TabId>("event");

  /* --- Event --- */
  const [events, setEvents] = useState<ZkcEvent[]>(initialEvents);
  const [eventForm, setEventForm] = useState<EventFormState>(EMPTY_EVENT_FORM);
  const [ageDrafts, setAgeDrafts] = useState<AgeSessionDraft[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<string | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const flyerInputRef = useRef<HTMLInputElement>(null);

  /* --- Sesi kelas --- */
  const [sessions, setSessions] = useState<ClassSession[]>(SEED_SESSIONS);
  const [sessionForm, setSessionForm] = useState({
    program: "trial" as ClassSession["program"],
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    quota: "",
    ageGroup: "",
  });
  const [confirmDeleteSession, setConfirmDeleteSession] = useState<string | null>(null);

  /* --- Observasi --- */
  const [selectedStudent, setSelectedStudent] = useState(SAMPLE_STUDENTS[0].id);
  const [obsDate, setObsDate] = useState("2026-10-10");
  const [obsNotes, setObsNotes] = useState<Record<string, string>>({});
  const [observations, setObservations] = useState<Observation[]>([]);

  /* --- Dokumentasi --- */
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [docForm, setDocForm] = useState({ title: "", date: "2026-10-10", category: DOC_CATEGORIES[0], description: "" });
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<string | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  /* --- Guru --- */
  const [teachers, setTeachers] = useState<Teacher[]>(SEED_TEACHERS);
  const [teacherForm, setTeacherForm] = useState({ name: "", role: "Teacher" as Teacher["role"], status: "active" as Teacher["status"] });
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [confirmDeleteTeacher, setConfirmDeleteTeacher] = useState<string | null>(null);

  /* ================= Derivasi ================= */

  const groupedEvents = useMemo(() => {
    const g: Record<EventPhase, ZkcEvent[]> = { mendatang: [], berlangsung: [], selesai: [] };
    [...events]
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((e) => g[eventPhase(e.status)].push(e));
    return g;
  }, [events]);

  const totalEvaluasiParticipants = useMemo(
    () => groupedEvents.selesai.reduce((sum, e) => sum + (e.participants ?? 0), 0),
    [groupedEvents]
  );

  const studentObservations = useMemo(
    () => observations.filter((o) => o.studentId === selectedStudent),
    [observations, selectedStudent]
  );

  /* ================= Login demo ================= */

  if (!authed) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-cream-50 px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-bark-500/25 bg-white p-8 shadow-sm">
          <div className="mb-4 flex justify-center">
            <Badge>Data contoh</Badge>
          </div>
          <SectionHeading
            title="Portal Owner"
            subtitle="Halaman demo untuk owner Ziel Kids Club. Masukkan alamat email dan kata sandi apa pun untuk melihat dasbor."
          />
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setAuthed(true);
            }}
          >
            <div>
              <label htmlFor="login-email" className={labelCls}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                className={inputCls}
                placeholder="owner@zielkidsclub.id"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="login-password" className={labelCls}>
                Kata sandi
              </label>
              <input
                id="login-password"
                type="password"
                required
                className={inputCls}
                placeholder="Kata sandi demo"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className={`${btnPrimary} w-full`}>
              Masuk (Demo)
            </button>
          </form>
          <p className="mt-4 text-center text-xs leading-relaxed text-bark-700">
            Ini halaman demo. Tidak ada autentikasi sungguhan dan semua data
            yang ditampilkan adalah data contoh.
          </p>
          <div className="mt-4 flex justify-center">
            <CtaButton href="/" variant="outline">
              Kembali ke beranda
            </CtaButton>
          </div>
        </div>
      </div>
    );
  }

  /* ================= Handler event ================= */

  function setForm<K extends keyof EventFormState>(key: K, value: EventFormState[K]) {
    setEventForm((f) => ({ ...f, [key]: value }));
  }

  function handleFlyerChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (flyerPreview && flyerPreview.startsWith("blob:")) URL.revokeObjectURL(flyerPreview);
    setFlyerPreview(URL.createObjectURL(file));
  }

  function resetEventForm() {
    setEventForm(EMPTY_EVENT_FORM);
    setAgeDrafts([]);
    setEditingEventId(null);
    if (flyerPreview && flyerPreview.startsWith("blob:")) URL.revokeObjectURL(flyerPreview);
    setFlyerPreview(null);
    if (flyerInputRef.current) flyerInputRef.current.value = "";
  }

  function submitEvent(e: FormEvent) {
    e.preventDefault();
    if (!eventForm.name.trim() || !eventForm.date) return;
    const ageSessions: AgeSession[] = ageDrafts
      .filter((d) => d.label.trim())
      .map((d, i) => ({
        id: `as-${Date.now()}-${i}`,
        label: d.label.trim(),
        ageRange: d.ageRange.trim(),
        startTime: d.startTime,
        endTime: d.endTime,
      }));
    if (editingEventId) {
      setEvents((list) =>
        list.map((ev) =>
          ev.id === editingEventId
            ? {
                ...ev,
                name: eventForm.name.trim(),
                category: eventForm.category,
                date: eventForm.date,
                startTime: eventForm.startTime,
                endTime: eventForm.endTime,
                location: eventForm.location.trim(),
                priceIdr: Number(eventForm.priceIdr) || 0,
                quota: eventForm.quota ? Number(eventForm.quota) : undefined,
                description: eventForm.description.trim(),
                flyerUrl: flyerPreview ?? undefined,
                ageSessions,
              }
            : ev
        )
      );
    } else {
      const neu: ZkcEvent = {
        id: `ev-${Date.now()}`,
        name: eventForm.name.trim(),
        category: eventForm.category,
        date: eventForm.date,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        location: eventForm.location.trim(),
        priceIdr: Number(eventForm.priceIdr) || 0,
        quota: eventForm.quota ? Number(eventForm.quota) : undefined,
        participants: 0,
        description: eventForm.description.trim(),
        flyerUrl: flyerPreview ?? undefined,
        status: "upcoming",
        ageSessions,
      };
      setEvents((list) => [neu, ...list]);
    }
    resetEventForm();
  }

  function startEditEvent(ev: ZkcEvent) {
    setEditingEventId(ev.id);
    setEventForm({
      name: ev.name,
      category: ev.category,
      date: ev.date,
      startTime: ev.startTime,
      endTime: ev.endTime,
      location: ev.location,
      priceIdr: String(ev.priceIdr),
      quota: ev.quota ? String(ev.quota) : "",
      description: ev.description,
    });
    setAgeDrafts(
      ev.ageSessions.map((a) => ({
        label: a.label,
        ageRange: a.ageRange,
        startTime: a.startTime,
        endTime: a.endTime,
      }))
    );
    setFlyerPreview(ev.flyerUrl ?? null);
    setConfirmDeleteEvent(null);
  }

  /* ================= Handler sesi ================= */

  function submitSession(e: FormEvent) {
    e.preventDefault();
    if (!sessionForm.title.trim() || !sessionForm.date) return;
    const neu: ClassSession = {
      id: `cs-${Date.now()}`,
      program: sessionForm.program,
      title: sessionForm.title.trim(),
      date: sessionForm.date,
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      quota: Number(sessionForm.quota) || 0,
      ageGroup: sessionForm.ageGroup.trim() || undefined,
    };
    setSessions((list) => [neu, ...list]);
    setSessionForm({ program: "trial", title: "", date: "", startTime: "", endTime: "", quota: "", ageGroup: "" });
  }

  /* ================= Handler observasi ================= */

  function submitObservation(e: FormEvent) {
    e.preventDefault();
    const filled = OBSERVATION_DOMAINS.some((d) => (obsNotes[d.key] ?? "").trim());
    if (!filled) return;
    setObservations((list) => [
      { id: `ob-${Date.now()}`, studentId: selectedStudent, date: obsDate, notes: { ...obsNotes } },
      ...list,
    ]);
    setObsNotes({});
  }

  /* ================= Handler dokumentasi ================= */

  function handleDocImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (docPreview && docPreview.startsWith("blob:")) URL.revokeObjectURL(docPreview);
    setDocPreview(URL.createObjectURL(file));
  }

  function submitDoc(e: FormEvent) {
    e.preventDefault();
    if (!docForm.title.trim() || !docForm.date) return;
    setDocs((list) => [
      {
        id: `doc-${Date.now()}`,
        title: docForm.title.trim(),
        date: docForm.date,
        category: docForm.category,
        description: docForm.description.trim(),
        image: docPreview,
      },
      ...list,
    ]);
    setDocForm({ title: "", date: "2026-10-10", category: DOC_CATEGORIES[0], description: "" });
    setDocPreview(null);
    if (docInputRef.current) docInputRef.current.value = "";
  }

  /* ================= Handler guru ================= */

  function submitTeacher(e: FormEvent) {
    e.preventDefault();
    if (!teacherForm.name.trim()) return;
    if (editingTeacherId) {
      setTeachers((list) =>
        list.map((t) =>
          t.id === editingTeacherId
            ? { ...t, name: teacherForm.name.trim(), role: teacherForm.role, status: teacherForm.status }
            : t
        )
      );
    } else {
      setTeachers((list) => [
        ...list,
        { id: `t-${Date.now()}`, name: teacherForm.name.trim(), role: teacherForm.role, status: teacherForm.status },
      ]);
    }
    setTeacherForm({ name: "", role: "Teacher", status: "active" });
    setEditingTeacherId(null);
  }

  function startEditTeacher(t: Teacher) {
    setEditingTeacherId(t.id);
    setTeacherForm({ name: t.name, role: t.role, status: t.status });
    setConfirmDeleteTeacher(null);
  }

  /* ================= Render ================= */

  const activeTabLabel = TABS.find((t) => t.id === tab)?.label ?? "";

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Kepala */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3">
              <Badge>Data contoh</Badge>
            </div>
            <SectionHeading
              align="left"
              title="Portal Owner"
              subtitle="Kelola event, sesi kelas, perkembangan siswa, dokumentasi, data siswa, dan akses guru. Semua perubahan tersimpan lokal di sesi ini dan tidak dikirim ke server."
            />
          </div>
          <button
            type="button"
            className={btnGhost}
            onClick={() => setAuthed(false)}
          >
            Keluar
          </button>
        </div>

        {/* Tab */}
        <div
          role="tablist"
          aria-label="Navigasi portal owner"
          className="mt-8 flex flex-wrap gap-2"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            const TabIcon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`owner-tab-${t.id}`}
                aria-selected={active}
                aria-controls={`owner-panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 ${
                  active
                    ? "bg-terracotta-600 text-white"
                    : "border border-bark-500/40 bg-white text-bark-800 hover:bg-bark-700 hover:text-cream-50"
                }`}
              >
                <TabIcon />
                {t.label}
              </button>
            );
          })}
        </div>

        <h3 className="sr-only">{activeTabLabel}</h3>

        {/* ================= TAB EVENT ================= */}
        {tab === "event" && (
          <section
            role="tabpanel"
            id="owner-panel-event"
            aria-labelledby="owner-tab-event"
            className="mt-8 space-y-8"
          >
            <div className={cardCls}>
              <h3 className="font-display text-xl font-bold text-bark-900">
                {editingEventId ? "Ubah event" : "Tambah event baru"}
              </h3>
              <form onSubmit={submitEvent} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="ev-name" className={labelCls}>Nama event *</label>
                  <input id="ev-name" required className={inputCls} value={eventForm.name}
                    onChange={(e) => setForm("name", e.target.value)} placeholder="Contoh: Pop Up Class Sensory Play" />
                </div>
                <div>
                  <label htmlFor="ev-category" className={labelCls}>Kategori *</label>
                  <select id="ev-category" className={inputCls} value={eventForm.category}
                    onChange={(e) => setForm("category", e.target.value as EventCategory)}>
                    {EVENT_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ev-date" className={labelCls}>Tanggal *</label>
                  <input id="ev-date" type="date" required className={inputCls} value={eventForm.date}
                    onChange={(e) => setForm("date", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="ev-start" className={labelCls}>Jam mulai</label>
                  <input id="ev-start" type="time" className={inputCls} value={eventForm.startTime}
                    onChange={(e) => setForm("startTime", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="ev-end" className={labelCls}>Jam selesai</label>
                  <input id="ev-end" type="time" className={inputCls} value={eventForm.endTime}
                    onChange={(e) => setForm("endTime", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="ev-location" className={labelCls}>Lokasi</label>
                  <input id="ev-location" className={inputCls} value={eventForm.location}
                    onChange={(e) => setForm("location", e.target.value)} placeholder="Contoh: Ziel Kids Club, Malang" />
                </div>
                <div>
                  <label htmlFor="ev-price" className={labelCls}>Harga (Rp, 0 = gratis)</label>
                  <input id="ev-price" type="number" min={0} className={inputCls} value={eventForm.priceIdr}
                    onChange={(e) => setForm("priceIdr", e.target.value)} placeholder="75000" />
                </div>
                <div>
                  <label htmlFor="ev-quota" className={labelCls}>Kuota peserta</label>
                  <input id="ev-quota" type="number" min={0} className={inputCls} value={eventForm.quota}
                    onChange={(e) => setForm("quota", e.target.value)} placeholder="20" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="ev-desc" className={labelCls}>Deskripsi</label>
                  <textarea id="ev-desc" rows={3} className={inputCls} value={eventForm.description}
                    onChange={(e) => setForm("description", e.target.value)} placeholder="Ceritakan isi dan tujuan event" />
                </div>

                {/* Sesi per usia dinamis */}
                <div className="md:col-span-2 rounded-xl border border-bark-500/25 bg-cream-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-bark-800">Sesi per kelompok usia</p>
                    <button
                      type="button"
                      className={btnGhost + " !px-4 !py-1.5 !text-xs"}
                      onClick={() => setAgeDrafts((d) => [...d, { ...EMPTY_AGE_DRAFT }])}
                    >
                      <IconPlus /> Tambah sesi
                    </button>
                  </div>
                  {ageDrafts.length === 0 && (
                    <p className="mt-2 text-xs text-bark-700">Belum ada sesi usia. Tambahkan bila event dibagi per kelompok usia.</p>
                  )}
                  {ageDrafts.map((d, i) => (
                    <div key={i} className="mt-3 grid grid-cols-1 gap-2 rounded-xl bg-white p-3 sm:grid-cols-2 lg:grid-cols-5">
                      <input className={inputCls} placeholder="Label sesi" aria-label={`Label sesi usia ${i + 1}`}
                        value={d.label} onChange={(e) => setAgeDrafts((list) => list.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                      <input className={inputCls} placeholder="Rentang usia" aria-label={`Rentang usia sesi ${i + 1}`}
                        value={d.ageRange} onChange={(e) => setAgeDrafts((list) => list.map((x, j) => j === i ? { ...x, ageRange: e.target.value } : x))} />
                      <input type="time" className={inputCls} aria-label={`Jam mulai sesi ${i + 1}`}
                        value={d.startTime} onChange={(e) => setAgeDrafts((list) => list.map((x, j) => j === i ? { ...x, startTime: e.target.value } : x))} />
                      <input type="time" className={inputCls} aria-label={`Jam selesai sesi ${i + 1}`}
                        value={d.endTime} onChange={(e) => setAgeDrafts((list) => list.map((x, j) => j === i ? { ...x, endTime: e.target.value } : x))} />
                      <button
                        type="button"
                        aria-label={`Hapus sesi usia ${i + 1}`}
                        className="inline-flex items-center justify-center rounded-full p-2 text-terracotta-600 hover:bg-terracotta-50 focus-visible:outline-2 focus-visible:outline-terracotta-500"
                        onClick={() => setAgeDrafts((list) => list.filter((_, j) => j !== i))}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload flyer */}
                <div className="md:col-span-2">
                  <label htmlFor="ev-flyer" className={labelCls}>Flyer event</label>
                  <input
                    id="ev-flyer"
                    ref={flyerInputRef}
                    type="file"
                    accept="image/*"
                    className="text-sm text-bark-800 file:mr-3 file:rounded-full file:border-0 file:bg-sage-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-sage-700"
                    onChange={handleFlyerChange}
                  />
                  {flyerPreview && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-bark-700">Pratinjau:</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flyerPreview} alt="Pratinjau flyer event" className="mt-2 max-h-48 rounded-xl border border-bark-500/25 object-contain" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button type="submit" className={btnPrimary}>
                    {editingEventId ? "Simpan perubahan" : "Tambah event"}
                  </button>
                  {editingEventId && (
                    <button type="button" className={btnGhost} onClick={resetEventForm}>
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Daftar event per status */}
            {(Object.keys(groupedEvents) as EventPhase[]).map((phase) => (
              <div key={phase}>
                <h3 className="mb-4 font-display text-xl font-bold text-bark-900">
                  {PHASE_LABEL[phase]}
                  <span className="ml-2 text-sm font-normal text-bark-700">
                    ({groupedEvents[phase].length})
                  </span>
                </h3>
                {groupedEvents[phase].length === 0 ? (
                  <EmptyState title="Belum ada event" hint="Tambahkan event baru melalui formulir di atas." />
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {groupedEvents[phase].map((ev) => (
                      <article key={ev.id} className={cardCls}>
                        <div className="flex items-start justify-between gap-2">
                          <Badge>{categoryLabel(ev.category)}</Badge>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                              phase === "mendatang"
                                ? "bg-sage-100 text-sage-700"
                                : phase === "berlangsung"
                                  ? "bg-mustard-100 text-mustard-700"
                                  : "bg-bark-500/15 text-bark-700"
                            }`}
                          >
                            {PHASE_LABEL[phase]}
                          </span>
                        </div>
                        <h4 className="mt-3 font-display text-lg font-bold text-bark-900">{ev.name}</h4>
                        <p className="mt-1 text-sm text-bark-700">
                          {formatDate(ev.date)}
                          {ev.startTime && `, ${ev.startTime}${ev.endTime ? `-${ev.endTime}` : ""}`}
                        </p>
                        {ev.location && <p className="mt-1 text-sm text-bark-700">{ev.location}</p>}
                        {ev.description && (
                          <p className="mt-2 text-sm leading-relaxed text-bark-800">{ev.description}</p>
                        )}
                        {ev.ageSessions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {ev.ageSessions.map((a) => (
                              <span key={a.id} className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-bold text-bark-800">
                                {a.label}{a.ageRange ? ` (${a.ageRange})` : ""}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <Price idr={ev.priceIdr} />
                          {typeof ev.quota === "number" && (
                            <span className="text-bark-700">Kuota: {ev.quota}</span>
                          )}
                          {typeof ev.participants === "number" && (
                            <span className="text-bark-700">Peserta: {ev.participants}</span>
                          )}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button type="button" className={btnGhost + " !px-4 !py-1.5 !text-xs"}
                            onClick={() => startEditEvent(ev)}>
                            <IconEdit /> Ubah
                          </button>
                          {confirmDeleteEvent === ev.id ? (
                            <div className="flex items-center gap-2 rounded-full border border-terracotta-500/60 bg-terracotta-50 px-3 py-1.5">
                              <span className="text-xs font-bold text-terracotta-700">Hapus event ini?</span>
                              <button
                                type="button"
                                className="rounded-full bg-terracotta-600 px-3 py-1 text-xs font-bold text-white hover:bg-terracotta-700"
                                onClick={() => {
                                  setEvents((list) => list.filter((x) => x.id !== ev.id));
                                  setConfirmDeleteEvent(null);
                                }}
                              >
                                Ya, hapus
                              </button>
                              <button
                                type="button"
                                className="rounded-full px-3 py-1 text-xs font-bold text-bark-800 hover:bg-white"
                                onClick={() => setConfirmDeleteEvent(null)}
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button type="button" className={btnDanger + " !px-4 !py-1.5 !text-xs"}
                              onClick={() => setConfirmDeleteEvent(ev.id)}>
                              <IconTrash /> Hapus
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Bahan evaluasi */}
            <div className="rounded-2xl border border-mustard-500/40 bg-mustard-50 p-5">
              <h3 className="font-display text-xl font-bold text-bark-900">Bahan evaluasi</h3>
              <p className="mt-1 text-sm text-bark-700">
                Event selesai: {groupedEvents.selesai.length}. Total peserta seluruh event selesai:{" "}
                <strong>{totalEvaluasiParticipants}</strong>. Gunakan ringkasan ini sebagai bahan evaluasi program.
              </p>
              {groupedEvents.selesai.length === 0 ? (
                <p className="mt-3 text-sm text-bark-700">Belum ada event selesai.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {groupedEvents.selesai.map((ev) => (
                    <li key={ev.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-2.5 text-sm">
                      <span className="font-bold text-bark-900">
                        {ev.name} <span className="font-normal text-bark-700">({formatDate(ev.date)})</span>
                      </span>
                      <span className="text-bark-700">
                        Peserta: <strong>{ev.participants ?? 0}</strong>
                        {typeof ev.quota === "number" && ` dari kuota ${ev.quota}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* ================= TAB SESI KELAS ================= */}
        {tab === "sesi" && (
          <section role="tabpanel" id="owner-panel-sesi" aria-labelledby="owner-tab-sesi" className="mt-8 space-y-8">
            <div className={cardCls}>
              <h3 className="font-display text-xl font-bold text-bark-900">Tambah sesi kelas</h3>
              <form onSubmit={submitSession} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="ss-program" className={labelCls}>Program *</label>
                  <select id="ss-program" className={inputCls} value={sessionForm.program}
                    onChange={(e) => setSessionForm((f) => ({ ...f, program: e.target.value as ClassSession["program"] }))}>
                    <option value="trial">Trial</option>
                    <option value="regular">Reguler</option>
                    <option value="private">Privat</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ss-title" className={labelCls}>Judul sesi *</label>
                  <input id="ss-title" required className={inputCls} value={sessionForm.title}
                    onChange={(e) => setSessionForm((f) => ({ ...f, title: e.target.value }))} placeholder="Contoh: Trial Class Pagi" />
                </div>
                <div>
                  <label htmlFor="ss-date" className={labelCls}>Tanggal *</label>
                  <input id="ss-date" type="date" required className={inputCls} value={sessionForm.date}
                    onChange={(e) => setSessionForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="ss-age" className={labelCls}>Kelompok usia</label>
                  <input id="ss-age" className={inputCls} value={sessionForm.ageGroup}
                    onChange={(e) => setSessionForm((f) => ({ ...f, ageGroup: e.target.value }))} placeholder="Contoh: 1-2 tahun" />
                </div>
                <div>
                  <label htmlFor="ss-start" className={labelCls}>Jam mulai</label>
                  <input id="ss-start" type="time" className={inputCls} value={sessionForm.startTime}
                    onChange={(e) => setSessionForm((f) => ({ ...f, startTime: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="ss-end" className={labelCls}>Jam selesai</label>
                  <input id="ss-end" type="time" className={inputCls} value={sessionForm.endTime}
                    onChange={(e) => setSessionForm((f) => ({ ...f, endTime: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="ss-quota" className={labelCls}>Kuota</label>
                  <input id="ss-quota" type="number" min={0} className={inputCls} value={sessionForm.quota}
                    onChange={(e) => setSessionForm((f) => ({ ...f, quota: e.target.value }))} placeholder="8" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className={btnPrimary}>Tambah sesi</button>
                </div>
              </form>
            </div>

            <div>
              <h3 className="mb-4 font-display text-xl font-bold text-bark-900">
                Daftar sesi kelas <span className="text-sm font-normal text-bark-700">({sessions.length})</span>
              </h3>
              {sessions.length === 0 ? (
                <EmptyState title="Belum ada sesi kelas" hint="Tambahkan sesi baru melalui formulir di atas." />
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {sessions.map((s) => (
                    <article key={s.id} className={cardCls}>
                      <div className="flex items-start justify-between gap-2">
                        <Badge>{PROGRAM_LABELS[s.program]}</Badge>
                        {confirmDeleteSession === s.id ? (
                          <div className="flex items-center gap-2 rounded-full border border-terracotta-500/60 bg-terracotta-50 px-3 py-1.5">
                            <span className="text-xs font-bold text-terracotta-700">Hapus sesi ini?</span>
                            <button type="button" className="rounded-full bg-terracotta-600 px-3 py-1 text-xs font-bold text-white hover:bg-terracotta-700"
                              onClick={() => { setSessions((list) => list.filter((x) => x.id !== s.id)); setConfirmDeleteSession(null); }}>
                              Ya, hapus
                            </button>
                            <button type="button" className="rounded-full px-3 py-1 text-xs font-bold text-bark-800 hover:bg-white"
                              onClick={() => setConfirmDeleteSession(null)}>
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button type="button" className={btnDanger + " !px-4 !py-1.5 !text-xs"}
                            onClick={() => setConfirmDeleteSession(s.id)}>
                            <IconTrash /> Hapus
                          </button>
                        )}
                      </div>
                      <h4 className="mt-3 font-display text-lg font-bold text-bark-900">{s.title}</h4>
                      <p className="mt-1 text-sm text-bark-700">
                        {formatDate(s.date)}
                        {s.startTime && `, ${s.startTime}${s.endTime ? `-${s.endTime}` : ""}`}
                      </p>
                      <p className="mt-1 text-sm text-bark-700">
                        Kuota: {s.quota}{s.ageGroup ? ` | Usia: ${s.ageGroup}` : ""}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= TAB PERKEMBANGAN SISWA ================= */}
        {tab === "observasi" && (
          <section role="tabpanel" id="owner-panel-observasi" aria-labelledby="owner-tab-observasi" className="mt-8 space-y-8">
            <div className={cardCls}>
              <h3 className="font-display text-xl font-bold text-bark-900">Catat observasi perkembangan</h3>
              <p className="mt-1 text-sm text-bark-700">
                Catatan observasi ini dipakai untuk pendampingan pembelajaran, bukan untuk menetapkan diagnosis apa pun.
              </p>
              <form onSubmit={submitObservation} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="ob-student" className={labelCls}>Siswa *</label>
                    <select id="ob-student" className={inputCls} value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}>
                      {SAMPLE_STUDENTS.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.age})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ob-date" className={labelCls}>Tanggal observasi *</label>
                    <input id="ob-date" type="date" required className={inputCls} value={obsDate}
                      onChange={(e) => setObsDate(e.target.value)} />
                  </div>
                </div>
                {OBSERVATION_DOMAINS.map((d) => (
                  <div key={d.key}>
                    <label htmlFor={`ob-${d.key}`} className={labelCls}>{d.label}</label>
                    <textarea
                      id={`ob-${d.key}`}
                      rows={2}
                      className={inputCls}
                      placeholder={`Catatan teramati untuk ${d.label.toLowerCase()}`}
                      value={obsNotes[d.key] ?? ""}
                      onChange={(e) => setObsNotes((n) => ({ ...n, [d.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <button type="submit" className={btnPrimary}>Simpan observasi</button>
              </form>
            </div>

            <div>
              <h3 className="mb-4 font-display text-xl font-bold text-bark-900">
                Riwayat observasi {SAMPLE_STUDENTS.find((s) => s.id === selectedStudent)?.name}
                <span className="ml-2 text-sm font-normal text-bark-700">({studentObservations.length})</span>
              </h3>
              {studentObservations.length === 0 ? (
                <EmptyState title="Belum ada observasi" hint="Isi formulir di atas untuk mencatat observasi pertama." />
              ) : (
                <div className="space-y-4">
                  {studentObservations.map((o) => (
                    <article key={o.id} className={cardCls}>
                      <p className="text-sm font-bold text-bark-800">{formatDate(o.date)}</p>
                      <dl className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {OBSERVATION_DOMAINS.filter((d) => (o.notes[d.key] ?? "").trim()).map((d) => (
                          <div key={d.key} className="rounded-xl bg-cream-100 p-3">
                            <dt className="text-xs font-bold uppercase tracking-wide text-bark-700">{d.label}</dt>
                            <dd className="mt-1 text-sm leading-relaxed text-bark-900">{o.notes[d.key]}</dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= TAB DOKUMENTASI ================= */}
        {tab === "dokumentasi" && (
          <section role="tabpanel" id="owner-panel-dokumentasi" aria-labelledby="owner-tab-dokumentasi" className="mt-8 space-y-8">
            <div className={cardCls}>
              <h3 className="font-display text-xl font-bold text-bark-900">Tambah dokumentasi</h3>
              <form onSubmit={submitDoc} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="dc-title" className={labelCls}>Judul *</label>
                  <input id="dc-title" required className={inputCls} value={docForm.title}
                    onChange={(e) => setDocForm((f) => ({ ...f, title: e.target.value }))} placeholder="Contoh: Kegiatan sensory play 10 Oktober" />
                </div>
                <div>
                  <label htmlFor="dc-date" className={labelCls}>Tanggal *</label>
                  <input id="dc-date" type="date" required className={inputCls} value={docForm.date}
                    onChange={(e) => setDocForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="dc-cat" className={labelCls}>Kategori</label>
                  <select id="dc-cat" className={inputCls} value={docForm.category}
                    onChange={(e) => setDocForm((f) => ({ ...f, category: e.target.value }))}>
                    {DOC_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="dc-desc" className={labelCls}>Deskripsi</label>
                  <textarea id="dc-desc" rows={3} className={inputCls} value={docForm.description}
                    onChange={(e) => setDocForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="dc-img" className={labelCls}>Foto</label>
                  <input id="dc-img" ref={docInputRef} type="file" accept="image/*"
                    className="text-sm text-bark-800 file:mr-3 file:rounded-full file:border-0 file:bg-sage-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-sage-700"
                    onChange={handleDocImage} />
                  {docPreview && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-bark-700">Pratinjau:</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={docPreview} alt="Pratinjau foto dokumentasi" className="mt-2 max-h-48 rounded-xl border border-bark-500/25 object-contain" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className={btnPrimary}>Tambah dokumentasi</button>
                </div>
              </form>
            </div>

            <div>
              <h3 className="mb-4 font-display text-xl font-bold text-bark-900">
                Arsip dokumentasi <span className="text-sm font-normal text-bark-700">({docs.length})</span>
              </h3>
              {docs.length === 0 ? (
                <EmptyState title="Belum ada dokumentasi" hint="Tambahkan dokumentasi kegiatan melalui formulir di atas." />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {docs.map((d) => (
                    <article key={d.id} className={cardCls}>
                      {d.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={d.image} alt={d.title} className="mb-3 aspect-video w-full rounded-xl object-cover" />
                      )}
                      <Badge>{d.category}</Badge>
                      <h4 className="mt-2 font-display text-base font-bold text-bark-900">{d.title}</h4>
                      <p className="text-xs text-bark-700">{formatDate(d.date)}</p>
                      {d.description && <p className="mt-2 text-sm leading-relaxed text-bark-800">{d.description}</p>}
                      {confirmDeleteDoc === d.id ? (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs font-bold text-terracotta-700">Hapus?</span>
                          <button type="button" className="rounded-full bg-terracotta-600 px-3 py-1 text-xs font-bold text-white hover:bg-terracotta-700"
                            onClick={() => { setDocs((list) => list.filter((x) => x.id !== d.id)); setConfirmDeleteDoc(null); }}>
                            Ya
                          </button>
                          <button type="button" className="rounded-full px-3 py-1 text-xs font-bold text-bark-800 hover:bg-cream-100"
                            onClick={() => setConfirmDeleteDoc(null)}>
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button type="button" className={btnDanger + " mt-3 !px-4 !py-1.5 !text-xs"}
                          onClick={() => setConfirmDeleteDoc(d.id)}>
                          <IconTrash /> Hapus
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= TAB DATA SISWA ================= */}
        {tab === "siswa" && (
          <section role="tabpanel" id="owner-panel-siswa" aria-labelledby="owner-tab-siswa" className="mt-8 space-y-8">
            <div className={cardCls}>
              <h3 className="font-display text-xl font-bold text-bark-900">Data siswa</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-bark-500/25 text-xs uppercase tracking-wide text-bark-700">
                      <th scope="col" className="px-3 py-2.5">Nama</th>
                      <th scope="col" className="px-3 py-2.5">Program</th>
                      <th scope="col" className="px-3 py-2.5">Paket sesi</th>
                      <th scope="col" className="px-3 py-2.5">Terpakai</th>
                      <th scope="col" className="px-3 py-2.5">Sisa sesi</th>
                      <th scope="col" className="px-3 py-2.5">Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_PUPILS.map((p) => (
                      <tr key={p.id} className="border-b border-bark-500/15 last:border-0">
                        <td className="px-3 py-3 font-bold text-bark-900">{p.name}</td>
                        <td className="px-3 py-3 text-bark-800">{p.program}</td>
                        <td className="px-3 py-3 text-bark-800">{p.packageSessions}x</td>
                        <td className="px-3 py-3 text-bark-800">{p.usedSessions}x</td>
                        <td className="px-3 py-3 font-bold text-bark-900">{p.packageSessions - p.usedSessions}x</td>
                        <td className="px-3 py-3">
                          {p.payment === "Lunas" ? (
                            <Badge>Lunas</Badge>
                          ) : (
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                p.payment === "Menunggu"
                                  ? "bg-mustard-100 text-mustard-700"
                                  : "bg-terracotta-100 text-terracotta-700"
                              }`}
                            >
                              {p.payment}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-display text-xl font-bold text-bark-900">Daftar siswa per sesi</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {sessions.map((s) => {
                  const enrolled = SAMPLE_ENROLLMENTS[s.id] ?? [];
                  return (
                    <article key={s.id} className={cardCls}>
                      <div className="flex items-start justify-between gap-2">
                        <Badge>{PROGRAM_LABELS[s.program]}</Badge>
                        <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-bold text-bark-800">
                          {enrolled.length} terdaftar
                        </span>
                      </div>
                      <h4 className="mt-2 font-display text-base font-bold text-bark-900">{s.title}</h4>
                      <p className="text-xs text-bark-700">
                        {formatDate(s.date)}
                        {s.startTime && `, ${s.startTime}${s.endTime ? `-${s.endTime}` : ""}`}
                      </p>
                      {enrolled.length === 0 ? (
                        <p className="mt-3 text-sm text-bark-700">Belum ada siswa terdaftar di sesi ini.</p>
                      ) : (
                        <ul className="mt-3 space-y-1.5">
                          {enrolled.map((name) => (
                            <li key={name} className="flex items-center gap-2 text-sm text-bark-800">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage-600" aria-hidden="true" />
                              {name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB KELOLA AKSES GURU ================= */}
        {tab === "guru" && (
          <section role="tabpanel" id="owner-panel-guru" aria-labelledby="owner-tab-guru" className="mt-8 space-y-8">
            <div className={cardCls}>
              <h3 className="font-display text-xl font-bold text-bark-900">
                {editingTeacherId ? "Ubah data guru" : "Tambah guru"}
              </h3>
              <form onSubmit={submitTeacher} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="t-name" className={labelCls}>Nama lengkap *</label>
                  <input id="t-name" required className={inputCls} value={teacherForm.name}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Contoh: Fitria Hardiyanti" />
                </div>
                <div>
                  <label htmlFor="t-role" className={labelCls}>Peran *</label>
                  <select id="t-role" className={inputCls} value={teacherForm.role}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, role: e.target.value as Teacher["role"] }))}>
                    <option value="Teacher">Teacher</option>
                    <option value="Asisten">Asisten</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="t-status" className={labelCls}>Status *</label>
                  <select id="t-status" className={inputCls} value={teacherForm.status}
                    onChange={(e) => setTeacherForm((f) => ({ ...f, status: e.target.value as Teacher["status"] }))}>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-3 md:col-span-3">
                  <button type="submit" className={btnPrimary}>
                    {editingTeacherId ? "Simpan perubahan" : "Tambah guru"}
                  </button>
                  {editingTeacherId && (
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => {
                        setEditingTeacherId(null);
                        setTeacherForm({ name: "", role: "Teacher", status: "active" });
                      }}
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className={cardCls}>
              <h3 className="font-display text-xl font-bold text-bark-900">
                Daftar guru <span className="text-sm font-normal text-bark-700">({teachers.length})</span>
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-bark-500/25 text-xs uppercase tracking-wide text-bark-700">
                      <th scope="col" className="px-3 py-2.5">Nama</th>
                      <th scope="col" className="px-3 py-2.5">Peran</th>
                      <th scope="col" className="px-3 py-2.5">Status</th>
                      <th scope="col" className="px-3 py-2.5"><span className="sr-only">Aksi</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.id} className="border-b border-bark-500/15 last:border-0">
                        <td className="px-3 py-3 font-bold text-bark-900">{t.name}</td>
                        <td className="px-3 py-3 text-bark-800">{t.role}</td>
                        <td className="px-3 py-3">
                          {t.status === "active" ? (
                            <Badge>Aktif</Badge>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-bark-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-bark-700">
                              Nonaktif
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button type="button" className={btnGhost + " !px-4 !py-1.5 !text-xs"}
                              onClick={() => startEditTeacher(t)}>
                              <IconEdit /> Ubah
                            </button>
                            {confirmDeleteTeacher === t.id ? (
                              <div className="flex items-center gap-2 rounded-full border border-terracotta-500/60 bg-terracotta-50 px-3 py-1.5">
                                <span className="text-xs font-bold text-terracotta-700">Hapus?</span>
                                <button type="button" className="rounded-full bg-terracotta-600 px-3 py-1 text-xs font-bold text-white hover:bg-terracotta-700"
                                  onClick={() => {
                                    setTeachers((list) => list.filter((x) => x.id !== t.id));
                                    setConfirmDeleteTeacher(null);
                                    if (editingTeacherId === t.id) {
                                      setEditingTeacherId(null);
                                      setTeacherForm({ name: "", role: "Teacher", status: "active" });
                                    }
                                  }}>
                                  Ya
                                </button>
                                <button type="button" className="rounded-full px-3 py-1 text-xs font-bold text-bark-800 hover:bg-white"
                                  onClick={() => setConfirmDeleteTeacher(null)}>
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button type="button" className={btnDanger + " !px-4 !py-1.5 !text-xs"}
                                onClick={() => setConfirmDeleteTeacher(t.id)}>
                                <IconTrash /> Hapus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
