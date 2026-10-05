import fs from "node:fs";
import path from "node:path";
import { locales } from "./i18n";
import { site } from "./site";

// Canónica + hreflang para una ruta (sin prefijo de idioma, p. ej. "/contacto").
// x-default apunta a español, el idioma principal del sitio.
export function alternates(locale: string, route = "") {
  return {
    canonical: `${site.url}/${locale}${route}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${route}`])),
      "x-default": `${site.url}/es${route}`,
    },
  };
}

export function caseSlugs(): string[] {
  const dir = path.join(process.cwd(), "src/content/projects");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((s) => fs.statSync(path.join(dir, s)).isDirectory());
}
