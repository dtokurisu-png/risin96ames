(() => {
  "use strict";

  function findHeroLoginButton() {
    return Array.from(
      document.querySelectorAll(".r96-actions .r96-secondary")
    ).find((button) => button.textContent.trim() === "Iniciar sesión") || null;
  }

  function wixReturnUrl() {
    try {
      const ownUrl = new URL(window.location.href);
      const injected = ownUrl.searchParams.get("wixReturn");

      if (injected) {
        const parsed = new URL(injected);

        if (parsed.protocol === "https:" || parsed.protocol === "http:") {
          return parsed;
        }
      }
    } catch (_) {}

    return null;
  }

  function navigateToLogin() {
    const target = wixReturnUrl();

    if (!target) {
      return;
    }

    target.searchParams.set("r96login", "1");
    target.hash = "";

    try {
      window.top.location.href = target.toString();
      return;
    } catch (_) {}

    window.location.href = target.toString();
  }

  function bind() {
    const accountButton = document.querySelector(".r96-account-visual");
    const heroButton = findHeroLoginButton();

    if (accountButton) {
      accountButton.removeAttribute("aria-disabled");
      accountButton.removeAttribute("title");
      accountButton.dataset.r96LoginBound = "1";

      const helper = accountButton.querySelector(".r96-account-copy small");
      if (helper) {
        helper.textContent = "Acceso con Wix";
      }

      accountButton.addEventListener("click", navigateToLogin);
    }

    if (heroButton) {
      heroButton.removeAttribute("aria-disabled");
      heroButton.dataset.r96LoginBound = "1";
      heroButton.addEventListener("click", navigateToLogin);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();
