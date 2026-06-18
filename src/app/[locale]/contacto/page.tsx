import { Locale, getDictionary } from "@/lib/i18n";
import ContactClient from "./ContactClient";

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
