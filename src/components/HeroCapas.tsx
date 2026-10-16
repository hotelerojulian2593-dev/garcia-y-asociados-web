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
  // Mientras el hero ocupa la pantalla, el botón flotante de WhatsApp se retira (el hero ya tiene
  // sus propias llamadas a la acción y el botón tapaba la segunda en móvil).
  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const obs = new IntersectionObserver(
      ([e]) => document.body.classList.toggle("hero-en-vista", e.intersectionRatio > 0.45),
      { threshold: [0, 0.45, 1] },
    );
    obs.observe(raiz);
    return () => { obs.disconnect(); document.body.classList.remove("hero-en-vista"); };
  }, []);

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

/**
 * Fondo del hero.
 * - Con video: el póster se pinta de inmediato y el video entra con un fundido cuando ya reproduce.
 *   La fuente se elige en el cliente (móvil → versión ligera; escritorio → WebM si el navegador lo
 *   decodifica, si no MP4). Sin JavaScript, con `prefers-reduced-motion` o con ahorro de datos
 *   activo, queda el póster: nunca se descarga un video que no se va a ver.
 * - El video se pausa cuando el hero sale de la pantalla y se reanuda al volver.
 * - Sin video: fotografía con un lento acercamiento (Ken Burns).
 */
export function FondoHero({
  video,
  videoMovil,
  videoWebm,
  poster,
  posterMovil,
  alt,
}: {
  video?: string;
  videoMovil?: string;
  videoWebm?: string;
  poster: string;
  posterMovil?: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conexion?.saveData) return;

    const movil = window.matchMedia("(max-width: 767px)").matches;
    let fuente = video;
    if (movil && videoMovil) fuente = videoMovil;
    else if (videoWebm && v.canPlayType('video/webm; codecs="vp9"')) fuente = videoWebm;

    const lista = () => v.classList.add("lista");
    v.addEventListener("playing", lista, { once: true });
    v.src = fuente;
    v.load();
    const intento = v.play();
    if (intento && typeof intento.catch === "function") intento.catch(() => { /* autoplay bloqueado: queda el póster */ });

    // Pausar fuera de pantalla: ahorra batería y CPU sin que el usuario lo note.
    const observador = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); },
      { threshold: 0.05 },
    );
    observador.observe(v);
    return () => { observador.disconnect(); v.removeEventListener("playing", lista); };
  }, [video, videoMovil, videoWebm]);

  if (video) {
    return (
      <>
        <img
          src={poster}
          srcSet={posterMovil ? `${posterMovil} 960w, ${poster} 1920w` : undefined}
          sizes={posterMovil ? "100vw" : undefined}
          alt={alt}
          fetchPriority="high"
          width={1920}
          height={1080}
          className="hero-poster"
        />
        <video ref={ref} className="hero-video" muted loop playsInline preload="none" aria-hidden tabIndex={-1} />
      </>
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
