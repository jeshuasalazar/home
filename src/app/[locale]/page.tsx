import { Locale, getDictionary } from "@/lib/i18n";
import HomeClient from "./HomeClient";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);


  return <HomeClient dict={dict} locale={locale} />;
}
