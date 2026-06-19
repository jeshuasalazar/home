# Plan de implementación para Claude Code — Personal Site TanStack

**Versión:** 3.0  
**Fecha:** 17 de junio de 2026  
**Misión:** crear una página personal disruptiva, poderosa y simple, con valor añadido inequívoco.  
**Estado:** **GO para construir** · **GO condicionado para publicar**

---

## 1. Resultado esperado

Construir desde cero, en este workspace, un sitio personal inicialmente en español y preparado para internacionalización. Debe proyectar autoridad mediante claridad, evidencia y ejecución técnica; no mediante adjetivos, ruido visual o claims no verificables.

La experiencia combinará:

- Glassmorphic Grid Layering.
- Bento Grid editorial y asimétrico.
- Temas claro, oscuro y preferencia del sistema.
- Movimiento cinemático sobrio con Motion.
- Casos de estudio basados en evidencia.
- SSR, rutas tipadas y server functions con TanStack Start.
- Autenticación Clerk limitada al área privada.
- Despliegue reproducible en Railway.
- Biome como única herramienta de formato y lint.

No inventar clientes, métricas, publicaciones, testimonios ni resultados. Los datos incompletos usarán estado `draft` y nunca podrán aparecer en el sitemap ni en producción.

---

## 2. Stack definitivo

| Área | Elección | Uso obligatorio |
|---|---|---|
| Framework | TanStack Start para React | SSR, streaming, server functions y server routes |
| Routing | TanStack Router file-based | Rutas, loaders, search params y navegación tipada |
| Server state | TanStack Query | Mutación de contacto y futuro estado remoto; no duplicar loaders innecesariamente |
| Formularios | TanStack Form | Formulario de contacto, validación y estados accesibles |
| Tablas | TanStack Table | **No usar en MVP**; no existen data grids complejos |
| Autenticación | Clerk para TanStack React Start | Middleware, provider, sign-in y ruta privada `/admin` |
| Movimiento | Motion para React | `LazyMotion`, Motion Values, scroll y transiciones estables |
| Contenido | MDX local + Zod | Casos versionados, auditables y sin CMS |
| Estilos | Tailwind CSS + tokens CSS | Sistema visual, temas y responsive design |
| Hosting | Railway | Servicio Node SSR desplegado desde GitHub/Docker |
| Email | Resend REST API | Entrega del formulario desde servidor |
| Antispam | Cloudflare Turnstile | Verificación servidor; no implica alojar la app en Cloudflare |
| Toolchain | Biome | Único formatter, linter y organizador de imports |
| Package manager | npm | `package-lock.json` obligatorio y `npm ci` en CI/Docker |
| Code review | CodeRabbit GitHub App | Revisión externa; sin SDK ni código runtime |
| Testing | Vitest, Testing Library, Playwright, axe, Lighthouse CI | Unitarias, integración, E2E, a11y y rendimiento |

### Decisiones negativas

- No Next.js, pnpm, ESLint, Prettier, Railway SDK ni CodeRabbit SDK.
- No Cloudflare Workers Static Assets ni Worker separado.
- No Supabase, base de datos, CMS, TanStack DB, TanStack Intent o TanStack AI.
- No Motion+, APIs alpha de Motion, cursor personalizado, WebGL o smooth-scroll de terceros.
- No TanStack Table hasta que exista un data grid real.

---

## 3. Scaffolding oficial y preservación del workspace

El repositorio contiene documentos de planificación y `.git`; no deben borrarse ni reemplazarse.

### Secuencia obligatoria

1. Registrar versiones de Node, npm y sistema.
2. Consultar add-ons reales antes de invocarlos:

   ```bash
   npx @tanstack/cli@latest create --list-add-ons --json
   ```

3. Crear el scaffold en un directorio temporal hermano, nunca encima del `.git` actual:

   ```bash
   npx @tanstack/cli@latest create personal-site-scaffold \
     --framework React \
     --package-manager npm \
     --no-examples
   ```

