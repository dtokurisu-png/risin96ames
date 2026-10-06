(() => {
  "use strict";

  const WIX_LOGIN_URL =
    "https://dtokurisu.wixstudio.com/my-site-1/blank-9?r96login=1";

  function findHeroLoginButton() {
    return Array.from(
      document.querySelectorAll(".r96-actions .r96-secondary")
    ).find((button) => button.textContent.trim() === "Iniciar sesión") || null;
  }

  function navigateToLogin() {
    try {
      window.top.location.href = WIX_LOGIN_URL;
      return;
    } catch (_) {}

    window.location.href = WIX_LOGIN_URL;
  }

  function bind() {
    const accountButton = document.querySelector(".r96-account-visual");
    const heroButton = findHeroLoginButton();

    if (accountButton) {
      accountButton.removeAttribute("aria-disabled");
      accountButton.removeAttribute("title");
      accountButton.dataset.r96LoginBound = "1";
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
