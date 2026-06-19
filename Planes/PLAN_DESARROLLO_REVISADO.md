# Plan de desarrollo revisado — Sitio web personal de alta autoridad

**Versión:** 2.1  
**Fecha de revisión:** 17 de junio de 2026  
**Estado del plan original:** **NO-GO**  
**Estado de este plan corregido:** **GO para construir un MVP premium y visualmente reactivo**, sujeto a las puertas de calidad y lanzamiento definidas en este documento  
**Horizonte estimado del MVP:** 15–20 días laborables, más el tiempo de aprobación y producción de contenido

---

## 1. Decisión ejecutiva

El concepto visual y editorial es válido, pero el plan original no estaba listo para ejecución. Mezclaba renderizado estático e ISR como si fueran simultáneamente compatibles, distribuía responsabilidades entre Cloudflare, Railway y Supabase sin una necesidad demostrada, prometía resultados no controlables (`< 0.5 s` y `100/100` universal) y añadía un agente de IA sin modelo de amenazas, límites de gasto ni política de datos.

Este plan mantiene la base —Next.js, Tailwind CSS, Cloudflare, estética Bento, proyectos técnicos e investigación—, eleva la dirección de arte a una experiencia reactiva de primer nivel y reduce la infraestructura a lo necesario. La autoridad no se proyectará con una plantilla estática convencional, sino mediante una composición editorial viva: profundidad por capas, luz reactiva, tipografía precisa, transiciones espaciales y microinteracciones de alta calidad que nunca oculten el contenido ni degraden la experiencia.

```text
Usuario
  │
  ▼
Cloudflare DNS + CDN + seguridad
  │
  ├── Sitio Next.js exportado como archivos estáticos
  │     ├── Inicio y perfil
  │     ├── Proyectos y casos de estudio en MDX
  │     └── Investigación y contacto
  │
  └── Worker mínimo (solo formulario)
        ├── Turnstile / validación / rate limit
        └── Proveedor transaccional de correo
```

**Resultado:** menos puntos de fallo, costo base cercano a cero dentro de cuotas gratuitas, mejor rendimiento, menor superficie de ataque y una ruta clara para añadir capacidades dinámicas cuando exista evidencia de que hacen falta.

### Banderas ejecutivas

| Área | Plan original | Decisión corregida | Bandera |
|---|---|---|---|
| Propuesta visual | Potente, pero sin especificación ejecutable | Glassmorphic Grid Layering y sistema de movimiento con límites técnicos | **GO condicionado a prototipo** |
| Arquitectura de hosting | Cloudflare + Railway sin propiedad clara | Cloudflare Static Assets como único hosting del MVP | **GO** |
| Renderizado | SSG e ISR planteados a la vez | Exportación estática; actualización por build | **GO** |
| Contenido y autoridad | Categorías sin pruebas ni inventario | Casos con evidencia, rol y resultados verificables | **GO condicionado** |
| Base de datos | Supabase desde el inicio | No usar hasta existir datos persistentes reales | **NO-GO en MVP** |
| Railway | Servidor permanente sin carga que lo justifique | Retirado; reevaluar ante un workload Node de larga duración | **NO-GO en MVP** |
| Playground de IA | Widget abierto y sin controles | Fase posterior con gateway, presupuesto y kill switch | **NO-GO hasta pasar su gate** |
| Rendimiento | Promesas absolutas | Presupuestos medibles en laboratorio y campo | **GO** |
| Accesibilidad | Auditoría tardía | WCAG 2.2 AA desde diseño y pruebas | **GO** |
| Plazo | 12 días para alcance completo | 15–20 días para MVP; IA fuera del MVP | **GO** |

---

## 2. Hallazgos de la auditoría

### 2.1 Bloqueantes y fallas críticas

#### C-01 — Contradicción entre exportación estática e ISR

**Problema:** el plan exige páginas estáticas, transiciones “instantáneas” e ISR, pero Next.js no soporta ISR con `output: 'export'`. Son dos modelos de despliegue distintos.

**Impacto:** el equipo no puede configurar, desplegar ni probar una arquitectura inequívoca.

**Corrección:** el MVP usa exportación estática. Los cambios de contenido disparan un nuevo build. Solo se migra a OpenNext/Workers con ISR si la frecuencia o volumen de publicación demuestra que los builds son insuficientes.

**Estado:** **resuelto — GO**.

#### C-02 — Infraestructura triplicada y sin límites de responsabilidad

**Problema:** Cloudflare, Railway y Supabase aparecen en la misma ruta de solicitud, pero no se define quién renderiza, cachea, persiste, autentica, observa o revierte.

**Impacto:** mayor costo, latencia, complejidad operativa y tiempo de diagnóstico.

**Corrección:** Cloudflare aloja los estáticos y un Worker mínimo procesa el formulario. Supabase y Railway quedan fuera del MVP.

**Estado:** **resuelto — GO**.

#### C-03 — Playground de IA sin modelo de amenazas ni control económico

**Problema:** un chat público puede exponer claves, aceptar prompt injection, generar abuso automatizado, revelar información del sistema, almacenar datos personales o producir cargos no acotados.

**Impacto:** riesgo financiero, reputacional, de privacidad y seguridad.

**Corrección:** se retira del MVP. Su fase exige autenticación o cuota anónima estricta, gateway del lado servidor, allowlist de herramientas, moderación, retención mínima, observabilidad, límite mensual y kill switch.

**Estado:** **mitigado — NO-GO hasta cumplir la puerta IA**.

#### C-04 — Autoridad declarada sin evidencia definida

**Problema:** expresiones como “superioridad técnica”, “agentes autónomos” y “sistemas activos” pueden convertirse en afirmaciones vacías o engañosas si no existe evidencia pública.

**Impacto:** daña justamente la autoridad que el sitio busca construir.

