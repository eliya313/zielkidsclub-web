import type { Metadata } from "next";
import KerjasamaForm from "./kerjasama-form";

export const metadata: Metadata = {
  title: "Kerjasama",
  description:
    "Jalin kerjasama dengan Ziel Kids Club Malang: Pop Up Class di sekolah, hotel, dan mal, serta kemitraan program anak usia dini.",
};

export default function KerjasamaPage() {
  return <KerjasamaForm />;
}
