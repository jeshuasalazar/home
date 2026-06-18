import Link from "next/link";
import { Locale, getDictionary } from "@/lib/i18n";
import { getProjects } from "@/lib/mdx";
import GlassCard from "@/components/GlassCard";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const projects = getProjects(locale);

  // Localized texts for projects catalog
  const content = {
    es: {
      title: "Casos de Estudio",
      subtitle: "Proyectos reales con métricas de rendimiento verificables.",
      view_project: "Ver Detalles",
      role_label: "Rol:",
      year_label: "Año:",
    },
    en: {
      title: "Case Studies",
      subtitle: "Real-world projects with verifiable business metrics.",
      view_project: "View Details",
      role_label: "Role:",
      year_label: "Year:",
    },
    fr: {
      title: "Études de Cas",
      subtitle: "Projets réels avec des métriques de performance vérifiables.",
      view_project: "Voir Détails",
      role_label: "Rôle:",
      year_label: "Année:",
    },
    de: {
      title: "Fallstudien",
      subtitle: "Reale Projekte mit nachweisbaren Geschäftskennzahlen.",
      view_project: "Details anzeigen",
      role_label: "Rolle:",
      year_label: "Jahr:",
    },
    ar: {
      title: "دراسات الحالة",
      subtitle: "مشاريع حقيقية مع مؤشرات أداء قابلة للتحقق.",
      view_project: "عرض التفاصيل",
      role_label: "الدور:",
      year_label: "السنة:",
    },
    zh: {
      title: "案例研究",
      subtitle: "具有可验证业务指标的真实项目。",
      view_project: "查看详情",
      role_label: "角色:",
      year_label: "年份:",
    },
  }[locale] || {
    title: "",
    subtitle: "",
    view_project: "",
    role_label: "",
    year_label: "",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project.frontmatter.slug}
              href={`/${locale}/proyectos/${project.frontmatter.slug}`}
              className="group block"
            >
              <GlassCard
                level={project.frontmatter.featured ? "featured" : "default"}
                interactive={true}
                className="p-6 sm:p-8 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h2 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors tracking-tight">
                      {project.frontmatter.title}
                    </h2>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-400">
                      {project.frontmatter.year}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {project.frontmatter.summary}
                  </p>

                  {/* Outcome points */}
                  <ul className="space-y-2 mb-6">
                    {project.frontmatter.outcomes.slice(0, 2).map((outcome, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-[11px] text-zinc-300">
                        <span className="text-emerald-500 font-bold font-mono">✓</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {/* Meta details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-500 border-t border-white/5 pt-4 mb-4">
                    <span>
                      <strong className="text-zinc-400 font-medium">{content.role_label}</strong>{" "}
                      {project.frontmatter.role}
                    </span>
                  </div>

                  {/* Technologies tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.frontmatter.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-[9px] text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
