/**
 * Reel vertical (9:16) dentro de un marco. Se carga bajo demanda (preload="none") y solo
 * reproduce cuando el usuario lo activa: el sitio nunca arranca video con sonido.
 */
export function ReelVertical({ src, poster, titulo }: { src: string; poster: string; titulo: string }) {
  return (
    <figure className="reel">
      <video controls preload="none" poster={poster} playsInline aria-label={titulo} width={720} height={1280}>
        <source src={src} type="video/mp4" />
        Su navegador no reproduce video HTML5.
      </video>
      <figcaption className="mudo mt-2 text-center text-xs uppercase tracking-[.12em]">{titulo}</figcaption>
    </figure>
  );
}
