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
  frame.src = ORIGIN + "/risin96ames/?v=6.0.4";
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

  function samePageAction(kind, value) {
    const url = new URL(location.href);
    ["nxb", "nxa", "nxav", "nexoAuth", "nexoAction", "nexoReturn", "nexoCommandId"].forEach((key) =>
      url.searchParams.delete(key)
    );
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

  function openProfile() {
    const url = new URL("/my-site-1/blank-8", location.origin);
    url.searchParams.set("nxoProfile", "settings");
    location.assign(url.href);
  }

  function receive(event) {
    if (event.source !== frame.contentWindow || event.origin !== ORIGIN) return;

    const data = event.data;
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
        samePageAction("nexoAuth", "login");
        return;
      }
      if (data.action === "switch") {
        samePageAction("nexoAction", "switch");
        return;
      }
      if (data.action === "logout") {
        samePageAction("nexoAction", "logout");
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
      clearResultState();
    } else if (state === "FAILED") {
      status = "error";
      member = null;
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
        if (!response.ok || !data.ok || !data.member?.id) {
          throw new Error("AUTH_REQUIRED");
        }

        member = data.member;
        status = "signedIn";
      } catch (_) {
        status = "error";
        member = null;
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

    send();
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
