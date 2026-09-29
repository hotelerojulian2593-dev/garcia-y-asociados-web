import type { Metadata } from "next";
import Link from "next/link";
import { FondoHero, HeroCapas } from "@/components/HeroCapas";
import { Galeria } from "@/components/Galeria";
import { ReelVertical } from "@/components/ReelVertical";
import { Tilt } from "@/components/Tilt";
import { porSlug } from "@/lib/inventario";
import { SITIO, enlaceWhatsApp } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "El Vallenato P.H. · 108 suites sobre planos en Santa Fe de Antioquia",
  description: "Proyecto sobre planos en Santa Fe de Antioquia: 108 suites, museo, restaurante, piscina en el piso 14 y helipuerto según los renders. Entrega prevista 2029. Comercializa García & Asociados.",
  openGraph: { images: [{ url: "/img/vallenato-01-torre.webp", alt: "Render de la torre de El Vallenato P.H." }] },
};

const AMENIDADES: [string, string, string, string][] = [
  ["Piso 1", "Museo y galería", "Un espacio cultural abierto en la planta baja, con la música vallenata como hilo conductor.", "/img/vallenato-09-museo-piso1.webp"],
  ["Piso 13", "Restaurante", "Comedor con murales de colores y vista a las montañas de Santa Fe de Antioquia.", "/img/vallenato-10-restaurante-piso13.webp"],
  ["Piso 14", "Piscina", "Piscina de borde infinito orientada al paisaje del Occidente antioqueño.", "/img/vallenato-11-piscina-piso14.webp"],
  ["Cubierta", "Helipuerto", "Plataforma en la cubierta de la torre.", "/img/vallenato-12-helipuerto.webp"],
  ["Nivel de acceso", "Cancha de pádel", "Cancha al pie de la torre, junto a las zonas comunes.", "/img/vallenato-14-padel.webp"],
  ["Zonas comunes", "Coworking", "Espacio de trabajo con vista, pensado para estancias largas y teletrabajo.", "/img/vallenato-13-coworking.webp"],
];

const TIPOLOGIAS: [string, string, string][] = [
  ["Suite Estudio", "Unidad compacta con balcón; áreas y precio por confirmar.", "/img/vallenato-15-suite-estudio.webp"],
  ["Grand Suite", "Unidad amplia con jacuzzi en el balcón; áreas y precio por confirmar.", "/img/vallenato-16-grand-suite.webp"],
];

