// Kontrak data frontend.
// FASE 1: implementasi mock (data contoh) agar UI bisa dibangun & dites.
// FASE 2: isi fungsi-fungsi ini dengan fetch ke /api/* (Supabase) tanpa
// mengubah komponen/halaman yang memakainya.

export type EventCategory = "popup" | "talkshow" | "workshop" | "training";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface AgeSession {
  id: string;
  label: string;
  ageRange: string;
  startTime: string;
  endTime: string;
}

export interface ZkcEvent {
  id: string;
  name: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  priceIdr: number; // 0 = gratis
  quota?: number;
  participants?: number;
  description: string;
  flyerUrl?: string;
  status: EventStatus;
  ageSessions: AgeSession[];
}

export interface ClassSession {
  id: string;
  program: "trial" | "regular" | "private";
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  quota: number;
  ageGroup?: string;
}

export interface Article {
  slug: string;
  title: string;
  category: "parenting" | "tumbuh-kembang" | "montessori" | "early-childhood";
  excerpt: string;
  body: string[];
  publishedAt: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  validUntil?: string;
}

export interface RegistrationInput {
  childName: string;
  birthDate: string;
  parentName: string;
  parentPhone: string;
  notes?: string;
  kind: "trial" | "regular" | "event";
  sessionId?: string;
  eventId?: string;
  packageSessions?: number;
}

// ---------- MOCK DATA ----------
const MOCK_EVENTS: ZkcEvent[] = [
  {
    id: "ev-1",
    name: "Pop Up Class: Sensory Play Ceria",
    category: "popup",
    date: "2026-10-18",
    startTime: "09:00",
    endTime: "10:30",
    location: "Ziel Kids Club, Malang",
    priceIdr: 75000,
    quota: 20,
    participants: 14,
    description:
      "Eksplorasi sensori melalui permainan tekstur, warna, dan gerak untuk anak usia 1-3 tahun.",
    status: "upcoming",
    ageSessions: [
      { id: "as-1", label: "Sesi Baby", ageRange: "6-12 bulan", startTime: "09:00", endTime: "09:45" },
      { id: "as-2", label: "Sesi Toddler", ageRange: "1-2 tahun", startTime: "10:00", endTime: "10:45" },
    ],
  },
  {
    id: "ev-2",
    name: "Talkshow: Anak Tantrum? Pahami Dulu",
    category: "talkshow",
    date: "2026-10-25",
    startTime: "13:00",
    endTime: "15:00",
    location: "Grand Mercure Malang",
    priceIdr: 50000,
    quota: 60,
    participants: 32,
    description:
      "Diskusi parenting bersama praktisi tentang memahami dan merespons tantrum dengan tenang.",
    status: "upcoming",
    ageSessions: [],
  },
  {
    id: "ev-3",
    name: "Workshop Montessori di Rumah",
    category: "workshop",
    date: "2026-11-08",
    startTime: "09:00",
    endTime: "12:00",
    location: "Ziel Kids Club, Malang",
    priceIdr: 150000,
    quota: 30,
    description:
      "Praktik menyiapkan lingkungan dan aktivitas Montessori sederhana di rumah.",
    status: "upcoming",
    ageSessions: [],
  },
  {
    id: "ev-4",
    name: "Pelatihan Guru: Observasi Anak",
    category: "training",
    date: "2026-11-15",
    startTime: "08:00",
    endTime: "16:00",
    location: "Ziel Kids Club, Malang",
    priceIdr: 250000,
    quota: 25,
    description:
      "Pelatihan satu hari untuk guru PAUD tentang teknik observasi perkembangan anak.",
    status: "upcoming",
    ageSessions: [],
  },
  {
    id: "ev-0",
    name: "Playdate Akbar Kemerdekaan",
    category: "popup",
    date: "2026-08-17",
    startTime: "08:00",
    endTime: "11:00",
    location: "Ziel Kids Club, Malang",
    priceIdr: 0,
    quota: 50,
    participants: 47,
    description: "Playdate kemerdekaan bersama puluhan keluarga.",
    status: "completed",
    ageSessions: [],
  },
];

const MOCK_SESSIONS: ClassSession[] = [
  { id: "cs-1", program: "trial", title: "Trial Class Pagi", date: "2026-10-19", startTime: "09:00", endTime: "10:00", quota: 8, ageGroup: "1-2 tahun" },
  { id: "cs-2", program: "trial", title: "Trial Class Sore", date: "2026-10-21", startTime: "15:00", endTime: "16:00", quota: 8, ageGroup: "2-3 tahun" },
  { id: "cs-3", program: "regular", title: "Regular Class Pagi", date: "2026-10-20", startTime: "09:00", endTime: "10:30", quota: 10, ageGroup: "2-3 tahun" },
];

