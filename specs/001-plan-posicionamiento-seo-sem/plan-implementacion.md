# Plan - Implementación SEO y observabilidad

## Enfoque

Este plan convierte el diagnóstico de [analisis.md](analisis.md), las prioridades de [acciones.md](acciones.md) y la comparación de [promocion.md](promocion.md) en cambios concretos. El propietario solicita ahora preparar los cambios de la web para ejecutarlos; la restricción de la investigación anterior sobre no implementar mejoras no limita este nuevo trabajo. Los checkboxes reflejan trabajo pendiente, no garantías de mejora en Google.

El sitio declara `https://carlosgrande.me/` como `site_url`. En la muestra local, `docs/robots.txt` anuncia `/docs/sitemap.xml` pero MkDocs sirve `/sitemap.xml`; falta contrastar el comportamiento público. La prueba `tests/e2e/seo-foundations.spec.js` también usa rutas `/docs/`. El contenido local observado puede corresponder a una revisión diferente de producción. No atribuir pérdida de tráfico a WordPress sin datos ni suponer que un resultado de desarrollo describe producción.

Las tareas de los batches 1 a 4 son para agentes. Las intervenciones de cuentas y plataformas están al final, como `@human`, y no impiden terminar el trabajo local independiente. Donde falte una cuenta o red, registrar el bloqueo de la comprobación dependiente y continuar las restantes. Ninguna tarea autoriza gasto, publicaciones externas ni despliegue en producción. Los cambios en `mkdocs.yml`, otras configuraciones, dependencias o flujos requieren la confirmación aplicable de `CLAUDE.md`; preparar antes una propuesta concreta si se descubre que son necesarios. Evitar subir credenciales, códigos de verificación o exportaciones privadas.

## Batch 1 - Comprobar el punto de partida

- [x] @tester · **T01 — Auditar URLs y metadatos**: con el servidor local disponible y, si hay acceso, producción, documentar en [evidencias.md](evidencias.md) fecha, revisión servida, URL, estado y cadena de `Location` para raíz, variantes de protocolo y `www`, `/docs/`, `/robots.txt`, `/sitemap.xml`, `/docs/sitemap.xml` y una URL inexistente. Comparar portada, `about-me`, una página por categoría y un par EN/ES: canonical, hreflang, título, descripción, noindex, JSON-LD y enlaces con y sin JavaScript. Distinguir respuestas y límites por entorno; si producción no responde, conservar el resultado local y no declarar que producción falla.

- [x] @research · **T02 — Identificar redirecciones justificadas**: comprobar en lectura las rutas `/whole-brain-emulation/` y `/contact-me-carlos-grande/` y los candidatos de H-009 de [analisis.md](analisis.md); contrastar contenido, destino equivalente y respuestas públicas disponibles. Registrar una matriz ruta → prueba → destino o ausencia de equivalente. No redirigir todo a portada ni afirmar un código HTTP no observado. Los datos históricos que requieran cuentas quedan en H04 al final.

## Batch 2 - Cambios en la web

- [x] @code-developer · **T03 — Corregir la referencia local al sitemap**: a partir de T01 y del sitemap generado con el `site_url` de raíz, actualizar `docs/robots.txt` para señalar `https://carlosgrande.me/sitemap.xml` si el build confirma que ese es el sitemap canónico generado; conservar las reglas de agentes existentes. Inspeccionar `site/sitemap.xml` y sus `<loc>` para comprobar dominio y rutas. Si el build o evidencia pública muestran otra ubicación válida, documentar la diferencia y no sustituir la referencia a ciegas. La comprobación final del archivo servido en producción corresponde a T10.

  Resultado: se ha actualizado `docs/robots.txt` conservando sus reglas. El servidor local responde 200 a `/sitemap.xml`; una construcción aislada generó `sitemap.xml` en la raíz con `<loc>` bajo `https://carlosgrande.me/`. La construcción no terminó: el plugin social no pudo descargar fuentes por un error de certificado TLS. La ruta y el sitemap de producción siguen pendientes de comprobación en T10; T08 debe repetir la construcción completa.

- [ ] @code-developer · **T04 — Corregir las señales demostrablemente inconsistentes**: la muestra local tenía descripciones en inglés en una página española y los alternates no se verificaron por completo. Con la muestra de T01, revisar `hooks/seo_metadata.py`, `overrides/main.html`, `overrides/home.html` y frontmatter de las páginas EN/ES afectadas. Corregir solo fallos reproducidos de canonical, descripciones por idioma, alternates o enlaces de navegación y verificar el HTML generado de ambos idiomas. Mantener intacta la galería y sus URLs salvo fallo demostrado. Si no aparece ninguna incidencia reproducible, registrar «comprobado, sin cambios». Para un cambio necesario de `mkdocs.yml` u otra configuración preparar el diff y aplicar las reglas de confirmación correspondientes.