export default function ElVallenato() {
  const p = porSlug("el-vallenato-ph");
  if (!p) return null;
  const hrefContacto = `/contacto/?inmueble=${encodeURIComponent(p.codigo)}`;

  return (
    <article>
      <HeroCapas className="hero-proyecto">
        <div className="hero-capa hero-fondo" data-profundidad="-0.35">
          <FondoHero poster="/img/vallenato-01-torre.webp" alt="Render de la torre de El Vallenato P.H. al atardecer, con balcones curvos y vegetación" />
        </div>
        <div className="hero-capa hero-velo" data-profundidad="-0.15" />
        <div className="hero-capa hero-grano" aria-hidden />
        <div className="hero-contenido wrap">
          <p className="eyebrow eyebrow-claro mb-6">Proyecto sobre planos · Santa Fe de Antioquia</p>
          <h1 id="titulo-hero">El Vallenato <em>P.H.</em></h1>
          <p className="mt-7 max-w-[50ch] text-lg leading-relaxed text-piedra">
            108 suites en una torre de balcones curvos con vegetación, museo, restaurante, piscina en el piso 14 y helipuerto. Entrega prevista para 2029.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={hrefContacto} className="btn btn-bronce">Recibir información</Link>
            <a href="#galeria" className="btn btn-claro">Ver renders</a>
          </div>
        </div>
        <p className="hero-leyenda">Render del proyecto</p>
        <span className="hero-indicador" aria-hidden />
      </HeroCapas>

      <section className="wrap seccion grid gap-12 lg:grid-cols-[1fr_360px]" aria-labelledby="t-intro">
        <div className="revelar">
          <p className="eyebrow mb-4">El proyecto</p>
          <h2 id="t-intro">Una torre pensada para vivir, descansar y recibir.</h2>
          <div className="prosa mt-5 max-w-[62ch]">
            <p>{p.descripcion}</p>
            <p>
              Santa Fe de Antioquia, a unos 40 minutos de Medellín por el Túnel de Occidente, es un destino de descanso de clima cálido y patrimonio colonial. El proyecto combina suites para vivienda o estancias cortas con zonas comunes de hotel.
            </p>
          </div>
          <p className="aviso mt-6">No se garantiza rentabilidad ni valorización. Las imágenes son renders del proyecto y pueden cambiar durante el desarrollo. Tipologías, áreas, precios y plan de pagos se publican con la información autorizada.</p>
        </div>
        <aside className="contacto-pegajoso self-start rounded border border-piedra bg-blanco p-6" aria-label="Contacto sobre el proyecto">
          <p className="text-[.7rem] uppercase tracking-[.16em] text-humo">Ficha rápida</p>
          <dl className="mt-3 grid gap-3 text-sm">
            {[["Ubicación", `${p.ciudad}, ${p.departamento}`], ["Unidades", `${p.unidadesTotales} suites`], ["Entrega prevista", p.entrega ?? "Por confirmar"], ["Tipologías", "Suite Estudio · Grand Suite"], ["Precios", "Se publican con la información autorizada"], ["Código", p.codigo]].map(([k, v]) => (
              <div key={k} className="border-b border-piedra pb-2"><dt className="text-humo">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5 grid gap-3">
            <a href={enlaceWhatsApp({ codigo: p.codigo, titulo: p.titulo })} target="_blank" rel="noopener" className="btn btn-bronce" data-seguimiento="whatsapp">Escribir por WhatsApp</a>
            <Link href={hrefContacto} className="btn btn-carbon">Recibir información</Link>
          </div>
        </aside>
      </section>

      <section className="bg-carbon py-[clamp(4rem,9vw,8rem)] text-blanco" aria-labelledby="t-amen">
        <div className="wrap">
          <p className="eyebrow mb-4">Zonas comunes según los renders</p>
          <h2 id="t-amen" className="text-blanco">De la galería del primer piso al helipuerto.</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AMENIDADES.map(([piso, nombre, texto, img], k) => (
              <li key={nombre} className="revelar" style={{ transitionDelay: `${(k % 3) * 80}ms` }}>
                <Tilt intensidad={3}>
                  <figure className="overflow-hidden rounded border border-white/10">
                    <div className="marco-imagen"><img src={img} alt={`Render: ${nombre}`} loading="lazy" width={1600} height={914} /><span className="chip chip-claro absolute left-3 top-3">Render</span></div>
                    <figcaption className="p-5">
                      <p className="text-[.66rem] uppercase tracking-[.16em] text-bronce-2">{piso}</p>
                      <p className="serif mt-1 text-2xl text-blanco">{nombre}</p>
                      <p className="mt-2 text-sm text-piedra">{texto}</p>
                    </figcaption>
                  </figure>
                </Tilt>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap seccion" aria-labelledby="t-tipo">
        <p className="eyebrow mb-4">Tipologías</p>
        <h2 id="t-tipo">Dos formatos de suite.</h2>
        <p className="lead mt-4">El documento de diseño del proyecto menciona también una tipología dúplex; se publicará cuando exista material autorizado.</p>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {TIPOLOGIAS.map(([nombre, texto, img]) => (
            <li key={nombre} className="revelar tarjeta">
              <div className="marco-imagen"><img src={img} alt={`Render: ${nombre}`} loading="lazy" width={1600} height={914} /><span className="chip chip-claro absolute left-3 top-3">Render</span></div>
              <div className="p-6">
                <h3>{nombre}</h3>
                <p className="mudo mt-2 text-sm">{texto}</p>
                <p className="serif mt-4 text-xl">Consultar precio</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="galeria" className="wrap seccion-compacta" aria-labelledby="t-gal">
        <p className="eyebrow mb-4">Galería</p>
        <h2 id="t-gal" className="mb-8">Renders del proyecto.</h2>
        <Galeria imagenes={p.imagenes} titulo={p.titulo} />
      </section>

      <section className="bg-marfil-2 py-[clamp(4rem,9vw,8rem)]" aria-labelledby="t-video">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow mb-4">Video</p>
            <h2 id="t-video">El proyecto en movimiento.</h2>
            <p className="lead mt-4">Reel de 39 segundos con los renders del proyecto. Se reproduce solo cuando usted lo activa.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={hrefContacto} className="btn btn-carbon">Recibir información</Link>
              <Link href={`${hrefContacto}&motivo=visita`} className="btn btn-borde" data-seguimiento="agendar">Agendar una reunión</Link>
            </div>
          </div>
          <ReelVertical src="/video/el-vallenato-ph.mp4" poster="/img/el-vallenato-ph-video-poster.webp" titulo="Reel de El Vallenato P.H. · 39 s" />
        </div>
      </section>

      <section className="wrap seccion-compacta text-xs text-humo" aria-labelledby="t-origen">
        <h2 id="t-origen" className="text-base">Procedencia de la información</h2>
        <p className="mt-2">{p.origen.fuente}</p>
        <p className="mt-1">Imágenes: {p.origen.imagenes}</p>
        <p className="mt-1">Comercializa: {SITIO.razonSocial}. Información verificada el {p.origen.verificadoEl}; sujeta a confirmación.</p>
      </section>

      <div data-barra-contacto className="barra-contacto-movil lg:hidden" aria-label="Contacto rápido sobre el proyecto">
        <a href={enlaceWhatsApp({ codigo: p.codigo, titulo: p.titulo })} target="_blank" rel="noopener" className="btn btn-bronce flex-1" data-seguimiento="whatsapp">WhatsApp</a>
        <Link href={hrefContacto} className="btn btn-carbon flex-1">Información</Link>
      </div>
    </article>
  );
}
