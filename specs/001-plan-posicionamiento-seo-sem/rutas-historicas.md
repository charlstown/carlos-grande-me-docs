# Rutas históricas y redirecciones

Consulta del 9 de noviembre de 2026 para las tareas T02 y T05 de [plan-implementacion.md](plan-implementacion.md). La muestra es parcial y no mide el tráfico anterior ni demuestra las causas de ningún cambio de posicionamiento.

## Resultados de la muestra

Las respuestas de desarrollo se obtuvieron con `Invoke-WebRequest` contra `http://127.0.0.1:8000/`. El 9 de noviembre de 2026 a las 17:09 UTC se consultaron las rutas públicas mediante GET directo con `curl.exe --noproxy '*'`, sin seguir redirecciones. Ninguna respuesta de la muestra contenía `Location`; se reflejan los estados observados en ese momento en E-042 de [evidencias.md](evidencias.md). Las copias del extractor utilizadas para investigar el contenido anterior pueden estar desactualizadas y no sustituyen esa comprobación HTTP.

| Ruta antigua | Prueba en desarrollo | Evidencia pública y destino candidato | Decisión |
| --- | --- | --- | --- |
| `/whole-brain-emulation/` | Antigua: 404; `/references/articles/whole-brain-emulation/`: 200. | En producción la [ruta antigua](https://carlosgrande.me/whole-brain-emulation/) devuelve 404 y la [candidata](https://carlosgrande.me/references/articles/whole-brain-emulation/) 200; no se observó `Location`. Una [fuente externa](https://deepresearcharchives.com/item/pJDiBm7qgVf6) referencia la antigua y la página actual trata el mismo tema, pero no se ha podido comparar el contenido histórico completo. | Candidata prioritaria para redirección permanente, condicionada a confirmar identidad del contenido y mecanismo de hosting. |
| `/contact-me-carlos-grande/` | Antigua: 404; `/about-me/`: 200. | Producción devuelve 404 para la antigua y 200 para About, sin `Location`. El extractor muestra una [copia antigua de contacto](https://carlosgrande.me/contact-me-carlos-grande/) con formulario y perfiles; About enlaza perfiles pero no demuestra sustituir el formulario. | No redirigir automáticamente; verificar con el propietario si About ofrece un destino de contacto suficiente. |
| `/category/articles/` | 404. | Producción devuelve 404 sin `Location`. Referida desde cuatro páginas Markdown de `docs/references/articles/`: `whole-brain-emulation.md`, `ubiquitous-computing.md`, `the-chinese-room.md` y `space-of-flows.md`. No se ha identificado un índice equivalente. | Reparar los enlaces internos solo después de identificar un destino vigente y pertinente; decidir la redirección de la URL antigua con el mismo criterio. |
| `/wp-content/uploads/2021/12/BuilderPattern.jpg` | 404. | Producción devuelve 404 `text/html`, sin `Location`. `docs/notebooks/coding/python-design-patterns.md` la utiliza en un enlace y como imagen. | Localizar primero una copia equivalente y su licencia o procedencia antes de sustituirla. No redirigir la imagen a una página genérica. |

El inventario previo y las evidencias originales figuran en H-009 y E-021–E-024 de [analisis.md](analisis.md) y [evidencias.md](evidencias.md). Un archivo o exportación de WordPress, sitemap histórico y datos agregados de Search Console pueden revelar otras rutas; su ausencia no prueba que no existieran.

## Dónde podrían gestionarse

El workflow versionado `.github/workflows/deploy-docs.yml` ejecuta `aws s3 sync site/ ... --delete` y después solicita una invalidación de CloudFront. Esto acredita esos pasos de despliegue en el repositorio, pero no revela la configuración efectiva de distribución, origen ni reglas de redirección. No se ha identificado en el código revisado una definición versionada de esas reglas. El destino de infraestructura y sus capacidades necesitan inspección de la configuración real antes de elegir una implementación.

**Recomendación:** confirmar las equivalencias y la configuración de la capa de publicación; después elegir e implementar en la capa real una redirección 301 o 308 para cada correspondencia aprobada y verificar código, destino final y ausencia de bucles. Si la capa necesaria es externa y no versionada, preparar una propuesta y dejarla para intervención del propietario. No se ha implementado ninguna redirección ni se han modificado cuentas o infraestructura.
