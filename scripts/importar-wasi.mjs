/**
 * Importa el inventario de Wasi al formato de fichas del sitio.
 *
 *   node scripts/importar-wasi.mjs contenido/fuentes/wasi-inventario-2026-09-29.json
 *
 * Entrada: el JSON generado desde el sitio público de Wasi de la inmobiliaria
 * (inmobiliariagarciayasociados.inmo.co), un objeto `inmuebles` indexado por código Wasi
 * con `titulo`, `det` (Detalles del inmueble), `secciones` (características), `descripcion`
 * (párrafos), `claves` (claves de las fotos en el CDN image.wasi.co), `precios` y `url`.
 *
 * Salida: un archivo `contenido/propiedades/wasi-<codigo>.json` por inmueble. Los archivos
 * `wasi-*.json` anteriores se borran antes de escribir, así el script es idempotente y el
 * inventario del sitio refleja exactamente lo que está activo en Wasi.
 *
 * Reglas del proyecto que este script respeta:
 *  - No inventa datos: todo campo sale de Wasi; lo que falta, se omite.
 *  - La dirección exacta y las coordenadas no se publican (ni siquiera se copian).
 *  - Precios fuera de rango razonable se publican como «Consultar precio» y se listan al final.
 *  - Cada ficha conserva `origen` con fuente, fecha y procedencia de las fotos.
 */
import fs from "node:fs";
import path from "node:path";

const archivo = process.argv[2];
if (!archivo) {
  console.error("Uso: node scripts/importar-wasi.mjs <archivo-exportado.json>");
  process.exit(1);
}