**Corrección:** cada caso de estudio debe incluir contexto, responsabilidad personal, restricciones, decisión técnica, resultado verificable y, cuando aplique, una nota de confidencialidad. No se publican métricas inventadas, clientes sin permiso ni estados “en tiempo real” que no provengan de una fuente real.

**Estado:** **GO condicionado al inventario editorial**.

#### C-05 — Objetivos de rendimiento imposibles de garantizar

**Problema:** “cargar en menos de 0.5 segundos” depende de red, dispositivo, geografía y caché; Lighthouse 100/100 no es estable ni sustituye datos reales.

**Impacto:** aceptación arbitraria, optimización para una captura y falsas expectativas.

**Corrección:** usar Core Web Vitals de campo al percentil 75 y presupuestos de laboratorio repetibles. Lighthouse es un guardrail de CI, no el resultado de negocio.

**Estado:** **resuelto — GO**.

#### C-06 — Ausencia de controles de datos y seguridad

**Problema:** se proponen analíticas, interacciones y contacto sin definir finalidad, consentimiento, retención, acceso, eliminación, secretos, spam o respuesta a incidentes.

**Impacto:** exposición legal y operativa, además de datos innecesarios.

**Corrección:** analítica agregada y sin perfilado; formulario con minimización de datos, validación servidor, antispam, retención documentada y sin secretos en cliente. Política de privacidad publicada antes de activar cualquier captura.

**Estado:** **GO condicionado al gate de lanzamiento**.

### 2.2 Hallazgos mayores

| ID | Hallazgo | Riesgo | Ajuste obligatorio |
|---|---|---|---|
| M-01 | Parallax, tilt, blur y spotlight se aplican como regla general | Jank, consumo de batería, distracción y mareo | Framer Motion para orquestación, CSS para estados simples, `LazyMotion` y desactivación con `prefers-reduced-motion`/puntero táctil |
| M-02 | Interacción crítica basada en hover | Inaccesible en móvil, teclado y lectores de pantalla | Todo el contenido debe existir sin hover y tener foco visible |
| M-03 | SF Pro se trata como fuente web automática | Riesgo de licencia y experiencia desigual | Inter Variable local como opción segura; SF Pro solo tras validar licencia de distribución |
| M-04 | No existe mapa completo de rutas | SEO, navegación y alcance ambiguos | Fijar arquitectura de información antes de componentes |
| M-05 | No hay especificación del formulario | Pérdida de leads, spam o fuga de datos | Contrato de campos, estados, validación, entrega y fallback |
| M-06 | Supabase se usa para “logs” sin necesidad | Sobrecosto y tratamiento de datos adicional | Cloudflare Web Analytics agregada; RUM solo si existe hipótesis concreta |
| M-07 | No hay estrategia de imágenes para exportación estática | `next/image` no dispone de optimización en servidor en static export | Generar AVIF/WebP responsivos en build y reservar dimensiones |
| M-08 | No hay CI, rollback ni ownership | Regresiones y despliegues no reproducibles | Pipeline con checks bloqueantes, preview y rollback documentado |
| M-09 | Accesibilidad se deja para el final | Rehacer diseño y componentes | WCAG 2.2 AA como definición de terminado de cada historia |
| M-10 | Plazo no incluye contenido, QA ni revisión móvil real | Fecha poco creíble | Separar descubrimiento/contenido, build, endurecimiento y release |
| M-11 | “Disponibilidad en tiempo real” no tiene fuente | Señal falsa o desactualizada | Estado manual con fecha de actualización o retirar el indicador |
| M-12 | No hay gobernanza de dependencias | Riesgo de cadena de suministro y upgrades sorpresivos | Lockfile, versiones fijadas, actualización automatizada y revisión mensual |

---

## 3. Objetivos, audiencia y métricas de éxito

### 3.1 Objetivo del producto

Convertir visitas cualificadas en conversaciones profesionales demostrando, con evidencia y claridad, tres capacidades: construcción de productos tecnológicos, automatización/IA aplicada e investigación rigurosa.

### 3.2 Audiencias prioritarias

1. **Decisor empresarial:** necesita entender problemas resueltos, resultados, nivel de riesgo y forma de contacto.
2. **Líder técnico o colaborador:** necesita evaluar decisiones, profundidad, código/arquitectura y contribución personal.
3. **Audiencia académica:** necesita metodología, publicaciones, líneas de investigación y referencias verificables.

### 3.3 Métricas de producto

Durante los primeros 90 días:

- Porcentaje de visitantes que abre al menos un caso de estudio.
- Clics cualificados en contacto o envío válido del formulario.
- Casos de estudio leídos hasta la sección de resultados.
- Tasa de error del formulario y entrega confirmada.
- Consultas recibidas que mencionan un proyecto o área concreta.

No se define una cifra objetivo sin línea base. A los 30 días se establece baseline; a los 60 se formula una hipótesis; a los 90 se evalúa el cambio.

---

## 4. Alcance del MVP

### 4.1 Incluido

- Idioma principal español; arquitectura preparada para otro idioma, sin implementar i18n prematuramente.
- Inicio con propuesta de valor, especialidades, proyectos destacados, investigación y CTA.
- Listado de proyectos y entre 3 y 5 casos de estudio reales.
- Sección de investigación/publicaciones con enlaces o estado verificable.
- Perfil/sobre mí con trayectoria, principios de trabajo y capacidades.
- Contacto accesible con fallback de correo directo.
- Política de privacidad, página 404, metadatos sociales, favicon y manifest básico.
- Sitemap, robots, canonical, Open Graph y datos estructurados válidos.
- Tema claro/oscuro solo si ambos se diseñan y prueban; de lo contrario, un único tema excelente.
- Analítica agregada, sin cookies de marketing en el MVP.

### 4.2 Excluido

