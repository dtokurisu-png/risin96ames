(() => {
  "use strict";

  const RELEASE = "5.0.0";
  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const CENTRAL_ACCESS =
    "https://dtokurisu.wixstudio.com/my-site-1/?nexoAuth=login&nexoReturn=rising";
  const SOURCE = "r96-wix-auth";
  const PROTOCOL = 1;
  const REQUEST_TIMEOUT = 12000;

  let account;
  let hero;
  let notice;
  let state = "connecting";
  let requestId = 0;
  let timeout;
  let retry;
  let attempts = 0;
  let lastSequence = -1;

  function render(next, member, message = "") {
    state = next;

    const busy = next === "connecting" || next === "signingIn";
    const signedIn = next === "signedIn";
    const name = String(member?.displayName || "Mi cuenta");
    const label = signedIn
      ? name
      : busy
        ? next === "connecting"
          ? "Conectando…"
          : "Abriendo acceso Nexo…"
        : "Iniciar sesión en Nexo Group";

    account.disabled = busy || signedIn;
    account.dataset.r96AuthState = next;
    account.setAttribute("aria-busy", String(busy));
    account.querySelector(".r96-account-copy strong").textContent = label;
    account.querySelector(".r96-account-copy small").textContent = signedIn
      ? "Conectado a Nexo Group"
      : "Acceso central de Nexo Group";
    account.querySelector(".r96-account-icon").textContent = signedIn
      ? name.charAt(0).toUpperCase()
      : "R";

    hero.disabled = busy || signedIn;
    hero.textContent = signedIn ? "Conectado a Nexo Group" : label;

    notice.textContent = message;
    notice.hidden = !message;
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
        "Usa el acceso central de Nexo Group para entrar a Rising."
      );
      return;
    }

    requestId++;
    attempts = 0;
    render("connecting");

    timeout = setTimeout(
      () =>
        fail(
          "No se pudo comprobar tu sesión Nexo. Pulsa Iniciar sesión para abrir el acceso central."
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
      window.location.assign(CENTRAL_ACCESS);
      return;
    }

    timeout = setTimeout(
      () =>
        fail(
          "No se pudo abrir el acceso central. Pulsa Iniciar sesión para reintentar."
        ),
      REQUEST_TIMEOUT
    );

    send("r96-account-action", "login");
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

    if (data.status === "signingIn") {
      render("signingIn");
      return;
    }

    render(
      data.status,
      data.member,
      data.status === "error"
        ? "No se pudo comprobar la sesión. Abre el acceso central e inténtalo de nuevo."
        : ""
    );
  }

  function bind() {
    account = document.querySelector(".r96-account-visual");
    hero = document.querySelector("#r96-login");
    notice = document.querySelector("#r96-auth-status");

    if (!account || !hero || !notice) return;

    window.addEventListener("message", receive);
    window.addEventListener("pagehide", stopTimers);
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) connect();
    });

    account.addEventListener("click", login);
    hero.addEventListener("click", login);
    connect();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();
