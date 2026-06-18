import { Inter } from "next/font/google";
import { Locale, isRTL, getDictionary } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return [
    { locale: "es" },
    { locale: "en" },
    { locale: "fr" },
    { locale: "de" },
    { locale: "ar" },
    { locale: "zh" },
  ];
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
  const dir = isRTL(locale) ? "rtl" : "ltr";
  const dict = await getDictionary(locale);


  return (
    <html lang={locale} dir={dir} className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-black text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans overflow-x-hidden relative">
        {/* Background Visual Layers (System Visual 5 Layers) */}
        <div className="atmosphere-layer" aria-hidden="true">
          <div className="atmosphere-glow-1" />
          <div className="atmosphere-glow-2" />
        </div>
        <div className="grid-overlay" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar dict={dict.nav} />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer dict={dict.footer} />
        </div>
      </body>
    </html>
  );
}
