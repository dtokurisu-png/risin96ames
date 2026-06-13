function initSettingsMenu() {
  const toggle = document.getElementById("settingsToggle");
  const panel = document.getElementById("settingsPanel");

  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
  });

  document.addEventListener("click", (event) => {
    if (!panel.hidden && !event.target.closest(".settings-menu")) {
      panel.hidden = true;
    }
  });
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
