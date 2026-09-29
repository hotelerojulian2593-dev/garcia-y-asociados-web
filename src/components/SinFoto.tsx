/** Marcador honesto: nunca se sustituye una foto real por una imagen sintética. */
export function SinFoto({ demo, enPreparacion }: { demo?: boolean; enPreparacion?: boolean }) {
  return (
    <div className="sin-foto" role="img" aria-label={demo ? "Contenido de demostración, sin fotografía" : "Fotografías pendientes"}>
      <div>
        <strong>{enPreparacion ? "Ficha en preparación" : "Fotografías pendientes"}</strong>
        {demo ? "Contenido de demostración; pendiente de inventario autorizado" : "Se publican con el material autorizado"}
      </div>
    </div>
  );
}
