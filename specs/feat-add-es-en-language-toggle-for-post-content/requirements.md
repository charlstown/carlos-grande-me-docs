# Add ES/EN language toggle for post content

> GitHub: #11

## Descripción

Permitir que el cuerpo de los posts esté disponible en dos idiomas, castellano e
inglés. El idioma por defecto al abrir un post se decide en cliente a partir del
navegador del visitante; dentro del post abierto se ofrece un icono para alternar
entre ES y EN. El alcance se limita al **cuerpo de los posts**: navegación, home,
galería y About permanecen en inglés.

**Decisión de arquitectura (resuelta):** la asociación entre las dos versiones de un
post se implementa con el plugin **`mkdocs-static-i18n`** con `docs_structure: suffix`.
El contenido en **inglés (idioma por defecto) se escribe sin sufijo** (`post.md`) y la
traducción al **castellano lleva sufijo `.es`** (`post.es.md`); el fichero sin sufijo se
asigna automáticamente al idioma por defecto, de modo que **los posts existentes no se
renombran**. El plugin construye una página estática por idioma con **URL propia**
(inglés en la raíz, castellano bajo prefijo localizado), lo que mantiene el contenido ES
**indexable y compartible** (SEO-friendly) y expone metadata nativa de *alternates*
entre versiones.

> [!warning] Riesgo de mantenimiento asumido
> `mkdocs-static-i18n` está **congelado (frozen as-is)** porque el core de MkDocs
> quedó congelado tras el cierre de v2.0 ([issue #342](https://github.com/ultrabug/mkdocs-static-i18n/issues/342)).
> Funciona hoy con MkDocs 1.x y mkdocs-material, es maduro y probado, y el equipo de
> Material confirmó que **Zensical reutilizará su estructura de config** (migración
> futura barata, sin fecha). Por ello esta feature **debe pinear** `mkdocs`,
> `mkdocs-material` y `mkdocs-static-i18n` en `requirements.txt` para blindar el
> build (excepción puntual al ADR-002, que deja las dependencias sin pin).

## Comportamiento deseado

1. El idioma por defecto del cuerpo del post se resuelve en cliente con esta
   precedencia: **preferencia manual guardada (localStorage) → `navigator.language`
   → fallback a inglés**. La preferencia manual es **global** (manda en todos los
   posts y en visitas posteriores), no por-post.
2. La detección por `navigator.language` mapea **cualquier locale `es*`**
   (`es`, `es-ES`, `es-MX`, `es-AR`, `es-419`, …) a castellano; cualquier otro valor
   → inglés.
3. En un post con ambas versiones aparece un **icono de cambio de idioma propio**,
   ubicado en la **zona superior del área de contenido / junto al TOC**, que alterna
   entre ES y EN y actualiza la preferencia global guardada. El icono es un **SVG
   personalizado** provisto por el proyecto (no el selector/icono nativo del plugin);
   el asset fuente está en `assets/language-toggle-icon.svg` dentro de esta carpeta de
   spec.
4. La visibilidad del icono se decide a partir de la **metadata de *alternates* del
   plugin `mkdocs-static-i18n`**: solo se muestra cuando el post tiene ambas versiones.
5. Si un post solo existe en un idioma (típicamente inglés), se sirve esa versión
   (fallback) y el icono de cambio se **oculta**.
6. El resto del sitio (menús, home, galería, About) permanece en inglés; no se
   busca i18n completo del sitio, solo del cuerpo de los posts.

## Criterios de aceptación

- [ ] El sitio integra `mkdocs-static-i18n` y se **pinean** `mkdocs`,
      `mkdocs-material` y `mkdocs-static-i18n` en `requirements.txt`.
- [ ] Un post bilingüe se compone del fichero por defecto sin sufijo `post.md` (inglés)
      más su traducción `post.es.md`, y genera una URL estática por idioma (EN por
      defecto en raíz, ES bajo prefijo localizado), sin renombrar los posts existentes.
- [ ] Al abrir un post, el idioma mostrado se resuelve en cliente con la precedencia
      **manual (localStorage) → `navigator.language` (`es*` → ES) → EN**.
- [ ] La preferencia de idioma elegida manualmente se guarda en `localStorage` y se
      aplica **globalmente** en todos los posts y en visitas posteriores.
- [ ] El icono de cambio de idioma es un componente propio en la zona de
      contenido/TOC que usa el **SVG personalizado** `assets/language-toggle-icon.svg`
      (no el icono nativo del plugin) y aparece **únicamente** en posts con ambas
      versiones, usando la metadata de *alternates* del plugin para decidirlo.
- [ ] Cuando falta la traducción, se hace fallback al idioma existente y el icono se
      oculta.
- [ ] La navegación, el home, la galería y la página About permanecen en inglés.
- [ ] Los 47 posts existentes (solo en inglés) siguen funcionando sin traducción
      gracias al fallback, y su URL/comportamiento actual no cambia.
- [ ] Se traduce **1 post piloto** a castellano para validar el flujo end-to-end
      (par de ficheros, alternates, toggle, redirección por defecto y persistencia).

## Contexto adicional

- Sitio estático MkDocs Material desplegado en AWS S3: la detección "por región" se
  resuelve en **cliente** (idioma del navegador), no por geolocalización IP/CDN.
- Como el plugin genera URLs estáticas por idioma, el "idioma por defecto según
  navegador" se implementa con un **pequeño script de redirección en cliente**: al
  cargar la versión por defecto (EN), el script consulta `localStorage` y
  `navigator.language` y, si procede y existe el alternate ES, redirige a su URL.
- El toggle es un **componente propio** (no el selector nativo del plugin), en línea
  con los precedentes de JS de cliente del repo (p. ej. `ReadingProgress`), testeable
  con la infra existente (Vitest/jsdom y Playwright). Usa el icono SVG personalizado
  `assets/language-toggle-icon.svg` (incluido en esta carpeta de spec); su ubicación
  final en el build (p. ej. `docs/assets/images/icons/` o `overrides/.icons/`) la
  decide el `plan.md`.
- La traducción aplica solo al cuerpo del post; no se busca i18n completo del sitio.
- **Alcance:** esta feature entrega el **mecanismo** (detección + toggle + fallback +
  persistencia + integración del plugin) **más 1 post piloto traducido**. Traducir el
  resto de los 47 posts queda fuera y se hará a mano, post a post, más adelante.

> ⚠ Gap a resolver en diseño/implementación: definir el prefijo de URL exacto para el
> idioma no-default (p. ej. `/es/...`) y validar que la redirección en cliente no
> cause *flicker* ni penalice el crawling (preferir no redirigir a bots / respetar la
> URL canónica del idioma por defecto). También confirmar la interacción del plugin
> `search` con i18n (índice de búsqueda por idioma).
