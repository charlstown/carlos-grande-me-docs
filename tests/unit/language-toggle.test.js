import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import LanguageToggle, { LanguageToggle as NamedLanguageToggle } from '../../docs/assets/javascripts/components/LanguageToggle.js';

/**
 * Installs a controllable in-memory localStorage mock on the global object.
 * Returns the backing store so tests can seed/assert values directly.
 */
function mockLocalStorage() {
  const store = new Map();
  const mock = {
    getItem: vi.fn((key) => (store.has(key) ? store.get(key) : null)),
    setItem: vi.fn((key, value) => { store.set(key, String(value)); }),
    removeItem: vi.fn((key) => { store.delete(key); }),
    clear: vi.fn(() => { store.clear(); }),
  };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: mock,
  });
  return { store, mock };
}

/**
 * Replaces window.location with a minimal mock exposing an `assign` spy, so a
 * click never triggers a real navigation. jsdom's native location.assign is
 * non-configurable, so we redefine the whole `location` property instead.
 * Returns the spy and a restore() to put the original location back.
 */
function mockLocationAssign() {
  const original = window.location;
  const assign = vi.fn();
  // href/pathname simulate a page distinct from the toggle targets so the
  // component's self-navigation guard (target.pathname === location.pathname)
  // does not bail during the normal navigation tests.
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: {
      assign,
      origin: 'http://localhost',
      href: 'http://localhost/start/',
      pathname: '/start/',
    },
  });
  return {
    assign,
    restore() {
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: original,
      });
    },
  };
}

/**
 * Creates and appends a header toggle button with the data-attributes the
 * component reads on mount(). Mirrors the real button rendered by the MkDocs
 * Material override (class `md-lang-toggle md-header__button`).
 *
 * @param {object} opts
 * @param {string} [opts.current='en']   - Value for data-lang-current.
 * @param {string} [opts.enUrl]          - Value for data-lang-en-url.
 * @param {string} [opts.esUrl]          - Value for data-lang-es-url.
 * @param {string} [opts.isHome='false'] - Value for data-is-home.
 * @returns {HTMLButtonElement}
 */
function mountToggleButton({
  current = 'en',
  enUrl = '/resources/post/',
  esUrl = '/es/resources/post/',
  isHome = 'false',
} = {}) {
  const btn = document.createElement('button');
  btn.className = 'md-lang-toggle md-header__button';
  btn.dataset.langCurrent = current;
  btn.dataset.langEnUrl = enUrl;
  btn.dataset.langEsUrl = esUrl;
  btn.dataset.isHome = isHome;
  document.body.appendChild(btn);
  return btn;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

describe('LanguageToggle exports', () => {
  it('exposes the same class as default and named export', () => {
    expect(LanguageToggle).toBe(NamedLanguageToggle);
  });
});

// ---------------------------------------------------------------------------
// Static helpers
// ---------------------------------------------------------------------------

describe('LanguageToggle.normalizeLocale', () => {
  it("returns 'es' for plain 'es'", () => {
    expect(LanguageToggle.normalizeLocale('es')).toBe('es');
  });

  it("returns 'es' for regional Spanish tags (es-ES, es-MX, es-AR, es-419)", () => {
    expect(LanguageToggle.normalizeLocale('es-ES')).toBe('es');
    expect(LanguageToggle.normalizeLocale('es-MX')).toBe('es');
    expect(LanguageToggle.normalizeLocale('es-AR')).toBe('es');
    expect(LanguageToggle.normalizeLocale('es-419')).toBe('es');
  });

  it("returns 'en' for plain 'en' and 'en-US'", () => {
    expect(LanguageToggle.normalizeLocale('en')).toBe('en');
    expect(LanguageToggle.normalizeLocale('en-US')).toBe('en');
  });

  it("returns 'en' for an unrelated locale like 'fr'", () => {
    expect(LanguageToggle.normalizeLocale('fr')).toBe('en');
  });

  it("returns 'en' for the empty string", () => {
    expect(LanguageToggle.normalizeLocale('')).toBe('en');
  });

  it("returns 'en' for undefined", () => {
    expect(LanguageToggle.normalizeLocale(undefined)).toBe('en');
  });
});

describe('LanguageToggle.getStoredPreference', () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  it("returns 'es' when a valid 'es' value is stored", () => {
    localStorage.setItem('preferred-lang', 'es');
    expect(LanguageToggle.getStoredPreference()).toBe('es');
  });

  it("returns 'en' when a valid 'en' value is stored", () => {
    localStorage.setItem('preferred-lang', 'en');
    expect(LanguageToggle.getStoredPreference()).toBe('en');
  });

  it('returns null when no preference is stored', () => {
    expect(LanguageToggle.getStoredPreference()).toBeNull();
  });

  it('returns null when the stored value is invalid', () => {
    localStorage.setItem('preferred-lang', 'fr');
    expect(LanguageToggle.getStoredPreference()).toBeNull();
  });

  it('reads from a custom storage key when provided', () => {
    localStorage.setItem('my-key', 'es');
    expect(LanguageToggle.getStoredPreference('my-key')).toBe('es');
    expect(LanguageToggle.getStoredPreference('preferred-lang')).toBeNull();
  });
});

