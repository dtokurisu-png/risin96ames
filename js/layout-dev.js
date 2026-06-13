
(function () {
  const STORAGE_KEY = "r96-visual-editor-styles";
  const DEV_CLASS = "r96-dev-mode";
  const SELECTABLE_CLASS = "r96-dev-selectable";
  const SELECTED_CLASS = "r96-dev-selected";

  let selected = null;
  let drag = null;
  let saved = readSaved();

  function $(id) {
    return document.getElementById(id);
  }

  function readSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeSaved() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  function pathFor(el) {
    if (!el) return "";
    if (el.id) return "#" + el.id;

    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      let part = node.tagName.toLowerCase();
      const classList = Array.from(node.classList || [])
        .filter((cls) => !cls.startsWith("r96-dev"))
        .slice(0, 2);
      if (classList.length) part += "." + classList.join(".");

      const parent = node.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((child) => child.tagName === node.tagName);
        if (siblings.length > 1) {
          part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
        }
      }

      parts.unshift(part);
      node = parent;
    }

    return parts.join(" > ");
  }

  function cleanName(el) {
    if (!el) return "Selecciona un elemento";
    const text = (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ");
    const label = text ? text.slice(0, 44) : pathFor(el);
    return `${el.tagName.toLowerCase()} · ${label}`;
  }

  function getNumber(value, fallback = 0) {
    const n = parseFloat(String(value || "").replace("px", ""));
    return Number.isFinite(n) ? n : fallback;
  }

  function ensureEditableBase(el) {
    const cs = getComputedStyle(el);
    if (cs.position === "static") {
      el.style.position = "relative";
    }
    if (!el.style.left) el.style.left = "0px";
    if (!el.style.top) el.style.top = "0px";
  }

  function applyStyle(el, data) {
    if (!el || !data) return;
    ensureEditableBase(el);

    if (data.x !== undefined) el.style.left = `${data.x}px`;
    if (data.y !== undefined) el.style.top = `${data.y}px`;
    if (data.w !== undefined && data.w > 0) el.style.width = `${data.w}px`;
    if (data.h !== undefined && data.h > 0) el.style.height = `${data.h}px`;
    if (data.font !== undefined && data.font > 0) el.style.fontSize = `${data.font}px`;
  }

  function saveElement(el) {
    if (!el) return;
    const key = pathFor(el);
    const data = readControls();
    saved[key] = data;
    writeSaved();
  }

  function applySaved() {
    Object.entries(saved).forEach(([selector, data]) => {
      try {
        const el = document.querySelector(selector);
        if (el) applyStyle(el, data);
      } catch (error) {}
    });
  }

  function readControls() {
    return {
      x: getNumber($("devX")?.value, 0),
      y: getNumber($("devY")?.value, 0),
      w: getNumber($("devW")?.value, 0),
      h: getNumber($("devH")?.value, 0),
      font: getNumber($("devFont")?.value, 0)
    };
  }

  function fillControls(el) {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    $("devX").value = Math.round(getNumber(el.style.left, 0));
    $("devY").value = Math.round(getNumber(el.style.top, 0));
    $("devW").value = Math.round(rect.width);
    $("devH").value = Math.round(rect.height);
    $("devFont").value = Math.round(getNumber(cs.fontSize, 16));
    $("layoutDevSelectedName").textContent = cleanName(el);
  }

  function selectElement(el) {
    if (!el || el.closest(".layout-dev-panel") || el.closest(".site-header")) return;

    if (selected) selected.classList.remove(SELECTED_CLASS);
    selected = el;
    selected.classList.add(SELECTED_CLASS);
    ensureEditableBase(selected);
    fillControls(selected);
  }

  function activateSelectables() {
    const candidates = document.querySelectorAll(
      "main section, main div, main article, main form, main h1, main h2, main h3, main p, main a, main button, main input, main select, main textarea, footer, footer p"
    );

    candidates.forEach((el) => {
      if (!el.closest(".layout-dev-panel")) el.classList.add(SELECTABLE_CLASS);
    });
  }

  function deactivateSelectables() {
    document.querySelectorAll("." + SELECTABLE_CLASS).forEach((el) => el.classList.remove(SELECTABLE_CLASS));
    if (selected) selected.classList.remove(SELECTED_CLASS);
    selected = null;
  }

  function openPanel() {
    const panel = $("layoutDevPanel");
    if (panel) panel.hidden = false;
    document.body.classList.add(DEV_CLASS);
    activateSelectables();
    $("layoutDevMsg").textContent = "Click en un texto, botón o contenedor. Arrastra para moverlo.";
  }

  function closePanel() {
    const panel = $("layoutDevPanel");
    if (panel) panel.hidden = true;
    document.body.classList.remove(DEV_CLASS);
    deactivateSelectables();
  }

  function togglePanel() {
    if (document.body.classList.contains(DEV_CLASS)) closePanel();
    else openPanel();
  }

  function bindMenu() {
    const toggle = $("settingsToggle");
    const panel = $("settingsPanel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      panel.hidden = !panel.hidden;
    });

    panel.addEventListener("click", (event) => event.stopPropagation());

    document.addEventListener("click", (event) => {
      if (!panel.hidden && !event.target.closest(".settings-menu")) {
        panel.hidden = true;
      }
    });

    const devToggle = $("layoutDevToggle");
    if (devToggle) {
      devToggle.addEventListener("click", () => {
        panel.hidden = true;
        togglePanel();
      });
    }
  }

  function bindEditor() {
    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains(DEV_CLASS)) return;
      if (event.target.closest(".layout-dev-panel") || event.target.closest(".site-header")) return;

      event.preventDefault();
      event.stopPropagation();
      selectElement(event.target);
    }, true);

    document.addEventListener("pointerdown", (event) => {
      if (!document.body.classList.contains(DEV_CLASS)) return;
      if (!selected || event.target !== selected) return;
      if (event.target.closest(".layout-dev-panel") || event.target.closest(".site-header")) return;

      ensureEditableBase(selected);
      drag = {
        el: selected,
        startX: event.clientX,
        startY: event.clientY,
        left: getNumber(selected.style.left, 0),
        top: getNumber(selected.style.top, 0)
      };
      selected.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    }, true);

    document.addEventListener("pointermove", (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      drag.el.style.left = `${Math.round(drag.left + dx)}px`;
      drag.el.style.top = `${Math.round(drag.top + dy)}px`;
      fillControls(drag.el);
      event.preventDefault();
    }, true);

    document.addEventListener("pointerup", () => {
      if (drag) {
        saveElement(drag.el);
        drag = null;
        $("layoutDevMsg").textContent = "Posición guardada.";
      }
    }, true);

    ["devX", "devY", "devW", "devH", "devFont"].forEach((id) => {
      const input = $(id);
      if (!input) return;
      input.addEventListener("input", () => {
        if (!selected) return;
        applyStyle(selected, readControls());
        saveElement(selected);
      });
    });

    $("layoutDevApply")?.addEventListener("click", () => {
      if (!selected) return;
      applyStyle(selected, readControls());
      saveElement(selected);
      $("layoutDevMsg").textContent = "Aplicado.";
    });

    $("layoutDevResetOne")?.addEventListener("click", () => {
      if (!selected) return;
      const key = pathFor(selected);
      delete saved[key];
      writeSaved();
      selected.style.left = "";
      selected.style.top = "";
      selected.style.width = "";
      selected.style.height = "";
      selected.style.fontSize = "";
      selected.style.position = "";
      fillControls(selected);
      $("layoutDevMsg").textContent = "Elemento reiniciado.";
    });

    $("layoutDevResetAll")?.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      saved = {};
      document.querySelectorAll("." + SELECTABLE_CLASS).forEach((el) => {
        el.style.left = "";
        el.style.top = "";
        el.style.width = "";
        el.style.height = "";
        el.style.fontSize = "";
        el.style.position = "";
      });
      if (selected) fillControls(selected);
      $("layoutDevMsg").textContent = "Todo reiniciado.";
    });

    $("layoutDevClose")?.addEventListener("click", closePanel);

    $("layoutDevCopy")?.addEventListener("click", async () => {
      const lines = ["/* R96 · CSS generado por Vista de desarrollador */"];
      Object.entries(saved).forEach(([selector, data]) => {
        lines.push(`${selector} {`);
        lines.push("  position: relative;");
        if (data.x !== undefined) lines.push(`  left: ${data.x}px;`);
        if (data.y !== undefined) lines.push(`  top: ${data.y}px;`);
        if (data.w) lines.push(`  width: ${data.w}px;`);
        if (data.h) lines.push(`  height: ${data.h}px;`);
        if (data.font) lines.push(`  font-size: ${data.font}px;`);
        lines.push("}");
      });
      const text = lines.join("\n");
      try {
        await navigator.clipboard.writeText(text);
        $("layoutDevMsg").textContent = "CSS copiado.";
      } catch (error) {
        $("layoutDevMsg").textContent = "No pude copiar. Revisa permisos del navegador.";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applySaved();
    bindMenu();
    bindEditor();
  });
})();
