export class LazyLoader {
  constructor({ container, items, renderFn, batchSize = 8 }) {
    this.container = container;
    this.items = items;
    this.renderFn = renderFn;
    this.batchSize = batchSize;
    this.offset = 0;
    this.loading = false;
    this.done = false;
    this._onScroll = this._onScroll.bind(this);
  }

  init() {
    this.loadNext();
    window.addEventListener('scroll', this._onScroll, { passive: true });
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll);
  }

  loadNext() {
    if (this.loading || this.done) return;
    this.loading = true;
    const nextItems = this.items.slice(this.offset, this.offset + this.batchSize);
    if (nextItems.length) {
      this.renderFn(nextItems);
      this.offset += nextItems.length;
    }
    if (this.offset >= this.items.length) {
      this.done = true;
      this.destroy();
    }
    this.loading = false;
  }

  _onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewport = window.innerHeight;
    const galleryRect = this.container.getBoundingClientRect();
    const galleryBottom = galleryRect.bottom + scrollY;
    if (scrollY + viewport + 100 >= galleryBottom) {
      this.loadNext();
    }
  }
}
