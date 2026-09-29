import { Locale } from "@/lib/i18n";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const content = {
    es: {
      title: "Política de Privacidad",
      subtitle: "Transparencia total sobre tus datos.",
      body: "Esta política detalla cómo manejamos tus datos. Solo recopilamos la información que proporcionas voluntariamente a través del formulario de contacto (nombre, correo, mensaje) con el único fin de responder a tu solicitud. No utilizamos cookies de rastreo ni compartimos tus datos con terceros. Toda la información se transmite de forma cifrada (HTTPS) y es procesada por Cloudflare y Resend únicamente para la entrega del correo electrónico.",
    },
    en: {
      title: "Privacy Policy",
      subtitle: "Total transparency about your data.",
      body: "This policy details how we handle your data. We only collect information that you voluntarily provide through the contact form (name, email, message) for the sole purpose of responding to your request. We do not use tracking cookies or share your data with third parties. All information is transmitted securely (HTTPS) and is processed by Cloudflare and Resend solely for email delivery.",
    },
    fr: {
      title: "Politique de Confidentialité",
      subtitle: "Transparence totale concernant vos données.",
      body: "Cette politique détaille comment nous traitons vos données. Nous ne collectons que les informations que vous fournissez volontairement via le formulaire de contact (nom, adresse e-mail, message) dans le seul but de répondre à votre demande. Nous n'utilisons pas de cookies de suivi et ne partageons pas vos données avec des tiers. Toutes les informations sont transmises de manière sécurisée (HTTPS) et sont traitées par Cloudflare et Resend uniquement pour la livraison des e-mails.",
    },
    de: {
      title: "Datenschutzerklärung",
      subtitle: "Volle Transparenz über Ihre Daten.",
      body: "Diese Richtlinie beschreibt, wie wir mit Ihren Daten umgehen. Wir erfassen nur Informationen, die Sie uns freiwillig über das Kontaktformular mitteilen (Name, E-Mail-Adresse, Nachricht), ausschließlich zum Zweck der Beantwortung Ihrer Anfrage. Wir verwenden keine Tracking-Cookies und geben Ihre Daten nicht an Dritte weiter. Alle Informationen werden verschlüsselt (HTTPS) übertragen und von Cloudflare und Resend nur zum Zwecke der E-Mail-Zustellung verarbeitet.",
    },
    ar: {
      title: "سياسة الخصوصية",
      subtitle: "شفافية كاملة حول بياناتك.",
      body: "توضح هذه السياسة كيفية التعامل مع بياناتك. نحن نجمع فقط المعلومات التي تقدمها طواعية من خلال نموذج الاتصال (الاسم، البريد الإلكتروني، الرسالة) لغرض وحيد وهو الرد على طلبك. نحن لا نستخدم ملفات تعريف الارتباط للتتبع ولا نشارك بياناتك مع أطراف ثالثة. يتم نقل جميع المعلومات بشكل مشفر وآمن (HTTPS) ويتم معالجتها بواسطة Cloudflare و Resend فقط لتسليم البريد الإلكتروني.",
    },
    zh: {
      title: "隐私政策",
      subtitle: "关于您数据完全透明。",
      body: "本政策详细说明了我们如何处理您的数据。我们仅收集您通过联系表单自愿提供的信息（姓名、电子邮件、信息），其唯一目的是回复您的请求。我们不使用追踪 Cookie，也不与第三方共享您的数据。所有信息均通过加密（HTTPS）安全传输，并仅由 Cloudflare 和 Resend 处理用于发送电子邮件。",
    },
  }[locale] || {
    title: "",
    subtitle: "",
    body: "",
  };

  return (
    <div className="col pb-24 pt-20">
      <div className="flex flex-col gap-8">
        <div className="text-center md:text-start">
          <h1 className="text-3xl font-semibold tracking-tight">
            {content.title}
          </h1>
          <p className="text-sm text-[var(--color-label-3)] mt-2 leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        <div className="list p-6">
          <p className="text-sm text-[var(--color-label-2)] leading-relaxed">
            {content.body}
          </p>
        </div>
      </div>
    </div>
  );
}
