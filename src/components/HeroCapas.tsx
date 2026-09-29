"use client";
import { useEffect, useRef } from "react";

/**
 * Hero con profundidad por capas.
 * - Al hacer scroll, el fondo se desplaza más despacio que el contenido (parallax): la
 *   fotografía gana profundidad y el titular se mantiene legible.
 * - En escritorio con cursor, las capas responden con un desplazamiento de pocos píxeles.
 * - Con `prefers-reduced-motion`, en táctil o sin JS, el hero es una composición estática
 *   equivalente: mismo contenido, mismos enlaces.
 * El scroll nunca se bloquea y ningún enlace depende de la animación.
 */
export function HeroCapas({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const capas = Array.from(raiz.querySelectorAll<HTMLElement>("[data-profundidad]"));
    const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let mx = 0, my = 0, marco = 0;

    const pintar = () => {
      marco = 0;
      const y = Math.min(window.scrollY, raiz.offsetHeight);
      capas.forEach((c) => {
        const p = parseFloat(c.dataset.profundidad || "0");
        const dx = fino ? mx * p * 28 : 0;
        const dy = fino ? my * p * 18 : 0;
        c.style.transform = `translate3d(${dx.toFixed(1)}px, ${(y * p * 0.45 + dy).toFixed(1)}px, 0)`;
      });
    };
    const programar = () => { if (!marco) marco = requestAnimationFrame(pintar); };
    const mover = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      programar();
    };
    window.addEventListener("scroll", programar, { passive: true });
    if (fino) raiz.addEventListener("mousemove", mover);
    pintar();
    return () => { window.removeEventListener("scroll", programar); raiz.removeEventListener("mousemove", mover); cancelAnimationFrame(marco); };
  }, []);
  return <section ref={ref} className="hero" aria-labelledby="titulo-hero">{children}</section>;
}
