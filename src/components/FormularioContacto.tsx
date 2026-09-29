"use client";
import { useEffect, useMemo, useState } from "react";
import { GHL_CALENDAR_ID, GHL_FORM_ID, GHL_WIDGET_HOST, SITIO } from "@/lib/sitio";

type Opcion = { codigo: string; titulo: string };

/**
 * Formulario de contacto honesto.
 * - Con NEXT_PUBLIC_GHL_FORM_ID: incrusta el formulario de GoHighLevel con la atribución
 *   (utm_*, gclid, fbclid, landing_page, referrer, property_code) en la URL del iframe.
 * - Sin ID: compone un mensaje y lo abre en el WhatsApp comercial real. No muestra ninguna
 *   confirmación de envío porque no se ha enviado nada a un CRM.
 */
export function FormularioContacto({ opciones }: { opciones: Opcion[] }) {
  const [nombre, setNombre] = useState("");
  const [medio, setMedio] = useState("");
  const [interes, setInteres] = useState("");
  const [motivo, setMotivo] = useState<"informacion" | "visita">("informacion");
  const [mensaje, setMensaje] = useState("");
  const [consiente, setConsiente] = useState(false);
  const [intento, setIntento] = useState(false);
  const [atribucion, setAtribucion] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inmueble = params.get("inmueble");
    if (inmueble) setInteres(inmueble);
    if (params.get("motivo") === "visita") setMotivo("visita");
    // Atribución persistente durante la sesión (mismo esquema que las landings de la firma).
    try {
      const claves = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
      const previo = JSON.parse(sessionStorage.getItem("ga_attr") || "{}") as Record<string, string>;
      const actual: Record<string, string> = { ...previo };
      claves.forEach((k) => { const v = params.get(k); if (v) actual[k] = v; });
      sessionStorage.setItem("ga_attr", JSON.stringify(actual));
      const q = new URLSearchParams();
      Object.entries(actual).forEach(([k, v]) => q.set(k === "gclid" ? "gclid_param" : k, v));
      q.set("landing_page", location.origin + location.pathname);
      q.set("referrer", document.referrer || "directo");
      if (inmueble) q.set("property_code", inmueble);
      setAtribucion(q.toString());
    } catch { /* almacenamiento no disponible: se sigue sin atribución */ }
  }, []);

  const seleccion = useMemo(() => opciones.find((o) => o.codigo === interes), [opciones, interes]);

  const textoWhatsApp = useMemo(() => {
    const partes = [
      `Hola, soy ${nombre || "…"}.`,
      motivo === "visita" ? "Quiero agendar una visita privada." : "Quiero recibir información.",
      seleccion ? `Inmueble: ${seleccion.titulo} (${seleccion.codigo}).` : interes ? `Interés: ${interes}.` : "",
      medio ? `Pueden contactarme por: ${medio}.` : "",
      mensaje ? `Mensaje: ${mensaje}` : "",
      "Enviado desde la página web de García & Asociados.",
    ].filter(Boolean);
    return `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(partes.join("\n"))}`;
  }, [nombre, motivo, seleccion, interes, medio, mensaje]);

  const valido = nombre.trim().length > 1 && medio.trim().length > 3 && consiente;

  if (GHL_FORM_ID) {
    const src = `${GHL_WIDGET_HOST}/widget/form/${GHL_FORM_ID}${atribucion ? `?${atribucion}` : ""}`;
    return (
      <div className="grid gap-6">
        <iframe src={src} id={`inline-${GHL_FORM_ID}`} data-form-id={GHL_FORM_ID} data-layout='{"id":"INLINE"}' data-form-name="Contacto web" title="Formulario de contacto" style={{ width: "100%", minHeight: 640, border: 0 }} />
        <script src={`${GHL_WIDGET_HOST}/js/form_embed.js`} async />
        {GHL_CALENDAR_ID && (
          <iframe src={`${GHL_WIDGET_HOST}/widget/booking/${GHL_CALENDAR_ID}${atribucion ? `?${atribucion}` : ""}`} title="Agendar una visita" style={{ width: "100%", minHeight: 700, border: 0 }} />
        )}
      </div>
    );
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(e) => { e.preventDefault(); setIntento(true); if (valido) window.open(textoWhatsApp, "_blank", "noopener"); }}
      noValidate
    >
      <div className="aviso">
        Este formulario prepara su mensaje y lo abre en el WhatsApp comercial de la firma ({SITIO.whatsappVisible}).
        La conexión directa con el CRM se activa al publicar el sitio.
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="campo">
          <label htmlFor="c-nombre">Nombre</label>
          <input id="c-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" required aria-invalid={intento && nombre.trim().length < 2} />
        </div>
        <div className="campo">
          <label htmlFor="c-medio">Medio de contacto (WhatsApp o correo)</label>
          <input id="c-medio" value={medio} onChange={(e) => setMedio(e.target.value)} placeholder="+57 300 000 0000" autoComplete="tel" required aria-invalid={intento && medio.trim().length < 4} />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="campo">
          <label htmlFor="c-interes">Propiedad o interés</label>
          <select id="c-interes" value={interes} onChange={(e) => setInteres(e.target.value)}>
            <option value="">Aún no elijo un inmueble</option>
            {opciones.map((o) => <option key={o.codigo} value={o.codigo}>{o.titulo}</option>)}
            <option value="Vivienda en Medellín o alrededores">Vivienda en Medellín o alrededores</option>
            <option value="Hotel o activo de inversión">Hotel o activo de inversión</option>
            <option value="Proyecto sobre planos">Proyecto sobre planos</option>
            <option value="Quiero vender mi propiedad">Quiero vender mi propiedad</option>
          </select>
        </div>
        <fieldset className="campo">
          <legend className="text-[.8rem] font-semibold tracking-[.04em]">Qué necesita</legend>
          <div className="flex gap-5 pt-2 text-sm">
            <label className="flex items-center gap-2 font-normal"><input type="radio" name="motivo" checked={motivo === "informacion"} onChange={() => setMotivo("informacion")} /> Información</label>
            <label className="flex items-center gap-2 font-normal"><input type="radio" name="motivo" checked={motivo === "visita"} onChange={() => setMotivo("visita")} /> Visita privada</label>
          </div>
        </fieldset>
      </div>
      <div className="campo">
        <label htmlFor="c-mensaje">Mensaje</label>
        <textarea id="c-mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Zona, presupuesto aproximado, plazo o cualquier detalle que nos ayude a preparar la respuesta." />
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1" checked={consiente} onChange={(e) => setConsiente(e.target.checked)} required aria-invalid={intento && !consiente} />
        <span>
          Autorizo el tratamiento de mis datos personales por {SITIO.razonSocial} para atender esta solicitud, conforme a la Ley 1581 de 2012 y la{" "}
          <a href="/politica-de-datos/" target="_blank" rel="noopener" className="underline">política de tratamiento de datos</a>.
        </span>
      </label>
      {intento && !valido && (
        <p className="text-sm text-[#8a3b1c]" role="alert">Complete nombre, medio de contacto y la autorización para continuar.</p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-carbon" data-seguimiento={motivo === "visita" ? "agendar" : "whatsapp"}>
          {motivo === "visita" ? "Solicitar visita por WhatsApp" : "Enviar por WhatsApp"}
        </button>
        <a className="btn btn-borde" href={`mailto:${SITIO.correo}?subject=${encodeURIComponent("Consulta desde la página web")}`}>Prefiero escribir un correo</a>
      </div>
    </form>
  );
}