4. Si la salida real confirma add-ons con IDs para `tanstack-query`, `clerk` o `biome`, regenerar el scaffold temporal usando únicamente esos IDs documentados. No adivinar identificadores.
5. Copiar al workspace la estructura generada preservando `.git`, `PLAN_DESARROLLO_REVISADO.md` y este archivo.
6. Si el CLI falla o cambia su contrato, usar el fallback oficial:

   ```bash
   npm create @tanstack/start@latest personal-site-scaffold
   ```

7. Guardar en `AGENTS.md` los comandos exactos realmente ejecutados, sus versiones y cualquier desviación.

### Regla de estructura

Preservar la estructura generada por TanStack. Solo añadir carpetas de dominio (`components`, `content`, `lib`, `server`) cuando no exista una ubicación equivalente. No renombrar entrypoints, route tree o archivos generados por preferencia estética.

### Versionado

TanStack Start continúa en RC y TanStack CLI en alpha al momento de esta revisión. Por tanto:

- Fijar versiones exactas de Start, Router y CLI en lockfile/configuración.
- No usar rangos `*`, `latest` ni upgrades automáticos en producción.
- Ejecutar route generation, typecheck, tests y build en cada actualización.
- Documentar la versión probada en `AGENTS.md`.

---

## 4. Estructura funcional

```text
/
├── /proyectos
│   └── /proyectos/$slug
├── /investigacion
├── /sobre-mi
├── /contacto
├── /privacidad
├── /sign-in/$
├── /sign-up/$
└── /admin                 # privada, no indexada
```

### Sitio público

- Navegación global, hero, proyectos destacados, capacidades, investigación, principios, CTA y footer.
- Tres a cinco casos reales antes del lanzamiento; los placeholders permanecen `draft`.
- Filtros de `/proyectos` en search params tipados (`?area=&status=`), no en estado global.
- Investigación separada en publicaciones verificadas, trabajo en curso y líneas de interés.
- Contacto accesible con fallback de correo visible.

### Área privada `/admin`

Su único alcance en MVP es verificar la integración Clerk y mostrar:

- Identidad autenticada.
- Estado de preparación de contenido: publicados, drafts y campos faltantes.
- Salud de configuración, sin exponer valores de secretos.

No incluir editor, CMS, subida de archivos, roles complejos ni base de datos. La ruta no aparece en navegación pública, sitemap o robots permitidos.

---

## 5. Contenido y rutas tipadas

### Esquema MDX

```ts
type ProjectStatus = "published" | "private-summary" | "archived" | "draft";

interface ProjectFrontmatter {
  title: string;
  slug: string;
  summary: string;
  year: number;
  status: ProjectStatus;
  role: string;
  problem: string;
  outcomes: string[];
  technologies: string[];
  evidenceLinks: Array<{ label: string; url: string }>;
  featured: boolean;
  order: number;
  updatedAt: string;
  cover: { src: string; alt: string };
}
```

### Reglas de contenido

- Validar frontmatter con Zod en build y loaders de servidor.
- Fallar ante slugs duplicados, fechas inválidas, links internos rotos o campos vacíos.
- Un `outcome` debe ser una afirmación concreta; no fabricar cifras para satisfacer el schema.
- Excluir drafts de listados públicos, metadatos y sitemap en producción.
- En desarrollo, mostrar drafts solo en `/admin` y con badge inequívoco.
- Generar metadata y JSON-LD desde contenido validado.
- El loader de `$slug` responde 404 para drafts o slugs inexistentes en producción.

### Responsabilidad Router vs Query

- Loaders de TanStack Router: contenido necesario para render inicial y SEO.
- TanStack Query: mutaciones y datos remotos que deban reintentarse/cachearse.
- No envolver contenido MDX local en Query sin necesidad.
- Query Devtools solo en desarrollo y cargadas de forma diferida.

---

## 6. Autenticación Clerk

### Instalación oficial

Si el scaffold no instala Clerk, seguir la integración oficial:

```bash
npm install @clerk/tanstack-react-start
```

### Integración

- Crear `src/start.ts` con `createStart()` y `requestMiddleware: [clerkMiddleware()]`.
- Envolver el documento en `<ClerkProvider>` desde la root route.
- Crear rutas catch-all de sign-in y sign-up siguiendo la guía oficial vigente.
- Proteger `/admin` en servidor usando `auth()` dentro de una server function llamada desde `beforeLoad`.
- Redirigir visitantes no autenticados a `/sign-in`.
- Configurar `authorizedParties` con los orígenes local, preview y producción conocidos.
- Los componentes de ocultación cliente no sustituyen la autorización servidor.
- No mostrar login en la navegación pública; usar URL directa para el owner.