- [ ] @code-developer · **T05 — Preparar redirecciones viables**: algunas rutas anteriores de WordPress pueden no llevar al contenido actual; por ejemplo, `/whole-brain-emulation/` tiene como destino candidato `/references/articles/whole-brain-emulation/`, pero la respuesta y la equivalencia necesitan comprobación. Usando T02, identificar la capa real de hosting o CDN y si se gestiona en el repositorio. Implementar solo una redirección permanente cuya ruta, equivalencia y mecanismo de publicación estén comprobados y sean versionables; verificar código, destino y ausencia de bucles. Si depende de configuración externa no versionada o faltan pruebas, documentar el cambio concreto y marcarlo como dependiente de H04/H05; no crear páginas HTML con meta-refresh ni modificar infraestructura por suposición.

- [x] @research · **T06 — Preparar mejoras de identidad y difusión**: las búsquedas por «Carlos Grande» muestran homónimos, por lo que conviene que la web y los perfiles controlados por el propietario se identifiquen mutuamente. Revisar `docs/about-me.md`, `overrides/about-me.html` y los perfiles enlazados para detectar enlaces rotos o inconsistencias verificables. Proponer un cambio puntual en la web solo para información o enlaces ya confirmados; pedir confirmación de titularidad mediante H06 cuando sea necesaria. Preparar un borrador de difusión de la tesis Data Mesh o del recurso de Python en un documento de `specs` para revisión; no publicar ni crear cuentas.

## Batch 3 - Pruebas y comprobación local

- [x] @test-developer · **T07 — Cubrir el sitemap y rutas reales**: actualizar `tests/e2e/seo-foundations.spec.js` para usar las rutas de raíz que sirva el entorno de prueba, incluido `/robots.txt` y `/llms.txt`, preservando las comprobaciones de metadatos y etiqueta. Añadir una comprobación que el robots señale el sitemap canónico esperado, que `/sitemap.xml` responda y que contenga URLs del dominio configurado; diferenciar `mkdocs serve` de un build de producción y comprobar el artefacto de build cuando el servidor de desarrollo reescriba URLs. Evitar aceptar respuestas 200 con HTML de error como sitemap. Añadir pruebas focalizadas para cualquier incidencia reproducida de T04/T05, sin convertir una etiqueta presente en prueba de recepción de Analytics.

- [ ] @tester · **T08 — Ejecutar validación local**: ejecutar `npm run test:build`, `npm run test:e2e -- tests/e2e/seo-foundations.spec.js` y las pruebas afectadas por T04/T05; revisar `site/robots.txt`, `site/sitemap.xml` y una muestra de HTML generado. Documentar comandos, resultados, limitaciones de navegador/red y artefactos generados en [validacion.md](validacion.md). Verificar que los enlaces de ambos idiomas y la respuesta 404 se comportan como se espera. Si faltan herramientas o permisos, registrar el bloqueo sin presentar el resultado como superado.

- [x] @code-reviewer · **T09 — Revisar el diff**: revisar cambios y pruebas de T03–T08 por corrección, accesibilidad de enlaces, i18n, SEO y regresiones; confirmar que no se haya cambiado el identificador de Analytics, añadido un destino de redirección sin equivalencia ni afectado cambios locales ajenos. Resolver los hallazgos con el responsable correspondiente y volver a ejecutar las comprobaciones afectadas.

## Batch 4 - Seguimiento técnico posterior

- [ ] @tester · **T10 — Verificar el despliegue cuando exista**: tras una publicación autorizada y únicamente si está disponible, repetir T01 en `https://carlosgrande.me/`, comprobar que `robots.txt` apunte a un sitemap HTTP 200 con URLs canónicas y contrastar redirecciones aprobadas, 404 y páginas EN/ES. Registrar fecha, versión, respuestas y diferencias. Si no se despliega o no hay acceso público, dejar esta comprobación pendiente sin bloquear las tareas locales terminadas.

- [ ] @architect · **T11 — Traducir resultados externos en cambios concretos**: cuando H01–H04 aporten resultados no sensibles, comparar flujo de Analytics con `extra.analytics.property` en `mkdocs.yml`, incidencias de Search Console y rutas históricas; preparar únicamente los cambios justificados, sus pruebas y alcance. Una etiqueta en HTML no demuestra envío ni recepción. Si fuese necesario editar configuración o infraestructura, preparar el cambio y seguir las reglas de confirmación antes de aplicarlo; no inventar un ID ni crear propiedades.

## Batch 5 - Intervenciones externas del propietario

