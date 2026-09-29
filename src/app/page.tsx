import Link from "next/link";
import { HeroCapas } from "@/components/HeroCapas";
import { TarjetaPropiedad } from "@/components/TarjetaPropiedad";
import { Titulo } from "@/components/Titulo";
import { AvisoDemo } from "@/components/AvisoDemo";
import { aTarjeta, destacadas, porCategoria, porSlug } from "@/lib/inventario";
import { SITIO, enlaceWhatsApp } from "@/lib/sitio";

export default function Inicio() {
  const seleccion = destacadas(4).map(aTarjeta);
  const cerros = porSlug("cerros-de-la-antigua");
  const hoteles = porCategoria("hotel").filter((p) => !p.demo).length;
  const proyectos = porCategoria("proyecto").filter((p) => !p.demo).length;
  const heroImg = cerros?.imagenes[0];

  return (
    <>
      <HeroCapas>
        <div className="hero-capa hero-fondo" data-profundidad="-0.35">
          {heroImg && <img src={heroImg.src} alt="" fetchPriority="high" width={1600} height={1000} />}
        </div>
        <div className="hero-capa hero-velo" data-profundidad="-0.15" />
        <div className="hero-contenido wrap">
          <p className="eyebrow eyebrow-claro mb-5">Inmobiliaria · Medellín y Antioquia</p>
          <h1 id="titulo-hero">Casas, hoteles y proyectos que merecen una visita en persona.</h1>
          <p className="mt-6 max-w-[52ch] text-lg text-piedra">
            Comercializamos propiedades de gran formato, hoteles en operación y proyectos sobre planos en Medellín y Antioquia. Publicamos solo lo que está confirmado; el resto se comparte en una visita privada.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/propiedades/" className="btn btn-bronce">Explorar propiedades</Link>
            <Link href="/contacto/?motivo=visita" className="btn btn-claro" data-seguimiento="agendar">Agendar una visita privada</Link>
          </div>
          {heroImg && (
            <p className="mt-8 text-xs uppercase tracking-[.14em] text-piedra-2">Fotografía real · Santa Fe de Antioquia, septiembre 2026</p>
          )}
        </div>
        {cerros && (
          <aside className="hero-ficha" data-profundidad="0.25" aria-label="Propiedad destacada">
            <p className="text-[.68rem] uppercase tracking-[.16em] text-humo">Destacado · {cerros.ciudad}</p>
            <p className="serif mt-1 text-xl leading-tight">{cerros.titulo}</p>
            <p className="mt-2 text-sm text-humo">Lotes desde 2.824 m² · 26 disponibles</p>
            <Link href={`/propiedades/${cerros.slug}/`} className="btn-texto mt-3 inline-block">Ver ficha →</Link>
          </aside>
        )}
      </HeroCapas>

      <div className="mt-8"><AvisoDemo /></div>

      <section className="seccion" aria-labelledby="t-seleccion">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Titulo id="t-seleccion" eyebrow="Selección editorial" titulo="Cuatro propiedades para empezar." lead="Una muestra del portafolio: distintas zonas, distintos formatos, un mismo criterio de verificación." />
            <Link href="/propiedades/" className="btn btn-borde">Ver todo el catálogo</Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Propiedades destacadas">
            {seleccion.map((p, k) => (
              <li key={p.slug} className="revelar" style={{ transitionDelay: `${k * 80}ms` }}><TarjetaPropiedad p={p} prioridad={k < 2} /></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion bg-carbon text-blanco" aria-labelledby="t-lineas">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Titulo id="t-lineas" claro eyebrow="Dos recorridos" titulo="Una vivienda excepcional, o un activo que produce." lead="El sitio está organizado para dos tipos de búsqueda. Elija el suyo." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/hoteles-e-inversion/" className="revelar group block rounded border border-white/15 p-6 no-underline transition hover:border-bronce-2">
              <p className="text-[.7rem] uppercase tracking-[.16em] text-bronce-2">Hoteles e inversión</p>
              <p className="serif mt-2 text-2xl text-blanco">Hoteles en operación y activos con historial.</p>
              <p className="mt-3 text-sm text-piedra">{hoteles === 1 ? "1 hotel publicado" : `${hoteles} hoteles publicados`} con ficha documentada; cifras bajo acuerdo de confidencialidad.</p>
              <span className="btn-texto mt-4 inline-block text-bronce-2">Ver hoteles →</span>
            </Link>
            <Link href="/proyectos/" className="revelar group block rounded border border-white/15 p-6 no-underline transition hover:border-bronce-2" style={{ transitionDelay: "90ms" }}>
              <p className="text-[.7rem] uppercase tracking-[.16em] text-bronce-2">Proyectos</p>
              <p className="serif mt-2 text-2xl text-blanco">Lotes y proyectos sobre planos en Antioquia.</p>
              <p className="mt-3 text-sm text-piedra">{proyectos === 1 ? "1 proyecto" : `${proyectos} proyectos`} con información verificada, incluida la ficha de El Vallenato P.H. en preparación.</p>
              <span className="btn-texto mt-4 inline-block text-bronce-2">Ver proyectos →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="seccion" aria-labelledby="t-firma">
        <div className="wrap grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="revelar">
            <Titulo id="t-firma" eyebrow="La firma" titulo="Una inmobiliaria de Medellín con criterio de verificación." />
            <div className="prosa mt-6 max-w-[58ch]">
              <p>
                {SITIO.razonSocial} es una inmobiliaria constituida en Medellín en 2021, dedicada a la comercialización de vivienda, lotes, hoteles y proyectos en Antioquia y, en el caso de activos hoteleros, también fuera del departamento.
              </p>
              <p>
                Trabajamos con inventario propio y documentado: cada ficha indica de dónde proviene la información, qué está confirmado y qué se entrega en la visita o bajo acuerdo de confidencialidad.
              </p>
            </div>
            <Link href="/quienes-somos/" className="btn btn-borde mt-8">Conocer la firma</Link>
          </div>
          <ul className="grid gap-4 self-center sm:grid-cols-2" aria-label="Motivos verificables">
            {[
              ["Fichas con procedencia", "Cada propiedad registra la fuente de sus datos, sus imágenes y la fecha de verificación de disponibilidad."],
              ["Dirección reservada", "La ubicación exacta se comparte solo con interesados verificados; el sitio muestra el sector."],
              ["Fotografía real", "Las imágenes son de la propiedad. Los renders se identifican como tales; no se usan imágenes sintéticas."],
              ["Un canal directo", `Consultas por WhatsApp (${SITIO.whatsappVisible}) atendidas por la firma, con visita privada como siguiente paso.`],
            ].map(([t, d], k) => (
              <li key={t} className="revelar rounded border border-piedra bg-blanco p-5" style={{ transitionDelay: `${k * 70}ms` }}>
                <p className="serif text-xl">{t}</p>
                <p className="mudo mt-2 text-sm">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion-compacta" aria-labelledby="t-cta">
        <div className="wrap rounded border border-piedra bg-marfil-2 px-6 py-12 text-center md:px-12">
          <h2 id="t-cta" className="mx-auto max-w-[22ch]">¿Busca algo que aún no está publicado?</h2>
          <p className="lead mx-auto mt-4">Cuéntenos zona, formato y presupuesto. Parte del inventario se comercializa sin publicación.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contacto/" className="btn btn-carbon">Escribir a la firma</Link>
            <a href={enlaceWhatsApp()} target="_blank" rel="noopener" className="btn btn-borde" data-seguimiento="whatsapp">WhatsApp {SITIO.whatsappVisible}</a>
          </div>
        </div>
      </section>
    </>
  );
}