- Login, cuentas, panel administrativo y base de datos.
- Chat o playground de IA.
- CMS remoto; el contenido vive en MDX versionado.
- ISR/SSR, personalización por visitante y estado “en vivo”.
- Blog de alta frecuencia, newsletter, comentarios y buscador.
- WebGL, video autoplay y 3D pesado. Sí se incluyen tilt ligero, profundidad por capas y luz reactiva con degradación progresiva.

### 4.3 Arquitectura de información

```text
/
├── /proyectos
│   └── /proyectos/[slug]
├── /investigacion
├── /sobre-mi
├── /contacto
├── /privacidad
└── /404
```

Cada ruta debe tener una intención única. El inicio resume; los casos demuestran; investigación acredita rigor; contacto convierte.

---

## 5. Stack objetivo y decisiones de arquitectura

### 5.1 Stack aprobado

| Capa | Elección | Decisión |
|---|---|---|
| Framework | **Next.js estable actual (línea 16.x al revisar), App Router + TypeScript estricto** | Mantiene la base y permite crecer; fijar versión exacta y lockfile |
| Renderizado | **Static export (`output: 'export'`)** | Máximo rendimiento y mínima operación para contenido editorial |
| Runtime local/CI | **Versión de Node soportada, fijada en archivo de versión** | Builds reproducibles; no depender del Node global |
| Estilos | **Tailwind CSS + variables CSS/tokens semánticos** | Velocidad con control de diseño; evitar clases arbitrarias repetidas |
| Movimiento | **Motion for React (Framer Motion) como motor oficial + CSS para estados simples** | Orquesta entradas, layout, gestos y transiciones; `LazyMotion`, features mínimas y carga por islas |
| Contenido | **MDX local validado por esquema** | Casos versionados, revisables y sin CMS/costo adicional |
| Hosting | **Cloudflare Workers Static Assets** | Activos estáticos sin costo por solicitud según la tarifa vigente |
| Formulario | **Cloudflare Worker + Turnstile + proveedor de email** | Sin base de datos; validación y secretos en servidor |
| Analítica | **Cloudflare Web Analytics** | Métricas agregadas y solución gratuita orientada a privacidad |
| Repositorio/CI | **Git + GitHub Actions** | Checks y despliegues reproducibles |
| Pruebas | **Vitest + Testing Library + Playwright + axe + Lighthouse CI** | Cobertura por riesgo, no por porcentaje decorativo |
| Imágenes | **Pipeline de build a AVIF/WebP + `<picture>`/componente propio** | Evita depender de optimización dinámica |

### 5.2 Decisiones explícitas

#### ADR-001 — Static export, no ISR

- El contenido cambia con baja frecuencia y está versionado.
- Cada merge a `main` genera y despliega una nueva versión.
- La pérdida de ISR es aceptable; elimina servidor, caché de aplicación y costo permanente.
- **Trigger de cambio:** más de 100 páginas, publicaciones varias veces al día o contenido que deba actualizarse sin build.

#### ADR-002 — Cloudflare único proveedor de entrega en MVP

- DNS, CDN, estáticos, protección y función de contacto quedan en un mismo borde.
- Railway solo se reevalúa para procesos Node persistentes, colas o librerías incompatibles con Workers.
- Si se requiere SSR/ISR, primero evaluar el adaptador OpenNext para Cloudflare; no añadir Railway por reflejo.

#### ADR-003 — Sin Supabase hasta tener entidad persistente

Se incorpora únicamente si aparece una necesidad como usuarios, historial, contenido editable por terceros o datos relacionales. El formulario no justifica una base de datos.

#### ADR-004 — Contenido estático como fuente de verdad

Cada caso MDX usa un frontmatter validado:

```yaml
title: string
summary: string
year: number
status: published | private-summary | archived
role: string
problem: string
outcomes: string[]
technologies: string[]
evidenceLinks: string[]
featured: boolean
```

El build falla si falta un campo requerido, hay slugs duplicados o enlaces internos inválidos.

#### ADR-005 — Arquitectura visual reactiva, no plantilla estática

- Framer Motion es una dependencia deliberada del producto, no un adorno opcional.
- `LazyMotion` y el conjunto mínimo de features evitan cargar capacidades que no se usan.
- Los elementos reactivos consumen `MotionValue`/transformaciones fuera del ciclo de render de React; el movimiento del puntero no provoca `setState` por frame.
- Solo se animan `transform` y `opacity` en recorridos frecuentes. Blur, sombras y gradientes reactivos se actualizan mediante variables CSS y se limitan a superficies visibles.
- La experiencia se divide en tres niveles: **core estático semántico**, **enhancement de movimiento** y **enhancement de puntero fino**. La ausencia de los dos últimos nunca elimina información ni navegación.
- Antes de construir todas las tarjetas se valida un vertical slice: hero + tarjeta Bento + transición a caso de estudio, en móvil y escritorio.

### 5.3 Relación calidad/precio/potencia

| Escenario | Infraestructura | Costo fijo esperado* | Motivo |
|---|---|---:|---|
| MVP | Cloudflare estático + Worker mínimo + analítica | **USD 0/mes** dentro de cuotas gratuitas | Suficiente para un sitio personal y contacto de bajo volumen |
| Tráfico o función dinámica moderada | Workers Paid | **desde USD 5/mes** | Más cuota y margen operativo sin migrar arquitectura |
| Datos persistentes reales | Añadir Supabase Pro | **desde USD 25/mes** | Solo cuando backups/no-pausa/operación de producción lo justifiquen |
| Proceso Node persistente | Añadir Railway | **desde el mínimo vigente + consumo** | Solo por incompatibilidad o carga concreta |
| Playground IA | Worker + proveedor de modelo | **variable y con tope duro** | El costo depende de tokens; nunca se libera sin presupuesto |

\* No incluye dominio, buzón de correo, impuestos, proveedor transaccional que exceda su cuota ni servicios opcionales. Los precios y cuotas se verifican de nuevo antes de contratar.

---

## 6. Sistema visual y experiencia

