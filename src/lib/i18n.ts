import type es from "../dictionaries/es.json";

export const locales = ["es", "en", "fr", "de", "ar", "zh"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof es;

export const defaultLocale: Locale = "en";

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("../dictionaries/es.json").then((m) => m.default),
  en: () => import("../dictionaries/en.json").then((m) => m.default as unknown as Dictionary),
  fr: () => import("../dictionaries/fr.json").then((m) => m.default as unknown as Dictionary),
  de: () => import("../dictionaries/de.json").then((m) => m.default as unknown as Dictionary),
  ar: () => import("../dictionaries/ar.json").then((m) => m.default as unknown as Dictionary),
  zh: () => import("../dictionaries/zh.json").then((m) => m.default as unknown as Dictionary),
};

// Rellena con inglés cualquier clave que falte en una traducción.
function merge<T>(base: T, over: unknown): T {
  if (Array.isArray(base) || typeof base !== "object" || base === null) {
    return (over ?? base) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  const o = (over ?? {}) as Record<string, unknown>;
  for (const k of Object.keys(o)) out[k] = merge((base as Record<string, unknown>)[k], o[k]);
  return out as T;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (!locales.includes(locale)) return dictionaries[defaultLocale]();
  if (locale === defaultLocale) return dictionaries[locale]();
  const [base, dict] = await Promise.all([dictionaries[defaultLocale](), dictionaries[locale]()]);
  return merge(base, dict);
}
