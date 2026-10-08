(() => {
  "use strict";

  const PATH = "/my-site-1/blank-9";
  if (
    location.pathname.replace(/\/+$/, "") !== PATH ||
    window.__r96InviteBridgeV5
  ) {
    return;
  }

  window.__r96InviteBridgeV5 = true;

  const FRAME_ORIGIN = "https://dtokurisu-png.github.io";
  const SOURCE_BRIDGE = "r96-access-bridge";
  const SOURCE_UI = "r96-access-ui";
  const PROTOCOL = 1;
  const STORAGE_KEY = "r96-invite-pending-v5";
  const REQUEST_TIMEOUT = 15000;
  const ACCESS_WAIT_TIMEOUT = 15000;

  const prefixMatch = location.pathname.match(/^\/([^/]+)\/blank-9\/?$/);
  const API_BASE = prefixMatch
    ? "/" + prefixMatch[1] + "/_functions/"
    : "/_functions/";

  let capability = "";
  let queryCapabilitySeen = "";
  let lastAccessSignature = "";
  let pending = readPending();
  let claimInFlight = false;
  let verifyInFlight = false;
  let createInFlight = false;
  let accessWaitStarted = 0;
  let accessWaitFailed = false;

  function frame() {
    return document.getElementById("nexo-rising-app");
  }

  function post(type, data = {}) {
    const target = frame();
    if (!target?.contentWindow) return;

    target.contentWindow.postMessage(
      {
        source: SOURCE_BRIDGE,
        protocol: PROTOCOL,
        type,
        data
      },
      FRAME_ORIGIN
    );
  }

  function cleanPending(value) {
    if (!value || typeof value !== "object") return null;

    const inviteToken = String(value.inviteToken || "").trim();
    if (!/^[A-Za-z0-9_-]{40,80}$/.test(inviteToken)) return null;

    return {
      inviteToken,
      code: String(value.code || "").trim(),
      verified: value.verified === true,
      expiresAt: String(value.expiresAt || ""),
      refreshes: Number.isSafeInteger(value.refreshes) ? value.refreshes : 0
    };
  }

  function readPending() {
    try {
      return cleanPending(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null"));
    } catch (_) {
      return null;
    }
  }

  function writePending(value) {
    pending = cleanPending(value);
    try {
      if (pending) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }

  function captureInviteFromUrl() {
    const url = new URL(location.href);
    const token = String(url.searchParams.get("r96invite") || "").trim();

    if (!token) return;

    if (/^[A-Za-z0-9_-]{40,80}$/.test(token)) {
      writePending({
        inviteToken: token,
        code: "",
        verified: false,
        expiresAt: "",
        refreshes: 0
      });
    } else {
      writePending(null);
    }

    url.searchParams.delete("r96invite");
    history.replaceState(history.state, "", url.href);
  }

  function readAccess() {
    const query = new URLSearchParams(location.search);
    const rawRole = String(query.get("r96role") || "").trim().toLowerCase();
    const roleKey = ["member", "developer", "wonder"].includes(rawRole)
      ? rawRole
      : "visitor";
    const queryCapability = String(query.get("r96cap") || "").trim();

    if (roleKey === "visitor") {
      capability = "";
      queryCapabilitySeen = "";
    } else if (
      queryCapability &&
      queryCapability !== queryCapabilitySeen
    ) {
      queryCapabilitySeen = queryCapability;
      capability = queryCapability;
    }

    if (accessOverride) {
      return { ...accessOverride };
    }

    return {
      signedIn: roleKey !== "visitor",
      roleKey,
      canInviteDeveloper: roleKey === "wonder",
      isDeveloper: roleKey === "wonder" || roleKey === "developer",
      isWonder: roleKey === "wonder"
    };
  }

  function sendAccess(force = false) {
    const access = readAccess();
    const signature = JSON.stringify(access);

    if (force || signature !== lastAccessSignature) {
      lastAccessSignature = signature;
      post("access", access);
    }

    return access;
  }

  async function requestJson(endpoint, body) {
    const controller = new AbortController();
    const deadline = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(API_BASE + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(body),
        signal: controller.signal
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch (_) {}

      if (!response.ok || !payload?.ok) {
        const error = new Error(String(payload?.error || "R96_ACCESS_ACTION_FAILED"));
        error.code = String(payload?.error || "R96_ACCESS_ACTION_FAILED");
        throw error;
      }

      return payload;
    } finally {
      clearTimeout(deadline);
    }
  }

  function clearClaimState() {
    claimInFlight = false;
    accessWaitStarted = 0;
    accessWaitFailed = false;
  }

  function resetInvite() {
    if (!pending?.inviteToken) {
      writePending(null);
      return;
    }

    writePending({
      inviteToken: pending.inviteToken,
      code: "",
      verified: false,
      expiresAt: pending.expiresAt,
      refreshes: 0
    });

    clearClaimState();
    post("invite-entry");
  }

  function refreshCapabilityOnce() {
    if (!pending) return false;

    if (pending.refreshes >= 1) {
      accessWaitFailed = true;
      post("invite-claim-error", { error: "ACCESS_REFRESH_FAILED" });
      return false;
    }

    writePending({
      ...pending,
      refreshes: pending.refreshes + 1
    });

    const url = new URL(location.href);
    url.searchParams.delete("r96cap");
    url.searchParams.delete("r96role");
    history.replaceState(history.state, "", url.href);
    location.reload();
    return true;
  }

  async function claimInvite() {
    if (
      claimInFlight ||
      !pending?.verified ||
      !pending.inviteToken ||
      !pending.code
    ) {
      return;
    }

    const access = sendAccess();

    if (!access.signedIn) {
      post("invite-verified");
      return;
    }

    if (!capability) {
      if (!accessWaitStarted) {
        accessWaitStarted = Date.now();
        accessWaitFailed = false;
        post("invite-claiming");
      } else if (
        !accessWaitFailed &&
        Date.now() - accessWaitStarted >= ACCESS_WAIT_TIMEOUT
      ) {
        accessWaitFailed = true;
        post("invite-claim-error", { error: "ACCESS_REFRESH_FAILED" });
      }
      return;
    }

    accessWaitStarted = 0;
    accessWaitFailed = false;
    claimInFlight = true;
    post("invite-claiming");

    try {
      const response = await requestJson("r96AccessAction", {
        action: "claimInvite",
        capability,
        inviteToken: pending.inviteToken,
        code: pending.code
      });

      const data = response.data || {};
      capability = String(data.nextActionCapability || "");
      queryCapabilitySeen = capability || queryCapabilitySeen;

      writePending(null);
      clearClaimState();

      if (data.access) {
        accessOverride = {
          signedIn: data.access.signedIn === true,
          roleKey: String(data.access.roleKey || "developer"),
          canInviteDeveloper: data.access.canInviteDeveloper === true,
          isDeveloper: data.access.isDeveloper === true,
          isWonder: data.access.isWonder === true
        };
        lastAccessSignature = JSON.stringify(accessOverride);
        post("access", accessOverride);
      }

      post("invite-claimed", data);
    } catch (error) {
      claimInFlight = false;
      const code = String(error?.code || "R96_ACCESS_ACTION_FAILED");

      if (["CAPABILITY_INVALID", "CAPABILITY_EXPIRED"].includes(code)) {
        refreshCapabilityOnce();
        return;
      }

      if (code === "INVITE_CODE_INVALID") {
        writePending({
          ...pending,
          code: "",
          verified: false,
          refreshes: 0
        });
      } else if (
        ["INVITE_NOT_FOUND", "INVITE_ALREADY_USED", "INVITE_EXPIRED"].includes(code)
      ) {
        writePending(null);
      }

      post("invite-claim-error", { error: code });
    }
  }

  async function verifyInvite(code) {
    if (verifyInFlight) return;

    if (!pending?.inviteToken) {
      post("invite-verify-error", { error: "INVITE_NOT_FOUND" });
      return;
    }

    verifyInFlight = true;

    try {
      const response = await requestJson("r96InviteEntry", {
        action: "verify",
        inviteToken: pending.inviteToken,
        code
      });

      const data = response.data || {};

      writePending({
        inviteToken: pending.inviteToken,
        code: String(code || "").trim(),
        verified: true,
        expiresAt: String(data.expiresAt || ""),
        refreshes: 0
      });

      post("invite-verified", data);
      claimInvite();
    } catch (error) {
      const codeValue = String(error?.code || "INVITE_VERIFY_FAILED");
      post("invite-verify-error", { error: codeValue });
    } finally {
      verifyInFlight = false;
    }
  }

  async function createInvite(requestId) {
    if (createInFlight) return;

    const access = sendAccess();
    if (!access.signedIn || access.isWonder !== true || !capability) {
      post("invite-result", {
        ok: false,
        error: "ACTION_CAPABILITY_MISSING"
      });
      return;
    }

    createInFlight = true;

    try {
      const response = await requestJson("r96AccessAction", {
        action: "createInvite",
        capability,
        requestId
      });

      const data = response.data || {};
      capability = String(data.nextActionCapability || "");
      queryCapabilitySeen = capability || queryCapabilitySeen;

      post("invite-result", {
        ok: true,
        ...data
      });
    } catch (error) {
      post("invite-result", {
        ok: false,
        error: String(error?.code || "INVITE_CREATE_FAILED")
      });
    } finally {
      createInFlight = false;
    }
  }

  function resumeInvite() {
    if (!pending?.inviteToken) return;

    if (!pending.verified || !pending.code) {
      post("invite-entry");
      return;
    }

    const access = sendAccess();

    if (access.signedIn) {
      claimInvite();
    } else {
      post("invite-verified");
    }
  }

  function receive(event) {
    const target = frame();
    if (
      !target?.contentWindow ||
      event.source !== target.contentWindow ||
      event.origin !== FRAME_ORIGIN
    ) {
      return;
    }

    const message = event.data;
    if (
      !message ||
      message.source !== SOURCE_UI ||
      message.protocol !== PROTOCOL
    ) {
      return;
    }

    if (message.type === "ready") {
      sendAccess(true);
      resumeInvite();
      return;
    }

    if (message.type === "create-invite") {
      createInvite(String(message.requestId || ""));
      return;
    }

    if (message.type === "verify-invite") {
      verifyInvite(String(message.code || ""));
      return;
    }

    if (message.type === "retry-claim") {
      accessWaitStarted = 0;
      accessWaitFailed = false;
      claimInvite();
      return;
    }

    if (message.type === "reset-invite") {
      resetInvite();
    }
  }

  captureInviteFromUrl();
  window.addEventListener("message", receive);

  const poll = setInterval(() => {
    if (
      location.pathname.replace(/\/+$/, "") !== PATH
    ) {
      clearInterval(poll);
      window.removeEventListener("message", receive);
      window.__r96InviteBridgeV5 = false;
      return;
    }

    const before = lastAccessSignature;
    const access = sendAccess();

    if (
      pending?.verified &&
      access.signedIn &&
      (before !== lastAccessSignature || capability)
    ) {
      claimInvite();
    }
  }, 500);
})();
