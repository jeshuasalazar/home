import { Locale, getDictionary } from "@/lib/i18n";
import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import ContactClient from "./ContactClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = await getDictionary(locale as Locale);
  return { title: `${d.nav.contact} · ${d.hero.cta_book}`, description: d.contact.subtitle, alternates: alternates(locale, "/contacto") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);


  return <ContactClient dict={dict} locale={locale} />;
}
