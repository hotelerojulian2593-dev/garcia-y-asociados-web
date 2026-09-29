import sitio from "@contenido/sitio.json";

export const SITIO = sitio;

export const URL_SITIO = (process.env.NEXT_PUBLIC_SITE_URL || "https://garcia-y-asociados.netlify.app").replace(/\/$/, "");
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const GHL_FORM_ID = process.env.NEXT_PUBLIC_GHL_FORM_ID || "";
export const GHL_CALENDAR_ID = process.env.NEXT_PUBLIC_GHL_CALENDAR_ID || "";
export const GHL_WIDGET_HOST = "https://link.marketinghotelero.com";

/** Enlace de WhatsApp con mensaje prellenado. `codigo` vincula la consulta al inmueble. */
export function enlaceWhatsApp(opciones?: { codigo?: string; titulo?: string; motivo?: "informacion" | "visita" }) {
  const { codigo, titulo, motivo = "informacion" } = opciones ?? {};
  let texto: string;
  if (codigo && titulo) {
    texto =
      motivo === "visita"
        ? `Hola, vi ${titulo} (${codigo}) en la página de García & Asociados y quiero agendar una visita privada.`
        : `Hola, vi ${titulo} (${codigo}) en la página de García & Asociados y quiero más información.`;
  } else {
    texto =
      motivo === "visita"
        ? "Hola, vi la página de García & Asociados y quiero agendar una visita privada."
        : "Hola, vi la página de García & Asociados y quiero información sobre una propiedad.";
  }
  return `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export const NAVEGACION = [
  { href: "/propiedades/", etiqueta: "Propiedades" },
  { href: "/hoteles-e-inversion/", etiqueta: "Hoteles e inversión" },
  { href: "/proyectos/", etiqueta: "Proyectos" },
  { href: "/quienes-somos/", etiqueta: "Quiénes somos" },
  { href: "/por-que-escogernos/", etiqueta: "Por qué escogernos" },
  { href: "/contacto/", etiqueta: "Contacto" },
] as const;
