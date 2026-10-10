"use client";

import { useState } from "react";
import { SectionHeading, CtaButton, Badge, Price, EmptyState } from "@/components/ui";
import { EVENT_CATEGORIES, OBSERVATION_DOMAINS } from "@/lib/site";
import type { ZkcEvent, AgeSession, EventCategory } from "@/lib/api";

type TabKey = "event" | "sesi" | "perkembangan" | "dokumentasi" | "siswa";

const TABS: { key: TabKey; label: string }[] = [
  { key: "event", label: "Event" },
  { key: "sesi", label: "Sesi Kelas" },
  { key: "perkembangan", label: "Perkembangan Siswa" },
  { key: "dokumentasi", label: "Dokumentasi" },
  { key: "siswa", label: "Data Siswa" },
];

const PROGRAMS = [
  { value: "trial", label: "Trial" },
  { value: "regular", label: "Reguler" },
  { value: "private", label: "Privat" },
] as const;

const DEMO_STUDENTS = [
  {
    id: "s1",
    name: "Aisyah Zahra",
    parent: "Bunda Ratna",
    paid: true,
    sisaSesi: 8,
    ringkasan: "Trial 2/2 selesai, Reguler 8/12 berjalan",
  },
  {
    id: "s2",
    name: "Bima Pradipta",
    parent: "Ayah Dimas",
    paid: false,
    sisaSesi: 3,
    ringkasan: "Reguler 9/12 berjalan",
  },
  {
    id: "s3",
    name: "Citra Ayu Lestari",
    parent: "Bunda Sari",
    paid: true,
    sisaSesi: 12,
    ringkasan: "Reguler 0/12 baru mulai",
  },
  {
    id: "s4",
    name: "Daffa Ramadhan",
    parent: "Ayah Budi",
    paid: false,
    sisaSesi: 1,
    ringkasan: "Trial 1/2 berjalan",
  },
];

const categoryLabel = (slug: string) =>
  EVENT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

/** Status tampilan dipetakan dari field status event (deterministik, aman prerender). */
function statusFromEvent(
  status: ZkcEvent["status"]
): "Mendatang" | "Berlangsung" | "Selesai" {
  if (status === "completed") return "Selesai";
  if (status === "ongoing") return "Berlangsung";
  return "Mendatang";
}

