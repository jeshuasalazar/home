export const locales = ["es", "en", "fr", "de", "ar", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}

const dictionaries = {
  es: () => import("../dictionaries/es.json").then((module) => module.default),
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  fr: () => import("../dictionaries/fr.json").then((module) => module.default),
  de: () => import("../dictionaries/de.json").then((module) => module.default),
  ar: () => import("../dictionaries/ar.json").then((module) => module.default),
  zh: () => import("../dictionaries/zh.json").then((module) => module.default),
};

export async function getDictionary(locale: Locale) {
  if (!locales.includes(locale)) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
}
