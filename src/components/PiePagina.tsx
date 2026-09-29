import Link from "next/link";
import { NAVEGACION, SITIO, enlaceWhatsApp } from "@/lib/sitio";

export function PiePagina() {
  return (
    <footer className="mt-16 border-t border-piedra bg-marfil-2">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="serif text-3xl">{SITIO.marca}</p>
          <p className="mudo mt-3 max-w-[40ch] text-sm">{SITIO.descripcionCorta}</p>
          <p className="mudo mt-4 text-xs">
            Zona de servicio: {SITIO.zonaServicio.join(" · ")}
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-humo">Navegación</p>
          <ul className="grid gap-2">
            {NAVEGACION.map((n) => (
              <li key={n.href}><Link href={n.href} className="no-underline hover:underline">{n.etiqueta}</Link></li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-humo">Contacto</p>
          <ul className="grid gap-2">
            <li><a href={enlaceWhatsApp()} target="_blank" rel="noopener" data-seguimiento="whatsapp">WhatsApp {SITIO.whatsappVisible}</a></li>
            <li><a href={`mailto:${SITIO.correo}`}>{SITIO.correo}</a></li>
            <li className="mudo">{SITIO.direccion}<br />{SITIO.ciudad}, {SITIO.pais}</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-humo">Legal</p>
          <ul className="grid gap-2">
            <li><Link href="/politica-de-datos/">Política de tratamiento de datos</Link></li>
            <li className="mudo">{SITIO.razonSocial}</li>
            <li className="mudo">NIT {SITIO.nit}</li>
          </ul>
        </div>
      </div>
      <div className="wrap border-t border-piedra py-5 text-xs text-humo">
        <p>
          La información publicada está sujeta a confirmación en el proceso de compra. No se garantiza rentabilidad ni
          valorización. Las direcciones exactas se comparten únicamente con interesados verificados.
        </p>
      </div>
    </footer>
  );
}