const MOCK_ARTICLES: Article[] = [
  {
    slug: "memahami-tantrum-anak",
    title: "Memahami Tantrum: Perilaku Anak adalah Informasi",
    category: "parenting",
    excerpt: "Tantrum bukan kenakalan. Pelajari cara membaca sinyalnya dengan tenang.",
    body: [
      "Perilaku anak adalah informasi. Sebelum merespons, amati dulu konteks, regulasi, dan kesiapan anak.",
      "Anak usia dini belum memiliki regulasi emosi yang matang. Tugas orang dewasa adalah menjadi pelita yang tenang: memberi arah dan rasa aman tanpa mengambil alih proses anak.",
      "Langkah praktis: turunkan posisi sejajar anak, akui perasaannya dengan kata sederhana, tawarkan pilihan terbatas, dan beri waktu.",
    ],
    publishedAt: "2026-10-05",
  },
  {
    slug: "stimulasi-motorik-kasar",
    title: "5 Ide Stimulasi Motorik Kasar di Rumah",
    category: "tumbuh-kembang",
    excerpt: "Gerak adalah fondasi fokus. Ide sederhana yang bisa dilakukan di ruang tamu.",
    body: [
      "Fokus itu skill yang dilatih lewat gerak, sensori, dan pengalaman konkret.",
      "Coba: merangkak di terowongan kardus, melempar bola ke keranjang, berjalan di garis, memanjat dan melompat aman, serta menari mengikuti musik.",
    ],
    publishedAt: "2026-09-28",
  },
  {
    slug: "prinsip-observe-first",
    title: "Observe First: Prinsip Kami Sebelum Merespons Anak",
    category: "montessori",
    excerpt: "Mengapa kami mengamati dulu sebelum bertindak.",
    body: [
      "Prinsip Ziel Kids Club: Observe First. Understand Before Responding. Regulation Before Academics.",
      "Observasi membantu kami memetakan kebutuhan perkembangan anak dalam 9 ranah, lalu menyusun pendampingan yang tepat.",
    ],
    publishedAt: "2026-09-20",
  },
  {
    slug: "screen-time-anak-usia-dini",
    title: "Screen Time untuk Anak Usia Dini: Panduan Tenang",
    category: "early-childhood",
    excerpt: "Bukan soal melarang total, tapi soal porsi dan pendampingan.",
    body: [
      "Anak belajar paling baik lewat pengalaman konkret dan interaksi dua arah.",
      "Jika menggunakan gawai: pilih konten berkualitas, dampingi dan ajak berdialog, batasi durasi, dan hindari saat makan serta menjelang tidur.",
    ],
    publishedAt: "2026-09-12",
  },
];

const MOCK_PROMOS: Promo[] = [
  { id: "pr-1", title: "Gratis Trial Class", description: "Daftar regular class paket 12x, dapatkan 1x trial class gratis untuk saudara.", validUntil: "2026-10-31" },
  { id: "pr-2", title: "Diskon 10% Paket 16x", description: "Hemat untuk komitmen belajar lebih panjang.", validUntil: "2026-11-30" },
  { id: "pr-3", title: "Ajak Teman", description: "Dapatkan potongan untuk setiap teman yang mendaftar regular class.", validUntil: "2026-12-31" },
];

// ---------- IMPLEMENTASI MOCK ----------
const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export async function getEvents(): Promise<ZkcEvent[]> {
  return MOCK_EVENTS;
}
export async function getUpcomingEvents(): Promise<ZkcEvent[]> {
  const all = await getEvents();
  return all.filter((e) => e.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date));
}
export async function getClassSessions(): Promise<ClassSession[]> {
  return MOCK_SESSIONS;
}
export async function getArticles(): Promise<Article[]> {
  return MOCK_ARTICLES;
}
export async function getArticle(slug: string): Promise<Article | undefined> {
  return MOCK_ARTICLES.find((a) => a.slug === slug);
}
export async function getPromos(): Promise<Promo[]> {
  return MOCK_PROMOS;
}
export async function submitRegistration(input: RegistrationInput): Promise<{ id: string }> {
  await delay(300);
  console.log("registration (mock):", input);
  return { id: `reg-${Date.now()}` };
}
export async function submitPartnership(input: {
  name: string; institution: string; kind: string; phone: string; message: string;
}): Promise<{ id: string }> {
  await delay(300);
  console.log("partnership (mock):", input);
  return { id: `ps-${Date.now()}` };
}
