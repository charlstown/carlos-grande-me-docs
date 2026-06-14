---
description: Limpia las carpetas de features/fixes con plan.md completado. Para cada carpeta, audita y alinea los specs raíz (ProductSpec, TechSpec) con los cambios introducidos, actualiza los que estén desfasados, cierra el issue de GitHub asociado (con comentario y enlace a la rama) y borra la carpeta. Termina con un commit chore y push a dev. Trigger cuando el usuario diga "cleanup", "limpia las carpetas", "limpia los specs", "alinea los specs" o invoque /clean-issues.
---

## Instrucciones

Sigue estos pasos en orden.

---

### Paso 0 — Localizar carpetas con plan completado

Busca con `Glob` todos los `specs/*/plan.md`. Para cada uno:

1. Léelo con `Read`.
2. Cuenta las líneas `- [ ]` (tareas pendientes).
3. Cuenta las líneas `- [x]` (tareas completadas).
4. Cuenta las líneas `- [blocked]` (tareas bloqueadas).

**Criterio de "completado":** el plan no tiene ninguna `- [ ]`. Puede tener `- [blocked]` (lo anota, pero lo incluye).

Si no hay ningún plan completado, informa al usuario y detente.

---

### Paso 1 — Presentar y confirmar al usuario

#### Si hay exactamente 1 plan completado

Informa: `"Carpeta completada encontrada: {ruta} ({N} tareas completadas{, M bloqueadas si aplica})"`. Procede automáticamente al Paso 2.

#### Si hay 2 o más planes completados

Usa `AskUserQuestion` (multiSelect: true) para preguntar cuáles quiere procesar:

```
¿Qué carpetas completadas quieres limpiar?
```

Opciones: una por carpeta (formato `specs/{nombre}/ — {N} tareas completadas`) + "Todas".

---

### Paso 2 — Extraer contexto de cada carpeta seleccionada

Para cada carpeta seleccionada:

1. Lee `specs/{carpeta}/requirements.md` (si existe).
2. Lee `specs/{carpeta}/plan.md`.
3. Ejecuta:
   ```bash
   git log --oneline --all -- "specs/{carpeta}/"
   ```
4. Extrae un **resumen de cambios**: qué ficheros se tocaron, qué comportamiento nuevo se introdujo, qué se corrigió. Sintetízalo en 3-5 bullets. Guárdalo como `contexto_{carpeta}` para los pasos siguientes.
5. **Extraer número de issue**: busca en `requirements.md` y en el propio `plan.md` una referencia al issue de GitHub (patrones: `#\d+`, `issues/\d+`, `closes #\d+`, `fixes #\d+`, o campo `issue:` en el frontmatter). Si lo encuentras, guárdalo como `issue_num_{carpeta}`. Si no hay referencia, márcalo como `null`.

---

### Paso 3 — Auditar alineamiento de los specs raíz

Lee los siguientes specs raíz con `Read`:

| Archivo | Auditar cuando… |
|---------|-----------------|
| `specs/ProductSpec.md` | El plan añadió o cambió contenido, secciones o funcionalidad visible del sitio |
| `specs/TechSpec.md` | El plan cambió stack, build, plugins de MkDocs, JS del theme, dependencias o estructura |

Para cada spec relevante, lanza un subagente `general-purpose` con el siguiente prompt:

```
Eres un revisor de documentación técnica. Tu objetivo es identificar qué secciones del spec están desalineadas con los cambios reales introducidos por un plan ya completado.

## Spec a revisar
Ruta: {ruta_spec}
Contenido completo:
---
{contenido del spec}
---

## Cambios introducidos por el plan completado
Carpeta: specs/{carpeta}/
Resumen de cambios:
{contexto_{carpeta}}

Contenido del plan.md:
---
{contenido del plan.md}
---

{si existe requirements.md:}
Contenido del requirements.md:
---
{contenido del requirements.md}
---

## Tu tarea
Identifica SOLO las secciones o líneas del spec que están desalineadas con los cambios reales. Para cada desalineación encontrada indica:

1. **Sección afectada**: nombre de la sección o línea exacta
2. **Qué dice actualmente**: extracto literal
3. **Qué debería decir**: propuesta de texto actualizado
4. **Por qué**: en una línea

Si el spec está completamente alineado con los cambios, responde: "ALINEADO — sin cambios necesarios."

No propongas cambios cosméticos ni mejoras que no estén relacionadas con el plan analizado.
Sé conservador: solo marca como desalineado lo que contradice o ignora lo que el plan implementó.
```

Recopila los resultados. Si el subagente responde "ALINEADO", márcalo y pasa al siguiente.

---

### Paso 4 — Actualizar specs desalineados

Para cada spec donde el subagente detectó desalineaciones, lanza un subagente `code-developer` con:

```
Actualiza el spec {ruta_spec} para alinearlo con los cambios introducidos por el plan completado.

## Cambios a aplicar
{lista numerada de desalineaciones detectadas en el Paso 3, con texto actual y propuesta}

## Reglas
- Usa `Read` para leer el fichero antes de editarlo.
- Usa `Edit` para hacer cada cambio de forma quirúrgica — nunca reescribas secciones enteras salvo que sea estrictamente necesario.
- Actualiza el campo `Updated` en el bloque de metadatos del spec (formato `YYYY-MM-DD`, fecha de hoy: {fecha_hoy}).
- No añadas ni elimines secciones que no estén en la lista de cambios.
- Si el cambio es añadir un ítem a una lista (ej. en roadmap: marcar un ítem como completado), hazlo con Edit mínimo.
- Confirma al final qué líneas editaste.
```

