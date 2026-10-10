export const SITE = {
  name: "Ziel Kids Club",
  tagline: "Child Development & Early Learning Center",
  city: "Malang",
  waAdmin: "6285117623313",
  instagram: "https://instagram.com/zielkidsclub",
  threads: "https://threads.com/@zielkidsclub",
  yayasan: "Yayasan Tunas Pelita Cakrawala Insani",
} as const;

export const waLink = (text: string) =>
  `https://wa.me/${SITE.waAdmin}?text=${encodeURIComponent(text)}`;

export const EVENT_CATEGORIES = [
  { slug: "popup", label: "Pop Up Class / Playdate" },
  { slug: "talkshow", label: "Talkshow Parenting" },
  { slug: "workshop", label: "Workshop Montessori" },
  { slug: "training", label: "Pelatihan Guru" },
] as const;

export const ARTICLE_CATEGORIES = [
  { slug: "parenting", label: "Parenting" },
  { slug: "tumbuh-kembang", label: "Tumbuh Kembang" },
  { slug: "montessori", label: "Montessori" },
  { slug: "early-childhood", label: "Early Childhood" },
] as const;

export const OBSERVATION_DOMAINS = [
  { key: "gross_motor", label: "Motorik Kasar" },
  { key: "fine_motor", label: "Motorik Halus & Koordinasi" },
  { key: "sensory", label: "Sensory Processing" },
  { key: "attention", label: "Atensi / Konsentrasi" },
  { key: "language", label: "Bahasa & Komunikasi" },
  { key: "socio_emotional", label: "Sosial-Emosional" },
  { key: "independence", label: "Kemandirian / Practical Life" },
  { key: "executive_function", label: "Executive Function" },
  { key: "adaptive", label: "Adaptive Behavior" },
] as const;
