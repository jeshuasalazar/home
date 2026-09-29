import Picture from "@/components/Picture";
import { getDictionary, type Locale } from "@/lib/i18n";
import { bookingHref, type ServiceId, site } from "@/lib/site";

const orb = (n: number) => ({ "--c": `var(--color-orb-${n})` }) as React.CSSProperties;
const mascots = ["nexo", "talen", "vecto", "orion", "zenit"] as const;

function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      →
    </span>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const d = await getDictionary(locale);
  const words = d.manifesto.text.split(" ");

  return (
    <>
      {/* ───────── Hero: el horizonte ───────── */}
      <section className="hero">
        <div className="hero-media hero-out">
          <Picture name="horizonte" alt="" mobile priority className="ignite block h-full" imgClassName="h-full" />
        </div>

        <div className="wrap pb-[max(4rem,10svh)] pt-32">
          <p className="rise kicker" style={{ "--d": 0 } as React.CSSProperties}>
            {d.hero.role}
          </p>
          <h1 className="display mt-6 text-[clamp(3.1rem,10.5vw,9.5rem)]">
            <span className="rise block" style={{ "--d": 1 } as React.CSSProperties}>
              {d.hero.title_a}
            </span>
            <span className="rise serif block text-[var(--color-glow)]" style={{ "--d": 2 } as React.CSSProperties}>
              {d.hero.title_b}
            </span>
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,34rem)_1fr] md:items-end">
            <p className="rise lede" style={{ "--d": 3 } as React.CSSProperties}>
              {d.hero.description}
            </p>
            <div className="rise flex flex-col gap-3 sm:flex-row md:justify-end" style={{ "--d": 4 } as React.CSSProperties}>
              <a href="#servicios" data-open-booking className="btn btn-light">
                {d.hero.cta_book} <Arrow />
              </a>
              <a href="#servicios" className="btn btn-ghost">
                {d.hero.cta_services}
              </a>
            </div>
          </div>
          <p className="rise mt-5 text-sm text-[var(--color-dim)] md:text-end" style={{ "--d": 5 } as React.CSSProperties}>
            <span className="orb me-2 inline-block !size-1.5 align-middle" style={orb(5)} aria-hidden="true" />
            {d.hero.note}
          </p>
        </div>
      </section>

      {/* ───────── Manifiesto: las palabras se encienden al avanzar ───────── */}
      <section id="filosofia" className="manifesto" aria-labelledby="manifiesto">
        <div className="manifesto-inner">
          <div className="wrap">
            <p className="kicker">{d.manifesto.kicker}</p>
            <h2 id="manifiesto" className="mt-8 max-w-5xl text-[clamp(2rem,5.2vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.035em]">
              {words.map((w, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: las palabras pueden repetirse; el orden es fijo
                <span key={`${w}-${i}`} className="word" style={{ "--p": Math.round((i / words.length) * 88) } as React.CSSProperties}>
                  {w}{" "}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </section>

      <section className="wrap pb-28 sm:pb-40" aria-label={d.manifesto.kicker}>
        <ol className="grid gap-px overflow-hidden rounded-[1.75rem] border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-3">
          {d.manifesto.principles.map((p, i) => (
            <li key={p.title} className="reveal spot relative isolate bg-[var(--color-ink)] p-8 sm:p-10">
              <span className="serif text-5xl text-[var(--color-dim)]">0{i + 1}</span>
              <h3 className="mt-10 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--color-mute)]">{p.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────── Tu nuevo equipo: cinco esferas ───────── */}
      <section className="relative pb-28 sm:pb-40" aria-labelledby="equipo">
        <div className="relative overflow-hidden">
          <Picture name="equipo" alt="" mobile className="parallax fade-edges block" imgClassName="aspect-[4/5] w-full object-cover sm:aspect-[21/9]" />
          <div className="wrap absolute inset-x-0 top-0 pt-8 sm:pt-16">
            <p className="kicker">{d.team.kicker}</p>
            <h2 id="equipo" className="title reveal mt-5 max-w-3xl">
              {d.team.title}
            </h2>
          </div>
        </div>
        <div className="wrap">
          <p className="lede reveal -mt-4 max-w-2xl sm:mt-0">{d.team.subtitle}</p>
        </div>
        <ul className="snap-row mx-auto mt-12 max-w-[76rem] lg:px-[var(--gutter)]">
          {d.team.roles.map((r, i) => (
            <li key={r.name} className="panel spot reveal p-6">
              <span className="orb block" style={orb(i + 1)} aria-hidden="true" />
              <h3 className="mt-8 text-lg font-semibold tracking-tight">{r.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--color-mute)]">{r.does}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── Resultados ───────── */}
      <section className="wrap pb-28 sm:pb-40" aria-labelledby="resultados">
        <p className="kicker">{d.proof.kicker}</p>
        <h2 id="resultados" className="title reveal mt-5 max-w-4xl">
          {d.proof.title}
        </h2>
        <dl className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {d.proof.items.map((it) => (
            <div key={it.value} className="reveal">
              <div className="grow-line mb-6 h-px bg-gradient-to-r from-[var(--color-glow)] to-transparent" />
              <dt className="display text-[clamp(3rem,6vw,4.75rem)]">{it.value}</dt>
              <dd className="mt-3 leading-relaxed text-[var(--color-mute)]">{it.label}</dd>
              <dd className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--color-dim)]">{it.source}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ───────── Servicios: la propuesta de valor ───────── */}
      <section id="servicios" className="wrap scroll-mt-24 pb-28 sm:pb-40" aria-labelledby="servicios-t">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="kicker">{d.services.kicker}</p>
            <h2 id="servicios-t" className="title reveal mt-5">
              {d.services.title}
            </h2>
          </div>
          <p className="lede reveal md:justify-self-end md:max-w-md">{d.services.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {d.services.items.map((s, i) => {
            const id = s.id as ServiceId;
            const featured = id === "estrategia";
            const href = bookingHref(id, locale);
            const external = href.startsWith("http");
            const price = site.prices[id] ?? (id === "diagnostico" ? d.booking.free : null);
            return (
              <article
                key={s.id}
                className={`panel spot reveal flex flex-col p-7 sm:p-9 ${featured ? "border-[var(--hairline-strong)] lg:-my-4 lg:py-12" : ""}`}
              >
                {featured && (
                  <>
                    <Picture name="esfera" alt="" className="absolute inset-0 -z-10 block opacity-40" imgClassName="h-full w-full object-cover" sizes="(min-width: 64rem) 33vw, 100vw" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/30 via-[var(--color-ink)]/70 to-[var(--color-ink)]" />
                  </>
                )}
                <div className="flex items-center justify-between gap-4">
                  <span className="orb" style={orb(i + 1)} aria-hidden="true" />
                  {featured && (
                    <span className="rounded-full border border-[var(--hairline-strong)] px-3 py-1 text-xs text-[var(--color-glow)]">{d.services.featured}</span>
                  )}
                </div>
                <h3 className="mt-10 text-2xl font-semibold tracking-tight">{s.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-dim)]">{s.duration}</p>
                <p className="mt-5 leading-relaxed text-[var(--color-mute)]">{s.desc}</p>
                <ul className="mt-6 grid gap-2.5 text-[0.95rem]">
                  {s.includes.map((inc) => (
                    <li key={inc} className="flex gap-3">
                      <svg viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-[var(--color-glow)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {inc}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-10">
                  {price && <p className="mb-4 text-3xl font-semibold tracking-tight">{price}</p>}
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    className={`btn w-full ${featured ? "btn-light" : "btn-ghost"}`}
                  >
                    {s.cta} <Arrow />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="panel spot reveal mt-4 flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="max-w-2xl">
            <h3 className="text-xl font-semibold tracking-tight">{d.services.extra_title}</h3>
            <p className="mt-2 leading-relaxed text-[var(--color-mute)]">{d.services.extra_desc}</p>
          </div>
          <a href={`/${locale}/contacto?tipo=conferencia#formulario`} className="btn btn-ghost shrink-0">
            {d.services.extra_cta} <Arrow />
          </a>
        </div>
      </section>

      {/* ───────── Método ───────── */}
      <section className="wrap pb-28 sm:pb-40" aria-labelledby="metodo">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker">{d.method.kicker}</p>
            <h2 id="metodo" className="title reveal mt-5">
              {d.method.title}
            </h2>
            <div className="panel mt-10 overflow-hidden">
              <Picture name="red" alt="" className="parallax block" imgClassName="aspect-[16/10] w-full object-cover" sizes="(min-width: 64rem) 50vw, 100vw" width={2048} height={1152} />
            </div>
          </div>
          <ol className="grid">
            {d.method.steps.map((s, i) => (
              <li key={s.name} className="reveal hairline-top grid grid-cols-[4rem_1fr] gap-4 py-10 first:border-t-0 first:pt-0 lg:first:pt-24">
                <span className="serif text-4xl text-[var(--color-dim)]">0{i + 1}</span>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">{s.name}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-[var(--color-mute)]">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── aiLearning ───────── */}
      <section id="ailearning" className="wrap scroll-mt-24 pb-28 sm:pb-40" aria-labelledby="ailearning-t">
        <div className="panel reveal relative px-6 py-14 sm:px-14 sm:py-20" style={{ background: "radial-gradient(120% 90% at 85% 0%, color-mix(in oklch, var(--color-ail-lavender) 22%, transparent), transparent 60%), radial-gradient(90% 80% at 0% 100%, color-mix(in oklch, var(--color-ail-blue) 16%, transparent), transparent 60%), var(--color-ail-navy)" }}>
          <p className="kicker">{d.ailearning.kicker}</p>
          <h2 id="ailearning-t" className="title mt-5 max-w-3xl">
            {d.ailearning.title}
          </h2>
          <p className="serif mt-6 text-3xl text-[var(--color-ail-blue)] sm:text-4xl">“{d.ailearning.motto}”</p>
          <p className="lede mt-6 max-w-2xl">{d.ailearning.desc}</p>

          <ul className="mt-12 grid grid-cols-5 gap-2 sm:gap-6">
            {mascots.map((m, i) => (
              <li key={m} className="flex flex-col items-center text-center">
                {/* biome-ignore lint/performance/noImgElement: export estático, imágenes ya optimizadas */}
                <img src={`/img/ailearning/${m}-200.webp`} alt={m} width={200} height={200} loading="lazy" className="w-full max-w-28 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[var(--ease-apple)] hover:-translate-y-2" />
                <span className="mt-3 text-[0.55rem] uppercase tracking-[0.02em] text-[var(--color-mute)] sm:text-xs sm:tracking-[0.18em]">{d.ailearning.levels[i]}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <a href={site.ailearning} target="_blank" rel="noopener" className="btn btn-light">
              {d.ailearning.cta} <span aria-hidden="true">↗</span>
            </a>
            <a href={`/${locale}/contacto?tipo=formacion#formulario`} className="btn btn-ghost">
              {d.ailearning.cta_teams}
            </a>
          </div>
        </div>
      </section>

      {/* ───────── Quién soy ───────── */}
      <section className="wrap pb-28 sm:pb-40" aria-labelledby="quien">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-20">
          <div className="reveal panel aspect-[4/5] overflow-hidden">
            <picture>
              <source type="image/avif" srcSet="/img/retrato-640.avif 640w, /img/retrato-1000.avif 1000w" sizes="(min-width: 64rem) 40vw, 100vw" />
              <img
                src="/img/retrato-1000.webp"
                srcSet="/img/retrato-640.webp 640w, /img/retrato-1000.webp 1000w"
                sizes="(min-width: 64rem) 40vw, 100vw"
                alt="Jeshua Salazar"
                width={1000}
                height={977}
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </picture>
          </div>
          <div>
            <p className="kicker">{d.about.kicker}</p>
            <h2 id="quien" className="title reveal mt-5">
              {d.about.title}
            </h2>
            <p className="mt-3 text-[var(--color-glow)]">{d.about.role}</p>
            <p className="lede reveal mt-6">{d.about.bio}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {d.about.creds.map((c) => (
                <li key={c} className="rounded-full border border-[var(--hairline)] px-3.5 py-1.5 text-sm text-[var(--color-mute)]">
                  {c}
                </li>
              ))}
            </ul>
            <a href={`/${locale}/sobre-mi`} className="btn btn-ghost mt-10">
              {d.about.cta} <Arrow />
            </a>
          </div>
        </div>

        <p className="kicker mt-20">{d.about.stage}</p>
        <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          {["escenario-1", "escenario-2", "escenario-3"].map((n) => (
            <li key={n} className="panel reveal aspect-[4/3] overflow-hidden">
              <picture>
                <source type="image/avif" srcSet={`/img/${n}.avif`} />
                <img src={`/img/${n}.webp`} alt="" width={1200} height={900} loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0" />
              </picture>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="faq wrap pb-28 sm:pb-40" aria-labelledby="faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <p id="faq" className="kicker self-start">
            {d.faq.kicker}
          </p>
          <div>
            {d.faq.items.map((f) => (
              <details key={f.q} className="hairline-top group py-6 last:border-b last:border-[var(--hairline)]">
                <summary className="flex items-center justify-between gap-6 text-lg font-medium tracking-tight sm:text-xl">
                  {f.q}
                  <span className="plus grid size-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)] text-[var(--color-mute)]" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pt-4 leading-relaxed text-[var(--color-mute)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Cierre: la puerta ───────── */}
      <section className="relative isolate grid min-h-[100svh] items-start overflow-hidden pt-[16svh] text-center" aria-labelledby="final">
        <Picture name="puerta" alt="" mobile className="parallax absolute inset-0 -z-10 block" imgClassName="h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)] via-transparent to-[var(--color-ink)]" />
        <div className="wrap reveal">
          <h2 id="final" className="display text-[clamp(2.75rem,8vw,7rem)]">
            {d.final.title}
          </h2>
          <p className="lede mx-auto mt-6 max-w-xl">{d.final.subtitle}</p>
          <a href="#servicios" data-open-booking className="btn btn-light mt-10">
            {d.final.cta} <Arrow />
          </a>
          <p className="mt-6 text-sm text-[var(--color-mute)]">
            {d.final.or}{" "}
            <a href={`mailto:${site.email}`} className="text-[var(--color-ivory)] underline decoration-white/25 underline-offset-4 hover:decoration-white">
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
