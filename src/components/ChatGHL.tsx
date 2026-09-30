import { GHL_CHAT_WIDGET_ID } from "@/lib/sitio";

/**
 * Widget de chat en directo de GoHighLevel. Las conversaciones llegan a la bandeja
 * «Conversaciones» de la subcuenta y crean el contacto en el CRM. Se carga en diferido
 * para no afectar la carga inicial. Sin ID no se inserta nada.
 */
export function ChatGHL() {
  if (!GHL_CHAT_WIDGET_ID) return null;
  return (
    <script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id={GHL_CHAT_WIDGET_ID}
      async
    />
  );
}
