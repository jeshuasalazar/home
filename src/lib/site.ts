// Datos del negocio que cambian sin tocar diseño ni traducciones.
// Para activar la agenda en línea, pega aquí el enlace de cada tipo de cita
// (Cal.com, Calendly, TidyCal…). Mientras esté en null, el botón lleva al
// formulario de contacto con la opción ya seleccionada.

export type ServiceId = "diagnostico" | "estrategia" | "implementacion" | "conferencia";

export const site = {
  url: "https://jeshuasalazar.com",
  email: "hola@jeshuasalazar.com",
  linkedin: "https://www.linkedin.com/in/jeshuasalazar",
  github: "https://github.com/jeshuasalazar",
  ailearning: "https://ailearning.mx",
  booking: {
    diagnostico: "https://cal.com/jeshuasalazar/diagnostico" as string | null,
    estrategia: "https://cal.com/jeshuasalazar/sesion-estrategica" as string | null,
    implementacion: "https://cal.com/jeshuasalazar/implementacion" as string | null,
    conferencia: "https://cal.com/jeshuasalazar/conferencia" as string | null,
  } satisfies Record<ServiceId, string | null>,
  // Precio visible por servicio (null = sin precio público).
  prices: {
    diagnostico: null,
    estrategia: "$3,900 MXN",
    implementacion: null,
    conferencia: null,
  } satisfies Record<ServiceId, string | null>,
};

export function bookingHref(id: ServiceId, locale: string): string {
  return site.booking[id] ?? `/${locale}/contacto?tipo=${id}#formulario`;
}
