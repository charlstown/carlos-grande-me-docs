---
short_title: TechSpec
description: none
date: 2026-06-13
---

> [!abstract] Metadata
> | | |
> |---|---|
> | **Status** | 🟡 Draft |
> | **Owner** | Carlos Grande (@Charlstown) |
> | **Created** | 2026-06-13 |
> | **Updated** | 2026-06-13 |
> | **Version** | v0.1 |
> | **ProductSpec** | [[ProductSpec]] |

## 📌 Scope

Este documento describe el cómo técnico del sitio de documentación estático carlosgrande.me/docs: su stack MkDocs Material, los hooks de build que generan el índice de publicaciones, el theme personalizado y el pipeline de CI/CD que despliega a AWS S3. El qué y el porqué viven en [[ProductSpec]]. Quedan fuera de este TechSpec la infraestructura AWS no versionada en el repo (CloudFront, DNS, IAM más allá de lo referenciado por los workflows) y el contenido editorial de las páginas.

## 🧱 Tech Stack

| Componente | Tecnología | Versión | Rationale |
|------------|------------|---------|-----------|
| Generador de sitio | MkDocs | sin pin (badge README: 1.4) | Generador estático Markdown, estándar para docs |
| Theme | mkdocs-material | sin pin | Theme con galería, búsqueda, light/dark y navegación por tabs |
| Extensiones Markdown | pymdown-extensions | sin pin | Admonitions, tabs, superfences (Mermaid), arithmatex (KaTeX) |
| Variables globales | mkdocs-markdownextradata-plugin | sin pin | Expone `extra:` de `mkdocs.yml` dentro del Markdown |
| Navegación | mkdocs-awesome-pages-plugin | sin pin | Deriva la navegación desde la estructura de carpetas |
| Lightbox galería | mkdocs-glightbox | sin pin | Zoom/lightbox de imágenes |
| Parsing frontmatter | PyYAML | sin pin | Lectura de frontmatter en `generate_pages.py` |
| Runtime build (CI) | Python | 3.9 (CI) | Versión fijada en `actions/setup-python` del workflow |
| Math rendering | KaTeX | v0 (CDN unpkg) | Render de fórmulas vía `arithmatex` + KaTeX desde CDN |

