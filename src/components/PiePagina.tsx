import Link from "next/link";
import { NAVEGACION, SITIO, enlaceWhatsApp } from "@/lib/sitio";

export function PiePagina() {
  return (
    <footer className="mt-16 bg-carbon text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src="/marca/logo-horizontal-blanco.png" alt={SITIO.marcaLarga} width={3444} height={1059} className="h-16 w-auto" loading="lazy" />
          <p className="mt-5 max-w-[40ch] text-sm font-light text-gris-claro">{SITIO.descripcionCorta}</p>
          <p className="mt-4 text-xs text-gris">
            Zona de servicio: {SITIO.zonaServicio.join(" · ")}
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-medium uppercase tracking-[.16em] text-azul-claro">Navegación</p>
          <ul className="grid gap-2">
            {NAVEGACION.map((n) => (
              <li key={n.href}><Link href={n.href} className="no-underline hover:underline">{n.etiqueta}</Link></li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-medium uppercase tracking-[.16em] text-azul-claro">Contacto</p>
          <ul className="grid gap-2">
            <li><a href={enlaceWhatsApp()} target="_blank" rel="noopener" data-seguimiento="whatsapp">WhatsApp {SITIO.whatsappVisible}</a></li>
            <li><a href={`mailto:${SITIO.correo}`}>{SITIO.correo}</a></li>
            <li className="text-gris-claro">{SITIO.direccion}<br />{SITIO.ciudad}, {SITIO.pais}</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-medium uppercase tracking-[.16em] text-azul-claro">Legal</p>
          <ul className="grid gap-2">
            <li><Link href="/politica-de-datos/">Política de tratamiento de datos</Link></li>
            <li className="text-gris-claro">{SITIO.razonSocial}</li>
            <li className="text-gris-claro">NIT {SITIO.nit}</li>
          </ul>
        </div>
      </div>
      <div className="wrap border-t border-white/10 py-5 text-xs text-gris">
        <p>
          La información publicada está sujeta a confirmación en el proceso de compra. No se garantiza rentabilidad ni
          valorización. Las direcciones exactas se comparten únicamente con interesados verificados.
        </p>
      </div>
      <div className="h-2 bg-azul" aria-hidden />
    </footer>
  );
}
