# Subir lychee-action a v2 para cerrar la inyección de código (GHSA-65rg-554r-9j5x)

> GitHub: #19

## Descripción

El workflow `Static Validation` (`.github/workflows/static-validation.yml`, línea 55) usa `lycheeverse/lychee-action@v1`, afectado por la vulnerabilidad **GHSA-65rg-554r-9j5x** — inyección de código arbitrario en la composite action (severidad **media**, rango vulnerable `< 2.0.2`, parcheado en **2.0.2**).

El riesgo es relevante en este repo porque `Static Validation` corre **en PRs a `main`** y lychee escanea contenido de `docs/**` y `overrides/**`; al contemplar el ProductSpec contribuidores externos vía PR, un PR malicioso con contenido manipulado podría disparar la inyección en el runner. El coste de arreglarlo es mínimo.

## Comportamiento deseado

1. El workflow usa una versión parcheada de lychee-action (`@v2`, ≥ 2.0.2).
2. Dependabot abre automáticamente PRs de bumps futuros de GitHub Actions, sin depender de revisar alertas a mano.
3. La documentación técnica (TechSpec) refleja la versión actual de la action.

## Criterios de aceptación

- [ ] `.github/workflows/static-validation.yml` usa `lycheeverse/lychee-action@v2` (≥ 2.0.2)
- [ ] El workflow `Static Validation` corre en verde tras el bump (inputs `args`, `format`, `output`, `jobsummary`, `fail` siguen funcionando)
- [ ] Existe `.github/dependabot.yml` con `version updates` para el ecosistema `github-actions`
- [ ] La alerta de Dependabot GHSA-65rg-554r-9j5x queda resuelta
- [ ] `specs/TechSpec.md` referencia `@v2` en *Integration Mapping* y *Dependencies* (hoy aparece `@v1`)

## Contexto adicional

- Aviso de compatibilidad: v1→v2 cambió el binario lychee subyacente, pero los inputs usados siguen soportados en v2; conviene revisar el primer run tras el cambio.
- Opción de endurecimiento (fuera del alcance mínimo): pinear a SHA completo en lugar del tag de major para inmunizar contra reescritura de tags.
- Alerta: https://github.com/charlstown/carlos-grande-me-docs/security/dependabot/1

## Rama de desarrollo

- Base: `dev`
- Rama sugerida: `feat/bump-lychee-action-v2`
