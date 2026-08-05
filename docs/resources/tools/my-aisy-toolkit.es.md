---
short_title: My AIsy Toolkit
description: Un catálogo de skills y subagentes para copiar y pegar que convierte el Spec-Driven Development y los bucles agénticos en un único flujo de trabajo cerrado, sin necesidad de instalación.
date: 2026-08-04
thumbnail: assets/images/thumbnails/my-aisy-toolkit-portrait.png
---

# My AIsy Toolkit

Llevaba un tiempo buscando un framework que fuera lo bastante sencillo como para usarlo de verdad cada día, pero lo bastante completo como para cubrir todo el recorrido, Spec-Driven Development al estilo de [spec-kit](https://github.com/github/spec-kit), y gestión de bucles agénticos con worktrees al estilo de [Sandcastle](https://github.com/mattpocock/sandcastle). Nunca encontré uno que hiciera ambas manteniendo la premisa de sencillez, así que tras mucha prueba y error y diferentes patrones de desarrollo he acabado publicando el mío. **My AIsy Toolkit** es un catálogo de skills y subagentes que se instalan a nivel repositorio y que uso a diario.

[Repo de código](https://github.com/charlstown/my-aisy-toolkit){ .md-button .text-center target="_blank" }

Si te has pasado por mi post sobre [los 8 niveles de IA](../cheatsheets/my-8-levels-of-ai-development.md), este toolkit cubre desde el **nivel 3 (Agent mode)** y **nivel 4 (CLI first)** de Spec-Driven Development, y hasta el **nivel 5 (Subagents)** y el **nivel 6 (Multiagents)**: un agente líder que delega oleadas verificables de trabajo en especialistas sobre ramas aisladas.

---

## 1. Instalación

Podría haber hecho una librería con paquetes de instalación, pero dado que es un repo público y quería la máxima sencillez, lo he preparado para que solo haya que pegar un prompt en la conversación de tu agente y él mismo va a buscar y sigue las instrucciones de instalación.

!!! tip "Copia y pega este prompt en el chat de tu agente CLI"

    ```text
    Fetch and follow the setup instructions at https://raw.githubusercontent.com/charlstown/my-aisy-toolkit/main/setup-ai.md
    ```

**Compatible con los siguientes agentes:**

<div class="grid cards" markdown>

- [:simple-claude: __CLAUDE CLI__](https://code.claude.com/docs/en/quickstart){ target="_blank" }
- [:fontawesome-brands-openai: __CODEX CLI__](https://learn.chatgpt.com/docs/codex/cli#getting-started){ target="_blank" }

</div>

> *Puede instalarse en otros agentes si se le especifica en el prompt que adapte las skills según la documentación del agente en cuestión.*

## 2. Cómo funciona

Todo el ciclo de skills está pensado como un bucle cerrado, y arranca con `/constitution`: un documento vivo que acompaña al producto durante toda su vida y que fija qué es y cómo lo vas a construir. Con eso ya definido, el bucle echa a andar, vas especificando las features que quieres añadir, las planificas y las implementas, una a una. Al terminar, `/clean-feature` realinea ese documento vivo con lo que de verdad acabas de construir, y todo vuelve a empezar desde ahí.

--8<-- "assets/html/my-aisy-toolkit-flow.html:diagram"

### 2.1 Catálogo de skills

Las cuatro primeras arrancan el bucle (o regeneran una sola pieza del documento vivo, suelta); las cinco siguientes son el ciclo que se repite en cada feature:

| Fase | Skill | Qué hace | Ejemplo |
|---|---|---|---|
| 1 | `/constitution` | Funda `product-spec.md`, `tech-spec.md` y `roadmap.md` | `/constitution` |
| 1 | `/product-spec` | Regenera solo el `product-spec.md` | `/product-spec` |
| 1 | `/tech-spec` | Regenera solo el `tech-spec.md` | `/tech-spec` |
| 1 | `/roadmap` | Recalcula las fases del `roadmap.md` | `/roadmap` |
| 2 | `/specify-feature` | Delimita el alcance de la feature: el qué y el por qué | `/specify-feature "añadir modo oscuro al dashboard"` |
| — | `/clarify-feature` | Cierra las lagunas de decisión antes de planificar nada | `/clarify-feature specs/003-modo-oscuro/requirements.md` |
| 3 | `/plan-feature` | Descompone la feature en un `plan.md` | `/plan-feature specs/003-modo-oscuro/requirements.md` |
| 4 | `/implement-feature` | La construye, aislada en un git worktree | `/implement-feature` |
| 5 | `/clean-feature` | Alinea las specs con lo que realmente se ha lanzado | `/clean-feature` |

### 2.2 Catálogo de agentes

`/implement-feature` no hace el trabajo sola: `/plan-feature` ya decidió qué subagente es responsable de cada tarea, e `/implement-feature` se limita a levantarlos y repartirles su parte.

| Agente | Qué hace |
|---|---|
| `architect` | Investiga, evalúa alternativas y diseña la solución antes de implementar nada |
| `code-developer` | Implementa código de backend o general a partir de un plan ya claro |
| `ui-developer` | Diseña e implementa pantallas completas, de la idea visual al componente |
| `test-developer` | Escribe los tests sin ejecutarlos |
| `tester` | Ejecuta los tests y verifica el comportamiento real de la app |
| `judge` | Revisa el trabajo de otro agente y devuelve `PASS` o `CHANGES_REQUESTED` |

---

Si algo de esto te suena a tu flujo de trabajo diario, el prompt de instalación de arriba es toda la barrera de entrada. Yo uso este mismo catálogo cada día y lo sigo ampliando a medida que aparecen nuevas lagunas; si te encuentras con una, o algo se comporta de forma distinta a como se describe aquí, [abre un issue en el repo](https://github.com/charlstown/my-aisy-toolkit/issues/new).

## 3. Lecturas y recursos adicionales

| Recurso | Descripción |
|---|---|
| [Claude Code CLI: The complete guide](https://blakecrosley.com/guides/claude-code) | Guía completa de Claude Code CLI, por Blake Crosley |
| [Los 8 niveles de IA](../cheatsheets/my-8-levels-of-ai-development.md) | El framework que este toolkit pone en práctica |
| [Spec-Driven Development with Coding Agents](https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents) | Curso de DeepLearning.AI × JetBrains sobre el flujo constitution → spec → plan → implement |
| [Sandcastle](https://github.com/mattpocock/sandcastle) | La herramienta de bucles agénticos con git-worktree que inspiró el modelo de aislamiento de aquí |
| [Claude Code Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) | Referencia de principiante a power-user con plantillas listas para producción y una cheatsheet |

## Referencias

- DeepLearning.AI. (2026). *Spec-driven development with coding agents* [Course]. https://www.deeplearning.ai/courses/spec-driven-development-with-coding-agents
- FlorianBruniaux. (2026). *Claude Code ultimate guide* [GitHub repository]. GitHub. https://github.com/FlorianBruniaux/claude-code-ultimate-guide
- GitHub. (2026). *Spec-kit* [GitHub repository]. https://github.com/github/spec-kit
- Pocock, M. (2026). *Sandcastle* [GitHub repository]. GitHub. https://github.com/mattpocock/sandcastle
