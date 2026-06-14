// Default-language redirect applied at page load to honor the visitor's
// preferred locale without flicker. It reuses LanguageToggle's static helpers
// for locale normalization, stored-preference reading, and default resolution
// so the precedence (stored -> navigator.language es* -> en) stays in one place.
import { LanguageToggle } from './LanguageToggle.js';

// Detects automated agents (headless drivers and search engine bots) that must
// always see the canonical default-language URL. Returning true skips redirect.
function isCrawler() {
  if (typeof navigator !== 'undefined' && navigator.webdriver === true) {
    return true;
  }
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
  return /(bot|crawl|spider)/i.test(ua);
}

// Redirects to the Spanish URL when the visitor's resolved preference is 'es'
// while the page is being served in its English default. Acts only on pages
// that expose a language toggle (i.e. pages that have both translations).
export function applyLanguageRedirect({
  toggleSelector = '.md-lang-toggle',
  storageKey = 'preferred-lang',
} = {}) {
  // Never redirect crawlers/headless agents: keep the canonical default URL.
  if (isCrawler()) return;

  const button = document.querySelector(toggleSelector);

  // No toggle on this page -> only one language exists, nothing to redirect.
  if (button === null) return;

  // The home page never redirects: the toggle there only stores a preference.
  if (button.getAttribute('data-is-home') === 'true') return;

  const current = button.getAttribute('data-lang-current');

  // We only redirect away from the English default; any other state (already
  // 'es', or missing/unexpected value) is left untouched.
  if (current !== 'en') return;

  const esUrl = button.getAttribute('data-lang-es-url');
  if (!esUrl) return;

  // Resolve desired locale with the shared precedence helpers.
  const stored = LanguageToggle.getStoredPreference(storageKey);
  const navLang = typeof navigator !== 'undefined' ? navigator.language : undefined;
  const desired = LanguageToggle.resolveDefault({ stored, navLang });

  if (desired !== 'es') return;

  // Validate that the target URL belongs to the same origin before navigating,
  // guarding against open-redirect if the attribute value were tampered with.
  try {
    const parsed = new URL(esUrl, location.origin);
    if (parsed.origin !== location.origin) return;
  } catch { return; }

  // Use replace (not assign) so the default-language URL does not pollute the
  // browser history and the back button still works as expected.
  location.replace(esUrl);
}

export default applyLanguageRedirect;
