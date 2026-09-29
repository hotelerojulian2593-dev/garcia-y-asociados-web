import Link from "next/link";
import { FondoHero, HeroCapas } from "@/components/HeroCapas";
import { TarjetaPropiedad } from "@/components/TarjetaPropiedad";
import { ReelVertical } from "@/components/ReelVertical";
import { Titulo } from "@/components/Titulo";
import { Tilt } from "@/components/Tilt";
import { AvisoDemo } from "@/components/AvisoDemo";
import { aTarjeta, destacadas, porCategoria, porSlug } from "@/lib/inventario";
import { SITIO, enlaceWhatsApp } from "@/lib/sitio";

export default function Inicio() {
  const seleccion = destacadas(4).map(aTarjeta);
  const vallenato = porSlug("el-vallenato-ph");
  const playa = porSlug("playa-candela");
  const hoteles = porCategoria("hotel").filter((p) => !p.demo).length;
  const proyectos = porCategoria("proyecto").filter((p) => !p.demo).length;
  const hero = SITIO.hero;

  return (
    <>
      <HeroCapas>
        <div className="hero-capa hero-fondo" data-profundidad="-0.35">
          <FondoHero video={hero.video || undefined} poster={hero.poster} posterMovil={hero.posterMovil} alt={hero.posterAlt} />
        </div>
        <div className="hero-capa hero-velo" data-profundidad="-0.15" />
        <div className="hero-capa hero-grano" aria-hidden />
        <div className="hero-contenido wrap">
          <p className="eyebrow eyebrow-claro mb-6">Inmobiliaria · Medellín y Antioquia</p>
          <h1 id="titulo-hero">
            Propiedades que se eligen <em>en persona.</em>
          </h1>
          <p className="mt-7 max-w-[50ch] text-lg leading-relaxed text-piedra">
            Casas de gran formato, hoteles en operación y proyectos sobre planos en Medellín y Antioquia.
            Publicamos lo confirmado; lo demás se muestra en una visita privada.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/propiedades/" className="btn btn-bronce">Explorar propiedades</Link>
            <Link href="/contacto/?motivo=visita" className="btn btn-claro" data-seguimiento="agendar">Agendar una visita privada</Link>
          </div>
        </div>
        {playa && playa.imagenes[0] && (
          <aside className="hero-ficha" data-profundidad="0.25" aria-label="Propiedad destacada">
            <img src={playa.imagenes[0].src} alt="" width={640} height={400} />
            <p className="text-[.66rem] uppercase tracking-[.16em] text-humo">Venta confidencial · {playa.ciudad}</p>
            <p className="serif mt-1 text-xl leading-tight">{playa.titulo}</p>
            <p className="mt-1 text-sm text-humo">10 habitaciones · piscina · playa privada a pasos</p>
            <Link href={`/propiedades/${playa.slug}/`} className="btn-texto mt-3 inline-block">Ver ficha →</Link>
          </aside>
        )}
        <p className="hero-leyenda">{hero.video ? "Video de referencia" : "Imagen de referencia"}</p>
        <span className="hero-indicador" aria-hidden />
      </HeroCapas>

      <div className="mt-8"><AvisoDemo /></div>

      {vallenato && (
        <section className="seccion" aria-labelledby="t-vallenato">
          <div className="wrap grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="revelar">
              <div className="collage">
                <Tilt className="c1 absolute" intensidad={3}>
                  <figure className="!relative h-full w-full"><img src="/img/vallenato-01-torre.webp" alt="Render de la torre de El Vallenato P.H. al atardecer" loading="lazy" width={1600} height={1119} /><figcaption>Render del proyecto</figcaption></figure>
                </Tilt>
                <figure className="c2"><img src="/img/vallenato-11-piscina-piso14.webp" alt="Render de la piscina del piso 14 con vista a las montañas" loading="lazy" width={1600} height={914} /></figure>
                <figure className="c3"><img src="/img/vallenato-16-grand-suite.webp" alt="Render de una Grand Suite con jacuzzi en el balcón" loading="lazy" width={1600} height={916} /></figure>
              </div>
            </div>
            <div className="revelar" style={{ transitionDelay: "120ms" }}>
              <p className="eyebrow mb-4">Proyecto destacado · Santa Fe de Antioquia</p>
              <h2 id="t-vallenato">{vallenato.titulo}</h2>
              <p className="lead mt-4">{vallenato.resumen}</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {["108 suites", "Entrega prevista 2029", "Piscina en el piso 14", "Restaurante en el piso 13", "Museo y galería", "Helipuerto"].map((c) => (
                  <li key={c} className="border-b border-piedra py-2">{c}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/el-vallenato-ph/" className="btn btn-carbon">Conocer El Vallenato P.H.</Link>
                <Link href={`/contacto/?inmueble=${vallenato.codigo}`} className="btn btn-borde">Recibir información</Link>
              </div>
              <p className="mudo mt-5 text-xs">Renders del proyecto, sujetos a cambios. Precios y tipologías se publican con la información autorizada.</p>
            </div>
          </div>
        </section>
      )}

      <section className="seccion bg-carbon text-blanco" aria-labelledby="t-reel">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="order-2 lg:order-1">
            <ReelVertical src="/video/el-vallenato-ph.mp4" poster="/img/el-vallenato-ph-video-poster.webp" titulo="Reel de El Vallenato P.H. · 39 s" />
          </div>
          <div className="order-1 lg:order-2">
            <Titulo id="t-reel" claro eyebrow="Vea el proyecto en movimiento" titulo="Historia, música y arquitectura en una sola torre." lead="Un recorrido de 39 segundos por los renders del proyecto: balcones curvos con vegetación, piscina con vista a las montañas, museo, restaurante y helipuerto." />
            <Link href="/el-vallenato-ph/" className="btn btn-bronce mt-8">Ver la página del proyecto</Link>
          </div>
        </div>
      </section>

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

      <section className="seccion bg-marfil-2" aria-labelledby="t-lineas">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Titulo id="t-lineas" eyebrow="Dos recorridos" titulo="Una vivienda excepcional, o un activo que produce." lead="El sitio está organizado para dos tipos de búsqueda. Elija el suyo." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/hoteles-e-inversion/" className="revelar block rounded border border-piedra bg-blanco p-6 no-underline transition hover:border-bronce">
              <p className="text-[.7rem] uppercase tracking-[.16em] text-bronce">Hoteles e inversión</p>
              <p className="serif mt-2 text-2xl">Hoteles en operación y activos con historial.</p>
              <p className="mudo mt-3 text-sm">{hoteles === 1 ? "1 hotel publicado" : `${hoteles} hoteles publicados`} con ficha documentada; cifras bajo acuerdo de confidencialidad.</p>
              <span className="btn-texto mt-4 inline-block">Ver hoteles →</span>
            </Link>
            <Link href="/proyectos/" className="revelar block rounded border border-piedra bg-blanco p-6 no-underline transition hover:border-bronce" style={{ transitionDelay: "90ms" }}>
              <p className="text-[.7rem] uppercase tracking-[.16em] text-bronce">Proyectos</p>
              <p className="serif mt-2 text-2xl">Lotes y proyectos sobre planos en Antioquia.</p>
              <p className="mudo mt-3 text-sm">{proyectos === 1 ? "1 proyecto" : `${proyectos} proyectos`} con información verificada, incluido El Vallenato P.H.</p>
              <span className="btn-texto mt-4 inline-block">Ver proyectos →</span>
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
              ["Fotografía real", "Las imágenes de cada inmueble son de la propiedad. Los renders se identifican como tales."],
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