### 6.1 Norte creativo: autoridad cinética y elegancia técnica

1. **La evidencia domina al ornamento.** La jerarquía dirige hacia casos y resultados.
2. **La interfaz responde, no grita.** Cursor, scroll, foco y navegación producen respuestas sutiles y coherentes que sugieren precisión instrumental.
3. **Bento editorial, no tablero de widgets.** Las tarjetas forman una narrativa asimétrica, con ritmo, escala y orden de lectura lógico en DOM.
4. **Profundidad óptica con jerarquía real.** Vidrio, luz y sombras distinguen planos; nunca compensan una arquitectura de información débil.
5. **Movimiento como firma de sistema.** Las animaciones explican continuidad, causalidad y foco; comparten física y lenguaje.
6. **Calidad en móvil primero.** En touch, la composición conserva profundidad mediante scroll y estados de foco, no simula un cursor inexistente.
7. **Contraste antes que glassmorphism.** El blur nunca puede comprometer lectura, accesibilidad o rendimiento.

### 6.2 Glassmorphic Grid Layering

La página se construye como una escena de cinco planos coordinados:

| Plano | Función | Implementación |
|---|---|---|
| 0 — Atmosphere | Da identidad y profundidad global | Gradientes radiales lentos, ruido monocromático muy sutil y color ambiental; sin canvas |
| 1 — Structural grid | Organiza el ritmo Bento | CSS Grid asimétrico, líneas/guías de baja opacidad y espacios editoriales amplios |
| 2 — Glass surfaces | Contiene contenido | Fondo translúcido, borde interno, `backdrop-filter` acotado y fallback opaco |
| 3 — Reactive light | Responde al puntero/foco | Spotlight radial mediante variables CSS, limitado al contenedor activo |
| 4 — Content | Mantiene autoridad y legibilidad | Tipografía de alto contraste, iconografía mínima, datos y CTA sin transparencia |

**Anatomía de una tarjeta premium**

- Base opaca suficiente para garantizar contraste aunque `backdrop-filter` no exista.
- Capa de vidrio con blur moderado y saturación controlada; nunca blur a pantalla completa.
- Hairline con gradiente que reacciona a luz/foco, más borde estable de fallback.
- Highlight interno superior y sombra ambiental suave para separar planos.
- Spotlight recortado con máscara, sin listeners individuales por cada nodo.
- Contenido sobre una capa sólida/semitransparente independiente del efecto.
- Tilt máximo orientativo de 1.5–2.5° y traslación Z simulada de baja amplitud; se recentra con spring.

El efecto debe sentirse más cercano a una pieza de ingeniería óptica que a un catálogo de “glass cards”. Se variarán densidad, escala y tratamiento según importancia; no todas las tarjetas tendrán el mismo efecto.

### 6.3 Sistema tipográfico ultraoptimizado

- **Fuente primaria:** Inter Variable local, subset latino, formato WOFF2 y ejes/pesos recortados a los realmente usados.
- **Fuente de datos/código:** stack monoespaciado del sistema o una sola fuente local ligera si el concepto lo requiere.
- `next/font/local` o CSS equivalente para self-hosting, preload únicamente del archivo crítico y `font-display: swap`.
- Métricas de fallback ajustadas (`size-adjust`, `ascent-override`, `descent-override`) para minimizar CLS.
- Escala fluida con `clamp()`; hero con equilibrio óptico y ancho de línea controlado, no texto gigante por defecto.
- Tracking negativo solo en display; cuerpo con espaciado y altura de línea orientados a lectura.
- Gradiente tipográfico reservado para una frase de impacto; siempre existe color sólido de fallback y contraste verificable.
- SF Pro se permite únicamente como system stack en dispositivos Apple o tras validar por escrito la licencia de distribución web; no se empaqueta por defecto.

### 6.4 Lenguaje de movimiento con Framer Motion

**Física compartida**

- Interacciones directas: spring ágil, sin rebote teatral.
- Entradas editoriales: fade + desplazamiento de 8–20 px con stagger corto.
- Cambios de layout: `layout`/`layoutId` solo donde explican continuidad; no en toda la cuadrícula.
- Navegación: transición de contexto de 180–320 ms; el contenido útil aparece sin esperar el final.
- Hover/focus: 120–200 ms; el foco de teclado recibe una respuesta equivalente al hover.

**Momentos distintivos**

1. **Hero vivo:** luz ambiental responde con inercia al puntero, el titular entra por segmentos semánticos y el indicador de disponibilidad respira solo si su estado es auténtico.
2. **Bento reveal:** las tarjetas emergen por grupos al entrar al viewport una sola vez; el orden visual respeta el orden narrativo.
3. **Border spotlight:** luz localizada sigue el puntero mediante Motion Values y variables CSS, sin rerender continuo.
4. **Tilt de precisión:** solo tarjetas destacadas, amplitud mínima y spring de retorno; desactivado en touch/reduced motion.
5. **Shared transition:** una miniatura o título puede conservar continuidad al abrir el caso, si el static export y la navegación lo permiten sin fragilidad.
6. **Feedback del contacto:** estados de envío y éxito con microanimación clara, nunca confeti o demora artificial.

**Prohibiciones**

- No animar todas las palabras, tarjetas y fondos simultáneamente.
- No bloquear scroll, secuestrar el cursor ni usar smooth-scroll global de terceros.
- No basar legibilidad en blur, mezcla de color o animación.
- No crear listeners de puntero por tarjeta cuando pueda existir un controlador delegado.
- No usar `will-change` permanentemente en grandes cantidades de elementos.

### 6.5 Tokens mínimos

