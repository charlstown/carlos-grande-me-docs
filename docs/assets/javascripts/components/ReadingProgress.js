export class ReadingProgress {
  constructor({ contentSelector = 'article.md-content__inner', headerSelector = '.md-header' } = {}) {
    this.contentSelector = contentSelector;
    this.headerSelector = headerSelector;
    this.bar = null;
    this.fill = null;
    this._onScroll = null;
    this._ticking = false;
  }

  // Returns true only for real post pages (not category indexes).
  static isPostPage(pathname = location.pathname) {
    // Normalize: lowercase and strip a trailing index.html.
    let path = pathname.toLowerCase().replace(/index\.html$/, '');

    const categories = ['/notebooks/', '/projects/', '/references/', '/resources/'];
    const category = categories.find(cat => path.includes(cat));
    if (!category) return false;

    // Exclude category indexes: there must be a real post slug after the
    // category segment. If the path ends exactly at the category (or at a
    // subcategory directory without a post sub-path), it is not a post.
    const afterCategory = path.slice(path.indexOf(category) + category.length);
    // Drop a single trailing slash to inspect remaining segments.
    const remainder = afterCategory.replace(/\/$/, '');
    if (remainder === '') return false;

    // DOM reinforcement: only run when a document is available so the
    // function stays unit-testable in jsdom.
    if (typeof document !== 'undefined' && document) {
      const article = document.querySelector('article.md-content__inner');
      if (!article || !article.querySelector('h1')) return false;
    }

    return true;
  }

  mount() {
    // Guard: do nothing on non-post pages or when the content node is missing.
    if (!ReadingProgress.isPostPage() || document.querySelector(this.contentSelector) === null) {
      return;
    }

    this.bar = document.createElement('div');
    this.bar.className = 'reading-progress';

    this.fill = document.createElement('div');
    this.fill.className = 'reading-progress__fill';
    this.bar.appendChild(this.fill);

    // Insert the bar as the first child of the body.
    document.body.insertBefore(this.bar, document.body.firstChild);

    // Throttle scroll/resize work with requestAnimationFrame.
    this._onScroll = () => {
      if (this._ticking) return;
      this._ticking = true;
      requestAnimationFrame(() => {
        this.update();
        this._ticking = false;
      });
    };

    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onScroll);

    // Set the initial 0% state.
    this.update();
  }

  update() {
    const content = document.querySelector(this.contentSelector);
    if (content === null) return;

    const total = content.offsetTop + content.offsetHeight - window.innerHeight;

    // Short posts that fit on screen: nothing to scroll.
    if (total <= 0) {
      this.fill.style.width = '0%';
      return;
    }

    const progress = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
    this.fill.style.width = progress + '%';
  }

  destroy() {
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onScroll);
    this.bar?.remove();
    this.bar = null;
    this.fill = null;
  }
}

export default ReadingProgress;
