---
description: Abre un bug o una feature request en GitHub. Detecta automáticamente el tipo; si no está claro, pregunta. Bug → investiga, reproduce y documenta. Feature → clarifica en hasta 3 preguntas y abre el issue. Trigger con /new-issue.
---

## Instrucciones generales

No escribas código. No hagas refactors. No abras PRs. Tu único objetivo es **documentar y abrir un issue en GitHub**.

---

## Paso 0 — Clasificar: bug o feature

Lee el input del usuario (argumento del comando o mensaje previo) e identifica el tipo.

**Señales de bug:**
- Stack trace, mensajes de error, `TypeError`, `Cannot read`, `500`, `404`
- Frases como "no funciona", "da error", "falla", "dejó de", "se rompe", "no carga"

**Señales de feature:**
- Frases como "quiero que", "añadir", "nueva funcionalidad", "poder hacer", "sería útil", "feature", "mejora"

**Decisión:**

| Caso | Acción |
|------|--------|
| Señales claras de **bug** | Ir directamente al **Flujo Bug** |
| Señales claras de **feature** | Ir directamente al **Flujo Feature** |
| Ambiguo o sin descripción | Usar `AskUserQuestion` con la pregunta siguiente |

Si es ambiguo, usa `AskUserQuestion`:
- Pregunta: "¿Qué tipo de issue quieres abrir?"
- Opciones:
  - `Bug` — algo que funciona mal o da error
  - `Feature` — nueva funcionalidad o mejora

Con la respuesta, ve al flujo correspondiente.

---

---

# FLUJO BUG

---

### B0 — Obtener la descripción del problema

El input puede llegar de tres formas:

1. **Argumento del comando** (texto tras `/new-issue`) → úsalo directamente.
2. **Mención en el mensaje** del usuario → úsalo tal cual.
3. **Sin descripción** → usa `AskUserQuestion`:
   - Pregunta: "¿Cuál es el bug que quieres reportar?"
   - Opciones: `Pego el log de error ahora`, `Describo el comportamiento`, `Indico los pasos para reproducirlo`

Guarda el input como **DESCRIPCION_INICIAL**.

Clasifica mentalmente el tipo de input:

| Tipo | Señales |
|------|---------|
| **Log de error** | Stack trace, `Error:` / `TypeError:` / `at ...` |
| **Descripción funcional** | "el botón no funciona", "no carga", "aparece en blanco" |
| **Pasos de reproducción** | Lista numerada de acciones que provocan el fallo |

---

### B1 — Investigar el código

Usa `Grep`, `Glob`, `Read` para entender qué parte del código está implicada.

#### B1a. Extraer palabras clave

Del **DESCRIPCION_INICIAL** extrae:
- Nombres de componentes, funciones, rutas o mensajes de error.
- Si es un log: nombre del error y primeras líneas del stack trace.
- Si es una descripción: términos funcionales clave.

#### B1b. Localizar archivos relevantes

1. Si hay ruta en el stack trace → lée ese archivo directamente.
2. Si hay nombre de función o componente → `Grep` por ese nombre.
3. Si es descripción funcional → `Glob` en las rutas relacionadas.

Lee los archivos relevantes. Presta atención a:
- Manejadores de eventos, llamadas a API, lógica condicional.
- Props o estados que podrían estar undefined/null.

#### B1c. Revisar cambios recientes

```bash
git log --oneline -15
```

Si algún commit reciente toca los archivos relevantes:

```bash
git show {hash} --stat
git diff {hash}^ {hash} -- {archivo}
```

Guarda como **HALLAZGOS_CODIGO**: archivos implicados, causa probable, commits relacionados.

---

### B2 — Reproducir el error en el navegador

> Si el error es claramente de servidor/build (no UI), salta al B3.

#### B2a. Verificar el servidor de desarrollo

```powershell
$conn = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($conn) { Write-Host "Puerto 8000 activo" } else { Write-Host "Puerto 8000 libre" }
```

Si no está activo, lanza el servidor en background: `mkdocs serve`. Espera ~10 s.

#### B2b. Abrir el navegador

