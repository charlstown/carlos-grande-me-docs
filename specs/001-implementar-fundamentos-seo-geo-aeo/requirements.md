# [FEAT] Implementar fundamentos SEO + GEO/AEO (meta descriptions, schema.org, llms.txt, robots.txt, social cards, analytics)
Feature Branch: 001-implementar-fundamentos-seo-geo-aeo
Source Issue: https://github.com/charlstown/carlos-grande-me-docs/issues/57

Created: 2026-08-06

Status: Draft

Input: User description: "#57"

## User Scenarios & Testing (mandatory)

### User Story 1 - Cada página tiene una descripción real y única (Priority: P1)

Como responsable del sitio, quiero que ninguna página en producción use el valor literal `description: none` del frontmatter por defecto, y que la plantilla base deje de proponer ese valor, para que cada página tenga una meta descripción única y real que motores de búsqueda y motores de respuesta con IA puedan usar para indexar y citar el contenido correctamente.

Why this priority: Es el hallazgo más concreto y extendido del estudio (~40+ páginas afectadas, incluida la homepage `docs/index.md`, que directamente no tiene campo `description`). El propio issue lo señala como el problema más tangible detectado al analizar el frontmatter existente.

Independent Test: Recorrer todo `docs/` y verificar que ninguna página en producción tiene `description: none` en el frontmatter (incluida `docs/index.md`, que necesita que se le añada el campo).

Acceptance Scenarios:

1. Given una página cualquiera bajo `docs/` en producción, When se inspecciona su frontmatter, Then el campo `description` contiene un texto único y real, no el valor `none`.
2. Given `docs/index.md` (homepage), When se inspecciona su frontmatter, Then existe un campo `description` con contenido real (hoy no existe el campo en absoluto).

### User Story 2 - Datos estructurados y tarjetas sociales generadas automáticamente (Priority: P2)

Como responsable del sitio, quiero que cada página exponga datos estructurados JSON-LD (schema.org) en el `<head>` y una imagen Open Graph/Twitter Card generada automáticamente, para mejorar tanto el rendimiento en resultados de búsqueda clásicos como la citación por motores de respuesta con IA (GEO/AEO).

Why this priority: El issue lo describe como el segundo bloque de fundamentos técnicos ausentes (no hay plugin `social` ni inyección de JSON-LD configurados en `mkdocs.yml`), necesario para que el sitio cumpla con lo que "tanto el ranking clásico de Google como la citación por IA dan por hecho en 2026".

Independent Test: Cargar cualquier página del sitio construido y verificar en el `<head>` la presencia de: (a) una etiqueta `<script type="application/ld+json">` con schema.org `Article`/`TechArticle`/`BlogPosting` (por post) o `Person`/`Organization` (para el sitio), y (b) meta tags Open Graph/Twitter apuntando a una imagen generada específica de esa página.

Acceptance Scenarios:

1. Given una página de tipo post, When se genera el sitio, Then el `<head>` incluye JSON-LD de tipo `Article`, `TechArticle` o `BlogPosting`.
2. Given el sitio en conjunto, When se genera, Then existe JSON-LD de tipo `Person`/`Organization` representando al sitio/autor.
3. Given cualquier página, When se comparte su URL en una red social, Then se muestra una imagen Open Graph/Twitter Card generada automáticamente para esa página, no una imagen genérica compartida.

### User Story 3 - El sitio es legible y citable por crawlers de IA (Priority: P2)

Como responsable del sitio, quiero que existan ficheros `llms.txt` y `robots.txt` en la raíz del sitio, para que los crawlers de IA (GPTBot, PerplexityBot, ClaudeBot, etc.) y los motores de búsqueda tradicionales puedan descubrir, rastrear y citar el contenido correctamente.

Why this priority: Es un fundamento GEO explícito del estudio 2026 referenciado en el issue (estándar `llms.txt` para citación por IA) y corrige una carencia concreta ya detectada: `site/sitemap.xml` se genera pero no hay `robots.txt` que lo referencie.

Independent Test: Solicitar `/llms.txt` y `/robots.txt` en la raíz del sitio desplegado y verificar que ambos existen, que `robots.txt` referencia `sitemap.xml` y permite explícitamente a los crawlers de IA relevantes, y que `llms.txt` describe el contenido del sitio en un formato apto para crawlers de IA.

Acceptance Scenarios:

1. Given el sitio desplegado, When se solicita `/robots.txt`, Then el fichero existe, referencia `sitemap.xml` y permite explícitamente crawlers como GPTBot, PerplexityBot y ClaudeBot.
2. Given el sitio desplegado, When se solicita `/llms.txt`, Then el fichero existe y describe el contenido del sitio siguiendo el estándar GEO 2026 mencionado en el estudio.
3. Given que el dominio se sirve vía S3 (no GitHub Pages, sin `CNAME` en el repo), When se despliega el sitio, Then ambos ficheros siguen estando disponibles en la raíz a través de ese pipeline.

### User Story 4 - Analytics configurado para medir el impacto (Priority: P3)

Como responsable del sitio, quiero tener `extra.analytics` configurado en `mkdocs.yml` con Google Analytics 4 (GA4), para poder medir el impacto real de los cambios SEO/GEO introducidos.

