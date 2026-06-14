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
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { assign },
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
 * Mounts a `.md-lang-toggle` button with the data-attributes the component
 * reads on mount(). Returns the button element.
 */
function mountToggleButton({ current = 'es', enUrl = '/en/post/', esUrl = '/es/post/' } = {}) {
  document.body.innerHTML =
    `<button class="md-lang-toggle" ` +
    `data-lang-current="${current}" ` +
    `data-lang-en-url="${enUrl}" ` +
    `data-lang-es-url="${esUrl}"></button>`;
  return document.querySelector('.md-lang-toggle');
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('LanguageToggle exports', () => {
  it('exposes the same class as default and named export', () => {
    expect(LanguageToggle).toBe(NamedLanguageToggle);
  });
});

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

describe('LanguageToggle.mount', () => {
  let location;

  beforeEach(() => {
    mockLocalStorage();
    location = mockLocationAssign();
  });

  afterEach(() => {
    location.restore();
  });

  it('registers a click handler when the toggle button is present', () => {
    const button = mountToggleButton({ current: 'es' });
    const addSpy = vi.spyOn(button, 'addEventListener');

    const toggle = new LanguageToggle();
    toggle.mount();

    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(toggle.button).toBe(button);
    toggle.destroy();
  });

  it('stores the opposite locale on click (es -> en)', () => {
    const button = mountToggleButton({ current: 'es' });

    const toggle = new LanguageToggle();
    toggle.mount();
    button.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('preferred-lang', 'en');
    expect(location.assign).toHaveBeenCalledWith('/en/post/');
    toggle.destroy();
  });

  it('stores the opposite locale on click (en -> es)', () => {
    const button = mountToggleButton({ current: 'en' });

    const toggle = new LanguageToggle();
    toggle.mount();
    button.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('preferred-lang', 'es');
    expect(location.assign).toHaveBeenCalledWith('/es/post/');
    toggle.destroy();
  });

  it('does nothing and does not throw when no toggle button is present', () => {
    const toggle = new LanguageToggle();
    expect(() => toggle.mount()).not.toThrow();
    expect(toggle.button).toBeNull();
    expect(toggle._onClick).toBeNull();
  });
});
