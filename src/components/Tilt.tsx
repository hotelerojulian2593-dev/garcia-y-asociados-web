"use client";
import { useEffect, useRef } from "react";

/**
 * Inclinación sutil hacia el cursor (máx. 4°). Aporta profundidad a la tarjeta sin
 * afectar la lectura. Se desactiva con movimiento reducido, en pantallas táctiles y con teclado.
 */
export function Tilt({ children, className = "", intensidad = 4 }: { children: React.ReactNode; className?: string; intensidad?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reducido || !fino) return;
    let marco = 0;
    const mover = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(marco);
      marco = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(-y * intensidad).toFixed(2)}deg) rotateY(${(x * intensidad).toFixed(2)}deg) translateY(-4px)`;
      });
    };
    const salir = () => { cancelAnimationFrame(marco); el.style.transform = ""; };
    el.addEventListener("mousemove", mover);
    el.addEventListener("mouseleave", salir);
    return () => { el.removeEventListener("mousemove", mover); el.removeEventListener("mouseleave", salir); };
  }, [intensidad]);
  return <div ref={ref} className={className}>{children}</div>;
}
