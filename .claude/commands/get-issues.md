---
description: Fetch open GitHub issues, let the user pick which ones to work on, and scaffold a specs/ folder with requirements.md for each selected issue.
---

## Instrucciones

Sigue estos pasos en orden. No generes ningún `plan.md`.

### Paso 1 — Obtener los issues abiertos

Ejecuta el siguiente comando para obtener los issues abiertos del repositorio:

```
gh issue list --state open --json number,title,body,labels --limit 50
```

Si `gh` no está disponible o el comando falla, infórmalo al usuario y detente.

### Paso 2 — Preguntar al usuario qué issues quiere trabajar

Presenta los issues al usuario usando `AskUserQuestion` con `multiSelect: true`.

- Cada opción debe mostrar: `#<número> — <título>`
- Permite seleccionar entre 1 y 4 issues (usa tantas opciones como issues haya, hasta 4; si hay más de 4 issues, muestra los 4 más recientes o relevantes)
- Si no hay issues abiertos, informa al usuario y termina

### Paso 3 — Crear la estructura en `specs/` por cada issue seleccionado

Para **cada issue seleccionado**, realiza lo siguiente:

#### 3a. Determinar el prefijo de la carpeta

Inspecciona el título del issue y sus labels:

| Condición | Prefijo |
|-----------|---------|
| Título empieza por `feat:` o `feature:`, o label `enhancement` | `feat` |
| Título empieza por `bug:` o `fix:`, o label `bug` | `fix` |
| Cualquier otro caso | `feat` |

#### 3b. Construir el slug de la carpeta

Toma el título del issue, elimina el prefijo convencional (`feat:`, `bug:`, `fix:`, `feature:`) si lo tiene, y:
1. Pasa todo a minúsculas
2. Sustituye espacios y caracteres especiales por guiones (`-`)
3. Elimina guiones dobles y guiones al inicio/final
4. Limita a 50 caracteres

El nombre final de la carpeta es: `{prefijo}-{slug}`

Ejemplos:
- `feat: campo descripción obligatorio` → `feat-campo-descripcion-obligatorio`
- `bug: inputs de importe no admiten comas` → `fix-inputs-de-importe-no-admiten-comas`

#### 3c. Verificar que la carpeta no exista ya

Si ya existe `specs/{nombre-carpeta}/`, informa al usuario que el issue ya tiene carpeta y sáltalo.

#### 3d. Crear `specs/{nombre-carpeta}/requirements.md`

Crea el archivo con esta estructura exacta:

```markdown
# {Título del issue sin prefijo convencional}

> GitHub: #{número del issue}

## Descripción

{Cuerpo completo del issue tal como viene de GitHub, sin modificar}

## Criterios de aceptación

- [ ] {criterio 1}
- [ ] {criterio 2}
...
```

- El H1 es el título limpio (sin `feat:`, `bug:`, etc.)
- La referencia GitHub enlaza directamente al issue con su número
- El cuerpo del issue se incluye íntegro, sin resúmenes ni paráfrasis
- Los criterios de aceptación se derivan del cuerpo del issue: extrae el **comportamiento esperado**, los **casos de borde relevantes** y las **condiciones de éxito** que el issue mencione explícita o implícitamente. Cada criterio debe ser verificable (observable en la UI o en un test). No inventes criterios que el issue no contemple. Si el issue ya trae una lista de aceptación, úsala directamente.

### Paso 4 — Confirmar al usuario

Al terminar, muestra una lista de las carpetas creadas y los archivos generados.
Si algún issue fue saltado porque ya tenía carpeta, indícalo también.

### Paso 5 — Generar plan para cada issue

Para cada carpeta creada exitosamente en el Paso 3, invoca la skill `plan-feature` pasando la ruta del `requirements.md` correspondiente.

Ejemplo de invocación: `plan-feature specs/{nombre-carpeta}/requirements.md`

Espera a que `plan-feature` termine para cada carpeta antes de pasar a la siguiente (secuencial).

### Paso 6 — Ejecutar todos los planes generados

Una vez completados todos los `plan.md`, invoca la skill `develop-plan` para que el orquestador los detecte y los ejecute.
