"use client";
import { useMemo, useState, useEffect } from "react";
import type { TarjetaPropiedad as Datos, Tipo } from "@/lib/tipos";
import { NOMBRE_TIPO } from "@/lib/tipos";
import { TarjetaPropiedad } from "./TarjetaPropiedad";

const RANGOS_PRECIO: { id: string; etiqueta: string; min?: number; max?: number }[] = [
  { id: "", etiqueta: "Cualquier precio" },
  { id: "hasta-500", etiqueta: "Hasta $500 millones", max: 500_000_000 },
  { id: "500-1000", etiqueta: "$500 a $1.000 millones", min: 500_000_000, max: 1_000_000_000 },
  { id: "1000-2500", etiqueta: "$1.000 a $2.500 millones", min: 1_000_000_000, max: 2_500_000_000 },
  { id: "mas-2500", etiqueta: "Más de $2.500 millones", min: 2_500_000_000 },
  { id: "consultar", etiqueta: "Precio bajo consulta" },
];

type Filtros = { ciudad: string; tipo: string; precio: string; habitaciones: string; area: string };
const VACIO: Filtros = { ciudad: "", tipo: "", precio: "", habitaciones: "", area: "" };

export function Catalogo({ propiedades, ciudades, tipos }: { propiedades: Datos[]; ciudades: string[]; tipos: Tipo[] }) {
  const [f, setF] = useState<Filtros>(VACIO);

  // El catálogo completo se prerenderiza (visible sin JavaScript y para buscadores).
  // La URL es la fuente de verdad de los filtros: se leen al montar y se pueden enlazar desde anuncios.
  useEffect(() => {
    const leer = () => {
      const q = new URLSearchParams(location.search);
      setF({ ciudad: q.get("ciudad") || "", tipo: q.get("tipo") || "", precio: q.get("precio") || "", habitaciones: q.get("habitaciones") || "", area: q.get("area") || "" });
    };
    leer();
    window.addEventListener("popstate", leer);
    return () => window.removeEventListener("popstate", leer);
  }, []);

  const aplicar = (parcial: Partial<Filtros>) => {
    const nuevo = { ...f, ...parcial };
    const q = new URLSearchParams();
    (Object.keys(nuevo) as (keyof Filtros)[]).forEach((k) => { if (nuevo[k]) q.set(k, nuevo[k]); });
    const qs = q.toString();
    history.replaceState(null, "", qs ? `${location.pathname}?${qs}` : location.pathname);
    setF(nuevo);
  };

  const resultado = useMemo(() => {
    const rango = RANGOS_PRECIO.find((r) => r.id === f.precio);
    return propiedades.filter((p) => {
      if (f.ciudad && p.ciudad !== f.ciudad) return false;
      if (f.tipo && p.tipo !== f.tipo) return false;
      if (f.habitaciones && (p.habitaciones ?? 0) < Number(f.habitaciones)) return false;
      if (f.area && (p.area ?? 0) < Number(f.area)) return false;
      if (rango && rango.id) {
        if (rango.id === "consultar") return p.precio === null;
        if (p.precio === null) return false;
        if (rango.min !== undefined && p.precio < rango.min) return false;
        if (rango.max !== undefined && p.precio > rango.max) return false;
      }
      return true;
    });
  }, [propiedades, f]);

  const activos = Object.values(f).filter(Boolean).length;

  return (
    <div className="grid gap-8">
      <form className="grid gap-4 rounded border border-gris-claro bg-blanco p-5 md:grid-cols-5" onSubmit={(e) => e.preventDefault()} aria-label="Filtrar propiedades">
        <div className="campo">
          <label htmlFor="f-ciudad">Ubicación</label>
          <select id="f-ciudad" value={f.ciudad} onChange={(e) => aplicar({ ciudad: e.target.value })}>
            <option value="">Todas</option>
            {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-tipo">Tipo</label>
          <select id="f-tipo" value={f.tipo} onChange={(e) => aplicar({ tipo: e.target.value })}>
            <option value="">Todos</option>
            {tipos.map((t) => <option key={t} value={t}>{NOMBRE_TIPO[t]}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-precio">Precio</label>
          <select id="f-precio" value={f.precio} onChange={(e) => aplicar({ precio: e.target.value })}>
            {RANGOS_PRECIO.map((r) => <option key={r.id} value={r.id}>{r.etiqueta}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-hab">Habitaciones</label>
          <select id="f-hab" value={f.habitaciones} onChange={(e) => aplicar({ habitaciones: e.target.value })}>
            <option value="">Cualquiera</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="f-area">Área mínima</label>
          <select id="f-area" value={f.area} onChange={(e) => aplicar({ area: e.target.value })}>
            <option value="">Cualquiera</option>
            {[100, 200, 400, 1000, 2500].map((n) => <option key={n} value={n}>{n.toLocaleString("es-CO")} m²+</option>)}
          </select>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gris-texto" aria-live="polite">
        <span>{resultado.length === 1 ? "1 propiedad" : `${resultado.length} propiedades`}{activos ? ` con ${activos} ${activos === 1 ? "filtro" : "filtros"}` : ""}</span>
        {activos > 0 && (
          <button type="button" className="btn-texto" onClick={() => aplicar(VACIO)}>Restablecer filtros</button>
        )}
      </div>

      {resultado.length === 0 ? (
        <div className="rounded border border-gris-claro bg-blanco px-6 py-14 text-center">
          <h3>No hay propiedades con esa combinación.</h3>
          <p className="mudo mx-auto mt-2 max-w-[48ch]">Amplíe el rango de precio o el área, o cuéntenos qué busca: el inventario completo incluye inmuebles que aún no se publican.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" className="btn btn-borde" onClick={() => aplicar(VACIO)}>Restablecer filtros</button>
            <a className="btn btn-carbon" href="/contacto/">Contar qué busco</a>
          </div>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Resultados">
          {resultado.map((p, k) => (
            <li key={p.slug} className="revelar"><TarjetaPropiedad p={p} prioridad={k < 3} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}
