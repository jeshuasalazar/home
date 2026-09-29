import Link from "next/link";
import { site } from "@/lib/site";

interface FooterProps {
  locale: string;
  dict: { tagline: string; rights: string; privacy: string; built_with: string };
}

export default function Footer({ locale, dict }: FooterProps) {
  return (
    <footer className="hairline-top mt-auto pb-24 pt-14 sm:pb-12">
      <div className="wrap flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="serif text-3xl sm:text-4xl">{dict.tagline}</p>
          <p className="mt-4 text-sm text-[var(--color-dim)]">
            © {new Date().getFullYear()} Jeshua Salazar · {dict.rights} · {dict.built_with}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-mute)]">
          <li>
            <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
          </li>
          <li>
            <a href={site.linkedin} target="_blank" rel="noopener" className="hover:text-white">LinkedIn</a>
          </li>
          <li>
            <a href={site.ailearning} target="_blank" rel="noopener" className="hover:text-white">aiLearning</a>
          </li>
          <li>
            <Link href={`/${locale}/privacidad`} className="hover:text-white">{dict.privacy}</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
