import Link from "next/link";
import { locales } from "@/lib/i18n";

const names: Record<string, string> = { es: "Español", en: "English", fr: "Français", de: "Deutsch", ar: "العربية", zh: "中文" };

interface FooterProps {
  locale: string;
  dict: { tagline: string; rights: string; privacy: string };
}

export default function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="col pb-28 pt-16 text-center sm:pb-14">
      <p className="mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--color-label-2)]">{dict.tagline}</p>
      <nav aria-label="Idioma" className="mono mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[0.7rem] uppercase tracking-[0.08em]">
        {locales.map((l) => (
          <Link
            key={l}
            href={`/${l}`}
            hrefLang={l}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "text-[var(--color-label)]" : "text-[var(--color-label-3)] hover:text-[var(--color-label-2)]"}
          >
            {names[l]}
          </Link>
        ))}
      </nav>
      <p className="mono mt-6 text-[0.66rem] uppercase tracking-[0.08em] text-[var(--color-label-3)]">
        © {new Date().getFullYear()} Jeshua Salazar · {dict.rights} ·{" "}
        <Link href={`/${locale}/privacidad`} className="hover:text-[var(--color-label-2)]">
          {dict.privacy}
        </Link>
      </p>
    </footer>
  );
}
