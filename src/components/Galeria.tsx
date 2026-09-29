"use client";
import { useCallback, useEffect, useState } from "react";
import type { Imagen } from "@/lib/tipos";

/**
 * Galería con transición cruzada entre fotografías. Accesible con teclado (← →),
 * miniaturas como botones y leyenda con la procedencia de cada imagen.
 */
export function Galeria({ imagenes, titulo }: { imagenes: Imagen[]; titulo: string }) {
  const [i, setI] = useState(0);
  const n = imagenes.length;
  const ir = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [ir]);

  if (n === 0) return null;
  const actual = imagenes[i];
  return (
    <figure aria-label={`Galería de ${titulo}`}>
      <div className="galeria-escenario" aria-live="polite">
        {imagenes.map((img, k) => (
          <img key={img.src} src={img.src} alt={img.alt} className={k === i ? "activa" : ""} loading={k === 0 ? "eager" : "lazy"} decoding="async" aria-hidden={k !== i} width={1600} height={1000} />
        ))}
        {n > 1 && (
          <>
            <button type="button" className="galeria-control left-3" onClick={() => ir(-1)} aria-label="Fotografía anterior">‹</button>
            <button type="button" className="galeria-control right-3" onClick={() => ir(1)} aria-label="Fotografía siguiente">›</button>
          </>
        )}
        <span className="chip chip-claro absolute left-3 top-3">{actual.tipo === "render" ? "Render" : actual.tipo === "plano" ? "Plano" : "Fotografía"}</span>
        <span className="chip chip-claro absolute right-3 top-3">{i + 1} / {n}</span>
      </div>
      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-2 text-sm text-gris-texto">
        <span>{actual.alt}</span>
        {actual.leyenda && <span className="text-xs uppercase tracking-[.1em]">{actual.leyenda}</span>}
      </figcaption>
      {n > 1 && (
        <div className="galeria-miniaturas" role="tablist" aria-label="Miniaturas">
          {imagenes.map((img, k) => (
            <button key={img.src} type="button" role="tab" aria-selected={k === i} aria-current={k === i} onClick={() => setI(k)} aria-label={`Ver imagen ${k + 1}: ${img.alt}`}>
              <img src={img.src} alt="" loading="lazy" decoding="async" width={184} height={138} />
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
