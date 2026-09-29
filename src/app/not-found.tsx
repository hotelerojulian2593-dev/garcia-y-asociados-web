import Link from "next/link";
export default function NoEncontrada() {
  return (
    <section className="wrap seccion text-center">
      <p className="eyebrow justify-center">Error 404</p>
      <h1 className="mt-4">Esta página no existe o la propiedad fue retirada.</h1>
      <p className="lead mx-auto mt-4">Puede volver al catálogo o contarnos qué busca.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/propiedades/" className="btn btn-carbon">Ver propiedades</Link>
        <Link href="/contacto/" className="btn btn-borde">Contacto</Link>
      </div>
    </section>
  );
}
