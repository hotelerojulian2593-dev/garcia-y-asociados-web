export function Titulo({ eyebrow, titulo, lead, claro = false, id }: { eyebrow?: string; titulo: string; lead?: string; claro?: boolean; id?: string }) {
  return (
    <header className={`max-w-[46rem] ${claro ? "text-blanco" : ""}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 id={id} className={claro ? "text-blanco" : ""}>{titulo}</h2>
      {lead && <p className={`lead mt-4 ${claro ? "text-piedra" : ""}`}>{lead}</p>}
    </header>
  );
}

export function CabeceraPagina({ eyebrow, titulo, lead }: { eyebrow?: string; titulo: string; lead?: string }) {
  return (
    <div className="wrap seccion-compacta">
      <header className="max-w-[52rem]">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1>{titulo}</h1>
        {lead && <p className="lead mt-5">{lead}</p>}
      </header>
    </div>
  );
}
