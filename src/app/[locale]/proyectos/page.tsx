import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/mdx";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = await getDictionary(locale as Locale);
  return { title: d.cases.kicker, description: d.cases.subtitle };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const d = await getDictionary(locale);
  const projects = getProjects(locale);

  return (
    <section className="wrap pb-28 pt-36 sm:pt-44">
      <p className="kicker">{d.cases.kicker}</p>
      <h1 className="title mt-5 max-w-4xl">{d.cases.title}</h1>
      <p className="lede mt-6 max-w-2xl">{d.cases.subtitle}</p>

      <ol className="mt-16 grid gap-4">
        {projects.map((p, i) => {
          const f = p.frontmatter;
          return (
            <li key={f.slug}>
              <Link href={`/${locale}/proyectos/${f.slug}`} className="panel spot reveal group grid gap-8 p-7 sm:p-10 md:grid-cols-[4rem_1fr_auto] md:items-start">
                <span className="serif text-5xl text-[var(--color-dim)]">0{i + 1}</span>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{f.title}</h2>
                  <p className="mt-3 max-w-3xl leading-relaxed text-[var(--color-mute)]">{f.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {f.outcomes.slice(0, 2).map((o) => (
                      <li key={o} className="rounded-full border border-[var(--hairline)] px-3.5 py-1.5 text-sm text-[var(--color-ivory)]">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="btn btn-ghost self-end md:self-start">
                  {d.cases.read} <span className="arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
