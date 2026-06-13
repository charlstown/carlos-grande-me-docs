# Plan — Subir lychee-action a v2 para cerrar la inyección de código (GHSA-65rg-554r-9j5x)

## Enfoque

Cambio de configuración de CI de bajo riesgo: se bumpea el tag de la action vulnerable, se añade Dependabot para futuros bumps y se sincroniza el TechSpec. El bump del workflow va primero porque cierra la vulnerabilidad y porque su único riesgo real —que algún input no sobreviva a v1→v2— solo se verifica con un run real del workflow en un PR. Dependabot y la documentación son tareas de archivo independientes que no afectan a la compilación del sitio.

## Batch 1 — Bump de lychee-action a v2

- [x] · @code-developer - Editar `.github/workflows/static-validation.yml`, línea 55: cambiar `uses: lycheeverse/lychee-action@v1` por `uses: lycheeverse/lychee-action@v2`. No tocar el bloque `with:` (líneas 56-65): los inputs `args`, `format`, `output`, `jobsummary` y `fail` siguen soportados en v2. Mantener intactos `id: lychee` (línea 54) y el step `Annotate broken links as warnings` que consume `lychee/lychee.json`.

## Batch 2 — Dependabot para GitHub Actions

- [ ] · @code-developer - Crear `.github/dependabot.yml` con `version: 2` y una entrada en `updates` para `package-ecosystem: "github-actions"`, `directory: "/"`, `schedule.interval: "weekly"` y `target-branch: "dev"` (la base de desarrollo del repo). Añadir `commit-message.prefix: "[update]"` para alinear con la convención de commits del repo (`[action] description`). Esto habilita PRs automáticos de bumps de actions (checkout, configure-aws-credentials, lychee-action) sin revisar alertas a mano.

## Batch 3 — Sincronizar TechSpec

- [ ] · @code-developer - Editar `specs/TechSpec.md` línea 108 (tabla *Integration Mapping*): reemplazar `lycheeverse/lychee-action@v1` por `lycheeverse/lychee-action@v2` en la fila "Validación de enlaces".
- [ ] · @code-developer - Editar `specs/TechSpec.md` línea 165 (sección *Dependencies / Tools*): reemplazar `lycheeverse/lychee-action@v1` por `lycheeverse/lychee-action@v2` en la línea "Validación de enlaces".
- [ ] · @code-developer - Editar `specs/TechSpec.md` línea 226 (bloque de comentario de versiones de CI): reemplazar `lycheeverse/lychee-action@v1` por `lycheeverse/lychee-action@v2`.
