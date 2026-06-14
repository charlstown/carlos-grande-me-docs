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

    // Adjust the button's visual state to the cached preference so that even
    // before the first click the label reflects what language you will switch to.
    const stored = LanguageToggle.getStoredPreference(this.storageKey);
    const preferred = LanguageToggle.resolveDefault({
      stored,
      navLang: (typeof navigator !== 'undefined' && navigator.language) || undefined,
    });
    if (preferred !== this.current) {
      // The user's preference differs from the page locale: show the page locale
      // as the switch target (i.e. they are "on" the wrong language for them, so
      // the button label should invite them to switch to their preference — but
      // since the button always shows where you CAN go, we just keep current as-is
      // and let the redirect handle auto-navigation on posts).
      this.current = preferred;
    }
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
