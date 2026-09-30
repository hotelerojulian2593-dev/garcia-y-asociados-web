/**
 * Lectura del inventario público de Wasi desde el navegador.
 *
 * Cómo usarlo:
 *  1. Abrir en Chrome cualquier ficha del sitio público de Wasi de la inmobiliaria,
 *     por ejemplo https://inmobiliariagarciayasociados.inmo.co/ (no hace falta iniciar sesión).
 *  2. Abrir la consola (Cmd+Opt+J), pegar este archivo completo y pulsar Enter.
 *  3. Esperar el mensaje «Listo» (unos 40 s para 225 inmuebles). Se descarga
 *     `wasi-inventario-AAAA-MM-DD.json`; moverlo a `contenido/fuentes/` del repositorio.
 *  4. En el repositorio: `node scripts/importar-wasi.mjs contenido/fuentes/wasi-inventario-AAAA-MM-DD.json`
 *
 * Solo lee páginas públicas (sitemap.xml y las fichas). No copia dirección ni coordenadas.
 */
(async () => {
  const txt = (e) => (e ? e.textContent : "").replace(/\s+/g, " ").trim();

  const parsear = (doc) => {
    const titulo = txt(doc.querySelector("h1"));
    const det = {};
    doc.querySelectorAll(".list-info-1a li").forEach((li) => {
      const k = txt(li.querySelector("strong")).replace(/:$/, "");
      const v = txt(li).replace(txt(li.querySelector("strong")), "").trim();
      if (k) det[k] = v;
    });
    const secciones = {};
    doc.querySelectorAll(".title h3").forEach((h) => {
      const nombre = txt(h);
      const cont = h.closest(".title").nextElementSibling;
      if (cont && cont.querySelector("li") && !/Detalles/.test(nombre)) secciones[nombre] = [...cont.querySelectorAll("li")].map(txt);
    });
    const descTitle = [...doc.querySelectorAll(".title h3")].find((h) => /Descripci/i.test(h.textContent));
    const descripcion = [];
    if (descTitle) {
      let n = descTitle.closest(".title").nextElementSibling;
      while (n) {
        if (n.tagName === "P") {
          const partes = n.innerHTML.split(/<br\s*\/?>/i).map((s) => { const d = doc.createElement("div"); d.innerHTML = s; return txt(d); }).filter(Boolean);
          if (partes.length) descripcion.push(partes.join("\n"));
        }
        n = n.nextElementSibling;
      }
    }
    const claves = [];
    doc.querySelectorAll("img").forEach((i) => {
      const s = i.getAttribute("src") || i.getAttribute("data-src") || "";
      if (!s.includes("image.wasi.co/")) return;
      try { const j = JSON.parse(atob(s.split("image.wasi.co/")[1])); if (j.key && !claves.includes(j.key)) claves.push(j.key); } catch {}
    });
    const precios = [...doc.querySelectorAll(".blq_precio")].map((b) => ({ etiqueta: txt(b).replace(txt(b.querySelector(".pr1")), "").trim(), valor: txt(b.querySelector(".pr1")) }));
    return { titulo, det, secciones, descripcion, claves, precios };
  };

  const xml = await (await fetch("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => /\/\d{6,}$/.test(u));
  const inmuebles = {}, errores = {};
  let hecho = 0;
  const parser = new DOMParser();
  const uno = async (u) => {
    const id = u.match(/(\d+)$/)[1];
    try {
      const html = await (await fetch(u.replace(/^http:/, "https:"))).text();
      const r = parsear(parser.parseFromString(html, "text/html"));
      r.url = u; r.id = id;
      inmuebles[id] = r;
    } catch (e) { errores[id] = String(e); }
    hecho++;
    if (hecho % 25 === 0) console.log(`${hecho}/${urls.length}`);
  };
  const cola = urls.slice();
  await Promise.all(Array.from({ length: 6 }, async () => { while (cola.length) await uno(cola.shift()); }));

  const fecha = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Bogota" });
  const datos = { generadoEl: new Date().toISOString(), fuente: `${location.host} (sitio público Wasi) + sitemap.xml`, inmuebles, errores };
  const blob = new Blob([JSON.stringify(datos)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `wasi-inventario-${fecha}.json`;
  document.body.appendChild(a);
  a.click();
  console.log(`Listo: ${Object.keys(inmuebles).length} inmuebles, ${Object.keys(errores).length} errores. Archivo: ${a.download}`);
})();
