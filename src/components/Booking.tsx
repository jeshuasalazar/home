"use client";

import { useEffect, useRef } from "react";
import { bookingHref, type ServiceId, site } from "@/lib/site";
import { Chevron, Close } from "./Icons";
import { serviceIcons, serviceTints } from "./serviceMeta";

interface BookingProps {
  locale: string;
  dict: { title: string; subtitle: string; close: string; free: string; fallback: string };
  services: { id: ServiceId; name: string; desc: string }[];
}

// Cualquier elemento con [data-open-booking] abre esta hoja. Sin JS, esos
// enlaces llevan a #servicios.
export default function Booking({ locale, dict, services }: BookingProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest("[data-open-booking]");
      if (!trigger || !ref.current) return;
      e.preventDefault();
      ref.current.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => ref.current?.close();

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: clic en el fondo; Esc ya lo cierra el <dialog> nativo
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="booking-title"
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:p-5">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />
        <div className="flex items-start justify-between gap-4 px-1">
          <div>
            <h2 id="booking-title" className="text-xl font-semibold tracking-tight">
              {dict.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-label-2)]">{dict.subtitle}</p>
          </div>
          <button type="button" onClick={close} className="icon-btn -me-1 -mt-1 !size-8 bg-[var(--color-fill-2)]" aria-label={dict.close}>
            <Close className="size-4" />
          </button>
        </div>

        <div className="list mt-5">
          {services.map((s) => {
            const href = bookingHref(s.id, locale);
            const external = href.startsWith("http");
            const price = site.prices[s.id] ?? (s.id === "diagnostico" ? dict.free : null);
            const Icon = serviceIcons[s.id];
            return (
              <a key={s.id} href={href} onClick={close} {...(external ? { target: "_blank", rel: "noopener" } : {})} className="row">
                <span className="tile" style={{ "--t": `var(${serviceTints[s.id]})` } as React.CSSProperties}>
                  <Icon className="size-[1.1rem]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem]">{s.name}</span>
                  <span className="block truncate text-[0.8rem] text-[var(--color-label-3)]">{s.desc}</span>
                </span>
                {price && <span className="text-sm text-[var(--color-label-2)]">{price}</span>}
                <Chevron className="chev size-4" />
              </a>
            );
          })}
        </div>

        <p className="mt-4 text-center text-sm text-[var(--color-label-3)]">
          {dict.fallback}{" "}
          <a href={`mailto:${site.email}`} className="prose-link">
            {site.email}
          </a>
        </p>
      </div>
    </dialog>
  );
}
