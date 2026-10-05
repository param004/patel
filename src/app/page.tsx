import { redirect } from "next/navigation";

/**
 * Die Website besteht jetzt aus einer einzigen Seite.
 *
 * Alles, was früher hier stand — der Schattenweg unter `/`, der Einstieg unter
 * `/kage`, die Portfolio-Abschnitte unter `/portfolio` und die Projektseiten
 * unter `/work/[slug]` — wurde entfernt, damit `kage.portfolio.html` das
 * einzige Dokument im Projekt ist. Statt auf dem Root-Pfad einen 404 zu
 * werfen, wird man weitergeleitet.
 *
 * @see src/app/kage-personalized/page.tsx
 * @see public/landing-pages/kage.portfolio.html
 */
export default function Home() {
  redirect("/kage-personalized");
}