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

  if (location.pathname.replace(/\/+$/, "") !== PATH) return;

  let frameWindow = null;
  let catalogPromise = null;
  let cachedCatalog = null;

  function post(type, data = {}) {
    if (!frameWindow) return;

    frameWindow.postMessage({
      source: SOURCE_BRIDGE,
      protocol: PROTOCOL,
      type,
      data
    }, FRAME_ORIGIN);
  }

  async function loadCatalog() {
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

  async function sendCatalog() {
    try {
      const data = await loadCatalog();
      post("catalog", data);
    } catch (_) {
      post("catalog-error", {
        error: "GAMES_CATALOG_FAILED"
      });
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
    }
  });
})();
