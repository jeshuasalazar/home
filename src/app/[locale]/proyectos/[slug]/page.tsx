import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, Locale, getDictionary } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/mdx";
import GlassCard from "@/components/GlassCard";

export async function generateStaticParams() {
  const CONTENT_PATH = path.join(process.cwd(), "src/content/projects");
  if (!fs.existsSync(CONTENT_PATH)) return [];

  const projectDirs = fs.readdirSync(CONTENT_PATH);
  const params: Array<{ locale: Locale; slug: string }> = [];

  for (const slug of projectDirs) {
    const dirPath = path.join(CONTENT_PATH, slug);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    for (const locale of locales) {
      const mdxPath = path.join(dirPath, `${locale}.mdx`);
      if (fs.existsSync(mdxPath)) {
        params.push({ locale, slug });
      }
    }
  }

  return params;
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  let inList = false;

  return (
    <div className="text-zinc-300 text-sm leading-relaxed space-y-4">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Skip empty lines or render small spacer
        if (!trimmed) {
          inList = false;
          return <div key={idx} className="h-1" />;
        }

        // Headers
        if (trimmed.startsWith("### ")) {
          inList = false;
          return (
            <h4 key={idx} className="text-sm font-bold text-white uppercase tracking-wider mt-6 mb-2">
              {trimmed.slice(4)}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          inList = false;
          return (
            <h3 key={idx} className="text-base font-bold text-white uppercase tracking-wider mt-8 mb-3 border-b border-white/5 pb-2">
              {trimmed.slice(3)}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          inList = false;
          return (
            <h2 key={idx} className="text-lg font-bold text-white mt-10 mb-4">
              {trimmed.slice(2)}
            </h2>
          );
        }

        // Unordered lists
        if (trimmed.startsWith("- ")) {
          inList = true;
          return (
            <div key={idx} className="flex gap-2 items-start ps-4 text-xs">
              <span className="text-zinc-500 font-mono select-none">&bull;</span>
              <span>{trimmed.slice(2)}</span>
            </div>
          );
        }

        // Paragraph
        inList = false;
        return (
          <p key={idx} className="text-zinc-300">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const project = getProjectBySlug(slug, locale);


  if (!project) {
    notFound();
  }

  // Localized navigation & labels
  const content = {
    es: {
      back: "← Volver a Proyectos",
      role: "Rol",
      year: "Año",
      problem: "El Reto de Negocio",
      impact: "Resultados / Impacto",
      tech: "Stack Utilizado",
      evidence: "Evidencia / Enlaces",
    },
    en: {
      back: "← Back to Projects",
      role: "Role",
      year: "Year",
      problem: "The Business Challenge",
      impact: "Results / Impact",
      tech: "Tech Stack",
      evidence: "Evidence / Links",
    },
    fr: {
      back: "← Retour aux Projets",
      role: "Rôle",
      year: "Année",
      problem: "Le Défi Commercial",
      impact: "Résultats / Impact",
      tech: "Technologies Utilisées",
      evidence: "Preuves / Liens",
    },
    de: {
      back: "← Zurück zu Projekten",
      role: "Rolle",
      year: "Jahr",
      problem: "Die geschäftliche Herausforderung",
      impact: "Ergebnisse / Wirkung",
      tech: "Tech-Stack",
      evidence: "Nachweise / Links",
    },
    ar: {
      back: "← العودة إلى المشاريع",
      role: "الدور",
      year: "السنة",
      problem: "تحدي الأعمال",
      impact: "النتائج والأثر",
      tech: "التقنيات المستخدمة",
      evidence: "الإثباتات والروابط",
    },
    zh: {
      back: "← 返回项目列表",
      role: "角色",
      year: "年份",
      problem: "业务挑战",
      impact: "成果 / 影响",
      tech: "技术栈",
      evidence: "凭证 / 链接",
    },
  }[locale] || {
    back: "",
    role: "",
    year: "",
    problem: "",
    impact: "",
    tech: "",
    evidence: "",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-col gap-8">
        {/* Back Link */}
        <div>
          <Link
            href={`/${locale}/proyectos`}
            className="text-xs text-zinc-500 hover:text-white uppercase tracking-wider transition-colors"
          >
            {content.back}
          </Link>
        </div>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.frontmatter.title}
            </h1>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
              {project.frontmatter.summary}
            </p>
          </div>
          <div className="flex gap-3 text-[10px] uppercase font-semibold tracking-wider">
            <span className="px-2.5 py-1 rounded border border-white/10 bg-white/5 text-zinc-300">
              {content.year}: {project.frontmatter.year}
            </span>
            <span className="px-2.5 py-1 rounded border border-white/10 bg-white/5 text-zinc-300">
              {content.role}: {project.frontmatter.role}
            </span>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content (Markdown body) */}
          <div className="col-span-1 md:col-span-2">
            <GlassCard level="default" className="p-6 sm:p-8">
              <SimpleMarkdown content={project.content} />
            </GlassCard>
          </div>

          {/* Sidebar (Problem, Impact, Tech) */}
          <div className="col-span-1 flex flex-col gap-6">
            {/* The Business Challenge */}
            <GlassCard level="default" className="p-6 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                {content.problem}
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {project.frontmatter.problem}
              </p>
            </GlassCard>

            {/* Outcomes / Impact */}
            <GlassCard level="featured" className="p-6 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                {content.impact}
              </h3>
              <ul className="space-y-3">
                {project.frontmatter.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-[11px] text-zinc-200">
                    <span className="text-emerald-500 font-bold font-mono">✓</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Technologies */}
            <GlassCard level="default" className="p-6 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                {content.tech}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.frontmatter.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-zinc-950 border border-white/5 text-[9px] text-zinc-400 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Evidence Links */}
            {project.frontmatter.evidenceLinks && project.frontmatter.evidenceLinks.length > 0 && (
              <GlassCard level="default" className="p-6 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                  {content.evidence}
                </h3>
                <div className="flex flex-col gap-2">
                  {project.frontmatter.evidenceLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-zinc-400 hover:text-white underline transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
