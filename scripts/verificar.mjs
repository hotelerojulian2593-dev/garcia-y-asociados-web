/**
 * Verificación automática del sitio exportado (carpeta out/).
 * - Sirve out/ en un puerto local y recorre todas las páginas en escritorio y móvil.
 * - Comprueba: errores de consola, textos entre corchetes, enlaces internos rotos,
 *   imágenes sin alt, H1 único, filtros del catálogo (incluido estado sin resultados),
 *   galería con teclado, y que con `prefers-reduced-motion` no haya transformaciones.
 * - Guarda capturas en capturas/ para revisión.
 * Uso: npm run build && node scripts/verificar.mjs
 */
import { createServer } from "node:http";
import { readFile, stat, readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const RAIZ = path.resolve("out");
const PUERTO = 4173;
const BASE = `http://127.0.0.1:${PUERTO}`;
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".ico": "image/x-icon", ".woff2": "font/woff2" };

const servidor = createServer(async (req, res) => {
  let ruta = decodeURIComponent(new URL(req.url, BASE).pathname);
  let archivo = path.join(RAIZ, ruta);
  try {
    if ((await stat(archivo)).isDirectory()) archivo = path.join(archivo, "index.html");
  } catch { archivo = path.join(RAIZ, "404.html"); res.statusCode = 404; }
  try {
    const cuerpo = await readFile(archivo);
    res.setHeader("content-type", MIME[path.extname(archivo)] || "application/octet-stream");
    res.end(cuerpo);
  } catch { res.statusCode = 404; res.end("no encontrado"); }
});
await new Promise((r) => servidor.listen(PUERTO, r));

async function paginasHtml(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await paginasHtml(p, acc);
    else if (e.name === "index.html") acc.push("/" + path.relative(RAIZ, path.dirname(p)).split(path.sep).join("/") + "/");
  }
  return acc.map((r) => r.replace(/^\/\.\/$/, "/").replace("//", "/"));
}

// Con el inventario de Wasi hay más de 220 fichas: se recorren todas las páginas fijas y una
// muestra de fichas (las 6 primeras y 6 tomadas a intervalos). `VERIFICAR_TODO=1` las recorre todas.
const todas = (await paginasHtml(RAIZ)).sort();
const fichas = todas.filter((r) => /^\/propiedades\/[^/]+\/$/.test(r));
const paso = Math.max(1, Math.floor(fichas.length / 6));
const muestra = new Set([...fichas.slice(0, 6), ...fichas.filter((_, i) => i % paso === 0).slice(0, 6)]);
const rutas = process.env.VERIFICAR_TODO ? todas : todas.filter((r) => !fichas.includes(r) || muestra.has(r));
const hallazgos = [];
let externosNoVerificables = 0;
const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium", args: ["--headless=new"] });
await mkdir("capturas", { recursive: true });

