/*
    Minimal theme toggle for light/dark with text that updates.
    REQUIRES: <a id="themeToggle">...</a>
    USES: <html data-theme="..."> and persists to localStorage.
*/

(function () {
  const STORAGE_KEY = 'theme';                // where we remember the choice
  const root = document.documentElement;      // <html>
  let toggleEl;                               // the link element (found after DOM is ready)

  // Apply a theme: set attribute, persist, update link text/ARIA
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    updateToggleText(theme);
  }

  // Flip light <-> dark
  function toggleTheme() {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = (current === 'light') ? 'dark' : 'light';
    applyTheme(next);
  }

  // Change the link text to match current theme
  function updateToggleText(theme) {
    if (!toggleEl) return;
    const isLight = (theme === 'light');

    // Text:
    toggleEl.textContent = isLight ? 'Turn off the lights' : 'Turn on the lights';
    toggleEl.setAttribute('role', 'button');
    toggleEl.setAttribute('aria-pressed', String(isLight));          // "pressed" = lights on
    toggleEl.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    toggleEl.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
  }

  // Init after DOM is parsed
  document.addEventListener('DOMContentLoaded', () => {
    toggleEl = document.getElementById('themeToggle');

    // Start with saved theme, else whatever <html data-theme> already has, else dark
    const saved = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      }
      catch (_) {
        return null;
      }

    })();

    const initial = saved || root.getAttribute('data-theme') || 'dark';

    applyTheme(initial);

    // Wire the click
    if (toggleEl) {
      toggleEl.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }
  });
})();
