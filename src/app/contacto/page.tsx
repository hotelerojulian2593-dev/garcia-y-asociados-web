import type { Metadata } from "next";
import { FormularioContacto } from "@/components/FormularioContacto";
import { CabeceraPagina } from "@/components/Titulo";
import { publicadas } from "@/lib/inventario";
import { SITIO, enlaceWhatsApp } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Contacto y visitas privadas",
  description: `Escriba a García & Asociados por WhatsApp (${SITIO.whatsappVisible}) o correo, o solicite una visita privada a una propiedad.`,
};

export default function Contacto() {
  const opciones = publicadas().map((p) => ({ codigo: p.codigo, titulo: p.titulo }));
  return (
    <>
      <CabeceraPagina eyebrow="Contacto" titulo="Cuéntenos qué busca." lead="Nombre, un medio de contacto y la propiedad o el tipo de inmueble que le interesa. Respondemos en horario comercial." />
      <section className="wrap seccion-compacta grid gap-12 lg:grid-cols-[1fr_340px]" aria-label="Formulario y datos de contacto">
        <FormularioContacto opciones={opciones} />
        <aside className="self-start rounded border border-gris-claro bg-blanco p-6 text-sm" aria-label="Canales de contacto">
          <p className="text-[.7rem] uppercase tracking-[.16em] text-gris-texto">Canales directos</p>
          <div className="mt-4 grid gap-3">
            <a href={enlaceWhatsApp()} target="_blank" rel="noopener" className="btn btn-azul" data-seguimiento="whatsapp">Escribir por WhatsApp</a>
            <a href={enlaceWhatsApp({ motivo: "visita" })} target="_blank" rel="noopener" className="btn btn-carbon" data-seguimiento="agendar">Solicitar visita privada</a>
            <a href={`mailto:${SITIO.correo}`} className="break-all text-center text-sm underline underline-offset-4">{SITIO.correo}</a>
          </div>
          <dl className="mt-6 grid gap-3">
            <div><dt className="text-gris-texto">Oficina</dt><dd>{SITIO.direccion}<br />{SITIO.ciudad}, {SITIO.pais}</dd></div>
            <div><dt className="text-gris-texto">Zona de servicio</dt><dd>{SITIO.zonaServicio.join(" · ")}</dd></div>
          </dl>
          <p className="mudo mt-6 text-xs">Sus datos se tratan conforme a la <a href="/politica-de-datos/" className="underline">política de tratamiento de datos</a>.</p>
        </aside>
      </section>
    </>
  );
}
