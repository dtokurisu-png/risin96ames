
(function () {
  const STORAGE_KEY = "r96-layout-dev-values";

  const cssUnit = {
    "--r96-hero-copy-w": "px",
    "--r96-hero-title-size": "",
    "--r96-hero-gap": "px",
    "--r96-hero-side-x": "px",
    "--r96-section-title-gap": "px",
    "--r96-game-card-w": "px",
    "--r96-reviews-gap": "px",
    "--r96-community-gap": "px"
  };

  function readSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function save(values) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }

  function setVar(name, value) {
    const unit = cssUnit[name] || "px";
    document.documentElement.style.setProperty(name, `${value}${unit}`);
  }

  function collectValues() {
    const values = {};
    document.querySelectorAll("[data-layout-var]").forEach((input) => {
      values[input.dataset.layoutVar] = input.value;
    });
    return values;
  }

  function applyValues(values) {
    Object.entries(values).forEach(([name, value]) => setVar(name, value));
    document.querySelectorAll("[data-layout-var]").forEach((input) => {
      if (values[input.dataset.layoutVar] !== undefined) {
        input.value = values[input.dataset.layoutVar];
      }
    });
  }

  function copyCss(values) {
    const lines = [":root {"];
    Object.entries(values).forEach(([name, value]) => {
      const unit = cssUnit[name] || "px";
      lines.push(`  ${name}: ${value}${unit};`);
    });
    lines.push("}");
    return lines.join("\n");
  }

  function initLayoutDevPanel() {
    const panel = document.getElementById("layoutDevPanel");
    const toggle = document.getElementById("layoutDevToggle");
    const close = document.getElementById("layoutDevClose");
    const reset = document.getElementById("layoutDevReset");
    const copy = document.getElementById("layoutDevCopy");
    const msg = document.getElementById("layoutDevMsg");

    if (!panel || !toggle) return;

    const defaults = collectValues();
    const saved = readSaved();
    applyValues({ ...defaults, ...saved });

    toggle.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      const settingsPanel = document.getElementById("settingsPanel");
      if (settingsPanel) settingsPanel.hidden = true;
    });

    if (close) {
      close.addEventListener("click", () => {
        panel.hidden = true;
      });
    }

    document.querySelectorAll("[data-layout-var]").forEach((input) => {
      input.addEventListener("input", () => {
        const values = collectValues();
        applyValues(values);
        save(values);
        if (msg) msg.textContent = "Guardado en este navegador.";
      });
    });

    if (reset) {
      reset.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEY);
        applyValues(defaults);
        if (msg) msg.textContent = "Controles reiniciados.";
      });
    }

    if (copy) {
      copy.addEventListener("click", async () => {
        const values = collectValues();
        const text = copyCss(values);
        try {
          await navigator.clipboard.writeText(text);
          if (msg) msg.textContent = "CSS copiado.";
        } catch (error) {
          if (msg) msg.textContent = text;
        }
      });
    }
  }

  function hardenSettingsMenu() {
    const toggle = document.getElementById("settingsToggle");
    const panel = document.getElementById("settingsPanel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      panel.hidden = !panel.hidden;
    });

    panel.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", (event) => {
      if (!panel.hidden && !event.target.closest(".settings-menu")) {
        panel.hidden = true;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    hardenSettingsMenu();
    initLayoutDevPanel();
  });
})();
