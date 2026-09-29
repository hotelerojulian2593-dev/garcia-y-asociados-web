# Despliegue y dominio

## Qué está preparado, probado y pendiente

| | Estado |
|---|---|
| Build estático (`npm run build` → `out/`) | **Probado** en este entorno: 22 páginas, sin errores |
| Verificación automática (`npm run verificar`) | **Probada**: 20 páginas × escritorio y móvil, filtros, galería, teclado, movimiento reducido, enlaces, sin hallazgos |
| Netlify | **En producción**: proyecto `garcia-y-asociados` (equipo marketinghotelerobyseroz), deploy automático desde main, ~30 s por build |
| Repositorio Git | **Publicado**: github.com/hotelerojulian2593-dev/garcia-y-asociados-web (rama main). La app de GitHub de Claude tiene acceso a este repo |
| Dominio `inmobiliariagarciayasociados.com` | **Conectado el 29 sep 2026**: A raíz → 75.2.60.5, CNAME www → garcia-y-asociados.netlify.app (editados en GHL → Dominios → Registros DNS). Certificado Let's Encrypt emitido 7:09; `www` redirige a la raíz. Valores anteriores: A 162.159.140.166, CNAME www sites.ludicrous.cloud |
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

Dominio: **inmobiliariagarciayasociados.com**. Estado observado el 28 de septiembre de 2026 (consultas DNS
públicas; no se cambió nada):

| Registro | Valor observado | Lectura |
|---|---|---|
| NS | `braden.ns.cloudflare.com`, `love.ns.cloudflare.com` | El DNS lo administra Cloudflare, que es lo que usa GoHighLevel para los dominios comprados o conectados desde GHL. Los registros se editan desde GHL (Settings → Domains) o desde la cuenta de Cloudflare asociada |
| A (raíz) | `162.159.140.166` | IP de Cloudflare: el dominio raíz está apuntado a la plataforma de sitios de GHL |
| CNAME `www` | `sites.ludicrous.cloud` | Alojamiento de sitios/funnels de GoHighLevel |
| MX | ninguno | No hay correo en este dominio (la firma usa Gmail); no hay nada de correo que preservar |
| TXT / DMARC | ninguno | Sin SPF ni verificaciones de terceros |
| `https://` raíz / `www` | 404 / 403 | No se encontró un sitio publicado; confirmar abriéndolo en un navegador antes de cambiar el DNS |

Conclusión: el dominio está conectado a GHL, pero no sirve un sitio funcional. Cambiar el A raíz y el
CNAME `www` hacia Netlify no interrumpe correo ni otros servicios. Si más adelante GHL necesita un
subdominio (por ejemplo `link.` para widgets, hoy no existe), se añade sin conflicto.

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
3. **En el DNS del dominio** (GHL → Settings → Domains, o Cloudflare): cambiar el registro A raíz
   por el de Netlify y el CNAME `www` de `sites.ludicrous.cloud` al subdominio `.netlify.app`.
   Si Cloudflare muestra el proxy (nube naranja), dejarlo en «DNS only» para que Netlify emita el
   certificado. No hay MX ni TXT que preservar, pero anotar los valores anteriores por si hay que revertir.
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
