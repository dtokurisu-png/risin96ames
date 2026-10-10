(() => {
  "use strict";

  if (window.__r96DeveloperUi) return;
  window.__r96DeveloperUi = true;

  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SOURCE_BRIDGE = "r96-games-bridge";
  const SOURCE_UI = "r96-games-ui";
  const PROTOCOL = 1;

  const BUTTON_ID = "r96-my-games";
  const MODAL_ID = "r96-developer-space";
  const STYLE_ID = "r96-developer-ui-style";

  const pending = new Map();
  let observer = null;

  function clean(value) {
    return String(value || "").trim();
  }

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

  function accountRole() {
    const account = document.querySelector(".r96-account-visual");
    if (account?.dataset?.r96AuthState !== "signedIn") return "";
    return clean(account?.dataset?.r96AccessRole).toLowerCase();
  }

  function canManageGames() {
    const role = accountRole();
    return role === "wonder" || role === "developer";
  }

  function requestId() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(
      bytes,
      value => value.toString(16).padStart(2, "0")
    ).join("");
  }

  function studioAction(action, input = {}) {
    const id = requestId();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error("DEVELOPER_ACTION_TIMEOUT"));
      }, 20000);

      pending.set(id, { resolve, reject, timeout });

      window.parent.postMessage({
        source: SOURCE_UI,
        protocol: PROTOCOL,
        type: "studio-action",
        requestId: id,
        action,
        input
      }, HOST_ORIGIN);
    });
  }

  function formatDate(value) {
    const raw = clean(value);
    if (!raw) return "—";
    const date = new Date(raw);
    if (!Number.isFinite(date.getTime())) return "—";

    try {
      return new Intl.DateTimeFormat(
        lang() === "en" ? "en-US" : "es",
        { year: "numeric", month: "short", day: "numeric" }
      ).format(date);
    } catch (_) {
      return raw.slice(0, 10);
    }
  }

  function closeMenu() {
    const panel = document.querySelector("#r96-menu-panel");
    const menu = document.querySelector("#r96-menu");
    if (panel) panel.hidden = true;
    menu?.setAttribute("aria-expanded", "false");
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BUTTON_ID}{
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
      }
      #${BUTTON_ID}:hover{
        color:var(--r96-text);
        background:var(--r96-panel);
      }
      .r96-dev-backdrop{
        position:fixed;
        inset:0;
        z-index:2147482600;
        display:grid;
        place-items:center;
        padding:24px;
        background:rgba(0,0,0,.68);
        backdrop-filter:blur(9px);
      }
      .r96-dev-shell{
        width:min(1080px,100%);
        max-height:min(92vh,900px);
        overflow:auto;
        border:1px solid var(--r96-line);
        border-radius:24px;
        background:var(--r96-bg-2);
        color:var(--r96-text);
        box-shadow:0 30px 90px rgba(0,0,0,.45);
      }
      .r96-dev-head{
        position:sticky;
        top:0;
        z-index:3;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:18px;
        padding:20px 22px;
        border-bottom:1px solid var(--r96-line);
        background:color-mix(in srgb,var(--r96-bg-2) 93%,transparent);
        backdrop-filter:blur(14px);
      }
      .r96-dev-head-copy{display:grid;gap:4px}
      .r96-dev-head h2{margin:0;font-size:1.26rem}
      .r96-dev-head p{
        margin:0;
        color:var(--r96-muted);
        font-size:.76rem;
        font-weight:750;
      }
      .r96-dev-close{
        width:38px;
        height:38px;
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:var(--r96-panel);
        color:var(--r96-text);
        font:inherit;
        font-size:1.25rem;
        cursor:pointer;
      }
      .r96-dev-content{padding:22px}
      .r96-dev-status{
        margin:0;
        padding:24px 4px;
        color:var(--r96-muted);
        font-size:.86rem;
        font-weight:750;
      }
      .r96-dev-grid{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:16px;
      }
      .r96-dev-card{
        overflow:hidden;
        border:1px solid var(--r96-line);
        border-radius:18px;
        background:var(--r96-panel);
      }
      .r96-dev-card-preview{
        min-height:156px;
        display:flex;
        align-items:flex-end;
        padding:15px;
        background:
          linear-gradient(180deg,transparent,rgba(0,0,0,.48)),
          linear-gradient(135deg,var(--r96-bg-3),var(--r96-bg-2));
        background-size:cover;
        background-position:center;
      }
      .r96-dev-badge{
        display:inline-flex;
        align-items:center;
        min-height:27px;
        padding:0 9px;
        border-radius:999px;
        background:color-mix(in srgb,var(--r96-bg) 78%,transparent);
        color:#fff;
        font-size:.67rem;
        font-weight:900;
        backdrop-filter:blur(8px);
      }
      .r96-dev-card-body{
        display:grid;
        gap:12px;
        padding:16px;
      }
      .r96-dev-card h3{
        margin:0;
        font-size:1.02rem;
      }
      .r96-dev-meta{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px 12px;
        color:var(--r96-muted);
        font-size:.72rem;
      }
      .r96-dev-meta strong{
        display:block;
        margin-top:2px;
        color:var(--r96-text);
        font-size:.78rem;
      }
      .r96-dev-actions{
        display:flex;
        gap:9px;
        flex-wrap:wrap;
      }
      .r96-dev-primary,
      .r96-dev-secondary{
        min-height:38px;
        padding:0 13px;
        border-radius:11px;
        font:inherit;
        font-size:.76rem;
        font-weight:900;
        cursor:pointer;
      }
      .r96-dev-primary{
        border:1px solid color-mix(in srgb,var(--r96-accent) 60%,var(--r96-line));
        background:color-mix(in srgb,var(--r96-accent) 17%,var(--r96-panel));
        color:var(--r96-text);
      }
      .r96-dev-secondary{
        border:1px solid var(--r96-line);
        background:var(--r96-panel);
        color:var(--r96-text);
      }
      .r96-dev-admin{
        display:grid;
        gap:18px;
      }
      .r96-dev-admin-top{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:16px;
      }
      .r96-dev-admin-title{display:grid;gap:4px}
      .r96-dev-admin-title h3{margin:0;font-size:1.3rem}
      .r96-dev-admin-title p{
        margin:0;
        color:var(--r96-muted);
        font-size:.78rem;
      }
      .r96-dev-summary{
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:12px;
      }
      .r96-dev-summary article{
        padding:15px;
        border:1px solid var(--r96-line);
        border-radius:15px;
        background:var(--r96-panel);
      }
      .r96-dev-summary span{
        display:block;
        color:var(--r96-muted);
        font-size:.68rem;
        font-weight:800;
      }
      .r96-dev-summary strong{
        display:block;
        margin-top:5px;
        font-size:.88rem;
      }
      .r96-dev-description{
        padding:16px;
        border:1px solid var(--r96-line);
        border-radius:15px;
        background:var(--r96-panel);
      }
      .r96-dev-description h4{margin:0 0 8px;font-size:.86rem}
      .r96-dev-description p{
        margin:0;
        color:var(--r96-muted);
        font-size:.8rem;
        line-height:1.6;
      }
      .r96-dev-next{
        padding:14px 16px;
        border:1px dashed color-mix(in srgb,var(--r96-accent) 42%,var(--r96-line));
        border-radius:15px;
        color:var(--r96-muted);
        font-size:.76rem;
        line-height:1.55;
      }
      @media(max-width:760px){
        .r96-dev-backdrop{padding:10px}
        .r96-dev-shell{
          width:100%;
          max-height:96vh;
          border-radius:19px;
        }
        .r96-dev-content{padding:14px}
        .r96-dev-grid{grid-template-columns:1fr}
        .r96-dev-summary{grid-template-columns:1fr}
        .r96-dev-meta{grid-template-columns:1fr 1fr}
      }
    `;
    document.head.appendChild(style);
  }

  function removeModal() {
    document.getElementById(MODAL_ID)?.remove();
  }

  function shell() {
    ensureStyle();
    removeModal();

    const backdrop = document.createElement("div");
    backdrop.id = MODAL_ID;
    backdrop.className = "r96-dev-backdrop";

    const modal = document.createElement("section");
    modal.className = "r96-dev-shell";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "r96-dev-title");

    const head = document.createElement("div");
    head.className = "r96-dev-head";

    const copy = document.createElement("div");
    copy.className = "r96-dev-head-copy";

    const title = document.createElement("h2");
    title.id = "r96-dev-title";
    title.textContent = t("Mis juegos", "My games");

    const subtitle = document.createElement("p");
    subtitle.textContent = t(
      "Espacio privado de administración del desarrollador.",
      "Private developer management space."
    );

    copy.append(title, subtitle);

    const close = document.createElement("button");
    close.className = "r96-dev-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", t("Cerrar", "Close"));
    close.addEventListener("click", removeModal);

    head.append(copy, close);

    const content = document.createElement("div");
    content.className = "r96-dev-content";

    modal.append(head, content);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) removeModal();
    });

    const onKey = event => {
      if (event.key !== "Escape") return;
      document.removeEventListener("keydown", onKey);
      removeModal();
    };
    document.addEventListener("keydown", onKey);

    return { backdrop, modal, content };
  }

  function metaCell(label, value) {
    const wrap = document.createElement("div");
    const small = document.createElement("span");
    small.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = clean(value) || "—";
    wrap.append(small, strong);
    return wrap;
  }

  function renderAdmin(content, game, games) {
    content.replaceChildren();

    const admin = document.createElement("div");
    admin.className = "r96-dev-admin";

    const top = document.createElement("div");
    top.className = "r96-dev-admin-top";

    const title = document.createElement("div");
    title.className = "r96-dev-admin-title";

    const h3 = document.createElement("h3");
    h3.textContent = clean(game.title);

    const p = document.createElement("p");
    p.textContent = t(
      "Resumen administrativo del juego.",
      "Game administration summary."
    );

    title.append(h3, p);

    const back = document.createElement("button");
    back.className = "r96-dev-secondary";
    back.type = "button";
    back.textContent = t("← Mis juegos", "← My games");
    back.addEventListener("click", () => renderList(content, games));

    top.append(title, back);

    const summary = document.createElement("div");
    summary.className = "r96-dev-summary";
    summary.append(
      metaCell(t("Versión activa", "Active version"), game.currentVersion),
      metaCell(t("Etapa", "Stage"), game.stageLabel || game.stageKey),
      metaCell(
        t("Visibilidad", "Visibility"),
        game.published
          ? t("Publicado", "Published")
          : t("No publicado", "Not published")
      )
    );

    const description = document.createElement("section");
    description.className = "r96-dev-description";

    const dTitle = document.createElement("h4");
    dTitle.textContent = t("Descripción pública", "Public description");

    const dText = document.createElement("p");
    dText.textContent =
      clean(game.description) ||
      t("Sin descripción.", "No description.");

    description.append(dTitle, dText);

    const details = document.createElement("div");
    details.className = "r96-dev-summary";
    details.append(
      metaCell(t("Género", "Genre"), game.genre),
      metaCell(
        t("Build activo", "Active build"),
        game.buildFileName || t("Sin build", "No build")
      ),
      metaCell(
        t("Actualizado", "Updated"),
        formatDate(game.versionUpdatedAt || game.updatedAt)
      )
    );

    const next = document.createElement("div");
    next.className = "r96-dev-next";
    next.textContent = t(
      "La base de administración ya está conectada al juego correcto y a su versión activa. Editar metadatos, publicar una actualización, ver el historial completo y hacer rollback se habilitarán en la siguiente subetapa.",
      "The management base is now connected to the correct game and its active version. Metadata editing, publishing an update, full version history, and rollback will be enabled in the next substage."
    );

    admin.append(top, summary, description, details, next);
    content.appendChild(admin);
  }

  function renderList(content, games) {
    content.replaceChildren();

    if (!games.length) {
      const empty = document.createElement("p");
      empty.className = "r96-dev-status";
      empty.textContent = t(
        "Todavía no tienes juegos publicados o administrables.",
        "You do not have any published or manageable games yet."
      );
      content.appendChild(empty);
      return;
    }

    const grid = document.createElement("div");
    grid.className = "r96-dev-grid";

    games.forEach(game => {
      const card = document.createElement("article");
      card.className = "r96-dev-card";

      const preview = document.createElement("div");
      preview.className = "r96-dev-card-preview";

      const image = clean(game.previewImage);
      if (image) {
        preview.style.backgroundImage =
          "linear-gradient(180deg,transparent,rgba(0,0,0,.5)),url(" +
          JSON.stringify(image) + ")";
        preview.style.backgroundPosition =
          Number(game.previewPositionX || 50) + "% " +
          Number(game.previewPositionY || 50) + "%";
      }

      const badge = document.createElement("span");
      badge.className = "r96-dev-badge";
      badge.textContent =
        clean(game.stageLabel || game.stageKey) ||
        t("Juego", "Game");
      preview.appendChild(badge);

      const body = document.createElement("div");
      body.className = "r96-dev-card-body";

      const title = document.createElement("h3");
      title.textContent = clean(game.title);

      const meta = document.createElement("div");
      meta.className = "r96-dev-meta";
      meta.append(
        metaCell(t("Versión", "Version"), game.currentVersion),
        metaCell(
          t("Estado", "Status"),
          game.published
            ? t("Publicado", "Published")
            : t("No publicado", "Not published")
        ),
        metaCell(t("Género", "Genre"), game.genre),
        metaCell(
          t("Actualizado", "Updated"),
          formatDate(game.versionUpdatedAt || game.updatedAt)
        )
      );

      const actions = document.createElement("div");
      actions.className = "r96-dev-actions";

      const manage = document.createElement("button");
      manage.className = "r96-dev-primary";
      manage.type = "button";
      manage.textContent = t("Administrar", "Manage");
      manage.addEventListener("click", () => {
        renderAdmin(content, game, games);
      });

      actions.appendChild(manage);
      body.append(title, meta, actions);
      card.append(preview, body);
      grid.appendChild(card);
    });

    content.appendChild(grid);
  }

  async function openDeveloperSpace() {
    const { content } = shell();

    const loading = document.createElement("p");
    loading.className = "r96-dev-status";
    loading.textContent = t(
      "Cargando tus juegos…",
      "Loading your games…"
    );
    content.appendChild(loading);

    try {
      const data = await studioAction("developer.games.list");
      const games = Array.isArray(data?.games) ? data.games : [];
      renderList(content, games);
    } catch (error) {
      content.replaceChildren();
      const failure = document.createElement("p");
      failure.className = "r96-dev-status";
      failure.textContent = t(
        "No se pudo cargar tu espacio de desarrollador. Actualiza la página e intenta de nuevo.",
        "Your developer space could not be loaded. Refresh the page and try again."
      );
      content.appendChild(failure);
    }
  }

  function syncButton() {
    const panel = document.querySelector("#r96-menu-panel");
    if (!panel) return;

    let button = document.getElementById(BUTTON_ID);

    if (!canManageGames()) {
      button?.remove();
      return;
    }

    if (button) return;

    ensureStyle();

    button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = t("Mis juegos", "My games");
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      openDeveloperSpace();
    });

    panel.appendChild(button);
  }

  function installObserver() {
    if (observer) return;

    observer = new MutationObserver(syncButton);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: [
        "data-r96-auth-state",
        "data-r96-access-role",
        "lang"
      ]
    });

    syncButton();
  }

  window.addEventListener("message", event => {
    if (
      event.origin !== HOST_ORIGIN ||
      event.source !== window.parent
    ) {
      return;
    }

    const message = event.data;
    if (
      !message ||
      message.source !== SOURCE_BRIDGE ||
      message.protocol !== PROTOCOL ||
      message.type !== "studio-result"
    ) {
      return;
    }

    const id = clean(message.requestId);
    const entry = pending.get(id);
    if (!entry) return;

    clearTimeout(entry.timeout);
    pending.delete(id);

    if (message.data?.ok === true) {
      entry.resolve(message.data.data || {});
    } else {
      entry.reject(
        new Error(
          clean(message.data?.error || "DEVELOPER_ACTION_FAILED")
        )
      );
    }
  });

  installObserver();
})();
