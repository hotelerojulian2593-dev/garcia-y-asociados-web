/**
 * Capa de inventario (solo servidor / build).
 *
 * Hoy lee los archivos JSON de `contenido/propiedades/`. Los nombres de campo
 * siguen el esquema del Sistema Inmobiliario 360 (`titulo`, `operacion`, `tipo`,
 * `ciudad`, `barrioSector`, `precio`, `precioVisible`, `areaConstruida`,
 * `habitaciones`, `banos`, `parqueaderos`...) para que, cuando el catálogo pase a
 * la vista `propiedades_publicas` de Supabase, solo cambie este archivo.
 *
 * Regla fija: la dirección exacta nunca se publica. Aquí ni siquiera existe el campo.
 */
import fs from "node:fs";
import path from "node:path";
import type { Categoria, Propiedad } from "./tipos";

export * from "./tipos";

const DIR = path.join(process.cwd(), "contenido", "propiedades");

let cache: Propiedad[] | null = null;

export function todasLasPropiedades(): Propiedad[] {
  if (cache) return cache;
  const archivos = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  const lista = archivos.map((f) => {
    const crudo = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Propiedad;
    if (!crudo.slug || !crudo.codigo || !crudo.titulo) {
      throw new Error(`contenido/propiedades/${f}: faltan slug, codigo o titulo.`);
    }
    if (crudo.precioVisible && typeof crudo.precio !== "number") {
      throw new Error(`contenido/propiedades/${f}: precioVisible=true exige un precio numérico.`);
    }
    return { ...crudo, destacada: crudo.destacada ?? false, imagenes: crudo.imagenes ?? [], caracteristicas: crudo.caracteristicas ?? [] };
  });
  // Lo real primero, luego demostración; dentro de cada grupo, destacadas primero,
  // después lo más reciente (`orden` descendente) y por último el título.
  lista.sort((a, b) => {
    if (a.demo !== b.demo) return a.demo ? 1 : -1;
    if (!!a.destacada !== !!b.destacada) return a.destacada ? -1 : 1;
    if ((a.orden ?? 0) !== (b.orden ?? 0)) return (b.orden ?? 0) - (a.orden ?? 0);
    return a.titulo.localeCompare(b.titulo, "es");
  });
  cache = lista;
  return lista;
}

export function publicadas(): Propiedad[] {
  return todasLasPropiedades().filter((p) => p.estado !== "retirada");
}

export function porCategoria(categoria: Categoria): Propiedad[] {
  return publicadas().filter((p) => p.categoria === categoria);
}

export function porSlug(slug: string): Propiedad | undefined {
  return todasLasPropiedades().find((p) => p.slug === slug);
}

export function destacadas(limite = 4): Propiedad[] {
  return publicadas().filter((p) => p.destacada).slice(0, limite);
}

export function ciudades(): string[] {
  return Array.from(new Set(publicadas().map((p) => p.ciudad))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export function hayContenidoDemo(): boolean {
  return publicadas().some((p) => p.demo);
}

