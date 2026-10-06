(() => {
  "use strict";

  const app = document.querySelector(".r96-app");
  const themeButton = document.querySelector("#r96-theme-toggle");
  const menuButton = document.querySelector("#r96-menu");
  const menuPanel = document.querySelector("#r96-menu-panel");

  if (!app) return;

  const THEME_KEY = "r96-visual-theme";

  const applyTheme = (theme) => {
    const next = theme === "light" ? "light" : "dark";
    app.dataset.theme = next;

    if (themeButton) {
      const dark = next === "dark";
      themeButton.textContent = dark ? "☀" : "☾";
      themeButton.setAttribute(
        "aria-label",
        dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      );
      themeButton.title = dark ? "Modo claro" : "Modo oscuro";
    }
  };

  try {
    applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  } catch (_) {
    applyTheme("dark");
  }

  themeButton?.addEventListener("click", () => {
    const next = app.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_) {}
  });

  const setMenu = (open) => {
    if (!menuButton || !menuPanel) return;
    menuPanel.hidden = !open;
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
  };

  menuButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenu(menuPanel?.hidden ?? true);
  });

  menuPanel?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (event) => {
    if (!menuPanel || menuPanel.hidden) return;
    if (menuPanel.contains(event.target) || menuButton?.contains(event.target)) return;
    setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  if (!document.querySelector('script[data-r96-developer-ui]')) {
    const developerScript = document.createElement("script");
    developerScript.src = "./src/developer/r96-developer-ui.js?v=1.0.1";
    developerScript.defer = true;
    developerScript.dataset.r96DeveloperUi = "1";
    document.head.appendChild(developerScript);
  }

})();
