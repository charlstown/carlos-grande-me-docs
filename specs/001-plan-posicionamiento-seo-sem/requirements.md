# Plan de posicionamiento SEO y SEM

**Feature Branch**: `feature/001-plan-posicionamiento-seo-sem`  
**Created**: 2026-11-09  
**Status**: Borrador  
**Input**: Solicitud en texto libre: analizar la pérdida percibida de posicionamiento tras migrar de WordPress a MkDocs y crear un plan para mejorar la visibilidad del sitio, considerando el nombre del autor, sus temas técnicos, SEO, SEM y publicidad de bajo presupuesto.

## User Scenarios and Testing

1. Como propietario, quiero conocer la visibilidad, indexación y contenido actuales y los posibles efectos de la migración. El diagnóstico debe distinguir hechos comprobados, hipótesis y limitaciones.
2. Quiero entender las oportunidades de búsqueda para «Carlos Grande Núñez», «Carlos Grande» y combinaciones de Carlos Grande con coding, código, data y DevOps. El análisis debe contemplar estos ejemplos y justificar los términos adicionales.
3. Quiero un plan priorizado de mejoras de la web y su contenido. Cada acción propuesta debe incluir su justificación y forma de seguimiento.
4. Quiero saber si tiene sentido anunciar este tipo de blog o invertir una cantidad pequeña inicialmente. La recomendación debe explicar alternativas, posibles costes, beneficios, límites y condiciones de decisión.

## Edge Cases

- Si faltan datos históricos o de la migración, señalarlo y no atribuir causas sin pruebas.
- Si faltan accesos a analítica, buscadores o publicidad, describir las comprobaciones pendientes y sus consecuencias.
- Si un término coincide con otras personas o tiene varios significados, considerar la intención de búsqueda y la competencia observada.
- Si no hay datos fiables de volumen, costes o resultados, no presentar estimaciones como hechos.
- Si se detectan URLs antiguas, redirecciones o páginas no indexadas, evaluar su relevancia y documentar la evidencia disponible.

## Requirements

- **FR-001**: Analizar el posicionamiento y descubrimiento actuales de `carlosgrande.me`, sus aspectos técnicos, contenido y los indicios disponibles sobre la migración.
- **FR-002**: Investigar los términos de marca personal y temáticos indicados, sus posibles intenciones de búsqueda y oportunidades relacionadas con el sitio.
- **FR-003**: Identificar mejoras SEO aplicables a la web y su contenido, considerando tanto lo existente como las carencias detectadas.
- **FR-004**: Elaborar un plan priorizado que relacione hallazgos, acciones, dependencias, esfuerzo estimado cuando sea posible y criterios de seguimiento.
- **FR-005**: Evaluar SEM y publicidad para este tipo de blog, incluida la conveniencia de una inversión inicial pequeña y sus alternativas.
- **FR-006**: Proponer indicadores y una forma de revisar el plan, señalando los datos y accesos necesarios.
- **FR-007**: Documentar fuentes, fechas de consulta, evidencias, supuestos y limitaciones para revisar las recomendaciones.
- **FR-008**: Documentar en `specs` el análisis y un plan de los cambios necesarios; la ejecución de mejoras y la contratación de publicidad quedan para después.
- **FR-009**: Revisar el trabajo previo de SEO y observabilidad del sitio MkDocs, incluido el historial de GitHub, y partir de lo existente. Investigar si hay indicios de uso previo de publicidad; no asumir que existe una cuenta o campaña.
- **FR-010**: Priorizar la preparación técnica para el rastreo, la indexación y la difusión en Google, y revisar opciones de observabilidad sin exigir metas numéricas ni validar la calidad del contenido.
- **FR-011**: Valorar dos o tres posibles canales de promoción y pequeñas campañas orientativas de 10–20 € hasta unas tres veces al año, si son viables y apropiadas; justificar si no lo son.
- **FR-012**: Revisar y proponer la puesta a punto de analítica y observabilidad, considerando que el propietario no dispone actualmente de una configuración operativa y que su acceso anterior a Google Analytics devuelve un 404. No asumir la causa ni que existan cuentas accesibles.
- **FR-013**: Identificar en el plan, al final y con la marca `@human`, las acciones externas que no puedan realizar los agentes y requieran la intervención del propietario.
- **FR-014**: Incluir recomendaciones de difusión externa, como perfiles profesionales y comunidades técnicas, además de las acciones sobre el sitio y la publicidad.
- **FR-015**: Documentar el análisis y el plan en `specs` para que el propietario los revise y mantenga inicialmente, y valorar qué tareas de mantenimiento podrían delegarse a agentes más adelante.

## Key Entities

- **Término de búsqueda**: expresión de marca personal o temática, con su intención y oportunidad.
- **Hallazgo**: observación o hipótesis con su evidencia y limitaciones.
- **Acción propuesta**: mejora o experimento con prioridad, justificación y seguimiento.
- **Indicador**: medida propuesta para evaluar la evolución y utilidad de una acción.

## Success Criteria

- El diagnóstico cubre el sitio y los indicios disponibles de la migración, diferenciando evidencia, hipótesis y datos ausentes.
- El análisis considera todos los ejemplos de términos y explica las oportunidades y dificultades encontradas.
- El plan identifica acciones priorizadas, sus motivos y cómo evaluarlas, sin garantizar resultados en buscadores.
- La evaluación de SEM permite decidir si explorar publicidad de bajo presupuesto y qué información falta.
- Las fuentes y limitaciones permiten revisar y actualizar las conclusiones.

## Assumptions

- El sitio es `https://carlosgrande.me/`, identificado en la configuración del repositorio.
- La pérdida de posicionamiento es una percepción inicial que deberá contrastarse con los datos disponibles.
- La feature produce un análisis y un plan; no presupone implementar mejoras ni realizar gasto publicitario.
- El blog es gratuito y no persigue lucro. Busca difundir recursos, dar a conocer la identidad digital de Carlos Grande Núñez y atraer lectores; las oportunidades profesionales son un posible resultado secundario.
- Se priorizan España, Estados Unidos, Inglaterra y Europa en general, para público tecnológico e IT, en español e inglés.
- No se fijan metas numéricas ni plazos de resultados. Se plantea un horizonte orientativo hasta septiembre del año que viene y presupuestos publicitarios muy reducidos; no se autoriza gasto por esta especificación.
- El historial local registra la integración de la PR #58 de fundamentos SEO, GEO y AEO, y la configuración actual incluye Google Analytics, `robots.txt` y metadatos estructurados. Esto no acredita el acceso a las cuentas, su funcionamiento en producción ni la existencia de campañas.
- El propietario indica que tenía Google Analytics, pero el acceso indicado le devuelve un 404 y actualmente no dispone de una configuración operativa. Se revisará qué debe recuperarse o configurarse de nuevo.
- Según el propietario, la portada conservó el mismo dominio y URL tras la migración desde WordPress, pero cambiaron las URLs de las páginas. La migración ocurrió hace aproximadamente un año o más; no se ha confirmado una fecha exacta ni la disponibilidad de datos históricos.
