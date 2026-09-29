"use client";

import { useEffect, useRef } from "react";
import { bookingHref, type ServiceId, site } from "@/lib/site";

interface ServiceItem {
  id: ServiceId;
  name: string;
  duration: string;
}

interface BookingProps {
  locale: string;
  dict: { title: string; subtitle: string; close: string; free: string; fallback: string };
  services: ServiceItem[];
}

// Cualquier elemento con [data-open-booking] abre este diálogo. Sin JS, esos
// enlaces siguen funcionando porque apuntan a #servicios.
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
      className="booking"
      aria-labelledby="booking-title"
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="p-6 sm:p-8">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/15 sm:hidden" aria-hidden="true" />
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="booking-title" className="text-2xl font-semibold tracking-tight">
              {dict.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-mute)]">{dict.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--hairline)] text-[var(--color-mute)] transition hover:text-white"
            aria-label={dict.close}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="mt-7 grid gap-3">
          {services.map((s, i) => {
            const href = bookingHref(s.id, locale);
            const external = href.startsWith("http");
            const price = site.prices[s.id] ?? (s.id === "diagnostico" ? dict.free : null);
            return (
              <li key={s.id}>
                <a
                  href={href}
                  onClick={close}
                  {...(external ? { target: "_blank", rel: "noopener" } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-[var(--hairline)] bg-white/[0.02] p-4 transition hover:border-[var(--hairline-strong)] hover:bg-white/[0.05]"
                >
                  <span className="orb shrink-0" style={{ "--c": `var(--color-orb-${i + 1})` } as React.CSSProperties} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.name}</span>
                    <span className="block text-xs text-[var(--color-dim)]">{s.duration}</span>
                  </span>
                  {price && <span className="text-sm text-[var(--color-mute)]">{price}</span>}
                  <span className="arrow text-[var(--color-dim)] transition group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center text-sm text-[var(--color-dim)]">
          {dict.fallback}{" "}
          <a href={`mailto:${site.email}`} className="text-[var(--color-ivory)] underline decoration-white/20 underline-offset-4 hover:decoration-white">
            {site.email}
          </a>
        </p>
      </div>
    </dialog>
  );
}
