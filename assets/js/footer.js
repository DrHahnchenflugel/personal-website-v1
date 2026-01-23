(function () {
  const targetId = "site-footer";
  const footerPath = "/partials/footer.html";
  const versionPath = "/assets/meta/version.json";

  const target = document.getElementById(targetId);
  if (!target) {
    console.warn("[footer.js] #site-footer not found");
    return;
  }

  fetch(footerPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load footer (${response.status})`);
      }
      return response.text();
    })
    .then((html) => {
      target.innerHTML = html;

      // inject version AFTER footer HTML exists
      const el = target.querySelector("#site-version");
      if (!el) {
        console.warn("[footer.js] #site-version not found in footer.html");
        return;
      }

      fetch(versionPath, { cache: "no-store" })
        .then((r) => {
          if (!r.ok) throw new Error(`Failed to load version (${r.status})`);
          return r.json();
        })
        .then((v) => {
          const version = (v.version || "").trim();
          const rev = (v.revision || "").trim();

          el.textContent = rev ? `${version} (rev${rev})` : version;
        })
        .catch((err) => console.warn("[footer.js] version", err));

      document.dispatchEvent(new Event("footer:loaded"));
      highlightActiveLink();
    })
    .catch((err) => {
      console.error("[footer.js]", err);
    });

  function highlightActiveLink() {
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";

    const links = target.querySelectorAll("a[href]");
    links.forEach((link) => {
      const linkPath = (link.getAttribute("href") || "").replace(/\/$/, "") || "/";
      if (linkPath === currentPath) link.classList.add("active");
    });
  }
})();
