---
description: Interrogatorio crítico sobre un documento para reducir gaps, clarificar decisiones y detectar incoherencias. Al terminar, reescribe el documento con todo lo aprendido. Requiere un documento de entrada. Trigger cuando el usuario diga "grill me", "interrógate", "interrogatorio", "analiza gaps", o invoque /grill-me.
---

## Instrucciones

Sigue estos pasos en orden estricto. Esta skill es genérica: funciona con cualquier tipo de documento (spec, apunte, frase, idea, roadmap, diseño, etc.).

---

### Paso 0 — Obtener el documento de entrada

El documento puede llegar de tres formas:

1. **Ruta de archivo** pasada como argumento o mencionada en el mensaje → léela con `Read`.
2. **Contenido pegado directamente** en el mensaje del usuario → úsalo tal cual.
3. **Sin documento** → usa `AskUserQuestion` con una pregunta de texto libre:
   - Pregunta: "¿Cuál es el documento o texto que quieres que analice? Pega el contenido o indica la ruta del archivo."
   - Opciones sugeridas: `Pego el contenido ahora`, `Indico la ruta del archivo`
   - Si el usuario indica una ruta, léela con `Read`. Si pega contenido, úsalo.

Una vez que tengas el documento, guárdalo mentalmente como **DOCUMENTO_ORIGINAL** (también su ruta si la hay).

---

### Paso 1 — Determinar la profundidad del interrogatorio

Usa `AskUserQuestion` con una sola pregunta:

**Pregunta:** "¿Qué profundidad quieres en el interrogatorio?"

| Opción | Descripción |
|--------|-------------|
| **4 preguntas** | Solo lo más crítico. Decisiones bloqueantes y gaps fatales. Sesión rápida (5 min). |
| **6 preguntas** | Crítico + decisiones importantes. Balance entre velocidad y cobertura. |
| **12 preguntas** | Exhaustivo. Crítico, importante y edge cases. Interrogatorio completo. |

Guarda el número elegido como **N_PREGUNTAS**.

---

### Paso 2 — Analizar el documento internamente

**No muestres este análisis al usuario.** Es trabajo interno para preparar las preguntas.

Lee el documento con atención y detecta:

1. **Gaps fatales** — información que falta y sin la que el documento no puede ejecutarse. Ejemplos: objetivo no definido, usuario destinatario ausente, alcance indefinido, decisión técnica sin tomar.

2. **Incoherencias internas** — puntos que se contradicen entre sí dentro del mismo documento. Ejemplos: un requisito que choca con una restricción, un flujo que describe dos comportamientos distintos para el mismo caso.

3. **Decisiones no tomadas** — lugares donde el documento asume algo pero no lo explicita, o donde hay dos opciones igualmente válidas y no se eligió ninguna. Ejemplos: "se usará X o Y según convenga" sin criterio de selección.

4. **Asunciones implícitas** — cosas que el autor da por sentadas pero que un lector externo no podría inferir sin información adicional.

5. **Ambigüedades de alcance** — secciones donde no está claro qué está dentro y qué fuera del scope.

Crea una lista interna de **todos los hallazgos**, ordenados por criticidad:

```
CRITICIDAD ALTA → gaps fatales + incoherencias
CRITICIDAD MEDIA → decisiones no tomadas + asunciones implícitas
CRITICIDAD BAJA → ambigüedades de alcance + detalles menores
```

De esa lista, selecciona las **N_PREGUNTAS** más críticas. Si N=4, toma solo las 4 más altas. Si N=12, abarca también las medias y bajas.

Para cada pregunta seleccionada, prepara:
- La pregunta en sí (clara, directa, sin jerga del autor)
- 2-4 opciones plausibles basadas en el contexto del documento (el usuario siempre puede elegir "Other" para respuesta libre)

---

### Paso 3 — Lanzar el interrogatorio en rondas

Divide las N_PREGUNTAS en rondas de **máximo 4 preguntas por llamada** a `AskUserQuestion`.

| N_PREGUNTAS | Rondas |
|-------------|--------|
| 4 | 1 ronda de 4 |
| 6 | 1 ronda de 4 + 1 ronda de 2 |
| 12 | 3 rondas de 4 |

**Antes de la primera ronda**, escribe al usuario un mensaje breve con:
- Cuántas preguntas vienen en total
- El criterio de ordenación: "De lo más crítico a lo más granular"
- Una línea indicando qué tipo de gaps has detectado (sin revelar las preguntas todavía)

Ejemplo:
> He detectado 2 incoherencias, 3 decisiones sin tomar y 1 gap de alcance. Empezamos con las 6 preguntas más críticas.

**Reglas para formular las preguntas:**
- Directas y sin rodeos. Este es un interrogatorio, no una entrevista de cortesía.
- Cada pregunta apunta a un único hallazgo concreto.
- Las opciones deben ser mutuamente excluyentes cuando sea posible.
- Si la pregunta es sobre una incoherencia, nómbrala explícitamente: "El documento dice X en la sección A, pero Y en la sección B. ¿Cuál es la versión correcta?"

Espera las respuestas de cada ronda antes de lanzar la siguiente. Acumula todas las respuestas como **RESPUESTAS_ACUMULADAS**.

---

### Paso 4 — Reescribir el documento

Una vez completadas todas las rondas, reescribe el **DOCUMENTO_ORIGINAL** integrando:

1. Todas las **RESPUESTAS_ACUMULADAS** del interrogatorio.
2. Resolución de las incoherencias detectadas (usa la respuesta del usuario; si no la hay, marca la incoherencia como `[PENDIENTE DE RESOLUCIÓN]`).
3. Las asunciones implícitas, ahora explicitadas como afirmaciones directas.
4. Gaps que siguen abiertos marcados con `> ⚠ Gap sin resolver: {descripción breve}`.

**Principios de reescritura:**
- Mantén la estructura y el tono del documento original.
- No añadas secciones vacías ni boilerplate que no existía antes.
- Si el documento original era una frase o apunte breve, reescríbelo como documento igualmente breve pero sin gaps.
- Si era un spec extenso, mantén el mismo nivel de detalle y extensión, solo enriqueciéndolo.
- No inventes información que el usuario no haya dado. Si un gap sigue abierto tras el interrogatorio, márcalo con `⚠`.

**Destino del documento reescrito:**
- Si había una **ruta de archivo**: escribe el resultado en esa misma ruta con `Write` (sobreescritura). Informa al usuario antes de hacerlo.
- Si el documento llegó como texto pegado: muestra el resultado directamente en el chat, formateado en un bloque de código markdown.

---

### Paso 5 — Resumen final

Al terminar, escribe al usuario un resumen conciso:

```
✓ Documento reescrito: {ruta o "mostrado en chat"}
Gaps resueltos: {n}
Gaps abiertos: {n} (marcados con ⚠)
Incoherencias resueltas: {n}
```

Si quedan gaps abiertos con `⚠`, lista brevemente cuáles son para que el usuario sepa qué le falta completar.