- Color: fondo, superficie, superficie elevada, texto principal, texto secundario, borde, acento, éxito, advertencia y error.
- Espaciado: escala consistente basada en múltiplos definidos.
- Tipografía: Inter Variable local con subset latino; máximo dos familias y máximo dos archivos críticos.
- Radios: 2–3 niveles, no un valor distinto por tarjeta.
- Vidrio: opacidad de superficie, blur, saturación, borde, highlight y fallback opaco.
- Luz: posición X/Y, intensidad, radio y color ambiental expresados como variables CSS.
- Sombras: 3 niveles coherentes; blur grande desactivado o reducido en móvil.
- Movimiento: springs, duraciones, stagger, distancia y escala como tokens compartidos; sin animaciones infinitas salvo indicadores con significado.

### 6.6 Reglas obligatorias de interacción

- `prefers-reduced-motion: reduce` elimina parallax, tilt y desplazamientos no esenciales.
- `pointer: coarse` elimina spotlight seguido por cursor y 3D tilt.
- Foco visible con contraste suficiente y orden coherente.
- La tarjeta completa puede ser clicable, pero conserva texto de enlace descriptivo y semántica válida.
- Ninguna métrica o descripción aparece exclusivamente en hover.
- Áreas táctiles de al menos 24 × 24 CSS px conforme al mínimo WCAG 2.2; preferencia interna: 44 × 44 px.
- El modo oscuro no usa texto gris de bajo contraste ni transparencias que cambien impredeciblemente.
- El contenido y CTA aparecen en el primer render; las animaciones solo mejoran su presentación.
- En dispositivos de gama baja o cuando se detecte presión de rendimiento, las capas ambientales y spotlight pueden reducirse sin cambiar el layout.

---

## 7. Contenido de autoridad

### 7.1 Estructura de cada caso de estudio

1. Problema y contexto.
2. Restricciones reales.
3. Rol y alcance personal.
4. Opciones consideradas y decisión.
5. Arquitectura o proceso.
6. Resultado y forma de medición.
7. Qué no funcionó o qué se aprendió.
8. Evidencia: demo, repositorio, captura, documento o referencia autorizada.
9. Estado actual y fecha de última revisión.

### 7.2 Reglas editoriales

- Sustituir “vanguardia”, “superioridad” e “impecable” por hechos demostrables.
- Una cifra solo se publica con fuente, periodo, unidad y contexto.
- Diferenciar claramente trabajo propio, de equipo, experimental y comercial.
- Anonimizar información confidencial y obtener autorización para logos/testimonios.
- No afirmar que un agente está “entrenado” si en realidad usa instrucciones, recuperación de contexto o herramientas.
- Incluir fecha de actualización en investigación y proyectos activos.

### 7.3 Insumos que bloquean el lanzamiento, no la construcción

- Nombre profesional y posicionamiento definitivo.
- Biografía corta y larga.
- Foto/retrato o decisión explícita de no usarlo.
- 3 casos con evidencia suficiente.
- Enlaces profesionales verificados.
- Correo receptor y consentimiento para publicación.
- Datos legales mínimos para privacidad y contacto.

---

## 8. Rendimiento, accesibilidad, SEO y seguridad

### 8.1 Presupuestos de rendimiento

**Campo, percentil 75, móvil y escritorio por separado:**

- LCP ≤ 2.5 s.
- INP ≤ 200 ms.
- CLS ≤ 0.1.

**Laboratorio en CI, perfil móvil acordado, mediana de 3 ejecuciones:**

- Lighthouse Performance ≥ 95 en rutas críticas.
- Accessibility, Best Practices y SEO ≥ 95; cualquier fallo crítico bloquea aunque el promedio pase.
- JavaScript inicial de aplicación: objetivo ≤ 130 KB gzip por ruta; cada excepción necesita justificación.
- Framer Motion se carga en el shell solo con el feature bundle mínimo; capacidades no críticas y efectos de puntero se dividen por ruta/componente.
- CSS inicial: objetivo ≤ 35 KB gzip.
- Imagen hero: objetivo ≤ 180 KB en viewport móvil; dimensiones siempre reservadas.
- Ninguna tarea de interacción propia debe bloquear el hilo principal más de 50 ms en el perfil de prueba.
- Animación estable cerca de 60 fps en el dispositivo de referencia; cero frames largos repetitivos durante scroll normal.
- Máximo orientativo de 3 superficies con reacción continua simultánea; las demás quedan en estado pasivo.
- Sin errores de consola, solicitudes 4xx/5xx propias ni cambios de layout provocados por fuentes/imágenes.

Los datos de campo prevalecen sobre Lighthouse. Si aún no existe volumen suficiente para CrUX/RUM, se conserva el gate de laboratorio y se revisa a los 30/60/90 días.

### 8.2 Accesibilidad

Objetivo: **WCAG 2.2 nivel AA**.

- HTML semántico, landmarks, un `h1` por ruta y jerarquía de encabezados coherente.
- Navegación completa por teclado, skip link y foco nunca oculto.
- Contraste probado en todos los estados, incluidos hover, focus, disabled y error.
- Alternativas textuales útiles y decoraciones ignoradas por tecnología asistiva.
- Formularios con label, ayuda, errores asociados y anuncio de resultado.
- Zoom al 400 %, reflow a 320 CSS px y texto ampliado sin pérdida funcional.
- Prueba automática con axe más prueba manual de teclado y lector de pantalla en rutas críticas.
- La variante `reduced motion` es una composición deliberada: conserva jerarquía, estados y feedback sin parallax, tilt, stagger espacial ni movimiento ambiental.

### 8.3 SEO técnico

- Título y descripción únicos por ruta.
- Canonical absoluto y una sola versión del host.
- `sitemap.xml`, `robots.txt`, 404 real y redirecciones controladas.
- Open Graph/Twitter images con dimensiones y texto legible.
- JSON-LD limitado a tipos que representen el contenido real (`Person`, `WebSite`, `Article`/`CreativeWork` cuando aplique).
- Enlaces internos descriptivos; externos con estado verificado en CI.
- No publicar páginas vacías “para SEO”.

### 8.4 Seguridad y privacidad