describe('LanguageToggle.resolveDefault', () => {
  it('prefers a valid stored preference over the navigator language', () => {
    expect(LanguageToggle.resolveDefault({ stored: 'en', navLang: 'es-ES' })).toBe('en');
    expect(LanguageToggle.resolveDefault({ stored: 'es', navLang: 'en-US' })).toBe('es');
  });

  it("falls back to navigator language (es*) when no preference is stored", () => {
    expect(LanguageToggle.resolveDefault({ stored: null, navLang: 'es-MX' })).toBe('es');
  });

  it("returns 'en' when there is no stored preference and no navigator language", () => {
    expect(LanguageToggle.resolveDefault({ stored: null, navLang: undefined })).toBe('en');
    expect(LanguageToggle.resolveDefault({})).toBe('en');
  });

  it('ignores an invalid stored value and resolves via navigator language', () => {
    expect(LanguageToggle.resolveDefault({ stored: 'fr', navLang: 'es-AR' })).toBe('es');
  });
});

// ---------------------------------------------------------------------------
// mount() and _onClick() — header button
// ---------------------------------------------------------------------------

describe('LanguageToggle.mount — header button', () => {
  let loc;

  beforeEach(() => {
    mockLocalStorage();
    loc = mockLocationAssign();
  });

  afterEach(() => {
    loc.restore();
  });

  it('registers a click handler when the header button is present', () => {
    const button = mountToggleButton({ current: 'en', isHome: 'false' });
    const addSpy = vi.spyOn(button, 'addEventListener');

    const toggle = new LanguageToggle();
    toggle.mount();

    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(toggle.button).toBe(button);
    toggle.destroy();
  });

  it('does nothing and does not throw when no toggle button is present', () => {
    const toggle = new LanguageToggle();
    expect(() => toggle.mount()).not.toThrow();
    expect(toggle.button).toBeNull();
    expect(toggle._onClick).toBeNull();
  });

  // --- Post page (data-is-home="false") ---

  it('post: click persists the target locale and navigates (en -> es)', () => {
    // No stored preference: navigator defaults to 'en' in jsdom, so
    // this.current stays 'en' after mount. Click target becomes 'es'.
    mountToggleButton({
      current: 'en',
      enUrl: '/resources/post/',
      esUrl: '/es/resources/post/',
      isHome: 'false',
    });

    const toggle = new LanguageToggle();
    toggle.mount();
    toggle.button.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('preferred-lang', 'es');
    expect(loc.assign).toHaveBeenCalledWith('/es/resources/post/');
    toggle.destroy();
  });

  it('post: click persists the target locale and navigates (es -> en)', () => {
    // Mount on the ES page; this.current = 'es' (page locale). Click target = 'en'.
    mountToggleButton({
      current: 'es',
      enUrl: '/resources/post/',
      esUrl: '/es/resources/post/',
      isHome: 'false',
    });

    const toggle = new LanguageToggle();
    toggle.mount();
    toggle.button.click();

    expect(localStorage.setItem).toHaveBeenLastCalledWith('preferred-lang', 'en');
    expect(loc.assign).toHaveBeenCalledWith('/resources/post/');
    toggle.destroy();
  });

  // --- Home page (data-is-home="true") ---

  it('home: click persists the target locale but does NOT navigate', () => {
    // No stored preference: navigator defaults to 'en' in jsdom.
    // this.current = 'en' after mount. Click target = 'es'. No navigation.
    mountToggleButton({
      current: 'en',
      enUrl: '/resources/post/',
      esUrl: '/es/resources/post/',
      isHome: 'true',
    });

    const toggle = new LanguageToggle();
    toggle.mount();
    toggle.button.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('preferred-lang', 'es');
    expect(loc.assign).not.toHaveBeenCalled();
    toggle.destroy();
  });

  it('home: repeated clicks toggle the stored preference without navigating', () => {
    // this.current starts as page locale 'en'. First click: en -> es. Second click: es -> en.
    mountToggleButton({
      current: 'en',
      enUrl: '/resources/post/',
      esUrl: '/es/resources/post/',
      isHome: 'true',
    });

    const toggle = new LanguageToggle();
    toggle.mount();

    toggle.button.click(); // en -> es
    expect(localStorage.setItem).toHaveBeenLastCalledWith('preferred-lang', 'es');

    toggle.button.click(); // es -> en
    expect(localStorage.setItem).toHaveBeenLastCalledWith('preferred-lang', 'en');

    expect(loc.assign).not.toHaveBeenCalled();
    toggle.destroy();
  });

  // --- Mount reflects cached preference ---

  it("home: mount always sets this.current to the page locale, ignoring cached preference", () => {
    // Seed localStorage with 'es' before mount. this.current must stay 'en'
    // (the page locale from data-lang-current) regardless of stored preference.
    localStorage.setItem('preferred-lang', 'es');

    mountToggleButton({
      current: 'en',
      enUrl: '/resources/post/',
      esUrl: '/es/resources/post/',
      isHome: 'true',
    });

    const toggle = new LanguageToggle();
    toggle.mount();

    expect(toggle.current).toBe('en');
    toggle.destroy();
  });

  it("post: mount always sets this.current to the page locale, ignoring cached preference", () => {
    // Same behaviour on post pages: stored preference must not override the page locale.
    localStorage.setItem('preferred-lang', 'es');

    mountToggleButton({
      current: 'en',
      enUrl: '/resources/post/',
      esUrl: '/es/resources/post/',
      isHome: 'false',
    });

    const toggle = new LanguageToggle();
    toggle.mount();

    expect(toggle.current).toBe('en');
    toggle.destroy();
  });
});
