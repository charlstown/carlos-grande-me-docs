# Repository instructions

## Project and documentation

- This repository is the source of carlosgrande.me, a site built with **MkDocs and Material for MkDocs**. Pages are Markdown files under `docs/`; `mkdocs.yml` defines the theme, Markdown extensions, plugins and hooks.
- Before editing, read nearby pages in the same section and check `mkdocs.yml` for the features actually enabled. Follow the [official Material for MkDocs reference](https://squidfunk.github.io/mkdocs-material/reference/) for Markdown syntax and components, and the [MkDocs documentation](https://www.mkdocs.org/user-guide/) for site configuration. Use the [PyMdown Snippets documentation](https://facelessuser.github.io/pymdown-extensions/extensions/snippets/) for snippet syntax.
- English is the default language. Spanish translations use the `.es.md` suffix alongside the English page; maintain parity when changing both versions or when a change affects an existing translation. Do not invent a translation unless requested.
- Follow existing page metadata: `short_title`, `description`, `date` and an appropriate `thumbnail`, with social card metadata where applicable. Do not invent an image path or date; preserve existing metadata when editing.
- Use one H1 for the title and, where consistent with the surrounding content, numbered H2 and H3 headings. Keep links relative to the source page when linking within the site. Use fenced code blocks with a language, and horizontal rules between major sections where they improve readability.
- Use configured Material features such as admonitions, tabs, tables, grids and Mermaid when they help explain the content, not as decoration. Give admonitions a custom or empty title.

## Editorial voice and style

- Read relevant existing articles before writing. Good starting points are `docs/resources/tools/my-aisy-toolkit.md`, `docs/resources/cheatsheets/my-8-levels-of-ai-development.md` and `docs/resources/cheatsheets/my-continuous-testing-map.md`.
- Write in a personal, approachable and practical voice. Use first person naturally when describing the author's experience, motivation or opinion; address the reader directly when it helps. Never invent personal experiences or opinions.
- Start with why the subject matters or the author's motivation, then develop the explanation in clear, logically ordered sections. Explain technical terms in context, use concrete examples and make takeaways useful to the reader.
- Prefer concise paragraphs and natural language over academic, corporate or promotional phrasing. Use bold for meaningful concepts, and use tables, lists, diagrams and callouts when they make information easier to understand.
- Preserve the author's voice when editing and adapt it naturally for each language. Support factual claims with relevant, reliable links and include further reading or references when appropriate to the article.

## Embedded HTML and expanded view

- Use `docs/resources/tools/my-aisy-toolkit.md` and its source `docs/assets/html/my-aisy-toolkit-flow.html` as the canonical example for embedded HTML and the expand/close experience. Review both before creating or changing an embed. Keep the interaction and visual treatment consistent across embeds, even when their content differs.
- Store the embed in `docs/assets/html/`, delimit the included portion with `<!--8<-- [start:diagram]-->` and `<!--8<-- [end:diagram]-->`, and include it in Markdown with `--8<-- "assets/html/<file>.html:diagram"`. Paths are relative to `docs/` as configured in `mkdocs.yml`. Keep embed-specific styles and scripts scoped to the component and use unique identifiers.
- Provide the same upper-right expand button and expand/close icons as the reference. Expanding presents the content in a viewport-filling fixed panel; the button closes it, Escape closes it, and the content adapts to viewport resizing. Prevent background scrolling while expanded and restore it on close. Preserve the page's prior state when doing so.
- Use a real, keyboard-operable button with an accessible label and `aria-pressed` reflecting its state; localize labels for the page language. Support narrow screens, the site's light and dark themes, and reduced motion where relevant. Keep the embedded content legible and usable in both normal and expanded views.
- Reuse an existing shared implementation if one is introduced; otherwise adapt the reference's shell and behavior instead of inventing a different expansion interaction. The embed can use its own visual design for its content while retaining the common controls and behavior.

## Verification

- For site content or HTML changes, run `mkdocs build --strict` when the environment supports it. For interactive embeds, also verify normal and expanded views, closing via button and Escape, resizing, keyboard access, language and light/dark modes; run relevant existing tests where applicable. Report any checks that could not run.
- Respect existing changes in the working tree. Keep changes scoped to the request and follow `contributing.md` for contribution and Git conventions.
