(() => {
  "use strict";

  const PATH = "/my-site-1/blank-9";
  const FRAME_ORIGIN = "https://dtokurisu-png.github.io";
  const AUTH_ENDPOINT = "/my-site-1/_functions/nexoRisingUi";
  const DEVELOPER_ENDPOINT = "/my-site-1/_functions/risingDeveloperAccess";
  const AUTH_SOURCE = "r96-wix-auth";
  const DEVELOPER_SOURCE = "r96-developer-host";
  const PROTOCOL = 1;

  if (
    location.pathname.replace(/\/+$/, "") !== PATH ||
    window.__nexoRisingHost
  ) {
    return;
  }

  const entry = new URL(location.href);
  if (entry.searchParams.get("rc") === "test-site") {
    ["rc", "nxb", "nxa", "nxav"].forEach((key) =>
      entry.searchParams.delete(key)
    );
    location.replace(entry.href);
    return;
  }

  window.__nexoRisingHost = true;

  const frame = document.createElement("iframe");
  frame.id = "nexo-rising-app";
  frame.title = "Rising Games · Nexo Group";
  frame.src = FRAME_ORIGIN + "/risin96ames/?v=6.1.0";
  frame.referrerPolicy = "no-referrer";
  frame.style.cssText =
    "position:fixed;inset:0;width:100%;height:100dvh;border:0;z-index:100;background:#070912";

  let requestId = 0;
  let sequence = 0;
  let commandSequence = 0;
  let member = null;
  let status = "connecting";
  let consumed = "";
  let exchanging = false;
  let risingSessionToken = "";
  const started = Date.now();

  function positionFrame() {
    const banner = document.getElementById("WIX_ADS");
    const rect = banner?.getBoundingClientRect();
    const offset =
      rect && rect.width > 0 && rect.height > 0
        ? Math.max(0, Math.ceil(rect.bottom))
        : 0;
    const top = offset + "px";

    if (frame.style.top !== top) {
      frame.style.top = top;
      frame.style.height = "calc(100dvh - " + top + ")";
    }
  }

  function sendAuth() {
    if (!requestId || !frame.contentWindow) return;

    frame.contentWindow.postMessage(
      {
        source: AUTH_SOURCE,
        protocol: PROTOCOL,
        requestId,
        sequence: ++sequence,
        status,
        member
      },
      FRAME_ORIGIN
    );
  }

  function sendDeveloper(type, payload = {}) {
    if (!frame.contentWindow) return;
    frame.contentWindow.postMessage(
      {
        source: DEVELOPER_SOURCE,
        protocol: PROTOCOL,
        type,
        ...payload
      },
      FRAME_ORIGIN
    );
  }

  function samePageAction(kind, value) {
    const url = new URL(location.href);
    [
      "nxb",
      "nxa",
      "nxav",
      "nexoAuth",
      "nexoAction",
      "nexoReturn",
      "nexoCommandId"
    ].forEach((key) => url.searchParams.delete(key));
    url.searchParams.set(kind, value);
    url.searchParams.set(
      "nexoCommandId",
      Date.now().toString(36) + "-" + (++commandSequence).toString(36)
    );
    history.replaceState(history.state, "", url.href);
  }

  function clearResultState() {
    const url = new URL(location.href);
    ["nxa", "nxav", "nxb"].forEach((key) => url.searchParams.delete(key));
    history.replaceState(history.state, "", url.href);
  }

  function inviteToken() {
    return String(new URL(location.href).searchParams.get("r96Invite") || "").trim();
  }

  function cleanInviteUrl() {
    const url = new URL(location.href);
    if (!url.searchParams.has("r96Invite")) return;
    url.searchParams.delete("r96Invite");
    history.replaceState(history.state, "", url.href);
  }

  function openProfile() {
    const url = new URL("/my-site-1/blank-8", location.origin);
    url.searchParams.set("nxoProfile", "settings");
    location.assign(url.href);
  }

  async function postJson(endpoint, payload, signal) {
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(payload),
      signal
    });

    let data = {};
    try {
      data = await response.json();
    } catch (_) {}

    if (!response.ok || data?.ok !== true) {
      throw new Error(String(data?.error || "REQUEST_FAILED"));
    }
    return data;
  }

  async function revokeRisingSession() {
    const token = risingSessionToken;
    risingSessionToken = "";
    if (!token) return;
    try {
      await postJson(AUTH_ENDPOINT, {
        action: "session.revoke",
        sessionToken: token
      });
    } catch (_) {}
  }

  async function developerCall(action, payload = {}) {
    const body = {
      action,
      ...payload
    };
    if (action !== "invite.verify") {
      body.sessionToken = risingSessionToken;
    }
    const response = await postJson(DEVELOPER_ENDPOINT, body);
    return response.data;
  }

  async function refreshDeveloperStatus() {
    if (!risingSessionToken) {
      sendDeveloper("status", {
        data: {
          signedIn: false,
          roleKey: "visitor",
          canInvite: false,
          isDeveloper: false
        }
      });
      return;
    }

    try {
      const data = await developerCall("status");
      sendDeveloper("status", { data });
    } catch (_) {
      sendDeveloper("status", {
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
    if (token) sendDeveloper("invite.token", { token });
  }

  async function handleDeveloperAction(data) {
    const action = String(data.action || "");
    try {
      if (action === "invite.create") {
        const result = await developerCall("invite.create");
        sendDeveloper("invite.created", { data: result });
        return;
      }

      if (action === "invite.verify") {
        const result = await developerCall("invite.verify", {
          token: data.token,
          code: data.code
        });
        sendDeveloper("invite.verified", { data: result });
        return;
      }

      if (action === "invite.redeem") {
        const result = await developerCall("invite.redeem", {
          token: data.token,
          code: data.code
        });
        cleanInviteUrl();
        sendDeveloper("invite.redeemed", { data: result });
        await refreshDeveloperStatus();
      }
    } catch (error) {
      const code = String(error?.message || "REQUEST_FAILED");
      const messages = {
        AUTH_REQUIRED: "Inicia sesión con tu cuenta Nexo Group para continuar.",
        DEVELOPER_INVITE_FORBIDDEN: "Tu cuenta no tiene permiso para invitar desarrolladores.",
        INVITE_INVALID_OR_EXPIRED: "La invitación no es válida, ya fue usada o expiró."
      };
      sendDeveloper("error", {
        message: messages[code] || "No se pudo completar la operación."
      });
    }
  }

  async function receive(event) {
    if (event.source !== frame.contentWindow || event.origin !== FRAME_ORIGIN) return;

    const data = event.data;
    if (!data || data.protocol !== PROTOCOL) return;

    if (data.source === "r96-developer-ui") {
      if (data.type === "ready") {
        await refreshDeveloperStatus();
        sendInviteIfPresent();
        return;
      }
      if (data.type === "refresh") {
        await refreshDeveloperStatus();
        return;
      }
      if (data.type === "action") {
        await handleDeveloperAction(data);
      }
      return;
    }

    if (
      data.source !== "r96-auth" ||
      !Number.isSafeInteger(data.requestId)
    ) {
      return;
    }

    requestId = data.requestId;

    if (data.type === "r96-account-action") {
      if (data.action === "login") {
        samePageAction("nexoAuth", "login");
        return;
      }
      if (data.action === "switch") {
        await revokeRisingSession();
        samePageAction("nexoAction", "switch");
        return;
      }
      if (data.action === "logout") {
        await revokeRisingSession();
        await refreshDeveloperStatus();
        samePageAction("nexoAction", "logout");
        return;
      }
      if (data.action === "profile") {
        openProfile();
        return;
      }
    }

    if (data.type === "r96-account-ready") sendAuth();
  }

  async function poll() {
    if (location.pathname.replace(/\/+$/, "") !== PATH) {
      cleanup();
      return;
    }

    positionFrame();

    const query = new URLSearchParams(location.search);
    const state = query.get("nxa");

    if (state === "SIGNED_OUT") {
      status = "signedOut";
      member = null;
      risingSessionToken = "";
      clearResultState();
    } else if (state === "FAILED") {
      status = "error";
      member = null;
      risingSessionToken = "";
      clearResultState();
    } else if (state === "LOGIN") {
      status = "signingIn";
      member = null;
    } else if (
      state === "READY" &&
      query.get("nxb") &&
      query.get("nxb") !== consumed &&
      !exchanging
    ) {
      const token = query.get("nxb");
      consumed = token;
      exchanging = true;

      const clean = new URL(location.href);
      clean.searchParams.delete("nxb");
      history.replaceState(history.state, "", clean.href);

      try {
        const controller = new AbortController();
        const deadline = setTimeout(() => controller.abort(), 15000);

        try {
          const data = await postJson(
            AUTH_ENDPOINT,
            {
              action: "exchange",
              bootToken: token
            },
            controller.signal
          );

          if (!data.member?.id || !data.sessionToken) {
            throw new Error("AUTH_REQUIRED");
          }

          member = data.member;
          risingSessionToken = data.sessionToken;
          status = "signedIn";
          await refreshDeveloperStatus();
        } finally {
          clearTimeout(deadline);
        }
      } catch (_) {
        status = "error";
        member = null;
        risingSessionToken = "";
      } finally {
        clearResultState();
        exchanging = false;
      }
    } else if (
      state === "CHECKING_MEMBER" ||
      state === "CREATING_SESSION"
    ) {
      status = "connecting";
      member = null;
    } else if (status === "connecting" && Date.now() - started > 25000) {
      status = "error";
      member = null;
    }

    sendAuth();
  }

  function cleanup() {
    clearInterval(timer);
    window.removeEventListener("message", receive);
    window.removeEventListener("resize", positionFrame);
    frame.remove();
    window.__nexoRisingHost = false;
  }

  window.addEventListener("message", receive);
  window.addEventListener("pagehide", cleanup, { once: true });
  window.addEventListener("resize", positionFrame);

  positionFrame();
  document.body.appendChild(frame);

  const timer = setInterval(poll, 500);
  poll();
})();
