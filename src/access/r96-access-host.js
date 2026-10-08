(() => {
  "use strict";

  if (window.__r96AccessHost) return;
  window.__r96AccessHost = true;

  const PATH = "/my-site-1/blank-9";
  const SITE_BASE = "/my-site-1";
  const ROLE_PARAM = "r96role";
  const CAPABILITY_PARAM = "r96cap";
  const INVITE_PARAM = "r96invite";
  const ENTRY_STORAGE_KEY = "r96-invite-entry-v2";
  const CODE_STORAGE_KEY = "r96-invite-code-v3";
  const LEGACY_CLAIM_STORAGE_KEY = "r96-invite-claim-v2";
  const FRAME_ORIGIN = "https://dtokurisu-png.github.io";
  const SOURCE_BRIDGE = "r96-access-bridge";
  const SOURCE_UI = "r96-access-ui";
  const PROTOCOL = 1;
  const MODAL_ID = "r96-host-invite-modal";
  const STYLE_ID = "r96-host-invite-style";
  const LEGACY_PARAMS = [
    "r96a1","r96cmd","r96req","r96result","r96iid",
    "r96token","r96code","r96exp","r96err"
  ];

  if (location.pathname.replace(/\/+$/, "") !== PATH) return;

  let frameWindow = null;
  let lastRole = "";
  let roleOverride = "";
  let actionCapability = "";
  let inviteInFlight = false;
  let verifyInFlight = false;
  let claimInFlight = false;
  let claimBlocked = false;

  function readSession(key) {
    try { return String(sessionStorage.getItem(key) || ""); }
    catch (_) { return ""; }
  }

  function writeSession(key, value) {
    try {
      if (value) sessionStorage.setItem(key, value);
      else sessionStorage.removeItem(key);
    } catch (_) {}
  }

  function captureTransientState() {
    const url = new URL(location.href);
    let changed = false;

    const nextCapability = url.searchParams.get(CAPABILITY_PARAM) || "";
    if (/^[A-Za-z0-9_-]{40,80}$/.test(nextCapability)) {
      if (nextCapability !== actionCapability) {
        actionCapability = nextCapability;
        claimBlocked = false;
      }
    }

    const inviteToken = url.searchParams.get(INVITE_PARAM) || "";
    if (/^[A-Za-z0-9_-]{40,80}$/.test(inviteToken)) {
      writeSession(ENTRY_STORAGE_KEY, inviteToken);
      writeSession(CODE_STORAGE_KEY, "");
      writeSession(LEGACY_CLAIM_STORAGE_KEY, "");
      claimBlocked = false;
    }

    if (url.searchParams.has(CAPABILITY_PARAM)) {
      url.searchParams.delete(CAPABILITY_PARAM);
      changed = true;
    }

    if (url.searchParams.has(INVITE_PARAM)) {
      url.searchParams.delete(INVITE_PARAM);
      changed = true;
    }

    for (const key of LEGACY_PARAMS) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }

    if (changed) {
      history.replaceState(
        history.state,
        "",
        url.pathname + url.search + url.hash
      );
    }
  }

  function accessState() {
    const raw =
      roleOverride ||
      new URL(location.href).searchParams.get(ROLE_PARAM) ||
      "";

    const roleKey = ["wonder", "developer", "member"].includes(raw)
      ? raw
      : "visitor";

    return {
      signedIn: roleKey !== "visitor",
      roleKey,
      canInviteDeveloper: roleKey === "wonder",
      isDeveloper: roleKey === "wonder" || roleKey === "developer",
      isWonder: roleKey === "wonder"
    };
  }

  function postToFrame(type, data = {}) {
    if (!frameWindow) return;

    frameWindow.postMessage({
      source: SOURCE_BRIDGE,
      protocol: PROTOCOL,
      type,
      data
    }, FRAME_ORIGIN);
  }

  function sendAccess(force) {
    if (!frameWindow) return;

    const data = accessState();
    if (!force && data.roleKey === lastRole) return;

    lastRole = data.roleKey;
    postToFrame("access", data);
  }

  function ensureHostStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#r96-host-invite-modal{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:24px;box-sizing:border-box;background:rgba(2,6,15,.72);backdrop-filter:blur(8px);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}",
      "#r96-host-invite-modal .r96-host-card{width:min(520px,100%);box-sizing:border-box;padding:24px;border:1px solid rgba(255,255,255,.16);border-radius:22px;background:#0d1220;color:#f5f8ff;box-shadow:0 24px 80px rgba(0,0,0,.5)}",
      "#r96-host-invite-modal h2{margin:0;font-size:24px;line-height:1.2}",
      "#r96-host-invite-modal p{margin:10px 0 0;color:#b8c3d8;font-size:15px;line-height:1.55}",
      "#r96-host-invite-modal label{display:block;margin:20px 0 7px;color:#d9e2f2;font-size:13px;font-weight:800}",
      "#r96-host-invite-modal input{width:100%;box-sizing:border-box;padding:14px 15px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:#151d2d;color:#fff;outline:none;font:900 17px/1.2 Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}",
      "#r96-host-invite-modal input:focus{border-color:#7ddcff;box-shadow:0 0 0 3px rgba(125,220,255,.14)}",
      "#r96-host-invite-modal button{width:100%;min-height:46px;margin-top:12px;border:0;border-radius:12px;background:#78dfff;color:#07131b;font:900 15px/1 Inter,system-ui,sans-serif;cursor:pointer}",
      "#r96-host-invite-modal button:disabled{opacity:.58;cursor:default}",
      "#r96-host-invite-modal .r96-host-message{margin-top:14px;padding:12px 13px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(255,255,255,.05);color:#eaf2ff;font-size:14px;line-height:1.45}",
      "#r96-host-invite-modal .r96-host-error{color:#ffd8d8;border-color:rgba(255,110,110,.28);background:rgba(133,27,27,.16)}",
      "#r96-host-invite-modal .r96-host-kicker{margin:0 0 8px;color:#78dfff;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}",
      "@media(max-width:560px){#r96-host-invite-modal{padding:16px}#r96-host-invite-modal .r96-host-card{padding:20px}}"
    ].join("");

    document.head.appendChild(style);
  }

  function removeHostModal() {
    document.getElementById(MODAL_ID)?.remove();
  }

  function hostCard(title, kicker = "Rising Games") {
    ensureHostStyle();
    removeHostModal();

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;

    const card = document.createElement("section");
    card.className = "r96-host-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");

    const eyebrow = document.createElement("div");
    eyebrow.className = "r96-host-kicker";
    eyebrow.textContent = kicker;

    const heading = document.createElement("h2");
    heading.textContent = title;

    card.append(eyebrow, heading);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    return card;
  }

  function entryErrorMessage(code) {
    const messages = {
      INVITE_NOT_FOUND: "Este enlace de invitación no es válido.",
      INVITE_CODE_INVALID: "El código no es correcto. Revísalo e inténtalo de nuevo.",
      INVITE_ALREADY_USED: "Esta invitación ya fue utilizada.",
      INVITE_ALREADY_VERIFIED: "Esta invitación ya fue validada en otra sesión.",
      INVITE_NOT_ACTIVE: "Esta invitación ya no está activa.",
      INVITE_EXPIRED: "Esta invitación expiró.",
      INVITE_VERIFY_FAILED: "No se pudo verificar la invitación."
    };

    return messages[code] || messages.INVITE_VERIFY_FAILED;
  }

  function claimErrorMessage(code) {
    const messages = {
      INVITE_NOT_FOUND: "No se encontró la invitación.",
      INVITE_ALREADY_USED: "Esta invitación ya fue utilizada.",
      INVITE_NOT_VERIFIED: "La invitación todavía no está verificada.",
      INVITE_EXPIRED: "La invitación expiró.",
      ROLE_ALREADY_GRANTED: "Esta cuenta ya tiene acceso de desarrollador.",
      CAPABILITY_INVALID: "La autorización de esta sesión ya no es válida. Actualiza la página.",
      CAPABILITY_EXPIRED: "La autorización de esta sesión expiró. Actualiza la página.",
      R96_ACCESS_ACTION_FAILED: "No se pudo activar el acceso como desarrollador."
    };

    return messages[code] || messages.R96_ACCESS_ACTION_FAILED;
  }

  function showInviteEntry(errorCode = "") {
    const inviteToken = readSession(ENTRY_STORAGE_KEY);
    if (!/^[A-Za-z0-9_-]{40,80}$/.test(inviteToken)) return;

    const card = hostCard("Eres un desarrollador invitado");

    const copy = document.createElement("p");
    copy.textContent =
      "Bienvenido a Rising Games. Ingresa el código que recibiste junto con esta invitación para continuar.";

    const label = document.createElement("label");
    label.htmlFor = "r96-host-invite-code";
    label.textContent = "Código de invitación";

    const input = document.createElement("input");
    input.id = "r96-host-invite-code";
    input.type = "text";
    input.inputMode = "text";
    input.autocomplete = "one-time-code";
    input.maxLength = 9;
    input.placeholder = "ABCD-1234";
    input.setAttribute("aria-label", "Código de invitación");

    const submit = document.createElement("button");
    submit.type = "button";
    submit.textContent = "Validar código";

    const feedback = document.createElement("div");
    feedback.setAttribute("aria-live", "polite");

    if (errorCode) {
      feedback.className = "r96-host-message r96-host-error";
      feedback.textContent = entryErrorMessage(errorCode);
    }

    input.addEventListener("input", () => {
      const raw = input.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 8);

      input.value =
        raw.length > 4
          ? raw.slice(0, 4) + "-" + raw.slice(4)
          : raw;
    });

    const submitCode = () => {
      const code = input.value.trim();

      if (!code) {
        feedback.className = "r96-host-message r96-host-error";
        feedback.textContent = "Ingresa el código de invitación.";
        input.focus();
        return;
      }

      verifyInvite(code, submit, feedback);
    };

    submit.addEventListener("click", submitCode);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitCode();
      }
    });

    card.append(copy, label, input, submit, feedback);
    setTimeout(() => input.focus(), 0);
  }

  function showInviteVerified() {
    const card = hostCard("Invitación validada");

    const message = document.createElement("div");
    message.className = "r96-host-message";
    message.innerHTML =
      "<strong>Genial, tu invitación es válida.</strong><br>" +
      "Ahora puedes activar tu acceso como desarrollador. Inicia sesión con tu cuenta Nexo Group.";

    const login = document.createElement("button");
    login.type = "button";
    login.textContent = "Iniciar sesión";
    login.addEventListener("click", startCanonicalLogin);

    card.append(message, login);
  }

  function showClaiming() {
    const card = hostCard("Activando acceso");

    const message = document.createElement("div");
    message.className = "r96-host-message";
    message.textContent = "Activando tu acceso como desarrollador…";

    card.appendChild(message);
  }

  function showClaimed() {
    const card = hostCard("Acceso activado");

    const message = document.createElement("div");
    message.className = "r96-host-message";
    message.innerHTML =
      "<strong>Ya tienes acceso como desarrollador.</strong><br>" +
      "Tu cuenta Nexo quedó vinculada a Rising Games.";

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Continuar";
    close.addEventListener("click", removeHostModal);

    card.append(message, close);
  }

  function showClaimError(code) {
    const card = hostCard("No se pudo activar el acceso");

    const message = document.createElement("div");
    message.className = "r96-host-message r96-host-error";
    message.textContent = claimErrorMessage(code);

    card.appendChild(message);
  }

  function startCanonicalLogin() {
    const url = new URL(location.href);

    [
      "nxb","nxa","nxav","nexoAuth","nexoAction","nexoReturn",
      "nexoCommandId",CAPABILITY_PARAM,INVITE_PARAM
    ].forEach((key) => url.searchParams.delete(key));

    url.searchParams.set("nexoAuth", "login");
    url.searchParams.set(
      "nexoCommandId",
      Date.now().toString(36) + "-r96invite"
    );

    location.assign(url.href);
  }

  async function verifyInvite(code, submit, feedback) {
    if (verifyInFlight) return;

    captureTransientState();
    const inviteToken = readSession(ENTRY_STORAGE_KEY);

    if (!/^[A-Za-z0-9_-]{40,80}$/.test(inviteToken)) {
      showInviteEntry("INVITE_NOT_FOUND");
      return;
    }

    verifyInFlight = true;
    submit.disabled = true;
    submit.textContent = "Validando…";
    feedback.className = "";
    feedback.textContent = "";

    try {
      const response = await fetch(
        SITE_BASE + "/_functions/r96InviteEntry",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({
            action: "verify",
            inviteToken,
            code: String(code || "")
          })
        }
      );

      const payload = await response.json().catch(() => null);

      if (
        !payload ||
        payload.ok !== true ||
        payload.data?.valid !== true
      ) {
        showInviteEntry(
          String(payload?.error || "INVITE_VERIFY_FAILED")
        );
        return;
      }

      const normalizedCode = String(code || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

      writeSession(CODE_STORAGE_KEY, normalizedCode);
      writeSession(LEGACY_CLAIM_STORAGE_KEY, "");
      claimBlocked = false;

      if (accessState().signedIn && actionCapability) {
        tryClaimInvite();
      } else {
        showInviteVerified();
      }
    } catch (_) {
      showInviteEntry("INVITE_VERIFY_FAILED");
    } finally {
      verifyInFlight = false;
    }
  }

  async function tryClaimInvite() {
    if (claimInFlight || claimBlocked) return;

    captureTransientState();

    const inviteToken = readSession(ENTRY_STORAGE_KEY);
    const code = readSession(CODE_STORAGE_KEY);
    const state = accessState();

    if (!/^[A-Za-z0-9_-]{40,80}$/.test(inviteToken)) return;
    if (!/^[A-Z0-9]{8}$/.test(code)) return;

    if (!state.signedIn || !actionCapability) {
      if (!document.getElementById(MODAL_ID)) {
        showInviteVerified();
      }
      return;
    }

    claimInFlight = true;
    showClaiming();

    try {
      const response = await fetch(
        SITE_BASE + "/_functions/r96AccessAction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({
            action: "claimInvite",
            capability: actionCapability,
            inviteToken,
            code
          })
        }
      );

      const payload = await response.json().catch(() => null);

      if (
        !payload ||
        payload.ok !== true ||
        !payload.data?.access
      ) {
        const error = String(
          payload?.error || "R96_ACCESS_ACTION_FAILED"
        );

        if (
          error === "CAPABILITY_INVALID" ||
          error === "CAPABILITY_EXPIRED"
        ) {
          actionCapability = "";
        }

        claimBlocked = true;
        showClaimError(error);
        return;
      }

      const data = payload.data;

      actionCapability = String(data.nextActionCapability || "");
      writeSession(CODE_STORAGE_KEY, "");
      writeSession(ENTRY_STORAGE_KEY, "");
      writeSession(LEGACY_CLAIM_STORAGE_KEY, "");

      roleOverride = String(data.access.roleKey || "developer");
      lastRole = "";
      claimBlocked = false;

      sendAccess(true);
      showClaimed();
    } catch (_) {
      claimBlocked = true;
      showClaimError("R96_ACCESS_ACTION_FAILED");
    } finally {
      claimInFlight = false;
    }
  }

  async function createInvite(requestId) {
    if (inviteInFlight) return;

    captureTransientState();

    if (!/^[A-Za-z0-9_-]{16,100}$/.test(requestId)) {
      postToFrame("invite-result", {
        ok: false,
        error: "INVALID_REQUEST_ID"
      });
      return;
    }

    if (accessState().isWonder !== true) {
      postToFrame("invite-result", {
        ok: false,
        error: "WONDER_REQUIRED"
      });
      return;
    }

    if (!actionCapability) {
      postToFrame("invite-result", {
        ok: false,
        error: "ACTION_CAPABILITY_MISSING"
      });
      return;
    }

    inviteInFlight = true;

    try {
      const response = await fetch(
        SITE_BASE + "/_functions/r96AccessAction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({
            action: "createInvite",
            capability: actionCapability,
            requestId
          })
        }
      );

      const payload = await response.json().catch(() => null);

      if (!payload || payload.ok !== true || !payload.data) {
        postToFrame("invite-result", {
          ok: false,
          error: String(payload?.error || "INVITE_CREATE_FAILED")
        });
        return;
      }

      const data = payload.data;

      actionCapability = String(data.nextActionCapability || "");
      delete data.nextActionCapability;
      delete data.nextActionCapabilityExpiresAt;
      delete data.token;

      postToFrame("invite-result", {
        ok: true,
        ...data
      });
    } catch (_) {
      postToFrame("invite-result", {
        ok: false,
        error: "INVITE_CREATE_FAILED"
      });
    } finally {
      inviteInFlight = false;
    }
  }

  addEventListener("message", (event) => {
    if (event.origin !== FRAME_ORIGIN) return;

    const message = event.data;
    if (
      !message ||
      message.source !== SOURCE_UI ||
      message.protocol !== PROTOCOL
    ) {
      return;
    }

    frameWindow = event.source;

    if (message.type === "ready") {
      captureTransientState();
      sendAccess(true);
      return;
    }

    if (message.type === "create-invite") {
      createInvite(String(message.requestId || ""));
    }
  });

  writeSession(LEGACY_CLAIM_STORAGE_KEY, "");
  captureTransientState();

  if (
    /^[A-Za-z0-9_-]{40,80}$/.test(
      readSession(ENTRY_STORAGE_KEY)
    )
  ) {
    showInviteEntry();
  } else if (
    /^[A-Z0-9]{8}$/.test(
      readSession(CODE_STORAGE_KEY)
    ) &&
    /^[A-Za-z0-9_-]{40,80}$/.test(
      readSession(ENTRY_STORAGE_KEY)
    )
  ) {
    if (accessState().signedIn && actionCapability) {
      tryClaimInvite();
    } else {
      showInviteVerified();
    }
  }

  const timer = setInterval(() => {
    captureTransientState();
    sendAccess(false);

    const entryToken = readSession(ENTRY_STORAGE_KEY);
    const code = readSession(CODE_STORAGE_KEY);

    if (
      /^[A-Za-z0-9_-]{40,80}$/.test(entryToken) &&
      !/^[A-Z0-9]{8}$/.test(code) &&
      !document.getElementById(MODAL_ID)
    ) {
      showInviteEntry();
    }

    if (
      /^[A-Za-z0-9_-]{40,80}$/.test(entryToken) &&
      /^[A-Z0-9]{8}$/.test(code)
    ) {
      tryClaimInvite();
    }
  }, 150);

  addEventListener(
    "pagehide",
    () => clearInterval(timer),
    { once: true }
  );
})();
