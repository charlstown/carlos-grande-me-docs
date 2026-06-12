# Fix: Lazy loading bloqueado en pantallas verticales sin scrollbar

## Resumen del bug

El lazy loading de la galería de la home queda completamente bloqueado cuando el viewport es lo suficientemente alto como para mostrar el primer batch de 8 cards sin necesitar scrollbar. Al no existir barra de scroll, el evento `scroll` de la ventana nunca se dispara, y el `LazyLoader` no carga ningún item adicional. El usuario ve únicamente 8 de las 45 publicaciones disponibles.

---

## Información del entorno

| Campo | Valor |
|---|---|
| URL reproducida | `http://127.0.0.1:8000/` |
| Fecha de reproducción | 2026-06-12 |
| Viewport bug | 1080 × 1729 px (pantalla vertical / portrait) |
| Sistema | Windows 11 Home 10.0.26200 |
| Navegador | Chromium (Chrome DevTools MCP) |
| Archivo afectado | `docs/assets/javascripts/components/LazyLoader.js` |

---

## Descripción detallada

### Comportamiento esperado

Al cargar la home, el `LazyLoader` debe mostrar el primer batch de 8 cards y **continuar cargando** los siguientes batches de forma automática hasta llenar el viewport o hasta que el usuario haga scroll hacia abajo para ver más contenido. Si todo el contenido disponible cabe en la pantalla, debe mostrarse completo en la carga inicial.

### Comportamiento real

El `LazyLoader` carga el primer batch de 8 cards en `init()` y luego queda **permanentemente bloqueado**. Las 37 publicaciones restantes (de un total de 45) nunca se cargan. La galería aparece como si solo existieran 8 publicaciones.

---

## Análisis de causa raíz

### Código responsable

**`docs/assets/javascripts/components/LazyLoader.js`**

```js
// Línea 13-15: init() carga 1 batch y registra el listener de scroll
init() {
  this.loadNext();
  window.addEventListener('scroll', this._onScroll, { passive: true });
}

// Línea 37-44: _onScroll() es el ÚNICO mecanismo para cargar más items
_onScroll() {
  const scrollY = window.scrollY || window.pageYOffset;
  const viewport = window.innerHeight;
  const galleryRect = this.container.getBoundingClientRect();
  const galleryBottom = galleryRect.bottom + scrollY;
  if (scrollY + viewport + 100 >= galleryBottom) {
    this.loadNext();
  }
}
```

### Mecanismo del fallo

1. `init()` llama a `loadNext()` una sola vez → se renderizan **8 cards** (batchSize = 8).
2. Se registra `window.addEventListener('scroll', ...)` como único trigger para cargas adicionales.
3. En un viewport de **1080 × 1729 px** (pantalla vertical), las 8 cards en rejilla de 4 columnas ocupan **631 px de altura** y el documento completo (header + hero + gallery) encaja exactamente en **1729 px** → `document.scrollHeight === window.innerHeight`.
4. Al no haber overflow, el navegador **no muestra scrollbar**. Sin scrollbar, el usuario **no puede hacer scroll**. Sin scroll, el evento `scroll` **nunca se dispara**. Sin evento, `_onScroll()` **nunca se ejecuta**. Sin `_onScroll()`, `loadNext()` **nunca vuelve a ser llamado**.
5. Las 37 publicaciones restantes quedan **permanentemente inaccesibles** hasta que el usuario redimensione la ventana o use otro dispositivo.

### Paradoja de la condición de carga

La lógica interna del LazyLoader **sí detectaría** que debe cargar más si fuera consultada, pero jamás lo es:

```
condición: scrollY + viewport + 100 >= galleryBottom
resultado:      0   + 1729    + 100 >= 1471  →  TRUE
```

La condición está satisfecha matemáticamente, pero al depender del evento `scroll` para evaluarse, nunca se ejecuta.

---

## Evidencia técnica (DevTools)

### Medidas en viewport afectado (1080 × 1729 px)

| Métrica | Valor |
|---|---|
| `window.innerWidth` | 1080 px |
| `window.innerHeight` | 1729 px |
| `document.scrollHeight` | 1729 px |
| `hasVerticalScrollbar` | **false** |
| `window.scrollY` | 0 |
| Cards cargadas | **8** |
| Cards totales disponibles | 45 |
| **Cards bloqueadas** | **37 (82%)** |
| Gallery top (desde viewport top) | 840 px |
| Gallery bottom (absoluta) | 1471 px |
| Gallery height | 631 px |
| Columnas en grid | 4 × 227.5 px |
| Condición `_onScroll` lógicamente cumplida | **true** |
| Evento `scroll` disparado | **false** (sin scrollbar) |

