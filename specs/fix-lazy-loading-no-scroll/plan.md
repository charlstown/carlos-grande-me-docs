# Plan: Fix lazy loading bloqueado en viewports sin scrollbar

## Batch 1 — Reemplazar scroll listener por IntersectionObserver

- [x] En el constructor de `LazyLoader` (línea 10), eliminar `this._onScroll = this._onScroll.bind(this);` y añadir `this._sentinel = null; this._observer = null;` para inicializar las nuevas propiedades de instancia.
- [x] Reemplazar el cuerpo completo de `init()` (líneas 13-16): crear un `div` sentinel con `document.createElement('div')`, insertarlo con `this.container.after(this._sentinel)`, instanciar `this._observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) this.loadNext(); }, { rootMargin: '100px' })`, llamar a `this._observer.observe(this._sentinel)` y finalmente llamar a `this.loadNext()`.
- [x] Reemplazar el cuerpo completo de `destroy()` (líneas 18-20): desconectar con `if (this._observer) { this._observer.disconnect(); this._observer = null; }` y eliminar sentinel con `if (this._sentinel) { this._sentinel.remove(); this._sentinel = null; }`.
- [x] Eliminar el método `_onScroll()` completo (líneas 37-45), ya que queda obsoleto.

## Batch 2 — Verificación manual

- [x] Abrir `http://127.0.0.1:8000/` en viewport 1080 × 1729 px y confirmar que se cargan más de 8 cards automáticamente sin hacer scroll (todos los batches hasta los 45 items).
- [x] Verificar en viewport 1920 × 1080 px que el lazy loading al hacer scroll sigue funcionando sin regresión.
