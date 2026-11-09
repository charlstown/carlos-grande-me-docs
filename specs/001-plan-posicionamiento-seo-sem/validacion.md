# Validación documental

Fecha de comprobación: 2026-11-09. Alcance: requisitos y documentos de esta carpeta; comprobaciones públicas y locales de muestra. El dictamen independiente final figura al final del documento.

## Cobertura de requisitos

«Documentado con límites» indica que el entregable identifica tanto la evidencia como las comprobaciones aún necesarias; no indica que se haya comprobado el estado real de una cuenta o de producción.

| Requisito | Documento y sección | Evidencia / trazabilidad | Estado |
| --- | --- | --- | --- |
| FR-001 | [analisis.md](analisis.md), trabajo previo, migración y rastreo | H-001–H-009; E-007–E-024 | Documentado con límites de producción e histórico |
| FR-002 | [analisis.md](analisis.md), consultas y oportunidades | H-010–H-011; E-025–E-027 | Documentado con límites geográficos |
| FR-003 | [acciones.md](acciones.md), tabla priorizada | A-001–A-004; H-004–H-009 | Documentado, ejecución posterior |
| FR-004 | [acciones.md](acciones.md), tabla y seguimiento | A-001–A-009, dependencias, esfuerzo y cierre | Documentado |
| FR-005 | [promocion.md](promocion.md), comparación y condiciones | E-033–E-036; A-008–A-009 | Documentado; costes específicos pendientes |
| FR-006 | [acciones.md](acciones.md), indicadores y mantenimiento | A-005–A-006; E-029–E-032 | Documentado; línea de base sin acceso |
| FR-007 | [evidencias.md](evidencias.md), método y registros | E-001–E-036; fechas, fuentes y límites | Documentado |
| FR-008 | [analisis.md](analisis.md) y [acciones.md](acciones.md) | H-001–H-012 y A-001–A-009 | Documentado en specs |
| FR-009 | [analisis.md](analisis.md), trabajo previo y migración | E-007–E-012; H-001–H-003 | Documentado con acceso a GitHub limitado |
| FR-010 | [acciones.md](acciones.md), prioridades; [analisis.md](analisis.md), rastreo | H-004–H-008; A-001–A-006 | Documentado, sin metas de resultados |
| FR-011 | [promocion.md](promocion.md), comparación y microcampañas | E-033–E-036; escenarios de 10–20 € | Documentado; mínimos de cuenta desconocidos |
| FR-012 | [analisis.md](analisis.md), analítica y observabilidad | H-012; E-028–E-032; A-005 | Documentado; acceso y recepción por comprobar |
| FR-013 | [acciones.md](acciones.md), intervenciones externas al final | Seis tareas `@human` posteriores y condicionales | Documentado |
| FR-014 | [promocion.md](promocion.md), difusión externa | E-036; A-007–A-008 | Documentado |
| FR-015 | [acciones.md](acciones.md), cadencia y mantenimiento | A-001–A-009; tareas delegables y límites | Documentado |

## Comprobaciones realizadas

