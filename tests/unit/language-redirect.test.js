import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import applyLanguageRedirect, { applyLanguageRedirect as namedApplyLanguageRedirect } from '../../docs/assets/javascripts/components/LanguageRedirect.js';

/**
 * Installs a controllable in-memory localStorage mock on the global object.
 * Returns the backing store so tests can seed values directly.
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
 * Replaces window.location with a minimal mock exposing a `replace` spy, so the
 * redirect never triggers a real navigation. jsdom's native location.replace is
 * non-configurable, so we redefine the whole `location` property instead.
 * Returns the spy and a restore() to put the original location back.
 */
function mockLocationReplace() {
  const original = window.location;
  const replace = vi.fn();
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { replace },
  });
  return {
    replace,
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
 * Overrides a navigator property with a controllable value. Each override is
 * reverted in afterEach via the returned restore() callbacks.
 */
const navRestores = [];
function setNavigator(prop, value) {
  const original = Object.getOwnPropertyDescriptor(window.navigator, prop);
  Object.defineProperty(window.navigator, prop, { value, configurable: true });
  navRestores.push(() => {
    if (original) {
      Object.defineProperty(window.navigator, prop, original);
    } else {
      delete window.navigator[prop];
    }
  });
}

/**
 * Mounts a `.md-lang-toggle` button with the data-attributes the redirect reads.
 */
function mountToggleButton({ current = 'en', esUrl = '/es/post/' } = {}) {
  const esAttr = esUrl === null ? '' : `data-lang-es-url="${esUrl}" `;
  document.body.innerHTML =
    `<button class="md-lang-toggle" ` +
    `data-lang-current="${current}" ` +
    esAttr +
    `></button>`;
  return document.querySelector('.md-lang-toggle');
}

let location;

beforeEach(() => {
  document.body.innerHTML = '';
  mockLocalStorage();
  location = mockLocationReplace();
  // Default to a normal, non-bot browser environment.
  setNavigator('webdriver', false);
  setNavigator('userAgent', 'Mozilla/5.0 (Test; rv:1.0) Gecko/20100101 Firefox/1.0');
});

afterEach(() => {
  document.body.innerHTML = '';
  location.restore();
  while (navRestores.length) navRestores.pop()();
  vi.restoreAllMocks();
});

describe('LanguageRedirect exports', () => {
  it('exposes the same function as default and named export', () => {
    expect(applyLanguageRedirect).toBe(namedApplyLanguageRedirect);
  });
});

describe('applyLanguageRedirect — no toggle button', () => {
  it('does not redirect when the toggle button is absent', () => {
    setNavigator('language', 'es-ES');
    localStorage.setItem('preferred-lang', 'es');

    applyLanguageRedirect();

    expect(location.replace).not.toHaveBeenCalled();
  });
});

describe('applyLanguageRedirect — desired language is en', () => {
  it('does not redirect when stored preference is en', () => {
    mountToggleButton({ current: 'en', esUrl: '/es/post/' });
    setNavigator('language', 'en-US');
    localStorage.setItem('preferred-lang', 'en');

    applyLanguageRedirect();

    expect(location.replace).not.toHaveBeenCalled();
  });

  it('does not redirect when navigator language resolves to en and nothing is stored', () => {
    mountToggleButton({ current: 'en', esUrl: '/es/post/' });
    setNavigator('language', 'fr-FR');

    applyLanguageRedirect();

    expect(location.replace).not.toHaveBeenCalled();
  });
});

describe('applyLanguageRedirect — redirect cases', () => {
  it('redirects to data-lang-es-url when stored is es and current is en', () => {
    mountToggleButton({ current: 'en', esUrl: '/es/post/' });
    setNavigator('language', 'en-US');
    localStorage.setItem('preferred-lang', 'es');

    applyLanguageRedirect();

    expect(location.replace).toHaveBeenCalledTimes(1);
    expect(location.replace).toHaveBeenCalledWith('/es/post/');
  });

  it('redirects when there is no stored preference but navigator.language is es-ES', () => {
    mountToggleButton({ current: 'en', esUrl: '/es/post/' });
    setNavigator('language', 'es-ES');

    applyLanguageRedirect();

    expect(location.replace).toHaveBeenCalledWith('/es/post/');
  });

  it('does not redirect when current is already es', () => {
    mountToggleButton({ current: 'es', esUrl: '/es/post/' });
    setNavigator('language', 'es-ES');
    localStorage.setItem('preferred-lang', 'es');

    applyLanguageRedirect();

    expect(location.replace).not.toHaveBeenCalled();
  });

  it('does not redirect when data-lang-es-url is missing', () => {
    mountToggleButton({ current: 'en', esUrl: null });
    setNavigator('language', 'es-ES');
    localStorage.setItem('preferred-lang', 'es');

    applyLanguageRedirect();

    expect(location.replace).not.toHaveBeenCalled();
  });
});

describe('applyLanguageRedirect — precedence', () => {
  it('stored en wins over navigator es (no redirect)', () => {
    mountToggleButton({ current: 'en', esUrl: '/es/post/' });
    setNavigator('language', 'es-ES');
    localStorage.setItem('preferred-lang', 'en');

    applyLanguageRedirect();

    expect(location.replace).not.toHaveBeenCalled();
  });
});

describe('applyLanguageRedirect — crawler guard', () => {
  it('does not redirect when navigator.webdriver is true', () => {
    mountToggleButton({ current: 'en', esUrl: '/es/post/' });
    setNavigator('language', 'es-ES');
    setNavigator('webdriver', true);
    localStorage.setItem('preferred-lang', 'es');

    applyLanguageRedirect();

    expect(location.replace).not.toHaveBeenCalled();
  });

  it('does not redirect when the user-agent looks like a bot', () => {
    mountToggleButton({ current: 'en', esUrl: '/es/post/' });
    setNavigator('language', 'es-ES');
    setNavigator('userAgent', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    localStorage.setItem('preferred-lang', 'es');

    applyLanguageRedirect();

    expect(location.replace).not.toHaveBeenCalled();
  });
});
