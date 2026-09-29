"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import { Calendar, Check, Copy } from "./Icons";

interface ActionsProps {
  dict: { cta_book: string; copy_email: string; copied: string };
}

// Botones principales del encabezado + la isla flotante que aparece al bajar
// (solo en móvil) + el aviso de "correo copiado".
export default function Actions({ dict }: ActionsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      window.location.href = `mailto:${site.email}`;
      return;
    }
    setCopied(true);
    navigator.vibrate?.(10);
    setTimeout(() => setCopied(false), 1800);
  }, []);

  const book = (
    <a
      href="#servicios"
      data-open-booking
      className="btn btn-primary flex-1 !px-3 !tracking-[0.1em] sm:flex-none sm:!px-5 sm:!tracking-[0.14em]"
    >
      <Calendar className="size-[1.1rem]" />
      {dict.cta_book}
    </a>
  );
  const copyBtn = (
    <button
      type="button"
      onClick={copy}
      className="btn btn-glass flex-1 !px-3 !tracking-[0.1em] sm:flex-none sm:!px-5 sm:!tracking-[0.14em]"
    >
      <Copy className="size-[1.1rem]" />
      {dict.copy_email}
    </button>
  );

  return (
    <>
      <div ref={ref} className="flex w-full gap-2.5 sm:w-auto">
        {book}
        {copyBtn}
      </div>

      {mounted &&
        createPortal(
          <>
            <div className="island sm:hidden" data-hidden={inView}>
              {book}
              <button
                type="button"
                onClick={copy}
                className="btn btn-glass !px-3.5"
                aria-label={dict.copy_email}
              >
                <Copy className="size-[1.1rem]" />
              </button>
            </div>

            <output className="toast" data-show={copied} aria-live="polite">
              <Check className="size-4 text-[#30d158]" />
              {dict.copied}
            </output>
          </>,
          document.body,
        )}
    </>
  );
}
