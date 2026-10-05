import sitio from "@contenido/sitio.json";

export const SITIO = sitio;

export const URL_SITIO = (process.env.NEXT_PUBLIC_SITE_URL || "https://inmobiliariagarciayasociados.com").replace(/\/$/, "");
/** Meta Pixel. La variable de entorno manda; si falta, se usa el id de contenido/sitio.json. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || sitio.meta?.pixelId || "";
export const GHL_FORM_ID = process.env.NEXT_PUBLIC_GHL_FORM_ID || "";
export const GHL_CALENDAR_ID = process.env.NEXT_PUBLIC_GHL_CALENDAR_ID || "";
export const GHL_WIDGET_HOST = "https://link.marketinghotelero.com";
/** Widget de chat en directo de GoHighLevel (Sitios → Widget de chat). Vacío = no se carga. */
export const GHL_CHAT_WIDGET_ID = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_ID ?? sitio.ghl?.chatWidgetId ?? "";

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
  { href: "/el-vallenato-ph/", etiqueta: "El Vallenato P.H." },
  { href: "/quienes-somos/", etiqueta: "Quiénes somos" },
  { href: "/por-que-escogernos/", etiqueta: "Por qué escogernos" },
  { href: "/guias/", etiqueta: "Guías" },
  { href: "/contacto/", etiqueta: "Contacto" },
] as const;
