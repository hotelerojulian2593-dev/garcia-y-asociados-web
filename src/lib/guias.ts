/** Guías de contenido útil (SEO y visibilidad en asistentes de IA). Una guía por archivo JSON en contenido/guias/. */
import fs from "node:fs";
import path from "node:path";

export type Guia = {
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string;
  autor: string;
  secciones: { titulo: string; parrafos: string[] }[];
  preguntas: { p: string; r: string }[];
  cta: { texto: string; href: string };
};

const DIR = path.join(process.cwd(), "contenido", "guias");

export function todasLasGuias(): Guia[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Guia)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || a.titulo.localeCompare(b.titulo, "es"));
}

export function guiaPorSlug(slug: string): Guia | undefined {
  return todasLasGuias().find((g) => g.slug === slug);
}

export function fechaLarga(iso: string): string {
  return new Date(`${iso}T12:00:00-05:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}
