import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/Titulo";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Por qué escogernos",
  description: "Argumentos comprobables para elegir a García & Asociados: fichas con procedencia, dirección reservada, fotografía real y un proceso de compra claro.",
};

const ARGUMENTOS = [
  ["Cada dato tiene procedencia", "Las fichas registran la fuente de la información, de las imágenes y la fecha de verificación de disponibilidad. Lo que no está confirmado se dice así.", "Compruébelo en el pie de cualquier ficha del catálogo."],
  ["La dirección exacta no se publica", "El sitio muestra el sector y la ciudad. La ubicación precisa se entrega a interesados verificados antes de la visita, lo que protege al propietario y evita visitas no solicitadas.", "Compruébelo en la sección «Ubicación» de cada ficha."],
  ["Fotografía real, renders identificados", "No usamos imágenes sintéticas para representar un inmueble. Los renders de proyectos se marcan como tales y las fotografías indican su fecha.", "Compruébelo en las leyendas de las galerías."],
  ["Venta confidencial cuando hace falta", "Para hoteles y activos en operación, trabajamos con nombre en clave, sin fachada reconocible y con acuerdo de confidencialidad antes de compartir cifras.", "Compruébelo en Playa Candela, en la sección de hoteles."],
  ["Un proceso de compra explícito", "Solicitud, acuerdo de confidencialidad y ficha completa, visita y due diligence, cierre. Sin promesas de rentabilidad ni valorización.", "Compruébelo en «Hoteles e inversión»."],
  ["Un canal directo", `Las consultas llegan al WhatsApp comercial de la firma (${SITIO.whatsappVisible}) y se responden en horario comercial. Cada consulta queda vinculada al inmueble que la originó.`, "Compruébelo en el botón de contacto de cualquier ficha."],
];

export default function PorQue() {
  return (
    <>
      <CabeceraPagina eyebrow="Por qué escogernos" titulo="Seis motivos que puede verificar en este mismo sitio." lead="No citamos años de experiencia, cifras de ventas ni testimonios que no podamos documentar. Estos son los procesos con los que trabajamos." />
      <section className="wrap seccion-compacta" aria-label="Argumentos">
        <ol className="grid gap-5 md:grid-cols-2">
          {ARGUMENTOS.map(([t, d, v], k) => (
            <li key={t} className="revelar rounded border border-gris-claro bg-blanco p-6" style={{ transitionDelay: `${(k % 2) * 80}ms` }}>
              <span className="serif text-3xl text-azul">{String(k + 1).padStart(2, "0")}</span>
              <h2 className="mt-2 text-2xl">{t}</h2>
              <p className="mudo mt-3 text-sm">{d}</p>
              <p className="mt-4 text-xs uppercase tracking-[.12em] text-azul">{v}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/propiedades/" className="btn btn-carbon">Explorar propiedades</Link>
          <Link href="/contacto/?motivo=visita" className="btn btn-borde" data-seguimiento="agendar">Agendar una visita privada</Link>
        </div>
      </section>
    </>
  );
}