for (const [nombre, vista] of [["escritorio", { width: 1440, height: 900 }], ["movil", { width: 390, height: 844, isMobile: true, hasTouch: true }]]) {
  const ctx = await navegador.newContext({ viewport: vista, locale: "es-CO" });
  for (const ruta of rutas) {
    const pagina = await ctx.newPage();
    const errores = [];
    pagina.on("pageerror", (e) => errores.push(`pageerror: ${e.message}`));
    pagina.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errores.push(`console: ${m.text()}`); });
    pagina.on("requestfailed", (r) => {
      const err = r.failure()?.errorText || "";
      if (/fonts\.|facebook\.|marketinghotelero/.test(r.url()) || /ABORTED/.test(err)) return;
      // Las fotos del inventario se sirven desde el CDN de Wasi. Si el entorno no tiene salida a
      // ese host (proxy o túnel), no es un defecto del sitio: se cuenta aparte.
      if (/image\.wasi\.co/.test(r.url()) && /TUNNEL|PROXY|NAME_NOT_RESOLVED|INTERNET_DISCONNECTED/.test(err)) { externosNoVerificables++; return; }
      errores.push(`recurso: ${r.url()} ${err}`);
    });
    // Los recursos externos (fuentes, píxel) no se cargan en local; no cuentan como error.
    await pagina.route(/fonts\.(googleapis|gstatic)\.com|facebook\.(com|net)|link\.marketinghotelero\.com/, (r) => r.abort());
    const resp = await pagina.goto(BASE + ruta, { waitUntil: "load" });
    if (!resp || resp.status() >= 400) hallazgos.push(`${nombre} ${ruta}: HTTP ${resp?.status()}`);
    // Recorre la página para que el revelado por scroll ocurra antes de la captura.
    await pagina.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo({ top: 0, behavior: "instant" }); });
    await pagina.waitForTimeout(900);

    const datos = await pagina.evaluate(() => {
      const texto = document.body.innerText;
      const corchetes = texto.match(/\[[^\]\n]{2,60}\]/g) || [];
      const h1 = document.querySelectorAll("h1").length;
      const sinAlt = Array.from(document.images).filter((i) => !i.hasAttribute("alt")).length;
      const enlaces = Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href")).filter((h) => h.startsWith("/") && !h.startsWith("//"));
      const desborde = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      return { corchetes, h1, sinAlt, enlaces, desborde, titulo: document.title };
    });
    if (datos.corchetes.length) hallazgos.push(`${nombre} ${ruta}: corchetes ${JSON.stringify(datos.corchetes)}`);
    if (datos.h1 !== 1) hallazgos.push(`${nombre} ${ruta}: ${datos.h1} H1`);
    if (datos.sinAlt) hallazgos.push(`${nombre} ${ruta}: ${datos.sinAlt} imágenes sin alt`);
    if (datos.desborde) hallazgos.push(`${nombre} ${ruta}: desbordamiento horizontal`);
    if (!datos.titulo) hallazgos.push(`${nombre} ${ruta}: sin <title>`);
    for (const h of new Set(datos.enlaces)) {
      const limpio = h.split("?")[0].split("#")[0];
      if (!limpio || limpio === "/") continue;
      const r = await fetch(BASE + limpio);
      if (r.status >= 400) hallazgos.push(`${nombre} ${ruta}: enlace roto ${h}`);
    }
    errores.forEach((e) => hallazgos.push(`${nombre} ${ruta}: ${e}`));
    await pagina.screenshot({ path: `capturas/${nombre}${ruta.replace(/\//g, "_") || "_"}.png`, fullPage: true });
    await pagina.close();
  }
  await ctx.close();
}

/* ---- Comprobaciones funcionales (escritorio) ---- */
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, locale: "es-CO" });
const p = await ctx.newPage();
await p.route(/fonts\.|facebook\./, (r) => r.abort());

// Filtros del catálogo
await p.goto(`${BASE}/propiedades/`);
const total = await p.locator("ul[aria-label=Resultados] li").count();
await p.selectOption("#f-tipo", "hotel");
await p.waitForTimeout(200);
const hoteles = await p.locator("ul[aria-label=Resultados] li").count();
if (!(hoteles > 0 && hoteles < total)) hallazgos.push(`filtros: tipo=hotel devolvió ${hoteles} de ${total}`);
if (!p.url().includes("tipo=hotel")) hallazgos.push("filtros: la URL no refleja el filtro");
await p.selectOption("#f-area", "2500");
await p.waitForTimeout(200);
const vacio = await p.getByText("No hay propiedades con esa combinación.").isVisible();
if (!vacio) hallazgos.push("filtros: no aparece el estado sin resultados");
await p.getByRole("button", { name: "Restablecer filtros" }).first().click();
await p.waitForTimeout(200);
const restablecido = await p.locator("ul[aria-label=Resultados] li").count();
if (restablecido !== total) hallazgos.push(`filtros: restablecer dejó ${restablecido} de ${total}`);
// Enlace desde anuncio con filtro en la URL
await p.goto(`${BASE}/propiedades/?ciudad=Cartagena`);
await p.waitForTimeout(300);
if ((await p.locator("ul[aria-label=Resultados] li").count()) !== 1) hallazgos.push("filtros: ?ciudad=Cartagena no filtró a 1 resultado");

