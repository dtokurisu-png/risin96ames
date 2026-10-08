(() => {
  "use strict";

  if (window.__r96GamesHost) return;
  window.__r96GamesHost = true;

  const PATH = "/my-site-1/blank-9";
  const SITE_BASE = "/my-site-1";
  const FRAME_ORIGIN = "https://dtokurisu-png.github.io";
  const SOURCE_BRIDGE = "r96-games-bridge";
  const SOURCE_UI = "r96-games-ui";
  const PROTOCOL = 1;
  const GAME_CAP_REQUEST_EVENT = "r96:game-capability-request";
  const GAME_CAP_RESPONSE_EVENT = "r96:game-capability-response";

  if (location.pathname.replace(/\/+$/, "") !== PATH) return;

  let frameWindow = null;
  let catalogPromise = null;
  let cachedCatalog = null;
  let gameCapability = "";
  let gameCapabilityExpiresAt = "";
  let gameCapabilityPromise = null;


  function tokenValid() {
    if (!/^[A-Za-z0-9_-]{40,80}$/.test(gameCapability)) return false;

    const expiresAt = new Date(gameCapabilityExpiresAt || 0);
    return Number.isFinite(expiresAt.getTime()) &&
      expiresAt.getTime() > Date.now() + 5000;
  }

  function requestId() {
    if (globalThis.crypto?.randomUUID) {
      return crypto.randomUUID().replace(/-/g, "");
    }

    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(
      bytes,
      value => value.toString(16).padStart(2, "0")
    ).join("");
  }

  function clearGameCapability() {
    gameCapability = "";
    gameCapabilityExpiresAt = "";
  }

  function acquireGameCapability(force = false) {
    if (!force && tokenValid()) {
      return Promise.resolve(gameCapability);
    }

    if (gameCapabilityPromise) return gameCapabilityPromise;

    gameCapabilityPromise = new Promise((resolve, reject) => {
      const id = requestId();

      const timeout = setTimeout(() => {
        window.removeEventListener(
          GAME_CAP_RESPONSE_EVENT,
          onResponse
        );
        gameCapabilityPromise = null;
        reject(new Error("GAME_CAPABILITY_TIMEOUT"));
      }, 10000);

      function onResponse(event) {
        const detail = event?.detail || {};
        if (String(detail.requestId || "") !== id) return;

        clearTimeout(timeout);
        window.removeEventListener(
          GAME_CAP_RESPONSE_EVENT,
          onResponse
        );
        gameCapabilityPromise = null;

        if (detail.ok !== true) {
          clearGameCapability();
          reject(
            new Error(
              String(
                detail.error ||
                "GAME_CAPABILITY_CREATE_FAILED"
              )
            )
          );
          return;
        }

        const token = String(detail.capability || "");
        const expiresAt = String(detail.expiresAt || "");

        if (!/^[A-Za-z0-9_-]{40,80}$/.test(token)) {
          clearGameCapability();
          reject(new Error("GAME_CAPABILITY_INVALID"));
          return;
        }

        gameCapability = token;
        gameCapabilityExpiresAt = expiresAt;
        resolve(gameCapability);
      }

      window.addEventListener(
        GAME_CAP_RESPONSE_EVENT,
        onResponse
      );

      window.dispatchEvent(
        new CustomEvent(GAME_CAP_REQUEST_EVENT, {
          detail:{ requestId:id }
        })
      );
    });

    return gameCapabilityPromise;
  }

  function post(type, data = {}, requestId = "") {
    if (!frameWindow) return;

    frameWindow.postMessage({
      source: SOURCE_BRIDGE,
      protocol: PROTOCOL,
      type,
      requestId,
      data
    }, FRAME_ORIGIN);
  }

  async function loadCatalog(force = false) {
    if (force) cachedCatalog = null;
    if (cachedCatalog) return cachedCatalog;
    if (catalogPromise) return catalogPromise;

    catalogPromise = (async () => {
      const response = await fetch(
        SITE_BASE + "/_functions/r96GamesCatalog",
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store"
        }
      );

      const payload = await response.json().catch(() => null);

      if (
        !response.ok ||
        !payload ||
        payload.ok !== true ||
        !payload.data
      ) {
        throw new Error("GAMES_CATALOG_FAILED");
      }

      cachedCatalog = payload.data;
      return cachedCatalog;
    })();

    try {
      return await catalogPromise;
    } finally {
      catalogPromise = null;
    }
  }

  async function sendCatalog(force = false) {
    try {
      const data = await loadCatalog(force);
      post("catalog", data);
    } catch (_) {
      post("catalog-error", {
        error: "GAMES_CATALOG_FAILED"
      });
    }
  }

  async function callStudioAction(action, input, forceCapability = false) {
    const capability = await acquireGameCapability(forceCapability);

    const response = await fetch(
      SITE_BASE + "/_functions/r96GamesAction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          action,
          capability,
          input: input || {}
        })
      }
    );

    const payload = await response.json().catch(() => null);

    if (
      payload?.error === "GAME_CAPABILITY_INVALID" ||
      payload?.error === "GAME_CAPABILITY_EXPIRED"
    ) {
      clearGameCapability();
    }

    return payload;
  }

  async function studioAction(message) {
    const requestId = String(message.requestId || "");
    const action = String(message.action || "").trim();
    const input = message.input || {};

    try {
      let payload = await callStudioAction(action, input, false);

      if (
        payload?.ok !== true &&
        (
          payload?.error === "GAME_CAPABILITY_INVALID" ||
          payload?.error === "GAME_CAPABILITY_EXPIRED"
        )
      ) {
        payload = await callStudioAction(action, input, true);
      }

      if (!payload || payload.ok !== true) {
        post(
          "studio-result",
          {
            ok: false,
            error: String(payload?.error || "GAMES_ACTION_FAILED")
          },
          requestId
        );
        return;
      }

      post(
        "studio-result",
        {
          ok: true,
          data: payload.data || {}
        },
        requestId
      );

      if (action === "game.create") {
        await sendCatalog(true);
      }
    } catch (error) {
      post(
        "studio-result",
        {
          ok: false,
          error: String(
            error?.message || "GAMES_ACTION_FAILED"
          )
        },
        requestId
      );
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
      sendCatalog();
      return;
    }

    if (message.type === "studio-action") {
      studioAction(message);
    }
  });
})();
