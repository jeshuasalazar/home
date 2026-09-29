import { siClaude, siCloudflare, siGithub, siNextdotjs, siStripe, siSupabase } from "simple-icons";
import Actions from "@/components/Actions";
import { serviceIcons } from "@/components/serviceMeta";
import Clock from "@/components/Clock";
import CodeScene from "@/components/CodeScene";
import { Chevron, LinkedIn, Mail } from "@/components/Icons";
import { getDictionary, type Locale } from "@/lib/i18n";
import { bookingHref, type ServiceId, site } from "@/lib/site";

// Escenas de Trabajo: imagen base en gris + lugar para el HUD.
const scenes: Record<string, { img: string; place: string }> = {
  "plataforma-operada-con-agentes": { img: "ailearning", place: "CDMX" },
  "pemex-simop": { img: "pemex", place: "CDMX" },
  "talent-land": { img: "talentland", place: "GDL" },
};

// Herramientas del Dock. Higgsfield y Codex no tienen logo libre: van como monograma.
const stack: { name: string; path?: string; mono?: string }[] = [
  { name: "Claude Code", path: siClaude.path },
  { name: "Codex", mono: "Cx" },
  { name: "Higgsfield", mono: "H" },
  { name: "Next.js", path: siNextdotjs.path },
  { name: "Supabase", path: siSupabase.path },
  { name: "Stripe", path: siStripe.path },
  { name: "Cloudflare", path: siCloudflare.path },
  { name: "GitHub", path: siGithub.path },
];

// Convierte [texto](url) en enlaces.
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return m ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: el orden del texto es fijo
          <a key={i} href={m[2]} target="_blank" rel="noopener" className="prose-link">
            {m[1]}
          </a>
        ) : (
          p
        );
      })}
    </>
  );
}