### Variables

```text
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
```

`CLERK_SECRET_KEY` nunca puede importarse en módulos cliente ni aparecer en logs.

---

## 7. TanStack Query y TanStack Form

### Query

- Usar el provider generado por el add-on oficial si existe.
- Crear un `QueryClient` por request en SSR y una instancia estable en navegador, siguiendo la plantilla generada.
- Defaults: `staleTime` razonable, un reintento máximo para mutaciones idempotentes y sin refetch de contenido local.
- La mutación `contact.submit` es el primer uso real de Query.

### Form

- Instalar `@tanstack/react-form` si el scaffold no lo incluye.
- Crear `createFormHookContexts` y `createFormHook` una sola vez.
- Registrar componentes accesibles: `TextField`, `SelectField`, `TextAreaField`, `CheckboxField`, `SubmitButton` y `FieldError`.
- Usar Zod mediante Standard Schema tanto en cliente como servidor.
- Validar en blur y submit; no mostrar errores agresivamente antes de interacción.
- En error servidor, conservar valores salvo token Turnstile y honeypot.

### Contrato de contacto

```ts
interface ContactPayload {
  name: string;
  email: string;
  organization?: string;
  projectType:
    | "producto"
    | "automatizacion"
    | "ia"
    | "investigacion"
    | "colaboracion"
    | "otro";
  message: string;
  consent: true;
  turnstileToken: string;
  website?: string;
}

type ContactResult =
  | { ok: true; requestId: string }
  | {
      ok: false;
      code:
        | "INVALID_INPUT"
        | "BOT_REJECTED"
        | "DELIVERY_FAILED"
        | "SERVER_ERROR";
    };
```

### Server function

- Implementar con `createServerFn({ method: "POST" })` y validación servidor.
- Límite lógico de payload: 16 KB.
- Rechazar honeypot, verificar Turnstile y escapar el HTML.
- Enviar con `fetch` a Resend; no añadir un SDK si REST es suficiente.
- Usar timeouts con `AbortSignal.timeout` o controlador equivalente soportado.
- No almacenar mensajes ni registrar nombre, correo, cuerpo o tokens.
- Generar `requestId`; devolver errores públicos genéricos.
- Validar `Origin` contra `APP_URL` y los previews explícitamente permitidos.

---

## 8. Sistema visual y Motion

Conservar el sistema visual aprobado: dos temas, Inter Variable local, tokens semánticos, Bento asimétrico y cinco capas de Glassmorphic Grid Layering:

1. Atmosphere.
2. Structural grid.
3. Glass surfaces.
4. Reactive light.
5. Content.

### `GlassCard`