Si el spec tiene cambios en `roadmap.md` (ítems a marcar como entregados), aplica el mismo criterio: `Edit` mínimo, marcar el ítem con `[x]` o añadir la fecha de entrega si corresponde al formato del roadmap.

---

### Paso 5 — Confirmar antes de borrar

Antes de eliminar las carpetas, muestra al usuario el resumen de lo que se hizo:

```
## Resumen antes de borrar

### Specs actualizados
- specs/product-spec.md — {N cambios}
- specs/TechSpec.md — ALINEADO
- ...

### Carpetas a eliminar
- specs/{carpeta-A}/  ({N tareas completadas)
- specs/{carpeta-B}/  ({N tareas completadas})
```

Usa `AskUserQuestion` para pedir confirmación:

```
¿Procedo a borrar las carpetas y hacer el commit?
```

Opciones:
- **Sí, borrar y commitear** — Elimina las carpetas y empuja a dev
- **No borrar todavía** — Cierra sin borrar (los specs ya están actualizados)

Si el usuario elige no borrar, informa que los specs están actualizados y detente.

---

### Paso 6 — Eliminar carpetas

Para cada carpeta confirmada, ejecuta en **PowerShell**:

```powershell
Remove-Item -Recurse -Force "specs/{carpeta}"
```

Confirma con `Glob "specs/*/plan.md"` que las carpetas ya no existen.

---

### Paso 6.5 — Cerrar issues en GitHub

Para cada carpeta eliminada donde `issue_num_{carpeta}` no es `null`:

1. Comprueba si el issue está abierto:
   ```bash
   gh issue view {issue_num} --json state --jq '.state'
   ```
   Si devuelve `CLOSED`, sáltalo.

2. Si está abierto, verifica si la rama de desarrollo está enlazada al issue. Comprueba si existe algún PR que lo referencie:
   ```bash
   gh pr list --search "#{issue_num}" --json number,title,headRefName,state
   ```
   Si no hay ningún PR cerrado o fusionado que lo referencie, añade manualmente el enlace con:
   ```bash
   gh issue develop {issue_num} --branch "dev" --repo {owner}/{repo}
   ```
   (Esto vincula la rama `dev` al issue en GitHub. Si el comando falla porque la versión de `gh` no lo soporta, omítelo y anótalo en el resumen final.)

3. Cierra el issue con un comentario que incluya el resumen de lo implementado:
   ```bash
   gh issue close {issue_num} --comment "$(cat <<'EOF'
   ✅ Implementado y cerrado.

   {contexto_{carpeta} — los 3-5 bullets del resumen de cambios}

   Carpeta de specs eliminada: `specs/{carpeta}/`
   Commits relacionados:
   {salida de git log --oneline --all -- "specs/{carpeta}/", máximo 5 líneas}
   EOF
   )"
   ```

Si algún issue falla al cerrar, informa del error pero continúa con los demás.

---

### Paso 7 — Commit y push a dev

Construye el mensaje de commit listando las carpetas borradas y los specs modificados:

```powershell
git add -A
git commit -m "$(cat <<'EOF'
chore: limpiar carpetas completadas y actualizar specs

Carpetas eliminadas:
{lista de carpetas, una por línea con guión}

Specs actualizados:
{lista de specs modificados, una por línea con guión; omitir si ninguno}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

En PowerShell, usa un here-string `@'...'@`:

```powershell
git commit -m @'
chore: limpiar carpetas completadas y actualizar specs

Carpetas eliminadas:
- specs/{carpeta-A}
- specs/{carpeta-B}

Specs actualizados:
- specs/TechSpec.md
- specs/ProductSpec.md

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
'@
```

Después:

```powershell
git push origin dev
```

Si el push falla por divergencia, informa al usuario con el error exacto y detente — no hagas `--force`.

---

### Paso 8 — Resumen final

```
## Cleanup completado

Carpetas eliminadas: {N}
{lista}

Specs actualizados: {N} / {total auditados}
{lista con número de cambios por spec}

Issues cerrados: {N}
{lista: "#NNN — título — enlazado a rama: Sí/No"}

Commit: {hash corto} — {mensaje}
Push: ✅ dev actualizado
```

Si el usuario eligió no borrar en el Paso 5: omite la sección de carpetas y el commit.

---

### Notas

- **Solo borra lo que está en `[x]`**: si un plan tiene `- [blocked]` pero ningún `- [ ]`, inclúyelo pero avisa al usuario en el Paso 1.
- **No modifiques specs por cambios que no procedan del plan**: la auditoria es quirúrgica, no un refactor general.
- **Fecha de hoy**: obtén la fecha actual con `Get-Date -Format "yyyy-MM-dd"` antes de empezar.
- **Specs opcionales**: si alguno de los specs listados en el Paso 3 no existe en disco, omítelo silenciosamente.
- **Un subagente por spec**: no intentes auditar múltiples specs en el mismo subagente.
- **Issue no encontrado**: si no hay `issue_num` para una carpeta, omite silenciosamente el paso de cierre para esa carpeta.
- **`gh issue develop` opcional**: si la versión de `gh` no soporta el subcomando `develop`, omítelo y anótalo en el resumen final como "enlazado a rama: No (comando no disponible)".