- [ ] @human · **H01 — Recuperar Analytics**: entrar en [Google Analytics](https://analytics.google.com/) con las cuentas que pudieras haber utilizado y buscar una propiedad y flujo del sitio; comprobar si coincide con `G-T0L50BG8T6`. Si no hay administrador accesible, seguir la [recuperación oficial](https://support.google.com/analytics/answer/15191460?hl=en); si no se puede recuperar, decidir si crear una propiedad nueva, sabiendo que no recupera el histórico. Comunicar solo acceso sí/no y coincidencia del flujo, sin credenciales.

- [ ] @human · **H02 — Verificar la medición**: con H01 resuelta, abrir el sitio en una visita controlada y comprobar junto al técnico tres etapas: etiqueta cargada, solicitud enviada y evento recibido en Realtime o DebugView de la propiedad correcta. Registrar fecha y resultado de cada etapa, sin compartir datos personales; revisar las condiciones de consentimiento aplicables antes de cambiar la recogida.

- [ ] @human · **H03 — Recuperar Search Console**: comprobar acceso a [Search Console](https://search.google.com/search-console/). Si es preciso, verificar la propiedad de dominio mediante DNS o la de prefijo HTTPS con el método disponible; consultar la [guía de Google](https://support.google.com/webmasters/answer/9008080). Una vez T10 identifique el sitemap público correcto, revisar su estado y, si procede, enviarlo; consultar páginas, rendimiento e inspección de una muestra. Compartir solo resultados agregados y el periodo disponible.

- [ ] @human · **H04 — Localizar histórico de WordPress**: buscar exportaciones, copias, sitemap anterior, informes de Analytics/Search Console o listas de enlaces entrantes. Facilitar, si existen, una lista de rutas y datos agregados con periodo y procedencia. Esto permite priorizar redirecciones de T05 sin compartir credenciales ni atribuir causas sin pruebas.

- [ ] @human · **H05 — Gestionar cambios externos de redirección si hacen falta**: tras la matriz de T02 y la propuesta concreta de T05, decidir y aplicar o autorizar en la CDN/hosting los cambios para rutas con equivalencia verificada, si no se gestionan en el repositorio. Comprobar con el técnico códigos, destinos y ausencia de bucles; no reemplazar rutas sin equivalente por la portada.

- [ ] @human · **H06 — Confirmar perfiles y difusión**: confirmar cuáles son tus perfiles profesionales y si enlazan al dominio; revisar el borrador de T06 y decidir si publicarlo en LinkedIn o en una comunidad técnica conforme a sus normas. Comunicar URL y fecha solo si publicas; no es necesario abrir cuentas nuevas.

- [ ] @human · **H07 — Decidir publicidad opcional**: después de H02/H03 y T10, decidir si interesa una prueba o continuar sin gasto. Si se estudia una campaña, comprobar en la cuenta el mínimo, tope total, impuestos, duración, audiencia y destino; los escenarios de 10–20 € y hasta tres ocasiones anuales no son autorización de gasto. Una compra requerirá decisión expresa separada sobre canal e importe.

## Criterio de cierre

El trabajo local se considera terminado cuando T01–T09 estén completadas o identifiquen de forma explícita la dependencia externa que impide una parte, y se hayan ejecutado las pruebas pertinentes. T10 y T11 se completan cuando existan despliegue y datos externos, respectivamente. Los checks `@human` permanecen abiertos hasta que el propietario realice cada intervención o decida descartarla; no son instrucciones para que un agente acceda a sus cuentas o gaste dinero.

## Avance de la implementación

- T02 y T05: inventario en [rutas-historicas.md](rutas-historicas.md). No se ha implantado ninguna redirección: faltan equivalencias y comprobar la configuración real de CDN.
- T03: `robots.txt` apunta al sitemap generado en la raíz. `llms.txt` usa el dominio raíz y enlaza a páginas locales existentes.
- T04: una página traducida muestra descripción y alternates correctos en local; Data Mesh aparece en inglés bajo `/es/` por fallback sin traducción. Sigue pendiente investigar ese caso.
- T06: [borrador de difusión](borrador-difusion.md) preparado; perfiles pendientes de confirmación y ninguna publicación realizada.
- T07 y T09: 35 pruebas unitarias y 7 pruebas SEO en Chromium superadas. Revisión del diff sin bloqueos tras corregir cuatro enlaces que respondían 404 en local. T08 sigue pendiente: el build estricto falló al escribir en la caché existente; el build aislado generó el sitemap pero no terminó por un error de certificado TLS al descargar fuentes. Las pruebas usan el servidor local y no verifican producción.
- T01 y T02 siguen parcialmente pendientes para comprobaciones de producción. T05 necesita datos externos; T10 y T11 dependen de despliegue y datos externos.
