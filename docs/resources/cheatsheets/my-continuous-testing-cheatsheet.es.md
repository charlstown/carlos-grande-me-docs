---
short_title: Continuous Testing Cheatsheet
description: Un mapa interactivo de las comprobaciones, pruebas y señales operativas que acompañan a la entrega continua.
date: 2026-11-09
thumbnail: assets/images/thumbnails/continuous-testing-portrait.png
social:
  cards_layout_options:
    background_image: docs/assets/images/thumbnails/continuous-testing-portrait.png
    background_color: transparent
---

# Continuous Testing Cheatsheet

Cuando hablamos de Continuous Testing, no hablamos solo de ejecutar pruebas en CI. También hablamos de las comprobaciones que hacemos mientras desarrollamos, de cómo validamos un despliegue y de lo que observamos cuando el cambio ya está en producción.

Desde que estudié el máster en DevOps tenía pendiente preparar esta chuleta interactiva. Quería reunir las comprobaciones que podemos hacer en cada fase, qué buscamos con ellas y con qué frecuencia tiene sentido ejecutarlas.

No pretendo que sea un pipeline obligatorio. Prefiero verlo como un punto de partida que cada equipo puede adaptar a su producto, sus riesgos y su forma de trabajar.

## 1. El mapa de Continuous Testing

Haz clic en una fase para ver dónde se ejecutan sus comprobaciones y qué podríamos exigir antes de avanzar. Si seleccionas una parada, verás una explicación de su objetivo. En móvil encontrarás las fases ordenadas en vertical.

--8<-- "assets/html/continuous-testing-embed.html:diagram"

## 2. Cómo leer el mapa

El mapa sigue un cambio a través de siete fases: empieza en **Local Prechecks**, pasa por el despliegue en producción y continúa con **Continuous Monitoring & Feedback**. Los colores indican el área de validación y los iconos te ayudan a distinguir entre pruebas, análisis, controles y monitorización.

### 2.1 Áreas de validación

Cada color te dice qué aspecto estamos comprobando. Algunas actividades pueden encajar en más de un área; aquí las he agrupado según su objetivo principal en el mapa.

| Área | Qué buscamos |
|---|---|
| **Estáticas** | Detectar problemas en el código o la configuración sin ejecutar el producto, y comprobar que se puede construir. |
| **Funcionales** | Comprobar que el producto hace lo que esperamos en distintos casos de uso. |
| **No funcionales** | Evaluar cualidades como rendimiento, capacidad, compatibilidad y accesibilidad. |
| **Contratos** | Comprobar que los componentes respetan los acuerdos sobre los datos y mensajes que intercambian. |
| **Seguridad** | Detectar vulnerabilidades y comprobar que los accesos y permisos funcionan como deberían. |
| **Cumplimiento** | Revisar requisitos y políticas aplicables, como licencias, privacidad o trazabilidad. |
| **Operacionales** | Comprobar que podemos desplegar, observar, mantener y recuperar el producto. |

### 2.2 Tipos de actividad

El icono de cada parada nos dice qué estamos haciendo. Me parece útil distinguirlos porque no todo lo que aparece en el mapa es una prueba en sentido estricto.

| Actividad | En qué consiste |
|---|---|
| **Prueba** | Ejecutamos una comprobación y contrastamos el resultado con lo que esperábamos. Por ejemplo, verificar que una regla de negocio funciona. |
| **Análisis** | Revisamos código, dependencias u otros elementos para detectar posibles problemas. Por ejemplo, buscar vulnerabilidades conocidas. |
| **Control** | Verificamos que se cumple una condición o realizamos una acción necesaria para avanzar. Por ejemplo, comprobar la configuración antes de desplegar. |
| **Monitorización** | Observamos el comportamiento del producto a lo largo del tiempo. Por ejemplo, seguir su disponibilidad y sus alertas. |

La frecuencia que aparece en cada parada es orientativa. Una comprobación rápida puede ejecutarse con cada cambio; una prueba prolongada de carga o un ejercicio de recuperación pueden hacerse periódicamente. La monitorización, por su parte, continúa aunque no haya nuevos despliegues.

## 3. Cómo adaptarlo a tu equipo

Si estás preparando tu propio flujo, esta tabla puede servirte para empezar. No necesitas hacer todo: elige las comprobaciones que tengan sentido para tu producto, su arquitectura y los riesgos de cada cambio.

| Fase | Comprobaciones habituales | Qué buscamos |
|---|---|---|
| **Local Prechecks** | Formato y lint, compilación rápida, pruebas unitarias y detección de secretos. | Encontrar errores evidentes antes de compartir el cambio, sin esperar al pipeline. |
| **Change Validation** | Build en CI, pruebas unitarias, validación de contratos, análisis de código y dependencias, y comprobaciones automáticas de accesibilidad cuando haya interfaz. | Detectar fallos que no aparecían en local y comprobar que se cumplen los controles necesarios antes de integrar. |
| **Integration & Packaging** | Pruebas de integración y contratos, comprobación de cambios de datos cuando corresponda y análisis del artefacto generado. | Descubrir componentes incompatibles o problemas en el artefacto que vamos a desplegar. |
| **Development Validation** | Smoke tras el despliegue, flujos principales, comunicación entre servicios, permisos y llegada de logs, métricas y trazas. | Ver si aparecen errores de configuración o integración al ejecutar el producto en un entorno compartido o temporal. |
| **Pre-Production Validation** | Regresión y aceptación, seguridad, carga y concurrencia, compatibilidad, accesibilidad y restauración de copias. | Revisar la versión con más detalle en un entorno parecido a producción antes de liberarla. |
| **Production Deployment & Validation** | Despliegue progresivo cuando sea apropiado, smoke con efectos controlados y revisión de errores y latencia frente a los criterios acordados. | Detectar problemas con la configuración o el tráfico real y actuar si necesitamos detener el despliegue o recuperar el servicio. |
| **Continuous Monitoring & Feedback** | Indicadores y objetivos de servicio, alertas accionables, recorridos sintéticos y revisión de incidentes. | Detectar degradaciones con el tiempo y encontrar mejoras para el producto, las alertas y las pruebas. |

No hace falta ejecutar todo con cada cambio. Puedes reservar las pruebas rápidas para cada integración y programar una carga prolongada o una restauración completa con la frecuencia que necesite tu equipo.

Y una distinción que a mí me ayuda: en producción, observar métricas y alertas es **monitorización**. Ejecutar un recorrido sintético o comprobar que una alerta se dispara y llega al lugar correcto sí son pruebas.
