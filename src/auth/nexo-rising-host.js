(() => {
  "use strict";

  const PATH = "/my-site-1/blank-9";

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

  const ORIGIN = "https://dtokurisu-png.github.io";
  const frame = document.createElement("iframe");
  frame.id = "nexo-rising-app";
  frame.title = "Rising Games · Nexo Group";
  frame.src = ORIGIN + "/risin96ames/?v=6.0.9";
  frame.referrerPolicy = "no-referrer";
  frame.style.cssText =
    "position:fixed;inset:0;width:100%;height:100dvh;border:0;z-index:100;" +
    "background:var(--nexo-rising-surface,#070912);visibility:hidden";
  // Keep the iframe's initial about:blank document out of the visible frame.
  // load runs after its blocking stylesheet and deferred visual setup.
  frame.addEventListener("load", () => {
    frame.style.visibility = "visible";
  }, { once: true });

  let requestId = 0;
  let sequence = 0;
  let commandSequence = 0;
  let navigating = false;
  let member = null;
  // Authenticated, server-issued Nexo session: never sent to the iframe.
  let sessionToken = "";
  let status = "connecting";
  let consumed = "";
  let exchanging = false;
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

  function send() {
    if (!requestId) return;

    frame.contentWindow.postMessage(
      {
        source: "r96-wix-auth",
        protocol: 1,
        requestId,
        sequence: ++sequence,
        status,
        member
      },
      ORIGIN
    );
  }

  // One first-party bridge for signed-in comments.
  // The session stays inside this host closure, not in DOM, storage or the game iframe.
  window.__r96PostSignedComment = async function(input = {}) {
    if (status !== "signedIn" || !/^[a-f0-9]{64}$/.test(sessionToken)) {
      return { ok: false, error: "AUTH_REQUIRED" };
    }

    try {
      const response = await fetch("/my-site-1/_functions/r96CommunityAction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          action: "comment.create",
          input: {
            gameId: String(input.gameId || ""),
            body: String(input.body || "")
          },
          sessionToken
        })
      });
      const data = await response.json().catch(() => null);
      if (data?.error === "SESSION_EXPIRED" || data?.error === "AUTH_REQUIRED") {
        sessionToken = "";
        status = "signedOut";
        member = null;
        send();
      }
      return {
        ok: response.ok && data?.ok === true,
        data: data?.data || {},
        error: String(data?.error || "FEEDBACK_SAVE_FAILED")
      };
    } catch (error) {
      return {
        ok: false,
        error: String(error?.message || "FEEDBACK_NETWORK_FAILED")
      };
    }
  };

  function navigateAccountAction(kind, value) {
    const url = new URL(location.href);
    ["nxb", "nxa", "nxav", "nexoAuth", "nexoAction", "nexoReturn", "nexoCommandId"].forEach((key) =>
      url.searchParams.delete(key)
    );
    url.searchParams.set(kind, value);
    url.searchParams.set(
      "nexoCommandId",
      Date.now().toString(36) + "-" + (++commandSequence).toString(36)
    );
    // Velo runs outside this DOM context. Browser history mutations do not
    // update wix-location-frontend.query. A document navigation delivers the
    // command through Wix's supported page-entry lifecycle.
    navigating = true;
    location.assign(url.href);
  }

  function clearResultState() {
    const url = new URL(location.href);
    ["nxa", "nxav", "nxb"].forEach((key) => url.searchParams.delete(key));
    history.replaceState(history.state, "", url.href);
  }

  function openProfile() {
    const url = new URL("/my-site-1/blank-8", location.origin);
    url.searchParams.set("nxoProfile", "settings");
    location.assign(url.href);
  }

  function receive(event) {
    if (navigating) return;
    if (event.source !== frame.contentWindow || event.origin !== ORIGIN) return;

    const data = event.data;
    // Display preference only: never cache identity, membership, or auth state.
    if (data?.source === "r96-visual" && data.type === "r96-theme") {
      if (data.theme !== "light" && data.theme !== "dark") return;
      const color = data.theme === "light" ? "#f5fbff" : "#070912";
      document.documentElement.style.setProperty("--nexo-rising-surface", color);
      try { sessionStorage.setItem("nexo-rising-display-theme", data.theme); } catch (_) {}
      return;
    }
    if (
      !data ||
      data.source !== "r96-auth" ||
      data.protocol !== 1 ||
      !Number.isSafeInteger(data.requestId)
    ) {
      return;
    }

    requestId = data.requestId;

    if (data.type === "r96-account-action") {
      if (data.action === "login") {
        navigateAccountAction("nexoAuth", "login");
        return;
      }
      if (data.action === "switch") {
        navigateAccountAction("nexoAction", "switch");
        return;
      }
      if (data.action === "logout") {
        navigateAccountAction("nexoAction", "logout");
        return;
      }
      if (data.action === "profile") {
        openProfile();
        return;
      }
    }

    if (data.type === "r96-account-ready") send();
  }

  async function poll() {
    if (navigating) return;
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
      sessionToken = "";
      clearResultState();
    } else if (state === "FAILED") {
      status = "error";
      member = null;
      sessionToken = "";
      clearResultState();
    } else if (state === "LOGIN") {
      status = "signingIn";
      member = null;
      sessionToken = "";
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
        let response;

        try {
          response = await fetch("/my-site-1/_functions/nexoRisingUi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            body: JSON.stringify({
              action: "exchange",
              bootToken: token
            }),
            signal: controller.signal
          });
        } finally {
          clearTimeout(deadline);
        }

        const data = await response.json();
        if (
          !response.ok || !data.ok || !data.member?.id ||
          !/^[a-f0-9]{64}$/.test(String(data.sessionToken || ""))
        ) {
          throw new Error("AUTH_REQUIRED");
        }

        sessionToken = data.sessionToken;
        member = data.member;
        status = "signedIn";
      } catch (_) {
        status = "error";
        member = null;
        sessionToken = "";
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
      sessionToken = "";
    } else if (status === "connecting" && Date.now() - started > 25000) {
      status = "error";
      member = null;
      sessionToken = "";
    }

    send();
  }

  function suspend() {
    clearInterval(timer);
    // Never remove the visible frame on pagehide. The browser is still
    // painting this document while preparing the next one.
  }

  function restore(event) {
    // A bfcache snapshot must not become the authority for a member session.
    // Re-enter the existing Wix page lifecycle when returning with Back.
    if (event.persisted) location.reload();
  }

  function cleanup() {
    clearInterval(timer);
    window.removeEventListener("message", receive);
    window.removeEventListener("resize", positionFrame);
    window.removeEventListener("pagehide", suspend);
    window.removeEventListener("pageshow", restore);
    document.documentElement.removeAttribute("data-nexo-rising-surface");
    document.documentElement.style.removeProperty("--nexo-rising-surface");
    frame.remove();
    sessionToken = "";
    delete window.__r96PostSignedComment;
    window.__nexoRisingHost = false;
  }

  window.addEventListener("message", receive);
  window.addEventListener("pagehide", suspend);
  window.addEventListener("pageshow", restore);
  window.addEventListener("resize", positionFrame);

  positionFrame();
  document.body.appendChild(frame);

  const timer = setInterval(poll, 500);
  poll();
})();


