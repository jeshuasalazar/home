// Datos del negocio que cambian sin tocar diseño ni traducciones.
// Para activar la agenda en línea, pega aquí el enlace de cada tipo de cita
// (Cal.com, Calendly, TidyCal…). Mientras esté en null, el botón lleva al
// formulario de contacto con la opción ya seleccionada.

export type ServiceId = "diagnostico" | "estrategia" | "implementacion";

export const site = {
  url: "https://jeshuasalazar.com",
  email: "hola@jeshuasalazar.com",
  linkedin: "https://www.linkedin.com/in/jeshuasalazar",
  ailearning: "https://ailearning.mx",
  booking: {
    diagnostico: null as string | null,
    estrategia: null as string | null,
    implementacion: null as string | null,
  } satisfies Record<ServiceId, string | null>,
  // Precio visible por servicio (null = sin precio público).
  prices: {
    diagnostico: null,
    estrategia: "$4,900 MXN",
    implementacion: null,
  } satisfies Record<ServiceId, string | null>,
};

export function bookingHref(id: ServiceId, locale: string): string {
  return site.booking[id] ?? `/${locale}/contacto?tipo=${id}#formulario`;
}
