
(function () {
  const STORAGE_KEY = "r96-visual-inspector-v2";
  const DEV_CLASS = "r96-dev-mode";
  const SELECTABLE_CLASS = "r96-dev-selectable";
  const SELECTED_CLASS = "r96-dev-selected";

  let selected = null;
  let drag = null;
  let saved = readSaved();

  const ids = {
    x: "devX",
    y: "devY",
    w: "devW",
    h: "devH",
    font: "devFont",
    line: "devLine",
    letter: "devLetter",
    padding: "devPadding",
    marginTop: "devMarginTop",
    marginBottom: "devMarginBottom",
    gap: "devGap",
    opacity: "devOpacity"
  };

  function $(id) {
    return document.getElementById(id);
  }

  function input(prop) {
    return $(ids[prop]);
  }

  function n(value, fallback = 0) {
    const parsed = parseFloat(String(value || "").replace("px", ""));
    return Number.isFinite(parsed) ? parsed : fallback;
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
    if (el.id) return "#" + CSS.escape(el.id);

    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      let part = node.tagName.toLowerCase();
      const classes = Array.from(node.classList || [])
        .filter((cls) => !cls.startsWith("r96-dev"))
        .slice(0, 3);
      if (classes.length) part += "." + classes.map((cls) => CSS.escape(cls)).join(".");

      const parent = node.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((child) => child.tagName === node.tagName);
        if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      }

      parts.unshift(part);
      node = parent;
    }

    return parts.join(" > ");
  }

  function labelFor(el) {
    if (!el) return "Click sobre cualquier texto, botón o contenedor";
    const text = (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ");
    const name = el.id ? "#" + el.id : "." + Array.from(el.classList || []).filter((c) => !c.startsWith("r96-dev")).slice(0, 2).join(".");
    return `${el.tagName.toLowerCase()} ${name} · ${text ? text.slice(0, 54) : "contenedor"}`;
  }

  function isProtected(el) {
    return !el || el.closest(".site-header") || el.closest(".layout-dev-panel") || el === document.body || el === document.documentElement;
  }

  function isWorthSelecting(el) {
    if (!el || isProtected(el)) return false;
    const tag = el.tagName.toLowerCase();
    const allowedTags = ["section", "div", "article", "form", "h1", "h2", "h3", "p", "a", "button", "input", "select", "textarea", "label", "span"];
    if (!allowedTags.includes(tag)) return false;

    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return false;
    return true;
  }

  function selectableFromEvent(event) {
    const path = event.composedPath ? event.composedPath() : [];
    for (const node of path) {
      if (node && node.nodeType === 1 && isWorthSelecting(node)) return node;
    }

    let el = event.target;
    while (el && !isWorthSelecting(el)) el = el.parentElement;
    return el;
  }

  function ensureEditable(el) {
    const cs = getComputedStyle(el);
    if (cs.position === "static") el.style.position = "relative";
    if (!el.style.left) el.style.left = "0px";
    if (!el.style.top) el.style.top = "0px";
  }

  function getBox(el) {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      x: Math.round(n(el.style.left, 0)),
      y: Math.round(n(el.style.top, 0)),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
      font: Math.round(n(cs.fontSize, 16)),
      line: Number.isFinite(parseFloat(cs.lineHeight)) ? Math.round(parseFloat(cs.lineHeight) * 100) / 100 : 1,
      letter: Math.round(n(cs.letterSpacing, 0) * 100) / 100,
      padding: Math.round(n(cs.paddingTop, 0)),
      marginTop: Math.round(n(cs.marginTop, 0)),
      marginBottom: Math.round(n(cs.marginBottom, 0)),
      gap: Math.round(n(cs.gap, 0)),
      opacity: Math.round(n(cs.opacity, 1) * 100) / 100
    };
  }

  function fillControls(el) {
    const data = getBox(el);
    Object.entries(ids).forEach(([prop, id]) => {
      const field = $(id);
      if (field) field.value = data[prop] ?? "";
    });
    const label = $("layoutDevSelectedName");
    if (label) label.textContent = labelFor(el);
  }

  function readControls() {
    const data = {};
    Object.entries(ids).forEach(([prop, id]) => {
      const field = $(id);
      if (!field) return;
      data[prop] = n(field.value, prop === "opacity" ? 1 : 0);
    });
    return data;
  }

  function applyData(el, data) {
    if (!el || !data) return;
    ensureEditable(el);

    if (data.x !== undefined) el.style.left = `${data.x}px`;
    if (data.y !== undefined) el.style.top = `${data.y}px`;
    if (data.w !== undefined && data.w > 0) el.style.width = `${data.w}px`;
    if (data.h !== undefined && data.h > 0) el.style.height = `${data.h}px`;
    if (data.font !== undefined && data.font > 0) el.style.fontSize = `${data.font}px`;
    if (data.line !== undefined && data.line > 0) el.style.lineHeight = String(data.line);
    if (data.letter !== undefined) el.style.letterSpacing = `${data.letter}px`;
    if (data.padding !== undefined && data.padding >= 0) el.style.padding = `${data.padding}px`;
    if (data.marginTop !== undefined) el.style.marginTop = `${data.marginTop}px`;
    if (data.marginBottom !== undefined) el.style.marginBottom = `${data.marginBottom}px`;
    if (data.gap !== undefined && data.gap >= 0) el.style.gap = `${data.gap}px`;
    if (data.opacity !== undefined) el.style.opacity = String(Math.max(0, Math.min(1, data.opacity)));
  }

  function saveElement(el) {
    if (!el) return;
    saved[pathFor(el)] = readControls();
    writeSaved();
  }

  function applySaved() {
    Object.entries(saved).forEach(([selector, data]) => {
      try {
        const el = document.querySelector(selector);
        if (el) applyData(el, data);
      } catch (error) {}
    });
  }

  function select(el) {
    if (!el || isProtected(el)) return;
    if (selected) selected.classList.remove(SELECTED_CLASS);
    selected = el;
    selected.classList.add(SELECTED_CLASS);
    ensureEditable(selected);
    fillControls(selected);
    const msg = $("layoutDevMsg");
    if (msg) msg.textContent = "Elemento seleccionado. Puedes arrastrar o editar valores.";
  }

  function markSelectable() {
    document.querySelectorAll("main *, footer, footer *").forEach((el) => {
      if (isWorthSelecting(el)) el.classList.add(SELECTABLE_CLASS);
    });
  }

  function unmarkSelectable() {
    document.querySelectorAll("." + SELECTABLE_CLASS).forEach((el) => el.classList.remove(SELECTABLE_CLASS));
    if (selected) selected.classList.remove(SELECTED_CLASS);
    selected = null;
  }

  function openDev() {
    const panel = $("layoutDevPanel");
    if (panel) panel.hidden = false;
    document.body.classList.add(DEV_CLASS);
    markSelectable();
    const msg = $("layoutDevMsg");
    if (msg) msg.textContent = "Click en cualquier elemento. El panel cambia a ese elemento.";
  }

  function closeDev() {
    const panel = $("layoutDevPanel");
    if (panel) panel.hidden = true;
    document.body.classList.remove(DEV_CLASS);
    unmarkSelectable();
  }

  function toggleDev() {
    if (document.body.classList.contains(DEV_CLASS)) closeDev();
    else openDev();
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
      if (!panel.hidden && !event.target.closest(".settings-menu")) panel.hidden = true;
    });

    const dev = $("layoutDevToggle");
    if (dev) {
      dev.addEventListener("click", () => {
        panel.hidden = true;
        toggleDev();
      });
    }
  }

  function bindInspector() {
    document.addEventListener("pointerdown", (event) => {
      if (!document.body.classList.contains(DEV_CLASS)) return;
      if (event.target.closest(".layout-dev-panel") || event.target.closest(".site-header")) return;

      const el = selectableFromEvent(event);
      if (!el) return;

      select(el);

      drag = {
        el,
        startX: event.clientX,
        startY: event.clientY,
        left: n(el.style.left, 0),
        top: n(el.style.top, 0)
      };

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
      event.stopPropagation();
    }, true);

    document.addEventListener("pointerup", (event) => {
      if (!drag) return;
      saveElement(drag.el);
      drag = null;
      const msg = $("layoutDevMsg");
      if (msg) msg.textContent = "Cambio guardado.";
      event.preventDefault();
      event.stopPropagation();
    }, true);

    Object.values(ids).forEach((id) => {
      const field = $(id);
      if (!field) return;
      field.addEventListener("input", () => {
        if (!selected) return;
        applyData(selected, readControls());
        saveElement(selected);
      });
    });

    $("layoutDevApply")?.addEventListener("click", () => {
      if (!selected) return;
      applyData(selected, readControls());
      saveElement(selected);
    });

    $("layoutDevResetOne")?.addEventListener("click", () => {
      if (!selected) return;
      const selector = pathFor(selected);
      delete saved[selector];
      writeSaved();

      ["position", "left", "top", "width", "height", "fontSize", "lineHeight", "letterSpacing", "padding", "marginTop", "marginBottom", "gap", "opacity"].forEach((prop) => {
        selected.style[prop] = "";
      });

      fillControls(selected);
      const msg = $("layoutDevMsg");
      if (msg) msg.textContent = "Elemento reiniciado.";
    });

    $("layoutDevResetAll")?.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      saved = {};
      document.querySelectorAll("." + SELECTABLE_CLASS).forEach((el) => {
        ["position", "left", "top", "width", "height", "fontSize", "lineHeight", "letterSpacing", "padding", "marginTop", "marginBottom", "gap", "opacity"].forEach((prop) => {
          el.style[prop] = "";
        });
      });
      if (selected) fillControls(selected);
      const msg = $("layoutDevMsg");
      if (msg) msg.textContent = "Todo reiniciado.";
    });

    $("layoutDevClose")?.addEventListener("click", closeDev);

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
        if (data.line) lines.push(`  line-height: ${data.line};`);
        if (data.letter !== undefined) lines.push(`  letter-spacing: ${data.letter}px;`);
        if (data.padding !== undefined) lines.push(`  padding: ${data.padding}px;`);
        if (data.marginTop !== undefined) lines.push(`  margin-top: ${data.marginTop}px;`);
        if (data.marginBottom !== undefined) lines.push(`  margin-bottom: ${data.marginBottom}px;`);
        if (data.gap !== undefined) lines.push(`  gap: ${data.gap}px;`);
        if (data.opacity !== undefined) lines.push(`  opacity: ${data.opacity};`);
        lines.push("}");
      });

      try {
        await navigator.clipboard.writeText(lines.join("\n"));
        const msg = $("layoutDevMsg");
        if (msg) msg.textContent = "CSS copiado.";
      } catch (error) {
        const msg = $("layoutDevMsg");
        if (msg) msg.textContent = "El navegador bloqueó copiar. Usa consola/localStorage.";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applySaved();
    bindMenu();
    bindInspector();
  });
})();
