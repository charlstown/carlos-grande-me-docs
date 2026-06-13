// Entry script: bootstraps the reading progress bar on post pages.
//
// Loading pattern: ESM module with a static import.
// Rationale: ReadingProgress.js (like Gallery.js, FilterMenu.js and
// LazyLoader.js) is authored as a native ES module exporting a named class.
// The repo already consumes those components with static `import { X } from
// "..."` inside `<script type="module">` (see overrides/home.html). To stay
// consistent, this entry uses a static ESM import and must be registered in
// mkdocs.yml as a module (Batch 5), e.g.:
//   - path: assets/javascripts/reading_progress.js
//     type: module
import { ReadingProgress } from './components/ReadingProgress.js';

function init() {
  // Wrap in try/catch so a failure here never breaks other page scripts.
  try {
    const progress = new ReadingProgress({});
    progress.mount();
  } catch (error) {
    console.error('ReadingProgress failed to initialize:', error);
  }
}

// The class guards against non-post pages internally, so it is safe to run
// once the DOM is ready regardless of the current route.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
