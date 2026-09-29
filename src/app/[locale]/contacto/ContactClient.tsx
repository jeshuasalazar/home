"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

interface ContactClientProps {
  dict: Dictionary;
  locale: Locale;
}

type Turnstile = {
  render: (el: string, opts: { sitekey: string; theme?: string; callback: (t: string) => void }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
const turnstile = () => (window as unknown as { turnstile?: Turnstile }).turnstile;

const TYPES = ["diagnostico", "estrategia", "implementacion", "formacion", "conferencia", "other"] as const;

export default function ContactClient({ dict }: ContactClientProps) {
  const c = dict.contact;
  const empty = { name: "", email: "", organization: "", projectType: "", message: "", consent: false, website: "" };
  const [formData, setFormData] = useState(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error_invalid" | "error_bot" | "error_server">("idle");
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");

  // Preselecciona el tipo cuando se llega desde un botón (?tipo=estrategia)
  useEffect(() => {
    const tipo = new URLSearchParams(window.location.search).get("tipo");
    if (tipo && (TYPES as readonly string[]).includes(tipo)) setFormData((p) => ({ ...p, projectType: tipo }));
  }, []);

  useEffect(() => {
    if (!document.getElementById("cloudflare-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cloudflare-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    let timer: ReturnType<typeof setTimeout>;
    const init = () => {
      const ts = turnstile();
      if (!ts) {
        timer = setTimeout(init, 500);
        return;
      }
      try {
        widgetId.current = ts.render("#turnstile-container", {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
          theme: "dark",
          callback: setToken,
        });
      } catch (err) {
        console.error("Turnstile render error:", err);
      }
    };
    init();
    return () => {
      clearTimeout(timer);
      if (widgetId.current) {
        try {
          turnstile()?.remove(widgetId.current);
        } catch {}
      }
    };
  }, []);

  const resetTurnstile = () => {
    if (widgetId.current) {
      turnstile()?.reset(widgetId.current);
      setToken("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.projectType || !formData.message || !formData.consent) {
      setStatus("error_invalid");
      return;
    }
    if (formData.website || !token) {
      setStatus("error_bot");
      return;
    }
    setStatus("sending");
    try {
      const endpoint = process.env.NEXT_PUBLIC_CONTACT_WORKER_URL || "https://contact-worker.jeshuasalazar.workers.dev";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken: token }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
        setFormData(empty);
      } else {
        setStatus(data.code === "BOT_REJECTED" || data.code === "INVALID_INPUT" ? "error_bot" : "error_server");
      }
      resetTurnstile();
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error_server");
    }
  };

  const labels: Record<(typeof TYPES)[number], string> = {
    diagnostico: c.projectType_diagnostico,
    estrategia: c.projectType_estrategia,
    implementacion: c.projectType_implementacion,
    formacion: c.projectType_formacion,
    conferencia: c.projectType_conferencia,
    other: c.projectType_other,
  };

  const messages = {
    success: ["text-emerald-300 border-emerald-400/20 bg-emerald-400/5", c.success],
    error_invalid: ["text-amber-200 border-amber-300/20 bg-amber-300/5", c.error_invalid],
    error_bot: ["text-rose-200 border-rose-300/20 bg-rose-300/5", c.error_bot],
    error_server: ["text-rose-200 border-rose-300/20 bg-rose-300/5", c.error_server],
  } as const;
  const msg = status in messages ? messages[status as keyof typeof messages] : null;

  return (
    <section className="wrap pb-28 pt-36 sm:pt-44">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <p className="kicker">{dict.nav.contact}</p>
          <h1 className="title mt-5">{c.title}</h1>
          <p className="lede mt-6">{c.subtitle}</p>

          <p className="mt-12 text-xs uppercase tracking-[0.18em] text-[var(--color-dim)]">{c.direct}</p>
          <ul className="mt-4 grid gap-2 text-lg">
            <li>
              <a href={`mailto:${site.email}`} className="underline decoration-white/20 underline-offset-4 hover:decoration-white">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener" className="underline decoration-white/20 underline-offset-4 hover:decoration-white">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <form id="formulario" onSubmit={handleSubmit} className="panel grid scroll-mt-28 gap-5 p-6 sm:p-10" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--color-mute)]">
              {c.name} *
              <input type="text" name="name" autoComplete="name" required value={formData.name} onChange={handleChange} className="field" />
            </label>
            <label className="grid gap-2 text-sm text-[var(--color-mute)]">
              {c.email} *
              <input type="email" name="email" autoComplete="email" inputMode="email" required value={formData.email} onChange={handleChange} className="field" />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-[var(--color-mute)]">
            {c.organization}
            <input type="text" name="organization" autoComplete="organization" value={formData.organization} onChange={handleChange} className="field" />
          </label>
          <label className="grid gap-2 text-sm text-[var(--color-mute)]">
            {c.projectType} *
            <select name="projectType" required value={formData.projectType} onChange={handleChange} className="field">
              <option value="" disabled>
                {c.projectType_placeholder}
              </option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {labels[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-[var(--color-mute)]">
            {c.message} *
            <textarea name="message" rows={5} required value={formData.message} onChange={handleChange} className="field resize-y" />
          </label>

          {/* Honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
          </div>

          <label className="flex items-start gap-3 text-sm text-[var(--color-mute)]">
            <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="mt-1 size-4 accent-[var(--color-glow)]" />
            {c.consent}
          </label>

          <div id="turnstile-container" className="min-h-[65px]" />

          {msg && (
            <output className={`block rounded-2xl border px-4 py-3 text-sm ${msg[0]}`}>{msg[1]}</output>
          )}

          <button type="submit" disabled={status === "sending"} className="btn btn-light w-full disabled:opacity-60">
            {status === "sending" ? c.sending : c.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
