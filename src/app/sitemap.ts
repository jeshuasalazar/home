import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { alternates, caseSlugs } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { route: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
    { route: "", priority: 1, freq: "weekly" },
    { route: "/contacto", priority: 0.8, freq: "monthly" },
    ...caseSlugs().map((s) => ({ route: `/proyectos/${s}`, priority: 0.7, freq: "monthly" as const })),
    { route: "/privacidad", priority: 0.2, freq: "yearly" },
  ];
  const lastModified = new Date();
  return routes.flatMap(({ route, priority, freq }) =>
    locales.map((l) => ({
      url: alternates(l, route).canonical,
      lastModified,
      changeFrequency: freq,
      priority: l === "es" ? priority : Math.round(priority * 0.8 * 10) / 10,
      alternates: { languages: alternates(l, route).languages },
    })),
  );
}
