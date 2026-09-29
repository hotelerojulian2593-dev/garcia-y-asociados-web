import Link from "next/link";
import type { TarjetaPropiedad as Datos } from "@/lib/tipos";
import { NOMBRE_TIPO } from "@/lib/tipos";
import { SinFoto } from "./SinFoto";
import { Tilt } from "./Tilt";

export function TarjetaPropiedad({ p, prioridad = false }: { p: Datos; prioridad?: boolean }) {
  const href = p.href;
  return (
    <Tilt className="h-full">
      <article className="tarjeta flex h-full flex-col">
        <Link href={href} className="marco-imagen block" aria-label={`Ver ${p.titulo}`} tabIndex={-1}>
          {p.imagen ? (
            <img src={p.imagen.src} alt={p.imagen.alt} loading={prioridad ? "eager" : "lazy"} decoding="async" width={1200} height={900} />
          ) : (
            <SinFoto demo={p.demo} enPreparacion={p.fichaEnPreparacion} />
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {p.demo && <span className="chip chip-demo">Demostración</span>}
            {p.confidencial && <span className="chip chip-claro">Venta confidencial</span>}
            {p.imagen?.tipo === "render" && <span className="chip chip-claro">Render</span>}
          </div>
        </Link>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-[.72rem] uppercase tracking-[.16em] text-humo">
            {NOMBRE_TIPO[p.tipo]} · {p.ciudad}
            {p.barrioSector && p.barrioSector !== p.ciudad ? ` · ${p.barrioSector}` : ""}
          </p>
          <h3 className="text-[1.45rem] leading-tight">
            <Link href={href} className="no-underline hover:underline">{p.titulo}</Link>
          </h3>
          {p.esenciales.length > 0 && (
            <p className="text-sm text-humo">{p.esenciales.join(" · ")}</p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <span className="serif whitespace-nowrap text-xl">{p.precioTexto}</span>
            <Link href={href} className="btn-texto">{p.categoria === "proyecto" ? "Ver proyecto →" : "Ver ficha →"}</Link>
          </div>
        </div>
      </article>
    </Tilt>
  );
}