function formatDateId(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const inputCls =
  "w-full rounded-xl border border-bark-300 bg-white px-3 py-2 text-sm text-bark-900 placeholder:text-bark-400 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30";
const labelCls = "mb-1 block text-sm font-bold text-bark-800";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-terracotta-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 disabled:opacity-50";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-bark-400 px-5 py-2 text-sm font-bold text-bark-800 transition hover:bg-bark-100 focus:outline-none focus:ring-2 focus:ring-bark-400/50";
const dangerBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-red-500 px-4 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/40";

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 4h11M6.5 4V2.8c0-.4.4-.8.8-.8h1.4c.4 0 .8.4.8.8V4m2.6 0-.5 9.2c0 .4-.4.8-.8.8H5.2c-.4 0-.8-.4-.8-.8L3.9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M11.5 2.5 13.5 4.5 5 13l-3 1 1-3 8.5-8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

interface DemoClassSession {
  id: string;
  program: string;
  title: string;
  date: string;
  time: string;
  quota: number;
  ageGroup: string;
}

interface ObservationRecord {
  id: string;
  studentName: string;
  date: string;
  scores: Record<string, { value: number; note: string }>;
}

interface DocRecord {
  id: string;
  studentName: string;
  title: string;
  date: string;
  note: string;
  photoUrl: string | null;
}

interface AgeRow {
  label: string;
  ageRange: string;
  startTime: string;
  endTime: string;
}

const blankAgeRow = (): AgeRow => ({ label: "", ageRange: "", startTime: "", endTime: "" });

interface EventForm {
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

const blankEventForm = (): EventForm => ({
  name: "",
  category: "popup",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  priceIdr: "0",
  quota: "",
  description: "",
});

export default function GuruDashboard({ initialEvents }: { initialEvents: ZkcEvent[] }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("event");

  // --- Event ---
  const [events, setEvents] = useState<ZkcEvent[]>(initialEvents);
  const [eventForm, setEventForm] = useState<EventForm>(blankEventForm());
  const [ageRows, setAgeRows] = useState<AgeRow[]>([blankAgeRow()]);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [eventMsg, setEventMsg] = useState("");

  // --- Sesi kelas ---
  const [sessions, setSessions] = useState<DemoClassSession[]>([
    { id: "ks1", program: "trial", title: "Sensory Play Trial", date: "2026-10-12", time: "09.00", quota: 8, ageGroup: "1-2 tahun" },
    { id: "ks2", program: "regular", title: "Montessori Circle Time", date: "2026-10-13", time: "08.30", quota: 12, ageGroup: "3-4 tahun" },
    { id: "ks3", program: "private", title: "Private Practical Life", date: "2026-10-14", time: "10.00", quota: 1, ageGroup: "2-3 tahun" },
  ]);
  const [sessionForm, setSessionForm] = useState({ program: "trial", title: "", date: "", time: "", quota: "", ageGroup: "" });
  const [sessionMsg, setSessionMsg] = useState("");

  // --- Perkembangan siswa ---
  const [obsStudent, setObsStudent] = useState(DEMO_STUDENTS[0].name);
  const [obsDate, setObsDate] = useState("2026-10-10");
  const [obsScores, setObsScores] = useState<Record<string, { value: number; note: string }>>({});
  const [observations, setObservations] = useState<ObservationRecord[]>([]);
  const [obsMsg, setObsMsg] = useState("");

  // --- Dokumentasi ---
  const [docForm, setDocForm] = useState({ student: DEMO_STUDENTS[0].name, title: "", date: "2026-10-10", note: "" });
  const [docPhoto, setDocPhoto] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocRecord[]>([]);
  const [docMsg, setDocMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim() || !pin.trim()) {
      setLoginError("Nama dan PIN wajib diisi.");
      return;
    }
    setLoginError("");
    setLoggedIn(true);
  };

  // ================== EVENT ==================
  const handleFlyer = (file: File | undefined) => {
    if (flyerPreview) URL.revokeObjectURL(flyerPreview);
    if (file && file.type.startsWith("image/")) setFlyerPreview(URL.createObjectURL(file));
    else setFlyerPreview(null);
  };

  const addAgeRow = () => setAgeRows((r) => [...r, blankAgeRow()]);
  const removeAgeRow = (i: number) => setAgeRows((r) => (r.length > 1 ? r.filter((_, x) => x !== i) : [blankAgeRow()]));
  const setAgeCell = (i: number, key: keyof AgeRow, val: string) =>
    setAgeRows((r) => r.map((row, x) => (x === i ? { ...row, [key]: val } : row)));

  const resetEventForm = () => {
    setEventForm(blankEventForm());
    setAgeRows([blankAgeRow()]);
    if (flyerPreview) URL.revokeObjectURL(flyerPreview);
    setFlyerPreview(null);
    setEditingId(null);
  };

  const startEdit = (ev: ZkcEvent) => {
    setEventForm({
      name: ev.name,
      category: ev.category,
      date: ev.date,
      startTime: ev.startTime,
      endTime: ev.endTime,
      location: ev.location,
      priceIdr: String(ev.priceIdr),
      quota: ev.quota !== undefined ? String(ev.quota) : "",
      description: ev.description,
    });
    setAgeRows(
      ev.ageSessions.length > 0
        ? ev.ageSessions.map((s) => ({ label: s.label, ageRange: s.ageRange, startTime: s.startTime, endTime: s.endTime }))
        : [blankAgeRow()]
    );
    if (flyerPreview) URL.revokeObjectURL(flyerPreview);
    setFlyerPreview(ev.flyerUrl ?? null);
    setEditingId(ev.id);
    setEventMsg("");
    setDeleteId(null);
  };

  const submitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.name.trim() || !eventForm.date || !eventForm.location.trim()) {
      setEventMsg("Nama, tanggal, dan lokasi event wajib diisi.");
      return;
    }
    const ageSessions: AgeSession[] = ageRows
      .filter((r) => r.label.trim())
      .map((r, i) => ({
        id: `as-${Date.now()}-${i}`,
        label: r.label.trim(),
        ageRange: r.ageRange.trim(),
        startTime: r.startTime,
        endTime: r.endTime,
      }));
    if (editingId) {
      setEvents((list) =>
        list.map((ev) =>
          ev.id === editingId
            ? {
                ...ev,
                name: eventForm.name.trim(),
                category: eventForm.category,
                date: eventForm.date,
                startTime: eventForm.startTime,
                endTime: eventForm.endTime,
                location: eventForm.location.trim(),
                priceIdr: Math.max(0, Number(eventForm.priceIdr) || 0),
                quota: eventForm.quota ? Number(eventForm.quota) : undefined,
                description: eventForm.description.trim(),
                flyerUrl: flyerPreview ?? undefined,
                ageSessions,
              }
            : ev
        )
      );
      setEventMsg("Event berhasil diperbarui.");
    } else {
      const neu: ZkcEvent = {
        id: `ev-${Date.now()}`,
        name: eventForm.name.trim(),
        category: eventForm.category,
        date: eventForm.date,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        location: eventForm.location.trim(),
        priceIdr: Math.max(0, Number(eventForm.priceIdr) || 0),
        quota: eventForm.quota ? Number(eventForm.quota) : undefined,
        participants: 0,
        description: eventForm.description.trim(),
        flyerUrl: flyerPreview ?? undefined,
        status: "upcoming",
        ageSessions,
      };
      setEvents((list) => [neu, ...list]);
      setEventMsg("Event berhasil ditambahkan.");
    }
    resetEventForm();
  };

  const requestDelete = (id: string) => {
    if (deleteId === id) {
      setEvents((list) => list.filter((ev) => ev.id !== id));
      setDeleteId(null);
      if (editingId === id) resetEventForm();
      setEventMsg("Event berhasil dihapus.");
    } else {
      setDeleteId(id);
    }
  };

  const activeEvents = events.filter((ev) => statusFromEvent(ev.status) !== "Selesai");
  const completedEvents = events.filter((ev) => statusFromEvent(ev.status) === "Selesai");

  // ================== SESI KELAS ==================
  const submitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.title.trim() || !sessionForm.date || !sessionForm.time) {
      setSessionMsg("Judul, tanggal, dan jam sesi wajib diisi.");
      return;
    }
    setSessions((list) => [
      {
        id: `ks-${Date.now()}`,
        program: sessionForm.program,
        title: sessionForm.title.trim(),
        date: sessionForm.date,
        time: sessionForm.time,
        quota: Number(sessionForm.quota) || 0,
        ageGroup: sessionForm.ageGroup.trim(),
      },
      ...list,
    ]);
    setSessionForm({ program: "trial", title: "", date: "", time: "", quota: "", ageGroup: "" });
    setSessionMsg("Sesi kelas berhasil ditambahkan.");
  };

  const deleteSession = (id: string) =>
    setSessions((list) => list.filter((s) => s.id !== id));

  // ================== PERKEMBANGAN ==================
  const submitObservation = (e: React.FormEvent) => {
    e.preventDefault();
    const rec: ObservationRecord = {
      id: `obs-${Date.now()}`,
      studentName: obsStudent,
      date: obsDate,
      scores: obsScores,
    };
    setObservations((list) => [rec, ...list]);
    setObsScores({});
    setObsMsg(`Catatan observasi untuk ${obsStudent} berhasil disimpan.`);
  };

  // ================== DOKUMENTASI ==================
  const handleDocPhoto = (file: File | undefined) => {
    if (docPhoto) URL.revokeObjectURL(docPhoto);
    if (file && file.type.startsWith("image/")) setDocPhoto(URL.createObjectURL(file));
    else setDocPhoto(null);
  };

  const submitDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim()) {
      setDocMsg("Judul dokumentasi wajib diisi.");
      return;
    }
    setDocs((list) => [
      { id: `doc-${Date.now()}`, studentName: docForm.student, title: docForm.title.trim(), date: docForm.date, note: docForm.note.trim(), photoUrl: docPhoto },
      ...list,
    ]);
    setDocForm({ student: docForm.student, title: "", date: "2026-10-10", note: "" });
    setDocPhoto(null);
    setDocMsg("Dokumentasi berhasil disimpan.");
  };

  // ================== TAMPILAN ==================
  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-cream-50 px-4 py-12">
        <div className="mx-auto max-w-md">
          <SectionHeading title="Portal Guru" subtitle="Masuk untuk mengelola event, sesi kelas, dan data siswa." />
          <div className="mt-6 rounded-2xl bg-mustard-100 px-4 py-3 text-center">
            <p className="text-sm font-bold text-bark-800">
              Ini adalah halaman demo. Semua data yang tampil adalah <Badge>Data contoh</Badge>
            </p>
          </div>
          <form onSubmit={handleLogin} className="mt-6 space-y-4 rounded-2xl border border-bark-200 bg-white p-6 shadow-sm">
            <div>
              <label htmlFor="guru-name" className={labelCls}>Nama guru</label>
              <input
                id="guru-name"
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="cth. Ayu Najiba"
                className={inputCls}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="guru-pin" className={labelCls}>PIN (demo: isi apa saja)</label>
              <input
                id="guru-pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN demo"
                className={inputCls}
                autoComplete="off"
              />
            </div>
            {loginError && (
              <p role="alert" className="text-sm font-bold text-red-700">{loginError}</p>
            )}
            <button type="submit" className={primaryBtn + " w-full"}>Masuk</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-sage-700">Halo, {teacherName}</p>
            <SectionHeading title="Portal Guru" align="left" />
          </div>
          <Badge>Data contoh</Badge>
        </div>
        <div className="mt-4 rounded-2xl bg-mustard-100 px-4 py-3">
          <p className="text-sm text-bark-800">
            Halaman ini adalah <strong>demo</strong>. Semua data yang tampil dan yang Anda ubah adalah{" "}
            <strong>Data contoh</strong> yang tersimpan sementara di perangkat ini dan hilang saat halaman dimuat ulang.
          </p>
        </div>

        {/* TABS */}
        <div role="tablist" aria-label="Menu Portal Guru" className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.key)}
                className={
                  "rounded-full px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 " +
                  (active
                    ? "bg-terracotta-500 text-white shadow"
                    : "border border-bark-300 bg-white text-bark-800 hover:bg-bark-100")
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {activeTab === "event" && (
            <section aria-label="Kelola event">
              <SectionHeading
                title={editingId ? "Ubah event" : "Tambah event"}
                align="left"
              />
              {eventMsg && (
                <p role="status" className="mt-3 rounded-xl bg-sage-100 px-4 py-3 text-sm font-bold text-sage-700">
                  {eventMsg}
                </p>
              )}
              <form onSubmit={submitEvent} className="mt-4 space-y-4 rounded-2xl border border-bark-200 bg-white p-5 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="ev-name" className={labelCls}>Nama event</label>
                    <input id="ev-name" type="text" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ev-cat" className={labelCls}>Kategori</label>
                    <select id="ev-cat" value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as EventCategory })} className={inputCls}>
                      {EVENT_CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ev-date" className={labelCls}>Tanggal</label>
                    <input id="ev-date" type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ev-loc" className={labelCls}>Lokasi</label>
                    <input id="ev-loc" type="text" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ev-start" className={labelCls}>Jam mulai</label>
                    <input id="ev-start" type="time" value={eventForm.startTime} onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ev-end" className={labelCls}>Jam selesai</label>
                    <input id="ev-end" type="time" value={eventForm.endTime} onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ev-price" className={labelCls}>Harga (Rp, 0 = gratis)</label>
                    <input id="ev-price" type="number" min={0} value={eventForm.priceIdr} onChange={(e) => setEventForm({ ...eventForm, priceIdr: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ev-quota" className={labelCls}>Kuota</label>
                    <input id="ev-quota" type="number" min={0} value={eventForm.quota} onChange={(e) => setEventForm({ ...eventForm, quota: e.target.value })} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="ev-desc" className={labelCls}>Deskripsi</label>
                  <textarea id="ev-desc" rows={3} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className={inputCls} />
                </div>

                {/* Sesi dinamis per usia */}
                <fieldset className="rounded-xl border border-bark-200 p-4">
                  <legend className="px-2 text-sm font-bold text-bark-800">Sesi per kelompok usia</legend>
                  <div className="space-y-3">
                    {ageRows.map((row, i) => (
                      <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-5">
                        <input aria-label={`Label sesi ${i + 1}`} type="text" placeholder="Label, cth. Sesi Pagi" value={row.label} onChange={(e) => setAgeCell(i, "label", e.target.value)} className={inputCls} />
                        <input aria-label={`Rentang usia ${i + 1}`} type="text" placeholder="Rentang usia, cth. 2-3 tahun" value={row.ageRange} onChange={(e) => setAgeCell(i, "ageRange", e.target.value)} className={inputCls} />
                        <input aria-label={`Jam mulai sesi ${i + 1}`} type="time" value={row.startTime} onChange={(e) => setAgeCell(i, "startTime", e.target.value)} className={inputCls} />
                        <input aria-label={`Jam selesai sesi ${i + 1}`} type="time" value={row.endTime} onChange={(e) => setAgeCell(i, "endTime", e.target.value)} className={inputCls} />
                        <button type="button" onClick={() => removeAgeRow(i)} className={ghostBtn + " md:self-center"} aria-label={`Hapus baris sesi ${i + 1}`}>
                          <IconTrash /> Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addAgeRow} className={ghostBtn + " mt-3"}>
                    <IconPlus /> Tambah baris sesi
                  </button>
                </fieldset>

                <div>
                  <label htmlFor="ev-flyer" className={labelCls}>Flyer event (gambar)</label>
                  <input id="ev-flyer" type="file" accept="image/*" onChange={(e) => handleFlyer(e.target.files?.[0])} className="text-sm text-bark-800 file:mr-3 file:rounded-full file:border-0 file:bg-sage-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-sage-700" />
                  {flyerPreview && (
                    <img src={flyerPreview} alt="Pratinjau flyer event" className="mt-3 h-40 w-auto rounded-xl border border-bark-200 object-cover" />
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" className={primaryBtn}>
                    <IconPlus /> {editingId ? "Simpan perubahan" : "Tambah event"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetEventForm} className={ghostBtn}>Batalkan ubah</button>
                  )}
                </div>
              </form>

              {/* Daftar event aktif */}
              <h3 className="mt-8 font-display text-xl font-bold text-bark-900">Daftar event</h3>
              {activeEvents.length === 0 ? (
                <div className="mt-3"><EmptyState title="Belum ada event mendatang" hint="Tambahkan event baru lewat form di atas." /></div>
              ) : (
                <ul className="mt-3 space-y-3">
                  {activeEvents.map((ev) => {
                    const st = statusFromEvent(ev.status);
                    const confirming = deleteId === ev.id;
                    return (
                      <li key={ev.id} className="rounded-2xl border border-bark-200 bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-display text-lg font-bold text-bark-900">{ev.name}</p>
                            <p className="mt-1 text-sm text-bark-700">
                              {formatDateId(ev.date)}{ev.startTime ? `, ${ev.startTime}` : ""}{ev.endTime ? ` - ${ev.endTime}` : ""} | {ev.location}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge>{categoryLabel(ev.category)}</Badge>
                              <Badge>{st}</Badge>
                            </div>
                            <p className="mt-2"><Price idr={ev.priceIdr} /></p>
                            {ev.ageSessions.length > 0 && (
                              <ul className="mt-2 space-y-1 text-sm text-bark-700">
                                {ev.ageSessions.map((s) => (
                                  <li key={s.id}>
                                    {s.label}{s.ageRange ? ` (${s.ageRange})` : ""}{s.startTime ? `, ${s.startTime}` : ""}{s.endTime ? ` - ${s.endTime}` : ""}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => startEdit(ev)} className={ghostBtn}>
                              <IconEdit /> Ubah
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDelete(ev.id)}
                              className={confirming ? primaryBtn + " bg-red-600 hover:bg-red-700" : dangerBtn}
                              aria-live="polite"
                            >
                              <IconTrash /> {confirming ? "Yakin hapus?" : "Hapus"}
                            </button>
                            {confirming && (
                              <button type="button" onClick={() => setDeleteId(null)} className={ghostBtn}>
                                Batal
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Bahan evaluasi */}
              <h3 className="mt-8 font-display text-xl font-bold text-bark-900">Bahan evaluasi</h3>
              <p className="mt-1 text-sm text-bark-700">Event yang sudah selesai, untuk bahan evaluasi tim.</p>
              {completedEvents.length === 0 ? (
                <div className="mt-3"><EmptyState title="Belum ada event selesai" hint="Event yang tanggalnya sudah lewat akan tampil di sini." /></div>
              ) : (
                <ul className="mt-3 space-y-3">
                  {completedEvents.map((ev) => (
                    <li key={ev.id} className="rounded-2xl border border-bark-200 bg-cream-100 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-lg font-bold text-bark-900">{ev.name}</p>
                          <p className="mt-1 text-sm text-bark-700">{formatDateId(ev.date)} | {ev.location}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge>{categoryLabel(ev.category)}</Badge>
                            <Badge>Selesai</Badge>
                          </div>
                          <p className="mt-2 text-sm font-bold text-bark-800">
                            Jumlah peserta: {ev.participants ?? 0} (contoh)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEdit(ev)} className={ghostBtn}>
                            <IconEdit /> Ubah
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(ev.id)}
                            className={deleteId === ev.id ? primaryBtn + " bg-red-600 hover:bg-red-700" : dangerBtn}
                          >
                            <IconTrash /> {deleteId === ev.id ? "Yakin hapus?" : "Hapus"}
                          </button>
                          {deleteId === ev.id && (
                            <button type="button" onClick={() => setDeleteId(null)} className={ghostBtn}>Batal</button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === "sesi" && (
            <section aria-label="Sesi kelas">
              <SectionHeading title="Tambah sesi kelas" align="left" />
              {sessionMsg && (
                <p role="status" className="mt-3 rounded-xl bg-sage-100 px-4 py-3 text-sm font-bold text-sage-700">
                  {sessionMsg}
                </p>
              )}
              <form onSubmit={submitSession} className="mt-4 space-y-4 rounded-2xl border border-bark-200 bg-white p-5 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="ks-program" className={labelCls}>Program</label>
                    <select id="ks-program" value={sessionForm.program} onChange={(e) => setSessionForm({ ...sessionForm, program: e.target.value })} className={inputCls}>
                      {PROGRAMS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ks-title" className={labelCls}>Judul sesi</label>
                    <input id="ks-title" type="text" value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ks-date" className={labelCls}>Tanggal</label>
                    <input id="ks-date" type="date" value={sessionForm.date} onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ks-time" className={labelCls}>Jam</label>
                    <input id="ks-time" type="text" placeholder="cth. 09.00" value={sessionForm.time} onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ks-quota" className={labelCls}>Kuota</label>
                    <input id="ks-quota" type="number" min={0} value={sessionForm.quota} onChange={(e) => setSessionForm({ ...sessionForm, quota: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="ks-age" className={labelCls}>Kelompok usia</label>
                    <input id="ks-age" type="text" placeholder="cth. 2-3 tahun" value={sessionForm.ageGroup} onChange={(e) => setSessionForm({ ...sessionForm, ageGroup: e.target.value })} className={inputCls} />
                  </div>
                </div>
                <button type="submit" className={primaryBtn}><IconPlus /> Tambah sesi</button>
              </form>

              <h3 className="mt-8 font-display text-xl font-bold text-bark-900">Daftar sesi kelas</h3>
              {sessions.length === 0 ? (
                <div className="mt-3"><EmptyState title="Belum ada sesi kelas" hint="Tambahkan sesi baru lewat form di atas." /></div>
              ) : (
                <ul className="mt-3 space-y-3">
                  {sessions.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-bark-200 bg-white p-4">
                      <div>
                        <p className="font-display text-lg font-bold text-bark-900">{s.title}</p>
                        <p className="mt-1 text-sm text-bark-700">
                          {formatDateId(s.date)}, jam {s.time} | Kelompok usia: {s.ageGroup} | Kuota: {s.quota}
                        </p>
                        <div className="mt-2"><Badge>{PROGRAMS.find((p) => p.value === s.program)?.label ?? s.program}</Badge></div>
                      </div>
                      <button type="button" onClick={() => deleteSession(s.id)} className={dangerBtn}>
                        <IconTrash /> Hapus
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === "perkembangan" && (
            <section aria-label="Perkembangan siswa">
              <SectionHeading title="Catat perkembangan siswa" align="left" />
              <p className="mt-2 text-sm text-bark-700">
                Isi skala observasi 1 sampai 5 untuk tiap ranah beserta catatan singkat. Ini adalah catatan observasi guru, bukan diagnosis medis maupun psikologis.
              </p>
              {obsMsg && (
                <p role="status" className="mt-3 rounded-xl bg-sage-100 px-4 py-3 text-sm font-bold text-sage-700">
                  {obsMsg}
                </p>
              )}
              <form onSubmit={submitObservation} className="mt-4 space-y-4 rounded-2xl border border-bark-200 bg-white p-5 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="obs-student" className={labelCls}>Siswa</label>
                    <select id="obs-student" value={obsStudent} onChange={(e) => setObsStudent(e.target.value)} className={inputCls}>
                      {DEMO_STUDENTS.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="obs-date" className={labelCls}>Tanggal observasi</label>
                    <input id="obs-date" type="date" value={obsDate} onChange={(e) => setObsDate(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <fieldset className="rounded-xl border border-bark-200 p-4">
                  <legend className="px-2 text-sm font-bold text-bark-800">9 ranah observasi</legend>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {OBSERVATION_DOMAINS.map((d) => {
                      const cur = obsScores[d.key] ?? { value: 3, note: "" };
                      return (
                        <div key={d.key} className="rounded-xl bg-cream-100 p-3">
                          <label htmlFor={`obs-score-${d.key}`} className={labelCls}>{d.label}</label>
                          <select
                            id={`obs-score-${d.key}`}
                            value={cur.value}
                            onChange={(e) => setObsScores((m) => ({ ...m, [d.key]: { ...cur, value: Number(e.target.value) } }))}
                            className={inputCls}
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                          <label htmlFor={`obs-note-${d.key}`} className="mt-2 block text-xs font-bold text-bark-700">Catatan</label>
                          <textarea
                            id={`obs-note-${d.key}`}
                            rows={2}
                            value={cur.note}
                            onChange={(e) => setObsScores((m) => ({ ...m, [d.key]: { ...cur, note: e.target.value } }))}
                            placeholder="Catatan observasi singkat"
                            className={inputCls + " mt-1"}
                          />
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
                <button type="submit" className={primaryBtn}>Simpan observasi</button>
              </form>

              <h3 className="mt-8 font-display text-xl font-bold text-bark-900">Riwayat observasi</h3>
              {observations.length === 0 ? (
                <div className="mt-3"><EmptyState title="Belum ada catatan observasi" hint="Simpan observasi baru lewat form di atas." /></div>
              ) : (
                <ul className="mt-3 space-y-3">
                  {observations.map((o) => (
                    <li key={o.id} className="rounded-2xl border border-bark-200 bg-white p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg font-bold text-bark-900">{o.studentName}</p>
                        <Badge>{formatDateId(o.date)}</Badge>
                      </div>
                      <dl className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                        {OBSERVATION_DOMAINS.map((d) => {
                          const v = o.scores[d.key];
                          return (
                            <div key={d.key} className="rounded-lg bg-cream-100 px-3 py-2">
                              <dt className="text-xs font-bold text-bark-700">{d.label}: {v ? `${v.value}/5` : "belum diisi"}</dt>
                              {v?.note && <dd className="mt-1 text-sm text-bark-800">{v.note}</dd>}
                            </div>
                          );
                        })}
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === "dokumentasi" && (
            <section aria-label="Dokumentasi">
              <SectionHeading title="Tambah dokumentasi" align="left" />
              {docMsg && (
                <p role="status" className="mt-3 rounded-xl bg-sage-100 px-4 py-3 text-sm font-bold text-sage-700">
                  {docMsg}
                </p>
              )}
              <form onSubmit={submitDoc} className="mt-4 space-y-4 rounded-2xl border border-bark-200 bg-white p-5 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="doc-student" className={labelCls}>Siswa</label>
                    <select id="doc-student" value={docForm.student} onChange={(e) => setDocForm({ ...docForm, student: e.target.value })} className={inputCls}>
                      {DEMO_STUDENTS.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="doc-title" className={labelCls}>Judul</label>
                    <input id="doc-title" type="text" value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="doc-date" className={labelCls}>Tanggal</label>
                    <input id="doc-date" type="date" value={docForm.date} onChange={(e) => setDocForm({ ...docForm, date: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="doc-photo" className={labelCls}>Foto</label>
                    <input id="doc-photo" type="file" accept="image/*" onChange={(e) => handleDocPhoto(e.target.files?.[0])} className="text-sm text-bark-800 file:mr-3 file:rounded-full file:border-0 file:bg-sage-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-sage-700" />
                    {docPhoto && (
                      <img src={docPhoto} alt="Pratinjau foto dokumentasi" className="mt-3 h-40 w-auto rounded-xl border border-bark-200 object-cover" />
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="doc-note" className={labelCls}>Catatan</label>
                  <textarea id="doc-note" rows={3} value={docForm.note} onChange={(e) => setDocForm({ ...docForm, note: e.target.value })} className={inputCls} />
                </div>
                <button type="submit" className={primaryBtn}>Simpan dokumentasi</button>
              </form>

              <h3 className="mt-8 font-display text-xl font-bold text-bark-900">Daftar dokumentasi</h3>
              {docs.length === 0 ? (
                <div className="mt-3"><EmptyState title="Belum ada dokumentasi" hint="Simpan dokumentasi baru lewat form di atas." /></div>
              ) : (
                <ul className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {docs.map((d) => (
                    <li key={d.id} className="overflow-hidden rounded-2xl border border-bark-200 bg-white">
                      {d.photoUrl && (
                        <img src={d.photoUrl} alt={`Foto ${d.title}`} className="h-48 w-full object-cover" />
                      )}
                      <div className="p-4">
                        <p className="font-display text-lg font-bold text-bark-900">{d.title}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <Badge>{d.studentName}</Badge>
                          <Badge>{formatDateId(d.date)}</Badge>
                        </div>
                        {d.note && <p className="mt-2 text-sm text-bark-700">{d.note}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === "siswa" && (
            <section aria-label="Data siswa">
              <SectionHeading title="Data siswa" align="left" subtitle="Data contoh. Status pembayaran dan sisa sesi per siswa." />
              <div className="mt-4 overflow-x-auto rounded-2xl border border-bark-200 bg-white">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-bark-200 bg-cream-100">
                      <th scope="col" className="px-4 py-3 font-bold text-bark-900">Nama siswa</th>
                      <th scope="col" className="px-4 py-3 font-bold text-bark-900">Orang tua</th>
                      <th scope="col" className="px-4 py-3 font-bold text-bark-900">Pembayaran</th>
                      <th scope="col" className="px-4 py-3 font-bold text-bark-900">Sisa sesi</th>
                      <th scope="col" className="px-4 py-3 font-bold text-bark-900">Ringkasan per sesi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_STUDENTS.map((s) => (
                      <tr key={s.id} className="border-b border-bark-200 last:border-0">
                        <td className="px-4 py-3 font-bold text-bark-900">{s.name}</td>
                        <td className="px-4 py-3 text-bark-800">{s.parent}</td>
                        <td className="px-4 py-3">
                          <Badge>{s.paid ? "Lunas" : "Belum lunas"}</Badge>
                        </td>
                        <td className="px-4 py-3 font-bold text-bark-900">{s.sisaSesi}</td>
                        <td className="px-4 py-3 text-bark-700">{s.ringkasan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <CtaButton href="/" variant="outline">Kembali ke beranda</CtaButton>
          <button type="button" onClick={() => { setLoggedIn(false); setPin(""); }} className={ghostBtn}>
            Keluar (demo)
          </button>
        </div>
      </div>
    </main>
  );
}
