import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = await getDictionary(locale as Locale);
  return { title: d.aboutPage.kicker, description: d.about.bio };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const d = await getDictionary(locale);
  const a = d.aboutPage;

  return (
    <article className="wrap pb-28 pt-36 sm:pt-44">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <div>
          <p className="kicker">{a.kicker}</p>
          <h1 className="title mt-5">{a.title}</h1>
        </div>
        <div className="panel aspect-square overflow-hidden lg:row-span-2">
          <picture>
            <source type="image/avif" srcSet="/img/retrato-640.avif 640w, /img/retrato-1000.avif 1000w" sizes="(min-width: 64rem) 40vw, 100vw" />
            <img
              src="/img/retrato-1000.webp"
              srcSet="/img/retrato-640.webp 640w, /img/retrato-1000.webp 1000w"
              sizes="(min-width: 64rem) 40vw, 100vw"
              alt="Jeshua Salazar"
              width={1000}
              height={977}
              fetchPriority="high"
              className="h-full w-full object-cover object-top"
            />
          </picture>
        </div>
        <div className="grid gap-6 text-lg leading-relaxed text-[var(--color-mute)]">
          {a.paragraphs.map((p) => (
            <p key={p.slice(0, 32)} className="reveal">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-24 grid gap-12 lg:grid-cols-2">
        <section>
          <p className="kicker">{a.factsTitle}</p>
          <dl className="mt-8">
            {a.facts.map((f) => (
              <div key={f.k} className="hairline-top grid gap-1 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="text-sm text-[var(--color-dim)]">{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <p className="kicker">{a.certsTitle}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {a.certs.map((c) => (
              <li key={c} className="rounded-full border border-[var(--hairline)] px-4 py-2 text-[var(--color-mute)]">
                {c}
              </li>
            ))}
          </ul>
          <a href="#servicios" data-open-booking className="btn btn-light mt-12">
            {a.cta} <span className="arrow" aria-hidden="true">→</span>
          </a>
        </section>
      </div>
    </article>
  );
}
