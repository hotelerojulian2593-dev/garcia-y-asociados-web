import { hayContenidoDemo } from "@/lib/inventario";

/** Aviso visible mientras exista contenido de demostración. Desaparece solo cuando se retira. */
export function AvisoDemo() {
  if (!hayContenidoDemo()) return null;
  return (
    <div className="wrap">
      <p className="aviso">
        <strong>Prototipo en revisión.</strong> Las fichas marcadas como «Demostración» son ilustrativas y se retiran al cargar el
        inventario autorizado. Cerros de la Antigua, Playa Candela y El Vallenato P.H. corresponden a información publicada o entregada por la firma.
      </p>
    </div>
  );
}
