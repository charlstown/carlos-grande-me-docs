# Redirecciones de WordPress

`wordpress-redirects.js` es el código fuente de la función CloudFront Functions `carlosgrande-wordpress-redirects`, asociada al evento `viewer-request` de la distribución que sirve `carlosgrande.me`. La tabla contiene únicamente rutas antiguas contrastadas con páginas actuales. Las rutas que no figuran en ella conservan su comportamiento original. Las variantes con y sin barra final redirigen a la misma URL HTTPS canónica; se conservan los parámetros de consulta.

Para validar cambios, ejecuta `node --test cloudfront/wordpress-redirects.test.cjs`. Antes de añadir una ruta, comprueba la equivalencia del contenido y que el destino responde. El historial y las rutas pendientes están en `specs/001-plan-posicionamiento-seo-sem/rutas-historicas.md`.

La asociación de la función a CloudFront se configuró fuera del repositorio; este archivo versiona su código, pero no constituye infraestructura como código ni publica cambios automáticamente. Para actualizarla hay que revisar la función y la distribución existentes, subir el código a DEVELOPMENT, ejecutar `test-function`, publicar la versión LIVE y verificar las respuestas públicas. No reemplaces otras asociaciones sin revisar la configuración. Las redirecciones permanentes pueden permanecer en cachés de clientes.
