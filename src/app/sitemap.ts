import type { MetadataRoute } from "next";
import { publicadas } from "@/lib/inventario";
import { NAVEGACION, URL_SITIO } from "@/lib/sitio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  const paginas = [{ url: `${URL_SITIO}/`, lastModified: ahora, priority: 1 }, ...NAVEGACION.map((n) => ({ url: `${URL_SITIO}${n.href}`, lastModified: ahora, priority: 0.8 }))];
  // Las fichas de demostración no entran al sitemap.
  const fichas = publicadas().filter((p) => !p.demo).map((p) => ({ url: `${URL_SITIO}/propiedades/${p.slug}/`, lastModified: p.origen.verificadoEl ? new Date(p.origen.verificadoEl) : ahora, priority: 0.7 }));
  return [...paginas, ...fichas];
}
