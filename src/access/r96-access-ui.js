(() => {
  "use strict";

  if (window.__r96AccessUi) return;
  window.__r96AccessUi = true;

  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SOURCE_BRIDGE = "r96-access-bridge";
  const SOURCE_UI = "r96-access-ui";
  const PROTOCOL = 1;
  const BUTTON_ID = "r96-invite-developer";
  const DIALOG_ID = "r96-invite-dialog";

  let access = {
    signedIn: false,
    roleKey: "visitor",
    canInviteDeveloper: false,
    isDeveloper: false,
    isWonder: false
  };

  function ensureStyle() {
    if (document.getElementById("r96-access-ui-style")) return;

    const style = document.createElement("style");
    style.id = "r96-access-ui-style";
    style.textContent = `
      #${BUTTON_ID}{
        width:100%;
        padding:11px 12px;
        border:0;
        border-radius:10px;
        background:transparent;
        color:var(--r96-muted);
        font:inherit;
        font-size:.84rem;
        font-weight:800;
        text-align:left;
        cursor:pointer;
        transition:color .18s ease,background .18s ease;
      }
      #${BUTTON_ID}:hover{
        color:var(--r96-text);
        background:var(--r96-panel);
      }
      .r96-access-dialog-backdrop{
        position:fixed;
        inset:0;
        z-index:2147483000;
        display:grid;
        place-items:center;
        padding:24px;
        background:rgba(0,0,0,.58);
      }
      .r96-access-dialog{
        width:min(560px,100%);
        border:1px solid var(--r96-line);
        border-radius:22px;
        background:var(--r96-bg-2);
        color:var(--r96-text);
        box-shadow:var(--r96-shadow);
        padding:22px;
      }
      .r96-access-dialog-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:16px;
      }
      .r96-access-dialog h2{
        margin:0;
        font-size:1.25rem;
      }
      .r96-access-dialog p{
        margin:8px 0 0;
        color:var(--r96-muted);
        line-height:1.5;
        font-size:.9rem;
      }
      .r96-access-dialog-close{
        border:1px solid var(--r96-line);
        border-radius:10px;
        background:var(--r96-panel);
        color:var(--r96-text);
        width:36px;
        height:36px;
        cursor:pointer;
      }
      .r96-access-field{
        margin-top:16px;
      }
      .r96-access-field label{
        display:block;
        margin-bottom:6px;
        color:var(--r96-muted);
        font-size:.76rem;
        font-weight:800;
      }
      .r96-access-copy-row{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:8px;
      }
      .r96-access-copy-row input{
        min-width:0;
        width:100%;
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:var(--r96-panel);
        color:var(--r96-text);
        padding:10px 11px;
      }
      .r96-access-copy{
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:var(--r96-panel-strong);
        color:var(--r96-text);
        padding:0 14px;
        font-weight:800;
        cursor:pointer;
      }
      .r96-access-code{
        letter-spacing:.12em;
        font-weight:900;
      }
      .r96-access-note{
        margin-top:16px;
        padding:12px;
        border:1px solid var(--r96-line);
        border-radius:12px;
        background:var(--r96-panel);
      }
      .r96-access-loading{
        margin-top:18px;
        color:var(--r96-muted);
        font-weight:800;
      }
      .r96-access-error{
        margin-top:16px;
        padding:12px;
        border:1px solid var(--r96-line);
        border-radius:12px;
        background:var(--r96-panel);
      }
      .r96-access-copy-status{
        min-height:20px;
        margin-top:8px;
        color:var(--r96-accent);
        font-size:.78rem;
        font-weight:800;
      }
      @media(max-width:560px){
        .r96-access-copy-row{grid-template-columns:1fr}
        .r96-access-copy{min-height:40px}
      }
    `;
    document.head.appendChild(style);
  }

  function closeMenu() {
    const panel = document.querySelector("#r96-menu-panel");
    const menu = document.querySelector("#r96-menu");
    if (panel) panel.hidden = true;
    menu?.setAttribute("aria-expanded", "false");
  }

  function removeDialog() {
    document.getElementById(DIALOG_ID)?.remove();
  }

  function dialogShell() {
    ensureStyle();
    removeDialog();

    const backdrop = document.createElement("div");
    backdrop.id = DIALOG_ID;
    backdrop.className = "r96-access-dialog-backdrop";

    const dialog = document.createElement("section");
    dialog.className = "r96-access-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "r96-access-dialog-title");

    const head = document.createElement("div");
    head.className = "r96-access-dialog-head";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.id = "r96-access-dialog-title";
    title.textContent = "Invitación de desarrollador";
    titleWrap.appendChild(title);

    const close = document.createElement("button");
    close.className = "r96-access-dialog-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Cerrar");
    close.addEventListener("click", removeDialog);

    head.append(titleWrap, close);
    dialog.appendChild(head);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) removeDialog();
    });

    return dialog;
  }

  function showLoading() {
    const dialog = dialogShell();

    const copy = document.createElement("p");
    copy.textContent = "Rising está verificando tu rol Wonder y creando una invitación de un solo uso.";

    const loading = document.createElement("div");
    loading.className = "r96-access-loading";
    loading.textContent = "Generando invitación…";

    dialog.append(copy, loading);
  }

  function addCopyField(dialog, labelText, value, className = "") {
    const field = document.createElement("div");
    field.className = "r96-access-field";

    const label = document.createElement("label");
    label.textContent = labelText;

    const row = document.createElement("div");
    row.className = "r96-access-copy-row";

    const input = document.createElement("input");
    input.readOnly = true;
    input.value = value;
    if (className) input.classList.add(className);

    const button = document.createElement("button");
    button.className = "r96-access-copy";
    button.type = "button";
    button.textContent = "Copiar";

    button.addEventListener("click", async () => {
      let copied = false;
      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch (_) {
        try {
          input.focus();
          input.select();
          copied = document.execCommand("copy");
        } catch (_) {}
      }

      const status = dialog.querySelector(".r96-access-copy-status");
      if (status) {
        status.textContent = copied ? "Copiado." : "No se pudo copiar automáticamente.";
      }
    });

    row.append(input, button);
    field.append(label, row);
    dialog.appendChild(field);
  }

  function showInvitation(data) {
    const dialog = dialogShell();

    const intro = document.createElement("p");
    intro.textContent = "La invitación ya fue creada. El enlace y el código deben llegar al desarrollador que vas a invitar.";

    addCopyField(dialog, "Enlace de invitación", String(data.inviteUrl || ""));
    addCopyField(dialog, "Código de un solo uso", String(data.code || ""), "r96-access-code");

    const expires = document.createElement("div");
    expires.className = "r96-access-note";

    let expiryText = String(data.expiresAt || "");
    try {
      expiryText = new Date(data.expiresAt).toLocaleString("es-ES");
    } catch (_) {}

    expires.textContent = "Válida hasta " + expiryText + ". El código podrá utilizarse una sola vez.";

    const security = document.createElement("p");
    security.textContent = "Por seguridad, Rising no guarda el token ni el código en texto legible. Si cierras esta ventana, tendrás que generar una nueva invitación si pierdes estos datos.";

    const status = document.createElement("div");
    status.className = "r96-access-copy-status";
    status.setAttribute("aria-live", "polite");

    dialog.append(expires, security, status);
  }

  function showError(code) {
    const dialog = dialogShell();
    const error = document.createElement("div");
    error.className = "r96-access-error";

    const messages = {
      AUTH_REQUIRED: "La sesión Nexo no está disponible.",
      WONDER_REQUIRED: "Esta cuenta ya no tiene permiso Wonder para crear invitaciones.",
      INVALID_REQUEST_ID: "La solicitud de invitación no fue válida.",
      REQUEST_ALREADY_USED: "Esta solicitud ya fue procesada.",
      INVITE_CREATE_FAILED: "No se pudo crear la invitación."
    };

    error.textContent = messages[code] || messages.INVITE_CREATE_FAILED;
    dialog.appendChild(error);
  }

  function newRequestId() {
    if (crypto?.randomUUID) return crypto.randomUUID();

    const bytes = new Uint8Array(18);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  }

  function post(type, payload = {}) {
    if (window.parent === window) return;

    window.parent.postMessage({
      source: SOURCE_UI,
      protocol: PROTOCOL,
      type,
      ...payload
    }, HOST_ORIGIN);
  }

  function requestInvitation() {
    if (access.isWonder !== true || access.canInviteDeveloper !== true) return;

    closeMenu();
    showLoading();
    post("create-invite", {
      requestId: newRequestId()
    });
  }

  function render() {
    const panel = document.querySelector("#r96-menu-panel");
    if (!panel) return;

    let button = document.getElementById(BUTTON_ID);

    if (access.isWonder !== true) {
      button?.remove();
      return;
    }

    ensureStyle();

    if (button) return;

    button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "Invitar desarrollador";
    button.setAttribute("aria-label", "Invitar desarrollador");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      requestInvitation();
    });

    panel.appendChild(button);
  }

  function postReady() {
    post("ready");
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== HOST_ORIGIN || event.source !== window.parent) return;

    const message = event.data;
    if (!message || message.source !== SOURCE_BRIDGE || message.protocol !== PROTOCOL) return;

    if (message.type === "access") {
      const data = message.data || {};
      access = {
        signedIn: data.signedIn === true,
        roleKey: String(data.roleKey || "visitor"),
        canInviteDeveloper: data.canInviteDeveloper === true,
        isDeveloper: data.isDeveloper === true,
        isWonder: data.isWonder === true
      };
      render();
      return;
    }

    if (message.type === "invite-result") {
      const data = message.data || {};
      if (data.ok === true) {
        showInvitation(data);
      } else {
        showError(String(data.error || "INVITE_CREATE_FAILED"));
      }
    }
  });

  render();
  postReady();

  let attempts = 0;
  const retry = setInterval(() => {
    attempts += 1;
    postReady();
    if (attempts >= 8) clearInterval(retry);
  }, 1000);
})();
