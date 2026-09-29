import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/Titulo";
import { TarjetaPropiedad } from "@/components/TarjetaPropiedad";
import { aTarjeta, porCategoria, porSlug } from "@/lib/inventario";

export const metadata: Metadata = {
  title: "Proyectos destacados en Antioquia",
  description: "Lotes campestres y proyectos sobre planos comercializados por García & Asociados en Santa Fe de Antioquia y el resto de Antioquia.",
};

export default function Proyectos() {
  const proyectos = porCategoria("proyecto");
  const vallenato = porSlug("el-vallenato-ph");
  return (
    <>
      <CabeceraPagina eyebrow="Proyectos destacados" titulo="Proyectos verificados, uno por uno." lead="Espacio editorial para lotes y proyectos sobre planos. Solo publicamos proyectos con información entregada por la firma; las fichas en preparación se indican como tales." />
      <section className="wrap seccion-compacta" aria-label="Proyectos">
        <ul className="grid gap-6 md:grid-cols-2">
          {proyectos.map((p, k) => <li key={p.slug} className="revelar"><TarjetaPropiedad p={aTarjeta(p)} prioridad={k === 0} /></li>)}
        </ul>
      </section>

      {vallenato && (
        <section className="wrap seccion" aria-labelledby="t-vallenato">
          <div className="grid gap-10 rounded border border-piedra bg-blanco p-8 md:p-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow mb-4">Ficha especial</p>
              <h2 id="t-vallenato">{vallenato.titulo}</h2>
              <div className="prosa mt-5 max-w-[60ch]">
                <p>{vallenato.descripcion}</p>
                <p>La página del proyecto reúne los renders, las zonas comunes por piso, las dos tipologías y el reel. Precios y plan de pagos se publican con la información autorizada.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/el-vallenato-ph/" className="btn btn-carbon">Ver la página del proyecto</Link>
                <Link href={`/contacto/?inmueble=${vallenato.codigo}`} className="btn btn-borde">Recibir información</Link>
              </div>
            </div>
            <dl className="grid content-start gap-4 text-sm">
              {[
                ["Ubicación", `${vallenato.ciudad}, ${vallenato.departamento}`],
                ["Unidades", String(vallenato.unidadesTotales)],
                ["Entrega prevista", vallenato.entrega ?? "Por confirmar"],
                ["Tipologías y precios", "Se publican con la información autorizada"],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-piedra pb-3"><dt className="text-[.68rem] uppercase tracking-[.14em] text-humo">{k}</dt><dd className="mt-1">{v}</dd></div>
              ))}
            </dl>
          </div>
        </section>
      )}
    </>
  );
}
