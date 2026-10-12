(() => {
  "use strict";

  if (window.__r96CommunityUi) return;
  window.__r96CommunityUi = true;

  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SOURCE_UI = "r96-community-ui";
  const SOURCE_BRIDGE = "r96-community-bridge";
  const PROTOCOL = 1;
  const ROOT_ID = "r96-community-stage2";
  const STYLE_ID = "r96-community-stage2-style";

  let games = [];
  let selectedGameId = "";
  let feed = null;
  let moderation = null;
  let canModerate = false;
  let moderationOpen = false;
  let moderationTypeFilter = "all";
  let moderationStatusFilter = "all";
  let pending = new Map();
  let editingCommentId = "";
  let editingCommentBody = "";

  function requestId() {
    if (globalThis.crypto?.randomUUID) {
      return crypto.randomUUID().replace(/-/g, "");
    }

    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, value =>
      value.toString(16).padStart(2, "0")
    ).join("");
  }

  function signedIn() {
    return document
      .querySelector(".r96-account-visual")
      ?.dataset?.r96AuthState === "signedIn";
  }

  function post(type, payload = {}) {
    parent.postMessage({
      source: SOURCE_UI,
      protocol: PROTOCOL,
      type,
      ...payload
    }, HOST_ORIGIN);
  }

  function call(type, payload = {}) {
    const id = requestId();

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error("COMMUNITY_TIMEOUT"));
      }, 12000);

      pending.set(id, { resolve, reject, timer });

      post(type, {
        ...payload,
        requestId: id
      });
    });
  }

  function action(actionName, input = {}) {
    return call("community-action", {
      action: actionName,
      input
    });
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function dateLabel(value) {
    const date = new Date(value || 0);
    if (!Number.isFinite(date.getTime())) return "";

    try {
      return new Intl.DateTimeFormat("es", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(date);
    } catch (_) {
      return date.toLocaleDateString();
    }
  }

  function stars(value) {
    const rating = Math.max(
      0,
      Math.min(5, Math.round(Number(value || 0)))
    );
    return "★★★★★".slice(0, rating) +
      "☆☆☆☆☆".slice(0, 5 - rating);
  }

  function errorCopy(code) {
    const map = {
      AUTH_REQUIRED: "Inicia sesión con tu cuenta Nexo para participar.",
      ACTION_CAPABILITY_MISSING:
        "Tu sesión todavía se está sincronizando. Intenta de nuevo.",
      COMMUNITY_CAPABILITY_INVALID:
        "La sesión de Comunidad necesita renovarse.",
      COMMUNITY_CAPABILITY_EXPIRED:
        "La sesión de Comunidad venció. Intenta de nuevo.",
      COMMUNITY_MODERATION_REQUIRED:
        "Esta cuenta no administra la comunidad de este juego.",
      GAME_NOT_FOUND: "El juego ya no está disponible.",
      RATING_INVALID: "Selecciona una puntuación de 1 a 5 estrellas.",
      REVIEW_BODY_REQUIRED:
        "La reseña necesita al menos 5 caracteres.",
      REVIEW_PERMISSION_REQUIRED:
        "Sólo puedes modificar tu propia reseña.",
      COMMENT_BODY_REQUIRED: "Escribe un comentario.",
      COMMENT_PERMISSION_REQUIRED:
        "Sólo puedes modificar tu propio comentario.",
      COMMUNITY_TARGET_NOT_FOUND:
        "Ese contenido ya no está disponible para moderación.",
      COMMUNITY_TIMEOUT:
        "La operación tardó demasiado. Intenta de nuevo."
    };

    return map[String(code || "")] ||
      "No se pudo completar la operación.";
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID}{
        display:grid;
        gap:18px;
        width:100%;
      }
      .r96-community-toolbar{
        display:flex;
        flex-wrap:wrap;
        gap:12px;
        align-items:end;
        justify-content:space-between;
        padding:18px;
        border:1px solid var(--r96-line);
        border-radius:18px;
        background:var(--r96-panel);
      }
      .r96-community-toolbar label,
      .r96-community-filter{
        display:grid;
        gap:7px;
        min-width:min(100%,240px);
        color:var(--r96-muted);
        font-size:.78rem;
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:.06em;
      }
      .r96-community-toolbar select,
      .r96-community-form input,
      .r96-community-form select,
      .r96-community-form textarea,
      .r96-community-filter select{
        width:100%;
        box-sizing:border-box;
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:var(--r96-panel-strong);
        color:var(--r96-text);
        padding:11px 12px;
        font:inherit;
      }
      .r96-community-form textarea{
        min-height:100px;
        resize:vertical;
      }
      .r96-community-summary{
        display:flex;
        flex-wrap:wrap;
        gap:10px 14px;
        align-items:center;
      }
      .r96-community-score{
        font-size:1.2rem;
        font-weight:900;
      }
      .r96-community-stars{
        letter-spacing:.08em;
        color:var(--r96-accent);
      }
      .r96-community-muted{
        color:var(--r96-muted);
        font-size:.86rem;
        line-height:1.5;
      }
      .r96-community-grid{
        display:grid;
        grid-template-columns:minmax(0,1fr) minmax(0,1fr);
        gap:18px;
      }
      .r96-community-column{
        display:grid;
        gap:14px;
        align-content:start;
      }
      .r96-community-form,
      .r96-community-card,
      .r96-community-empty,
      .r96-community-moderation{
        border:1px solid var(--r96-line);
        border-radius:18px;
        background:var(--r96-panel);
        padding:18px;
      }
      .r96-community-form{
        display:grid;
        gap:10px;
      }
      .r96-community-form h3,
      .r96-community-list h3,
      .r96-community-moderation h3{
        margin:0;
      }
      .r96-community-list{
        display:grid;
        gap:10px;
      }
      .r96-community-card{
        display:grid;
        gap:8px;
      }
      .r96-community-card[data-status="hidden"]{
        border-style:dashed;
        opacity:.82;
      }
      .r96-community-card-head{
        display:flex;
        flex-wrap:wrap;
        gap:8px 12px;
        align-items:center;
        justify-content:space-between;
      }
      .r96-community-author{
        font-weight:900;
      }
      .r96-community-version{
        font-size:.75rem;
        color:var(--r96-muted);
      }
      .r96-community-card h4{
        margin:0;
        font-size:1rem;
      }
      .r96-community-card p{
        margin:0;
        white-space:pre-wrap;
        line-height:1.55;
      }
      .r96-community-actions{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin-top:4px;
      }
      .r96-community-btn{
        min-height:40px;
        border:1px solid var(--r96-line);
        border-radius:10px;
        background:var(--r96-panel-strong);
        color:var(--r96-text);
        padding:8px 13px;
        font:inherit;
        font-weight:800;
        cursor:pointer;
      }
      .r96-community-btn-primary{
        background:var(--r96-text);
        color:var(--r96-bg);
      }
      .r96-community-btn-danger{
        color:#ff9b9b;
      }
      .r96-community-btn:disabled{
        opacity:.5;
        cursor:default;
      }
      .r96-community-feedback{
        min-height:20px;
        color:var(--r96-muted);
        font-size:.84rem;
      }
      .r96-community-feedback[data-error="1"]{
        color:#ff9b9b;
      }
      .r96-community-moderation{
        display:grid;
        gap:16px;
      }
      .r96-community-moderation-head{
        display:flex;
        flex-wrap:wrap;
        gap:12px;
        align-items:flex-start;
        justify-content:space-between;
      }
      .r96-community-moderation-head p{
        margin:5px 0 0;
      }
      .r96-community-moderation-summary{
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:10px;
      }
      .r96-community-moderation-summary article{
        padding:12px;
        border:1px solid var(--r96-line);
        border-radius:13px;
        background:var(--r96-bg-3);
      }
      .r96-community-moderation-summary span{
        display:block;
        color:var(--r96-muted);
        font-size:.68rem;
        font-weight:800;
      }
      .r96-community-moderation-summary strong{
        display:block;
        margin-top:4px;
        font-size:.95rem;
      }
      .r96-community-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
      }
      .r96-community-status{
        display:inline-flex;
        align-items:center;
        min-height:26px;
        padding:0 9px;
        border:1px solid var(--r96-line);
        border-radius:999px;
        font-size:.69rem;
        font-weight:900;
        text-transform:uppercase;
        letter-spacing:.04em;
      }
      .r96-community-status[data-status="hidden"]{
        color:#ffca75;
      }
      .r96-community-status[data-status="visible"]{
        color:#8dd7a7;
      }
      @media(max-width:820px){
        .r96-community-grid{
          grid-template-columns:1fr;
        }
        .r96-community-moderation-summary{
          grid-template-columns:1fr 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function root() {
    return document.getElementById(ROOT_ID);
  }

  function setFeedback(message, isError = false) {
    const node = root()?.querySelector(".r96-community-feedback");
    if (!node) return;
    node.textContent = String(message || "");
    node.dataset.error = isError ? "1" : "0";
  }

  function selectedGame() {
    return games.find(game => String(game.id) === selectedGameId) || null;
  }

  function renderReviews() {
    const reviews = Array.isArray(feed?.reviews) ? feed.reviews : [];

    if (!reviews.length) {
      return '<div class="r96-community-empty r96-community-muted">' +
        "Todavía no hay reseñas para este juego." +
        "</div>";
    }

    return reviews.map(review => {
      const mine = review.ownedByViewer === true;
      return `
        <article class="r96-community-card">
          <div class="r96-community-card-head">
            <span class="r96-community-author">${esc(review.authorDisplayName)}</span>
            <span class="r96-community-stars">${esc(stars(review.rating))}</span>
          </div>
          <div class="r96-community-version">
            ${review.versionLabel ? "Versión " + esc(review.versionLabel) + " · " : ""}
            ${esc(dateLabel(review.updatedAt || review.createdAt))}
          </div>
          ${review.title ? "<h4>" + esc(review.title) + "</h4>" : ""}
          <p>${esc(review.body)}</p>
          ${mine ? `
            <div class="r96-community-actions">
              <button class="r96-community-btn" type="button" data-review-edit="${esc(review.id)}">Editar</button>
              <button class="r96-community-btn r96-community-btn-danger" type="button" data-review-delete="${esc(review.id)}">Eliminar</button>
            </div>
          ` : ""}
        </article>
      `;
    }).join("");
  }

  function renderComments() {
    const comments = Array.isArray(feed?.comments) ? feed.comments : [];

    if (!comments.length) {
      return '<div class="r96-community-empty r96-community-muted">' +
        "Todavía no hay comentarios para este juego." +
        "</div>";
    }

    return comments.map(comment => {
      const mine = comment.ownedByViewer === true;
      return `
        <article class="r96-community-card">
          <div class="r96-community-card-head">
            <span class="r96-community-author">${esc(comment.authorDisplayName)}</span>
            <span class="r96-community-version">
              ${comment.versionLabel ? "v" + esc(comment.versionLabel) + " · " : ""}
              ${esc(dateLabel(comment.updatedAt || comment.createdAt))}
            </span>
          </div>
          <p>${esc(comment.body)}</p>
          ${mine ? `
            <div class="r96-community-actions">
              <button class="r96-community-btn" type="button" data-comment-edit="${esc(comment.id)}">Editar</button>
              <button class="r96-community-btn r96-community-btn-danger" type="button" data-comment-delete="${esc(comment.id)}">Eliminar</button>
            </div>
          ` : ""}
        </article>
      `;
    }).join("");
  }

  function moderationItems() {
    if (!moderation) return [];

    const reviews = (moderation.reviews || []).map(item => ({
      ...item,
      moderationType: "review"
    }));
    const comments = (moderation.comments || []).map(item => ({
      ...item,
      moderationType: "comment"
    }));

    return reviews
      .concat(comments)
      .filter(item =>
        moderationTypeFilter === "all" ||
        item.moderationType === moderationTypeFilter
      )
      .filter(item =>
        moderationStatusFilter === "all" ||
        item.status === moderationStatusFilter
      )
      .sort((a, b) =>
        new Date(b.updatedAt || b.createdAt || 0).getTime() -
        new Date(a.updatedAt || a.createdAt || 0).getTime()
      );
  }

  function renderModerationItems() {
    const items = moderationItems();

    if (!items.length) {
      return '<div class="r96-community-empty r96-community-muted">' +
        "No hay contenido que coincida con estos filtros." +
        "</div>";
    }

    return items.map(item => {
      const isReview = item.moderationType === "review";
      const hidden = item.status === "hidden";
      const nextStatus = hidden ? "visible" : "hidden";
      const actionLabel = hidden ? "Restaurar" : "Ocultar";

      return `
        <article class="r96-community-card" data-status="${esc(item.status)}">
          <div class="r96-community-card-head">
            <div>
              <span class="r96-community-author">${esc(item.authorDisplayName)}</span>
              <div class="r96-community-version">
                ${isReview ? "Reseña" : "Comentario"}
                ${item.versionLabel ? " · v" + esc(item.versionLabel) : ""}
                · ${esc(dateLabel(item.updatedAt || item.createdAt))}
              </div>
            </div>
            <span class="r96-community-status" data-status="${esc(item.status)}">
              ${hidden ? "Oculto" : "Visible"}
            </span>
          </div>
          ${isReview ? '<div class="r96-community-stars">' + esc(stars(item.rating)) + '</div>' : ""}
          ${isReview && item.title ? "<h4>" + esc(item.title) + "</h4>" : ""}
          <p>${esc(item.body)}</p>
          ${hidden && item.hiddenAt ? '<div class="r96-community-version">Ocultado: ' + esc(dateLabel(item.hiddenAt)) + '</div>' : ""}
          <div class="r96-community-actions">
            <button
              class="r96-community-btn ${hidden ? "" : "r96-community-btn-danger"}"
              type="button"
              data-moderate-type="${esc(item.moderationType)}"
              data-moderate-id="${esc(item.id)}"
              data-moderate-status="${nextStatus}"
            >${actionLabel}</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderModeration() {
    if (!canModerate || !moderationOpen || !moderation) return "";

    const summary = moderation.summary || {};
    const scopeLabel =
      moderation.scope === "global"
        ? "Wonder · administración global"
        : "Propietario del juego";

    return `
      <section class="r96-community-moderation">
        <div class="r96-community-moderation-head">
          <div>
            <h3>Moderación</h3>
            <p class="r96-community-muted">
              ${esc(scopeLabel)}. Puedes ocultar o restaurar aportes; no puedes editar el texto de otro usuario.
            </p>
          </div>
          <button class="r96-community-btn" type="button" data-moderation-close>Cerrar</button>
        </div>

        <div class="r96-community-moderation-summary">
          <article><span>Reseñas visibles</span><strong>${Number(summary.visibleReviews || 0)}</strong></article>
          <article><span>Reseñas ocultas</span><strong>${Number(summary.hiddenReviews || 0)}</strong></article>
          <article><span>Comentarios visibles</span><strong>${Number(summary.visibleComments || 0)}</strong></article>
          <article><span>Comentarios ocultos</span><strong>${Number(summary.hiddenComments || 0)}</strong></article>
        </div>

        <div class="r96-community-filters">
          <label class="r96-community-filter">
            Tipo
            <select data-moderation-type-filter>
              <option value="all" ${moderationTypeFilter === "all" ? "selected" : ""}>Todo</option>
              <option value="review" ${moderationTypeFilter === "review" ? "selected" : ""}>Reseñas</option>
              <option value="comment" ${moderationTypeFilter === "comment" ? "selected" : ""}>Comentarios</option>
            </select>
          </label>
          <label class="r96-community-filter">
            Estado
            <select data-moderation-status-filter>
              <option value="all" ${moderationStatusFilter === "all" ? "selected" : ""}>Todos</option>
              <option value="visible" ${moderationStatusFilter === "visible" ? "selected" : ""}>Visibles</option>
              <option value="hidden" ${moderationStatusFilter === "hidden" ? "selected" : ""}>Ocultos</option>
            </select>
          </label>
        </div>

        <div class="r96-community-list">
          ${renderModerationItems()}
        </div>
      </section>
    `;
  }

  function render() {
    ensureStyle();

    const section = document.getElementById("reviews");
    if (!section) return;

    const copy = section.querySelector(".r96-title-row .r96-copy");
    if (copy) {
      copy.textContent =
        "Reseñas y comentarios reales de la comunidad, asociados al juego y a la versión activa en el momento de publicarlos.";
    }

    let mount = root();
    if (!mount) {
      const old =
        section.querySelector("#r96-community-stage1") ||
        section.querySelector(".r96-two");
      mount = document.createElement("div");
      mount.id = ROOT_ID;
      mount.className = "r96-inner";
      if (old) old.replaceWith(mount);
      else section.appendChild(mount);
    }

    const game = selectedGame();
    const summary = feed?.summary || {};
    const activeVersion =
      feed?.game?.activeVersionLabel ||
      game?.currentVersion ||
      "";
    const isSignedIn = signedIn();

    mount.innerHTML = `
      <div class="r96-community-toolbar">
        <label>
          Juego
          <select data-community-game>
            ${games.map(item => `
              <option value="${esc(item.id)}" ${item.id === selectedGameId ? "selected" : ""}>
                ${esc(item.title)}
              </option>
            `).join("")}
          </select>
        </label>
        <div class="r96-community-summary">
          <span class="r96-community-score">
            ${Number(summary.averageRating || 0).toFixed(1)}
            <span class="r96-community-stars">★</span>
          </span>
          <span class="r96-community-muted">
            ${Number(summary.reviewCount || 0)} reseñas ·
            ${Number(summary.commentCount || 0)} comentarios
            ${activeVersion ? " · versión activa " + esc(activeVersion) : ""}
          </span>
          ${isSignedIn ? '<button class="r96-community-btn" type="button" data-community-mine>Mis aportes</button>' : ""}
          ${canModerate ? '<button class="r96-community-btn r96-community-btn-primary" type="button" data-community-moderation>Moderación</button>' : ""}
        </div>
      </div>

      <div class="r96-community-feedback"></div>

      ${games.length ? `
        <div class="r96-community-grid">
          <div class="r96-community-column">
            <form class="r96-community-form" data-review-form>
              <h3>Tu reseña</h3>
              <select name="rating" ${isSignedIn ? "" : "disabled"}>
                <option value="5">5 — Excelente</option>
                <option value="4">4 — Muy bueno</option>
                <option value="3">3 — Bueno</option>
                <option value="2">2 — Mejorable</option>
                <option value="1">1 — Malo</option>
              </select>
              <input name="title" maxlength="100" placeholder="Título opcional" ${isSignedIn ? "" : "disabled"}>
              <textarea name="body" maxlength="2500" placeholder="${isSignedIn ? "Cuéntanos qué te pareció…" : "Inicia sesión para escribir una reseña."}" ${isSignedIn ? "" : "disabled"}></textarea>
              <button class="r96-community-btn r96-community-btn-primary" type="submit" ${isSignedIn ? "" : "disabled"}>
                Guardar reseña
              </button>
            </form>

            <div class="r96-community-list">
              <h3>Reseñas</h3>
              ${renderReviews()}
            </div>
          </div>

          <div class="r96-community-column">
            <form class="r96-community-form" data-comment-form>
              <h3>${editingCommentId ? "Editar comentario" : "Nuevo comentario"}</h3>
              <textarea name="body" maxlength="1500" placeholder="${isSignedIn ? "Escribe un comentario…" : "Inicia sesión para comentar."}" ${isSignedIn ? "" : "disabled"}>${esc(editingCommentBody)}</textarea>
              <div class="r96-community-actions">
                <button class="r96-community-btn r96-community-btn-primary" type="submit" ${isSignedIn ? "" : "disabled"}>
                  ${editingCommentId ? "Guardar cambios" : "Publicar comentario"}
                </button>
                ${editingCommentId ? '<button class="r96-community-btn" type="button" data-comment-cancel>Cancelar</button>' : ""}
              </div>
            </form>

            <div class="r96-community-list">
              <h3>Comentarios</h3>
              ${renderComments()}
            </div>
          </div>
        </div>

        ${renderModeration()}
      ` : `
        <div class="r96-community-empty">
          Aún no hay juegos publicados para recibir feedback.
        </div>
      `}
    `;

    wire();
  }

  async function loadModeration(silent = true) {
    if (!signedIn() || !selectedGameId) {
      moderation = null;
      canModerate = false;
      moderationOpen = false;
      render();
      return;
    }

    try {
      const result = await action("moderation.feed", {
        gameId: selectedGameId
      });
      moderation = result?.data || result || null;
      canModerate = Boolean(moderation?.game?.id);
      render();
    } catch (error) {
      moderation = null;
      canModerate = false;
      moderationOpen = false;
      render();

      if (
        !silent ||
        String(error?.message || "") !== "COMMUNITY_MODERATION_REQUIRED"
      ) {
        setFeedback(errorCopy(error?.message), !silent);
      }
    }
  }

  async function loadFeed(authenticated = false) {
    if (!selectedGameId) {
      feed = null;
      moderation = null;
      canModerate = false;
      moderationOpen = false;
      render();
      return;
    }

    setFeedback("Cargando comunidad…");

    try {
      const result = authenticated
        ? await action("feed", { gameId: selectedGameId })
        : await call("community-feed", { gameId: selectedGameId });

      feed = result?.data || result || null;
      setFeedback("");
      render();

      if (signedIn()) {
        await loadModeration(true);
      }
    } catch (error) {
      setFeedback(errorCopy(error?.message), true);
    }
  }

  function reviewOwnedByViewer(id) {
    return (feed?.reviews || []).find(
      item => item.id === id && item.ownedByViewer === true
    );
  }

  function commentOwnedByViewer(id) {
    return (feed?.comments || []).find(
      item => item.id === id && item.ownedByViewer === true
    );
  }

  async function refreshAfterOwnMutation(nextFeed, message) {
    feed = nextFeed || feed;
    setFeedback(message);
    render();
    if (signedIn()) await loadModeration(true);
  }

  async function moderate(type, targetId, status) {
    setFeedback(
      status === "hidden"
        ? "Ocultando aporte…"
        : "Restaurando aporte…"
    );

    try {
      const result = await action("moderate", {
        type,
        targetId,
        status
      });

      feed = result?.data?.feed || result?.feed || feed;
      await loadModeration(false);
      setFeedback(
        status === "hidden"
          ? "Aporte ocultado."
          : "Aporte restaurado."
      );
    } catch (error) {
      setFeedback(errorCopy(error?.message), true);
    }
  }

  function wire() {
    const mount = root();
    if (!mount) return;

    const select = mount.querySelector("[data-community-game]");
    select?.addEventListener("change", () => {
      selectedGameId = String(select.value || "");
      editingCommentId = "";
      editingCommentBody = "";
      moderation = null;
      canModerate = false;
      moderationOpen = false;
      moderationTypeFilter = "all";
      moderationStatusFilter = "all";
      loadFeed(false);
    });

    mount.querySelector("[data-community-mine]")
      ?.addEventListener("click", () => {
        loadFeed(true);
      });

    mount.querySelector("[data-community-moderation]")
      ?.addEventListener("click", () => {
        moderationOpen = true;
        render();
        root()?.querySelector(".r96-community-moderation")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

    mount.querySelector("[data-moderation-close]")
      ?.addEventListener("click", () => {
        moderationOpen = false;
        render();
      });

    mount.querySelector("[data-moderation-type-filter]")
      ?.addEventListener("change", event => {
        moderationTypeFilter = String(event.target.value || "all");
        render();
      });

    mount.querySelector("[data-moderation-status-filter]")
      ?.addEventListener("change", event => {
        moderationStatusFilter = String(event.target.value || "all");
        render();
      });

    mount.querySelectorAll("[data-moderate-id]").forEach(button => {
      button.addEventListener("click", () => {
        moderate(
          String(button.dataset.moderateType || ""),
          String(button.dataset.moderateId || ""),
          String(button.dataset.moderateStatus || "")
        );
      });
    });

    const reviewForm = mount.querySelector("[data-review-form]");
    reviewForm?.addEventListener("submit", async event => {
      event.preventDefault();
      if (!signedIn()) {
        setFeedback(errorCopy("AUTH_REQUIRED"), true);
        return;
      }

      const data = new FormData(reviewForm);
      setFeedback("Guardando reseña…");

      try {
        const result = await action("review.save", {
          gameId: selectedGameId,
          rating: Number(data.get("rating") || 0),
          title: String(data.get("title") || ""),
          body: String(data.get("body") || "")
        });

        await refreshAfterOwnMutation(
          result?.data?.feed || result?.feed,
          "Reseña guardada."
        );
      } catch (error) {
        setFeedback(errorCopy(error?.message), true);
      }
    });

    mount.querySelectorAll("[data-review-edit]").forEach(button => {
      button.addEventListener("click", () => {
        const review = reviewOwnedByViewer(
          String(button.dataset.reviewEdit || "")
        );
        if (!review) return;

        const form = root()?.querySelector("[data-review-form]");
        if (!form) return;
        form.elements.rating.value = String(review.rating || 5);
        form.elements.title.value = review.title || "";
        form.elements.body.value = review.body || "";
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    mount.querySelectorAll("[data-review-delete]").forEach(button => {
      button.addEventListener("click", async () => {
        const reviewId = String(button.dataset.reviewDelete || "");
        if (!reviewOwnedByViewer(reviewId)) return;

        setFeedback("Eliminando reseña…");
        try {
          const result = await action("review.delete", { reviewId });
          await refreshAfterOwnMutation(
            result?.data?.feed || result?.feed,
            "Reseña eliminada."
          );
        } catch (error) {
          setFeedback(errorCopy(error?.message), true);
        }
      });
    });

    const commentForm = mount.querySelector("[data-comment-form]");
    commentForm?.addEventListener("submit", async event => {
      event.preventDefault();
      if (!signedIn()) {
        setFeedback(errorCopy("AUTH_REQUIRED"), true);
        return;
      }

      const data = new FormData(commentForm);
      const body = String(data.get("body") || "");
      setFeedback(
        editingCommentId
          ? "Guardando comentario…"
          : "Publicando comentario…"
      );

      try {
        const result = editingCommentId
          ? await action("comment.update", {
              commentId: editingCommentId,
              body
            })
          : await action("comment.create", {
              gameId: selectedGameId,
              body
            });

        editingCommentId = "";
        editingCommentBody = "";
        await refreshAfterOwnMutation(
          result?.data?.feed || result?.feed,
          "Comentario guardado."
        );
      } catch (error) {
        setFeedback(errorCopy(error?.message), true);
      }
    });

    mount.querySelectorAll("[data-comment-edit]").forEach(button => {
      button.addEventListener("click", () => {
        const comment = commentOwnedByViewer(
          String(button.dataset.commentEdit || "")
        );
        if (!comment) return;

        editingCommentId = comment.id;
        editingCommentBody = comment.body || "";
        render();
        root()?.querySelector("[data-comment-form]")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    mount.querySelectorAll("[data-comment-delete]").forEach(button => {
      button.addEventListener("click", async () => {
        const commentId = String(button.dataset.commentDelete || "");
        if (!commentOwnedByViewer(commentId)) return;

        setFeedback("Eliminando comentario…");
        try {
          const result = await action("comment.delete", { commentId });
          editingCommentId = "";
          editingCommentBody = "";
          await refreshAfterOwnMutation(
            result?.data?.feed || result?.feed,
            "Comentario eliminado."
          );
        } catch (error) {
          setFeedback(errorCopy(error?.message), true);
        }
      });
    });

    mount.querySelector("[data-comment-cancel]")
      ?.addEventListener("click", () => {
        editingCommentId = "";
        editingCommentBody = "";
        render();
      });
  }

  addEventListener("message", event => {
    if (event.origin !== HOST_ORIGIN) return;

    const message = event.data;
    if (
      !message ||
      message.source !== SOURCE_BRIDGE ||
      message.protocol !== PROTOCOL
    ) {
      return;
    }

    if (message.type === "community-catalog") {
      games = Array.isArray(message.data?.games)
        ? message.data.games
        : [];

      if (
        !selectedGameId ||
        !games.some(game => game.id === selectedGameId)
      ) {
        selectedGameId = String(games[0]?.id || "");
      }

      render();
      if (selectedGameId) loadFeed(false);
      return;
    }

    if (
      message.type === "community-feed-result" ||
      message.type === "community-action-result"
    ) {
      const id = String(message.requestId || "");
      const item = pending.get(id);
      if (!item) return;

      clearTimeout(item.timer);
      pending.delete(id);

      if (message.data?.ok !== true) {
        item.reject(
          new Error(
            String(
              message.data?.error || "COMMUNITY_ACTION_FAILED"
            )
          )
        );
        return;
      }

      item.resolve(message.data?.data || {});
    }
  });

  const account = document.querySelector(".r96-account-visual");
  if (account) {
    new MutationObserver(() => {
      if (signedIn()) {
        if (selectedGameId) {
          loadFeed(true);
        } else {
          render();
        }
      } else {
        moderation = null;
        canModerate = false;
        moderationOpen = false;
        render();
      }
    }).observe(account, {
      attributes: true,
      attributeFilter: ["data-r96-auth-state"]
    });
  }

  render();
  post("community-ready");
})();
