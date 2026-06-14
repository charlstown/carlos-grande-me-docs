---
description: Orchestrator that reads one or multiple plan.md files, uses git worktrees for isolation, supports sequential or parallel (max 2 workers) execution, detects cross-plan dependencies, and marks tasks [x] or [blocked] with retry logic. Trigger when the user says "develop plan", "ejecuta el plan", "implementa el plan", "desarrolla el plan", or invokes /develop-plan.
---

## Instrucciones

Actúas como **orquestador**: localizas los planes, detectas dependencias entre ellos, preguntas al usuario cómo ejecutarlos, creas worktrees de git para aislar cada plan, disparas subagentes por tarea, actualizas los ficheros en disco tras cada resultado y gestionas reintentos y bloqueos.

Cada plan — aunque sea uno solo — se ejecuta siempre en un **worktree aislado**. Nunca toques el árbol de trabajo principal mientras hay tareas en vuelo.

---

### Paso 0 — Localizar planes y verificar worktree support

#### 0a. Listar todos los planes con tareas pendientes

Busca con `Glob` todos los `specs/*/plan.md`. Para cada uno, léelo y cuenta cuántas líneas `- [ ]` tiene (tareas pendientes). Descarta los planes sin tareas pendientes.

Si no hay ningún `plan.md` con tareas pendientes en `specs/`, informa al usuario y detente.

#### 0b. Verificar soporte de worktrees

Comprueba que git worktree está disponible:

```bash
git worktree list
```

Si falla, informa al usuario e ignora la funcionalidad de worktrees — ejecuta el plan directamente en la rama actual (modo fallback: comportamiento antiguo con `git checkout -b`).

#### 0c. Asegurarse de que .worktrees/ está en .gitignore

Comprueba si `.worktrees/` aparece en `.gitignore`. Si no está, añádelo:

```bash
echo ".worktrees/" >> .gitignore
```

---

### Paso 1 — Selección de planes

**Siempre** presenta los planes con `AskUserQuestion` (multiSelect: true), aunque haya solo uno. El usuario debe confirmar explícitamente qué planes quiere ejecutar.

**1. Presentar los planes encontrados** con `AskUserQuestion`:

- `question`: `"¿Qué plan(es) quieres desarrollar?"`
- `header`: `"Planes"`
- `multiSelect: true`
- Opciones: una opción por cada plan encontrado, con `label` = nombre de la carpeta del plan (ej. `feat-nuevo-campo`) y `description` = `"{N} tareas pendientes — {ruta relativa}"`. Añade siempre una opción extra `"Todos"` con `description` = `"Ejecutar todos los planes listados"`.

Si el usuario no selecciona ninguno (respuesta vacía), informa: `"No seleccionaste ningún plan. Puedes volver a ejecutar /develop-plan cuando quieras."` y detente.

Si selecciona solo uno, continúa al Paso 2 directamente. Si selecciona varios (o "Todos"), continúa al análisis de dependencias.

**2. Analizar dependencias entre los planes seleccionados**

Para cada par de planes, comprueba:

- **Ficheros compartidos**: extrae los paths de fichero mencionados en cada `plan.md` (líneas con `src/`, `app/`, `components/`, `api/`, `lib/`, etc.). Si dos planes mencionan el mismo fichero, hay dependencia potencial.
- **Referencias cruzadas**: lee cada `requirements.md` de la misma carpeta y busca referencias al nombre o carpeta de otro plan (ej. "requiere que X esté implementado").
- **Orden de batches**: si el nombre de un batch de plan A coincide con una dependencia descrita en plan B, hay dependencia directa.

Si detectas dependencias entre planes:

> ⚠ Advertencia de dependencias detectadas: los planes `{A}` y `{B}` modifican ficheros en común (`{lista}`). Ejecutarlos en paralelo puede generar conflictos de merge. Se recomienda ejecución **secuencial**.

**3. Preguntar modo de ejecución** con `AskUserQuestion`:

```
¿Cómo quieres ejecutar los {N} planes seleccionados?
```

Opciones (mostrar la advertencia de dependencias en la descripción si aplica):

| Opción | Descripción |
|--------|-------------|
| **Paralelo (2 workers)** | Ejecuta hasta 2 planes a la vez en worktrees independientes. [Si hay dependencias: "⚠ No recomendado — hay ficheros compartidos"] |
| **Secuencial** | Ejecuta un plan tras otro. Más lento pero sin riesgo de conflictos. [Si hay dependencias: "✅ Recomendado"] |

Si el usuario elige paralelo habiendo dependencias detectadas, añade un aviso final: `"Ejecutando en paralelo a pesar de las dependencias. Si hay conflictos de merge se reportarán al finalizar."` pero continúa.

---

### Paso 2 — Crear worktree(s)

Para cada plan a ejecutar, deriva el nombre de rama y el path del worktree:

- Toma el nombre de la carpeta del `plan.md` (ej. `fix-campo-descripcion`)
- Prefijo de rama: primer segmento (`fix`, `feat`, `chore`)
- Slug: el resto → rama = `{prefijo}/{slug}`
- Worktree path: `.worktrees/{slug}` (relativo a la raíz del proyecto)

Obtén la raíz del proyecto:

```bash
git rev-parse --show-toplevel
```

Crea el worktree (usa `--track` para que la rama nueva parta de la rama actual):

```powershell
# PowerShell (Windows)
$root = git rev-parse --show-toplevel
git worktree add "$root/.worktrees/{slug}" -b "{prefijo}/{slug}"
```

```bash
# Bash (Unix)
root=$(git rev-parse --show-toplevel)
git worktree add "$root/.worktrees/{slug}" -b "{prefijo}/{slug}"
```

Si la rama ya existe: `git worktree add "$root/.worktrees/{slug}" "{prefijo}/{slug}"`.

Si falla por cualquier motivo, informa al usuario y usa el modo fallback (`git checkout -b`).

Anota el **path absoluto** del worktree para cada plan — todos los subagentes de ese plan recibirán este path como directorio de trabajo.

---

### Paso 3 — Modo de ejecución

#### Modo SECUENCIAL (un plan a la vez)

Para cada plan en orden, ejecuta el **Bucle de tareas** (Paso 4) hasta completarlo o bloquearlo. Solo cuando un plan esté terminado (o bloqueado definitivamente) empieza el siguiente.

#### Modo PARALELO (hasta 2 workers simultáneos)

Divide los planes en lotes de 2. Para cada lote:

1. **Lanza 2 agentes en background** con `run_in_background: true` — uno por plan:
   - `subagent_type`: `code-developer`
   - `description`: `"Plan {slug}: ejecutar todas las tareas"`
   - `prompt`: el **Prompt de Worker** (ver abajo)

2. Espera a que ambos agentes completen (serás notificado automáticamente).

3. Tras recibir los resultados, procesa el resumen de cada worker y actualiza el estado en los respectivos `plan.md`.

4. Pasa al siguiente lote de 2 si hay más planes.

**Prompt de Worker** (para cada plan en modo paralelo):

