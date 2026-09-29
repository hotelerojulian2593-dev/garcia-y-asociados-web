# CLAUDE.md

Guía para Claude Code al mantener este repositorio.

## Proyecto

**Sitio público de Inmobiliaria García & Asociados S.A.S.** Next.js 16 (App Router) con
`output: "export"`, Tailwind CSS 4, inventario en `contenido/propiedades/*.json`. Se publica como
archivos estáticos en Netlify. Léase `README.md` antes de cambiar nada.

Este sitio es la cara pública del **Sistema Inmobiliario 360** (repositorio hermano en
`/Users/marketinghotelero/Garcia y Asociados`, Next.js + Supabase + panel de carga). Los campos
del inventario siguen su esquema (`titulo`, `operacion`, `tipo`, `ciudad`, `barrioSector`, `precio`,
`precioVisible`, `areaConstruida`, `habitaciones`, `banos`, `parqueaderos`...). Cuando el catálogo
pase a leer la vista `propiedades_publicas` de Supabase, el único archivo que debe cambiar es
`src/lib/inventario.ts`.

## Reglas del dominio (no negociables)

- **La dirección exacta nunca se publica.** El inventario no tiene ese campo; el sitio muestra sector y ciudad.
- **No inventar datos.** Precios, áreas, características, años de experiencia, ventas, premios o
  testimonios solo si vienen del cliente o de un documento. Lo no confirmado se redacta como
  «el asesor lo confirma» o «bajo acuerdo de confidencialidad». Nunca texto entre corchetes visible.
- **Fotografía real.** No se usan imágenes sintéticas como sustituto de un inmueble. Los renders se
  marcan `tipo: "render"`. Un efecto de profundidad no es un recorrido virtual: `recorridoVirtual`
  solo con material real.
- **Cada ficha conserva `origen`** (fuente de los datos, de las imágenes y fecha de verificación).
- **Contenido de demostración** (`demo: true`) siempre visible como tal y retirado antes de publicar.
- **Nunca mostrar una confirmación de envío** que no haya ocurrido. Sin `NEXT_PUBLIC_GHL_FORM_ID`
  el formulario abre WhatsApp; con él, el envío lo confirma GoHighLevel.
- **Sin secretos en el repositorio.** Solo variables `NEXT_PUBLIC_`. Sin tokens ni credenciales.
- **No prometer rentabilidad ni valorización** en ningún texto.
- **Ley 1581 de 2012:** casilla de autorización desmarcada por defecto y enlace a `/politica-de-datos/`.

## Cliente

| | |
|---|---|
| Razón social | Inmobiliaria García & Asociados S.A.S. · NIT 901.507.252-5 |
| Domicilio | Calle 2A # 75C-17, casa 110, Medellín (Antioquia) |
| WhatsApp comercial del sitio | +57 313 580 0381 (`contenido/sitio.json`) |
| Correo público | inmobiliariagarcia02@gmail.com (pendiente de confirmar; ver `notasInternas`) |
| CRM | GoHighLevel, widgets en `link.marketinghotelero.com` |
| Dominio | Gestionado en GoHighLevel; ver `DESPLIEGUE.md` |

## Convenciones

- Código, comentarios, nombres de archivo y commits en español.
- Componentes de servidor por defecto; `"use client"` solo donde hay interacción
  (Catalogo, Galeria, HeroCapas, Tilt, FormularioContacto, Encabezado, Revelador).
- Nada de `useSearchParams` en páginas estáticas: rompe el prerenderizado. Los parámetros de URL
  se leen en `useEffect` con `location.search`.
- El CSS propio vive en `src/app/globals.css` dentro de `@layer base` / `@layer components`
  para que las utilidades de Tailwind puedan sobrescribirlo.
- Toda imagen lleva `alt` descriptivo, `width` y `height`.
- Antes de dar por terminado un cambio: `npm run typecheck && npm run build && npm run verificar`.

## Flujo de trabajo

1. Editar contenido (`contenido/`) o código (`src/`).
2. `npm run build && npm run verificar` (cero hallazgos).
3. `git add -A && git commit -m "..." && git push origin main` → Netlify despliega solo.
4. Comprobar en la URL pública con `?v=<hash del commit>` para evitar caché.
