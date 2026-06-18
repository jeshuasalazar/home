import { Locale, getDictionary } from "@/lib/i18n";
import GlassCard from "@/components/GlassCard";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);


  // Content for the about page based on locale
  const content = {
    es: {
      title: "Trayectoria y Filosofía",
      subtitle: "Construyendo la infraestructura de la automatización empresarial.",
      p1: "Soy un ingeniero de software apasionado por resolver problemas reales de negocio a través de la tecnología. No creo en escribir código por escribirlo; creo en el software como una herramienta directa para aumentar el flujo de caja, reducir las ineficiencias y liberar a los humanos de las tareas mecánicas.",
      p2: "Mi enfoque combina el desarrollo web moderno full-stack con integraciones de Inteligencia Artificial avanzadas (modelos de lenguaje, agentes autónomos y sistemas de recuperación de datos tipo RAG) para diseñar flujos que operen sin fricciones.",
      skillsTitle: "Especialización Técnica",
      experienceTitle: "Enfoque de Negocio",
      exp1_title: "1. Retorno de Inversión (ROI)",
      exp1_desc: "Cada línea de código y automatización debe justificar su costo mediante horas de trabajo ahorradas o aumento directo de la productividad.",
      exp2_title: "2. Estabilidad Serverless",
      exp2_desc: "Uso arquitecturas modernas que escalan automáticamente de cero a millones de peticiones, garantizando que pagues $0/mes en infraestructura si no hay tráfico.",
      exp3_title: "3. Simplicidad Operativa",
      exp3_desc: "Interfaces limpias, sin dependencias innecesarias que comprometan el rendimiento de carga o la seguridad a largo plazo.",
    },
    en: {
      title: "Trajectory & Philosophy",
      subtitle: "Building the infrastructure of enterprise automation.",
      p1: "I am a software engineer passionate about solving real business problems through technology. I don't believe in writing code for its own sake; I believe in software as a direct tool to increase cash flow, reduce inefficiencies, and free humans from mechanical tasks.",
      p2: "My approach combines modern full-stack web development with advanced Artificial Intelligence integrations (large language models, autonomous agents, and RAG retrieval systems) to design seamless workflows.",
      skillsTitle: "Technical Specialization",
      experienceTitle: "Business Focus",
      exp1_title: "1. Return on Investment (ROI)",
      exp1_desc: "Every line of code and automation must justify its cost by saving work hours or directly increasing productivity.",
      exp2_title: "2. Serverless Stability",
      exp2_desc: "I use modern architectures that automatically scale from zero to millions of requests, ensuring you pay $0/month in infrastructure if there's no traffic.",
      exp3_title: "3. Operational Simplicity",
      exp3_desc: "Clean interfaces without unnecessary dependencies that compromise load performance or long-term security.",
    },
    fr: {
      title: "Trajectoire & Philosophie",
      subtitle: "Construire l'infrastructure de l'automatisation d'entreprise.",
      p1: "Je suis un ingénieur logiciel passionné par la résolution de problèmes commerciaux réels grâce à la technologie. Je ne crois pas à l'écriture de code pour le plaisir; je crois que le logiciel est un outil direct pour augmenter le flux de trésorerie, réduire les inefficacités et libérer les humains des tâches mécaniques.",
      p2: "Mon approche combine le développement web full-stack moderne avec des intégrations avancées d'Intelligence Artificielle (modèles de langage, agents autonomes et systèmes de récupération RAG) pour concevoir des flux de travail fluides.",
      skillsTitle: "Spécialisation Technique",
      experienceTitle: "Approche Commerciale",
      exp1_title: "1. Retour sur Investissement (ROI)",
      exp1_desc: "Chaque ligne de code et d'automatisation doit justifier son coût par des heures de travail économisées ou une augmentation directe de la productivité.",
      exp2_title: "2. Stabilité Serverless",
      exp2_desc: "J'utilise des architectures modernes qui s'adaptent automatiquement de zéro à des millions de requêtes, vous garantissant de payer 0 €/mois si le trafic est nul.",
      exp3_title: "3. Simplicité Opérationnelle",
      exp3_desc: "Des interfaces épurées sans dépendances inutiles qui compromettent les performances de chargement ou la sécurité à long terme.",
    },
    de: {
      title: "Werdegang & Philosophie",
      subtitle: "Aufbau der Infrastruktur für Unternehmensautomatisierung.",
      p1: "Ich bin ein Softwareentwickler, der leidenschaftlich gerne reale Geschäftsprobleme durch Technologie löst. Ich glaube nicht daran, Code um des Codes willen zu schreiben; Ich sehe Software als direktes Werkzeug, um den Cashflow zu steigern, Ineffizienzen abzubauen und Menschen von mechanischen Aufgaben zu befreien.",
      p2: "Mein Ansatz kombiniert moderne Full-Stack-Webentwicklung mit fortschrittlichen Integrationen künstlicher Intelligenz (Sprachmodelle, autonome Agenten und RAG-Retrieval-Systeme), um nahtlose Workflows zu entwerfen.",
      skillsTitle: "Technische Spezialisierung",
      experienceTitle: "Geschäftsfokus",
      exp1_title: "1. Return on Investment (ROI)",
      exp1_desc: "Jede Zeile Code und Automatisierung muss ihre Kosten rechtfertigen, indem sie Arbeitsstunden einspart oder die Produktivität direkt steigert.",
      exp2_title: "2. Serverlose Stabilität",
      exp2_desc: "Ich verwende moderne Architekturen, die automatisch von Null auf Millionen von Anfragen skalieren. Dadurch zahlen Sie 0 €/Monat für Infrastruktur, wenn kein Datenverkehr vorhanden ist.",
      exp3_title: "3. Operative Einfachheit",
      exp3_desc: "Klare Oberflächen ohne unnötige Abhängigkeiten, die Ladeleistung oder langfristige Sicherheit beeinträchtigen.",
    },
    ar: {
      title: "المسار والمنهجية",
      subtitle: "بناء البنية التحتية لأتمتة الشركات.",
      p1: "أنا مهندس برمجيات شغوف بحل مشكلات العمل الحقيقية من خلال التكنولوجيا. لا أؤمن بكتابة الأكواد من أجل الكتابة فقط؛ بل أؤمن بالبرمجيات كأداة مباشرة لزيادة التدفقات النقدية، وتقليل عدم الكفاءة، وتحرير البشر من المهام الآلية المتكررة.",
      p2: "يجمع أسلوبي بين تطوير الويب الحديث المتكامل وتكاملات الذكاء الاصطناعي المتقدمة (نماذج اللغة الكبيرة، الوكلاء المستقلون، وأنظمة استرجاع البيانات المعززة RAG) لتصميم سير عمل سلس.",
      skillsTitle: "التخصص التقني",
      experienceTitle: "التركيز على الأعمال",
      exp1_title: "١. العائد على الاستثمار (ROI)",
      exp1_desc: "يجب أن تبرر كل أتمتة أو سطر برمجيات تكلفته من خلال توفير ساعات العمل أو زيادة الإنتاجية بشكل مباشر.",
      exp2_title: "٢. استقرار الأنظمة بدون خوادم",
      exp2_desc: "أستخدم بنيات برمجية حديثة تتوسع تلقائياً من الصفر إلى ملايين الطلبات، مما يضمن دفع 0 دولار شهرياً في حال عدم وجود زيارات.",
      exp3_title: "٣. البساطة التشغيلية",
      exp3_desc: "واجهات نظيفة خالية من المكتبات غير الضرورية التي تؤثر على سرعة التحميل أو الأمان على المدى الطويل.",
    },
    zh: {
      title: "职业轨迹与哲学",
      subtitle: "构建企业自动化基础设施。",
      p1: "我是一名热衷于通过技术解决实际业务问题的软件工程师。我不相信为了写代码而写代码；我坚信软件是增加现金流、减少效率低下以及将人类从机械任务中解放出来的直接工具。",
      p2: "我的方法将现代全栈网页开发与先进的人工智能集成（大型语言模型、自主代理和 RAG 检索系统）相结合，设计出无缝的工作流程。",
      skillsTitle: "技术专业领域",
      experienceTitle: "业务关注点",
      exp1_title: "1. 投资回报率 (ROI)",
      exp1_desc: "每一行代码和自动化工作流都必须通过节省工时或直接提高生产力来证明其成本的合理性。",
      exp2_title: "2. 无服务器（Serverless）稳定性",
      exp2_desc: "我使用现代架构，可自动从零扩展到数百万次请求，确保在没有流量时您无需支付任何基础设施费用（0 美元/月）。",
      exp3_title: "3. 运营简单性",
      exp3_desc: "干净整洁的界面，没有影响加载性能或长期安全性的不必要的依赖项。",
    },
  }[locale] || {
    title: "",
    subtitle: "",
    p1: "",
    p2: "",
    skillsTitle: "",
    experienceTitle: "",
    exp1_title: "",
    exp1_desc: "",
    exp2_title: "",
    exp2_desc: "",
    exp3_title: "",
    exp3_desc: "",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="text-center md:text-start max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
            {content.title}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Biography Card */}
          <div className="col-span-1 md:col-span-2">
            <GlassCard level="default" className="p-6 sm:p-8 h-full flex flex-col gap-6">
              <p className="text-sm text-zinc-300 leading-relaxed">{content.p1}</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{content.p2}</p>
              
              <div className="border-t border-white/5 pt-6 mt-auto">
                <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-4">
                  {content.skillsTitle}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-zinc-300">
                    Next.js (App Router)
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-zinc-300">
                    Node.js & Go
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-zinc-300">
                    Cloudflare Workers & Pages
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-zinc-300">
                    Gemini / OpenAI API
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-zinc-300">
                    LangChain & LlamaIndex
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-zinc-300">
                    RAG Databases (Pinecone / Pgvector)
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-zinc-300">
                    CI/CD & GitHub Actions
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Business Values Sidebar Card */}
          <div className="col-span-1">
            <GlassCard level="featured" className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-sm font-bold tracking-wider text-white uppercase border-b border-white/5 pb-3">
                  {content.experienceTitle}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                      {content.exp1_title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {content.exp1_desc}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-1 pt-2">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                      {content.exp2_title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {content.exp2_desc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 pt-2">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                      {content.exp3_title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {content.exp3_desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-[9px] text-zinc-600">
                Jeshua Salazar &bull; AI Integration &bull; 2026
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
