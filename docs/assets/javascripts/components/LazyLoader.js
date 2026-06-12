export class LazyLoader {
  constructor({ container, items, renderFn, batchSize = 8 }) {
    this.container = container;
    this.items = items;
    this.renderFn = renderFn;
    this.batchSize = batchSize;
    this.offset = 0;
    this.loading = false;
    this.done = false;
    this._sentinel = null;
    this._observer = null;
  }

  init() {
    this._sentinel = document.createElement('div');
    this.container.after(this._sentinel);
    this._observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) this.loadNext();
    }, { rootMargin: '100px' });
    this._observer.observe(this._sentinel);
    this.loadNext();
  }

  destroy() {
    if (this._observer) { this._observer.disconnect(); this._observer = null; }
    if (this._sentinel) { this._sentinel.remove(); this._sentinel = null; }
  }

  loadNext() {
    if (this.loading || this.done) return;
    this.loading = true;

    while (true) {
      const nextItems = this.items.slice(this.offset, this.offset + this.batchSize);
      if (nextItems.length) {
        this.renderFn(nextItems);
        this.offset += nextItems.length;
      }

      if (this.offset >= this.items.length) {
        this.done = true;
        this.destroy();
        break;
      }

      if (!this._sentinel || this._sentinel.getBoundingClientRect().top > window.innerHeight + 100) break;
    }

    this.loading = false;
  }
}
