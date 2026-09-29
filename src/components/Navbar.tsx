"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  locale: string;
  dict: {
    philosophy: string;
    services: string;
    ailearning: string;
    projects: string;
    about: string;
    book: string;
    menu: string;
  };
}

export default function Navbar({ locale, dict }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú al navegar
  // biome-ignore lint/correctness/useExhaustiveDependencies: se reinicia por ruta
  useEffect(() => setOpen(false), [pathname]);

  const home = `/${locale}`;
  const items = [
    { name: dict.philosophy, href: `${home}#filosofia` },
    { name: dict.services, href: `${home}#servicios` },
    { name: dict.ailearning, href: `${home}#ailearning` },
    { name: dict.projects, href: `${home}/proyectos` },
    { name: dict.about, href: `${home}/sobre-mi` },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          data-scrolled={scrolled || open}
          className="nav-pill mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full ps-4 pe-1.5 sm:gap-4 sm:ps-5 sm:pe-2"
        >
          <Link href={home} className="flex items-center gap-2.5 whitespace-nowrap text-[0.95rem] font-semibold tracking-tight" aria-label="Jeshua Salazar">
            <span className="orb breathe" style={{ "--c": "var(--color-glow)" } as React.CSSProperties} aria-hidden="true" />
            Jeshua Salazar
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="text-sm text-[var(--color-mute)] transition-colors hover:text-white">
                {it.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <a href={`${home}#servicios`} data-open-booking className="btn btn-light hidden !min-h-10 !px-4 text-sm sm:inline-flex">
              {dict.book}
            </a>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-[var(--color-mute)] transition hover:text-white lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={dict.menu}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 9h16M4 15h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <nav
          id="menu-movil"
          hidden={!open}
          className="mx-auto mt-2 max-w-6xl rounded-[1.75rem] border border-[var(--hairline)] bg-[color-mix(in_oklch,var(--color-ink-2)_92%,transparent)] p-3 backdrop-blur-2xl lg:hidden"
          aria-label={dict.menu}
        >
          {items.map((it) => (
            <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3.5 text-lg tracking-tight transition hover:bg-white/5">
              {it.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Botón fijo en móvil: agendar siempre a un toque */}
      <div data-visible={pastHero && !open} className="mobile-cta fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <a href={`${home}#servicios`} data-open-booking className="btn btn-light w-full shadow-2xl shadow-black/60">
          {dict.book}
          <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}