Why this priority: Es la pieza de medición, dependiente de que los fundamentos anteriores (descripciones, datos estructurados, ficheros de crawler) ya estén en su sitio para que haya algo cuyo impacto medir. El issue no da más detalle que "configurar analytics para medir el impacto de estos cambios".

Independent Test: Inspeccionar `mkdocs.yml` y verificar que el bloque `extra.analytics` existe y está completo (proveedor configurado con las claves/IDs necesarias), y que las páginas generadas cargan el snippet de analytics correspondiente.

Acceptance Scenarios:

1. Given `mkdocs.yml`, When se inspecciona la sección `extra`, Then existe un bloque `analytics` configurado.
2. Given una página generada del sitio, When se carga en el navegador, Then se dispara la llamada/snippet de analytics configurado.

## Edge Cases

- ¿Qué ocurre con páginas que ya tienen `description` sobreescrita manualmente (el issue dice que "casi ninguna" la sobreescribe, implicando que alguna sí)? Deben quedar intactas si su descripción ya es real.
- ¿Cómo se comporta la generación de imágenes Open Graph/Twitter Card para páginas sin imagen destacada propia o con thumbnails ya definidos en `docs/assets/images/thumbnails/`?
- Si el plugin `social` requiere dependencias de imagen no presentes en el pipeline actual, la feature debe explicitar y verificar la instalación de `mkdocs-material[imaging]` y la configuración de `site_url`.
- `llms.txt` y `robots.txt` deben gestionarse como archivos estáticos en la raíz de `docs/` para que MkDocs los copie a la raíz del sitio generado incluso cuando el despliegue final sea a S3.
- ¿Qué ocurre con contenido no indexable o en borrador (si existe) respecto a `robots.txt` y a los crawlers de IA permitidos?

## Requirements (mandatory)

### Functional Requirements

- FR-001: El sistema DEBE asegurar que ninguna página en producción tenga el valor literal `description` igual a `none` en su frontmatter — cada página debe tener una descripción única y real (afecta a ~40+ páginas que hoy usan el valor por defecto de la plantilla de CLAUDE.md). La feature DEBE además cambiar la plantilla de frontmatter de `CLAUDE.md` §5.1 para eliminar `description: none` como valor por defecto.
- FR-002: El sistema DEBE tener configurado el plugin `social` integrado de mkdocs-material en `mkdocs.yml` para generar automáticamente imágenes Open Graph/Twitter Card por página. La implementación DEBE dejar verificada la disponibilidad de `mkdocs-material[imaging]` y una `site_url` válida para el pipeline.
- FR-003: El sistema DEBE inyectar datos estructurados JSON-LD (schema.org) en el `<head>` de cada página con un enfoque mixto: `overrides/main.html` emite el bloque `<script type="application/ld+json">`, `page.meta` alimenta los campos por página (por ejemplo `headline`, `description`, `datePublished`, `image`), `config` alimenta el `Person`/`Organization` del sitio, y un hook opcional puede clasificar `Article` frente a `BlogPosting` o `TechArticle` y normalizar campos.
- FR-004: El sistema DEBE exponer un fichero `llms.txt` en la raíz del sitio que describa el contenido para crawlers de IA, siguiendo el estándar GEO 2026 referenciado en el estudio.
- FR-005: El sistema DEBE exponer un fichero `robots.txt` en la raíz del sitio que referencie `sitemap.xml` y permita explícitamente a los crawlers de IA relevantes. La allowlist DEBE incluir como mínimo `GPTBot`, `PerplexityBot` y `ClaudeBot`, y ampliarse con los principales crawlers de Google, OpenAI/Gemini y Anthropic que se identifiquen durante la implementación.
- FR-006: El sistema DEBE tener `extra.analytics` configurado en `mkdocs.yml` con Google Analytics 4 (GA4) para permitir medir el impacto de estos cambios.

## Success Criteria (mandatory)

### Measurable Outcomes

- SC-001: 0 páginas en producción tienen `description: none` o carecen de campo `description` en su frontmatter (frente a las ~40+ páginas afectadas hoy).
- SC-002: El 100% de las páginas generadas incluyen una imagen Open Graph/Twitter Card específica de esa página en el `<head>`.
- SC-003: El 100% de las páginas generadas incluyen al menos un bloque JSON-LD de schema.org válido en el `<head>`.
- SC-004: `/llms.txt` y `/robots.txt` responden con contenido válido en la raíz del sitio desplegado.
- SC-005: `robots.txt` referencia explícitamente `sitemap.xml` y lista permisos explícitos para los crawlers de IA mencionados en el issue.
- SC-006: `mkdocs.yml` contiene un bloque `extra.analytics` no vacío y verificable.

## Assumptions

- El estudio de tendencias 2026 referenciado en el issue (SEO clásico + GEO/AEO) se toma como fuente de contexto válida para justificar el alcance, sin necesidad de re-investigar en esta fase.
- El sitio sigue construyéndose con MkDocs Material y desplegándose a S3 (`carlosgrande.me`) para producción y a GitHub Pages como preview desde `dev`, tal como describen el issue y el CLAUDE.md del repo.
- Esta feature es exclusivamente de contenido y configuración del sitio de documentación (Markdown, `mkdocs.yml`, `overrides/`) — no implica código de aplicación, tal como aclara explícitamente el issue.
- Los ~40+ páginas con `description: none` y la ausencia de `description` en `docs/index.md` referidas en el issue reflejan el estado real del repo en el momento de redactar el issue.