> [!tip] Dependencias de runtime directas
> `mkdocs` · `mkdocs-material` · `pymdown-extensions` · `mkdocs-markdownextradata-plugin` · `mkdocs-awesome-pages-plugin` · `mkdocs-glightbox` · `pyyaml`. Ninguna está pinneada en `requirements.txt`: el build resuelve siempre la última versión compatible (ver [[#📐 ADRs (Architecture Decision Records)|ADR-002]]).

## 🏗️ Module Design

### Topología de build y deploy

```mermaid
flowchart LR
    MD[docs/**/*.md<br/>+ frontmatter] --> MK[MkDocs build]
    OV[overrides/ theme] --> MK
    CFG[mkdocs.yml] --> MK
    MK --> H1[hook generate_pages.py<br/>on_files]
    MK --> H2[hook ignore_file_autoreload.py<br/>on_serve]
    H1 --> PJ[docs/assets/publications.json]
    MK --> SITE[site/ estático]
    PJ --> SITE
    SITE --> CI[GitHub Actions]
    CI --> S3[(AWS S3 bucket)]
```

### Grafo de módulos de la aplicación

```mermaid
flowchart TD
    subgraph hooks
        GP[generate_pages.py]
        IFA[ignore_file_autoreload.py]
    end
    subgraph overrides
        HOME[home.html]
        ABOUT[about-me.html]
        MAIN[main.html]
        HERO[partials/hero.html]
    end
    subgraph assets
        EXTRA[javascripts/extra.js]
        CSS[stylesheets/*.css]
        PUB[publications.json]
    end
    GP -->|escribe| PUB
    HOME -->|lee| PUB
    EXTRA -->|renderiza galería| HOME
    MAIN --> HOME
    MAIN --> ABOUT
    HERO --> HOME
```

#### `hooks/generate_pages.py` — Generador del índice de publicaciones
Recorre las páginas de contenido en el evento `on_files` y emite `docs/assets/publications.json` con id, src, categoría, link, título, fecha y thumbnail, ordenado por fecha descendente. La escritura está protegida por un guard de hash MD5: solo sobreescribe el fichero si el contenido nuevo difiere del existente, evitando que el watcher de MkDocs detecte un cambio espurio y dispare un bucle infinito de live-reload.

#### `hooks/ignore_file_autoreload.py` — Watcher de overrides en serve
Añade un watch explícito de `overrides/` durante `mkdocs serve` sin mutar internals del servidor para no romper el live reload.

#### `overrides/` — Theme Material personalizado
Plantillas que sobrescriben el theme base: `home.html` (galería), `about-me.html`, `main.html` y `partials/hero.html`, `partials/toc-item.html`.

#### `docs/assets/javascripts/extra.js` — Render de la galería en cliente
Anima y pinta las tarjetas de publicaciones en el home a partir de los datos de `publications.json`.

#### `mkdocs.yml` — Configuración del sitio
Define theme, paleta, extensiones Markdown, plugins, hooks, assets y variables globales (`extra:`).

## 🔄 Integration Mapping

| Operación interna | Método | Servicio externo | Notas |
|-------------------|--------|------------------|-------|
| Deploy del sitio | `aws s3 sync site/ s3://$S3_BUCKET --delete` | AWS S3 | Hosting estático; `--delete` purga ficheros obsoletos |
| Credenciales de deploy | `configure-aws-credentials@v4` (OIDC) | AWS IAM (GitHub OIDC) | Asume rol `role/<AWS_ROLE_NAME>` sin claves estáticas |
| Validación de enlaces | `lycheeverse/lychee-action@v1` | Hosts externos enlazados | Comprueba links en `docs/**/*.md` y `overrides/**/*.md` |
| Render de fórmulas | `<script>` CDN | unpkg.com (KaTeX v0) | CSS y JS de KaTeX cargados desde CDN en runtime de página |
| Iconos/emojis | build-time | twemoji (Material) | Generados a SVG en build, sin llamada en runtime |

> [!warning] Comportamientos no obvios
> El sync a S3 usa `--delete`: cualquier objeto en el bucket que no esté en `site/` se elimina. La validación de enlaces (lychee) está configurada con `fail: false` y solo anota warnings, nunca bloquea el deploy. La CDN frente a S3 (CloudFront) no está versionada en el repo: *TBD*.

## ⚠️ Error Handling

### Errores esperados

| Fuente | Error | Acción | Descripción |
|--------|-------|--------|-------------|
| `generate_pages.py` | Frontmatter YAML inválido | Excepción de build | `yaml.safe_load` lanza y MkDocs aborta el build |
| `generate_pages.py` | `date` ausente o mal formada | Orden inconsistente | El sort tolera `date is None` empujándolo al final; formato erróneo puede romper el orden |
| MkDocs build | Plantilla/override inválida | Build falla | Error de Jinja en `overrides/` detiene el build |
| CI lychee | Enlace roto | Warning anotado | `fail: false`: no bloquea, solo anota `::warning` |
| CI deploy | Credenciales OIDC inválidas | Job falla | `configure-aws-credentials` aborta si el rol no asume |

### Propagación

Al ser un sitio estático no hay propagación de errores en runtime hacia un usuario final: los errores se manifiestan en tiempo de build (consola de MkDocs / logs de GitHub Actions). Un build fallido en `Static Validation` impide que se dispare `Build + Deploy` (dependencia `workflow_run` con `conclusion == 'success'`).

## 🩺 Healthcheck

- **Local**: `python -m mkdocs serve -w overrides` arranca en `http://127.0.0.1:8000` sin trazas de error.
- **Build**: `python -m mkdocs build` completa generando `site/` y un `docs/assets/publications.json` con `version` igual a la fecha del build.
- **Producción**: el sitio responde en carlosgrande.me/docs y la galería del home muestra las publicaciones recientes. *No hay endpoint `/health` propio* (hosting estático).

## 📋 Logging

No hay librería de logging dedicada. La observabilidad se apoya en:

| Evento | Nivel | Campos |
|--------|-------|--------|
| Build MkDocs | INFO/WARNING | stdout/stderr (capturable en `mkdocs_out.txt` / `mkdocs_err.txt`) |
| Hooks Python | — | Sin logging propio; errores como excepciones |
| CI Static Validation | GitHub Actions log | Resultado de tests + warnings de enlaces lychee |
| CI Deploy | GitHub Actions log | Salida de `aws s3 sync` |

El verbosity se controla con flags nativos de MkDocs (`--verbose`).

## 🧪 Testing Strategy

### Unit Tests

| Módulo | Qué se testea | Mock/stub |
|--------|---------------|-----------|
| — | *No hay suite de tests en el repo* | — |

### Integration Tests

El workflow `Static Validation` detecta tests (pytest o `npm test`) y los ejecuta si existen; hoy no hay ninguno, por lo que el paso reporta *"No recognizable tests found. Skipping."*. La verificación efectiva es: build correcto + validación de enlaces con lychee.

### Tools

- **Framework**: ninguno configurado (*TBD* si se adopta pytest).
- **Validación de enlaces**: `lycheeverse/lychee-action@v1` sobre `docs/**/*.md` y `overrides/**/*.md`.
- **Cobertura**: sin target definido.

## 🔌 Deployment

```mermaid
flowchart TD
    PR[Pull Request a main] --> SV[Static Validation]
    PUSH[Push a main] --> SV
    SV -->|tests + lychee| OK{success?}
    OK -->|push + branch main| DEP[Build + Deploy]
    OK -->|PR o fail| STOP[No deploy]
    DEP --> BUILD[pip install + mkdocs build]
    BUILD --> AUTH[OIDC assume role AWS]
    AUTH --> SYNC[aws s3 sync site/ --delete]
    SYNC --> LIVE[carlosgrande.me/docs]
```

Comando de build (CI):

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m mkdocs build
```

### Environment variables (secrets de GitHub Actions)

| Variable | Propósito |
|----------|-----------|
| `AWS_ACCOUNT_ID` | Construye el ARN del rol a asumir vía OIDC |
| `AWS_ROLE_NAME` | Nombre del rol IAM asumido en el deploy |
| `AWS_REGION` | Región de AWS para las credenciales |
| `S3_BUCKET_NAME` | Bucket destino del `s3 sync` |

### Local development

```bash
pip install -r requirements.txt
python -m mkdocs serve -w overrides
```

## 📦 Dependencies

Runtime (`requirements.txt`, sin pin de versión):

```
mkdocs
mkdocs-material
pymdown-extensions
mkdocs-markdownextradata-plugin
mkdocs-awesome-pages-plugin
mkdocs-glightbox
pyyaml
```

Dev:

```
# Sin dependencias de desarrollo declaradas en el repo.
# CI usa: actions/checkout@v4, actions/setup-python@v5 (py3.9),
# aws-actions/configure-aws-credentials@v4, lycheeverse/lychee-action@v1
```

## 📐 ADRs (Architecture Decision Records)

### ADR-001: Índice de publicaciones generado por hook en build

**Decision**: Generar `publications.json` con un hook `on_files` de MkDocs en lugar de mantener el listado a mano o con un plugin externo.
**Context**: Se necesitaba una fuente de datos para la galería derivada del frontmatter real. Alternativas: editar un JSON manualmente (se desincroniza) o usar un plugin de blog. Un hook propio da control total sobre el formato y el filtrado por categoría.
**Consequences**:
- (+) El índice nunca se desincroniza del contenido; cero mantenimiento manual.
- (+) Formato a medida consumible por `extra.js`.
- (-) Lógica de parsing propia que mantener (frontmatter, fechas, categorías).
- Mitigación: el hook es pequeño y aislado en `hooks/generate_pages.py`.

### ADR-002: Dependencias sin pin de versión

**Decision**: `requirements.txt` lista las dependencias sin fijar versión.
**Context**: Prioriza recibir siempre las últimas mejoras de mkdocs-material sin mantenimiento de pins.
**Consequences**:
- (+) Builds siempre actualizados sin tocar el repo.
- (-) Riesgo de rotura por cambios incompatibles aguas arriba; builds no reproducibles.
- Mitigación: `Static Validation` corre en cada push/PR a main antes del deploy.

### ADR-003: Hosting estático en S3 con OIDC, sin claves estáticas

**Decision**: Desplegar con `aws s3 sync` autenticando vía GitHub OIDC asumiendo un rol IAM.
**Context**: Evitar almacenar claves AWS de larga vida como secretos. Alternativas: claves IAM estáticas (más riesgo) o GitHub Pages (menos control sobre dominio/infra).
**Consequences**:
- (+) Sin secretos de credenciales de larga vida en el repo.
- (+) Control total del bucket y del dominio.
- (-) Requiere configurar el trust de OIDC en IAM fuera del repo.

### ADR-004: Deploy disparado por `workflow_run` encadenado

**Decision**: `Build + Deploy` se ejecuta solo tras el éxito de `Static Validation` en push a `main`.
**Context**: Garantizar que no se despliega contenido sin pasar validación, y no desplegar en PRs.
**Consequences**:
- (+) Gate de calidad antes de publicar.
- (-) Acoplamiento entre dos workflows; un fallo de orquestación puede impedir el deploy.

## ⚠️ Known Limitations

- Sin pin de versiones: builds no totalmente reproducibles (tradeoff de ADR-002).
- Sin suite de tests automatizados; la validación se limita a build + comprobación de enlaces.
- La validación de enlaces no bloquea (`fail: false`): se pueden publicar enlaces rotos como warnings.
- Inconsistencia documentada entre el flujo de ramas (`contributing.md`/`CLAUDE.md` indican trabajar desde `develop`) y el CI, que solo valida y despliega desde `main`.
- La capa CDN/dominio frente a S3 no está versionada en el repo.

## ❓ Discovery

- [ ] ¿Conviene pinnear versiones (o usar un lockfile) para builds reproducibles, o se mantiene el modelo siempre-última?
- [ ] ¿El deploy debe seguir saliendo de `main` o alinearse con el flujo `develop → main` de las guías?
- [ ] ¿Hay CloudFront u otra CDN frente a S3 que deba documentarse aquí o en un infra-spec aparte?
- [ ] ¿Se adopta pytest para testear los hooks (`generate_pages.py`), dado que `Static Validation` ya lo ejecutaría?
- [ ] ¿La validación de enlaces debería pasar a bloqueante (`fail: true`) en algún momento?
