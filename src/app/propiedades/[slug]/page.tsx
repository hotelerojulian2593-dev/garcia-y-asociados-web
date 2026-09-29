import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Galeria } from "@/components/Galeria";
import { SinFoto } from "@/components/SinFoto";
import { TarjetaPropiedad } from "@/components/TarjetaPropiedad";
import { NOMBRE_TIPO, aTarjeta, formatoArea, formatoPrecio, porSlug, publicadas, todasLasPropiedades } from "@/lib/inventario";
import { SITIO, enlaceWhatsApp } from "@/lib/sitio";

export function generateStaticParams() {
  return todasLasPropiedades().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = porSlug(slug);
  if (!p) return {};
  return {
    title: `${p.titulo} · ${NOMBRE_TIPO[p.tipo]} en ${p.ciudad}`,
    description: p.resumen,
    robots: p.demo ? { index: false, follow: true } : undefined,
    openGraph: p.imagenes[0] ? { images: [{ url: p.imagenes[0].src, alt: p.imagenes[0].alt }] } : undefined,
  };
}

export default async function Detalle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = porSlug(slug);
  if (!p) notFound();

  const filas: [string, string][] = [
    ["Tipo", NOMBRE_TIPO[p.tipo]],
    ["Ubicación", `${p.barrioSector}, ${p.ciudad}${p.departamento ? ` (${p.departamento})` : ""}`],
  ];
  if (typeof p.habitaciones === "number") filas.push(["Habitaciones", String(p.habitaciones)]);
  if (typeof p.banos === "number") filas.push(["Baños", String(p.banos)]);
  if (typeof p.parqueaderos === "number") filas.push(["Parqueaderos", String(p.parqueaderos)]);
  if (typeof p.pisos === "number") filas.push(["Pisos", String(p.pisos)]);
  const ac = formatoArea(p.areaConstruida); if (ac) filas.push(["Área construida", ac]);
  const al = formatoArea(p.areaLote, p.areaDesde); if (al) filas.push(["Área de lote", al]);
  if (typeof p.unidadesDisponibles === "number") filas.push(["Unidades disponibles", String(p.unidadesDisponibles)]);
  if (typeof p.unidadesTotales === "number") filas.push(["Unidades del proyecto", String(p.unidadesTotales)]);
  if (p.entrega) filas.push(["Entrega prevista", p.entrega]);
  filas.push(["Precio", formatoPrecio(p)]);
  filas.push(["Código", p.codigo]);

  const relacionadas = publicadas().filter((q) => q.slug !== p.slug && (q.categoria === p.categoria || q.ciudad === p.ciudad)).slice(0, 3).map(aTarjeta);
  const hrefContacto = `/contacto/?inmueble=${encodeURIComponent(p.codigo)}`;

  return (
    <article>
      <div className="wrap pt-8">
        <nav aria-label="Ruta" className="text-xs uppercase tracking-[.12em] text-humo">
          <Link href="/">Inicio</Link> <span aria-hidden>›</span> <Link href={p.categoria === "hotel" ? "/hoteles-e-inversion/" : p.categoria === "proyecto" ? "/proyectos/" : "/propiedades/"}>{p.categoria === "hotel" ? "Hoteles e inversión" : p.categoria === "proyecto" ? "Proyectos" : "Propiedades"}</Link> <span aria-hidden>›</span> <span aria-current="page">{p.titulo}</span>
        </nav>
        <header className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[44rem]">
            <div className="mb-3 flex flex-wrap gap-2">
              {p.demo && <span className="chip chip-demo">Demostración</span>}
              {p.confidencial && <span className="chip">Venta confidencial</span>}
              {p.fichaEnPreparacion && <span className="chip">Ficha en preparación</span>}
              <span className="chip">{NOMBRE_TIPO[p.tipo]} · {p.ciudad}</span>
            </div>
            <h1 className="text-[clamp(2.2rem,4.5vw,3.8rem)]">{p.titulo}</h1>
            <p className="lead mt-4">{p.resumen}</p>
          </div>
          <p className="serif text-3xl">{formatoPrecio(p)}</p>
        </header>
      </div>

      {p.demo && (
        <div className="wrap mt-6"><p className="aviso">Contenido de demostración; pendiente de inventario autorizado. Los datos son ilustrativos y no corresponden a un inmueble real.</p></div>
      )}

      <div className="wrap mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-12">
          {p.imagenes.length > 0 ? (
            <Galeria imagenes={p.imagenes} titulo={p.titulo} />
          ) : (
            <div className="relative aspect-[16/10] overflow-hidden rounded"><SinFoto demo={p.demo} enPreparacion={p.fichaEnPreparacion} /></div>
          )}

          <section aria-labelledby="t-desc" className="revelar">
            <h2 id="t-desc" className="text-3xl">Descripción</h2>
            <div className="prosa mt-4 max-w-[66ch]"><p>{p.descripcion}</p></div>
          </section>

          {p.caracteristicas.length > 0 && (
            <section aria-labelledby="t-car" className="revelar">
              <h2 id="t-car" className="text-3xl">Características</h2>
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {p.caracteristicas.map((c) => <li key={c} className="border-b border-piedra py-2 text-sm">{c}</li>)}
              </ul>
            </section>
          )}

          <section aria-labelledby="t-ficha" className="revelar">
            <h2 id="t-ficha" className="text-3xl">Ficha</h2>
            <table className="ficha mt-4"><tbody>
              {filas.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}
            </tbody></table>
          </section>

          <section aria-labelledby="t-ubi" className="revelar">
            <h2 id="t-ubi" className="text-3xl">Ubicación</h2>
            <p className="prosa mt-4 max-w-[66ch]">
              {p.barrioSector}, {p.ciudad}. {p.confidencial ? "Por tratarse de una venta confidencial, la ubicación exacta y la fachada se comparten únicamente tras firmar un acuerdo de confidencialidad." : "La dirección exacta se comparte con interesados verificados antes de la visita."}
            </p>
          </section>

          <section aria-labelledby="t-visita" className="revelar rounded border border-piedra bg-blanco p-6">
            <h2 id="t-visita" className="text-2xl">Planos y recorrido</h2>
            <p className="mudo mt-2 text-sm">
              {p.recorridoVirtual
                ? "Esta propiedad cuenta con recorrido virtual autorizado."
                : "Esta ficha no incluye recorrido virtual ni planos publicados. Lo que sí podemos ofrecer es una visita privada con un asesor de la firma."}
            </p>
            {p.recorridoVirtual ? (
              <a href={p.recorridoVirtual} className="btn btn-carbon mt-4" target="_blank" rel="noopener">Abrir recorrido</a>
            ) : (
              <Link href={`${hrefContacto}&motivo=visita`} className="btn btn-carbon mt-4" data-seguimiento="agendar">Solicitar una visita privada</Link>
            )}
          </section>

          <section aria-labelledby="t-origen" className="revelar text-xs text-humo">
            <h2 id="t-origen" className="text-base">Procedencia de la información</h2>
            <p className="mt-2">{p.origen.fuente}</p>
            <p className="mt-1">Imágenes: {p.origen.imagenes}</p>
            <p className="mt-1">Disponibilidad verificada: {p.origen.verificadoEl ?? "pendiente"}.</p>
          </section>
        </div>

        <aside className="contacto-pegajoso self-start rounded border border-piedra bg-blanco p-6" aria-label="Contacto sobre esta propiedad">
          <p className="text-[.7rem] uppercase tracking-[.16em] text-humo">Consultar por</p>
          <p className="serif mt-1 text-2xl leading-tight">{p.titulo}</p>
          <p className="mudo mt-1 text-xs">Código {p.codigo}</p>
          <div className="mt-5 grid gap-3">
            <a href={enlaceWhatsApp({ codigo: p.codigo, titulo: p.titulo })} target="_blank" rel="noopener" className="btn btn-bronce" data-seguimiento="whatsapp">Escribir por WhatsApp</a>
            <Link href={`${hrefContacto}&motivo=visita`} className="btn btn-carbon" data-seguimiento="agendar">Agendar visita privada</Link>
            <Link href={hrefContacto} className="btn btn-borde">Solicitar información</Link>
            {p.paginaPropia && (
              <Link href={p.paginaPropia} className="btn-texto text-center text-sm">Ver la página completa del proyecto →</Link>
            )}
            {p.enlaceExterno && (
              <a href={p.enlaceExterno} target="_blank" rel="noopener" className="btn-texto text-center text-sm">Ver la página completa del proyecto ↗</a>
            )}
          </div>
          <p className="mudo mt-5 text-xs">Respondemos en horario comercial. No se garantiza rentabilidad ni valorización.</p>
        </aside>
      </div>

      {/* Barra de contacto móvil vinculada al inmueble (oculta el WhatsApp genérico del layout). */}
      <div data-barra-contacto className="barra-contacto-movil lg:hidden" aria-label="Contacto rápido sobre esta propiedad">
        <a href={enlaceWhatsApp({ codigo: p.codigo, titulo: p.titulo })} target="_blank" rel="noopener" className="btn btn-bronce flex-1" data-seguimiento="whatsapp">WhatsApp</a>
        <Link href={`${hrefContacto}&motivo=visita`} className="btn btn-carbon flex-1" data-seguimiento="agendar">Agendar visita</Link>
      </div>

      {relacionadas.length > 0 && (
        <section className="wrap seccion" aria-labelledby="t-rel">
          <h2 id="t-rel" className="text-3xl">También puede interesarle</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relacionadas.map((r) => <li key={r.slug} className="revelar"><TarjetaPropiedad p={r} /></li>)}
          </ul>
        </section>
      )}
    </article>
  );
}