```ts
interface GlassCardProps {
  level?: "quiet" | "default" | "featured";
  interactive?: boolean;
  spotlight?: boolean;
  tilt?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

- Tilt máximo ±2.5° y solo con `pointer: fine`.
- Máximo tres superficies reactivas simultáneas.
- Base opaca y contraste AA cuando no exista `backdrop-filter`.
- Motion Values y variables CSS; nunca `setState` por frame.

### Motion

- Paquete `motion`; APIs gratuitas y estables únicamente.
- `LazyMotion` con `domMax` dinámico, `strict` y elementos `m.*`.
- `MotionConfig reducedMotion="user"`.
- Hero: variants y stagger semántico, desplazamiento ≤ 20 px.
- Atmósfera: `useScroll` + `useTransform` + `useSpring`, rango ≤ 32 px.
- Bento: `useInView({ once: true })` por grupos.
- Filtros: `layout` + `AnimatePresence mode="popLayout"`.
- Sin shared layout entre rutas; entradas breves y no bloqueantes.
- Reduced motion elimina parallax, tilt y desplazamiento, conservando opacity y feedback.

### Temas

```ts
type ThemePreference = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";
```

- Persistir preferencia local y aplicar `data-theme` en `<html>`.
- Selector Sistema/Claro/Oscuro.
- Evitar flash mediante un script externo `/theme-init.js` cargado en el head SSR.
- CSP permite scripts propios; no usar inline salvo hash exacto.

---

## 9. Biome como toolchain único

### Instalación

Si el scaffold no lo incluye:

```bash
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init
```

### Reglas

- Eliminar dependencias y configuraciones de ESLint y Prettier creadas por plantillas o add-ons.
- `biome.json` activa formatter, linter recomendado, import sorting y VCS integration.
- Excluir solo artefactos generados: route tree, `.output`, cobertura y resultados de pruebas.
- Las excepciones requieren suppression local con explicación; no desactivar reglas globalmente por comodidad.

### Scripts

```json
{
  "format": "biome format .",
  "format:fix": "biome format --write .",
  "lint": "biome lint .",
  "check": "biome check .",
  "check:fix": "biome check --write .",
  "ci": "biome ci .",
  "typecheck": "tsc --noEmit"
}
```

`npm run ci` debe ser bloqueante en GitHub Actions.

---

## 10. CodeRabbit

- CodeRabbit es exclusivamente una GitHub App externa.
- Crear `.coderabbit.yaml` con revisión en español, tono conciso y foco en seguridad, SSR, accesibilidad, rendimiento, tipos y tests.
- Marcar como ignorados artefactos generados (`routeTree.gen.ts`, snapshots, reportes, `.output`).
- Pedir revisión explícita de secretos cliente, autorización `/admin`, validación server functions y regresiones Motion.
- No instalar paquete npm, SDK, webhook, API key o código runtime de CodeRabbit.
- Documentar en `AGENTS.md` el paso manual: instalar la GitHub App desde CodeRabbit, autorizar únicamente este repositorio y comprobar una PR de prueba.

---

## 11. Railway

### Build y runtime

- SSR Node; ya no existe static export.
- Usar el output generado por TanStack Start/Nitro.
- Verificar después del scaffold que el entrypoint sea `.output/server/index.mjs`; no asumirlo si la versión fijada produce otro contrato.
- Configurar el servidor para escuchar `process.env.PORT || 3000` y host `0.0.0.0`.

### Dockerfile base

Usar multi-stage con Node LTS Alpine:

1. Copiar `package.json` y `package-lock.json`.
2. Ejecutar `npm ci`.
3. Copiar fuentes y ejecutar `npm run build`.
4. Copiar `.output` a imagen runtime.
5. Ejecutar `node .output/server/index.mjs`.

No crear `railway.toml` salvo que sea necesario para healthcheck, restart policy o configuración no representable en Railway. Si se crea, documentar cada propiedad.

### Variables de producción

```text
NODE_ENV=production
APP_URL=
ALLOWED_PREVIEW_ORIGINS=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
TURNSTILE_SECRET=
VITE_TURNSTILE_SITE_KEY=
RESEND_API_KEY=
CONTACT_TO=
CONTACT_FROM=
```

Crear `.env.example` sin valores reales. Railway inyecta secretos; no copiar `.env` en Docker.

### Healthcheck

Crear `/api/health` sin autenticación que devuelva estado y versión, nunca secretos ni dependencias externas. Railway usará esta ruta para healthcheck. La entrega de correo y Clerk no deben volver no saludable al proceso principal.

---

## 12. `AGENTS.md` obligatorio

Crear en la raíz y mantener como memoria durable:

- Misión y límites de alcance.
- Comandos exactos de scaffolding realmente usados.
- Versiones fijadas de Node, npm, TanStack, Clerk, Motion y Biome.
- Estructura generada y extensiones añadidas.
- Variables de `.env.example`, indicando cliente vs servidor.
- Flujo local: install, dev, check, typecheck, test y build.
- Integración Clerk y protección de `/admin`.
- Build, Docker, healthcheck y despliegue Railway.
- CodeRabbit: instalación manual de GitHub App, sin SDK.
- ADRs: SSR/Railway, Query vs loaders, Form, MDX, ausencia de DB/Table.
- Gotchas: Start RC, CLI alpha, route tree generado, SSR/hydration, CSP, reduced motion.
- Estado actual, bloqueantes y siguientes pasos inmediatos.

Actualizarlo cuando una decisión cambie; no duplicar secretos.

---

## 13. Seguridad, SEO, rendimiento y accesibilidad

### Seguridad

- Headers: CSP, HSTS después de validar dominio, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, frame-ancestors y COOP.
- CSP inicialmente report-only; volverla bloqueante tras validar Clerk, Turnstile, Motion y assets.
- Autorización servidor para `/admin`.
- Secretos solo en módulos servidor y Railway.
- Dependencias fijadas, auditadas y actualizadas mediante PR deliberada.

### SEO

- Metadata, canonical, Open Graph y JSON-LD por ruta.
- `sitemap.xml` excluye drafts, auth y admin.
- `robots.txt` bloquea admin y auth.
- SSR entrega contenido esencial sin esperar JavaScript.

### Presupuestos

- LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 al p75.
- Lighthouse Performance ≥ 95; Accessibility, Best Practices y SEO ≥ 95.
- JavaScript inicial objetivo ≤ 150 KB gzip por ruta; el aumento frente al plan estático reconoce Start + Query + Clerk. Cualquier exceso requiere análisis.
- CSS inicial ≤ 35 KB gzip e imagen hero móvil ≤ 180 KB.
- Sin tareas propias repetitivas > 50 ms ni commits React por frame.
- TTFB de producción monitorizado; objetivo inicial ≤ 800 ms al p75.

### Accesibilidad

- WCAG 2.2 AA, skip link, landmarks, foco visible, teclado completo y targets preferidos 44×44 px.
- Reflow a 320 CSS px, zoom 400 % y contraste en ambos temas.
- Focus management en menú y auth; Escape cierra overlays.
- Ningún contenido depende de hover, blur o Motion.

---

## 14. Pipeline de implementación

### Fase 1 — Scaffold y baseline

- Generar con CLI oficial y npm; preservar estructura.
- Fijar versiones y crear `AGENTS.md`/`.env.example`.
- Instalar/validar Query, Form, Clerk, Motion y Biome.
- Eliminar ESLint/Prettier.
- Conseguir `npm run ci`, typecheck, tests y build verdes.

### Fase 2 — Vertical slice

- Root providers: Clerk, Query, Theme y Motion.
- Navegación, hero, una GlassCard, temas y reduced motion.
- Ruta de proyecto SSR con contenido validado.
- Clerk middleware, sign-in y `/admin` protegido.
- No continuar si hay hydration errors, contraste insuficiente o jank.

### Fase 3 — Producto completo

- Rutas públicas, Bento, MDX, filtros con search params y SEO.
- TanStack Form + Query mutation + server function de contacto.
- Turnstile, Resend, privacidad y estados de error.
- Healthcheck y fallback de contacto.

### Fase 4 — Operación y review

- Dockerfile Railway, deploy preview y smoke tests.
- GitHub Actions con `npm ci`, Biome CI, typecheck, tests y build.
- `.coderabbit.yaml` y documentación de instalación manual.
- CSP, headers, logs seguros y runbook rollback.

### Fase 5 — QA y lanzamiento

- Playwright, axe, Lighthouse CI y visual regression.
- Safari, Chrome, Firefox, iOS y Android.
- Temas, touch, reduced motion, auth, contacto y errores externos.
- Auditoría final GO/NO-GO.

---

## 15. Pruebas obligatorias

### Unitarias

- Schemas MDX/contacto, exclusión de drafts y slugs.
- Resolución de tema, tokens Motion y reduced motion.
- Escape HTML y mapeo seguro de errores.

### Integración

- Clerk autenticado/no autenticado; `/admin` protegido en servidor.
- Turnstile aceptado, rechazado y timeout.
- Resend éxito, error y timeout.
- Honeypot, payload >16 KB, origen inválido y variables ausentes.
- Query mutation no duplica envíos durante submit.

### E2E

- Navegación, filtros URL, proyectos, 404 y metadata.
- Tema system/light/dark persistente.
- Menú móvil, teclado, focus y reduced motion.
- Sign-in, redirect a `/admin` y sign-out.
- Contacto válido/inválido y recuperación de error.
- `/api/health` y sitemap sin rutas privadas/drafts.

### Operación

- Docker build y ejecución local con `PORT` alternativo.
- Railway preview saludable.
- Ningún secreto en bundle cliente, logs o imagen Docker.
- CodeRabbit activo solo como GitHub App.

---

## 16. Reauditoría GO / NO-GO

### Bloqueantes resueltos por este plan

| Hallazgo | Resolución | Flag |
|---|---|---|
| Stack anterior contradice la misión técnica actual | Sustituido completamente por TanStack Start | **GO** |
| Hosting estático incompatible con Clerk/server functions | Railway SSR Node | **GO** |
| ESLint/Prettier contradicen toolchain | Biome único | **GO** |
| Query/Form solicitados sin responsabilidad | Query para mutación; Form para contacto | **GO** |
| Clerk sin superficie funcional | `/admin` privado mínimo | **GO condicionado** |
| CodeRabbit confundido con runtime | GitHub App + YAML únicamente | **GO** |

### Mayores

| Riesgo | Tratamiento | Estado |
|---|---|---|
| TanStack Start aún es RC | Versiones exactas y suite completa por upgrade | **Aceptado con control** |
| TanStack CLI está en alpha | Inspeccionar add-ons y fallback oficial create-start | **Mitigado** |
| Railway cuesta más que hosting estático | Aceptado por SSR, Clerk y server functions | **Decisión consciente** |
| Clerk añade JS y complejidad al sitio público | Provider global, UI auth fuera del nav y medición de bundle | **GO condicionado** |
| SSR puede aumentar TTFB | Docker pequeño, healthcheck y métricas Railway | **Mitigado** |
| Doble tema + glass + Motion amplía QA | Vertical slice y matrices visuales | **Mitigado** |

### Flags finales

- **GO:** TanStack Start + Router, Query, Form, Clerk, Railway, npm, Biome, Motion y MDX.
- **GO condicionado:** `/admin`, Clerk global, spotlight, tilt y parallax después del vertical slice.
- **NO-GO:** TanStack Table sin grid real; DB/AI/CMS sin requisito; ESLint/Prettier; Cloudflare hosting; CodeRabbit runtime; add-ons o paquetes inventados.
- **NO-GO de lanzamiento:** contenido draft visible, auth solo cliente, secrets expuestos, build/test fallido, Railway no saludable o defecto crítico de accesibilidad/rendimiento.

**Determinación:** **GO para construir. GO condicionado para publicar.**

---

## 17. Definición de terminado

- Scaffold oficial preservado y comandos registrados en `AGENTS.md`.
- npm/lockfile, Biome y versiones fijadas.
- Todas las rutas públicas completas y SSR.
- `/admin` protegido realmente en servidor mediante Clerk.
- Query y Form usados solo en responsabilidades aprobadas.
- Tres casos reales aprobados o deployment limitado a preview.
- Railway construye, arranca, respeta `PORT` y pasa healthcheck.
- Contacto entrega sin almacenar ni filtrar información.
- CodeRabbit instalado manualmente y configurado sin runtime.
- Ambos temas, Motion, touch y reduced motion verificados.
- CI, tests, presupuestos y auditoría final en verde.

---

## 18. Fuentes oficiales

- [TanStack CLI Quick Start](https://tanstack.com/cli/latest/docs/quick-start)
- [TanStack CLI Reference](https://tanstack.com/cli/latest/docs/cli-reference)
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Start Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [Clerk TanStack Start Quickstart](https://clerk.com/docs/quickstarts/tanstack-start)
- [Clerk middleware reference](https://clerk.com/docs/reference/tanstack-react-start/clerk-middleware)
- [Railway TanStack Start Guide](https://docs.railway.com/guides/tanstack-start)
- [Biome Getting Started](https://biomejs.dev/guides/getting-started/)
- [TanStack Form Quick Start](https://tanstack.com/form/latest/docs/framework/react/quick-start)
- [TanStack Query](https://tanstack.com/query/v5/docs/framework)
- [CodeRabbit YAML configuration](https://docs.coderabbit.ai/getting-started/yaml-configuration)
- [Motion for React](https://motion.dev/docs/react)
