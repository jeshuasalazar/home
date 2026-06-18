"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  dict: {
    home: string;
    projects: string;
    about: string;
    contact: string;
  };
}

export default function Navbar({ dict }: NavbarProps) {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as Locale;

  // Function to build localized path
  const localizedPath = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  // Check if link is active
  const isActive = (path: string) => {
    const fullPath = localizedPath(path);
    if (path === "") {
      return pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;
    }
    return pathname.startsWith(fullPath);
  };

  const navItems = [
    { name: dict.home, path: "" },
    { name: dict.projects, path: "/proyectos" },
    { name: dict.about, path: "/sobre-mi" },
    { name: dict.contact, path: "/contacto" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center">
            <Link
              href={localizedPath("")}
              className="text-sm font-semibold tracking-wider text-white hover:opacity-80 transition-opacity uppercase font-sans"
            >
              Jeshua Salazar
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path === "" ? localizedPath("") : localizedPath(item.path)}
                className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                  isActive(item.path)
                    ? "text-white border-b-2 border-white/80 pb-1 pt-1.5"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {/* Mobile menu trigger button */}
            <button
              type="button"
              className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => {
                const mobileNav = document.getElementById("mobile-nav");
                mobileNav?.classList.toggle("hidden");
              }}
              aria-label="Toggle navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <div id="mobile-nav" className="hidden md:hidden border-b border-white/[0.06] bg-zinc-950/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
        <div className="space-y-1 px-4 py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path === "" ? localizedPath("") : localizedPath(item.path)}
              onClick={() => {
                document.getElementById("mobile-nav")?.classList.add("hidden");
              }}
              className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
