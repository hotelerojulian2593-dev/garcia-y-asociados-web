"use client";
import { useEffect, useRef } from "react";

/**
 * Hero cinematográfico por capas.
 * - Fondo: video (si existe) o fotografía con un lento acercamiento (Ken Burns) que da sensación de
 *   cámara en movimiento sin depender de un archivo de video.
 * - Al hacer scroll, cada capa se desplaza a distinta velocidad (profundidad): la imagen queda
 *   "detrás" del titular. Con cursor fino, las capas responden con unos píxeles de desplazamiento.
 * - Con `prefers-reduced-motion`, en táctil o sin JS: composición estática equivalente, mismo
 *   contenido y mismos enlaces. El scroll nunca se bloquea.
 */
export function HeroCapas({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    raiz.classList.add("hero-animado");
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
  return <section ref={ref} className={`hero ${className}`} aria-labelledby="titulo-hero">{children}</section>;
}

/** Fondo del hero: video si está configurado; si no, fotografía con Ken Burns. */
export function FondoHero({ video, poster, posterMovil, alt }: { video?: string; poster: string; posterMovil?: string; alt: string }) {
  if (video) {
    return (
      <video className="hero-video" autoPlay muted loop playsInline poster={poster} preload="metadata" aria-label={alt}>
        <source src={video} type="video/mp4" />
      </video>
    );
  }
  return (
    <img
      src={poster}
      srcSet={posterMovil ? `${posterMovil} 1200w, ${poster} 2560w` : undefined}
      sizes={posterMovil ? "100vw" : undefined}
      alt={alt}
      fetchPriority="high"
      width={2560}
      height={1434}
      className="hero-kenburns"
    />
  );
}
