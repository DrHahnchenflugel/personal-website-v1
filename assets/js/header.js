(function () {
  const targetId = "site-header";
  const headerPath = "/partials/header.html";

  const target = document.getElementById(targetId);
  if (!target) {
    console.warn("[header.js] #site-header not found");
    return;
  }

  fetch(headerPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load header (${response.status})`);
      }
      return response.text();
    })
    .then(html => {
      target.innerHTML = html;
      document.dispatchEvent(new Event('header:loaded'));
      highlightActiveLink();
    })
    .catch(err => {
      console.error("[header.js]", err);
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
