"use client";
import { useEffect } from "react";

declare global {
  interface Window { fbq?: (...args: unknown[]) => void; dataLayer?: unknown[]; }
}

/**
 * Dos responsabilidades pequeñas de cliente:
 * 1) Revelado suave de los elementos `.revelar` al entrar en pantalla (se omite con movimiento reducido).
 * 2) Seguimiento de clics en CTAs marcados con `data-seguimiento` (WhatsApp → Contact, agendar → Schedule).
 *    Solo se envía al píxel si está cargado; nunca simula un envío de formulario.
 */
export function Revelador() {
  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sinAnimacion = reducido || !("IntersectionObserver" in window);
    const io = sinAnimacion ? null : new IntersectionObserver(
      (entradas) => entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io?.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const registrar = (raiz: ParentNode) => raiz.querySelectorAll<HTMLElement>(".revelar:not(.visible)").forEach((n) => (io ? io.observe(n) : n.classList.add("visible")));
    registrar(document);
    // Los listados que se vuelven a renderizar (filtros del catálogo) también se revelan.
    const mo = new MutationObserver((cambios) => cambios.forEach((c) => c.addedNodes.forEach((n) => { if (n instanceof HTMLElement) { if (n.matches(".revelar")) registrar(n.parentNode ?? document); else registrar(n); } })));
    mo.observe(document.body, { childList: true, subtree: true });

    const alHacerClic = (ev: MouseEvent) => {
      const objetivo = (ev.target as HTMLElement | null)?.closest<HTMLElement>("[data-seguimiento]");
      if (!objetivo) return;
      const tipo = objetivo.dataset.seguimiento;
      const evento = tipo === "whatsapp" ? "Contact" : tipo === "agendar" ? "Schedule" : null;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "cta_click", tipo, ruta: location.pathname });
      if (typeof window.fbq === "function") {
        if (evento) window.fbq("track", evento, { ruta: location.pathname });
        else window.fbq("trackCustom", "CTAClick", { tipo, ruta: location.pathname });
      }
    };
    document.addEventListener("click", alHacerClic);
    return () => { document.removeEventListener("click", alHacerClic); mo.disconnect(); io?.disconnect(); };
  }, []);
  return null;
}
