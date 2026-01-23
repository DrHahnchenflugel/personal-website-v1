(function () {
  const targetId = "site-footer";
  const headerPath = "/partials/footer.html";
  const versionPath = "/assets/meta/version.json";

  // Load and display site footer + version info
  const target = document.getElementById(targetId);
  if (!target) {
    console.warn("[footer.js] #site-footer not found");
    return;
  }

  fetch(headerPath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load footer (${response.status})');
      }
      return response.text();
    })
    .then(html => {
      target.innerHTML = html;

      fetch(versionPath, { cache: "no-store" })
        .then(r => r.ok ? r.json() : null)
          .then(v => {
            if (!v) return;
            const el = target.querySelector("#site-version");
            if (!el) return;

            el.textContent = v.revision
              ? `${v.version} (rev${v.revision})`
              : v.version;
      })
      .catch(() => {});

      document.dispatchEvent(new Event('footer:loaded'));
      highlightActiveLink();
    })
    .catch(err => {
      console.error("[footer.js]", err);
    });

  function highlightActiveLink() {
    const currentPath = window.location.pathname
      .replace(/\/$/, "") || "/";

    const links = target.querySelectorAll("a[href]");
    links.forEach(link => {
      const linkPath = link.getAttribute("href")
        .replace(/\/$/, "") || "/";

      if (linkPath === currentPath) {
        link.classList.add("active");
      }
    });
  }
})();
