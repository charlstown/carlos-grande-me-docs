// Default localStorage key for the global language preference. Defined at the
// module level so both the instance API (this.storageKey) and the static
// helpers (getStoredPreference, used by LanguageRedirect) resolve to the same
// default key. The constructor option `storageKey` overrides it per instance,
// while the static helper accepts an optional argument that falls back here.
const DEFAULT_STORAGE_KEY = 'preferred-lang';

// The only two locales the site supports. Any other stored value is invalid.
const VALID_LOCALES = ['es', 'en'];

export class LanguageToggle {
  constructor({ toggleSelector = '.md-lang-toggle', storageKey = DEFAULT_STORAGE_KEY } = {}) {
    this.toggleSelector = toggleSelector;
    this.storageKey = storageKey;
    this.button = null;
    this.urls = { en: null, es: null };
    this.current = null;
    this._onClick = null;
  }

  // Maps a navigator/Accept-Language string to a supported locale. Returns
  // 'es' when the language tag starts with a Spanish subtag (es, es-ES,
  // es-MX, es-AR, es-419, ...), otherwise 'en'.
  static normalizeLocale(navLang) {
    if (typeof navLang === 'string' && /^es(\b|-|_|$)/i.test(navLang)) {
      return 'es';
    }
    return 'en';
  }

  // Reads the stored global preference. Returns 'es'/'en' when a valid value
  // is present, or null when absent, invalid, or when localStorage is not
  // available (e.g. privacy mode). The storageKey argument defaults to the
  // module-level key so the static call site matches the instance default.
  static getStoredPreference(storageKey = DEFAULT_STORAGE_KEY) {
    try {
      const value = localStorage.getItem(storageKey);
      return VALID_LOCALES.includes(value) ? value : null;
    } catch {
      return null;
    }
  }

  // Resolves the locale to use following the precedence:
  // stored preference -> normalized navigator language -> 'en'.
  static resolveDefault({ stored, navLang } = {}) {
    if (VALID_LOCALES.includes(stored)) return stored;
    return LanguageToggle.normalizeLocale(navLang);
  }

  mount() {
    this.button = document.querySelector(this.toggleSelector);

    // No toggle on this page (e.g. a post without an alternate translation).
    if (this.button === null) return;

    this.urls = {
      en: this.button.getAttribute('data-lang-en-url'),
      es: this.button.getAttribute('data-lang-es-url'),
    };
    this.current = this.button.getAttribute('data-lang-current');
    this.isHome = this.button.getAttribute('data-is-home') === 'true';

    // The button label always shows the locale the user can switch to (the
    // opposite of the current page locale). this.current is set once from
    // data-lang-current and never mutated here, so _handleClick always computes
    // the target relative to the actual page locale rather than the stored pref.
    this._updateLabel(this.current === 'es' ? 'en' : 'es');

    this._onClick = this._handleClick.bind(this);
    this.button.addEventListener('click', this._onClick);
  }

  // Updates the visible label on the button to show the given target locale.
  _updateLabel(targetLocale) {
    if (!this.button) return;
    let label = this.button.querySelector('.md-lang-toggle__label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'md-lang-toggle__label';
      this.button.appendChild(label);
    }
    label.textContent = targetLocale.toUpperCase();
  }

  _handleClick(event) {
    if (event) event.preventDefault();

    // The target locale is the opposite of the current one.
    const target = this.current === 'es' ? 'en' : 'es';
    const targetUrl = this.urls[target];

    // Persist the choice globally so other pages can honor it.
    try {
      localStorage.setItem(this.storageKey, target);
    } catch {
      // Ignore: storage may still work; navigation proceeds without it.
    }

    if (this.isHome) {
      // On the home page there is no alternate URL to navigate to. Only update
      // the stored preference and flip the button label so the user sees the
      // new toggle target immediately.
      this.current = target;
      this._updateLabel(this.current === 'es' ? 'en' : 'es');
      return;
    }

    // On a post page, navigate to the target URL.
    if (!targetUrl) return;

    // Resolve against the document URL (location.href, not origin) so relative
    // values like "./" map to the actual page they point at.
    let resolved;
    try {
      resolved = new URL(targetUrl, location.href);
    } catch { return; }

    // Validate same origin before navigating, guarding against open-redirect if
    // the attribute value were tampered with.
    if (resolved.origin !== location.origin) return;

    // Self-navigation guard: on i18n fallback pages served under /es/ for posts
    // without a real translation, the target URL can resolve to the current
    // page. Bail instead of reloading the same page.
    if (resolved.pathname === location.pathname) return;

    location.assign(targetUrl);
  }

  destroy() {
    if (this.button && this._onClick) {
      this.button.removeEventListener('click', this._onClick);
    }
    this.button = null;
    this._onClick = null;
  }
}

export default LanguageToggle;