// Galería con teclado
await p.goto(`${BASE}/propiedades/playa-candela/`);
const antes = await p.locator(".galeria-escenario img.activa").getAttribute("src");
await p.keyboard.press("ArrowRight");
await p.waitForTimeout(100);
const despues = await p.locator(".galeria-escenario img.activa").getAttribute("src");
if (antes === despues) hallazgos.push("galería: la flecha derecha no cambia la imagen");

// Contacto vinculado al inmueble
await p.goto(`${BASE}/contacto/?inmueble=GA-HOTEL-PC&motivo=visita`);
await p.waitForTimeout(300);
if ((await p.inputValue("#c-interes")) !== "GA-HOTEL-PC") hallazgos.push("contacto: no preselecciona el inmueble de la URL");
if (!(await p.getByRole("button", { name: /Solicitar visita por WhatsApp/ }).isVisible())) hallazgos.push("contacto: motivo=visita no cambia el botón");
await p.getByRole("button", { name: /Solicitar visita por WhatsApp/ }).click();
if (!(await p.getByText("Complete nombre, medio de contacto").isVisible())) hallazgos.push("contacto: no valida campos vacíos");
if (await p.getByText(/gracias/i).count()) hallazgos.push("contacto: muestra confirmación sin envío real");

// Foco visible con teclado
await p.goto(`${BASE}/`);
await p.keyboard.press("Tab");
const saltar = await p.evaluate(() => document.activeElement?.textContent);
if (saltar !== "Saltar al contenido") hallazgos.push(`teclado: el primer foco es "${saltar}"`);
await p.keyboard.press("Tab");
const contorno = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
if (contorno === "none") hallazgos.push("teclado: el foco no es visible");

// Movimiento reducido: sin transformaciones en el hero
const ctxRM = await navegador.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const pr = await ctxRM.newPage();
await pr.route(/fonts\.|facebook\./, (r) => r.abort());
await pr.goto(`${BASE}/`);
await pr.mouse.move(200, 200); await pr.mouse.move(900, 500);
await pr.evaluate(() => window.scrollTo(0, 300));
await pr.waitForTimeout(200);
const transformadas = await pr.evaluate(() => Array.from(document.querySelectorAll("[data-profundidad]")).filter((e) => e.style.transform).length);
if (transformadas) hallazgos.push(`movimiento reducido: ${transformadas} capas con transform`);
const revelados = await pr.evaluate(() => Array.from(document.querySelectorAll(".revelar")).filter((e) => getComputedStyle(e).opacity !== "1").length);
if (revelados) hallazgos.push(`movimiento reducido: ${revelados} elementos ocultos`);
await ctxRM.close();

// Movimiento normal: el hero sí responde al scroll
await p.goto(`${BASE}/`);
await p.evaluate(() => window.scrollTo(0, 400));
await p.waitForTimeout(200);
const conParallax = await p.evaluate(() => Array.from(document.querySelectorAll("[data-profundidad]")).filter((e) => e.style.transform).length);
if (!conParallax) hallazgos.push("hero: el parallax no se activa con el scroll");

await ctx.close();
await navegador.close();
servidor.close();

console.log(`Páginas recorridas: ${rutas.length} × 2 vistas`);
if (externosNoVerificables) console.log(`Imágenes de image.wasi.co no verificables desde este entorno: ${externosNoVerificables} (se comprueban en producción).`);
if (hallazgos.length) { console.log("HALLAZGOS:"); hallazgos.forEach((h) => console.log(" - " + h)); process.exitCode = 1; }
else console.log("Sin hallazgos.");
