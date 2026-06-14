---
description: Given a requirements.md path, evaluates gaps, asks up to 3 critical questions if needed, then invokes the planner subagent to generate plan.md in the same folder. Trigger when the user says "plan-feature", "genera el plan", "planifica esta feature", "crea el plan.md", or invokes /plan-feature.
---

## Instrucciones

Sigue estos pasos en orden.

### Paso 1 — Localizar el requirements.md

El usuario puede pasar la ruta del `requirements.md` como argumento de la skill, o mencionarla en el mensaje.

- Si se proporcionó una ruta, úsala directamente.
- Si no se proporcionó, busca con `Glob` todos los `specs/*/requirements.md` y pregunta al usuario cuál quiere planificar con `AskUserQuestion` (una sola pregunta, opciones = las rutas encontradas).
- Si no existe ningún `requirements.md` en `specs/`, informa al usuario y detente.

Lee el `requirements.md` seleccionado con `Read`.

### Paso 2 — Evaluar gaps críticos

Lee el requirements con atención. Evalúa si hay ambigüedades o información faltante que el agente planner **no puede resolver por sí solo leyendo el código**. Considera gap crítico solo si impide escribir una tarea concreta en el plan:

| Tipo de gap | Ejemplos que SÍ son críticos | Ejemplos que NO son críticos |
|-------------|------------------------------|------------------------------|
| Comportamiento no especificado ante un caso de borde relevante | "¿Qué pasa si el usuario guarda sin cambios?" | "¿Qué pasa si hay 0 registros?" (el planner puede inferirlo) |
| Decisión técnica con dos opciones igualmente válidas y consecuencias distintas | "¿Gestionamos el estado en el componente padre o en un contexto?" | "¿Usamos `useState` o `useReducer`?" (el planner elige) |
| Alcance ambiguo que podría doblar el tamaño de la feature | "¿El cambio aplica solo a la galería o también al filtro de notebooks?" | Detalles de estilo no especificados (el planner lee los patrones de `docs/assets/css/`) |

**Criterio**: si el planner puede resolverlo leyendo el código o los patrones existentes (`docs/assets/`, `overrides/`, posts de la misma categoría) → **no es un gap, no preguntes**.

Si detectas **0 gaps críticos**, salta directamente al Paso 4.

Si detectas **1-3 gaps críticos**, continúa con el Paso 3.

### Paso 3 — Preguntar al usuario (solo si hay gaps)

Usa `AskUserQuestion` con **una sola llamada** que agrupe todos los gaps detectados (máximo 3 preguntas en la misma llamada). Las preguntas deben ser:
- Concretas y cerradas siempre que sea posible (opciones predefinidas + "Other")
- Ordenadas de mayor a menor impacto en el plan

Tras recibir las respuestas del usuario, guárdalas mentalmente como contexto adicional para el planner. No edites el `requirements.md`.

### Paso 4 — Invocar el agente planner

Invoca el subagente `planner` con un prompt que incluya:

1. La **ruta absoluta** del `requirements.md`
2. El **contenido completo** del `requirements.md` (para que el agente no necesite pedirlo de nuevo)
3. Si hubo preguntas en el Paso 3: las **respuestas del usuario** como contexto adicional, claramente marcadas como "Aclaraciones del usuario:" antes de las respuestas
4. La instrucción de escribir el `plan.md` en **la misma carpeta** que el `requirements.md`

Ejemplo de prompt al planner:

```
Genera el plan.md para la feature en specs/{carpeta}/.

Ruta del requirements: specs/{carpeta}/requirements.md

Contenido del requirements:
---
{contenido completo}
---

{si hubo aclaraciones:}
Aclaraciones del usuario:
- Pregunta: {pregunta 1} → Respuesta: {respuesta 1}
- Pregunta: {pregunta 2} → Respuesta: {respuesta 2}

Escribe el plan.md en specs/{carpeta}/plan.md.
```

### Paso 5 — Confirmar al usuario

Cuando el agente planner termine, informa al usuario:
- Ruta del `plan.md` generado
- Número de batches y tareas creadas
- Si hubo aclaraciones que se incorporaron al plan, mencionarlas brevemente
