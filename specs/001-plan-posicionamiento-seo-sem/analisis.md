# Análisis de posicionamiento y observabilidad

Estado inicial: esquema preparado el 2026-11-09. Los apartados pendientes se completarán con observaciones enlazadas a [evidencias.md](evidencias.md), distinguiendo hechos, hipótesis y datos ausentes.

## Contexto y discrepancias documentales

El `site_url` configurado apunta a la raíz del dominio, mientras varios documentos describen `/docs` (E-001, E-002). La respuesta real y las redirecciones requieren comprobación. La configuración declara Analytics aunque ProductSpec cita las métricas de lectura como futuro (E-004); falta verificar el estado real y la disponibilidad de datos.

## Trabajo previo y migración

**H-001 — Fundamentos previos identificados.** El 6 de agosto de 2026 el commit `fe45e0f` incorporó descripciones, JSON-LD, tarjetas sociales, robots, llms, Analytics y una prueba E2E; `287e70a` ajustó rutas de pruebas y `5cc622b` integró la PR #58. La especificación vinculaba el trabajo al issue #57 y se retiró del árbol el 7 de agosto conservándose en el historial (E-007, E-008). El código y los objetivos anteriores orientan la comprobación actual: no acreditan que Google indexe las páginas, que CI pasara ni que Analytics reciba datos.

**H-002 — Cambio documentado de base URL.** El primer cambio SEO configuró `/docs/`, pero `cfcaa57` cambió `site_url` a la raíz el mismo día para las tarjetas sociales; la versión histórica de robots y llms también refería `/docs/` (E-009). Deben contrastarse archivos actuales y comportamiento HTTP antes de deducir un problema. El cambio del `site_url` en Git no determina por sí solo cuándo migró WordPress ni demuestra qué URL servía la portada.

**H-003 — Migración y publicidad sin cronología suficiente.** El propietario declara que la portada conservó dominio y URL y que las rutas interiores cambiaron (E-005). No hay contraste histórico suficiente para validar esas afirmaciones ni medir evolución de visibilidad; tampoco se ha identificado una campaña publicitaria propia en la muestra consultada (E-010). Las búsquedas históricas tuvieron errores, por lo que no prueban que nunca se anunciara. El [README de cookie-site](https://github.com/charlstown/cookie-site/blob/main/README.md) contiene una ruta de contacto candidata (E-012), que aún no demuestra procedencia WordPress ni su correspondencia actual. Fecha exacta, inventario de URLs previas, datos de Search Console/Analytics y acceso a publicidad siguen pendientes. La caída percibida no puede atribuirse a la migración sin datos comparables.

La consulta directa a la PR, issues y discusiones quedó limitada por errores de acceso (E-011); los enlaces y hashes permiten retomarla. Buscar fuentes adicionales y comprobar la ruta candidata en el análisis específico de URLs.

## Rastreo e indexabilidad

Pendiente de comprobar respuestas, redirecciones, robots, sitemap, HTML y enlaces de una muestra documentada. La indexabilidad no demuestra indexación.

## Consultas y oportunidades

Pendiente de documentar términos de marca, intención, homónimos, competencia observada y muestras por idioma y mercado.

## Analítica y observabilidad

Pendiente de contrastar etiquetas y opciones de recuperación, sin inferir la causa del acceso 404 declarado (E-006).

## Hallazgos y limitaciones

Pendiente de asignar identificadores H-XXX y relacionarlos con evidencias y acciones propuestas. Los datos históricos y de cuentas no están disponibles en esta revisión inicial.
