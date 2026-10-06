(() => {
  "use strict";

  const RELEASE = "6.0.2";
  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const PUBLISHED_RISING =
    "https://dtokurisu.wixstudio.com/my-site-1/blank-9?nexoAuth=login";
  const SOURCE = "r96-wix-auth";
  const PROTOCOL = 1;
  const REQUEST_TIMEOUT = 12000;

  let account;
  let hero;
  let notice;
  let menu;
  let state = "connecting";
  let requestId = 0;
  let timeout;
  let retry;
  let attempts = 0;
  let lastSequence = -1;

  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    account?.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!menu || state !== "signedIn") return;
    menu.hidden = !menu.hidden;
    account?.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
  }

  function render(next, member, message = "") {
    state = next;

    const busy = next === "connecting" || next === "signingIn";
    const signedIn = next === "signedIn";
    const name = String(member?.displayName || "Mi cuenta");
    const label = signedIn
      ? name
      : busy
        ? next === "connecting"
          ? "Comprobando sesión…"
          : "Iniciando sesión en Nexo Group…"
        : "Iniciar sesión en Nexo Group";

    account.disabled = busy;
    account.dataset.r96AuthState = next;
    account.setAttribute("aria-busy", String(busy));
    account.setAttribute("aria-haspopup", signedIn ? "menu" : "false");
    if (!signedIn) closeMenu();

    account.querySelector(".r96-account-copy strong").textContent = label;
    account.querySelector(".r96-account-copy small").textContent = signedIn
      ? "Cuenta Nexo Group"
      : "Una cuenta para todo Nexo";
    account.querySelector(".r96-account-icon").textContent = signedIn
      ? name.charAt(0).toUpperCase()
      : "R";
    account.querySelector(".r96-account-caret").textContent = signedIn ? "⌄" : "";

    hero.disabled = busy || signedIn;
    hero.textContent = signedIn ? "Sesión iniciada en Nexo Group" : label;

    notice.textContent = message;
    notice.hidden = !message;
  }

  function installMenu() {
    const wrap = document.createElement("div");
    wrap.className = "r96-account-menu-wrap";
    account.parentNode.insertBefore(wrap, account);
    wrap.appendChild(account);

    wrap.style.position = "relative";

    menu = document.createElement("div");
    menu.className = "r96-account-menu";
    menu.hidden = true;
    menu.setAttribute("role", "menu");
    menu.style.cssText =
      "position:absolute;right:0;top:calc(100% + 10px);min-width:210px;padding:8px;" +
      "border:1px solid var(--r96-line);border-radius:16px;background:var(--r96-bg-2);" +
      "box-shadow:0 18px 50px rgba(0,0,0,.28);z-index:500;";

    menu.innerHTML =
      '<button type="button" data-r96-account-action="profile">Editar perfil</button>' +
      '<button type="button" data-r96-account-action="switch">Cambiar cuenta</button>' +
      '<button type="button" data-r96-account-action="logout">Cerrar sesión</button>';

    menu.querySelectorAll("button").forEach((button) => {
      button.style.cssText =
        "display:block;width:100%;padding:11px 12px;border:0;border-radius:10px;" +
        "background:transparent;color:var(--r96-text);text-align:left;font:inherit;cursor:pointer;";
      button.addEventListener("mouseenter", () => {
        button.style.background = "var(--r96-bg-2)";
      });
      button.addEventListener("mouseleave", () => {
        button.style.background = "transparent";
      });
      button.addEventListener("click", () => accountAction(button.dataset.r96AccountAction));
    });

    wrap.appendChild(menu);
  }

  function stopTimers() {
    clearTimeout(timeout);
    clearTimeout(retry);
  }

  function send(type, action) {
    window.parent.postMessage(
      {
        source: "r96-auth",
        protocol: PROTOCOL,
        release: RELEASE,
        type,
        action,
        requestId
      },
      HOST_ORIGIN
    );
  }

  function fail(message) {
    stopTimers();
    render("error", null, message);
  }

  function connect() {
    stopTimers();

    if (window.parent === window) {
      render(
        "signedOut",
        null,
        "Inicia sesión con tu cuenta de Nexo Group."
      );
      return;
    }

    requestId++;
    attempts = 0;
    render("connecting");

    timeout = setTimeout(
      () =>
        fail(
          "No se pudo comprobar la sesión de Nexo Group. Pulsa Iniciar sesión para reintentar."
        ),
      REQUEST_TIMEOUT
    );

    const probe = () => {
      send("r96-account-ready");
      if (++attempts < 6) retry = setTimeout(probe, 1500);
    };

    probe();
  }

  function login() {
    if (state !== "signedOut" && state !== "error") return;

    stopTimers();
    requestId++;
    render("signingIn");

    if (window.parent === window) {
      window.location.assign(PUBLISHED_RISING);
      return;
    }

    timeout = setTimeout(
      () =>
        fail(
          "No se pudo abrir el inicio de sesión de Nexo Group. Vuelve a intentarlo."
        ),
      REQUEST_TIMEOUT
    );

    send("r96-account-action", "login");
  }

  function accountAction(action) {
    closeMenu();

    if (action === "profile") {
      send("r96-account-action", "profile");
      return;
    }

    if (action === "switch") {
      render("signingIn");
      send("r96-account-action", "switch");
      return;
    }

    if (action === "logout") {
      if (
        typeof window.confirm === "function" &&
        !window.confirm("¿Quieres cerrar sesión de Nexo Group?")
      ) {
        return;
      }
      render("connecting");
      send("r96-account-action", "logout");
    }
  }

  function receive(event) {
    if (event.source !== window.parent || event.origin !== HOST_ORIGIN) return;

    const data = event.data;
    if (
      !data ||
      data.source !== SOURCE ||
      data.protocol !== PROTOCOL ||
      data.requestId !== requestId
    ) {
      return;
    }

    if (!Number.isSafeInteger(data.sequence) || data.sequence <= lastSequence) {
      return;
    }

    if (!["signedOut", "signedIn", "signingIn", "error"].includes(data.status)) {
      return;
    }

    if (data.status === "signedIn" && !data.member?.id) return;

    lastSequence = data.sequence;
    stopTimers();

    render(
      data.status,
      data.member,
      data.status === "error"
        ? "No se pudo comprobar la sesión de Nexo Group."
        : ""
    );
  }

  function bind() {
    account = document.querySelector(".r96-account-visual");
    hero = document.querySelector("#r96-login");
    notice = document.querySelector("#r96-auth-status");

    if (!account || !hero || !notice) return;

    installMenu();

    window.addEventListener("message", receive);
    window.addEventListener("pagehide", stopTimers);
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) connect();
    });

    account.addEventListener("click", (event) => {
      event.stopPropagation();
      if (state === "signedIn") toggleMenu();
      else login();
    });
    hero.addEventListener("click", login);

    document.addEventListener("click", (event) => {
      if (!menu?.hidden && !menu.contains(event.target) && !account.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    connect();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();
