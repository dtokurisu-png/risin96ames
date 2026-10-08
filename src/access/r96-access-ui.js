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

  function uiLanguage() {
    const lang = String(document.documentElement.lang || "es")
      .trim()
      .toLowerCase();
    return lang.startsWith("en") ? "en" : "es";
  }

  function roleAccountCopy(roleKey) {
    const lang = uiLanguage();

    if (lang === "en") {
      if (roleKey === "wonder") return "Nexo Group account — Wonder";
      if (roleKey === "developer") return "Nexo Group account — Developer";
      if (roleKey === "member") return "Nexo Group account — Guest";
      return "";
    }

    if (roleKey === "wonder") return "Cuenta Nexo Group — Wonder";
    if (roleKey === "developer") return "Cuenta Nexo Group — Desarrollador";
    if (roleKey === "member") return "Cuenta Nexo Group — Invitado";
    return "";
  }

  function syncAccountRoleLabel() {
    const account = document.querySelector(".r96-account-visual");
    const subtitle = account?.querySelector(".r96-account-copy small");

    if (!account || !subtitle) return;
    if (account.dataset.r96AuthState !== "signedIn") return;
    if (access.signedIn !== true) return;

    const roleKey = String(access.roleKey || "member").toLowerCase();
    const label = roleAccountCopy(roleKey);
    if (!label) return;

    account.dataset.r96AccessRole = roleKey;

    if (subtitle.textContent !== label) {
      subtitle.textContent = label;
    }
  }

  function installAccountRoleObserver() {
    const account = document.querySelector(".r96-account-visual");
    if (!account || account.dataset.r96RoleObserver === "1") return;

    account.dataset.r96RoleObserver = "1";

    const observer = new MutationObserver(() => {
      syncAccountRoleLabel();
    });

    observer.observe(account, {
      attributes: true,
      attributeFilter: ["data-r96-auth-state"],
      childList: true,
      subtree: true,
      characterData: true
    });

    const langObserver = new MutationObserver(() => {
      syncAccountRoleLabel();
    });

    langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });
  }

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
      .r96-access-invitation{
        width:100%;
        min-height:190px;
        margin-top:16px;
        resize:vertical;
        border:1px solid var(--r96-line);
        border-radius:14px;
        background:var(--r96-panel);
        color:var(--r96-text);
        padding:14px;
        font:inherit;
        font-size:.9rem;
        line-height:1.55;
        box-sizing:border-box;
      }
      .r96-access-copy{
        width:100%;
        min-height:44px;
        margin-top:10px;
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:var(--r96-panel-strong);
        color:var(--r96-text);
        padding:10px 14px;
        font:inherit;
        font-weight:800;
        cursor:pointer;
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
        .r96-access-dialog{padding:18px}
        .r96-access-invitation{min-height:210px}
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

    const loading = document.createElement("div");
    loading.className = "r96-access-loading";
    loading.textContent = "Generando invitación…";

    dialog.appendChild(loading);
  }

  function showInvitation(data) {
    const dialog = dialogShell();

    const inviteUrl = String(data.inviteUrl || "").trim();
    const code = String(data.code || "").trim();

    const invitationText = [
      inviteUrl,
      "",
      "Hola, únete a Rising Games como desarrollador utilizando este código:",
      "",
      code
    ].join("\n");

    const intro = document.createElement("p");
    intro.textContent = "Invitación lista para compartir.";

    const text = document.createElement("textarea");
    text.className = "r96-access-invitation";
    text.readOnly = true;
    text.value = invitationText;
    text.setAttribute("aria-label", "Invitación completa para desarrollador");

    const copy = document.createElement("button");
    copy.className = "r96-access-copy";
    copy.type = "button";
    copy.textContent = "Copiar invitación";

    const status = document.createElement("div");
    status.className = "r96-access-copy-status";
    status.setAttribute("aria-live", "polite");

    copy.addEventListener("click", async () => {
      let copied = false;

      try {
        await navigator.clipboard.writeText(invitationText);
        copied = true;
      } catch (_) {
        try {
          text.focus();
          text.select();
          copied = document.execCommand("copy");
        } catch (_) {}
      }

      status.textContent = copied
        ? "Invitación copiada."
        : "No se pudo copiar automáticamente.";
    });

    const expires = document.createElement("div");
    expires.className = "r96-access-note";

    let expiryText = String(data.expiresAt || "");
    try {
      expiryText = new Date(data.expiresAt).toLocaleString("es-ES");
    } catch (_) {}

    expires.textContent =
      "Válida hasta " + expiryText + ". El código podrá utilizarse una sola vez.";

    const security = document.createElement("p");
    security.textContent =
      "Por seguridad, Rising no guarda el token ni el código en texto legible. Si pierdes esta invitación, tendrás que generar una nueva.";

    dialog.append(intro, text, copy, status, expires, security);
  }

  function showError(code) {
    const dialog = dialogShell();
    const error = document.createElement("div");
    error.className = "r96-access-error";

    const messages = {
      AUTH_REQUIRED: "La sesión Nexo no está disponible.",
      INVITE_PERMISSION_REQUIRED: "Esta cuenta no tiene permiso para crear invitaciones de desarrollador.",
      INVALID_REQUEST_ID: "La solicitud de invitación no fue válida.",
      REQUEST_ALREADY_USED: "Esta solicitud ya fue procesada.",
      ACTION_CAPABILITY_MISSING: "Rising todavía no terminó de preparar esta acción. Actualiza la página y vuelve a intentarlo.",
      CAPABILITY_INVALID: "La autorización temporal de esta página ya no es válida. Actualiza la página.",
      CAPABILITY_EXPIRED: "La autorización temporal de esta página expiró. Actualiza la página.",
      INVITE_CREATE_TIMEOUT: "La invitación tardó demasiado en responder. Vuelve a intentarlo.",
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

  let inviteTimer = null;

  function requestInvitation() {
    if (access.canInviteDeveloper !== true) return;

    closeMenu();
    showLoading();

    if (inviteTimer) clearTimeout(inviteTimer);
    inviteTimer = setTimeout(() => {
      showError("INVITE_CREATE_TIMEOUT");
      inviteTimer = null;
    }, 12000);

    post("create-invite", {
      requestId: newRequestId()
    });
  }

  function render() {
    installAccountRoleObserver();
    syncAccountRoleLabel();

    const panel = document.querySelector("#r96-menu-panel");
    if (!panel) return;

    let button = document.getElementById(BUTTON_ID);

    if (access.canInviteDeveloper !== true) {
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
      syncAccountRoleLabel();
      return;
    }

    if (message.type === "invite-result") {
      if (inviteTimer) {
        clearTimeout(inviteTimer);
        inviteTimer = null;
      }

      const data = message.data || {};
      if (data.ok === true) {
        showInvitation(data);
      } else {
        showError(String(data.error || "INVITE_CREATE_FAILED"));
      }
    }
  });

  installAccountRoleObserver();
  render();
  postReady();

  let attempts = 0;
  const retry = setInterval(() => {
    attempts += 1;
    postReady();
    if (attempts >= 8) clearInterval(retry);
  }, 1000);
})();
