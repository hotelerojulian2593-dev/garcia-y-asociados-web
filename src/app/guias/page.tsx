import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/Titulo";
import { fechaLarga, todasLasGuias } from "@/lib/guias";

export const metadata: Metadata = {
  title: "Guías para comprar y vender en Medellín y Antioquia",
  description: "Criterios concretos para elegir inmobiliaria, comprar un hotel, orientarse por zonas de Antioquia y vender una propiedad. Escritas por el equipo de García & Asociados.",
};

export default function Guias() {
  const guias = todasLasGuias();
  return (
    <>
      <CabeceraPagina eyebrow="Guías" titulo="Respuestas antes de la primera visita." lead="Textos breves con criterios que puede comprobar. Sin promesas de rentabilidad ni cifras sin fuente. Cada guía indica su fecha de actualización." />
      <section className="wrap seccion-compacta" aria-label="Guías">
        <ul className="grid gap-6 md:grid-cols-2">
          {guias.map((g, k) => (
            <li key={g.slug} className="revelar tarjeta p-7" style={{ transitionDelay: `${(k % 2) * 80}ms` }}>
              <p className="text-[.7rem] uppercase tracking-[.16em] text-gris-texto">Actualizada el {fechaLarga(g.fecha)}</p>
              <h2 className="mt-3 text-[1.5rem] leading-tight"><Link href={`/guias/${g.slug}/`} className="no-underline hover:underline">{g.titulo}</Link></h2>
              <p className="mudo mt-3 text-sm">{g.resumen}</p>
              <Link href={`/guias/${g.slug}/`} className="btn-texto mt-5 inline-block">Leer la guía →</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
