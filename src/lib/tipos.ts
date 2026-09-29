/**
 * Tipos y utilidades de formato del inventario. Sin dependencias de Node: se puede
 * importar desde componentes de cliente.
 */
export const TIPOS = [
  "apartamento",
  "apartaestudio",
  "casa",
  "local",
  "oficina",
  "lote",
  "finca",
  "bodega",
  "hotel",
] as const;
export type Tipo = (typeof TIPOS)[number];

export const CATEGORIAS = ["propiedad", "hotel", "proyecto"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export type Imagen = {
  src: string;
  alt: string;
  tipo: "foto" | "render" | "plano";
  leyenda?: string;
};

export type Origen = {
  fuente: string;
  imagenes: string;
  verificadoEl: string | null;
};

export type Propiedad = {
  codigo: string;
  slug: string;
  categoria: Categoria;
  titulo: string;
  resumen: string;
  operacion: "venta" | "arriendo" | "venta_arriendo";
  tipo: Tipo;
  ciudad: string;
  departamento?: string;
  barrioSector: string;
  confidencial?: boolean;
  precio?: number;
  precioVisible: boolean;
  precioDesde?: boolean;
  areaConstruida?: number;
  areaLote?: number;
  areaDesde?: boolean;
  habitaciones?: number;
  banos?: number;
  parqueaderos?: number;
  pisos?: number;
  unidadesDisponibles?: number;
  unidadesTotales?: number;
  entrega?: string;
  capacidad?: string;
  estado: "disponible" | "separada" | "vendida" | "arrendada" | "retirada";
  destacada?: boolean;
  demo: boolean;
  fichaEnPreparacion?: boolean;
  descripcion: string;
  caracteristicas: string[];
  imagenes: Imagen[];
  enlaceExterno?: string;
  recorridoVirtual?: string;
  origen: Origen;
};


/* ---------- Formato ---------- */

export function formatoPrecio(p: Pick<Propiedad, "precio" | "precioVisible" | "precioDesde">): string {
  if (!p.precioVisible || typeof p.precio !== "number") return "Consultar precio";
  const valor = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(p.precio).replace(/\$\s+/, "$");
  return p.precioDesde ? `Desde ${valor}` : valor;
}

export function formatoArea(m2?: number, desde?: boolean): string | null {
  if (typeof m2 !== "number") return null;
  const v = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(desde ? Math.floor(m2) : m2);
  return `${desde ? "desde " : ""}${v} m²`;
}

export const NOMBRE_TIPO: Record<Tipo, string> = {
  apartamento: "Apartamento",
  apartaestudio: "Apartaestudio",
  casa: "Casa",
  local: "Local",
  oficina: "Oficina",
  lote: "Lote",
  finca: "Finca",
  bodega: "Bodega",
  hotel: "Hotel",
};

/** Datos esenciales para una tarjeta: solo lo que existe. */
export function datosEsenciales(p: Propiedad): string[] {
  const d: string[] = [];
  if (typeof p.habitaciones === "number") d.push(`${p.habitaciones} hab.`);
  if (typeof p.banos === "number") d.push(`${p.banos} baños`);
  const ac = formatoArea(p.areaConstruida);
  if (ac) d.push(`${ac} constr.`);
  const al = formatoArea(p.areaLote, p.areaDesde);
  if (al) d.push(`${al} lote`);
  if (typeof p.unidadesDisponibles === "number") d.push(`${p.unidadesDisponibles} unidades`);
  if (typeof p.unidadesTotales === "number" && typeof p.unidadesDisponibles !== "number") d.push(`${p.unidadesTotales} unidades`);
  if (p.entrega) d.push(`Entrega ${p.entrega}`);
  return d.slice(0, 3);
}

/** Objeto plano y serializable para los componentes de cliente (filtros). */
export type TarjetaPropiedad = {
  slug: string;
  codigo: string;
  categoria: Categoria;
  titulo: string;
  tipo: Tipo;
  ciudad: string;
  barrioSector: string;
  precioTexto: string;
  precio: number | null;
  habitaciones: number | null;
  area: number | null;
  esenciales: string[];
  imagen: Imagen | null;
  demo: boolean;
  confidencial: boolean;
  fichaEnPreparacion: boolean;
};

export function aTarjeta(p: Propiedad): TarjetaPropiedad {
  return {
    slug: p.slug,
    codigo: p.codigo,
    categoria: p.categoria,
    titulo: p.titulo,
    tipo: p.tipo,
    ciudad: p.ciudad,
    barrioSector: p.barrioSector,
    precioTexto: formatoPrecio(p),
    precio: p.precioVisible && typeof p.precio === "number" ? p.precio : null,
    habitaciones: typeof p.habitaciones === "number" ? p.habitaciones : null,
    area: p.areaConstruida ?? p.areaLote ?? null,
    esenciales: datosEsenciales(p),
    imagen: p.imagenes[0] ?? null,
    demo: p.demo,
    confidencial: !!p.confidencial,
    fichaEnPreparacion: !!p.fichaEnPreparacion,
  };
}
