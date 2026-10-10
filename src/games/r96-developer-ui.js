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
  let currentGames = [];
  let currentScope = "own";

  const STAGES = [
    ["concept", "Concept"],
    ["prototype", "Prototype"],
    ["build-preview", "Build Preview"],
    ["slot", "Slot"],
    ["future-release", "Future Release"],
    ["released", "Released"]
  ];

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
      }, 30000);

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

  function directUpload(prepared, file, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", prepared.uploadUrl, true);
      xhr.setRequestHeader(
        "Content-Type",
        prepared.mimeType ||
          file.type ||
          "application/octet-stream"
      );

      xhr.upload.onprogress = event => {
        if (!event.lengthComputable) return;
        onProgress(event.loaded / event.total);
      };

      xhr.onerror = () => reject(new Error("UPLOAD_FAILED"));
      xhr.onabort = () => reject(new Error("UPLOAD_CANCELLED"));
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error("UPLOAD_FAILED"));
          return;
        }

        let payload = null;
        try {
          payload = JSON.parse(xhr.responseText || "{}");
        } catch (_) {}

        const fileId = clean(
          payload?.file?.id ||
          payload?.file?._id
        );

        if (!fileId) {
          reject(new Error("UPLOAD_FAILED"));
          return;
        }

        onProgress(1);
        resolve({
          ticket: clean(prepared.ticket),
          fileId
        });
      };

      xhr.send(file);
    });
  }

  async function uploadFile(kind, file, onProgress) {
    const prepared = await studioAction("upload.prepare", {
      kind,
      fileName: file.name,
      mimeType: file.type || "",
      sizeInBytes: file.size
    });

    const uploadUrl = clean(prepared?.uploadUrl);
    if (!uploadUrl) {
      throw new Error("UPLOAD_PREPARE_FAILED");
    }

    return directUpload(prepared, file, onProgress);
  }

  function formatDate(value) {
    const raw = clean(value);
    if (!raw) return "—";

    const date = new Date(raw);
    if (!Number.isFinite(date.getTime())) return "—";

    try {
      return new Intl.DateTimeFormat(
        lang() === "en" ? "en-US" : "es",
        {
          year: "numeric",
          month: "short",
          day: "numeric"
        }
      ).format(date);
    } catch (_) {
      return raw.slice(0, 10);
    }
  }

  function formatBytes(value) {
    const bytes = Number(value || 0);
    if (!Number.isFinite(bytes) || bytes <= 0) return "—";

    const units = ["B", "KB", "MB", "GB"];
    let amount = bytes;
    let unit = 0;

    while (amount >= 1024 && unit < units.length - 1) {
      amount /= 1024;
      unit += 1;
    }

    return (
      amount.toFixed(unit >= 2 ? 1 : 0) +
      " " +
      units[unit]
    );
  }

  function errorMessage(error) {
    const code = clean(error?.message || error);

    const es = {
      GAME_PERMISSION_REQUIRED:
        "No tienes permiso para administrar este juego.",
      GAME_NOT_FOUND:
        "El juego ya no está disponible.",
      VERSION_REQUIRED:
        "Escribe el número o nombre de la nueva versión.",
      VERSION_INVALID:
        "La versión contiene caracteres no permitidos.",
      VERSION_ALREADY_EXISTS:
        "Ese número de versión ya existe para este juego.",
      VERSION_NOT_FOUND:
        "La versión ya no está disponible.",
      VERSION_NOT_ACTIVATABLE:
        "Esta versión no se puede activar.",
      TITLE_REQUIRED:
        "Escribe un nombre válido para el juego.",
      STAGE_INVALID:
        "Selecciona una etapa válida.",
      GENRE_REQUIRED:
        "Escribe el género.",
      DESCRIPTION_REQUIRED:
        "Escribe una descripción.",
      PREVIEW_TYPE_INVALID:
        "La portada debe ser PNG, JPG o WEBP.",
      PREVIEW_TOO_LARGE:
        "La portada supera el tamaño permitido.",
      BUILD_TYPE_INVALID:
        "El build debe ser ZIP, APK, EXE, MSI o 7Z.",
      BUILD_TOO_LARGE:
        "El build supera el tamaño permitido.",
      UPLOAD_PREPARE_FAILED:
        "No se pudo preparar la subida.",
      UPLOAD_FAILED:
        "No se pudo completar la subida.",
      UPLOAD_TICKET_INVALID:
        "La autorización de subida ya no es válida.",
      UPLOAD_TICKET_EXPIRED:
        "La autorización de subida expiró.",
      UPLOAD_FILE_NOT_READY:
        "Wix todavía está procesando el archivo. Intenta de nuevo.",
      UPLOAD_FILE_MISMATCH:
        "El archivo subido no coincide con la solicitud.",
      GAME_CAPABILITY_INVALID:
        "La autorización de administración ya no es válida. Actualiza la página.",
      GAME_CAPABILITY_EXPIRED:
        "La autorización de administración expiró. Actualiza la página.",
      DEVELOPER_REQUIRED:
        "Esta cuenta no tiene permisos de desarrollador.",
      DEVELOPER_ACTION_TIMEOUT:
        "La operación tardó demasiado.",
      GAMES_ACTION_FAILED:
        "No se pudo completar la operación."
    };

    const en = {
      GAME_PERMISSION_REQUIRED:
        "You do not have permission to manage this game.",
      GAME_NOT_FOUND:
        "The game is no longer available.",
      VERSION_REQUIRED:
        "Enter a version number or name.",
      VERSION_INVALID:
        "The version contains unsupported characters.",
      VERSION_ALREADY_EXISTS:
        "That version already exists for this game.",
      VERSION_NOT_FOUND:
        "The version is no longer available.",
      VERSION_NOT_ACTIVATABLE:
        "This version cannot be activated.",
      TITLE_REQUIRED:
        "Enter a valid game title.",
      STAGE_INVALID:
        "Select a valid stage.",
      GENRE_REQUIRED:
        "Enter a genre.",
      DESCRIPTION_REQUIRED:
        "Enter a description.",
      PREVIEW_TYPE_INVALID:
        "The cover must be PNG, JPG, or WEBP.",
      PREVIEW_TOO_LARGE:
        "The cover image is too large.",
      BUILD_TYPE_INVALID:
        "The build must be ZIP, APK, EXE, MSI, or 7Z.",
      BUILD_TOO_LARGE:
        "The build file is too large.",
      UPLOAD_PREPARE_FAILED:
        "The upload could not be prepared.",
      UPLOAD_FAILED:
        "The upload could not be completed.",
      UPLOAD_TICKET_INVALID:
        "The upload authorization is no longer valid.",
      UPLOAD_TICKET_EXPIRED:
        "The upload authorization expired.",
      UPLOAD_FILE_NOT_READY:
        "Wix is still processing the file. Try again.",
      UPLOAD_FILE_MISMATCH:
        "The uploaded file does not match the request.",
      GAME_CAPABILITY_INVALID:
        "Management authorization is no longer valid. Refresh the page.",
      GAME_CAPABILITY_EXPIRED:
        "Management authorization expired. Refresh the page.",
      DEVELOPER_REQUIRED:
        "This account does not have developer permissions.",
      DEVELOPER_ACTION_TIMEOUT:
        "The operation took too long.",
      GAMES_ACTION_FAILED:
        "The operation could not be completed."
    };

    const table = lang() === "en" ? en : es;
    return table[code] ||
      (lang() === "en"
        ? en.GAMES_ACTION_FAILED
        : es.GAMES_ACTION_FAILED);
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
        width:min(1120px,100%);
        max-height:min(94vh,940px);
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
        padding:18px 4px;
        color:var(--r96-muted);
        font-size:.82rem;
        font-weight:750;
        line-height:1.55;
      }
      .r96-dev-status[data-error="1"]{color:#ff9eaa}
      .r96-dev-status[data-success="1"]{color:var(--r96-accent)}
      .r96-dev-scope{
        display:inline-flex;
        align-items:center;
        min-height:28px;
        margin-bottom:15px;
        padding:0 10px;
        border:1px solid var(--r96-line);
        border-radius:999px;
        color:var(--r96-muted);
        background:var(--r96-panel);
        font-size:.68rem;
        font-weight:850;
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
      .r96-dev-secondary,
      .r96-dev-danger{
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
      .r96-dev-danger{
        border:1px solid rgba(255,120,135,.38);
        background:rgba(255,120,135,.08);
        color:var(--r96-text);
      }
      .r96-dev-primary:disabled,
      .r96-dev-secondary:disabled,
      .r96-dev-danger:disabled{
        opacity:.55;
        cursor:default;
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
      .r96-dev-section{
        display:grid;
        gap:14px;
        padding:17px;
        border:1px solid var(--r96-line);
        border-radius:17px;
        background:var(--r96-panel);
      }
      .r96-dev-section-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:14px;
      }
      .r96-dev-section-head h4{
        margin:0;
        font-size:.95rem;
      }
      .r96-dev-section-head p{
        margin:4px 0 0;
        color:var(--r96-muted);
        font-size:.72rem;
        line-height:1.5;
      }
      .r96-dev-form{
        display:grid;
        gap:13px;
      }
      .r96-dev-form-row{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
      }
      .r96-dev-field{
        display:grid;
        gap:6px;
      }
      .r96-dev-field label{
        color:var(--r96-text);
        font-size:.72rem;
        font-weight:900;
      }
      .r96-dev-field small{
        color:var(--r96-muted);
        font-size:.67rem;
        line-height:1.45;
      }
      .r96-dev-field input,
      .r96-dev-field select,
      .r96-dev-field textarea{
        width:100%;
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:var(--r96-bg-3);
        color:var(--r96-text);
        padding:11px 12px;
        font:inherit;
        outline:none;
      }
      .r96-dev-field textarea{
        min-height:108px;
        resize:vertical;
      }
      .r96-dev-field input:focus,
      .r96-dev-field select:focus,
      .r96-dev-field textarea:focus{
        border-color:var(--r96-accent);
        box-shadow:0 0 0 3px color-mix(in srgb,var(--r96-accent) 13%,transparent);
      }
      .r96-dev-check{
        display:flex;
        align-items:center;
        gap:9px;
        color:var(--r96-text);
        font-size:.75rem;
        font-weight:850;
      }
      .r96-dev-check input{width:auto}
      .r96-dev-form-actions{
        display:flex;
        align-items:center;
        gap:10px;
        flex-wrap:wrap;
      }
      .r96-dev-progress{
        min-width:130px;
        color:var(--r96-muted);
        font-size:.7rem;
        font-weight:800;
      }
      .r96-dev-history{
        display:grid;
        gap:10px;
      }
      .r96-dev-version{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:14px;
        align-items:center;
        padding:13px;
        border:1px solid var(--r96-line);
        border-radius:13px;
        background:var(--r96-bg-3);
      }
      .r96-dev-version-main{display:grid;gap:5px}
      .r96-dev-version-title{
        display:flex;
        align-items:center;
        gap:8px;
        flex-wrap:wrap;
      }
      .r96-dev-version-title strong{font-size:.86rem}
      .r96-dev-version-status{
        display:inline-flex;
        align-items:center;
        min-height:23px;
        padding:0 8px;
        border-radius:999px;
        border:1px solid var(--r96-line);
        color:var(--r96-muted);
        font-size:.62rem;
        font-weight:900;
        text-transform:uppercase;
      }
      .r96-dev-version-status[data-active="1"]{
        color:var(--r96-accent);
        border-color:color-mix(in srgb,var(--r96-accent) 42%,var(--r96-line));
      }
      .r96-dev-version-meta{
        color:var(--r96-muted);
        font-size:.68rem;
        line-height:1.5;
      }
      .r96-dev-version-notes{
        margin:0;
        color:var(--r96-muted);
        font-size:.72rem;
        line-height:1.5;
      }
      @media(max-width:760px){
        .r96-dev-backdrop{padding:10px}
        .r96-dev-shell{
          width:100%;
          max-height:96vh;
          border-radius:19px;
        }
        .r96-dev-content{padding:14px}
        .r96-dev-grid,
        .r96-dev-summary,
        .r96-dev-form-row{
          grid-template-columns:1fr;
        }
        .r96-dev-meta{grid-template-columns:1fr 1fr}
        .r96-dev-version{
          grid-template-columns:1fr;
        }
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

    return { content };
  }

  function metaCell(label, value) {
    const card = document.createElement("article");
    const small = document.createElement("span");
    small.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = clean(value) || "—";
    card.append(small, strong);
    return card;
  }

  function field(labelText, control, help = "") {
    const wrap = document.createElement("div");
    wrap.className = "r96-dev-field";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.appendChild(control);

    if (
      control.tagName === "INPUT" &&
      (control.type === "checkbox" || control.type === "radio")
    ) {
      return label;
    }

    wrap.append(label);

    if (help) {
      const small = document.createElement("small");
      small.textContent = help;
      wrap.appendChild(small);
    }

    return wrap;
  }

  function labeledField(labelText, control, help = "") {
    const wrap = document.createElement("div");
    wrap.className = "r96-dev-field";

    const label = document.createElement("label");
    label.textContent = labelText;
    wrap.append(label, control);

    if (help) {
      const small = document.createElement("small");
      small.textContent = help;
      wrap.appendChild(small);
    }

    return wrap;
  }

  function statusNode() {
    const node = document.createElement("span");
    node.className = "r96-dev-progress";
    node.setAttribute("role", "status");
    node.setAttribute("aria-live", "polite");
    return node;
  }

  function setStatus(node, text, type = "") {
    node.textContent = clean(text);
    node.dataset.error = type === "error" ? "1" : "0";
    node.dataset.success = type === "success" ? "1" : "0";
  }

  function updateGameInState(updated) {
    const index = currentGames.findIndex(
      game => game.id === updated.id
    );

    if (index >= 0) {
      currentGames[index] = updated;
    } else {
      currentGames.unshift(updated);
    }
  }

  async function loadGames() {
    const data = await studioAction("developer.games.list");
    currentGames = Array.isArray(data?.games)
      ? data.games
      : [];
    currentScope = clean(data?.scope) || "own";
    return data;
  }

  async function loadVersions(gameId) {
    const data = await studioAction(
      "developer.versions.list",
      { gameId }
    );

    return Array.isArray(data?.versions)
      ? data.versions
      : [];
  }

  function renderList(content) {
    content.replaceChildren();

    const scope = document.createElement("div");
    scope.className = "r96-dev-scope";
    scope.textContent =
      currentScope === "global"
        ? t(
            "Wonder · administración global",
            "Wonder · global administration"
          )
        : t(
            "Tus juegos",
            "Your games"
          );
    content.appendChild(scope);

    if (!currentGames.length) {
      const empty = document.createElement("p");
      empty.className = "r96-dev-status";
      empty.textContent = t(
        "Todavía no tienes juegos administrables.",
        "You do not have any manageable games yet."
      );
      content.appendChild(empty);
      return;
    }

    const grid = document.createElement("div");
    grid.className = "r96-dev-grid";

    currentGames.forEach(game => {
      const card = document.createElement("article");
      card.className = "r96-dev-card";

      const preview = document.createElement("div");
      preview.className = "r96-dev-card-preview";

      const image = clean(game.previewImage);
      if (image) {
        preview.style.backgroundImage =
          "linear-gradient(180deg,transparent,rgba(0,0,0,.5)),url(" +
          JSON.stringify(image) +
          ")";
        preview.style.backgroundPosition =
          Number(game.previewPositionX || 50) +
          "% " +
          Number(game.previewPositionY || 50) +
          "%";
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

      const version = document.createElement("div");
      version.textContent = t("Versión", "Version");
      const versionStrong = document.createElement("strong");
      versionStrong.textContent = clean(game.currentVersion) || "—";
      version.appendChild(versionStrong);

      const state = document.createElement("div");
      state.textContent = t("Estado", "Status");
      const stateStrong = document.createElement("strong");
      stateStrong.textContent = game.published
        ? t("Publicado", "Published")
        : t("Oculto", "Hidden");
      state.appendChild(stateStrong);

      const genre = document.createElement("div");
      genre.textContent = t("Género", "Genre");
      const genreStrong = document.createElement("strong");
      genreStrong.textContent = clean(game.genre) || "—";
      genre.appendChild(genreStrong);

      const updated = document.createElement("div");
      updated.textContent = t("Actualizado", "Updated");
      const updatedStrong = document.createElement("strong");
      updatedStrong.textContent =
        formatDate(game.versionUpdatedAt || game.updatedAt);
      updated.appendChild(updatedStrong);

      meta.append(version, state, genre, updated);

      const actions = document.createElement("div");
      actions.className = "r96-dev-actions";

      const manage = document.createElement("button");
      manage.className = "r96-dev-primary";
      manage.type = "button";
      manage.textContent = t("Administrar", "Manage");
      manage.addEventListener("click", () => {
        void renderAdmin(content, game.id);
      });

      actions.appendChild(manage);
      body.append(title, meta, actions);
      card.append(preview, body);
      grid.appendChild(card);
    });

    content.appendChild(grid);
  }

  function renderVersionHistory(
    host,
    game,
    versions,
    content
  ) {
    host.replaceChildren();

    if (!versions.length) {
      const empty = document.createElement("p");
      empty.className = "r96-dev-status";
      empty.textContent = t(
        "Este juego todavía no tiene historial de versiones.",
        "This game does not have version history yet."
      );
      host.appendChild(empty);
      return;
    }

    versions.forEach(version => {
      const row = document.createElement("article");
      row.className = "r96-dev-version";

      const main = document.createElement("div");
      main.className = "r96-dev-version-main";

      const title = document.createElement("div");
      title.className = "r96-dev-version-title";

      const strong = document.createElement("strong");
      strong.textContent =
        "v" + clean(version.versionLabel || "—");

      const status = document.createElement("span");
      status.className = "r96-dev-version-status";
      status.dataset.active = version.active ? "1" : "0";
      status.textContent = version.active
        ? t("Activa", "Active")
        : clean(version.status || "—");

      title.append(strong, status);

      const meta = document.createElement("div");
      meta.className = "r96-dev-version-meta";
      meta.textContent = [
        formatDate(version.publishedAt || version.createdAt),
        clean(version.buildFileName),
        formatBytes(version.buildSizeInBytes)
      ].filter(Boolean).join(" · ");

      main.append(title, meta);

      if (clean(version.releaseNotes)) {
        const notes = document.createElement("p");
        notes.className = "r96-dev-version-notes";
        notes.textContent = clean(version.releaseNotes);
        main.appendChild(notes);
      }

      const action = document.createElement("button");
      action.className = version.active
        ? "r96-dev-secondary"
        : "r96-dev-primary";
      action.type = "button";

      if (version.active) {
        action.textContent = t("Activa", "Active");
        action.disabled = true;
      } else if (
        ["ready", "archived"].includes(
          clean(version.status).toLowerCase()
        )
      ) {
        action.textContent =
          clean(version.status).toLowerCase() === "archived"
            ? t("Restaurar", "Restore")
            : t("Activar", "Activate");

        action.addEventListener("click", async () => {
          if (action.disabled) return;

          action.disabled = true;
          const previous = action.textContent;
          action.textContent = t("Activando…", "Activating…");

          try {
            const result = await studioAction(
              "developer.version.activate",
              {
                gameId: game.id,
                versionId: version.id
              }
            );

            if (result?.game) {
              updateGameInState(result.game);
            }

            await renderAdmin(
              content,
              game.id,
              t(
                "Versión activada correctamente.",
                "Version activated successfully."
              )
            );
          } catch (error) {
            action.disabled = false;
            action.textContent = previous;
            alert(errorMessage(error));
          }
        });
      } else {
        action.textContent = t(
          "No disponible",
          "Unavailable"
        );
        action.disabled = true;
      }

      row.append(main, action);
      host.appendChild(row);
    });
  }

  function metadataSection(game, content) {
    const section = document.createElement("section");
    section.className = "r96-dev-section";

    const head = document.createElement("div");
    head.className = "r96-dev-section-head";

    const copy = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = t("Editar ficha", "Edit listing");
    const subtitle = document.createElement("p");
    subtitle.textContent = t(
      "Estos cambios afectan la ficha pública, no crean una versión nueva.",
      "These changes affect the public listing and do not create a new build version."
    );
    copy.append(title, subtitle);
    head.appendChild(copy);

    const form = document.createElement("form");
    form.className = "r96-dev-form";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.maxLength = 100;
    titleInput.value = clean(game.title);

    const genreInput = document.createElement("input");
    genreInput.type = "text";
    genreInput.maxLength = 80;
    genreInput.value = clean(game.genre);

    const stageSelect = document.createElement("select");
    STAGES.forEach(([key, label]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = label;
      option.selected = key === clean(game.stageKey);
      stageSelect.appendChild(option);
    });

    const tagsInput = document.createElement("input");
    tagsInput.type = "text";
    tagsInput.value = Array.isArray(game.tags)
      ? game.tags.join(", ")
      : "";

    const description = document.createElement("textarea");
    description.maxLength = 4000;
    description.value = clean(game.description);

    const previewInput = document.createElement("input");
    previewInput.type = "file";
    previewInput.accept = "image/png,image/jpeg,image/webp";

    const published = document.createElement("input");
    published.type = "checkbox";
    published.checked = game.published === true;

    const publishedLabel = document.createElement("label");
    publishedLabel.className = "r96-dev-check";
    publishedLabel.append(
      published,
      document.createTextNode(
        t(
          "Visible en el catálogo público",
          "Visible in the public catalog"
        )
      )
    );

    const row1 = document.createElement("div");
    row1.className = "r96-dev-form-row";
    row1.append(
      labeledField(t("Nombre", "Title"), titleInput),
      labeledField(t("Género", "Genre"), genreInput)
    );

    const row2 = document.createElement("div");
    row2.className = "r96-dev-form-row";
    row2.append(
      labeledField(t("Etapa", "Stage"), stageSelect),
      labeledField(
        t("Etiquetas", "Tags"),
        tagsInput,
        t(
          "Sepáralas con comas.",
          "Separate them with commas."
        )
      )
    );

    const actions = document.createElement("div");
    actions.className = "r96-dev-form-actions";

    const save = document.createElement("button");
    save.className = "r96-dev-primary";
    save.type = "submit";
    save.textContent = t("Guardar cambios", "Save changes");

    const status = statusNode();

    actions.append(save, status);

    form.append(
      row1,
      row2,
      labeledField(
        t("Descripción", "Description"),
        description
      ),
      labeledField(
        t("Nueva portada (opcional)", "New cover (optional)"),
        previewInput,
        t(
          "PNG, JPG o WEBP. Si no eliges archivo, se conserva la portada actual.",
          "PNG, JPG, or WEBP. If no file is selected, the current cover remains."
        )
      ),
      publishedLabel,
      actions
    );

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (save.disabled) return;

      save.disabled = true;
      setStatus(status, t("Guardando…", "Saving…"));

      try {
        let previewUpload = {};
        const previewFile = previewInput.files?.[0] || null;

        if (previewFile) {
          previewUpload = await uploadFile(
            "preview",
            previewFile,
            ratio => {
              setStatus(
                status,
                t(
                  "Subiendo portada " +
                    Math.round(ratio * 100) +
                    "%…",
                  "Uploading cover " +
                    Math.round(ratio * 100) +
                    "%…"
                )
              );
            }
          );
        }

        const result = await studioAction(
          "developer.game.update",
          {
            gameId: game.id,
            title: titleInput.value,
            genre: genreInput.value,
            stageKey: stageSelect.value,
            tags: tagsInput.value
              .split(",")
              .map(item => clean(item))
              .filter(Boolean),
            description: description.value,
            published: published.checked,
            previewUpload
          }
        );

        if (result?.game) {
          updateGameInState(result.game);
        }

        await renderAdmin(
          content,
          game.id,
          t(
            "La ficha se actualizó correctamente.",
            "The listing was updated successfully."
          )
        );
      } catch (error) {
        save.disabled = false;
        setStatus(
          status,
          errorMessage(error),
          "error"
        );
      }
    });

    section.append(head, form);
    return section;
  }

  function newVersionSection(game, content) {
    const section = document.createElement("section");
    section.className = "r96-dev-section";

    const head = document.createElement("div");
    head.className = "r96-dev-section-head";

    const copy = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = t(
      "Publicar actualización",
      "Publish update"
    );
    const subtitle = document.createElement("p");
    subtitle.textContent = t(
      "La nueva versión queda lista, pero no reemplaza la activa hasta que pulses Activar.",
      "The new version becomes ready, but it does not replace the active build until you activate it."
    );
    copy.append(title, subtitle);
    head.appendChild(copy);

    const form = document.createElement("form");
    form.className = "r96-dev-form";

    const versionInput = document.createElement("input");
    versionInput.type = "text";
    versionInput.maxLength = 40;
    versionInput.placeholder =
      clean(game.currentVersion) === "0.1.5"
        ? "0.1.6"
        : t("Ej. 1.0.1", "e.g. 1.0.1");

    const runtime = document.createElement("select");
    [
      ["html", "HTML"],
      ["", t("Detectar por archivo", "Detect from file")]
    ].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      runtime.appendChild(option);
    });

    const buildInput = document.createElement("input");
    buildInput.type = "file";
    buildInput.accept = ".zip,.apk,.exe,.msi,.7z";

    const notes = document.createElement("textarea");
    notes.maxLength = 4000;
    notes.placeholder = t(
      "Qué cambió en esta versión…",
      "What changed in this version…"
    );

    const row = document.createElement("div");
    row.className = "r96-dev-form-row";
    row.append(
      labeledField(
        t("Nueva versión", "New version"),
        versionInput
      ),
      labeledField(
        t("Runtime", "Runtime"),
        runtime
      )
    );

    const actions = document.createElement("div");
    actions.className = "r96-dev-form-actions";

    const create = document.createElement("button");
    create.className = "r96-dev-primary";
    create.type = "submit";
    create.textContent = t(
      "Subir actualización",
      "Upload update"
    );

    const status = statusNode();
    actions.append(create, status);

    form.append(
      row,
      labeledField(
        t("Build", "Build"),
        buildInput,
        t(
          "ZIP para juegos HTML; también se admiten APK, EXE, MSI y 7Z.",
          "ZIP for HTML games; APK, EXE, MSI, and 7Z are also supported."
        )
      ),
      labeledField(
        t("Notas de versión", "Release notes"),
        notes
      ),
      actions
    );

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (create.disabled) return;

      const file = buildInput.files?.[0] || null;
      if (!file) {
        setStatus(
          status,
          t(
            "Selecciona el build de la nueva versión.",
            "Select the new version build."
          ),
          "error"
        );
        return;
      }

      create.disabled = true;
      setStatus(status, t("Preparando…", "Preparing…"));

      try {
        const buildUpload = await uploadFile(
          "build",
          file,
          ratio => {
            setStatus(
              status,
              t(
                "Subiendo " +
                  Math.round(ratio * 100) +
                  "%…",
                "Uploading " +
                  Math.round(ratio * 100) +
                  "%…"
              )
            );
          }
        );

        await studioAction(
          "developer.version.create",
          {
            gameId: game.id,
            versionLabel: versionInput.value,
            releaseNotes: notes.value,
            runtimeType: runtime.value,
            buildUpload
          }
        );

        await renderAdmin(
          content,
          game.id,
          t(
            "La nueva versión quedó lista. Revísala en el historial y actívala cuando quieras publicarla.",
            "The new version is ready. Review it in history and activate it when you want to publish it."
          )
        );
      } catch (error) {
        create.disabled = false;
        setStatus(
          status,
          errorMessage(error),
          "error"
        );
      }
    });

    section.append(head, form);
    return section;
  }

  async function renderAdmin(
    content,
    gameId,
    flash = ""
  ) {
    const game = currentGames.find(
      item => item.id === gameId
    );

    if (!game) {
      renderList(content);
      return;
    }

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
    p.textContent =
      game.ownedByCurrentUser === false &&
      currentScope === "global"
        ? t(
            "Administración global Wonder.",
            "Wonder global administration."
          )
        : t(
            "Administración del juego.",
            "Game management."
          );

    title.append(h3, p);

    const back = document.createElement("button");
    back.className = "r96-dev-secondary";
    back.type = "button";
    back.textContent = t(
      "← Mis juegos",
      "← My games"
    );
    back.addEventListener("click", () => renderList(content));

    top.append(title, back);

    const summary = document.createElement("div");
    summary.className = "r96-dev-summary";
    summary.append(
      metaCell(
        t("Versión activa", "Active version"),
        game.currentVersion
      ),
      metaCell(
        t("Etapa", "Stage"),
        game.stageLabel || game.stageKey
      ),
      metaCell(
        t("Visibilidad", "Visibility"),
        game.published
          ? t("Publicado", "Published")
          : t("Oculto", "Hidden")
      )
    );

    admin.append(top, summary);

    if (flash) {
      const flashNode = document.createElement("p");
      flashNode.className = "r96-dev-status";
      flashNode.dataset.success = "1";
      flashNode.textContent = flash;
      admin.appendChild(flashNode);
    }

    admin.append(
      metadataSection(game, content),
      newVersionSection(game, content)
    );

    const historySection = document.createElement("section");
    historySection.className = "r96-dev-section";

    const historyHead = document.createElement("div");
    historyHead.className = "r96-dev-section-head";

    const historyCopy = document.createElement("div");
    const historyTitle = document.createElement("h4");
    historyTitle.textContent = t(
      "Historial de versiones",
      "Version history"
    );

    const historySubtitle = document.createElement("p");
    historySubtitle.textContent = t(
      "Activar una versión archivada funciona como rollback y no vuelve a subir archivos.",
      "Activating an archived version performs a rollback without uploading files again."
    );

    historyCopy.append(historyTitle, historySubtitle);
    historyHead.appendChild(historyCopy);

    const history = document.createElement("div");
    history.className = "r96-dev-history";

    const loading = document.createElement("p");
    loading.className = "r96-dev-status";
    loading.textContent = t(
      "Cargando historial…",
      "Loading history…"
    );
    history.appendChild(loading);

    historySection.append(historyHead, history);
    admin.appendChild(historySection);
    content.appendChild(admin);

    try {
      const versions = await loadVersions(game.id);
      renderVersionHistory(
        history,
        game,
        versions,
        content
      );
    } catch (error) {
      history.replaceChildren();
      const failure = document.createElement("p");
      failure.className = "r96-dev-status";
      failure.dataset.error = "1";
      failure.textContent = errorMessage(error);
      history.appendChild(failure);
    }
  }

  async function openDeveloperSpace() {
    const { content } = shell();

    const loading = document.createElement("p");
    loading.className = "r96-dev-status";
    loading.textContent = t(
      "Cargando juegos administrables…",
      "Loading manageable games…"
    );
    content.appendChild(loading);

    try {
      await loadGames();
      renderList(content);
    } catch (error) {
      content.replaceChildren();
      const failure = document.createElement("p");
      failure.className = "r96-dev-status";
      failure.dataset.error = "1";
      failure.textContent = errorMessage(error);
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
      void openDeveloperSpace();
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
          clean(
            message.data?.error ||
            "GAMES_ACTION_FAILED"
          )
        )
      );
    }
  });

  installObserver();
})();