1. `mcp__chrome-devtools__list_pages` — obtén páginas abiertas.
2. Si ninguna apunta a `127.0.0.1:8000`: `mcp__chrome-devtools__new_page`.
3. `mcp__chrome-devtools__navigate_page` → `http://127.0.0.1:8000{ruta}`.

#### B2c. Reproducir e intentar el fallo

| Tipo | Qué hacer |
|------|-----------|
| Log con ruta | Navega al path, ejecuta la acción |
| Descripción funcional | Navega a la sección, interactúa |
| Pasos de reproducción | Síguelos: `fill`, `click`, `navigate_page` |

#### B2d. Capturar evidencias

1. Screenshot: `mcp__chrome-devtools__take_screenshot`
2. Consola: `mcp__chrome-devtools__list_console_messages` (filtra `error` y `warning`)
3. Red: `mcp__chrome-devtools__list_network_requests` (busca 4xx / 5xx)
4. DOM (opcional): `mcp__chrome-devtools__take_snapshot`

Guarda como **EVIDENCIAS**: pasos ejecutados, reproducido (Sí/No/Parcialmente), mensajes de consola, peticiones fallidas, screenshot.

---

### B3 — Sintetizar el informe

| Campo | Contenido |
|-------|-----------|
| **Título** | Frase clara en imperativo: "El botón X falla cuando Y" |
| **Descripción** | Qué ocurre vs. qué debería ocurrir |
| **Pasos para reproducir** | Lista numerada exacta |
| **Comportamiento esperado** | Lo que el usuario debería ver |
| **Comportamiento actual** | Lo que realmente ocurre |
| **Evidencias** | Consola, red, screenshot |
| **Archivos implicados** | Rutas y líneas del B1 |
| **Posible causa** | Hipótesis sin solución |
| **Entorno** | Rama git, OS, URL |

---

### B4 — Confirmar con el usuario

Muestra:

```
Voy a abrir el siguiente issue:

Título: {título}
Label: bug
Reproducido: Sí / No / Parcialmente

Resumen:
{2-3 líneas del comportamiento actual vs. esperado}

Archivos implicados:
- {archivo:línea}

¿Procedo?
```

`AskUserQuestion`:
- Pregunta: "¿Abro el issue con este contenido?"
- Opciones: `Sí, abre el issue`, `Ajusta el título`, `Añade más contexto antes`

Si el usuario ajusta, actualiza antes de continuar.

---

### B5 — Crear el issue en GitHub

```bash
gh issue create \
  --title "{título}" \
  --label "bug" \
  --body "$(cat <<'EOF'
## Descripción

{qué ocurre vs. qué debería ocurrir}

## Pasos para reproducir

{lista numerada}

## Comportamiento esperado

{lo que debería ocurrir}

## Comportamiento actual

{lo que ocurre realmente}

## Evidencias

### Consola
\`\`\`
{mensajes de consola, o "Sin errores en consola"}
\`\`\`

### Peticiones de red
{peticiones fallidas, o "Sin peticiones fallidas"}

### Captura de pantalla
{ruta del screenshot, o "No disponible"}

## Archivos implicados

{lista de archivos con rutas y líneas}

## Hipótesis de causa

{análisis técnico — sin proponer solución}

## Entorno

- Rama: \`{git branch --show-current}\`
- OS: Windows 11
- URL reproducción: \`{url}\`
- Reproducido: {Sí / No / Parcialmente}
EOF
)"
```

> Si el label `bug` no existe, omite `--label "bug"` y avisa al usuario.

---

### B6 — Confirmar y cerrar

```
Issue creado: #{número} — {título}
URL: {url}

Evidencias recopiladas:
- Archivos analizados: {n}
- Reproducido: Sí / No / Parcialmente
- Errores en consola: {n}
- Peticiones fallidas: {n}

Para trabajar en el fix: /get-issues → selecciona #{número}
```

---

---

# FLUJO FEATURE

---

### F0 — Obtener la descripción de la feature

El input puede llegar de tres formas:

1. **Argumento del comando** → úsalo directamente.
2. **Mención en el mensaje** → úsalo tal cual.
3. **Sin descripción** → usa `AskUserQuestion`:
   - Pregunta: "¿Qué funcionalidad quieres añadir o mejorar?"
   - Opciones: `Describo la funcionalidad`, `Tengo un caso de uso concreto`, `Es una mejora de algo existente`

