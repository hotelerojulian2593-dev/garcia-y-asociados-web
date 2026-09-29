import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fechaLarga, guiaPorSlug, todasLasGuias } from "@/lib/guias";
import { SITIO, URL_SITIO, enlaceWhatsApp } from "@/lib/sitio";

export function generateStaticParams() {
  return todasLasGuias().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guiaPorSlug(slug);
  if (!g) return {};
  return { title: g.titulo, description: g.resumen };
}

export default async function GuiaPagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guiaPorSlug(slug);
  if (!g) notFound();
  const otras = todasLasGuias().filter((o) => o.slug !== g.slug);
  // Datos estructurados solo con lo visible en la página (artículo y preguntas frecuentes).
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: g.titulo, description: g.resumen, datePublished: g.fecha, dateModified: g.fecha, inLanguage: "es-CO", author: { "@type": "Organization", name: SITIO.razonSocial }, publisher: { "@type": "Organization", name: SITIO.razonSocial }, mainEntityOfPage: `${URL_SITIO}/guias/${g.slug}/` },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.preguntas.map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.r } })) },
  ];
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap seccion-compacta">
        <nav aria-label="Ruta" className="text-xs uppercase tracking-[.12em] text-gris-texto"><Link href="/">Inicio</Link> <span aria-hidden>›</span> <Link href="/guias/">Guías</Link></nav>
        <header className="mt-6 max-w-[56rem]">
          <p className="eyebrow mb-4">Guía</p>
          <h1 className="filete">{g.titulo}</h1>
          <p className="lead mt-5">{g.resumen}</p>
          <p className="mudo mt-4 text-sm">Por {g.autor} · Actualizada el {fechaLarga(g.fecha)}</p>
        </header>
      </div>
      <div className="wrap grid gap-12 pb-16 lg:grid-cols-[1fr_320px]">
        <div className="prosa max-w-[68ch]">
          {g.secciones.map((s) => (
            <section key={s.titulo} className="revelar">
              <h2>{s.titulo}</h2>
              {s.parrafos.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          ))}
          <section className="revelar mt-12" aria-labelledby="t-faq">
            <h2 id="t-faq">Preguntas frecuentes</h2>
            <dl className="mt-4 grid gap-4">
              {g.preguntas.map((q) => (
                <div key={q.p} className="border-l-2 border-azul-claro pl-4">
                  <dt className="font-medium text-azul">{q.p}</dt>
                  <dd className="mt-1 text-[.97rem]">{q.r}</dd>
                </div>
              ))}
            </dl>
          </section>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={g.cta.href} className="btn btn-carbon">{g.cta.texto}</Link>
            <a href={enlaceWhatsApp()} target="_blank" rel="noopener" className="btn btn-borde" data-seguimiento="whatsapp">Escribir por WhatsApp</a>
          </div>
        </div>
        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded border border-gris-claro border-t-[3px] border-t-azul bg-white p-6 text-sm">
            <p className="text-[.7rem] uppercase tracking-[.16em] text-gris-texto">Otras guías</p>
            <ul className="mt-3 grid gap-3">
              {otras.map((o) => <li key={o.slug}><Link href={`/guias/${o.slug}/`} className="font-medium text-azul hover:underline">{o.titulo}</Link></li>)}
            </ul>
          </div>
          <p className="mudo mt-4 text-xs">Contenido informativo general; no sustituye asesoría legal, contable o financiera. No se garantiza rentabilidad ni valorización.</p>
        </aside>
      </div>
    </article>
  );
}