```
Eres un orquestador de tareas de desarrollo. Tu objetivo es ejecutar TODAS las tareas pendientes del plan indicado, en el worktree de git asignado.

## Plan a ejecutar
Ruta del plan: {ruta_plan}
Worktree path: {worktree_path}
Rama: {rama}

## Instrucciones

1. Lee el plan.md con Read tool.
2. Extrae todas las líneas `- [ ]` (tareas pendientes).
3. Para cada tarea, en orden:
   a. Dispara un subagente (Agent tool) con el tipo indicado por @etiqueta o `code-developer` por defecto.
   b. El subagente debe trabajar en el directorio: {worktree_path}
   c. El prompt al subagente incluye: tarea, batch, extracto del plan, y directorio de trabajo.
   d. Si el subagente responde COMPLETADA → edita plan.md: `- [ ]` → `- [x]`.
   e. Si está BLOQUEADA → reintenta una vez. Si vuelve a fallar → `- [blocked]` + motivo. Detente.
   f. Tras completar el último `- [ ]` de un batch → git add -A && git commit (trabajando desde {worktree_path}).

4. Al finalizar todas las tareas:
   - Haz push de la rama desde el worktree:
     cd {worktree_path} && git push -u origin {rama}
   - Crea la PR contra dev con gh pr create.
   - Elimina el worktree:
     git worktree remove {worktree_path} --force
   - Lee requirements.md del plan (si existe) y cierra el issue vinculado.

5. Devuelve un resumen final con:
   - Tareas completadas: N
   - Tareas bloqueadas: N (con motivos)
   - URL de la PR (o motivo por el que no se creó)
   - ESTADO_FINAL: COMPLETADO | BLOQUEADO
```

---

### Paso 4 — Bucle de tareas (modo secuencial / un plan)

> Este paso aplica al plan actual en su worktree. El **directorio de trabajo** para todos los comandos git y subagentes es el **worktree path**, no el repo principal.

Lee el fichero `plan.md` con `Read`. Extrae las líneas `- [ ]`. Indica al usuario cuántas tareas hay en total y cuántas ya están completadas.

Repite los sub-pasos para cada tarea pendiente en orden:

#### 4a. Construir el contexto para el subagente

Prepara un prompt que incluya:

1. **La tarea concreta** — texto exacto (sin `- [ ]` ni la etiqueta `@`)
2. **Batch al que pertenece** — título del `##` bajo el que está la tarea
3. **Contexto del plan** — primeras 40 líneas del plan.md
4. **Directorio de trabajo** — path absoluto del **worktree** (no el repo principal)
5. **Instrucción de finalización** — indica claramente si es `COMPLETADA` o `BLOQUEADA`

```
Tarea a realizar:
"{texto exacto de la tarea}"

Pertenece al batch: "{título del batch}"

Contexto del plan (extracto):
---
{primeras 40 líneas del plan.md}
---

Directorio de trabajo: {worktree_path}

Al terminar, indica en tu respuesta final:
- COMPLETADA — si ejecutaste la tarea con éxito
- BLOQUEADA: <motivo> — si no puedes completarla
```

#### 4b. Disparar el subagente (primer intento)

Invoca con `Agent`:
- `subagent_type`: agente detectado por `@etiqueta` o `code-developer` por defecto
- `description`: texto corto ≤ 60 caracteres
- `prompt`: el prompt de 4a

#### 4c. Evaluar el resultado

| Resultado | Criterio |
|-----------|----------|
| **Completada** | Contiene `COMPLETADA` o describe claramente que el trabajo se hizo |
| **Bloqueada** | Contiene `BLOQUEADA:` o el agente no pudo avanzar |
| **Fallida** | Sin resultado útil — tratar igual que bloqueada |

#### 4d. Si está COMPLETADA

Edita el `plan.md` con `Edit`: `- [ ] {texto}` → `- [x] {texto}`.

**Commit al cerrar cada batch:** si no quedan `- [ ]` en el mismo batch, ejecuta desde el worktree:

```bash
cd {worktree_path} && git add -A && git commit -m "{tipo}: {slug-del-batch}"
```

En PowerShell:
```powershell
Set-Location {worktree_path}; git add -A; git commit -m "{tipo}: {slug-del-batch}"
```

#### 4e. Si está BLOQUEADA o FALLIDA — reintento

Informa: `"Tarea bloqueada, reintentando: {texto}"`.

Repite 4b con el mismo prompt más:

```
⚠ Primer intento fallido. Motivo: {motivo}.
Intenta resolver el bloqueo o encontrar una vía alternativa.
```

#### 4f. Evaluar el reintento

