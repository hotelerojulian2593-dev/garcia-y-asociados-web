import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/Titulo";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: `${SITIO.razonSocial}: inmobiliaria constituida en Medellín en 2021, dedicada a vivienda, lotes, hoteles y proyectos en Antioquia.`,
};

export default function QuienesSomos() {
  return (
    <>
      <CabeceraPagina eyebrow="Quiénes somos" titulo="Una firma de Medellín, con datos que se pueden comprobar." lead="Lo que sigue son hechos registrados. La historia, el enfoque y el equipo se completan con la información que entregue la firma." />
      <section className="wrap seccion-compacta grid gap-12 lg:grid-cols-[1fr_360px]" aria-labelledby="t-historia">
        <div className="prosa max-w-[66ch]">
          <h2 id="t-historia">La firma</h2>
          <p>
            {SITIO.razonSocial} se constituyó en Medellín el {SITIO.constituida} y está registrada en la Cámara de Comercio con matrícula mercantil {SITIO.matriculaMercantil}. Su actividad principal es la comercialización inmobiliaria por retribución o contrata, y también gestiona bienes propios o arrendados.
          </p>
          <p>
            Comercializa vivienda y lotes en Medellín, el Valle de Aburrá y el Oriente y Occidente antioqueños; hoteles en operación dentro y fuera del departamento; y proyectos sobre planos como El Vallenato P.H. en Santa Fe de Antioquia.
          </p>
          <h2>Enfoque</h2>
          <p>
            Publicamos únicamente información confirmada por el propietario o por documentos. Cada ficha del sitio conserva la procedencia de sus datos y de sus imágenes, y la fecha en que se verificó la disponibilidad. La dirección exacta nunca se publica: se comparte con interesados verificados antes de la visita.
          </p>
          <h2>Equipo</h2>
          <p className="aviso">
            Contenido pendiente: nombres, roles y trayectoria del equipo comercial se publican cuando la firma los apruebe. Representante legal registrada: María Nancy García Botero.
          </p>
        </div>
        <aside className="self-start rounded border border-gris-claro bg-blanco p-6 text-sm" aria-label="Datos de la firma">
          <p className="text-[.7rem] uppercase tracking-[.16em] text-gris-texto">Datos registrados</p>
          <dl className="mt-3 grid gap-3">
            <div><dt className="text-gris-texto">Razón social</dt><dd>{SITIO.razonSocial}</dd></div>
            <div><dt className="text-gris-texto">NIT</dt><dd>{SITIO.nit}</dd></div>
            <div><dt className="text-gris-texto">Domicilio</dt><dd>{SITIO.direccion}, {SITIO.ciudad}</dd></div>
            <div><dt className="text-gris-texto">Correo</dt><dd><a href={`mailto:${SITIO.correo}`}>{SITIO.correo}</a></dd></div>
            <div><dt className="text-gris-texto">WhatsApp comercial</dt><dd>{SITIO.whatsappVisible}</dd></div>
          </dl>
          <Link href="/contacto/" className="btn btn-carbon mt-6 w-full">Contactar</Link>
        </aside>
      </section>
    </>
  );
}
