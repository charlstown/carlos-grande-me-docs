# Rutas históricas y redirecciones

## Redirecciones publicadas

El 2026-11-09 se publicó la función `carlosgrande-wordpress-redirects` en CloudFront, asociada a `viewer-request` de la distribución del sitio. Su código y sus pruebas están en `cloudfront/wordpress-redirects.js` y `cloudfront/wordpress-redirects.test.cjs`. La distribución usa un origen web S3 y no tenía funciones ni Lambda@Edge asociadas en el comportamiento principal antes del cambio.

Se implantaron 17 correspondencias de la tabla de la función, seleccionadas tras comparar los textos archivados con los destinos actuales. Las rutas de contacto, About, Letter Cases y otras sin equivalencia suficientemente contrastada no se incluyeron. Antes del cambio las 17 rutas antiguas devolvían 404 y los destinos candidatos 200. Después, una comprobación pública verificó 34 solicitudes (cada ruta con y sin barra final): todas devolvieron 301 con el destino previsto. Una prueba con parámetros repetidos los conservó; portada, robots y sitemap devolvieron 200, y contacto y categoría antigua siguieron devolviendo 404. `node --test cloudfront/wordpress-redirects.test.cjs` pasó 3/3 y el test DEVELOPMENT de AWS confirmó una redirección y el paso sin cambios de una ruta excluida.

La asociación se efectuó en AWS y su código se guarda en el repositorio; no hay despliegue automático ni infraestructura como código para la distribución. Consultar `cloudfront/README.md` antes de actualizarla. Los resultados no acreditan cambios de tráfico o posicionamiento, y quedan rutas antiguas por investigar.

## Snapshot de WordPress aportado por el propietario