const RAIZ = path.resolve(new URL("..", import.meta.url).pathname);
const DIR_SALIDA = path.join(RAIZ, "contenido", "propiedades");
const datos = JSON.parse(fs.readFileSync(path.resolve(archivo), "utf8"));
const fechaLectura = new Date(datos.generadoEl || Date.now()).toLocaleDateString("sv-SE", { timeZone: "America/Bogota" });
const fechaTexto = new Date(fechaLectura + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

/* ---------- Tablas ---------- */

const TIPO_WASI = {
  Apartamento: "apartamento",
  Apartaestudio: "apartaestudio",
  Penthouse: "penthouse",
  Casa: "casa",
  "Casa Campestre": "casa",
  Cabaña: "casa",
  Finca: "finca",
  "Finca - Hoteles": "hotel",
  Hoteles: "hotel",
  Hostal: "hotel",
  "Lote / Terreno": "lote",
  "Lote Comercial": "lote",
  Local: "local",
  Oficina: "oficina",
  Consultorio: "consultorio",
  Bodega: "bodega",
  Edificio: "edificio",
  "Edificio Apartamentos": "edificio",
};

const SIN_TERRENO = new Set(["apartamento", "apartaestudio", "penthouse", "oficina", "consultorio", "local"]);

const CIUDAD = {
  Itagui: "Itagüí",
  Sopetran: "Sopetrán",
  Jerico: "Jericó",
  "Cartagena de Indias": "Cartagena",
  Medellin: "Medellín",
  Sabaneta: "Sabaneta",
};

// Palabras que se mantienen en minúscula al normalizar títulos escritos de forma irregular.
const MINUSCULAS = new Set(["de", "del", "en", "la", "las", "el", "los", "y", "e", "a", "al", "con", "sector", "cerca", "vereda", "venta", "vía", "via", "unidad", "parte", "otra", "por", "para", "sobre", "un", "una", "o", "u", "loma", "alto", "altos", "bajo", "km", "lote", "casa", "finca", "apartamento", "apartaestudio", "local", "bodega", "edificio", "penthouse", "duplex", "dúplex", "campestre", "hotel", "consultorio"]);

/* ---------- Utilidades ---------- */

const numero = (txt) => {
  if (!txt) return undefined;
  const limpio = String(txt).replace(/m²|COP|\$/g, "").trim();
  // "1.520.000" → 1520000 ; "230.46" → 230.46 ; "1.234,5" → 1234.5
  let n;
  if (/^\d{1,3}(\.\d{3})+$/.test(limpio)) n = Number(limpio.replace(/\./g, ""));
  else if (/^\d+(\.\d+)?$/.test(limpio)) n = Number(limpio);
  else n = Number(limpio.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};

const entero = (txt) => {
  const n = numero(txt);
  return typeof n === "number" ? Math.round(n) : undefined;
};

const redondear = (n) => (typeof n === "number" ? Math.round(n * 10) / 10 : undefined);

function urlImagen(clave, ancho) {
  const json = JSON.stringify({
    bucket: "staticw",
    key: clave,
    edits: { normalise: true, rotate: 0, resize: { width: ancho, height: ancho, fit: "inside" } },
  }).replace(/\//g, "\\/");
  return "https://image.wasi.co/" + Buffer.from(json, "utf8").toString("base64");
}

function quitarEmojis(s) {
  return s
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    // «(L.V) », «( L.A) »: iniciales del asesor al inicio de un párrafo.
    .replace(/^\s*\(\s*[A-ZÁÉÍÓÚ](?:\s*\.?\s*[A-ZÁÉÍÓÚ]){0,3}\s*\.?\s*\)\s*/gm, "")
    .replace(/[ \t]+/g, " ")
    .replace(/^[ \t]*[-•·:]+[ \t]*/gm, "")
    .replace(/^[ \t]+/gm, "")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

function normalizarTitulo(t) {
  let s = t.replace(/\s+/g, " ").trim().replace(/\bPethouse\b/gi, "Penthouse").replace(/\s*-\s*/g, " - ").replace(/\s+-\s+$/, "");
  const palabras = s.split(" ");
  const out = palabras.map((w, i) => {
    if (!w) return w;
    if (w.toUpperCase() === w && w.length <= 3) return w; // PH, II
    const base = w.toLowerCase();
    if (i > 0 && MINUSCULAS.has(base)) return base;
    return base.charAt(0).toUpperCase() + base.slice(1);
  });
  return out.join(" ");
}

function primeraFrase(parrafo, max = 200) {
  const limpio = parrafo.replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max);
  const punto = Math.max(corte.lastIndexOf(". "), corte.lastIndexOf("; "));
  if (punto > 60) return corte.slice(0, punto + 1);
  const espacio = corte.lastIndexOf(" ");
  return corte.slice(0, espacio) + "…";
}

function slugDe(url, id) {
  const ruta = new URL(url).pathname.split("/").filter(Boolean);
  const base = (ruta[0] || "inmueble")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${id}`;
}

const NOMBRE_TIPO = {
  apartamento: "Apartamento",
  apartaestudio: "Apartaestudio",
  penthouse: "Penthouse",
  casa: "Casa",
  finca: "Finca",
  hotel: "Hotel",
  lote: "Lote",
  local: "Local",
  oficina: "Oficina",
  consultorio: "Consultorio",
  bodega: "Bodega",
  edificio: "Edificio",
};

// Inmuebles de Wasi que ya tienen ficha propia en el sitio (se omiten para no duplicar).
const EXCLUIR = {
  "10434790": "Es Playa Candela (contenido/propiedades/playa-candela.json), publicada como venta confidencial.",
};

/* ---------- Conversión ---------- */

const avisos = [];

function convertir(w) {
  const det = w.det || {};
  const id = String(w.id || det["Código"]);
  if (EXCLUIR[id]) {
    avisos.push(`${id}: omitido. ${EXCLUIR[id]}`);
    return null;
  }
  const tipoWasi = det["Tipo de inmueble"] || "";
  const tipo = TIPO_WASI[tipoWasi];
  if (!tipo) {
    avisos.push(`${id}: tipo de inmueble sin equivalencia («${tipoWasi}»); se omite.`);
    return null;
  }
  const negocio = det["Tipo de negocio"] || "Venta";
  const operacion = /alquiler|arriendo/i.test(negocio) ? (/venta/i.test(negocio) ? "venta_arriendo" : "arriendo") : "venta";

  const ciudadCruda = (det["Ciudad"] || "").trim();
  const ciudad = CIUDAD[ciudadCruda] || ciudadCruda;
  const departamento = (det["Departamento"] || "").trim() || undefined;

  let barrioSector = (det["Zona / barrio"] || "").trim();
  if (!barrioSector) {
    const m = w.titulo.match(/sector\s+(.+)$/i);
    if (m) barrioSector = normalizarTitulo(m[1]);
  }
  if (barrioSector.toLowerCase() === ciudad.toLowerCase()) barrioSector = "";

  const precioEntrada = (w.precios || []).find((p) => /venta/i.test(p.etiqueta)) || (w.precios || [])[0];
  let precio = precioEntrada ? numero(precioEntrada.valor) : undefined;
  let precioVisible = typeof precio === "number" && precio > 0;
  if (precioVisible && (precio < 50_000_000 || precio > 100_000_000_000)) {
    avisos.push(`${id}: precio fuera de rango en Wasi (${precioEntrada.valor}); se publica como «Consultar precio». Corregir en Wasi.`);
    precioVisible = false;
    precio = undefined;
  }

  const areaConstruidaCruda = redondear(numero(det["Área Construida"]));
  const areaPrivada = redondear(numero(det["Área Privada"]));
  const areaTerreno = redondear(numero(det["Área Terreno"]));
  let areaConstruida = areaConstruidaCruda ?? areaPrivada;
  // Áreas construidas menores de 10 m² son marcadores de «sin dato» en Wasi (se ve «1 m²»).
  if (typeof areaConstruida === "number" && areaConstruida < 10) {
    avisos.push(`${id}: área construida «${det["Área Construida"]}» no es verosímil; se omite. Corregir en Wasi.`);
    areaConstruida = undefined;
  }
  let areaLote;
  if (tipo === "lote") {
    areaLote = areaTerreno ?? areaConstruidaCruda;
    areaConstruida = undefined;
  } else if (!SIN_TERRENO.has(tipo)) {
    areaLote = areaTerreno && areaTerreno !== areaConstruida ? areaTerreno : undefined;
  }

  const habitaciones = entero(det["Alcobas"]);
  const banos = entero(det["Baños"] ?? det["Baño"]);
  const parqueaderos = entero(det["Garaje"]);
  const pisos = entero(det["Pisos"]);

  // Descripción: párrafos de Wasi sin emojis; se conservan sus saltos de línea.
  const parrafos = (w.descripcion || [])
    .map(quitarEmojis)
    .filter((p) => p && p.length > 1 && !/^\(?[A-ZÁÉÍÓÚ][A-ZÁÉÍÓÚ.\s]{0,7}\)$/.test(p)) // «(A.B.)»: iniciales del asesor
    .filter((p) => !/^\([^)]{0,30}colega[^)]{0,30}\)$/i.test(p)); // «(M. Colega)»: nota interna
  const descripcion = parrafos.join("\n\n");

  const extras = [];
  if (det["Estado"] && det["Estado"] !== "Usado") extras.push(det["Estado"] === "Nuevo" ? "Inmueble nuevo" : det["Estado"]);
  if (det["Estrato"]) extras.push(`Estrato ${det["Estrato"]}`);
  if (det["Año construcción"]) extras.push(`Construido en ${det["Año construcción"]}`);
  if (det["Piso"]) extras.push(`Piso ${det["Piso"]}`);
  if (typeof areaPrivada === "number" && areaConstruidaCruda && areaPrivada !== areaConstruidaCruda) extras.push(`Área privada ${areaPrivada} m²`);
  if (det["Baño medio"]) extras.push(`${det["Baño medio"]} baño medio`);
  const admin = numero(det["Valor Administración"]);
  if (typeof admin === "number" && admin > 0) extras.push(`Administración ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(admin).replace(/\$\s+/, "$")} mensual`);
  const internas = (w.secciones || {})["Características internas"] || [];
  const externas = (w.secciones || {})["Características externas"] || [];
  const caracteristicas = Array.from(new Set([...extras, ...internas, ...externas].map((c) => c.trim()).filter(Boolean)));

  const titulo = normalizarTitulo(w.titulo);

  const datosResumen = [];
  if (typeof areaConstruida === "number") datosResumen.push(`${areaConstruida} m² construidos`);
  else if (typeof areaLote === "number") datosResumen.push(`${new Intl.NumberFormat("es-CO").format(areaLote)} m² de terreno`);
  if (typeof habitaciones === "number") datosResumen.push(`${habitaciones} ${habitaciones === 1 ? "alcoba" : "alcobas"}`);
  if (typeof banos === "number") datosResumen.push(`${banos} ${banos === 1 ? "baño" : "baños"}`);
  const lugar = barrioSector ? `${barrioSector}, ${ciudad}` : ciudad;
  const resumenDatos = `${NOMBRE_TIPO[tipo]}${datosResumen.length ? ` de ${datosResumen.join(", ")}` : ""} en ${lugar}.`;
  const parrafoResumen = parrafos.find((p) => p.replace(/\s+/g, " ").length >= 60);
  const resumen = parrafoResumen ? primeraFrase(parrafoResumen) : resumenDatos;
  const descripcionFinal = descripcion || `${resumenDatos} El asesor confirma en la visita los detalles que no aparecen en esta ficha.`;

  const claves = w.claves || [];
  const imagenes = claves.map((clave, k) => ({
    src: urlImagen(clave, 1600),
    miniatura: urlImagen(clave, 800),
    alt: `${titulo} · fotografía ${k + 1} de ${claves.length}`,
    tipo: "foto",
  }));
  if (!claves.length) avisos.push(`${id}: sin fotografías en Wasi (${titulo}).`);

  return {
    codigo: id,
    slug: slugDe(w.url, id),
    categoria: tipo === "hotel" ? "hotel" : "propiedad",
    titulo,
    resumen,
    operacion,
    tipo,
    ciudad,
    departamento,
    barrioSector,
    precio,
    precioVisible,
    areaConstruida,
    areaLote,
    habitaciones,
    banos,
    parqueaderos,
    pisos,
    estado: "disponible",
    destacada: false,
    demo: false,
    orden: Number(id) || 0,
    descripcion: descripcionFinal,
    caracteristicas,
    imagenes,
    origen: {
      fuente: `Inventario de Inmobiliaria García & Asociados en Wasi (código ${id}), leído el ${fechaTexto} desde el sitio público de Wasi de la inmobiliaria. Los datos los administra la inmobiliaria en Wasi; la dirección exacta no se publica.`,
      imagenes: `Fotografías cargadas por la inmobiliaria en Wasi (${claves.length} ${claves.length === 1 ? "imagen" : "imágenes"}, servidas desde image.wasi.co).`,
      verificadoEl: fechaLectura,
    },
  };
}

/* ---------- Ejecución ---------- */

const entradas = Object.values(datos.inmuebles || {});
const fichas = entradas.map(convertir).filter(Boolean);

// Destacadas: las de mayor precio con reportaje fotográfico completo (mínimo 8 fotos).
const candidatas = fichas
  .filter((f) => f.precioVisible && f.imagenes.length >= 8 && f.categoria === "propiedad")
  .sort((a, b) => b.precio - a.precio)
  .slice(0, 6);
candidatas.forEach((f) => (f.destacada = true));

// Borrar fichas Wasi anteriores y escribir las nuevas.
for (const f of fs.readdirSync(DIR_SALIDA)) if (/^wasi-.*\.json$/.test(f)) fs.unlinkSync(path.join(DIR_SALIDA, f));
const limpiar = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ""));
for (const f of fichas) {
  const salida = limpiar(f);
  fs.writeFileSync(path.join(DIR_SALIDA, `wasi-${f.codigo}.json`), JSON.stringify(salida, null, 2) + "\n");
}

const porTipo = {};
fichas.forEach((f) => (porTipo[f.tipo] = (porTipo[f.tipo] || 0) + 1));
console.log(`Fichas escritas: ${fichas.length} (de ${entradas.length} en Wasi, leídas el ${fechaLectura}).`);
console.log("Por tipo:", porTipo);
console.log("Destacadas:", candidatas.map((f) => `${f.codigo} ${f.titulo}`).join(" | "));
if (avisos.length) {
  console.log("\nAVISOS para revisar en Wasi:");
  avisos.forEach((a) => console.log(" - " + a));
}
