"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Locale } from "@/lib/i18n";
import GlassCard from "@/components/GlassCard";

interface ContactClientProps {
  dict: any;
  locale: Locale;
}

export default function ContactClient({ dict, locale }: ContactClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    projectType: "",
    message: "",
    consent: false,
    website: "", // Honeypot
  });

  const [status, setStatus] = useState<{
    type: "idle" | "sending" | "success" | "error_invalid" | "error_bot" | "error_server";
    message?: string;
  }>({ type: "idle" });

  const turnstileWidgetId = useRef<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  // Load Turnstile Script on mount
  useEffect(() => {
    // Check if script is already loaded
    if (!document.getElementById("cloudflare-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cloudflare-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Initialize turnstile widget once script is loaded
    const initTurnstile = () => {
      if ((window as any).turnstile) {
        try {
          const widgetId = (window as any).turnstile.render("#turnstile-container", {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAAxx-XXXXXX-XXXXX", // Fallback test key
            callback: (token: string) => {
              setTurnstileToken(token);
            },
          });
          turnstileWidgetId.current = widgetId;
        } catch (err) {
          console.error("Turnstile render error:", err);
        }
      } else {
        setTimeout(initTurnstile, 500);
      }
    };

    initTurnstile();

    return () => {
      // Clean up widget if needed
      if (turnstileWidgetId.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(turnstileWidgetId.current);
        } catch (e) {}
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset status
    setStatus({ type: "idle" });

    // Validate inputs
    if (!formData.name || !formData.email || !formData.projectType || !formData.message || !formData.consent) {
      setStatus({ type: "error_invalid" });
      return;
    }

    // Check honeypot
    if (formData.website) {
      setStatus({ type: "error_bot" });
      return;
    }

    // Check Turnstile token
    if (!turnstileToken) {
      setStatus({ type: "error_bot" });
      return;
    }

    setStatus({ type: "sending" });

    try {
      const endpoint = process.env.NEXT_PUBLIC_CONTACT_WORKER_URL || "https://contact-worker.jeshuasalazar.workers.dev";
      const payload = {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        projectType: formData.projectType,
        message: formData.message,
        consent: formData.consent,
        turnstileToken: turnstileToken,
        website: formData.website,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus({ type: "success" });
        setFormData({
          name: "",
          email: "",
          organization: "",
          projectType: "",
          message: "",
          consent: false,
          website: "",
        });
        // Reset turnstile
        if (turnstileWidgetId.current && (window as any).turnstile) {
          (window as any).turnstile.reset(turnstileWidgetId.current);
          setTurnstileToken("");
        }
      } else {
        if (data.code === "BOT_REJECTED" || data.code === "INVALID_INPUT") {
          setStatus({ type: "error_bot" });
        } else {
          setStatus({ type: "error_server" });
        }
        // Reset turnstile to try again
        if (turnstileWidgetId.current && (window as any).turnstile) {
          (window as any).turnstile.reset(turnstileWidgetId.current);
          setTurnstileToken("");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus({ type: "error_server" });
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8"
      >
        <div className="text-center md:text-start">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
            {dict.contact.title}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            {dict.contact.subtitle}
          </p>
        </div>

        <GlassCard level="default" spotlight={true} className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field (hidden from user) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Name input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {dict.contact.name} <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300"
                />
              </div>

              {/* Email input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {dict.contact.email} <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@company.com"
                  className="w-full bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Organization input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="organization" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {dict.contact.organization}
                </label>
                <input
                  id="organization"
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g. Acme Inc."
                  className="w-full bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300"
                />
              </div>

              {/* Project Type dropdown */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="projectType" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {dict.contact.projectType} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full appearance-none bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 cursor-pointer"
                  >
                    <option value="" disabled className="bg-zinc-950">
                      {dict.contact.projectType_placeholder}
                    </option>
                    <option value="producto" className="bg-zinc-950">{dict.contact.projectType_product}</option>
                    <option value="automatizacion" className="bg-zinc-950">{dict.contact.projectType_automation}</option>
                    <option value="ia" className="bg-zinc-950">{dict.contact.projectType_ia}</option>
                    <option value="colaboracion" className="bg-zinc-950">{dict.contact.projectType_colab}</option>
                    <option value="otro" className="bg-zinc-950">{dict.contact.projectType_other}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Message input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {dict.contact.message} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Briefly describe your objectives, the problem you're trying to solve..."
                className="w-full bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300 resize-y"
              />
            </div>

            {/* Consent checkbox */}
            <div className="flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                name="consent"
                required
                checked={formData.consent}
                onChange={handleChange}
                className="w-4 h-4 rounded border-white/10 bg-zinc-950/60 text-white accent-white focus:ring-0 focus:ring-offset-0 mt-0.5 cursor-pointer"
              />
              <label htmlFor="consent" className="text-xs text-zinc-400 leading-normal select-none cursor-pointer">
                {dict.contact.consent}
              </label>
            </div>

            {/* Turnstile widget container */}
            <div className="flex justify-center sm:justify-start">
              <div id="turnstile-container" className="min-h-[65px]" />
            </div>

            {/* Status Messages */}
            {status.type === "success" && (
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 leading-relaxed">
                {dict.contact.success}
              </div>
            )}
            {status.type === "error_invalid" && (
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 leading-relaxed">
                {dict.contact.error_invalid}
              </div>
            )}
            {status.type === "error_bot" && (
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 leading-relaxed">
                {dict.contact.error_bot}
              </div>
            )}
            {status.type === "error_server" && (
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 leading-relaxed">
                {dict.contact.error_server}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={status.type === "sending"}
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors duration-300 shadow-md cursor-pointer ${
                  status.type === "sending" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {status.type === "sending" ? dict.contact.sending : dict.contact.submit}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
