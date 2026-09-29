# Despliegue y dominio

## Qué está preparado, probado y pendiente

| | Estado |
|---|---|
| Build estático (`npm run build` → `out/`) | **Probado** en este entorno: 22 páginas, sin errores |
| Verificación automática (`npm run verificar`) | **Probada**: 20 páginas × escritorio y móvil, filtros, galería, teclado, movimiento reducido, enlaces, sin hallazgos |
| `netlify.toml` (comando, carpeta `out`, cabeceras) | **Preparado**, no probado en Netlify todavía |
| Repositorio Git | **Preparado** localmente; el remoto se crea con la instrucción de abajo (no se ha verificado ningún remoto) |
| Dominio en GoHighLevel | **Pendiente**: hace falta el nombre del dominio y revisar su DNS actual |
| Meta Pixel, formulario y calendario de GHL | **Pendientes**: variables vacías hasta confirmar IDs |

## 1. Repositorio y GitHub (desde Claude Code en el Mac)

Carpeta local: `/Users/marketinghotelero/pagina garcia y asociados`. Instrucción de una línea:

> Entra a "/Users/marketinghotelero/pagina garcia y asociados", elimina .git/index.lock si existe; si no hay repo, `git init -b main`; luego `gh repo create hotelerojulian2593-dev/garcia-y-asociados-web --public --source=. --push`; haz commit de todos los archivos con el mensaje "Sitio inicial García & Asociados: catálogo, fichas, hoteles, proyectos y contacto" y push a origin main.

## 2. Netlify (sin CLI ni tokens)

1. app.netlify.com → **Add new site → Import an existing project → GitHub** → repositorio `garcia-y-asociados-web`.
2. Netlify lee `netlify.toml`: build `npm run build`, publish `out`, Node 22. No cambiar nada.
3. Nombre del sitio: `garcia-y-asociados` → vista previa en `https://garcia-y-asociados.netlify.app`.
4. **Environment variables**: `NEXT_PUBLIC_SITE_URL` (la URL de Netlify por ahora; el dominio propio después). El resto se añade cuando existan los IDs.
5. Cada `git push` a `main` vuelve a desplegar. Verificar la URL pública tras cada despliegue.

## 3. Dominio gestionado en GoHighLevel

Cuatro cosas distintas, que suelen confundirse:

| Función | Dónde está hoy | Qué se hace |
|---|---|---|
| **Registro del dominio** | Registrador (GoDaddy, Namecheap, GHL...) — por confirmar | No se toca |
| **Gestión DNS** | Si el dominio se compró o conectó en GHL, GHL puede administrar la zona DNS; si no, el registrador | Se añaden 2 registros para apuntar al sitio |
| **Alojamiento web** | Netlify (este proyecto) | Netlify sirve los archivos; GHL **no ejecuta** un proyecto Next.js |
| **CRM / funnels** | GoHighLevel | Formularios y calendarios se incrustan en el sitio; el dominio en GHL no implica acceso a contactos |

Que el dominio esté en GHL **no obliga** a alojar el sitio allí: los funnels de GHL no pueden
ejecutar este proyecto. La opción compatible es **alojamiento externo (Netlify) conectado al
dominio mediante DNS**, y GHL sigue usándose para CRM, formularios y calendario. Un subdominio
(por ejemplo `link.` o `app.`) puede seguir apuntando a GHL sin conflicto.

### Pasos (solo con autorización de publicación)

1. **Inventario previo**: en el registrador o en GHL, exportar o anotar todos los registros DNS
   actuales (A, CNAME, MX, TXT/SPF, DKIM, DMARC, verificación de dominios). Comprobar si
   `https://<dominio>` ya sirve un sitio; si lo hace, no interrumpirlo hasta el cambio final.
2. **Netlify → Domain management → Add a domain** → escribir el dominio. Netlify muestra los
   valores exactos (verificarlos en el momento, según la documentación vigente de Netlify):
   - `www` → registro **CNAME** al subdominio `.netlify.app` del sitio.
   - dominio raíz → registro **A** a la IP del balanceador de Netlify (o ALIAS/ANAME si el
     proveedor DNS lo permite).
3. **En el DNS del dominio** (GHL o registrador): añadir solo esos dos registros. **No borrar**
   MX, TXT ni los CNAME de GHL o de correo.
4. Esperar la propagación (minutos a horas). Netlify emite el certificado HTTPS automáticamente.
5. **Comprobar**: `https://<dominio>` y `https://www.<dominio>` cargan con candado; una redirige a
   la otra (definir la principal en Netlify); `http://` redirige a `https://`; el correo sigue
   funcionando; `/sitemap.xml` y `/robots.txt` responden.
6. Actualizar `NEXT_PUBLIC_SITE_URL` en Netlify y volver a desplegar (el sitemap y el canonical
   usan esa URL). Si existe el formulario de GHL, actualizar allí el enlace de la política a
   `https://<dominio>/politica-de-datos/` y la URL de redirección tras el envío.

## 4. Integración con GoHighLevel (cuando se autorice)

Replicar el sistema probado en Cerros de la Antigua y Playa Candela:

1. Crear en la sub-cuenta de García & Asociados el formulario **«Sitio web · Contacto»** con
   nombre, apellidos, WhatsApp, correo, `interes` (texto), `mensaje_web`, la casilla de
   autorización (Ley 1581, enlazada a la política) y los campos ocultos `property_code`,
   `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid_param`, `fbclid`,
   `landing_page`, `referrer`. Estos nombres coinciden con los que inyecta `FormularioContacto`.
2. Poner el ID en `NEXT_PUBLIC_GHL_FORM_ID` (y el del calendario en `NEXT_PUBLIC_GHL_CALENDAR_ID`).
3. Configurar «Al enviar → Redirigir a» una URL del sitio con `?lead=ok` para poder disparar el
   evento Lead del píxel solo cuando el envío se confirme (pendiente de implementar en el sitio
   cuando exista el formulario; hoy no se dispara ningún Lead).
4. Probar con un envío real, confirmar en GHL los campos ocultos y eliminar el contacto de prueba.

## 5. Medición (SEO, SEM y visibilidad en asistentes de IA)

El sitio deja lista la base: HTML semántico, títulos y descripciones reales por página, sitemap y
robots, datos estructurados `RealEstateAgent` solo con hechos del RUT, fichas indexables (las de
demostración con `noindex`) y eventos de clic en WhatsApp/agendar cuando el píxel esté activo.
El ciclo de medición (Search Console, analítica, Google Ads, pruebas de descubrimiento en
Gemini/ChatGPT/Claude) se ejecuta una vez el sitio esté publicado en su dominio; hasta entonces
cualquier cifra sería inventada.