El 2026-11-09 el propietario facilitó la [captura de la portada del 12 de diciembre de 2024](https://web.archive.org/web/20241212084814/https://carlosgrande.me/). La lectura directa del HTML archivado identificó las rutas siguientes. Los destinos son candidatos obtenidos de los archivos actuales del repositorio; hay que comparar los contenidos antes de aplicar redirecciones. No representan un inventario completo de WordPress ni prueban tráfico o enlaces entrantes.

| Ruta enlazada en la portada de 2024 | Página actual candidata |
| --- | --- |
| `/about-me-carlos-grande/` | `/about-me/` |
| `/azure-big-picture/` | `/notebooks/data-architecture/azure-big-picture/` |
| `/cloud-migration-planning/` | `/notebooks/data-architecture/cloud-migration-planning/` |
| `/contact-me-carlos-grande/` | Sin equivalencia de contacto confirmada |
| `/google-challenge-01/` | `/notebooks/coding/google-challenge-part-1/` |
| `/my-business-model-canvas/` | `/resources/cheatsheets/my-business-model-canvas/` |
| `/my-data-fabric-thesis/` | `/resources/thesis/my-data-fabric-thesis/` |
| `/my-data-mesh-thesis/` | `/resources/thesis/my-data-mesh-thesis/` |
| `/my-data-product-thesis/` | `/resources/thesis/my-data-product-thesis/` |
| `/my-data-tech-directory/` | Sin destino confirmado |
| `/my-git-cheatsheet/` | `/resources/cheatsheets/my-git-cheatsheet/` |
| `/my-letter-cases-reminder/` | `/resources/cheatsheets/my-letter-cases-reminder/` |
| `/my-linux-cheatsheet/` | `/resources/cheatsheets/my-linux-cheatsheet/` |
| `/my-python-template/` | `/resources/templates/my-python-template/` |
| `/my-screen-splitter/` | `/resources/tools/my-favorite-screen-splitter/` |
| `/python-design-patterns/` | `/notebooks/coding/python-design-patterns/` |
| `/python-generators/` | `/notebooks/coding/python-generators/` |
| `/reinforcement-learning-basics/` | `/notebooks/data-science/reinforcement-learning-basics/` |
| `/rubiks-cube-model/` | `/projects/my-rubiks-cube-model/` |
| `/santamaria-varas-pablo-martinez/` | Sin destino confirmado |
| `/team-topologies/` | `/notebooks/business/team-topologies/` |
| `/whole-brain-emulation/` | `/references/articles/whole-brain-emulation/` |

Comprobación HTTP directa en producción el 2026-11-09: las rutas antiguas `/python-generators/`, `/my-data-mesh-thesis/`, `/azure-big-picture/`, `/whole-brain-emulation/` y `/about-me-carlos-grande/` devolvieron 404; los candidatos actuales de Python generators y Data Mesh devolvieron 200. No se comprobó en esta muestra el estado de todas las demás rutas ni la equivalencia del contenido.

### Candidatas prioritarias contrastadas con el archivo

El 2026-11-09 se consultaron las páginas archivadas enlazadas desde el snapshot de la portada. Los títulos históricos de Python Generators, My Data Mesh Thesis, Whole Brain Emulation y Azure Big Picture coinciden con los temas de los destinos candidatos, lo que refuerza su correspondencia; aún falta contrastar el contenido completo antes de establecer redirecciones permanentes. Las cuatro rutas antiguas respondían 404 en la comprobación indicada arriba.

| URL histórica archivada | Destino propuesto |
| --- | --- |
| [Python Generators](https://web.archive.org/web/20241212084814/https://carlosgrande.me/python-generators/) | `/notebooks/coding/python-generators/` |
| [My Data Mesh Thesis](https://web.archive.org/web/20241212084814/https://carlosgrande.me/my-data-mesh-thesis/) | `/resources/thesis/my-data-mesh-thesis/` |
| [Whole Brain Emulation](https://web.archive.org/web/20241212084814/https://carlosgrande.me/whole-brain-emulation/) | `/references/articles/whole-brain-emulation/` |
| [Azure Big Picture](https://web.archive.org/web/20241212084814/https://carlosgrande.me/azure-big-picture/) | `/notebooks/data-architecture/azure-big-picture/` |

Inspección de AWS pendiente: el 2026-11-09 la CLI local no disponía de credenciales. Antes de elegir una implementación, identificar la distribución efectiva, su origen y las funciones ya asociadas; no reemplazar una asociación sin revisar su código. AWS documenta que una función de CloudFront debe publicarse y asociarse al comportamiento correspondiente ([guía oficial](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/associate-function.html)).

La [consulta al índice CDX de Internet Archive](https://web.archive.org/cdx/search/cdx?url=carlosgrande.me%2F%2A&output=json&filter=statuscode%3A200&collapse=urlkey&fl=original&filter=mimetype%3Atext%2Fhtml) devolvió también rutas de otras fechas y páginas actuales. Ese índice se usa como fuente adicional, no como una lista exclusiva del snapshot de 2024; faltan contrastar fechas y contenido de cada entrada.

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

### Propuesta concreta para H04 y H05

**Decisión condicionada:** si el propietario confirma que el artículo histórico y la página actual son equivalentes, y que la distribución de CloudFront sirve este dominio, estudiar una regla explícita `/whole-brain-emulation/` → `https://carlosgrande.me/references/articles/whole-brain-emulation/`, con respuesta HTTP 301. Mantener fuera de la regla cualquier otra ruta hasta confirmar su destino. La equivalencia y la configuración efectiva de producción siguen sin verificarse; esta es una propuesta, no una redirección activa.

1. **H04, contenido:** contrastar el artículo anterior con la página candidata usando una copia de WordPress o un archivo histórico; anotar título, contenido y conclusión sobre equivalencia. Si no hay copia suficiente, dejar la ruta pendiente sin redirigirla.
2. **H05, infraestructura:** identificar en CloudFront la distribución que sirve el dominio, su origen y el comportamiento que cubre la ruta antigua; comprobar si ya existe una función de viewer request o una configuración de infraestructura mantenida en otro repositorio. No cambiar asociaciones existentes ni compartir credenciales.
3. **Opción recomendada si encaja en la distribución:** preparar una regla versionada en una función de CloudFront para viewer request, que reconozca únicamente la ruta aprobada y devuelva `301` con `Location` al destino canónico; dejar pasar las demás solicitudes sin cambios. La [documentación de AWS sobre redirecciones con CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example_cloudfront_functions_redirect_based_on_country_section.html) muestra el mecanismo de respuesta en viewer request. Definir y probar expresamente qué ocurre con la barra final y los parámetros de consulta antes de publicarla.
4. **Alternativa dependiente del origen:** si la distribución utiliza un endpoint de *website* de S3, evaluar metadatos de redirección; el [endpoint REST de S3 no ejecuta esa redirección](https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-page-redirect.html). Además, el despliegue versionado usa `aws s3 sync ... --delete`, por lo que un objeto de redirección creado fuera de `site/` puede eliminarse en el siguiente despliegue. No cambiar el origen ni crear objetos manuales sin diseñar su persistencia.
5. **Validación tras un cambio autorizado:** comprobar con GET sin seguir redirecciones el código y `Location` para la ruta antigua, repetir con y sin barra final y una consulta de prueba conforme a la política decidida, seguir la cadena hasta el destino y comprobar que no hay bucles. Comprobar también que una ruta no incluida conserva su comportamiento. Registrar fecha, respuestas y versión publicada; la corrección de código por sí sola no acredita el comportamiento de la CDN.

La propuesta no cubre `/contact-me-carlos-grande/`: About no demuestra reemplazar el formulario original. Tampoco cubre `/category/articles/` ni la imagen de WordPress, pues aún faltan destinos equivalentes. Revisar primero las rutas y datos históricos que pueda aportar el propietario.
