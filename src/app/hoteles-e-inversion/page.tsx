import type { Metadata } from "next";
import Link from "next/link";
import { CabeceraPagina } from "@/components/Titulo";
import { TarjetaPropiedad } from "@/components/TarjetaPropiedad";
import { AvisoDemo } from "@/components/AvisoDemo";
import { aTarjeta, porCategoria } from "@/lib/inventario";
import { SITIO, enlaceWhatsApp } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Hoteles en venta y activos de inversión",
  description: "Hoteles en operación y activos de inversión comercializados por García & Asociados. Fichas documentadas; cifras bajo acuerdo de confidencialidad.",
};

export default function Hoteles() {
  const hoteles = porCategoria("hotel");
  return (
    <>
      <CabeceraPagina eyebrow="Hoteles e inversión" titulo="Hoteles en operación y activos que producen." lead="Presentamos cada hotel con ubicación pública, capacidad y características documentadas. Las cifras de operación, cuando existen, se comparten con su fuente, fecha y contexto, y siempre bajo acuerdo de confidencialidad." />
      <AvisoDemo />
      <section className="wrap seccion-compacta" aria-label="Hoteles publicados">
        <ul className="grid gap-6 md:grid-cols-2">
          {hoteles.map((h, k) => {
            const t = aTarjeta(h);
            return (
              <li key={h.slug} className="revelar grid gap-4">
                <TarjetaPropiedad p={t} prioridad={k === 0} />
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <div><dt className="text-[.68rem] uppercase tracking-[.14em] text-humo">Ubicación</dt><dd>{h.barrioSector}, {h.ciudad}</dd></div>
                  <div><dt className="text-[.68rem] uppercase tracking-[.14em] text-humo">Capacidad</dt><dd>{h.capacidad ?? "Por confirmar"}</dd></div>
                  <div><dt className="text-[.68rem] uppercase tracking-[.14em] text-humo">Cifras</dt><dd>{h.demo ? "Ilustrativas" : "Bajo NDA"}</dd></div>
                </dl>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="wrap seccion grid gap-10 lg:grid-cols-2" aria-labelledby="t-proceso">
        <div>
          <p className="eyebrow mb-4">Cómo se compra un hotel con nosotros</p>
          <h2 id="t-proceso">Un proceso en cuatro pasos, sin promesas.</h2>
          <ol className="mt-6 grid gap-4">
            {[
              ["Solicitud", "Nos indica el hotel o el perfil de activo que busca y su rango de inversión."],
              ["Acuerdo de confidencialidad y ficha completa", "Recibe precio, áreas, cifras históricas con fuente y fecha, y estado legal documentado."],
              ["Visita y due diligence", "Recorre la operación con el asesor y verifica escritura, RNT, licencias y deudas con su equipo."],
              ["Negociación y cierre", "Acompañamos la promesa, la escrituración y, si aplica, la transición de la operación."],
            ].map(([t, d], k) => (
              <li key={t} className="revelar flex gap-4 border-b border-piedra pb-4">
                <span className="serif text-3xl text-bronce">{k + 1}</span>
                <div><p className="font-semibold">{t}</p><p className="mudo mt-1 text-sm">{d}</p></div>
              </li>
            ))}
          </ol>
          <p className="mudo mt-4 text-xs">No se garantiza rentabilidad ni valorización. Las cifras históricas son auditables en due diligence.</p>
        </div>
        <div className="self-start rounded border border-piedra bg-blanco p-8">
          <h2 className="text-2xl">Solicitar información de un hotel</h2>
          <p className="mudo mt-2 text-sm">Indique si es inversionista, operador, cadena o quiere operarlo usted, y el plazo en que piensa comprar. El asesor responde por WhatsApp o correo.</p>
          <div className="mt-6 grid gap-3">
            <Link href="/contacto/?inmueble=Hotel%20o%20activo%20de%20inversi%C3%B3n" className="btn btn-carbon">Solicitar información</Link>
            <a href={enlaceWhatsApp()} target="_blank" rel="noopener" className="btn btn-borde" data-seguimiento="whatsapp">Escribir por WhatsApp</a>
          </div>
          <p className="mudo mt-5 text-xs">¿Tiene un hotel para vender? Escríbanos: preparamos la ficha y, si lo requiere, una venta confidencial con nombre en clave.</p>
        </div>
      </section>
    </>
  );
}
