import type { Metadata, Viewport } from "next";
import { Barlow, JetBrains_Mono } from "next/font/google";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { getDictionary, isRTL, type Locale, locales } from "@/lib/i18n";
import { alternates } from "@/lib/seo";
import { type ServiceId, site } from "@/lib/site";
import "../globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-barlow", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

const ogLocale: Record<string, string> = { es: "es_MX", en: "en_US", fr: "fr_FR", de: "de_DE", ar: "ar_AR", zh: "zh_CN" };

// Valores por defecto; cada página define su canónica y hreflang.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: "%s · Jeshua Salazar" },
    description: dict.meta.description,
    applicationName: "Jeshua Salazar",
    authors: [{ name: "Jeshua Salazar", url: site.url }],
    creator: "Jeshua Salazar",
    alternates: alternates(locale),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: {
      type: "profile",
      firstName: "Jeshua",
      lastName: "Salazar",
      url: `/${locale}`,
      siteName: "Jeshua Salazar",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/img/og.jpg", width: 1200, height: 630, alt: "Jeshua Salazar" }],
      locale: ogLocale[locale] ?? locale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description, images: ["/img/og.jpg"] },
    ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } } : {}),
  };
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const services = dict.services.items.map((s) => ({ id: s.id as ServiceId, name: s.name, desc: s.desc }));

  const person = `${site.url}/#jeshua`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": person,
        name: "Jeshua Salazar",
        url: site.url,
        image: `${site.url}/img/retrato-1000.webp`,
        jobTitle: dict.hero.role,
        description: dict.meta.description,
        email: `mailto:${site.email}`,
        sameAs: [site.linkedin, site.github, "https://cal.com/jeshuasalazar"],
        worksFor: { "@type": "Organization", name: "aiLearning", url: site.ailearning },
        alumniOf: { "@type": "CollegeOrUniversity", name: "Instituto Politécnico Nacional", url: "https://www.ipn.mx" },
        address: { "@type": "PostalAddress", addressLocality: "Ciudad de México", addressCountry: "MX" },
        knowsLanguage: ["es", "en", "fr", "de"],
        knowsAbout: ["Inteligencia artificial", "Agentes de IA", "Automatización de procesos", "IA generativa", "Claude Code", "Social Commerce"],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "Jeshua Salazar",
        inLanguage: locales,
        publisher: { "@id": person },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#servicios`,
        name: "Jeshua Salazar · Agentes de IA para empresas",
        url: `${site.url}/${locale}`,
        image: `${site.url}/img/og.jpg`,
        email: site.email,
        founder: { "@id": person },
        areaServed: [{ "@type": "Country", name: "México" }, "Latinoamérica"],
        address: { "@type": "PostalAddress", addressLocality: "Ciudad de México", addressCountry: "MX" },
        priceRange: "$$",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: dict.services.label,
          itemListElement: dict.services.items.map((s) => {
            const id = s.id as ServiceId;
            const price = id === "diagnostico" ? "0" : id === "estrategia" ? "3900" : null;
            return {
              "@type": "Offer",
              url: site.booking[id] ?? `${site.url}/${locale}/contacto`,
              ...(price ? { price, priceCurrency: "MXN" } : {}),
              itemOffered: { "@type": "Service", name: s.name, description: s.desc, provider: { "@id": person } },
            };
          }),
        },
      },
    ],
  };

  return (
    <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"} className={`${barlow.variable} ${mono.variable} antialiased`}>
      <body className="relative isolate flex min-h-svh flex-col overflow-x-clip">
        <Starfield />
        <main id="contenido" className="flex flex-grow flex-col">
          {children}
        </main>
        <Footer locale={locale} dict={dict.footer} />
        <Booking locale={locale} dict={dict.booking} services={services} />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD estático, con "<" escapado */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
