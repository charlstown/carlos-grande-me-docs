export class ReadingProgress {
  constructor({ contentSelector = 'article.md-content__inner', headerSelector = '.md-header' } = {}) {
    this.contentSelector = contentSelector;
    this.headerSelector = headerSelector;
    this.bar = null;
    this.fill = null;
    this._onScroll = null;
    this._ticking = false;
  }

  // Returns true only for real post pages (not category or sub-category
  // indexes). Works with MkDocs directory-style URLs (trailing slash or a
  // trailing index.html).
  static isPostPage(pathname = location.pathname) {
    // Normalize: lowercase and split into non-empty segments, discarding a
    // trailing "index.html" so directory and index forms behave the same.
    const path = pathname.toLowerCase();
    const segments = path
      .split('/')
      .filter(Boolean)
      .filter(seg => seg !== 'index.html');

    const categories = ['notebooks', 'projects', 'references', 'resources'];
    const categoryIndex = segments.findIndex(seg => categories.includes(seg));
    if (categoryIndex === -1) return false;

    // Path depth check: a post owns at least one slug segment AFTER the
    // category. Posts live either two segments deep (e.g.
    // /projects/<slug>/) or three segments deep with a sub-category (e.g.
    // /notebooks/<sub-category>/<slug>/). A category index such as
    // /notebooks/ has 0 segments after the category and is not a post.
    const segmentsAfterCategory = segments.length - (categoryIndex + 1);
    if (segmentsAfterCategory < 1) return false;

    // DOM reinforcement: authoritative guard, only run when a document is
    // available so the function stays unit-testable in jsdom. When no DOM is
    // mounted (explicit pathname in tests), skip it and rely on the
    // path-segment logic above.
    if (typeof document !== 'undefined' && document) {
      const article = document.querySelector('article.md-content__inner');
      if (!article || !article.querySelector('h1')) return false;

      // Listing/gallery pages render inside the same content node but are not
      // posts. Reject them defensively if any known gallery/listing container
      // is present.
      const isListing = article.querySelector(
        '#gallery, .gallery-home-item, .gallery-home-title'
      );
      if (isListing) return false;
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
