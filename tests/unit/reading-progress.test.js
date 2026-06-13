import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ReadingProgress, { ReadingProgress as NamedReadingProgress } from '../../docs/assets/javascripts/components/ReadingProgress.js';

/**
 * Mounts a valid post-like DOM (article + h1, no gallery containers).
 */
function mountPostDOM() {
  document.body.innerHTML = '<article class="md-content__inner"><h1>Title</h1></article>';
  return document.querySelector('article.md-content__inner');
}

/**
 * Forces the geometry used by update():
 * total = content.offsetTop + content.offsetHeight - window.innerHeight
 */
function setGeometry(content, { offsetTop, offsetHeight, innerHeight, scrollY }) {
  Object.defineProperty(content, 'offsetTop', { configurable: true, value: offsetTop });
  Object.defineProperty(content, 'offsetHeight', { configurable: true, value: offsetHeight });
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: innerHeight });
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: scrollY });
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ReadingProgress exports', () => {
  it('exposes the same class as default and named export', () => {
    expect(ReadingProgress).toBe(NamedReadingProgress);
  });
});

describe('ReadingProgress.isPostPage — path-only rejections (no DOM dependency)', () => {
  it('returns false for the site root "/"', () => {
    expect(ReadingProgress.isPostPage('/')).toBe(false);
  });

  it('returns false for a non-category page "/about-me/"', () => {
    expect(ReadingProgress.isPostPage('/about-me/')).toBe(false);
  });

  it('returns false for the category index "/notebooks/"', () => {
    expect(ReadingProgress.isPostPage('/notebooks/')).toBe(false);
  });

  it('returns false for the category index "/references/"', () => {
    expect(ReadingProgress.isPostPage('/references/')).toBe(false);
  });
});

describe('ReadingProgress.isPostPage — real post pages (DOM reinforcement)', () => {
  it('returns true for a 3-segment post when a valid article is mounted', () => {
    mountPostDOM();
    expect(ReadingProgress.isPostPage('/notebooks/coding/some-post/')).toBe(true);
  });

  it('returns true for a 2-segment post when a valid article is mounted', () => {
    mountPostDOM();
    expect(ReadingProgress.isPostPage('/projects/app-pickasa/')).toBe(true);
  });

  it('returns false when no article is mounted even for a valid post path', () => {
    expect(ReadingProgress.isPostPage('/projects/app-pickasa/')).toBe(false);
  });

  it('returns false when the article has no h1', () => {
    document.body.innerHTML = '<article class="md-content__inner"><p>No heading</p></article>';
    expect(ReadingProgress.isPostPage('/projects/app-pickasa/')).toBe(false);
  });
});

describe('ReadingProgress.isPostPage — listing/gallery exclusion', () => {
  it('returns false when a #gallery container is present', () => {
    document.body.innerHTML =
      '<article class="md-content__inner"><h1>Notebooks</h1><div id="gallery"></div></article>';
    expect(ReadingProgress.isPostPage('/notebooks/coding/')).toBe(false);
  });

  it('returns false when a .gallery-home-item container is present', () => {
    document.body.innerHTML =
      '<article class="md-content__inner"><h1>Home</h1><div class="gallery-home-item"></div></article>';
    expect(ReadingProgress.isPostPage('/projects/app-pickasa/')).toBe(false);
  });
});

describe('ReadingProgress.mount', () => {
  it('does not create .reading-progress on a non-post page', () => {
    // No article mounted -> isPostPage() (reads location.pathname) -> false.
    const rp = new ReadingProgress();
    rp.mount();
    expect(document.querySelector('.reading-progress')).toBeNull();
    rp.destroy();
  });
});

describe('ReadingProgress.update', () => {
  it('sets width to 0% when content fits in the viewport (total <= 0)', () => {
    const content = mountPostDOM();
    setGeometry(content, { offsetTop: 0, offsetHeight: 500, innerHeight: 800, scrollY: 0 });

    const rp = new ReadingProgress();
    rp.fill = document.createElement('div');
    rp.update();

    expect(rp.fill.style.width).toBe('0%');
  });

  it('clamps the width to 100% when scrollY exceeds total', () => {
    const content = mountPostDOM();
    // total = 0 + 2000 - 800 = 1200; scrollY far beyond that.
    setGeometry(content, { offsetTop: 0, offsetHeight: 2000, innerHeight: 800, scrollY: 99999 });

    const rp = new ReadingProgress();
    rp.fill = document.createElement('div');
    rp.update();

    expect(rp.fill.style.width).toBe('100%');
  });
});
