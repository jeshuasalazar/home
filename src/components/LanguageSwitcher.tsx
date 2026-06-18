"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale, locales } from "@/lib/i18n";
import GlassCard from "./GlassCard";

const languageNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  ar: "العربية",
  zh: "中文",
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract current locale from pathname (e.g. "/es/proyectos" -> "es")
  const currentLocale = (pathname.split("/")[1] || "en") as Locale;

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle locale switch
  const handleLocaleChange = (locale: Locale) => {
    setIsOpen(false);
    const segments = pathname.split("/");
    // Replace current locale (first segment after domain)
    segments[1] = locale;
    const newPathname = segments.join("/");
    router.push(newPathname);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-start">
      <button
        onClick={toggleDropdown}
        type="button"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-zinc-900/60 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/20 hover:bg-zinc-900/80 transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Globe icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3.5 h-3.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4-9m0 18c-1.18 0-2.062-4.03-2.062-9s.882-9 2.062-9m0 18h-.062m0 0H8.25m3.75 0V3m-9 12a9.004 9.004 0 0 1 6.747-8.716M21 15a9.004 9.004 0 0 0-6.747-8.716M21 9a9.004 9.004 0 0 0-6.747-8.716M3 9a9.004 9.004 0 0 1 6.747-8.716"
          />
        </svg>
        <span className="uppercase tracking-wider">{currentLocale}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 start-auto mt-2 w-36 origin-top-right z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <GlassCard level="featured" spotlight={false} className="p-1.5 border-white/10 shadow-2xl">
            <div className="py-1 flex flex-col gap-0.5" role="menu" aria-orientation="vertical">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className={`w-full text-start px-3 py-1.5 text-xs rounded-lg transition-all duration-200 cursor-pointer ${
                    currentLocale === locale
                      ? "bg-white/10 text-white font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                  role="menuitem"
                >
                  {languageNames[locale]}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
