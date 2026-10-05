import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jeshua Salazar",
    short_name: "Jeshua",
    description: "Equipos de agentes de IA que trabajan como empleados.",
    start_url: "/es",
    display: "standalone",
    background_color: "#050506",
    theme_color: "#050506",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
      { src: "/img/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
    ],
  };
}
