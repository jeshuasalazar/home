"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/i18n";

interface FooterProps {
  dict: {
    rights: string;
    privacy: string;
    built_with: string;
  };
}

export default function Footer({ dict }: FooterProps) {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as Locale;

  return (
    <footer className="w-full border-t border-white/[0.06] bg-zinc-950/40 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-zinc-500 font-sans">
          <div>
            &copy; {new Date().getFullYear()} Jeshua Salazar. {dict.rights}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/${currentLocale}/privacidad`}
              className="hover:text-zinc-300 transition-colors"
            >
              {dict.privacy}
            </Link>
            <span>•</span>
            <span>{dict.built_with}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
