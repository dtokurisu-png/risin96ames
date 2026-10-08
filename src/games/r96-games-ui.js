(() => {
  "use strict";

  if (window.__r96GamesUi) return;
  window.__r96GamesUi = true;

  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SOURCE_BRIDGE = "r96-games-bridge";
  const SOURCE_UI = "r96-games-ui";
  const PROTOCOL = 1;

  const ADD_BUTTON_ID = "r96-add-game";
  const MODAL_ID = "r96-game-studio-modal";

  const carousel = document.querySelector("#games .r96-carousel");
  const titleCopy = document.querySelector("#games .r96-title-row > .r96-copy");
  const gamesStat = document.querySelector(".r96-stats span:first-child strong");

  if (!carousel) return;

  let emptyNode = null;
  let studioObserver = null;
  let pending = new Map();

  const STAGES = [
    ["concept", "Concept"],
    ["prototype", "Prototype"],
    ["build-preview", "Build Preview"],
    ["slot", "Slot"],
    ["future-release", "Future Release"],
    ["released", "Released"]
  ];

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

  function clean(value) {
    return String(value || "").trim();
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
      .r96-game-thumb.r96-has-preview::after{opacity:.18}
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
      .r96-game-meta{display:grid;gap:7px}
      .r96-game-meta span{display:block}
      #${ADD_BUTTON_ID}{
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
      #${ADD_BUTTON_ID}:hover{
        color:var(--r96-text);
        background:var(--r96-panel);
      }
      .r96-game-modal-backdrop{
        position:fixed;
        inset:0;
        z-index:2147482500;
        display:grid;
        place-items:center;
        padding:24px;
        background:rgba(0,0,0,.66);
        backdrop-filter:blur(8px);
      }
      .r96-game-modal{
        width:min(1040px,100%);
        max-height:min(92vh,900px);
        overflow:auto;
        border:1px solid var(--r96-line);
        border-radius:24px;
        background:var(--r96-bg-2);
        color:var(--r96-text);
        box-shadow:0 30px 90px rgba(0,0,0,.45);
      }
      .r96-game-modal-head{
        position:sticky;
        top:0;
        z-index:3;
        display:flex;
        justify-content:space-between;
        gap:18px;
        align-items:center;
        padding:20px 22px;
        border-bottom:1px solid var(--r96-line);
        background:color-mix(in srgb,var(--r96-bg-2) 92%,transparent);
        backdrop-filter:blur(14px);
      }
      .r96-game-modal-head h2{margin:0;font-size:1.22rem}
      .r96-game-modal-close{
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
      .r96-game-studio-grid{
        display:grid;
        grid-template-columns:minmax(0,1.1fr) minmax(310px,.9fr);
        gap:22px;
        padding:22px;
      }
      .r96-game-form{
        display:grid;
        gap:16px;
      }
      .r96-game-field{
        display:grid;
        gap:7px;
      }
      .r96-game-field label,
      .r96-game-field .r96-field-label{
        color:var(--r96-text);
        font-size:.78rem;
        font-weight:900;
      }
      .r96-game-field small{
        color:var(--r96-muted);
        font-size:.72rem;
        line-height:1.45;
      }
      .r96-game-field input,
      .r96-game-field select,
      .r96-game-field textarea{
        width:100%;
        box-sizing:border-box;
        border:1px solid var(--r96-line);
        border-radius:12px;
        background:var(--r96-panel);
        color:var(--r96-text);
        padding:12px 13px;
        font:inherit;
        outline:none;
      }
      .r96-game-field textarea{min-height:120px;resize:vertical}
      .r96-game-field input:focus,
      .r96-game-field select:focus,
      .r96-game-field textarea:focus{
        border-color:var(--r96-accent);
        box-shadow:0 0 0 3px color-mix(in srgb,var(--r96-accent) 14%,transparent);
      }
      .r96-game-form-row{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:14px;
      }
      .r96-tag-editor{
        display:grid;
        gap:9px;
      }
      .r96-tag-list{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        min-height:28px;
      }
      .r96-tag-chip{
        display:inline-flex;
        align-items:center;
        gap:7px;
        min-height:28px;
        padding:0 8px 0 10px;
        border:1px solid color-mix(in srgb,var(--r96-accent) 35%,var(--r96-line));
        border-radius:999px;
        background:color-mix(in srgb,var(--r96-accent) 8%,var(--r96-panel));
        color:var(--r96-accent);
        font-size:.72rem;
        font-weight:850;
      }
      .r96-tag-chip button{
        border:0;
        background:transparent;
        color:inherit;
        padding:0;
        cursor:pointer;
      }
      .r96-tag-add{
        justify-self:start;
        min-height:34px;
        padding:0 12px;
        border:1px solid var(--r96-line);
        border-radius:999px;
        background:var(--r96-panel);
        color:var(--r96-text);
        font:inherit;
        font-size:.76rem;
        font-weight:850;
        cursor:pointer;
      }
      .r96-tag-entry{
        display:flex;
        gap:8px;
      }
      .r96-tag-entry[hidden]{display:none}
      .r96-tag-entry input{flex:1}
      .r96-tag-entry button{
        border:1px solid var(--r96-line);
        border-radius:10px;
        background:var(--r96-panel);
        color:var(--r96-text);
        padding:0 12px;
        font:inherit;
        font-weight:850;
        cursor:pointer;
      }
      .r96-game-submit{
        min-height:48px;
        border:0;
        border-radius:13px;
        background:linear-gradient(135deg,var(--r96-accent),#d9fff9);
        color:#071017;
        font:inherit;
        font-weight:950;
        cursor:pointer;
      }
      .r96-game-submit:disabled{opacity:.58;cursor:default}
      .r96-game-feedback{
        min-height:22px;
        color:var(--r96-muted);
        font-size:.78rem;
        line-height:1.45;
      }
      .r96-game-feedback[data-error="1"]{color:#ffb6b6}
      .r96-game-preview-panel{
        position:sticky;
        top:86px;
        align-self:start;
      }
      .r96-game-preview-panel .r96-card{
        min-height:500px;
      }
      .r96-game-preview-panel .r96-card-actions .r96-primary{
        pointer-events:none;
      }
      @media(max-width:820px){
        .r96-game-studio-grid{grid-template-columns:1fr}
        .r96-game-preview-panel{position:static}
      }
      @media(max-width:560px){
        .r96-game-modal-backdrop{padding:10px}
        .r96-game-studio-grid{padding:16px}
        .r96-game-form-row{grid-template-columns:1fr}
      }
    `;

    document.head.appendChild(style);
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
    const found = STAGES.find(([stageKey]) => stageKey === key);
    return found?.[1] || t("En desarrollo", "In development");
  }

  function formatDate(value) {
    const raw = clean(value);
    if (!raw) return "";
    const date = new Date(raw);
    if (!Number.isFinite(date.getTime())) return "";
    try {
      return new Intl.DateTimeFormat(
        lang() === "en" ? "en-US" : "es",
        { year:"numeric", month:"short", day:"numeric" }
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

  function gameCard(game, index, previewMode = false) {
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
    code.textContent = previewMode ? "NEW" : String(index + 1).padStart(2, "0");

    const stage = document.createElement("span");
    stage.className = "r96-thumb-label";
    stage.textContent = stageLabel(game);

    thumb.append(code, stage);

    const body = document.createElement("div");
    body.className = "r96-card-body";

    const tags = tagNodes(game.tags);

    const title = document.createElement("h3");
    title.className = "r96-h3";
    title.textContent =
      clean(game.title) ||
      t("Título del juego", "Game title");

    const desc = document.createElement("p");
    desc.className = "r96-desc r96-game-desc";
    desc.textContent =
      clean(game.description) ||
      t("La descripción aparecerá aquí.", "The description will appear here.");

    const meta = metaRow(game);

    const actions = document.createElement("div");
    actions.className = "r96-card-actions";

    const open = document.createElement("button");
    open.className = "r96-primary";
    open.type = "button";
    open.textContent = t("Ver juego", "View game");
    open.setAttribute("aria-disabled", "true");

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

  function accountRole() {
    const account = document.querySelector(".r96-account-visual");
    if (account?.dataset?.r96AuthState !== "signedIn") return "";
    return clean(account?.dataset?.r96AccessRole).toLowerCase();
  }

  function canPublish() {
    const role = accountRole();
    return role === "wonder" || role === "developer";
  }

  function closeMenu() {
    const panel = document.querySelector("#r96-menu-panel");
    const menu = document.querySelector("#r96-menu");
    if (panel) panel.hidden = true;
    menu?.setAttribute("aria-expanded", "false");
  }

  function syncAddGameButton() {
    const panel = document.querySelector("#r96-menu-panel");
    if (!panel) return;

    let button = document.getElementById(ADD_BUTTON_ID);

    if (!canPublish()) {
      button?.remove();
      return;
    }

    if (button) return;

    button = document.createElement("button");
    button.id = ADD_BUTTON_ID;
    button.type = "button";
    button.textContent = t("Agregar juego", "Add game");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      openStudio();
    });

    panel.appendChild(button);
  }

  function installStudioObserver() {
    if (studioObserver) return;

    studioObserver = new MutationObserver(() => {
      syncAddGameButton();
    });

    studioObserver.observe(document.body, {
      attributes:true,
      childList:true,
      subtree:true,
      attributeFilter:[
        "data-r96-auth-state",
        "data-r96-access-role",
        "lang"
      ]
    });

    syncAddGameButton();
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
        reject(new Error("GAMES_ACTION_TIMEOUT"));
      }, 20000);

      pending.set(id, {
        resolve,
        reject,
        timeout
      });

      window.parent.postMessage({
        source: SOURCE_UI,
        protocol: PROTOCOL,
        type: "studio-action",
        requestId:id,
        action,
        input
      }, HOST_ORIGIN);
    });
  }

  async function uploadFile(kind, file) {
    const prepared = await studioAction("upload.prepare", {
      kind,
      fileName:file.name,
      mimeType:file.type || "",
      sizeInBytes:file.size
    });

    const uploadUrl = clean(prepared.uploadUrl);
    if (!uploadUrl) throw new Error("UPLOAD_PREPARE_FAILED");

    const response = await fetch(uploadUrl, {
      method:"PUT",
      headers:{
        "Content-Type":prepared.mimeType || file.type || "application/octet-stream"
      },
      body:file
    });

    const payload = await response.json().catch(() => null);
    const fileId = clean(payload?.file?.id || payload?.file?._id);

    if (!response.ok || !fileId) {
      throw new Error("UPLOAD_FAILED");
    }

    return {
      ticket:prepared.ticket,
      fileId
    };
  }

  function errorMessage(code) {
    const messagesEs = {
      AUTH_REQUIRED:"Inicia sesión con tu cuenta Nexo Group.",
      DEVELOPER_REQUIRED:"Esta cuenta no tiene permisos de desarrollador.",
      PREVIEW_TYPE_INVALID:"La imagen debe ser PNG, JPG o WEBP.",
      PREVIEW_TOO_LARGE:"La imagen supera el límite permitido.",
      BUILD_TYPE_INVALID:"El build debe ser ZIP, APK, EXE, MSI o 7Z.",
      BUILD_TOO_LARGE:"El archivo del build es demasiado grande.",
      UPLOAD_FAILED:"No se pudo completar la subida del archivo.",
      UPLOAD_PREPARE_FAILED:"No se pudo preparar la subida.",
      UPLOAD_TICKET_INVALID:"La autorización de subida ya no es válida.",
      UPLOAD_TICKET_EXPIRED:"La autorización de subida expiró.",
      UPLOAD_FILE_NOT_READY:"Wix todavía está procesando el archivo. Intenta publicar otra vez.",
      UPLOAD_FILE_MISMATCH:"El archivo subido no coincide con la solicitud.",
      TITLE_REQUIRED:"Escribe el título del juego.",
      STAGE_INVALID:"Selecciona una etapa válida.",
      GENRE_REQUIRED:"Escribe el género.",
      DESCRIPTION_REQUIRED:"Escribe una descripción.",
      VERSION_REQUIRED:"Indica la versión inicial.",
      PREVIEW_FILE_INVALID:"La imagen de preview no quedó disponible.",
      GAMES_ACTION_TIMEOUT:"La operación tardó demasiado.",
      GAMES_ACTION_FAILED:"No se pudo guardar el juego."
    };

    const messagesEn = {
      AUTH_REQUIRED:"Sign in with your Nexo Group account.",
      DEVELOPER_REQUIRED:"This account does not have developer permissions.",
      PREVIEW_TYPE_INVALID:"The preview must be PNG, JPG, or WEBP.",
      PREVIEW_TOO_LARGE:"The preview image is too large.",
      BUILD_TYPE_INVALID:"The build must be ZIP, APK, EXE, MSI, or 7Z.",
      BUILD_TOO_LARGE:"The build file is too large.",
      UPLOAD_FAILED:"The file upload could not be completed.",
      UPLOAD_PREPARE_FAILED:"The upload could not be prepared.",
      UPLOAD_TICKET_INVALID:"The upload authorization is no longer valid.",
      UPLOAD_TICKET_EXPIRED:"The upload authorization expired.",
      UPLOAD_FILE_NOT_READY:"Wix is still processing the file. Try publishing again.",
      UPLOAD_FILE_MISMATCH:"The uploaded file does not match the request.",
      TITLE_REQUIRED:"Enter the game title.",
      STAGE_INVALID:"Select a valid stage.",
      GENRE_REQUIRED:"Enter a genre.",
      DESCRIPTION_REQUIRED:"Enter a description.",
      VERSION_REQUIRED:"Enter the initial version.",
      PREVIEW_FILE_INVALID:"The preview image is not available.",
      GAMES_ACTION_TIMEOUT:"The operation took too long.",
      GAMES_ACTION_FAILED:"The game could not be saved."
    };

    return (lang() === "en" ? messagesEn : messagesEs)[code] ||
      (lang() === "en" ? messagesEn.GAMES_ACTION_FAILED : messagesEs.GAMES_ACTION_FAILED);
  }

  function removeModal() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.querySelectorAll("[data-r96-object-url]").forEach(node => {
      try { URL.revokeObjectURL(node.dataset.r96ObjectUrl); } catch (_) {}
    });
    modal.remove();
  }

  function openStudio() {
    if (!canPublish()) return;

    ensureStyle();
    removeModal();

    const backdrop = document.createElement("div");
    backdrop.id = MODAL_ID;
    backdrop.className = "r96-game-modal-backdrop";

    const modal = document.createElement("section");
    modal.className = "r96-game-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const head = document.createElement("div");
    head.className = "r96-game-modal-head";

    const title = document.createElement("h2");
    title.textContent = t("Agregar juego", "Add game");

    const close = document.createElement("button");
    close.className = "r96-game-modal-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", t("Cerrar", "Close"));
    close.addEventListener("click", removeModal);

    head.append(title, close);

    const grid = document.createElement("div");
    grid.className = "r96-game-studio-grid";

    const form = document.createElement("form");
    form.className = "r96-game-form";
    form.noValidate = true;

    const makeField = (labelText, node, smallText = "") => {
      const field = document.createElement("div");
      field.className = "r96-game-field";
      const label = document.createElement("label");
      label.textContent = labelText;
      if (node.id) label.htmlFor = node.id;
      field.append(label, node);
      if (smallText) {
        const small = document.createElement("small");
        small.textContent = smallText;
        field.appendChild(small);
      }
      return field;
    };

    const titleInput = document.createElement("input");
    titleInput.id = "r96-game-title";
    titleInput.maxLength = 100;
    titleInput.placeholder = t("Ej. Hallvalla", "e.g. Hallvalla");

    const previewInput = document.createElement("input");
    previewInput.id = "r96-game-preview";
    previewInput.type = "file";
    previewInput.accept = "image/png,image/jpeg,image/webp";

    const stageSelect = document.createElement("select");
    stageSelect.id = "r96-game-stage";
    for (const [value, label] of STAGES) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      stageSelect.appendChild(option);
    }

    const genreInput = document.createElement("input");
    genreInput.id = "r96-game-genre";
    genreInput.maxLength = 80;
    genreInput.placeholder = t("Ej. RPG táctico", "e.g. Tactical RPG");

    const row = document.createElement("div");
    row.className = "r96-game-form-row";
    row.append(
      makeField(t("Etapa", "Stage"), stageSelect),
      makeField(t("Género", "Genre"), genreInput)
    );

    const tagsField = document.createElement("div");
    tagsField.className = "r96-game-field";

    const tagsLabel = document.createElement("div");
    tagsLabel.className = "r96-field-label";
    tagsLabel.textContent = t("Etiquetas", "Tags");

    const tagEditor = document.createElement("div");
    tagEditor.className = "r96-tag-editor";

    const tagList = document.createElement("div");
    tagList.className = "r96-tag-list";

    const tagAdd = document.createElement("button");
    tagAdd.className = "r96-tag-add";
    tagAdd.type = "button";
    tagAdd.textContent = t("+ Agregar etiqueta", "+ Add tag");

    const tagEntry = document.createElement("div");
    tagEntry.className = "r96-tag-entry";
    tagEntry.hidden = true;

    const tagInput = document.createElement("input");
    tagInput.maxLength = 40;
    tagInput.placeholder = t("Escribe la etiqueta", "Enter tag");

    const tagAccept = document.createElement("button");
    tagAccept.type = "button";
    tagAccept.textContent = t("Aceptar", "Add");

    const tagCancel = document.createElement("button");
    tagCancel.type = "button";
    tagCancel.textContent = t("Cancelar", "Cancel");

    tagEntry.append(tagInput, tagAccept, tagCancel);
    tagEditor.append(tagList, tagAdd, tagEntry);
    tagsField.append(tagsLabel, tagEditor);

    const tags = [];

    function renderTags() {
      tagList.replaceChildren();
      for (const tag of tags) {
        const chip = document.createElement("span");
        chip.className = "r96-tag-chip";
        chip.appendChild(document.createTextNode(tag));

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", t("Quitar etiqueta", "Remove tag"));
        remove.addEventListener("click", () => {
          const index = tags.indexOf(tag);
          if (index >= 0) tags.splice(index, 1);
          renderTags();
          renderPreview();
        });

        chip.appendChild(remove);
        tagList.appendChild(chip);
      }
    }

    function addTag() {
      const value = clean(tagInput.value).replace(/\s+/g, " ").slice(0, 40);
      if (!value) return;
      if (!tags.some(tag => tag.toLowerCase() === value.toLowerCase())) {
        tags.push(value);
      }
      tagInput.value = "";
      tagEntry.hidden = true;
      tagAdd.hidden = false;
      renderTags();
      renderPreview();
    }

    tagAdd.addEventListener("click", () => {
      tagEntry.hidden = false;
      tagAdd.hidden = true;
      setTimeout(() => tagInput.focus(), 0);
    });

    tagAccept.addEventListener("click", addTag);
    tagCancel.addEventListener("click", () => {
      tagInput.value = "";
      tagEntry.hidden = true;
      tagAdd.hidden = false;
    });
    tagInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        addTag();
      }
    });

    const description = document.createElement("textarea");
    description.id = "r96-game-description";
    description.maxLength = 4000;
    description.placeholder = t(
      "Describe el juego. En la tarjeta se mostrarán solo dos líneas.",
      "Describe the game. Only two lines appear on the card."
    );

    const version = document.createElement("input");
    version.id = "r96-game-version";
    version.maxLength = 40;
    version.placeholder = "0.1.0";

    const build = document.createElement("input");
    build.id = "r96-game-build";
    build.type = "file";
    build.accept = ".zip,.apk,.exe,.msi,.7z";

    const feedback = document.createElement("div");
    feedback.className = "r96-game-feedback";
    feedback.setAttribute("aria-live", "polite");

    const submit = document.createElement("button");
    submit.className = "r96-game-submit";
    submit.type = "submit";
    submit.textContent = t("Publicar juego", "Publish game");

    form.append(
      makeField(t("Título del juego", "Game title"), titleInput),
      makeField(
        t("Imagen de preview", "Preview image"),
        previewInput,
        t("PNG, JPG o WEBP.", "PNG, JPG, or WEBP.")
      ),
      row,
      tagsField,
      makeField(t("Descripción", "Description"), description),
      makeField(t("Versión inicial", "Initial version"), version),
      makeField(
        t("Build del juego", "Game build"),
        build,
        t(
          "ZIP, APK, EXE, MSI o 7Z. Es obligatorio para Prototype, Build Preview, Slot y Released.",
          "ZIP, APK, EXE, MSI, or 7Z. Required for Prototype, Build Preview, Slot, and Released."
        )
      ),
      feedback,
      submit
    );

    const previewPanel = document.createElement("div");
    previewPanel.className = "r96-game-preview-panel";

    let localPreviewUrl = "";

    function previewData() {
      return {
        id:"preview",
        title:titleInput.value,
        stageKey:stageSelect.value,
        genre:genreInput.value,
        tags:[...tags],
        description:description.value,
        currentVersion:version.value,
        previewImage:localPreviewUrl
      };
    }

    function renderPreview() {
      previewPanel.replaceChildren(
        gameCard(previewData(), 0, true)
      );
    }

    [titleInput,genreInput,description,version].forEach(input => {
      input.addEventListener("input", renderPreview);
    });
    stageSelect.addEventListener("change", renderPreview);

    previewInput.addEventListener("change", () => {
      if (localPreviewUrl) {
        try { URL.revokeObjectURL(localPreviewUrl); } catch (_) {}
      }
      localPreviewUrl = previewInput.files?.[0]
        ? URL.createObjectURL(previewInput.files[0])
        : "";
      renderPreview();
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();

      feedback.dataset.error = "0";
      feedback.textContent = "";

      if (!canPublish()) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("DEVELOPER_REQUIRED");
        return;
      }

      const previewFile = previewInput.files?.[0] || null;
      const buildFile = build.files?.[0] || null;
      const stageKey = stageSelect.value;
      const buildRequired = ["prototype","build-preview","slot","released"].includes(stageKey);

      if (!clean(titleInput.value)) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("TITLE_REQUIRED");
        return;
      }
      if (!previewFile) {
        feedback.dataset.error = "1";
        feedback.textContent = t("Selecciona una imagen de preview.", "Select a preview image.");
        return;
      }
      if (!clean(genreInput.value)) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("GENRE_REQUIRED");
        return;
      }
      if (!clean(description.value)) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("DESCRIPTION_REQUIRED");
        return;
      }
      if (!clean(version.value)) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("VERSION_REQUIRED");
        return;
      }
      if (buildRequired && !buildFile) {
        feedback.dataset.error = "1";
        feedback.textContent = t(
          "Esta etapa requiere cargar un build del juego.",
          "This stage requires a game build."
        );
        return;
      }

      submit.disabled = true;

      try {
        feedback.textContent = t("Subiendo imagen…", "Uploading preview…");
        const previewUpload = await uploadFile("preview", previewFile);

        let buildUpload = {};
        if (buildFile) {
          feedback.textContent = t("Subiendo build…", "Uploading build…");
          buildUpload = await uploadFile("build", buildFile);
        }

        feedback.textContent = t("Publicando juego…", "Publishing game…");

        await studioAction("game.create", {
          title:titleInput.value,
          stageKey,
          genre:genreInput.value,
          tags,
          description:description.value,
          currentVersion:version.value,
          previewUpload,
          buildUpload
        });

        feedback.dataset.error = "0";
        feedback.textContent = t("Juego publicado.", "Game published.");

        setTimeout(() => {
          removeModal();
        }, 650);
      } catch (error) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage(
          clean(error?.message || "GAMES_ACTION_FAILED")
        );
      } finally {
        submit.disabled = false;
      }
    });

    grid.append(form, previewPanel);
    modal.append(head, grid);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) removeModal();
    });

    renderPreview();
  }

  function postReady() {
    if (window.parent === window) return;
    window.parent.postMessage({
      source: SOURCE_UI,
      protocol: PROTOCOL,
      type: "ready"
    }, HOST_ORIGIN);
  }

  window.addEventListener("message", event => {
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
      return;
    }

    if (message.type === "studio-result") {
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
            clean(message.data?.error || "GAMES_ACTION_FAILED")
          )
        );
      }
    }
  });

  ensureStyle();

  carousel.replaceChildren();
  carousel.hidden = true;

  if (titleCopy) {
    titleCopy.textContent = t(
      "Cargando juegos publicados…",
      "Loading published games…"
    );
  }

  installStudioObserver();
  postReady();

  let retries = 0;
  const retry = setInterval(() => {
    retries += 1;
    postReady();
    syncAddGameButton();
    if (retries >= 8) clearInterval(retry);
  }, 1000);
})();
