(() => {
  "use strict";

  if (window.__r96GamesUi) return;
  window.__r96GamesUi = true;

  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SOURCE_BRIDGE = "r96-games-bridge";
  const SOURCE_UI = "r96-games-ui";
  const PROTOCOL = 1;

  const carousel = document.querySelector("#games .r96-carousel");
  const titleCopy = document.querySelector("#games .r96-title-row > .r96-copy");
  const gamesStat = document.querySelector(".r96-stats span:first-child strong");

  if (!carousel) return;

  let emptyNode = null;

  function lang() {
    return String(document.documentElement.lang || "es")
      .trim()
      .toLowerCase()
      .startsWith("en")
      ? "en"
      : "es";
  }

  function t(es, en) {
    return lang() === "en" ? en : es;
  }

  function ensureStyle() {
    if (document.getElementById("r96-games-ui-style")) return;

    const style = document.createElement("style");
    style.id = "r96-games-ui-style";
    style.textContent = `
      .r96-games-empty{
        margin:0;
        padding:18px 4px 4px;
        color:var(--r96-muted);
        font-size:.86rem;
        font-weight:750;
      }
      .r96-game-thumb{
        background:linear-gradient(140deg,#071426,#101932);
      }
      .r96-game-thumb.r96-has-preview{
        background-position:center;
        background-size:cover;
        background-repeat:no-repeat;
      }
      .r96-game-thumb.r96-has-preview::before,
      .r96-game-thumb.r96-has-preview::after{
        opacity:.18;
      }
      .r96-game-tags{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        min-height:26px;
      }
      .r96-game-tag{
        display:inline-flex;
        align-items:center;
        min-height:26px;
        padding:0 9px;
        border:1px solid color-mix(in srgb,var(--r96-accent) 35%,var(--r96-line));
        border-radius:999px;
        background:color-mix(in srgb,var(--r96-accent) 8%,var(--r96-panel));
        color:var(--r96-accent);
        font-size:.68rem;
        font-weight:850;
        white-space:nowrap;
      }
      .r96-game-desc{
        display:-webkit-box;
        overflow:hidden;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        line-clamp:2;
        min-height:2.9em;
      }
      .r96-game-meta{
        display:grid;
        gap:7px;
      }
      .r96-game-meta span{
        display:block;
      }
      .r96-card-actions .r96-primary[data-r96-game-open]{
        opacity:1;
      }
      .r96-card-actions .r96-primary[aria-disabled="true"]{
        opacity:.72;
        cursor:default;
      }
    `;

    document.head.appendChild(style);
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function safeUrl(value) {
    const raw = clean(value);
    if (!raw) return "";

    try {
      const url = new URL(raw);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return url.href;
      }
    } catch (_) {}

    return "";
  }

  function stageLabel(game) {
    const explicit = clean(game.stageLabel);
    if (explicit) return explicit;

    const key = clean(game.stageKey).toLowerCase();
    const labels = {
      "build-preview": "Build preview",
      "prototype": "Prototype",
      "future-release": "Future release",
      "planned": "Planned",
      "concept": "Concept"
    };

    return labels[key] || t("En desarrollo", "In development");
  }

  function formatDate(value) {
    const raw = clean(value);
    if (!raw) return "";

    const date = new Date(raw);
    if (!Number.isFinite(date.getTime())) return "";

    try {
      return new Intl.DateTimeFormat(
        lang() === "en" ? "en-US" : "es",
        {
          year:"numeric",
          month:"short",
          day:"numeric"
        }
      ).format(date);
    } catch (_) {
      return date.toISOString().slice(0, 10);
    }
  }

  function setEmpty(message) {
    carousel.replaceChildren();
    carousel.hidden = true;

    if (!emptyNode) {
      emptyNode = document.createElement("p");
      emptyNode.className = "r96-games-empty";
      carousel.parentElement?.appendChild(emptyNode);
    }

    emptyNode.hidden = false;
    emptyNode.textContent = message;
  }

  function clearEmpty() {
    if (emptyNode) emptyNode.hidden = true;
    carousel.hidden = false;
  }

  function tagNodes(tags) {
    const wrap = document.createElement("div");
    wrap.className = "r96-game-tags";

    const safeTags = Array.isArray(tags)
      ? tags.map(clean).filter(Boolean)
      : [];

    const visible = safeTags.slice(0, 4);

    for (const tag of visible) {
      const pill = document.createElement("span");
      pill.className = "r96-game-tag";
      pill.textContent = tag;
      wrap.appendChild(pill);
    }

    if (safeTags.length > visible.length) {
      const more = document.createElement("span");
      more.className = "r96-game-tag";
      more.textContent = "+" + (safeTags.length - visible.length);
      more.title = safeTags.slice(visible.length).join(", ");
      wrap.appendChild(more);
    }

    return wrap;
  }

  function metaRow(game) {
    const meta = document.createElement("div");
    meta.className = "r96-meta r96-game-meta";

    const genre = clean(game.genre);
    const version = clean(game.currentVersion);
    const updated = formatDate(game.versionUpdatedAt);

    if (genre) {
      const row = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = t("Género: ", "Genre: ");
      row.append(strong, document.createTextNode(genre));
      meta.appendChild(row);
    }

    if (version) {
      const row = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = t("Versión: ", "Version: ");
      row.append(strong, document.createTextNode(version));
      meta.appendChild(row);
    }

    if (updated) {
      const row = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = t("Actualizado: ", "Updated: ");
      row.append(strong, document.createTextNode(updated));
      meta.appendChild(row);
    }

    return meta;
  }

  function gameCard(game, index) {
    const article = document.createElement("article");
    article.className = "r96-card";
    article.dataset.r96GameId = clean(game.id);

    const thumb = document.createElement("div");
    thumb.className = "r96-thumb r96-game-thumb";

    const preview = safeUrl(game.previewImage);
    if (preview) {
      thumb.classList.add("r96-has-preview");
      thumb.style.backgroundImage =
        "linear-gradient(rgba(4,8,18,.15),rgba(4,8,18,.32)),url(" +
        JSON.stringify(preview) +
        ")";
    }

    const code = document.createElement("span");
    code.className = "r96-thumb-code";
    code.textContent = String(index + 1).padStart(2, "0");

    const stage = document.createElement("span");
    stage.className = "r96-thumb-label";
    stage.textContent = stageLabel(game);

    thumb.append(code, stage);

    const body = document.createElement("div");
    body.className = "r96-card-body";

    const tags = tagNodes(game.tags);

    const title = document.createElement("h3");
    title.className = "r96-h3";
    title.textContent = clean(game.title);

    const desc = document.createElement("p");
    desc.className = "r96-desc r96-game-desc";
    desc.textContent =
      clean(game.description) ||
      t("Sin descripción todavía.", "No description yet.");

    const meta = metaRow(game);

    const actions = document.createElement("div");
    actions.className = "r96-card-actions";

    const open = document.createElement("button");
    open.className = "r96-primary";
    open.type = "button";
    open.dataset.r96GameOpen = clean(game.id);
    open.textContent = t("Ver juego", "View game");
    open.setAttribute("aria-disabled", "true");
    open.title = t(
      "La ficha detallada se habilita en la siguiente etapa.",
      "The detailed game page is enabled in the next stage."
    );

    actions.appendChild(open);
    body.append(tags, title, desc, meta, actions);
    article.append(thumb, body);

    return article;
  }

  function renderCatalog(payload) {
    ensureStyle();

    const games = Array.isArray(payload?.games)
      ? payload.games.filter((game) => game && clean(game.id) && clean(game.title))
      : [];

    if (gamesStat) gamesStat.textContent = String(games.length);

    if (titleCopy) {
      titleCopy.textContent = t(
        "Aquí aparecen únicamente los juegos publicados en Rising Games.",
        "Only published Rising Games titles appear here."
      );
    }

    if (!games.length) {
      setEmpty(t(
        "Aún no hay juegos publicados.",
        "No games have been published yet."
      ));
      return;
    }

    clearEmpty();
    carousel.replaceChildren();

    games.forEach((game, index) => {
      carousel.appendChild(gameCard(game, index));
    });

    carousel.setAttribute(
      "aria-label",
      t("Juegos publicados", "Published games")
    );
  }

  function postReady() {
    if (window.parent === window) return;

    window.parent.postMessage({
      source: SOURCE_UI,
      protocol: PROTOCOL,
      type: "ready"
    }, HOST_ORIGIN);
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== HOST_ORIGIN || event.source !== window.parent) return;

    const message = event.data;
    if (
      !message ||
      message.source !== SOURCE_BRIDGE ||
      message.protocol !== PROTOCOL
    ) {
      return;
    }

    if (message.type === "catalog") {
      renderCatalog(message.data || {});
      return;
    }

    if (message.type === "catalog-error") {
      ensureStyle();
      if (gamesStat) gamesStat.textContent = "0";
      setEmpty(t(
        "No se pudo cargar el catálogo.",
        "The catalog could not be loaded."
      ));
    }
  });

  ensureStyle();

  // Remove the three static sample cards immediately.
  carousel.replaceChildren();
  carousel.hidden = true;

  if (titleCopy) {
    titleCopy.textContent = t(
      "Cargando juegos publicados…",
      "Loading published games…"
    );
  }

  postReady();

  let retries = 0;
  const retry = setInterval(() => {
    retries += 1;
    postReady();

    if (retries >= 8) {
      clearInterval(retry);
    }
  }, 1000);
})();
