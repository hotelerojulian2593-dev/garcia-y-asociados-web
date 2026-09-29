import type { Metadata } from "next";
import { Catalogo } from "@/components/Catalogo";
import { CabeceraPagina } from "@/components/Titulo";
import { AvisoDemo } from "@/components/AvisoDemo";
import { aTarjeta, ciudades, publicadas, type Tipo } from "@/lib/inventario";

export const metadata: Metadata = {
  title: "Propiedades en venta en Medellín y Antioquia",
  description: "Catálogo de casas, apartamentos, fincas, lotes y hoteles comercializados por García & Asociados. Filtre por ubicación, tipo, precio, habitaciones y área.",
};

export default function Propiedades() {
  const lista = publicadas().map(aTarjeta);
  const tipos = Array.from(new Set(lista.map((p) => p.tipo))) as Tipo[];
  return (
    <>
      <CabeceraPagina eyebrow="Catálogo" titulo="Propiedades" lead="Vivienda, lotes, fincas y hoteles en Medellín, Antioquia y destinos seleccionados. Cada ficha indica qué está confirmado y qué se entrega en la visita." />
      <AvisoDemo />
      <section className="wrap seccion-compacta" aria-label="Catálogo de propiedades">
        <Catalogo propiedades={lista} ciudades={ciudades()} tipos={tipos} />
      </section>
    </>
  );
}
