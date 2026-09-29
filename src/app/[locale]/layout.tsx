import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import { getDictionary, isRTL, type Locale, locales } from "@/lib/i18n";
import { type ServiceId, site } from "@/lib/site";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-display",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · Jeshua Salazar` },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: "Jeshua Salazar",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/img/og.jpg", width: 1200, height: 630 }],
      locale,
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description, images: ["/img/og.jpg"] },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jeshua Salazar",
    url: site.url,
    image: `${site.url}/img/retrato-1000.webp`,
    jobTitle: dict.hero.role,
    email: `mailto:${site.email}`,
    sameAs: [site.linkedin],
    worksFor: { "@type": "Organization", name: "aiLearning", url: site.ailearning },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Instituto Politécnico Nacional" },
    makesOffer: dict.services.items.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: s.desc },
    })),
  };

  return (
    <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"} className={`${inter.variable} ${serif.variable} antialiased`}>
      <body className="relative isolate flex min-h-svh flex-col overflow-x-clip">
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
