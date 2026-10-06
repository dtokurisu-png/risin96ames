(() => {
  "use strict";

  const RELEASE = "3.0.0";
  let accountState = "booting";
  let bridgeOrigin = "*";

  function detectBridgeOrigin() {
    try {
      if (document.referrer) {
        bridgeOrigin = new URL(document.referrer).origin;
      }
    } catch (_) {
      bridgeOrigin = "*";
    }
  }

  function accountButton() {
    return document.querySelector(".r96-account-visual");
  }

  function heroButton() {
    return Array.from(
      document.querySelectorAll(".r96-actions .r96-secondary")
    ).find((button) => {
      const text = String(button.textContent || "").trim();
      return text === "Iniciar sesión" || text === "Sesión iniciada";
    }) || null;
  }

  function setSignedOut() {
    accountState = "signedOut";

    const button = accountButton();
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-disabled");
      button.removeAttribute("title");
      button.dataset.r96AuthState = "signedOut";

      const icon = button.querySelector(".r96-account-icon");
      const strong = button.querySelector(".r96-account-copy strong");
      const small = button.querySelector(".r96-account-copy small");

      if (icon) icon.textContent = "R";
      if (strong) strong.textContent = "Iniciar sesión";
      if (small) small.textContent = "Acceso con Wix";
    }

    const hero = heroButton();
    if (hero) {
      hero.disabled = false;
      hero.removeAttribute("aria-disabled");
      hero.textContent = "Iniciar sesión";
    }
  }

  function setSigningIn() {
    accountState = "signingIn";

    const button = accountButton();
    if (button) {
      button.disabled = true;
      button.dataset.r96AuthState = "signingIn";

      const strong = button.querySelector(".r96-account-copy strong");
      const small = button.querySelector(".r96-account-copy small");

      if (strong) strong.textContent = "Iniciando sesión…";
      if (small) small.textContent = "Wix";
    }

    const hero = heroButton();
    if (hero) {
      hero.disabled = true;
      hero.textContent = "Iniciando sesión…";
    }
  }

  function setSignedIn(member) {
    accountState = "signedIn";

    const name = String(member?.displayName || "Mi cuenta").trim();
    const email = String(member?.email || "").trim();

    const button = accountButton();
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-disabled");
      button.removeAttribute("title");
      button.dataset.r96AuthState = "signedIn";

      const icon = button.querySelector(".r96-account-icon");
      const strong = button.querySelector(".r96-account-copy strong");
      const small = button.querySelector(".r96-account-copy small");

      if (icon) icon.textContent = (name || email || "R").charAt(0).toUpperCase();
      if (strong) strong.textContent = name;
      if (small) small.textContent = email || "Sesión iniciada";
    }

    const hero = heroButton();
    if (hero) {
      hero.disabled = true;
      hero.textContent = "Sesión iniciada";
    }
  }

  function send(payload) {
    try {
      if (window.parent === window) return false;

      window.parent.postMessage(
        {
          source: "r96-auth",
          release: RELEASE,
          ...payload
        },
        bridgeOrigin
      );

      return true;
    } catch (_) {
      return false;
    }
  }

  function requestLogin() {
    if (accountState === "signingIn" || accountState === "signedIn") {
      return;
    }

    setSigningIn();

    if (!send({
      type: "r96-account-action",
      action: "login"
    })) {
      setSignedOut();
    }
  }

  function handleMessage(event) {
    if (event.source !== window.parent) return;
    if (bridgeOrigin !== "*" && event.origin !== bridgeOrigin) return;

    const message = event.data || {};

    if (message.type !== "r96-account-state") return;

    if (message.data?.member?.id) {
      setSignedIn(message.data.member);
    } else {
      setSignedOut();
    }
  }

  function bind() {
    detectBridgeOrigin();
    window.addEventListener("message", handleMessage);

    const button = accountButton();
    const hero = heroButton();

    if (button) {
      button.addEventListener("click", requestLogin);
    }

    if (hero) {
      hero.addEventListener("click", requestLogin);
    }

    // Start from a neutral state, then ask Wix for the real member state.
    setSignedOut();

    [0, 180, 600, 1400, 2600].forEach((delay) => {
      setTimeout(() => {
        send({
          type: "r96-account-ready"
        });
      }, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();
