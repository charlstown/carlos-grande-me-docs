// Auto-wrap images with a caption container on all pages except home
(function () {
  function isHome() {
    try {
      const logo = document.querySelector('a.md-logo, a.md-header__button.md-logo');
      const baseHref = logo ? logo.getAttribute('href') : '/';
      const basePath = new URL(baseHref, window.location.origin)
        .pathname.replace(/index\.html$/, '')
        .replace(/\/$/, '/');
      const here = window.location.pathname
        .replace(/index\.html$/, '')
        .replace(/\/$/, '/');
      return here === basePath;
    } catch (e) {
      const p = window.location.pathname;
      return p === '/' || p.endsWith('/index.html');
    }
  }

  function captionize(scope = document) {
    if (isHome()) return;

    const root = scope.querySelector('.md-content') || scope;
    const imgs = root.querySelectorAll('img');

    imgs.forEach((img) => {
      if (img.closest('.parent-caption')) return;              // already processed
      if (img.classList.contains('no-auto-caption')) return;   // manual opt-out
      if (img.closest('.md-header, .md-footer, .md-nav, .md-sidebar')) return; // outside content

      const alt = (img.getAttribute('alt') || '').trim();

      const parent = document.createElement('div');
      parent.className = 'parent-caption';
      parent.setAttribute('data-captionized', '1');

      const caption = document.createElement('div');
      caption.className = 'caption';
      if (alt) caption.textContent = alt; // if empty, remains :empty for CSS to hide

      const ref = img;
      const container = ref.parentNode;
      container.insertBefore(parent, ref);
      parent.appendChild(ref);
      parent.appendChild(caption);
    });
  }

  function run() { captionize(document); }

  // Support Material for MkDocs instant navigation
  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(() => { run(); });
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }
})();