- Se revisaron los escenarios y casos límite: histórico y accesos ausentes, homónimos, rutas antiguas y costes desconocidos figuran como pendientes o hipótesis, no como hechos establecidos. La muestra de búsquedas cubre español e inglés, pero la herramienta no identifica ubicación ni demuestra resultados por país.
- Una comprobación por expresiones regulares de identificadores `E-###`, `H-###` y `A-###` no encontró referencias ausentes en sus documentos correspondientes. Una comprobación de enlaces Markdown relativos no encontró archivos inexistentes. Estas comprobaciones no validan por sí mismas la relación semántica entre cada hallazgo y sus fuentes, ni todos los enlaces externos.
- `acciones.md` contiene seis tareas `@human` bajo su última sección; no hay encabezados posteriores. La publicidad se presenta como escenario y decisión futura; no hay CPC, volumen o mínimo de cuenta inventados.
- Repetición local con `Invoke-WebRequest`: `/robots.txt` responde 200 y declara `https://carlosgrande.me/docs/sitemap.xml`; `/sitemap.xml` responde 200 y `/docs/sitemap.xml` responde 404. Se reproduce E-019 sin diferencias observadas. Estas respuestas son del servidor de desarrollo facilitado por el propietario, no de producción.
- Las tres rutas propuestas para promoción (`/resources/cheatsheets/my-docker-cheatsheet/`, `/resources/thesis/my-data-mesh-thesis/` y `/notebooks/coding/python-generators/`) respondieron 200 en el servidor local; su respuesta pública debe verificarse antes de publicar o anunciar.
- La portada pública se visualizó mediante un extractor con copia rastreada hace dos días, con enlaces de navegación y temas visibles. No se pudieron extraer cabeceras HTTP ni garantizar que la copia refleje la versión desplegada en el momento de la consulta. La documentación oficial de Google Ads consultada vuelve a describir presupuestos totales y diarios diferenciados; la página de LinkedIn describe presupuestos de campaña y conjunto de anuncios. Los términos de DEV son accesibles. Las fuentes y condiciones deben revisarse antes de actuar.
- `git diff --name-only HEAD~4 HEAD` mostró únicamente archivos de esta carpeta de especificación; `git status --short` en el worktree de la feature estaba limpio antes de crear esta validación. El árbol principal conserva cambios previos en `.vscode/settings.json` y elementos no rastreados `.cache/`, `continuous-testing-map.html` y la carpeta de la feature; no se modificaron en este control. El diff no demuestra por sí solo el contenido de cambios previos ni cubre este archivo recién creado.
- No se ejecutó build ni suite automatizada: la entrega es documental y no hay cambios de producción. El navegador automatizado no pudo iniciarse durante T03 por `spawn EPERM` (E-020).

## Límites pendientes y revisión independiente

Siguen pendientes la inspección HTTP directa de producción, las redirecciones, el sitemap público y los metadatos servidos, el render de galería en navegador, el acceso a Analytics/Search Console, el histórico de migración, y la medición de posiciones por ubicación o costes de cuenta. No hay datos para atribuir la variación percibida a una causa. Los pasos posteriores correspondientes figuran en [acciones.md](acciones.md).

**Resultado T13: CHANGES_REQUESTED.** La documentación cubre el alcance principal y distingue razonablemente las limitaciones de producción, cuentas y búsquedas. Hay dos correcciones necesarias para que el propietario pueda revisar y mantener el resultado:

1. **`evidencias.md`, desde E-017:** los bloques de registros están separados por líneas vacías y encabezados, pero carecen de una fila de encabezado y separador Markdown propios. Por ello, la mayoría de las evidencias E-017–E-036 se muestran como párrafos con barras, no como tablas legibles; además, aparecen fuera de orden. Restablecer tablas Markdown válidas y ordenarlas por identificador o agruparlas bajo encabezados descriptivos, conservando todos los datos y límites. Esto afecta a la revisión y trazabilidad exigidas por FR-007 y FR-015.
2. **`analisis.md`, introducción y sección «Hallazgos y limitaciones»:** todavía se afirma que el esquema está pendiente de completar y de asignar identificadores H-XXX, aunque ya contiene H-001–H-012. Sustituir esos textos provisionales por un estado final coherente y una síntesis de los límites realmente pendientes; conservar las reservas sobre producción y cuentas. Esto evita presentar una entrega terminada como incompleta y satisface el objetivo de mantenimiento de FR-015.

Tras corregir, volver a comprobar el renderizado de las tablas, la coherencia del estado y las referencias; repetir el dictamen T13.

**Revisión posterior: CHANGES_REQUESTED.** Se ha corregido el texto provisional de `analisis.md` y se han añadido cabeceras de tabla en `evidencias.md`. Persiste una línea vacía entre el separador de la tabla de «Analítica y cuentas» y E-028: debe eliminarse para que E-028–E-032 formen parte de la tabla. Después, repetir T13.

**Dictamen final T13: PASS.** Se ha eliminado la separación de la tabla y comprobado que cada registro E-001–E-036 pertenece a una tabla con cabecera y separador; los textos provisionales del análisis se han sustituido por el estado de los hallazgos. La documentación satisface el alcance con las limitaciones de producción, acceso a cuentas y datos históricos indicadas arriba. No se ha repetido una comprobación directa de producción ni el navegador bloqueado.
