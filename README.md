# Sitio web · Inmobiliaria García & Asociados

Sitio público de la inmobiliaria: catálogo de propiedades, hoteles y activos de inversión,
proyectos, presentación de la firma y contacto. Construido con **Next.js 16 (App Router) en
exportación estática**, Tailwind CSS 4 y un inventario en archivos JSON separado de la
presentación. Se despliega como archivos estáticos (Netlify) y se mantiene desde Claude Code.

Estado: **prototipo en revisión**. Contiene fichas marcadas como «Demostración» que deben
retirarse antes de publicar (ver [Pendientes](#pendientes-antes-de-publicar)).

## Ejecutar

```bash
npm install          # una sola vez
npm run dev          # http://localhost:3000
npm run build        # genera la versión de producción en out/
npm run verificar    # recorre out/ con Playwright: móvil y escritorio, filtros, galería, teclado, movimiento reducido
npm run typecheck    # TypeScript
npm run lint         # ESLint
```

`npm run verificar` necesita Chromium. Si Playwright no lo encuentra, ejecute una vez
`npx playwright install chromium` o defina `CHROMIUM_PATH` con la ruta de un Chromium.

## Estructura

```
contenido/
  sitio.json                 Datos de la firma: razón social, NIT, WhatsApp, correo, zona de servicio
  propiedades/*.json         Una propiedad por archivo (propiedades, hoteles y proyectos)
public/img/                  Fotografías (WebP). Nombradas por propiedad: playa-candela-01.webp
src/app/                     Páginas (App Router). Cada carpeta es una URL
  page.tsx                   Inicio
  propiedades/               Catálogo filtrable y fichas de detalle ([slug])
  hoteles-e-inversion/       Hoteles y activos de inversión
  proyectos/                 Proyectos destacados (ficha especial de El Vallenato P.H.)
  quienes-somos/  por-que-escogernos/  contacto/  politica-de-datos/
  sitemap.ts  robots.ts      Generados en el build
src/components/              Encabezado, PiePagina, TarjetaPropiedad, Catalogo, Galeria, HeroCapas, FormularioContacto...
src/lib/inventario.ts        Lee contenido/propiedades (solo en build)
src/lib/tipos.ts             Tipos y formato (precio, área). Importable desde el cliente
src/lib/sitio.ts             Navegación, URL del sitio, enlaces de WhatsApp, variables de entorno
scripts/verificar.mjs        Verificación automática con Playwright
netlify.toml                 Build y cabeceras para Netlify
.env.example                 Variables públicas (sin secretos)
```

## Añadir o editar una propiedad

1. Cree `contenido/propiedades/<slug>.json` copiando uno existente (por ejemplo `playa-candela.json`).
2. Campos principales (nombres alineados con el esquema del Sistema Inmobiliario 360):

   | Campo | Notas |
   |---|---|
   | `codigo`, `slug`, `titulo`, `resumen` | Obligatorios. El `slug` es la URL: `/propiedades/<slug>/` |
   | `categoria` | `propiedad`, `hotel` o `proyecto` (decide en qué sección aparece) |
   | `tipo` | `apartamento`, `apartaestudio`, `casa`, `local`, `oficina`, `lote`, `finca`, `bodega`, `hotel` |
   | `ciudad`, `departamento`, `barrioSector` | Solo el sector. **Nunca la dirección exacta** |
   | `precio`, `precioVisible`, `precioDesde` | Si `precioVisible` es `false` se muestra «Consultar precio» |
   | `habitaciones`, `banos`, `parqueaderos`, `pisos`, `areaConstruida`, `areaLote`, `areaDesde` | Solo los que existan; los demás se omiten |
   | `estado` | `disponible`, `separada`, `vendida`, `arrendada`, `retirada` (retirada = no se publica) |
   | `destacada` | `true` para la selección editorial del inicio (máximo 4) |
   | `demo` | `true` marca la ficha como demostración (aviso visible, fuera del sitemap, `noindex`) |
   | `confidencial` | Venta con nombre en clave: sin fachada, sin ubicación exacta |
   | `imagenes[]` | `{ src, alt, tipo: "foto" \| "render" \| "plano", leyenda }`. La primera es la portada |
   | `recorridoVirtual` | URL de Matterport/360 **solo si existe material real**; si no, se ofrece la visita |
   | `origen` | `fuente`, `imagenes`, `verificadoEl` (AAAA-MM-DD). Obligatorio: procedencia de los datos |

3. Copie las fotos a `public/img/` en WebP (≤1600 px de ancho, calidad ~72). Con `cwebp`:
   `cwebp -q 72 -resize 1600 0 foto.jpg -o public/img/<slug>-01.webp`.
4. `npm run build && npm run verificar`. El build falla si falta `slug`, `codigo` o `titulo`, o si
   `precioVisible` es `true` sin `precio`.

Para retirar una propiedad, cambie `estado` a `retirada` (deja de publicarse y desaparece del
sitemap) o borre el archivo.

## Hero de la portada (imagen o video)

`contenido/sitio.json → hero`. Hoy usa una imagen de referencia generada (Higgsfield, 2K) con un
lento acercamiento (Ken Burns) y capas con parallax. Para pasar a video: colocar `public/video/hero.mp4`
(16:9, H.264, sin audio, ≤8 MB) y poner `"video": "/video/hero.mp4"`; el `poster` sigue siendo la
imagen. Con `prefers-reduced-motion` se muestra solo la imagen. La leyenda «Imagen de referencia»
se mantiene mientras el fondo no sea un inmueble del portafolio.

## El Vallenato P.H.

Página dedicada en `src/app/el-vallenato-ph/page.tsx` (renders en `public/img/vallenato-*.webp`, reel en
`public/video/el-vallenato-ph.mp4`) y sección en la portada. Datos en `contenido/propiedades/el-vallenato-ph.json`.
Pendientes: tipologías con áreas, precios y plan de pagos autorizados; relación comercial por escrito.

## Editar textos y datos de la firma

- Datos de contacto, NIT, WhatsApp, zona de servicio: `contenido/sitio.json`.
- Textos de cada página: el archivo `page.tsx` de su carpeta en `src/app/`.
- Paleta, tipografías y componentes visuales: `src/app/globals.css` (tokens en `@theme`).

## Variables de entorno

Copie `.env.example` a `.env.local`. Todas son públicas (`NEXT_PUBLIC_`). En Netlify se
definen en *Site configuration → Environment variables*.

| Variable | Efecto |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Dominio final; se usa en sitemap, canonical y datos estructurados |
| `NEXT_PUBLIC_META_PIXEL_ID` | Activa el Meta Pixel (PageView + eventos Contact/Schedule en los CTA) |
| `NEXT_PUBLIC_GHL_FORM_ID` | Sustituye el formulario de WhatsApp por el formulario de GoHighLevel con atribución (utm, gclid, fbclid, property_code) |
| `NEXT_PUBLIC_GHL_CALENDAR_ID` | Muestra el calendario de GoHighLevel en Contacto |

## Movimiento y accesibilidad

- Hero por capas (parallax al hacer scroll y respuesta suave al cursor), inclinación de las
  tarjetas y transición cruzada en la galería. Todo se desactiva con `prefers-reduced-motion`,
  en pantallas táctiles no hay efectos de cursor y ningún enlace depende de una animación.
- Sin JavaScript el contenido es visible (el revelado por scroll solo se aplica con la clase `js`).
- Galería navegable con teclado (← →), foco visible, «Saltar al contenido», `alt` en todas las imágenes.

## Despliegue

Ver [DESPLIEGUE.md](DESPLIEGUE.md): publicación en Netlify desde GitHub y conexión del dominio
gestionado en GoHighLevel.

## Pendientes antes de publicar

- Retirar o sustituir las fichas `demo-*.json` con el inventario autorizado.
- Confirmar con el cliente: nombre de marca del encabezado («García & Asociados»), correo
  público, WhatsApp comercial del sitio general y el ID del Meta Pixel (ver `notasInternas` en
  `contenido/sitio.json`).
- Materiales de El Vallenato P.H. (relación comercial por escrito, renders, tipologías, precios).
- Equipo y trayectoria para «Quiénes somos».
- Formulario de contacto en GoHighLevel (`NEXT_PUBLIC_GHL_FORM_ID`) y, si aplica, calendario.
- Definir el dominio y `NEXT_PUBLIC_SITE_URL`.
