// Entry script: handles language redirect and bootstraps the language toggle.
//
// Loading pattern: ESM module with static imports, matching reading_progress.js.
// Rationale: LanguageToggle.js and LanguageRedirect.js are authored as native
// ES modules exporting named symbols. The repo consumes such components with
// static `import { X } from "..."` inside `<script type="module">`. To stay
// consistent, this entry uses static ESM imports and must be registered in
// mkdocs.yml as a module (Batch 5), e.g.:
//   - path: assets/javascripts/language_toggle.js
//     type: module
import { applyLanguageRedirect } from './components/LanguageRedirect.js';
import { LanguageToggle } from './components/LanguageToggle.js';

function init() {
  // Wrap in try/catch so a failure here never breaks other page scripts.
  try {
    // Redirect first: if it navigates away, the rest of init is moot.
    applyLanguageRedirect({});
    new LanguageToggle({}).mount();
  } catch (error) {
    console.error('LanguageToggle failed to initialize:', error);
  }
}

// The components guard against irrelevant pages internally, so it is safe to
// run once the DOM is ready regardless of the current route.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
