import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, Locale, getDictionary } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/mdx";

export async function generateStaticParams() {
  const CONTENT_PATH = path.join(process.cwd(), "src/content/projects");
  if (!fs.existsSync(CONTENT_PATH)) return [];
  const slugs = fs.readdirSync(CONTENT_PATH).filter((s) => fs.statSync(path.join(CONTENT_PATH, s)).isDirectory());
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  let inList = false;

  return (
    <div className="space-y-4 text-lg leading-relaxed text-[var(--color-label-2)]">
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
            <h4 key={idx} className="mt-8 text-xl font-semibold tracking-tight text-[var(--color-label)]">
              {trimmed.slice(4)}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          inList = false;
          return (
            <h3 key={idx} className="mt-12 text-2xl font-semibold tracking-tight text-[var(--color-label)] first:mt-0">
              {trimmed.slice(3)}
            </h3>
          );
        }
        if (trimmed.startsWith("# ")) {
          inList = false;
          return (
            <h2 key={idx} className="mt-12 text-3xl font-semibold tracking-tight text-[var(--color-label)]">
              {trimmed.slice(2)}
            </h2>
          );
        }

        // Unordered lists
        if (trimmed.startsWith("- ")) {
          inList = true;
          return (
            <div key={idx} className="flex items-start gap-3 ps-1">
              <span className="text-zinc-500 font-mono select-none">&bull;</span>
              <span>{trimmed.slice(2)}</span>
            </div>
          );
        }

        // Paragraph
        inList = false;
        return (
          <p key={idx} >
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
  if (!project) notFound();
  const d = await getDictionary(locale);
  const f = project.frontmatter;

  return (
    <article className="col pb-16 pt-12">
      <Link href={`/${locale}`} className="text-sm text-[var(--color-label-2)] hover:text-white">
        ← {d.cases.back}
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-8 max-w-4xl">{f.title}</h1>
      <p className="leading-relaxed text-[var(--color-label-2)] mt-6 max-w-3xl">{f.summary}</p>

      <div className="mt-16 grid gap-12 ">
        <SimpleMarkdown content={project.content} />
        <aside className="grid content-start gap-4">
          <div className="list p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-label-3)]">{d.cases.problem_label}</p>
            <p className="mt-3 leading-relaxed text-[var(--color-label-2)]">{f.problem}</p>
          </div>
          <div className="list p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-label-3)]">{d.cases.outcomes_label}</p>
            <ul className="mt-3 grid gap-2.5">
              {f.outcomes.map((o) => (
                <li key={o} className="flex gap-3 leading-relaxed">
                  <span className="live-dot mt-2 !size-1.5 shrink-0" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="list p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-label-3)]">{d.cases.tech_label}</p>
            <p className="mt-3 text-sm text-[var(--color-label-2)]">
              {d.cases.role_label} {f.role}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {f.technologies.map((t) => (
                <li key={t} className="rounded-full border border-[var(--color-sep)] px-3 py-1 text-sm text-[var(--color-label-2)]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <a href="#servicios" data-open-booking className="btn btn-primary mt-2">
            {d.hero.cta_book} <span className="arrow" aria-hidden="true">→</span>
          </a>
        </aside>
      </div>
    </article>
  );
}
