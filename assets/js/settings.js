function initSettingsMenu() {
  /* Menú controlado por js/layout-dev.js para evitar doble toggle. */
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.dataset.theme = theme;

  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");

  if (icon) icon.textContent = isLight ? "☾" : "☀";
  if (label) label.textContent = isLight ? "Tema oscuro" : "Tema claro";
}

function initThemeToggle() {
  const savedTheme = localStorage.getItem("risin96ames-theme") || "dark";
  applyTheme(savedTheme);

  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("risin96ames-theme", next);
    applyTheme(next);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSettingsMenu();
  initThemeToggle();
});
