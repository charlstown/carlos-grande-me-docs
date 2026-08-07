# Plan — Invalidar caché de CloudFront mediante OIDC

- [x] @code-developer · Actualizar `.github/workflows/deploy-docs.yml`: conservar OIDC y S3, permitir relanzamiento manual seguro e invalidar `/*` con `CLOUDFRONT_DISTRIBUTION_ID`; ausencia de secreto o error AWS debe emitir warning sin fallar el deploy.
- [x] @tester · Validar YAML, orden S3→invalidación, ausencia de secretos impresos y degradación a warning sin credenciales AWS.
- [x] @code-reviewer · Revisar seguridad, permisos OIDC y corrección del workflow.
- [x] @human · Crear el secreto `CLOUDFRONT_DISTRIBUTION_ID` y conceder al rol OIDC `cloudfront:CreateInvalidation` en el ARN de la distribución; relanzar el deploy de main.
- [x] @tester · Tras la configuración humana, verificar `og:image` HTTP 200 en una ruta EN y ES.