- TLS, HSTS después de verificar dominio y subdominios, CSP en modo report-only antes de imponerla, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options` y protección contra framing.
- Secretos únicamente en variables cifradas del proveedor; nunca variables `NEXT_PUBLIC_*` para credenciales.
- Formulario: esquema servidor, límite de tamaño, Turnstile, rate limit por señales no invasivas, honeypot, timeout y respuesta genérica.
- No almacenar mensajes en base de datos en el MVP; entregar por email y aplicar la retención del buzón definida en privacidad.
- Dependencias con lockfile, alertas y revisión antes de auto-merge.
- Logs sin cuerpo del mensaje, email completo, tokens ni prompts.
- Runbook mínimo: desactivar formulario, rotar secretos, revertir despliegue y publicar canal alterno de contacto.

---

## 9. Plan de implementación

### Fase 0 — Descubrimiento y evidencia (2–4 días)

**Entregables**

- Brief de audiencia, propuesta de valor y CTA primario.
- Inventario de contenido/evidencia y permisos.
- Sitemap y wireframes de baja fidelidad para móvil y escritorio.
- Moodboard y tres principios visuales aprobados: profundidad, luz y cinética.
- Matriz de efectos por breakpoint/capacidad (`fine pointer`, touch, reduced motion, fallback sin blur).
- Registro inicial de decisiones (ADR).
- Baseline de presupuesto y cuentas/proveedores aprobados.

**Gate G0 — GO si:** hay propuesta de valor aprobada, tres casos posibles, navegación cerrada, dirección visual aprobada y ningún claim crítico sin evidencia.  
**NO-GO si:** el sitio depende de contenido inexistente o confidencial sin autorización.

### Fase 1 — Fundación técnica y sistema de diseño (3 días)

**Entregables**

- Next.js estable, TypeScript estricto, Tailwind, pnpm y versiones fijadas.
- Estructura por rutas, tokens, tipografía local y primitives accesibles.
- Vertical slice de alta fidelidad: hero, una tarjeta Bento reactiva y transición a detalle.
- Prueba comparativa del slice en escritorio, móvil, teclado y reduced motion.
- MDX con esquema y contenido de muestra.
- CI inicial: lint, format check, typecheck, unit tests y build estático.
- Preview desplegable en Cloudflare.

**Gate G1 — GO si:** un clon limpio instala y construye con lockfile, todas las rutas exportan, no hay secretos, el preview funciona y el slice sostiene Lighthouse Performance ≥ 95 sin defectos de interacción.  
**NO-GO si:** se requiere una API dinámica no documentada, el adaptador/hosting no reproduce el build o Glassmorphic Grid Layering incumple contraste/rendimiento en el dispositivo de referencia. En este último caso se reduce blur/luz, no se cancela la identidad visual.

### Fase 2 — Experiencia y contenido (5–7 días)

**Entregables**

- Inicio, proyectos, detalle, investigación, perfil, contacto, privacidad y 404.
- Imágenes responsivas optimizadas y metadatos sociales.
- Animaciones progresivas con fallbacks de movimiento y táctil.
- Sistema completo de Motion: springs/timings, viewport reveals, spotlight, tilt selectivo, transiciones y estados.
- Formulario completo con estados de éxito, error, espera y fallback.
- SEO técnico y datos estructurados.

**Gate G2 — GO si:** el contenido esencial funciona sin JavaScript opcional, sin hover y con teclado; tres casos están completos.  
**NO-GO si:** existe contenido crítico de relleno, claims no verificables o contacto sin entrega confirmada.

### Fase 3 — Hardening y QA (3–4 días)

**Entregables**

- Playwright en flujos críticos y axe automatizado.
- Revisión manual en Safari, Chrome y Firefox actuales; iOS y Android reales cuando estén disponibles.
- Lighthouse CI, link checker, auditoría de bundle y prueba de red lenta.
- Perfilado de main thread/GPU durante hero, scroll Bento, hover y navegación; inspección de listeners y rerenders.
- Headers, CSP report-only, protección del formulario y revisión de privacidad.
- Runbook de despliegue, rollback e incidentes.

**Gate G3 — GO si:** no hay defectos críticos/altos abiertos, las rutas críticas cumplen presupuestos y accesibilidad manual, el movimiento se mantiene fluido en el dispositivo de referencia y el formulario entrega sin filtrar datos a logs.  
**NO-GO si:** hay regresión de foco, contenido inaccesible, secreto expuesto, spam trivial, fallos de entrega, jank repetitivo o el sitio pierde legibilidad al desactivar blur/movimiento.

### Fase 4 — Lanzamiento controlado (2 días)

**Entregables**

- DNS, redirects, canonical y certificado verificados.
- Backup del despliegue anterior o versión de rollback identificada.
- Smoke test en producción y alta en Search Console.
- Dashboard mínimo de disponibilidad, errores del formulario y Web Vitals.
- Revisión posterior a 24 y 72 horas.

**Gate G4 — GO de lanzamiento si:** DNS/TLS/canonical son correctos, no hay indexación accidental del preview, contacto y analítica funcionan, privacidad está publicada y rollback fue ensayado.  
**NO-GO si:** cualquiera de esos controles falla.

---

## 10. Pipeline de calidad y definición de terminado

Cada pull request debe ejecutar:

1. Instalación inmutable con lockfile.
2. Formato, lint y TypeScript sin errores.
3. Validación de MDX, claims requeridos, slugs y enlaces.
4. Pruebas unitarias de transformaciones y componentes con lógica.
5. Build de producción con `output: 'export'`.
6. Playwright de navegación, proyecto, contacto y 404.
7. axe en rutas representativas.
8. Lighthouse CI sobre preview estable.
9. Revisión visual de viewports clave cuando cambie UI.

Una historia está terminada solo si tiene:

- Estados normal, loading, vacío, error y éxito cuando apliquen.
- Teclado, foco, lector de pantalla y reduced motion considerados.
- Móvil y escritorio validados.
- Analítica mínima sin datos personales, si corresponde.
- Pruebas proporcionales al riesgo y documentación actualizada.
- Sin deuda crítica o alta diferida.

---

## 11. Fase opcional: playground de IA

El playground se abre como proyecto separado después de observar que los visitantes necesitan explorar capacidades de IA y que existe presupuesto operativo.

### Puerta IA — todos los puntos son obligatorios

- Caso de uso estrecho, mensaje de limitaciones y conjunto de evaluaciones aprobado.
- Claves y llamadas al modelo solo a través de Worker/gateway.
- Sin herramientas de escritura, red abierta ni acceso a secretos; allowlist explícita.
- Límite por sesión/IP o mecanismo equivalente, cuota diaria y tope mensual de gasto.
- Longitud de entrada/salida limitada, timeout, concurrencia máxima y circuit breaker.
- Moderación acorde al caso, defensa contra prompt injection y pruebas de extracción de sistema.
- Política de datos visible antes de enviar; retención cero o mínima documentada.
- Telemetría sin contenido sensible, alerta de costo/error y kill switch probado.
- Fallback que no afecte el sitio principal.
- Revisión legal de los datos y términos del proveedor elegido.

**Decisión actual:** **NO-GO**. Cambia a **GO** únicamente cuando todos los controles anteriores tengan responsable y evidencia de prueba.

---

## 12. Registro de riesgos

| Riesgo | Prob. | Impacto | Mitigación | Señal de activación |
|---|---:|---:|---|---|
| Contenido insuficiente o genérico | Alta | Alto | Fase 0 y gate editorial | Menos de 3 casos verificables |
| Animaciones degradan INP/LCP | Media | Alto | LazyMotion, Motion Values, budgets, coarse/reduced-motion | Regresión > 5 puntos, tareas > 50 ms o jank repetitivo |
| Glassmorphism pierde contraste | Media | Alto | Base opaca, content layer y test de combinaciones | Texto depende del fondo o falla WCAG AA |
| Reactividad provoca rerenders por frame | Media | Alto | Motion Values/variables CSS y perfilado | Commits React continuos durante pointermove |
| Identidad se degrada demasiado en móvil | Media | Medio | Variante touch diseñada, no simple apagado | Móvil parece una plantilla distinta o plana |
| Formulario recibe spam | Alta | Medio | Turnstile, honeypot, rate limit, kill switch | Aumento de rechazos o costo de email |
| Exportación estática queda corta | Baja al inicio | Medio | Trigger explícito para OpenNext/ISR | Builds lentos o actualización frecuente |
| Dependencia de proveedor | Media | Medio | Contenido portable, static output y ADR | Cambio de precios/límites o incompatibilidad |
| Claim no autorizado | Media | Alto | Revisión editorial y permisos | Solicitud de retiro o evidencia ausente |
| Métricas de campo insuficientes | Alta al inicio | Bajo | Lab gate y revisión 30/60/90 | Sin muestra CrUX/RUM |
| Costos inesperados de IA | Alta si se libera | Crítico | IA fuera del MVP y topes duros | Consumo anómalo o abuso |

---

## 13. Reauditoría final posterior al ajuste visual

**Fecha:** 17 de junio de 2026  
**Objeto auditado:** versión 2.1, incluida la arquitectura Glassmorphic Grid Layering, tipografía ultraoptimizada y Framer Motion como motor oficial.  
**Veredicto:** **GO para implementación del MVP**; **NO-GO para lanzamiento hasta aprobar G0–G4**; **NO-GO para IA, Supabase y Railway en el MVP**.

### 13.1 Bloqueantes revaluados

| ID | Bloqueante original o nuevo | Resolución en v2.1 | Flag |
|---|---|---|---|
| B-01 | Static export e ISR incompatibles | Se elige static export; migración dinámica tiene trigger explícito | **GO** |
| B-02 | Cloudflare, Railway y Supabase solapados | Cloudflare es la plataforma del MVP; los demás salen del camino crítico | **GO** |
| B-03 | IA pública sin seguridad/costo | Playground separado con gate propio | **NO-GO IA / GO MVP** |
| B-04 | Autoridad sin evidencia | Frontmatter, reglas editoriales y gate de tres casos verificables | **GO condicionado G0/G2** |
| B-05 | Objetivos absolutos de rendimiento | CWV, budgets repetibles y datos de campo | **GO** |
| B-06 | Datos/privacidad sin controles | Minimización, Worker, política, headers y runbook | **GO condicionado G3/G4** |
| B-07 | Reactividad visual sin presupuesto | Vertical slice, LazyMotion, Motion Values, límites y perfilado | **GO condicionado G1** |
| B-08 | Vidrio puede destruir contraste/legibilidad | Base opaca, content layer, fallback sin blur y WCAG AA | **GO condicionado G1/G3** |
| B-09 | Contenido esencial podría depender de animación | Core semántico en primer render; movimiento como enhancement | **GO** |

**Bloqueantes abiertos para empezar a construir:** ninguno.  
**Bloqueantes abiertos para publicar:** contenido/evidencia aprobados, validación del prototipo visual, QA integral, privacidad/contacto y configuración productiva. Están controlados por gates con criterio de salida verificable.

### 13.2 Hallazgos mayores revaluados

| ID | Hallazgo mayor | Tratamiento | Estado |
|---|---|---|---|
| MA-01 | Framer Motion aumenta JS y trabajo del main thread | `LazyMotion`, bundle mínimo, route splitting y budget de 130 KB gzip | **Aceptado con control** |
| MA-02 | Spotlight/tilt pueden causar rerender por frame | Motion Values y variables CSS; perfilado obligatorio | **Mitigado** |
| MA-03 | `backdrop-filter` es costoso e inconsistente | Áreas acotadas, fallback opaco y reducción en touch/gama baja | **Mitigado** |
| MA-04 | Experiencia premium puede volverse ruido | Matriz de momentos distintivos y prohibición de animación simultánea indiscriminada | **Mitigado** |
| MA-05 | Reduced motion podría parecer una versión inferior | Variante diseñada con luz/contraste estáticos y feedback no espacial | **Mitigado** |
| MA-06 | Tipografías pueden causar CLS o costo de transferencia | Variable font recortada, WOFF2 local y métricas de fallback | **Mitigado** |
| MA-07 | Shared layout transitions pueden ser frágiles con navegación/export | Se aplican solo tras prueba del vertical slice; fallback a transición simple | **GO condicionado** |
| MA-08 | Diseño complejo amplía plazo | Slice primero, reutilización de primitives y estimación de 15–20 días | **Aceptado** |
| MA-09 | Mobile puede perder la firma reactiva | Variante touch basada en scroll/foco/profundidad, probada en G1 | **GO condicionado** |
| MA-10 | SF Pro puede no ser distribuible como webfont | Inter local por defecto; SF Pro solo como system stack/licencia validada | **Mitigado** |

### 13.3 Flags GO

- **GO — Dirección de arte:** la experiencia se aleja deliberadamente del portafolio estático convencional y posee una gramática visual implementable.
- **GO — Glassmorphic Grid Layering:** aprobado con base opaca, blur acotado, fallback y pruebas de contraste.
- **GO — Framer Motion:** aprobado como dependencia central, con carga mínima y presupuestos explícitos.
- **GO — Tipografía:** Inter Variable local optimizada; escala fluida y control de CLS.
- **GO — Arquitectura:** Next.js static export + Cloudflare sigue ofreciendo la mejor relación calidad/precio/potencia para este alcance.
- **GO — Accesibilidad progresiva:** el contenido es semántico y completo sin efectos; touch y reduced motion tienen variantes diseñadas.
- **GO — Inicio de Fase 0/Fase 1:** no existe un bloqueo técnico que obligue a cambiar el stack.

### 13.4 Flags NO-GO

- **NO-GO — Efectos sin vertical slice:** no se replica el sistema a todo el sitio antes de pasar G1.
- **NO-GO — Lanzamiento con jank:** tareas largas repetitivas, commits React por frame o incumplimiento del budget detienen la salida.
- **NO-GO — Vidrio sin fallback:** si el contenido pierde contraste al fallar/desactivar blur, el componente no se aprueba.
- **NO-GO — Movimiento obligatorio:** ninguna navegación, lectura, métrica o CTA puede depender de hover, parallax o transición.
- **NO-GO — SF Pro empaquetada sin licencia:** se usa Inter o system stack hasta contar con autorización verificable.
- **NO-GO — Supabase/Railway preventivos:** no se incorporan sin requisito persistente o workload concreto.
- **NO-GO — IA en MVP:** permanece separada hasta pasar íntegramente la puerta IA.
- **NO-GO — Autoridad ficticia:** métricas, clientes, disponibilidad y capacidad técnica requieren evidencia.

### 13.5 Determinación final

La ampliación visual **no obliga a cambiar el stack ni invalida el GO**. El plan conserva una arquitectura simple y económica, pero ahora especifica una experiencia de autoridad cinética y profundidad técnica claramente diferenciada. El riesgo principal deja de ser la ambigüedad conceptual y pasa a ser la ejecución de rendimiento; queda contenido mediante prototipo temprano, presupuestos, variantes accesibles y gates bloqueantes.

**Determinación:** **GO para construir. GO condicionado para publicar. NO-GO para cualquier efecto que no sobreviva rendimiento, accesibilidad y fallback.**

---

## 14. Fuentes técnicas verificadas

Consultadas el 17 de junio de 2026; antes de contratar o actualizar se deben revisar precios y compatibilidad nuevamente.

- [Next.js — Static Exports](https://nextjs.org/docs/app/guides/static-exports): exportación estática y límites del modelo.
- [Next.js — Incremental Static Regeneration](https://nextjs.org/docs/app/guides/incremental-static-regeneration): ISR no es compatible con static export.
- [Next.js — Installation](https://nextjs.org/docs/app/getting-started/installation): App Router, TypeScript, tooling y requisitos vigentes.
- [Cloudflare — Next.js on Workers](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/): ruta de migración con OpenNext para capacidades dinámicas.
- [Cloudflare Workers — Pricing](https://developers.cloudflare.com/workers/platform/pricing/): estáticos gratuitos, cuotas de Workers y plan pagado desde USD 5 al momento de revisar.
- [Cloudflare Workers — Limits](https://developers.cloudflare.com/workers/platform/limits/): límites de requests y activos.
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/): analítica gratuita orientada a privacidad.
- [Supabase — Pricing](https://supabase.com/pricing): límites del plan gratuito, pausa por inactividad y Pro desde USD 25 al momento de revisar.
- [Web.dev — Web Vitals](https://web.dev/articles/vitals): LCP, INP, CLS y medición al percentil 75.
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/): criterios de accesibilidad nivel AA.
- [Apple Developer — Fonts](https://developer.apple.com/fonts/): fuente oficial y punto de partida para validar licencia de SF Pro.

---

## 15. Aprobación recomendada

**Decisión:** **GO para el MVP revisado.**  
**Condición:** tratar los gates como controles de salida reales, no como checklist posterior.  
**Primera acción:** cerrar Fase 0 — contenido, evidencia, audiencia y CTA— mientras se construye en paralelo la fundación estática de Fase 1.  
**Arquitectura aprobada:** Next.js estable + TypeScript + Tailwind + MDX + Framer Motion/LazyMotion + Glassmorphic Grid Layering + Cloudflare Static Assets; Worker mínimo para contacto.  
**Arquitectura diferida:** Supabase, Railway, SSR/ISR y playground de IA.