const vars = (o: Record<string, string | number>) => o as React.CSSProperties;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const d = await getDictionary(locale);

  return (
    <div className="relative">
      {/* La línea de luz (Higgsfield) detrás del encabezado */}
      <div className="horizon" aria-hidden="true">
        <picture>
          <source media="(max-width: 40rem)" type="image/avif" srcSet="/img/horizonte-movil.avif" />
          <source type="image/avif" srcSet="/img/horizonte-1280.avif 1280w, /img/horizonte-2400.avif 2016w" />
          <img src="/img/horizonte-1280.webp" alt="" fetchPriority="high" width={2016} height={864} />
        </picture>
      </div>

      <header className="col flex flex-col items-center pt-14 text-center sm:pt-20">
        <p className="chip enter" style={vars({ "--i": 0 })}>
          <span className="live-dot" aria-hidden="true" />
          {d.hero.location} · 19.43°N 99.13°W · <Clock locale={locale} />
        </p>

        <div className="avatar enter mt-8" style={vars({ "--i": 1 })}>
          <picture>
            <source type="image/avif" srcSet="/img/retrato-640.avif" />
            <img src="/img/retrato-640.webp" alt="Jeshua Salazar" width={640} height={625} className="size-full object-cover object-top" />
          </picture>
        </div>

        <h1 className="enter caps mt-6 ps-[0.3em] text-[1.05rem] font-semibold tracking-[0.3em]" style={vars({ "--i": 2 })}>
          Jeshua Salazar
        </h1>
        <p className="enter mono mt-1.5 text-[0.72rem] text-[var(--color-label-3)]" style={vars({ "--i": 2 })}>
          {d.hero.role}
        </p>

        <p className="enter mt-7 max-w-lg text-[clamp(1.45rem,5.6vw,2rem)] font-medium uppercase leading-[1.12] tracking-[0.02em]" style={vars({ "--i": 3 })}>
          {d.hero.tagline_a} <span className="cursor font-light text-[var(--color-label-2)]">{d.hero.tagline_b}</span>
        </p>

        <div className="enter mt-8 flex w-full justify-center" style={vars({ "--i": 4 })}>
          <Actions dict={d.hero} />
        </div>

        <ul className="enter mt-5 flex items-center gap-1" style={vars({ "--i": 5 })}>
          <li>
            <a href={site.linkedin} target="_blank" rel="noopener" className="icon-btn" aria-label="LinkedIn">
              <LinkedIn className="size-[1.05rem]" />
            </a>
          </li>
          <li>
            <a href={site.github} target="_blank" rel="noopener" className="icon-btn" aria-label="GitHub">
              <svg viewBox="0 0 24 24" className="size-[1.1rem]" fill="currentColor" aria-hidden="true">
                <path d={siGithub.path} />
              </svg>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="icon-btn" aria-label={site.email}>
              <Mail className="size-[1.15rem]" />
            </a>
          </li>
          <li>
            <a href={site.ailearning} target="_blank" rel="noopener" className="icon-btn mono !w-auto px-3 text-[0.7rem] uppercase tracking-[0.1em]" aria-label="aiLearning">
              aiLearning ↗
            </a>
          </li>
        </ul>
      </header>

      <div className="col mt-16 grid grid-cols-[minmax(0,1fr)] gap-14 sm:mt-20">
        {/* Sobre mí */}
        <section aria-labelledby="sobre-mi" className="reveal">
          <h2 id="sobre-mi" className="label mb-3 px-1">
            <span className="text-[var(--color-label-2)]">01</span> {d.about.label}
          </h2>
          <div className="grid gap-4 px-1 text-[1.06rem] font-light leading-relaxed text-[var(--color-label-2)]">
            {d.about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>
                <Rich text={p} />
              </p>
            ))}
          </div>
        </section>

        {/* Servicios: lista agrupada */}
        <section id="servicios" aria-labelledby="servicios-t" className="reveal scroll-mt-8">
          <h2 id="servicios-t" className="label mb-3 px-1">
            <span className="text-[var(--color-label-2)]">02</span> {d.services.label}
          </h2>
          <div className="list">
            {d.services.items.map((s) => {
              const id = s.id as ServiceId;
              const Icon = serviceIcons[id];
              const href = bookingHref(id, locale);
              const external = href.startsWith("http");
              const price = site.prices[id] ?? (id === "diagnostico" ? d.services.free : id === "implementacion" ? d.services.quote : null);
              return (
                <a key={id} href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})} className="row">
                  <span className="tile">
                    <Icon className="size-[1.1rem]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.92rem] font-medium uppercase tracking-[0.06em]">{s.name}</span>
                    <span className="mono mt-0.5 block text-[0.7rem] leading-snug text-[var(--color-label-3)]">{s.desc}</span>
                  </span>
                  {price && <span className="mono shrink-0 text-[0.72rem] uppercase text-[var(--color-label-2)]">{price}</span>}
                  <Chevron className="chev size-4 shrink-0" />
                </a>
              );
            })}
          </div>
        </section>

        {/* Trabajo: tarjetas deslizables */}
        <section aria-labelledby="trabajo" className="reveal">
          <h2 id="trabajo" className="label mb-3 px-1">
            <span className="text-[var(--color-label-2)]">03</span> {d.work.label}
          </h2>
          <ul className="rail">
            {d.work.items.map((w, i) => (
              <li key={w.slug}>
                <a href={`/${locale}/proyectos/${w.slug}`} className="card h-full">
                  <div className="scene">
                    <CodeScene src={`/img/escenas/${scenes[w.slug].img}.jpg`} className="absolute inset-0 size-full" />
                    <span className="hud start-3 top-2.5">
                      {String(i + 1).padStart(2, "0")} · {w.tag}
                    </span>
                    <span className="hud end-3 top-2.5">
                      <span className="rec" aria-hidden="true" />
                      {scenes[w.slug].place}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="mono text-[0.66rem] uppercase tracking-[0.12em] text-[var(--color-label-3)]">{w.tag}</p>
                    <p className="mt-1.5 text-[0.92rem] font-medium uppercase leading-snug tracking-[0.04em]">{w.title}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Herramientas: Dock */}
        <section aria-labelledby="stack" className="reveal">
          <h2 id="stack" className="label mb-5 px-1">
            <span className="text-[var(--color-label-2)]">04</span> {d.stack.label}
          </h2>
          <div className="pt-10">
            <ul className="dock">
              {stack.map((t) => (
                <li key={t.name}>
                  <span className="app" title={t.name}>
                    {t.path ? (
                      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" role="img" aria-label={t.name}>
                        <path d={t.path} />
                      </svg>
                    ) : (
                      <span className="text-[0.95rem] font-semibold tracking-tight" role="img" aria-label={t.name}>
                        {t.mono}
                      </span>
                    )}
                  </span>
                  <span className="name" aria-hidden="true">
                    {t.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
