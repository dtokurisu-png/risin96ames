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

  let inviteTimer = null;
  let inviteFlow = "idle";

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
      .r96-access-copy,
      .r96-invite-primary{
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
      .r96-invite-primary{
        background:var(--r96-accent);
        color:#071018;
        border-color:transparent;
      }
      .r96-invite-primary:disabled{
        opacity:.58;
        cursor:default;
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
        margin-top:14px;
        padding:11px 12px;
        border:1px solid var(--r96-line);
        border-radius:12px;
        background:var(--r96-panel);
        color:var(--r96-text);
        line-height:1.4;
        font-size:.86rem;
      }
      .r96-access-copy-status{
        min-height:20px;
        margin-top:8px;
        color:var(--r96-accent);
        font-size:.78rem;
        font-weight:800;
      }
      .r96-invite-code-label{
        display:block;
        margin-top:18px;
        margin-bottom:7px;
        color:var(--r96-muted);
        font-size:.78rem;
        font-weight:800;
      }
      .r96-invite-code-input{
        width:100%;
        box-sizing:border-box;
        border:1px solid var(--r96-line);
        border-radius:12px;
        background:var(--r96-panel);
        color:var(--r96-text);
        padding:13px 14px;
        font:inherit;
        font-size:1rem;
        font-weight:900;
        letter-spacing:.12em;
        text-transform:uppercase;
        outline:none;
      }
      .r96-invite-code-input:focus{
        border-color:var(--r96-accent);
      }
      .r96-invite-success{
        margin-top:16px;
        padding:14px;
        border:1px solid var(--r96-line);
        border-radius:14px;
        background:var(--r96-panel);
        line-height:1.5;
      }
      .r96-invite-success strong{
        display:block;
        margin-bottom:5px;
        color:var(--r96-text);
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

  function dialogShell(titleText = "Invitación de desarrollador", closable = true) {
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
    title.textContent = titleText;
    titleWrap.appendChild(title);

    head.appendChild(titleWrap);

    if (closable) {
      const close = document.createElement("button");
      close.className = "r96-access-dialog-close";
      close.type = "button";
      close.textContent = "×";
      close.setAttribute("aria-label", "Cerrar");
      close.addEventListener("click", removeDialog);
      head.appendChild(close);
    }

    dialog.appendChild(head);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    if (closable) {
      backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) removeDialog();
      });
    }

    return dialog;
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

  function generationErrorMessage(code) {
    const messages = {
      AUTH_REQUIRED: "La sesión Nexo no está disponible.",
      WONDER_REQUIRED: "Esta cuenta ya no tiene permiso Wonder para crear invitaciones.",
      INVALID_REQUEST_ID: "La solicitud de invitación no fue válida.",
      REQUEST_ALREADY_USED: "Esta solicitud ya fue procesada.",
      ACTION_CAPABILITY_MISSING: "Rising todavía no terminó de preparar esta acción. Actualiza la página y vuelve a intentarlo.",
      CAPABILITY_INVALID: "La autorización temporal de esta página ya no es válida. Actualiza la página.",
      CAPABILITY_EXPIRED: "La autorización temporal de esta página expiró. Actualiza la página.",
      INVITE_CREATE_TIMEOUT: "La invitación tardó demasiado en responder. Vuelve a intentarlo.",
      INVITE_CREATE_FAILED: "No se pudo crear la invitación.",
      R96_ACCESS_ACTION_FAILED: "No se pudo completar la acción de acceso."
    };

    return messages[code] || messages.INVITE_CREATE_FAILED;
  }

  function showGenerationError(code) {
    const dialog = dialogShell();
    const error = document.createElement("div");
    error.className = "r96-access-error";
    error.textContent = generationErrorMessage(code);
    dialog.appendChild(error);
  }

  function inviteEntryErrorMessage(code) {
    const messages = {
      INVITE_NOT_FOUND: "Este enlace de invitación no es válido.",
      INVITE_CODE_INVALID: "El código no es correcto. Revísalo e inténtalo otra vez.",
      INVITE_ALREADY_USED: "Esta invitación ya fue utilizada.",
      INVITE_ALREADY_VERIFIED: "Este código ya fue validado en otra sesión.",
      INVITE_NOT_ACTIVE: "Esta invitación ya no está activa.",
      INVITE_EXPIRED: "Esta invitación expiró.",
      INVITE_VERIFY_FAILED: "No se pudo verificar la invitación."
    };

    return messages[code] || messages.INVITE_VERIFY_FAILED;
  }

  function claimErrorMessage(code) {
    const messages = {
      CLAIM_INVALID: "La validación de esta invitación ya no es válida.",
      CLAIM_EXPIRED: "La validación de la invitación expiró. Solicita una nueva invitación.",
      INVITE_NOT_FOUND: "No se encontró la invitación.",
      INVITE_ALREADY_USED: "Esta invitación ya fue utilizada.",
      INVITE_NOT_VERIFIED: "La invitación todavía no está verificada.",
      INVITE_EXPIRED: "La invitación expiró.",
      ROLE_ALREADY_GRANTED: "Esta cuenta ya tiene acceso de desarrollador.",
      CAPABILITY_INVALID: "La autorización de la sesión cambió. Actualiza la página.",
      CAPABILITY_EXPIRED: "La autorización de la sesión expiró. Actualiza la página.",
      R96_ACCESS_ACTION_FAILED: "No se pudo activar el acceso de desarrollador."
    };

    return messages[code] || messages.R96_ACCESS_ACTION_FAILED;
  }

  function showInviteEntry(errorCode = "") {
    inviteFlow = "entry";

    const dialog = dialogShell("Bienvenido a Rising Games", false);

    const intro = document.createElement("p");
    intro.textContent =
      "Eres un desarrollador invitado. Ingresa el código que recibiste junto con este enlace para continuar.";

    const label = document.createElement("label");
    label.className = "r96-invite-code-label";
    label.setAttribute("for", "r96-invite-code");
    label.textContent = "Código de invitación";

    const input = document.createElement("input");
    input.id = "r96-invite-code";
    input.className = "r96-invite-code-input";
    input.type = "text";
    input.inputMode = "text";
    input.autocomplete = "one-time-code";
    input.maxLength = 9;
    input.placeholder = "ABCD-1234";
    input.setAttribute("aria-label", "Código de invitación");

    const submit = document.createElement("button");
    submit.className = "r96-invite-primary";
    submit.type = "button";
    submit.textContent = "Validar código";

    const feedback = document.createElement("div");
    feedback.setAttribute("aria-live", "polite");

    if (errorCode) {
      feedback.className = "r96-access-error";
      feedback.textContent = inviteEntryErrorMessage(errorCode);
    }

    input.addEventListener("input", () => {
      const raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
      input.value = raw.length > 4
        ? raw.slice(0, 4) + "-" + raw.slice(4)
        : raw;
    });

    const verify = () => {
      const code = input.value.trim();
      if (!code) {
        feedback.className = "r96-access-error";
        feedback.textContent = "Ingresa el código de invitación.";
        input.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = "Validando…";
      feedback.className = "";
      feedback.textContent = "";

      post("verify-invite", { code });
    };

    submit.addEventListener("click", verify);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        verify();
      }
    });

    dialog.append(intro, label, input, submit, feedback);

    setTimeout(() => input.focus(), 0);
  }

  function currentAuthState() {
    return String(
      document.querySelector(".r96-account-visual")?.dataset?.r96AuthState || ""
    );
  }

  function triggerCanonicalLogin() {
    const state = currentAuthState();

    if (state === "signedIn") {
      showInviteClaiming();
      return;
    }

    const login = document.querySelector("#r96-login");
    const account = document.querySelector(".r96-account-visual");
    const target = login && !login.disabled
      ? login
      : account && !account.disabled
        ? account
        : null;

    if (!target) {
      const status = document.querySelector("#r96-invite-login-status");
      if (status) {
        status.textContent =
          "Espera a que Rising termine de comprobar la sesión y vuelve a pulsar Iniciar sesión.";
      }
      return;
    }

    removeDialog();
    target.click();
  }

  function showInviteVerified() {
    inviteFlow = "verified";

    if (currentAuthState() === "signedIn" || access.signedIn) {
      showInviteClaiming();
      return;
    }

    const dialog = dialogShell("Invitación validada", false);

    const success = document.createElement("div");
    success.className = "r96-invite-success";

    const strong = document.createElement("strong");
    strong.textContent = "Genial, tu invitación es válida.";

    const copy = document.createElement("span");
    copy.textContent =
      " Ahora puedes activar tu acceso como desarrollador. Inicia sesión con tu cuenta Nexo Group.";

    success.append(strong, copy);

    const login = document.createElement("button");
    login.className = "r96-invite-primary";
    login.type = "button";
    login.textContent = "Iniciar sesión";
    login.addEventListener("click", triggerCanonicalLogin);

    const status = document.createElement("div");
    status.id = "r96-invite-login-status";
    status.className = "r96-access-copy-status";
    status.setAttribute("aria-live", "polite");

    dialog.append(success, login, status);
  }

  function showInviteClaiming() {
    inviteFlow = "claiming";

    const dialog = dialogShell("Activando acceso", false);

    const loading = document.createElement("div");
    loading.className = "r96-access-loading";
    loading.textContent = "Activando tu acceso como desarrollador…";

    dialog.appendChild(loading);
  }

  function showInviteClaimed(data = {}) {
    inviteFlow = "claimed";

    if (data.access) {
      access = {
        signedIn: data.access.signedIn === true,
        roleKey: String(data.access.roleKey || "developer"),
        canInviteDeveloper: data.access.canInviteDeveloper === true,
        isDeveloper: data.access.isDeveloper === true,
        isWonder: data.access.isWonder === true
      };
      render();
    }

    const dialog = dialogShell("Acceso activado");

    const success = document.createElement("div");
    success.className = "r96-invite-success";

    const strong = document.createElement("strong");
    strong.textContent = "Ya tienes acceso como desarrollador.";

    const copy = document.createElement("span");
    copy.textContent =
      " Tu cuenta Nexo quedó vinculada a Rising Games con el rol de desarrollador.";

    success.append(strong, copy);

    const close = document.createElement("button");
    close.className = "r96-invite-primary";
    close.type = "button";
    close.textContent = "Continuar";
    close.addEventListener("click", removeDialog);

    dialog.append(success, close);
  }

  function showInviteClaimError(code) {
    inviteFlow = "error";

    const dialog = dialogShell("No se pudo activar el acceso");

    const error = document.createElement("div");
    error.className = "r96-access-error";
    error.textContent = claimErrorMessage(code);

    dialog.appendChild(error);
  }

  function newRequestId() {
    if (crypto?.randomUUID) return crypto.randomUUID();

    const bytes = new Uint8Array(18);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  }

  function requestInvitation() {
    if (access.isWonder !== true || access.canInviteDeveloper !== true) return;

    closeMenu();
    showLoading();

    if (inviteTimer) clearTimeout(inviteTimer);
    inviteTimer = setTimeout(() => {
      showGenerationError("INVITE_CREATE_TIMEOUT");
      inviteTimer = null;
    }, 12000);

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
      const resumeVerifiedInvite =
        inviteFlow === "verified" && data.signedIn === true;

      access = {
        signedIn: data.signedIn === true,
        roleKey: String(data.roleKey || "visitor"),
        canInviteDeveloper: data.canInviteDeveloper === true,
        isDeveloper: data.isDeveloper === true,
        isWonder: data.isWonder === true
      };
      render();

      if (resumeVerifiedInvite) {
        showInviteClaiming();
      }
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
        showGenerationError(String(data.error || "INVITE_CREATE_FAILED"));
      }
      return;
    }

    if (message.type === "invite-entry") {
      if (inviteFlow === "idle") {
        showInviteEntry();
      }
      return;
    }

    if (message.type === "invite-verify-error") {
      showInviteEntry(String(message.data?.error || "INVITE_VERIFY_FAILED"));
      return;
    }

    if (message.type === "invite-verified") {
      showInviteVerified();
      return;
    }

    if (message.type === "invite-claiming") {
      showInviteClaiming();
      return;
    }

    if (message.type === "invite-claimed") {
      showInviteClaimed(message.data || {});
      return;
    }

    if (message.type === "invite-claim-error") {
      showInviteClaimError(String(message.data?.error || "R96_ACCESS_ACTION_FAILED"));
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