- **COMPLETADA**: edita plan (`- [x]`), continúa.
- **Falla de nuevo**:
  1. `Edit` en plan.md: `- [ ]` → `- [blocked]`, añade línea `  - Motivo: {motivo}`
  2. Informa al usuario del bloqueo definitivo.
  3. **Detén el bucle.**

---

### Paso 5 — Finalización de cada plan

> Ejecutar siempre desde el **worktree path**, no desde el repo principal.

#### 5a. Limpieza de puertos de desarrollo

```powershell
# Windows — mkdocs serve usa el puerto 8000 por defecto
foreach ($port in @(8000)) {
  $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
  if ($conn) { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue }
}
```

#### 5b. Push, PR y worktree cleanup

**Si el plan está 100% completado** (todas las tareas en `[x]`):

1. **Revisión de código** (solo si el plan tocó código JS o ficheros del theme en `overrides/` o `docs/assets/`; omitir para planes de solo contenido Markdown): lanza el subagente `code-reviewer` con el `worktree_path` como contexto. Si reporta issues **críticos**, intenta corregirlos con un subagente `code-developer` antes de continuar; si no se pueden resolver, anótalo en el resumen final y continúa.

2. Push desde el worktree:
   ```bash
   cd {worktree_path} && git push -u origin {rama}
   ```

3. Crear PR contra `dev`:
   ```bash
   gh pr create --base dev --title "{tipo}: {título limpio del plan}" --body "$(cat <<'EOF'
   ## Cambios
   {lista de batches completados como bullet points}

   ## Plan
   Generado desde `{ruta del plan.md}`

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

4. Mostrar la URL de la PR al usuario.

5. Cerrar issue vinculado (si `requirements.md` contiene `> GitHub: #{número}`):
   ```bash
   gh issue comment {número} --body "Implementado en la PR {url}. Cerrando."
   gh issue close {número}
   ```

6. **Eliminar el worktree** (desde el repo principal):
   ```bash
   git worktree remove {worktree_path} --force
   ```

**Si el plan terminó con bloqueos**: no crees PR. Elimina igualmente el worktree:
```bash
git worktree remove {worktree_path} --force
```

#### 5c. Resumen final (por plan)

```
## Resultado: {slug del plan}

- Tareas completadas en esta sesión: N
- Tareas ya completadas previamente: N
- Tareas bloqueadas: N  ← con motivo si aplica
- Tareas pendientes restantes: N
- PR: {url o "No creada — plan con bloqueos"}
```

---

### Paso 6 — Resumen global (si se ejecutaron múltiples planes)

Tras procesar todos los planes seleccionados, muestra un resumen consolidado:

```
## Resumen global

| Plan | Completadas | Bloqueadas | PR |
|------|-------------|------------|----|
| {slug-A} | N/M | N | {url o —} |
| {slug-B} | N/M | N | {url o —} |

Worktrees eliminados: {lista}
```

Si algún plan quedó bloqueado: `"Revisa los bloqueos y vuelve a ejecutar /develop-plan para continuar."`

---

### Notas para el orquestador

- **Worktree siempre**: aunque sea un solo plan. Nunca toques el árbol de trabajo principal mientras hay tareas en vuelo.
- **Path del worktree**: usa siempre la ruta absoluta al worktree como directorio de trabajo en los prompts a subagentes.
- **No edites código directamente**: eres el orquestador. Delega en subagentes.
- **Una tarea = un subagente**: no agrupes tareas.
- **Persiste el estado en disco tras cada tarea**: edita el `plan.md` inmediatamente.
- **Si git worktree falla**: usa el modo fallback con `git checkout -b` (sin worktree) e informa al usuario.
- **Si el subagent_type no existe**: usa `general-purpose` y menciónalo en el resumen.
- **Paralelo con dependencias**: si el usuario elige paralelo con advertencia de dependencias, procede pero monitoriza los resultados de merge — si hay conflictos, repórtalos claramente al final.
