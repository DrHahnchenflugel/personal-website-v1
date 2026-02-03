/*
  Minimal theme toggle for light/dark with text that updates.
  Works even when the toggle is injected later (e.g., via header.js).
  REQUIRES: <a id="themeToggle">...</a> somewhere in the DOM eventually.
  USES: <html data-theme="..."> and persists to localStorage.
*/

(function () {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement; // <html>
  let toggleEl = null;

  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function getCurrentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function updateToggleText(theme) {
    if (!toggleEl) return;

    const isLight = (theme === 'light');
    toggleEl.textContent = isLight ? 'Turn off the lights' : 'Turn on the lights';
    toggleEl.setAttribute('role', 'button');
    toggleEl.setAttribute('aria-pressed', String(isLight));
    toggleEl.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    toggleEl.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    updateToggleText(theme);
  }

  function toggleTheme() {
    const next = (getCurrentTheme() === 'dark') ? 'light' : 'dark';
    applyTheme(next);
  }

  // Bind once the element exists (supports late-injected headers)
  function bindToggleIfPresent() {
    const el = document.getElementById('themeToggle');
    if (!el) return false;

    // Avoid double-binding if this runs multiple times
    if (el.dataset.themeBound === '1') {
      toggleEl = el;
      updateToggleText(getCurrentTheme());
      return true;
    }

    toggleEl = el;
    el.dataset.themeBound = '1';

    // Ensure the text reflects current theme right away
    updateToggleText(getCurrentTheme());

    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });

    return true;
  }

  // Init theme ASAP after DOM is parsed (even if toggle doesn't exist yet)
  document.addEventListener('DOMContentLoaded', () => {
    const initial = getSavedTheme() || getCurrentTheme() || 'dark';
    applyTheme(initial);

    // Try now (in case toggle is already in DOM)
    bindToggleIfPresent();

    // Fallback: observe for injected header content if no event is dispatched
    const headerHost = document.getElementById('site-header');
    if (headerHost) {
      const obs = new MutationObserver(() => {
        if (bindToggleIfPresent()) obs.disconnect();
      });
      obs.observe(headerHost, { childList: true, subtree: true });
    }
  });

  // Preferred: header.js dispatches this after injecting the header HTML
  document.addEventListener('header:loaded', () => {
    bindToggleIfPresent();
  });
})();
