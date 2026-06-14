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
 * Mirrors the exact shape described in the feature spec.
 */
function mountToggleButton({
  current = 'en',
  esUrl = '/es/resources/post/',
  isHome = 'false',
} = {}) {
  const btn = document.createElement('button');
  btn.className = 'md-lang-toggle';
  btn.dataset.langCurrent = current;
  btn.dataset.langEsUrl = esUrl;
  btn.dataset.isHome = isHome;
  document.body.appendChild(btn);
  return btn;
}

let locationMock;

beforeEach(() => {
  document.body.innerHTML = '';
  mockLocalStorage();
  locationMock = mockLocationReplace();
  // Default to a normal, non-bot browser environment with a neutral language.
  setNavigator('webdriver', false);
  setNavigator('userAgent', 'Mozilla/5.0 (Test; rv:1.0) Gecko/20100101 Firefox/1.0');
  setNavigator('language', 'en-US');
});

afterEach(() => {
  document.body.innerHTML = '';
  locationMock.restore();
  while (navRestores.length) navRestores.pop()();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Export contract
// ---------------------------------------------------------------------------

describe('LanguageRedirect exports', () => {
  it('exposes the same function as default and named export', () => {
    expect(applyLanguageRedirect).toBe(namedApplyLanguageRedirect);
  });
});

// ---------------------------------------------------------------------------
// 1. No redirect when data-is-home="true"
// ---------------------------------------------------------------------------

describe('applyLanguageRedirect — home page guard', () => {
  it('does not redirect on the home page even when stored preference is es', () => {
    // Arrange: home page button (data-is-home="true") with es preference stored.
    mountToggleButton({ current: 'en', esUrl: '/es/resources/post/', isHome: 'true' });
    localStorage.setItem('preferred-lang', 'es');

    // Act
    applyLanguageRedirect();

    // Assert: home page must never redirect regardless of preference.
    expect(locationMock.replace).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 2. No redirect when the toggle button is absent
// ---------------------------------------------------------------------------

describe('applyLanguageRedirect — no toggle button', () => {
  it('does not redirect when the toggle button is absent', () => {
    // Arrange: no button in the DOM; simulate es preference to ensure guard fires.
    setNavigator('language', 'es-ES');
    localStorage.setItem('preferred-lang', 'es');

    // Act
    applyLanguageRedirect();

    // Assert
    expect(locationMock.replace).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 3 & 4. No redirect when desired language is 'en'
// ---------------------------------------------------------------------------

describe('applyLanguageRedirect — desired language is en', () => {
  it('does not redirect when stored preference is en', () => {
    // Arrange: stored='en', navigator also 'en-US' (set in beforeEach).
    mountToggleButton({ current: 'en', esUrl: '/es/resources/post/' });
    localStorage.setItem('preferred-lang', 'en');

    // Act
    applyLanguageRedirect();

    // Assert
    expect(locationMock.replace).not.toHaveBeenCalled();
  });

  it('does not redirect when navigator language resolves to en and nothing is stored', () => {
    // Arrange: navigator='fr-FR' (not es-*), no stored preference -> resolves to 'en'.
    mountToggleButton({ current: 'en', esUrl: '/es/resources/post/' });
    setNavigator('language', 'fr-FR');

    // Act
    applyLanguageRedirect();

    // Assert
    expect(locationMock.replace).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 5. Redirect cases
// ---------------------------------------------------------------------------

describe('applyLanguageRedirect — redirect cases', () => {
  it('redirects to data-lang-es-url when stored is es and current page is en', () => {
    // Arrange: post page, stored='es', current='en'.
    mountToggleButton({ current: 'en', esUrl: '/es/resources/post/' });
    localStorage.setItem('preferred-lang', 'es');

    // Act
    applyLanguageRedirect();

    // Assert: must navigate to the Spanish URL.
    expect(locationMock.replace).toHaveBeenCalledTimes(1);
    expect(locationMock.replace).toHaveBeenCalledWith('/es/resources/post/');
  });

  it('redirects when there is no stored preference but navigator.language is es-ES', () => {
    // Arrange: no stored preference; browser language is Spanish.
    mountToggleButton({ current: 'en', esUrl: '/es/resources/post/' });
    setNavigator('language', 'es-ES');

    // Act
    applyLanguageRedirect();

    // Assert
    expect(locationMock.replace).toHaveBeenCalledWith('/es/resources/post/');
  });

  it('does not redirect when current page is already es', () => {
    // Arrange: the page is already in Spanish — nothing to do.
    mountToggleButton({ current: 'es', esUrl: '/es/resources/post/' });
    setNavigator('language', 'es-ES');
    localStorage.setItem('preferred-lang', 'es');

    // Act
    applyLanguageRedirect();

    // Assert
    expect(locationMock.replace).not.toHaveBeenCalled();
  });

  it('does not redirect when data-lang-es-url is missing', () => {
    // Arrange: toggle present but no Spanish URL available.
    const btn = document.createElement('button');
    btn.className = 'md-lang-toggle';
    btn.dataset.langCurrent = 'en';
    btn.dataset.isHome = 'false';
    // Intentionally omit data-lang-es-url.
    document.body.appendChild(btn);
    setNavigator('language', 'es-ES');
    localStorage.setItem('preferred-lang', 'es');

    // Act
    applyLanguageRedirect();

    // Assert
    expect(locationMock.replace).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 6. Stored preference wins over navigator language
// ---------------------------------------------------------------------------

describe('applyLanguageRedirect — precedence', () => {
  it('stored en wins over navigator es-ES (no redirect)', () => {
    // Arrange: navigator says es-ES but stored says 'en' — stored must win.
    mountToggleButton({ current: 'en', esUrl: '/es/resources/post/' });
    setNavigator('language', 'es-ES');
    localStorage.setItem('preferred-lang', 'en');

    // Act
    applyLanguageRedirect();

    // Assert: no redirect because the explicit stored preference is 'en'.
    expect(locationMock.replace).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 7 & 8. Crawler guards
// ---------------------------------------------------------------------------

describe('applyLanguageRedirect — crawler guard', () => {
  it('does not redirect when navigator.webdriver is true', () => {
    // Arrange: headless browser detected via navigator.webdriver.
    mountToggleButton({ current: 'en', esUrl: '/es/resources/post/' });
    setNavigator('language', 'es-ES');
    setNavigator('webdriver', true);
    localStorage.setItem('preferred-lang', 'es');

    // Act
    applyLanguageRedirect();

    // Assert: automated agents must never be redirected.
    expect(locationMock.replace).not.toHaveBeenCalled();
  });

  it('does not redirect when the user-agent looks like a bot', () => {
    // Arrange: user-agent string identifies the client as Googlebot.
    mountToggleButton({ current: 'en', esUrl: '/es/resources/post/' });
    setNavigator('language', 'es-ES');
    setNavigator('userAgent', 'Googlebot/2.1');
    localStorage.setItem('preferred-lang', 'es');

    // Act
    applyLanguageRedirect();

    // Assert: bot user-agents must never be redirected.
    expect(locationMock.replace).not.toHaveBeenCalled();
  });
});