### Prueba de disparo manual del evento scroll

Se ejecutó `window.dispatchEvent(new Event('scroll'))` con JavaScript:

```json
{
  "cardsBefore": 8,
  "cardsAfter": 16,
  "newCardsLoaded": 8,
  "conclusion": "CONFIRMADO: al forzar el evento scroll se cargaron 8 cards nuevas (total: 16)"
}
```

Esto demuestra que el `LazyLoader` está correctamente configurado y **funciona cuando recibe el evento**, pero ese evento nunca llega de forma orgánica.

### Comparativa viewport normal (1080 × 900 px)

| Métrica | Bug (1080×1729) | Normal (1080×900) |
|---|---|---|
| `document.scrollHeight` | 1729 px | 1296 px |
| `hasVerticalScrollbar` | false | **true** |
| Cards iniciales cargadas | 8 | 8 |
| Cards tras scroll | — (imposible) | 16+ |

---

## Pasos para reproducir

1. Abrir `http://127.0.0.1:8000/` en un navegador con viewport de **1080 × 1729 px** o superior en altura (monitor vertical / portrait).
2. Observar que la galería muestra exactamente **8 cards** y no aparece scrollbar.
3. Intentar hacer scroll → no es posible porque no hay overflow.
4. Esperar indefinidamente → no se cargan más cards.
5. **Workaround del usuario:** redimensionar la ventana a menos altura (ej. 1080 × 900 px) → aparece scrollbar → al hacer scroll carga más cards.

---

## Capturas de pantalla

| Archivo | Descripción |
|---|---|
| `evidence/01-initial-load-normal.png` | Carga inicial, estado previo a la reproducción |
| `evidence/02-bug-state-8cards-no-scrollbar.png` | Estado bugueado: 8 cards, sin scrollbar, sin overflow |
| `evidence/03-workaround-resize-scroll-16cards.png` | Workaround: ventana reducida, scroll manual, 16 cards visibles |
| `evidence/04-bug-reproduced-full-viewport.png` | Página completa en viewport afectado (fullPage screenshot) |
| `evidence/05-normal-viewport-scrollbar-visible.png` | Viewport normal con scrollbar visible para contraste |

---

## Alcance del impacto

- **Quién se ve afectado:** Cualquier usuario con monitor en orientación vertical (portrait) o monitor con resolución de altura ≥ ~1400 px y anchura ~1080 px.
- **Publicaciones inaccesibles:** 37 de 45 (82% del contenido).
- **Categorías afectadas:** Todas (notebooks, projects, resources, articles, case studies).
- **Filtros afectados:** Todos los filtros, ya que el problema está en el mecanismo de scroll, no en el filtrado.

---

## Solución propuesta

Reemplazar el listener de `scroll` por un `IntersectionObserver` sobre un elemento **sentinel** colocado al final del contenedor. El `IntersectionObserver` se activa cuando el sentinel entra en el viewport independientemente de si existe scrollbar o no, y también cubre el caso inicial donde todo el contenido cabe en pantalla.

**Lógica propuesta:**

```js
init() {
  this._sentinel = document.createElement('div');
  this.container.after(this._sentinel);
  this._observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) this.loadNext();
  }, { rootMargin: '100px' });
  this._observer.observe(this._sentinel);
  this.loadNext(); // primer batch
}

destroy() {
  if (this._observer) this._observer.disconnect();
  if (this._sentinel) this._sentinel.remove();
}
```

Esto elimina la dependencia del evento `scroll` y garantiza que el lazy loading funcione incluso cuando todo el contenido inicial encaja en el viewport sin generar overflow.

---

## Archivos a modificar

| Archivo | Cambio requerido |
|---|---|
| `docs/assets/javascripts/components/LazyLoader.js` | Reemplazar `window.scroll` listener por `IntersectionObserver` en sentinel |

---

## Referencias

- `docs/assets/javascripts/components/LazyLoader.js:13-45` — lógica de init y scroll
- `overrides/home.html:75-86` — instanciación de `LazyLoader` con `batchSize: 8`
- `docs/assets/stylesheets/gallery_home.css:47-55` — grid de 4 columnas con `minmax(clamp(180px, 20vw, 260px), 1fr)`
- `docs/assets/publications.json` — 45 items en total
