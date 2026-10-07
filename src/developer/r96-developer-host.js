(() => {
  "use strict";

  const PATH = "/my-site-1/blank-9";
  const FRAME_ORIGIN = "https://dtokurisu-png.github.io";
  const SOURCE_HOST = "r96-developer-host";
  const SOURCE_UI = "r96-developer-ui";
  const PROTOCOL = 1;
  const ENDPOINT = "/my-site-1/_functions/risingDeveloperAccess";

  if (location.pathname.replace(/\/+$/, "") !== PATH || window.__r96DeveloperHost) {
    return;
  }

  window.__r96DeveloperHost = true;

  let developerSessionToken = "";

  function frame() {
    return document.getElementById("nexo-rising-app");
  }

  function inviteToken() {
    return String(new URL(location.href).searchParams.get("r96Invite") || "").trim();
  }

  function send(type, payload = {}) {
    const target = frame();
    if (!target?.contentWindow) return;
    target.contentWindow.postMessage({
      source: SOURCE_HOST,
      protocol: PROTOCOL,
      type,
      ...payload
    }, FRAME_ORIGIN);
  }

  function cleanInviteUrl() {
    const url = new URL(location.href);
    if (!url.searchParams.has("r96Invite")) return;
    url.searchParams.delete("r96Invite");
    history.replaceState(history.state, "", url.href);
  }

  async function call(action, payload = {}) {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action,
        developerSessionToken,
        ...payload
      })
    });

    let body = {};
    try {
      body = await response.json();
    } catch (_) {}

    if (!response.ok || body?.ok !== true) {
      const error = String(body?.error || "REQUEST_FAILED");
      throw new Error(error);
    }

    return body.data;
  }

  async function refreshStatus() {
    try {
      const data = await call("status");
      send("status", { data });
    } catch (_) {
      send("status", {
        data: {
          signedIn: false,
          roleKey: "visitor",
          canInvite: false,
          isDeveloper: false
        }
      });
    }
  }

  function sendInviteIfPresent() {
    const token = inviteToken();
    if (token) send("invite.token", { token });
  }

  async function handleAction(data) {
    const action = String(data.action || "");

    try {
      if (action === "invite.create") {
        const result = await call("invite.create");
        send("invite.created", { data: result });
        return;
      }

      if (action === "invite.verify") {
        const result = await call("invite.verify", {
          token: data.token,
          code: data.code
        });
        send("invite.verified", { data: result });
        return;
      }

      if (action === "invite.redeem") {
        const result = await call("invite.redeem", {
          token: data.token,
          code: data.code
        });
        cleanInviteUrl();
        send("invite.redeemed", { data: result });
        await refreshStatus();
        return;
      }
    } catch (error) {
      const code = String(error?.message || "REQUEST_FAILED");
      const messages = {
        AUTH_REQUIRED: "Inicia sesión con tu cuenta Nexo Group para continuar.",
        DEVELOPER_INVITE_FORBIDDEN: "Tu cuenta no tiene permiso para invitar desarrolladores.",
        INVITE_INVALID_OR_EXPIRED: "La invitación no es válida, ya fue usada o expiró."
      };
      send("error", { message: messages[code] || "No se pudo completar la operación." });
    }
  }

  function receive(event) {
    const target = frame();
    if (!target || event.source !== target.contentWindow || event.origin !== FRAME_ORIGIN) return;

    const data = event.data;
    if (!data || data.source !== SOURCE_UI || data.protocol !== PROTOCOL) return;

    if (Object.prototype.hasOwnProperty.call(data, "developerSessionToken")) {
      developerSessionToken = String(data.developerSessionToken || "").trim();
    }

    if (data.type === "ready") {
      refreshStatus();
      sendInviteIfPresent();
      return;
    }

    if (data.type === "refresh") {
      refreshStatus();
      return;
    }

    if (data.type === "action") {
      handleAction(data);
    }
  }

  window.addEventListener("message", receive);

  let bootstrapAttempts = 0;
  const bootstrapTimer = setInterval(() => {
    bootstrapAttempts += 1;
    if (frame()?.contentWindow) {
      refreshStatus();
      sendInviteIfPresent();
      clearInterval(bootstrapTimer);
      return;
    }
    if (bootstrapAttempts >= 20) clearInterval(bootstrapTimer);
  }, 500);
})();
