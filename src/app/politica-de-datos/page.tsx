import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/Titulo";
import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos personales",
  description: "Política de tratamiento de datos personales de Inmobiliaria García & Asociados S.A.S., conforme a la Ley 1581 de 2012.",
  robots: { index: false, follow: true },
};

/**
 * Texto reutilizado de la política publicada para Playa Candela (vigente desde el 10 de
 * septiembre de 2026), generalizado al sitio corporativo. Los datos de contacto salen de
 * contenido/sitio.json. Si cambia el contenido sustancial, actualizar la fecha de vigencia.
 */
const VIGENCIA = "10 de septiembre de 2026";

export default function Politica() {
  return (
    <>
      <CabeceraPagina eyebrow="Legal" titulo="Política de tratamiento de datos personales" lead={`${SITIO.razonSocial} · Vigente desde el ${VIGENCIA}`} />
      <article className="wrap prosa max-w-[72ch] pb-20">
        <h2>1. Responsable del tratamiento</h2>
        <dl className="grid gap-1 text-[.95rem]">
          <div><strong>Razón social:</strong> {SITIO.razonSocial}</div>
          <div><strong>NIT:</strong> {SITIO.nit}</div>
          <div><strong>Domicilio:</strong> {SITIO.direccion}, {SITIO.ciudad}, {SITIO.pais}</div>
          <div><strong>Correo para datos personales:</strong> {SITIO.correo}</div>
          <div><strong>WhatsApp / teléfono:</strong> {SITIO.whatsappVisible} · {SITIO.telefonos.join(" · ")}</div>
        </dl>
        <p>Esta política se adopta en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y las demás normas que los modifiquen o complementen. Explica qué datos recogemos, para qué los usamos y cómo puede usted ejercer sus derechos.</p>

        <h2>2. Alcance</h2>
        <p>Aplica a todos los datos personales que {SITIO.razonSocial} recolecta y trata de clientes, interesados en los inmuebles que comercializa, proveedores y visitantes de sus sitios web, incluidos los formularios de solicitud de información de este sitio y de las páginas de los proyectos e inmuebles que comercialice.</p>

        <h2>3. Datos que tratamos</h2>
        <p>Recolectamos únicamente los datos necesarios para atender su solicitud y hacer seguimiento comercial:</p>
        <ul>
          <li><strong>Identificación y contacto:</strong> nombre, apellidos, número de WhatsApp o teléfono, correo electrónico. Los ingresa usted en nuestros formularios, por WhatsApp o en visitas comerciales.</li>
          <li><strong>Interés comercial:</strong> inmueble o tipo de inmueble de interés, perfil de comprador, presupuesto, plazo de compra, forma de financiación, mensaje o consulta. Los ingresa usted en el formulario.</li>
          <li><strong>Origen de la solicitud:</strong> inmueble consultado, página de origen, parámetros de campaña (utm, identificadores de clic de Google y Meta) y sitio de referencia. Se registran automáticamente al enviar el formulario, para saber por qué canal nos conoció.</li>
          <li><strong>Datos de navegación:</strong> dirección IP, tipo de dispositivo y navegador, cookies. Se registran automáticamente por nuestros sitios y herramientas de medición.</li>
          <li><strong>Datos de la negociación:</strong> documento de identidad, datos financieros y de la propiedad. Solo si avanza a un acuerdo de confidencialidad, separación, promesa o compraventa, y con autorización adicional.</li>
        </ul>
        <p>No recolectamos datos sensibles a través de nuestros formularios web ni datos de menores de edad.</p>

        <h2>4. Finalidades del tratamiento</h2>
        <ul>
          <li>Atender su solicitud de información y contactarlo por WhatsApp, llamada o correo electrónico con la ficha, el precio y las condiciones del inmueble que le interesa.</li>
          <li>Enviarle, cuando corresponda, el acuerdo de confidencialidad y la información detallada del inmueble, y agendar visitas y procesos de verificación (due diligence).</li>
          <li>Enviarle información sobre el inmueble consultado y sobre otros inmuebles o proyectos de la inmobiliaria que puedan interesarle. Puede pedir dejar de recibirla en cualquier momento.</li>
          <li>Medir la efectividad de nuestra publicidad y saber por qué canal llegó su solicitud.</li>
          <li>Gestionar la relación contractual si decide separar o comprar un inmueble: elaboración de documentos, verificación de identidad y cumplimiento de obligaciones legales, incluidas las de prevención de lavado de activos.</li>
          <li>Atender requerimientos de autoridades y ejercer o defender nuestros derechos.</li>
          <li>Elaborar estadísticas internas y mejorar nuestros servicios.</li>
        </ul>
        <p>La autorización se obtiene en el momento en que usted marca la casilla de consentimiento del formulario, escribe a nuestro WhatsApp o entrega sus datos en una visita. Conservamos prueba de esa autorización.</p>

        <h2>5. Derechos del titular</h2>
        <p>De acuerdo con el artículo 8 de la Ley 1581 de 2012, usted tiene derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar sus datos personales.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.</li>
          <li>Revocar la autorización y solicitar la supresión de sus datos, siempre que no exista un deber legal o contractual que obligue a conservarlos.</li>
          <li>Acceder de forma gratuita a sus datos personales.</li>
        </ul>

        <h2>6. Consultas y reclamos</h2>
        <p>Puede ejercer sus derechos escribiendo a <strong>{SITIO.correo}</strong> o por WhatsApp al <strong>{SITIO.whatsappVisible}</strong>, indicando su nombre completo, número de identificación, datos de contacto y la solicitud concreta.</p>
        <h3>Consultas</h3>
        <p>Las atenderemos en un plazo máximo de diez (10) días hábiles desde su recibo. Si no es posible en ese término, le informaremos los motivos y la nueva fecha, que no superará cinco (5) días hábiles adicionales.</p>
        <h3>Reclamos</h3>
        <p>Si considera que sus datos deben corregirse, actualizarse o suprimirse, o que se ha incumplido la ley, presente su reclamo con la descripción de los hechos y los documentos que lo soporten. Si está incompleto, le pediremos completarlo dentro de los cinco (5) días siguientes; si pasan dos (2) meses sin respuesta, entenderemos que desiste. Resolveremos el reclamo en máximo quince (15) días hábiles, prorrogables por ocho (8) días hábiles más con aviso previo. Mientras se resuelve, marcaremos el dato con la leyenda «reclamo en trámite».</p>
        <p>Solo puede acudir a la SIC una vez agotado este trámite ante nosotros.</p>

        <h2>7. Encargados y transferencias</h2>
        <p>Para prestar nuestros servicios usamos proveedores tecnológicos que actúan como encargados del tratamiento y que pueden alojar los datos fuera de Colombia, en países con niveles adecuados de protección o bajo cláusulas contractuales que garantizan la confidencialidad:</p>
        <ul>
          <li>Plataforma CRM y de mensajería (gestión de contactos, WhatsApp, correo y formularios).</li>
          <li>Plataformas publicitarias y de medición (Google, Meta), que reciben identificadores de campaña para medir la efectividad de los anuncios.</li>
          <li>Agencia de marketing que opera nuestras campañas y herramientas en nuestro nombre.</li>
          <li>Proveedores de alojamiento web y correo electrónico.</li>
        </ul>
        <p>No vendemos ni cedemos sus datos a terceros para fines distintos a los aquí descritos.</p>

        <h2>8. Seguridad y conservación</h2>
        <p>Aplicamos medidas técnicas, humanas y administrativas razonables para proteger sus datos contra acceso no autorizado, pérdida o alteración: control de accesos por usuario, cifrado en tránsito, copias de seguridad y deberes de confidencialidad de nuestro equipo y proveedores.</p>
        <p>Conservamos sus datos mientras exista una relación comercial o precontractual, mientras usted no revoque la autorización y, después, por el tiempo que exijan las obligaciones legales, contables o contractuales aplicables. Cumplido ese término, los suprimimos o anonimizamos.</p>

        <h2>9. Menores de edad y datos sensibles</h2>
        <p>Nuestros formularios y servicios están dirigidos a mayores de edad. No tratamos datos de niños, niñas o adolescentes salvo cuando la ley lo permita y siempre respetando su interés superior. Tampoco solicitamos datos sensibles; si excepcionalmente fuera necesario, pediremos autorización expresa y le informaremos que no está obligado a entregarlos.</p>

        <h2>10. Vigencia y cambios</h2>
        <p>Esta política rige desde el {VIGENCIA}. Las bases de datos se conservarán por los plazos indicados en la sección 8. Cualquier cambio sustancial será publicado en esta misma página y, cuando corresponda, comunicado a los titulares antes de aplicarlo.</p>
      </article>
    </>
  );
}
