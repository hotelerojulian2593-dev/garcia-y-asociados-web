import type { Metadata } from "next";
import "@fontsource/alfa-slab-one/latin-400.css";
import "@fontsource/italiana/latin-400.css";
import "@fontsource/jost/latin-300.css";
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import "@fontsource/jost/latin-600.css";
import "./globals.css";
import { Encabezado } from "@/components/Encabezado";
import { PiePagina } from "@/components/PiePagina";
import { MetaPixel } from "@/components/MetaPixel";
import { Revelador } from "@/components/Revelador";
import { ChatGHL } from "@/components/ChatGHL";
import { SITIO, URL_SITIO, enlaceWhatsApp } from "@/lib/sitio";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: {
    default: `${SITIO.marcaLarga} · Propiedades, hoteles y proyectos en Medellín y Antioquia`,
    template: `%s · ${SITIO.marca}`,
  },
  description: SITIO.descripcionCorta,
  openGraph: { type: "website", locale: "es_CO", siteName: SITIO.marcaLarga },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <MetaPixel />
        <script
          type="application/ld+json"
          // Solo hechos visibles y verificados (RUT y datos publicados). Sin valoraciones ni cifras.
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: SITIO.marcaLarga,
            legalName: SITIO.razonSocial,
            url: URL_SITIO,
            email: SITIO.correo,
            telephone: SITIO.whatsappVisible,
            address: { "@type": "PostalAddress", streetAddress: SITIO.direccion, addressLocality: "Medellín", addressRegion: "Antioquia", addressCountry: "CO" },
            areaServed: SITIO.zonaServicio,
          }) }}
        />
      </head>
      <body>
        <a className="saltar" href="#contenido">Saltar al contenido</a>
        <div className="barra-marca" aria-hidden><span /><span /></div>
        <Encabezado />
        <main id="contenido">{children}</main>
        <PiePagina />
        <a
          className="wa-fijo btn btn-carbon"
          href={enlaceWhatsApp()}
          target="_blank"
          rel="noopener"
          aria-label="Escribir por WhatsApp"
          data-seguimiento="whatsapp"
        >
          WhatsApp
        </a>
        <Revelador />
        <ChatGHL />
      </body>
    </html>
  );
}
