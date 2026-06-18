import { describe, it, expect } from "vitest";
import { isRTL, locales, getDictionary } from "../lib/i18n";

describe("Internationalization (i18n) Helpers", () => {
  it("should identify RTL languages correctly", () => {
    expect(isRTL("ar")).toBe(true);
    expect(isRTL("en")).toBe(false);
    expect(isRTL("es")).toBe(false);
    expect(isRTL("fr")).toBe(false);
    expect(isRTL("de")).toBe(false);
    expect(isRTL("zh")).toBe(false);
  });

  it("should contain all 6 pentalingual/hexalingual locales", () => {
    expect(locales).toContain("es");
    expect(locales).toContain("en");
    expect(locales).toContain("fr");
    expect(locales).toContain("de");
    expect(locales).toContain("ar");
    expect(locales).toContain("zh");
    expect(locales.length).toBe(6);
  });

  it("should load dictionaries correctly for each locale", async () => {
    for (const locale of locales) {
      const dict = await getDictionary(locale);
      expect(dict).toBeDefined();
      expect(dict.nav).toBeDefined();
      expect(dict.nav.home).toBeTypeOf("string");
      expect(dict.hero).toBeDefined();
      expect(dict.hero.role).toBeTypeOf("string");
      expect(dict.contact).toBeDefined();
      expect(dict.contact.submit).toBeTypeOf("string");
    }
  });
});
