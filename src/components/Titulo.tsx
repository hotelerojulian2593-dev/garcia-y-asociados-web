/** Cabeza de sección al estilo del manual: numeral grande en gris cálido + titular slab. */
export function Titulo({ eyebrow, titulo, lead, claro = false, id, numero }: { eyebrow?: string; titulo: string; lead?: string; claro?: boolean; id?: string; numero?: string }) {
  return (
    <header className={`max-w-[46rem] ${claro ? "text-white" : ""}`}>
      {numero && <p className="numeral mb-2" aria-hidden>{numero}.</p>}
      {eyebrow && <p className={`eyebrow mb-4 ${claro ? "text-azul-claro" : ""}`}>{eyebrow}</p>}
      <h2 id={id} className={claro ? "text-azul-claro" : ""}>{titulo}</h2>
      {lead && <p className={`lead mt-4 ${claro ? "text-gris-claro" : ""}`}>{lead}</p>}
    </header>
  );
}

export function CabeceraPagina({ eyebrow, titulo, lead, numero }: { eyebrow?: string; titulo: string; lead?: string; numero?: string }) {
  return (
    <div className="wrap seccion-compacta">
      <header className="max-w-[52rem]">
        {numero && <p className="numeral mb-2" aria-hidden>{numero}.</p>}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="filete">{titulo}</h1>
        {lead && <p className="lead mt-5">{lead}</p>}
      </header>
    </div>
  );
}