Guarda como **DESCRIPCION_FEATURE**.

---

### F1 — Evaluar si la feature está bien definida

Analiza **DESCRIPCION_FEATURE** e identifica qué dimensiones están presentes:

| Dimensión | ¿Está claro? | Pregunta de clarificación si falta |
|-----------|-------------|-------------------------------------|
| **Qué** — comportamiento concreto | ¿Se sabe exactamente qué hace? | "¿Qué debería ocurrir exactamente cuando se usa esta función?" |
| **Por qué** — objetivo del usuario | ¿Se sabe para qué sirve? | "¿Qué problema resuelve o qué flujo mejora para el usuario?" |
| **Alcance** — límites y casos borde | ¿Está claro qué NO incluye? | "¿Hay casos especiales o restricciones que debamos tener en cuenta?" |

**Si las 3 dimensiones están claras** → salta directamente a F3.

**Si falta alguna** → ve a F2 con las preguntas necesarias (máximo 3).

---

### F2 — Ronda de clarificación (máximo 3 preguntas)

Usa **una sola llamada a `AskUserQuestion`** con todas las preguntas que falten (máximo 3).

Construye solo las preguntas para las dimensiones que estén incompletas. Ejemplos:

- Si falta el **Qué**: "¿Qué debería ocurrir exactamente cuando el usuario usa esta función? Describe el comportamiento paso a paso."
- Si falta el **Por qué**: "¿Qué problema resuelve esto para el usuario? ¿En qué flujo o situación lo usaría?"
- Si falta el **Alcance**: "¿Hay restricciones, casos especiales o cosas que explícitamente queden fuera de esta feature?"

Tras recibir las respuestas, incorpora el nuevo contexto a **DESCRIPCION_FEATURE** y continúa a F3.

---

### F3 — Sintetizar la feature request

Con toda la información recogida, construye:

| Campo | Contenido |
|-------|-----------|
| **Título** | Frase en imperativo: "Añadir X", "Permitir que el usuario Y", "Mostrar Z en la pantalla W" |
| **Descripción** | Qué hace la feature y para qué sirve |
| **Comportamiento deseado** | Pasos o estados que el usuario experimenta |
| **Criterios de aceptación** | Lista de condiciones verificables que indican que la feature está completa |
| **Contexto adicional** | Pantallas afectadas, restricciones, relación con otras features |

---

### F4 — Confirmar con el usuario

Muestra:

```
Voy a abrir el siguiente issue:

Título: {título}
Label: enhancement

Descripción:
{2-3 líneas de qué hace y por qué}

Criterios de aceptación:
- {criterio 1}
- {criterio 2}
- {criterio 3}

¿Procedo?
```

`AskUserQuestion`:
- Pregunta: "¿Abro el issue con este contenido?"
- Opciones: `Sí, abre el issue`, `Ajusta el título o descripción`, `Añade o cambia algún criterio`

Si el usuario ajusta, actualiza antes de continuar.

---

### F5 — Crear el issue en GitHub

```bash
gh issue create \
  --title "{título}" \
  --label "enhancement" \
  --body "$(cat <<'EOF'
## Descripción

{qué hace la feature y para qué sirve}

## Comportamiento deseado

{pasos o estados que el usuario experimenta con la feature activa}

## Criterios de aceptación

- [ ] {criterio verificable 1}
- [ ] {criterio verificable 2}
- [ ] {criterio verificable 3}

## Contexto adicional

{pantallas afectadas, restricciones, relación con otras features, o "Sin contexto adicional"}

## Rama de desarrollo

- Base: \`dev\`
- Rama sugerida: \`feat/{nombre-corto-kebab-case}\`
EOF
)"
```

> Si el label `enhancement` no existe en el repositorio, prueba con `feature`. Si ninguno existe, omite `--label` y avisa al usuario para que cree el label manualmente.

---

### F6 — Confirmar y cerrar

```
Issue creado: #{número} — {título}
URL: {url}

Para planificar la implementación: /get-issues → selecciona #{número}
```
