(() => {
  "use strict";

  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SOURCE_HOST = "r96-developer-host";
  const SOURCE_UI = "r96-developer-ui";
  const PROTOCOL = 1;

  let menuButton = null;
  let modal = null;
  let pendingInvite = null;
  let currentAccess = {
    signedIn: false,
    roleKey: "visitor",
    canInvite: false,
    isDeveloper: false
  };
  let readyRetry = null;
  let readyAttempts = 0;

  function post(type, payload = {}) {
    if (window.parent === window) return;
    window.parent.postMessage({
      source: SOURCE_UI,
      protocol: PROTOCOL,
      type,
      ...payload
    }, HOST_ORIGIN);
  }

  function accountState() {
    const account = document.querySelector(".r96-account-visual");
    return String(account?.dataset?.r96AuthState || "").trim();
  }

  function closeMenuPanel() {
    const panel = document.querySelector("#r96-menu-panel");
    const trigger = document.querySelector("#r96-menu");
    if (panel) panel.hidden = true;
    trigger?.setAttribute("aria-expanded", "false");
  }

  function ensureStyles() {
    if (document.querySelector("#r96-developer-ui-styles")) return;
    const style = document.createElement("style");
    style.id = "r96-developer-ui-styles";
    style.textContent = `
      .r96-dev-menu-action{
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
      .r96-dev-menu-action:hover{
        color:var(--r96-text);
        background:var(--r96-panel);
      }
      .r96-dev-overlay{
        position:fixed;
        inset:0;
        z-index:2000;
        display:grid;
        place-items:center;
        padding:20px;
        background:rgba(3,5,12,.72);
        backdrop-filter:blur(8px);
      }
      .r96-dev-overlay[hidden]{display:none}
      .r96-dev-dialog{
        width:min(560px,100%);
        max-height:min(88dvh,760px);
        overflow:auto;
        padding:22px;
        border:1px solid var(--r96-line);
        border-radius:22px;
        background:var(--r96-bg-2);
        color:var(--r96-text);
        box-shadow:0 24px 80px rgba(0,0,0,.4);
      }
      .r96-dev-dialog h2{
        margin:0 0 8px;
        font-size:1.4rem;
      }
      .r96-dev-dialog p{
        margin:0 0 16px;
        color:var(--r96-muted);
        line-height:1.55;
      }
      .r96-dev-field{
        display:grid;
        gap:7px;
        margin:14px 0;
      }
      .r96-dev-field label{
        font-size:.78rem;
        font-weight:900;
        color:var(--r96-muted);
      }
      .r96-dev-input,.r96-dev-code,.r96-dev-link{
        width:100%;
        box-sizing:border-box;
        padding:12px 13px;
        border:1px solid var(--r96-line);
        border-radius:12px;
        background:var(--r96-panel);
        color:var(--r96-text);
        font:inherit;
      }
      .r96-dev-code{
        letter-spacing:.08em;
        font-weight:950;
        text-transform:uppercase;
      }
      .r96-dev-actions{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        margin-top:18px;
      }
      .r96-dev-actions button{
        min-height:42px;
        padding:0 16px;
        border-radius:12px;
        border:1px solid var(--r96-line);
        font:inherit;
        font-weight:900;
        cursor:pointer;
      }
      .r96-dev-primary{
        background:linear-gradient(135deg,var(--r96-accent),var(--r96-accent-2));
        color:#071017;
      }
      .r96-dev-secondary{
        background:var(--r96-panel);
        color:var(--r96-text);
      }
      .r96-dev-status{
        min-height:22px;
        margin-top:12px;
        font-size:.86rem;
        color:var(--r96-muted);
      }
      .r96-dev-status[data-kind="error"]{color:#ff9a9a}
      .r96-dev-status[data-kind="success"]{color:#88efc7}
      .r96-dev-kicker{
        display:inline-flex;
        align-items:center;
        gap:8px;
        margin-bottom:12px;
        font-size:.72rem;
        font-weight:950;
        letter-spacing:.09em;
        text-transform:uppercase;
        color:var(--r96-accent);
      }
      @media (max-width:600px){
        .r96-dev-overlay{padding:12px}
        .r96-dev-dialog{padding:18px;border-radius:18px}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    if (modal) return modal;
    ensureStyles();

    modal = document.createElement("div");
    modal.className = "r96-dev-overlay";
    modal.hidden = true;
    modal.innerHTML = '<div class="r96-dev-dialog" role="dialog" aria-modal="true"></div>';
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function dialog() {
    return ensureModal().querySelector(".r96-dev-dialog");
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    dialog().innerHTML = "";
  }

  function setDialogStatus(message, kind = "") {
    const el = dialog().querySelector("[data-r96-dev-status]");
    if (!el) return;
    el.textContent = message || "";
    el.dataset.kind = kind;
  }

  async function copyText(value, feedback = "Copiado.") {
    try {
      await navigator.clipboard.writeText(String(value || ""));
      setDialogStatus(feedback, "success");
    } catch (_) {
      setDialogStatus("No se pudo copiar automáticamente. Mantén presionado y copia el texto.", "error");
    }
  }

  function setAccess(access = {}) {
    currentAccess = {
      signedIn: access.signedIn === true,
      roleKey: String(access.roleKey || "visitor"),
      canInvite: access.canInvite === true,
      isDeveloper: access.isDeveloper === true
    };

    const panel = document.querySelector("#r96-menu-panel");
    if (!panel) return;

    if (!currentAccess.canInvite) {
      menuButton?.remove();
      menuButton = null;
      return;
    }

    if (menuButton?.isConnected) return;

    menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "r96-dev-menu-action";
    menuButton.textContent = "Invitar desarrollador";
    menuButton.addEventListener("click", () => {
      closeMenuPanel();
      openInviteCreator();
    });
    panel.appendChild(menuButton);
  }

  function openInviteCreator() {
    const box = ensureModal();
    box.hidden = false;
    dialog().innerHTML = `
      <div class="r96-dev-kicker">Rising 96 Games · Desarrolladores</div>
      <h2>Invitar desarrollador</h2>
      <p>Se generará un enlace y un código de colaborador de un solo uso. La persona tendrá que validar el código y después iniciar sesión con su cuenta Nexo Group.</p>
      <div class="r96-dev-actions">
        <button class="r96-dev-primary" type="button" data-create>Generar invitación</button>
        <button class="r96-dev-secondary" type="button" data-close>Cancelar</button>
      </div>
      <div class="r96-dev-status" data-r96-dev-status></div>
    `;
    dialog().querySelector("[data-close]").addEventListener("click", closeModal);
    dialog().querySelector("[data-create]").addEventListener("click", (event) => {
      event.currentTarget.disabled = true;
      setDialogStatus("Generando invitación…");
      post("action", { action: "invite.create" });
    });
  }

  function showInviteCreated(data = {}) {
    const box = ensureModal();
    box.hidden = false;
    const link = String(data.inviteUrl || "");
    const code = String(data.code || "");
    const message = String(data.message || "Únete a Rising 96 Games y forma parte de nuestra comunidad de desarrolladores.");

    dialog().innerHTML = `
      <div class="r96-dev-kicker">Invitación creada</div>
      <h2>Invitar desarrollador</h2>
      <p>${message}</p>
      <div class="r96-dev-field">
        <label>Enlace de invitación</label>
        <input class="r96-dev-link" readonly value="">
      </div>
      <div class="r96-dev-field">
        <label>Código de colaborador de un solo uso</label>
        <input class="r96-dev-code" readonly value="">
      </div>
      <div class="r96-dev-actions">
        <button class="r96-dev-primary" type="button" data-copy-all>Copiar invitación</button>
        <button class="r96-dev-secondary" type="button" data-copy-link>Copiar enlace</button>
        <button class="r96-dev-secondary" type="button" data-close>Cerrar</button>
      </div>
      <div class="r96-dev-status" data-r96-dev-status></div>
    `;

    dialog().querySelector(".r96-dev-link").value = link;
    dialog().querySelector(".r96-dev-code").value = code;
    dialog().querySelector("[data-close]").addEventListener("click", closeModal);
    dialog().querySelector("[data-copy-link]").addEventListener("click", () => copyText(link, "Enlace copiado."));
    dialog().querySelector("[data-copy-all]").addEventListener("click", () => {
      copyText(
        `${message}\n\nEnlace: ${link}\nCódigo de un solo uso: ${code}`,
        "Invitación completa copiada."
      );
    });
  }

  function showInviteRedeem(token) {
    pendingInvite = { token: String(token || ""), code: "", verified: false };
    const box = ensureModal();
    box.hidden = false;

    dialog().innerHTML = `
      <div class="r96-dev-kicker">Invitación de desarrollador</div>
      <h2>Únete a Rising 96 Games</h2>
      <p>Comparte tus juegos con nosotros y forma parte de nuestra comunidad de desarrolladores.</p>
      <div class="r96-dev-field">
        <label for="r96-dev-invite-code">Ingresa tu código de colaborador de un solo uso</label>
        <input id="r96-dev-invite-code" class="r96-dev-input r96-dev-code" inputmode="text" autocomplete="one-time-code" maxlength="14" placeholder="ABCDE-FGHIJ">
      </div>
      <div class="r96-dev-actions">
        <button class="r96-dev-primary" type="button" data-verify>Validar código</button>
        <button class="r96-dev-secondary" type="button" data-close>Cancelar</button>
      </div>
      <div class="r96-dev-status" data-r96-dev-status></div>
    `;

    const input = dialog().querySelector("#r96-dev-invite-code");
    dialog().querySelector("[data-close]").addEventListener("click", closeModal);
    dialog().querySelector("[data-verify]").addEventListener("click", () => {
      const code = String(input.value || "").trim().toUpperCase();
      if (!code) {
        setDialogStatus("Ingresa el código de colaborador.", "error");
        return;
      }
      pendingInvite.code = code;
      setDialogStatus("Validando código…");
      post("action", {
        action: "invite.verify",
        token: pendingInvite.token,
        code
      });
    });
    input.focus();
  }

  function continueAfterVerification() {
    if (!pendingInvite?.verified) return;

    if (accountState() === "signedIn") {
      setDialogStatus("Asignando acceso de desarrollador…");
      post("action", {
        action: "invite.redeem",
        token: pendingInvite.token,
        code: pendingInvite.code
      });
      return;
    }

    setDialogStatus("Código válido. Abriendo inicio de sesión de Nexo Group…", "success");
    const login = document.querySelector("#r96-login");
    if (login && !login.disabled) {
      login.click();
    } else {
      const account = document.querySelector(".r96-account-visual");
      account?.click();
    }
  }

  function inviteVerified(data = {}) {
    if (!data.valid) {
      setDialogStatus("El código no es válido, ya fue usado o expiró.", "error");
      return;
    }

    if (!pendingInvite) return;
    pendingInvite.verified = true;
    continueAfterVerification();
  }

  function inviteRedeemed(data = {}) {
    pendingInvite = null;
    setAccess({
      signedIn: true,
      roleKey: data.roleKey || "developer",
      canInvite: true,
      isDeveloper: true
    });

    const box = ensureModal();
    box.hidden = false;
    dialog().innerHTML = `
      <div class="r96-dev-kicker">Acceso confirmado</div>
      <h2>Ya eres desarrollador de Rising 96 Games</h2>
      <p>Tu cuenta Nexo Group quedó vinculada como desarrollador. El código de invitación ya no puede volver a utilizarse.</p>
      <div class="r96-dev-actions">
        <button class="r96-dev-primary" type="button" data-close>Continuar</button>
      </div>
      <div class="r96-dev-status" data-r96-dev-status data-kind="success">Acceso de desarrollador activado.</div>
    `;
    dialog().querySelector("[data-close]").addEventListener("click", closeModal);
  }

  function hostError(message) {
    const text = String(message || "No se pudo completar la operación.");
    if (modal && !modal.hidden) {
      setDialogStatus(text, "error");
    }
  }

  function receive(event) {
    if (event.origin !== HOST_ORIGIN || event.source !== window.parent) return;
    const data = event.data;
    if (!data || data.source !== SOURCE_HOST || data.protocol !== PROTOCOL) return;

    if (data.type === "status") {
      clearInterval(readyRetry);
      readyRetry = null;
      setAccess(data.data || {});
      return;
    }

    if (data.type === "invite.token") {
      if (data.token) showInviteRedeem(data.token);
      return;
    }

    if (data.type === "invite.created") {
      showInviteCreated(data.data || {});
      return;
    }

    if (data.type === "invite.verified") {
      inviteVerified(data.data || {});
      return;
    }

    if (data.type === "invite.redeemed") {
      inviteRedeemed(data.data || {});
      return;
    }

    if (data.type === "error") {
      hostError(data.message);
    }
  }

  function receiveAuth(event) {
    if (event.origin !== HOST_ORIGIN || event.source !== window.parent) return;
    const data = event.data;
    if (!data || data.source !== "r96-wix-auth" || data.protocol !== 1) return;

    if (data.status === "signedOut") {
      setAccess({ signedIn: false, roleKey: "visitor", canInvite: false, isDeveloper: false });
      return;
    }

    if (data.status === "signedIn") {
      post("refresh");
      if (pendingInvite?.verified) {
        setTimeout(continueAfterVerification, 80);
      }
    }
  }

  function bind() {
    ensureStyles();
    window.addEventListener("message", receive);
    window.addEventListener("message", receiveAuth);

    const announceReady = () => {
      post("ready");
      readyAttempts += 1;
      if (readyAttempts >= 8) {
        clearInterval(readyRetry);
        readyRetry = null;
      }
    };

    announceReady();
    readyRetry = setInterval(announceReady, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();
