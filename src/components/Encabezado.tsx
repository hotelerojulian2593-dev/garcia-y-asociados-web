"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAVEGACION, SITIO } from "@/lib/sitio";

const NAV_CABECERA = NAVEGACION.filter((n) => n.href !== "/por-que-escogernos/" && n.href !== "/guias/");

export function Encabezado() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  return (
    <header className="encabezado">
      <div className="wrap flex items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center no-underline" aria-label={`${SITIO.marcaLarga}, inicio`}>
          <img src="/marca/logo-horizontal-azul.png" alt={SITIO.marcaLarga} className="logo-cabecera" width={2116} height={651} fetchPriority="high" />
        </Link>
        <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label="Principal">
          {NAV_CABECERA.map((n) => (
            <Link key={n.href} href={n.href} aria-current={ruta === n.href ? "page" : undefined}>
              {n.etiqueta}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contacto/?motivo=visita" className="btn btn-carbon hidden whitespace-nowrap md:inline-flex lg:hidden xl:inline-flex" data-seguimiento="agendar">
            Agendar visita
          </Link>
          <button
            type="button"
            className="btn btn-borde lg:hidden"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>
      {abierto && (
        <nav id="menu-movil" className="wrap border-t border-gris-claro pb-6 pt-4 lg:hidden" aria-label="Principal (móvil)">
          <ul className="grid gap-1">
            {NAVEGACION.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block py-2" onClick={() => setAbierto(false)} aria-current={ruta === n.href ? "page" : undefined}>
                  {n.etiqueta}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link href="/contacto/?motivo=visita" className="btn btn-carbon w-full" onClick={() => setAbierto(false)}>
                Agendar una visita privada
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
