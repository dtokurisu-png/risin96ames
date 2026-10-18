(() => {
  "use strict";

  const app = document.querySelector(".r96-app");
  const themeButton = document.querySelector("#r96-theme-toggle");
  const menuButton = document.querySelector("#r96-menu");
  const menuPanel = document.querySelector("#r96-menu-panel");

  if (!app) return;

  const THEME_KEY = "r96-visual-theme";
  const LANG_KEY = "r96-language";
  try {
    const storedLanguage = localStorage.getItem(LANG_KEY);
    if (storedLanguage === "es" || storedLanguage === "en") {
      document.documentElement.lang = storedLanguage;
    }
  } catch (_) {}

  const applyTheme = (theme) => {
    const next = theme === "light" ? "light" : "dark";
    app.dataset.theme = next;
    document.documentElement.dataset.r96Theme = next;
    if (window.parent !== window) {
      window.parent.postMessage({ source: "r96-visual", type: "r96-theme", theme: next },
        "https://dtokurisu.wixstudio.com");
    }

    if (themeButton) {
      const dark = next === "dark";
      themeButton.textContent = dark ? "☀" : "☾";
      themeButton.setAttribute(
        "aria-label",
        dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      );
      themeButton.title = dark ? "Modo claro" : "Modo oscuro";
    }
  };

  // The head bootstrap selects the stored theme before the first paint.
  applyTheme(document.documentElement.dataset.r96Theme || "dark");

  themeButton?.addEventListener("click", () => {
    const next = app.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_) {}
  });

  const setMenu = (open) => {
    if (!menuButton || !menuPanel) return;
    menuPanel.hidden = !open;
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
  };

  menuButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenu(menuPanel?.hidden ?? true);
  });

  menuPanel?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("click", (event) => {
    if (!menuPanel || menuPanel.hidden) return;
    if (menuPanel.contains(event.target) || menuButton?.contains(event.target)) return;
    setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  // Only the same-origin Wix host can control this iframe navigation.
  // It reuses existing protected developer controls rather than bypassing auth.
  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SECTIONS = {explore:"home",games:"games",reviews:"reviews",community:"community"};
  const PROTECTED = {invite:"r96-invite-developer",add:"r96-add-game",mine:"r96-my-games"};

  function announceSection(section) {
    if (window.parent === window) return;
    window.parent.postMessage({
      source:"r96-header-state",type:"section",section
    }, HOST_ORIGIN);
  }

  function navigateFromSharedHeader(key) {
    if (Object.prototype.hasOwnProperty.call(SECTIONS,key)) {
      const section = SECTIONS[key];
      const element = document.getElementById(section);
      if (element) {
        location.hash = "#" + section;
        element.scrollIntoView({behavior:"smooth",block:"start"});
      }
      announceSection(key);
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(PROTECTED,key)) return;
    const control = document.getElementById(PROTECTED[key]);
    if (control) {
      control.click();
      announceSection(key);
      return;
    }
    const status = document.querySelector(".r96-account-visual")?.dataset?.r96AuthState;
    if (status !== "signedIn") {
      const login = document.getElementById("r96-login");
      if (login && !login.disabled) login.click();
      else alert("Inicia sesión en Nexo Group para acceder a las herramientas de desarrollo.");
      return;
    }
    alert("Tu cuenta no tiene autorización para realizar esa acción de desarrollador.");
  }

  window.addEventListener("message", event => {
    if (event.source !== window.parent || event.origin !== HOST_ORIGIN) return;
    const message = event.data;
    if (!message || message.source !== "r96-global-header" || message.protocol !== 1) return;

    if (message.type === "ready") {
      app.dataset.r96SharedHeader = "ready";
      announceSection(location.hash === "#games" ? "games" :
        location.hash === "#reviews" ? "reviews" :
        location.hash === "#community" ? "community" : "explore");
    } else if (message.type === "navigate") {
      navigateFromSharedHeader(String(message.value || ""));
    } else if (message.type === "theme" && ["light","dark"].includes(message.value)) {
      applyTheme(message.value);
      try { localStorage.setItem(THEME_KEY,message.value) } catch (_) {}
    } else if (message.type === "language" && ["es","en"].includes(message.value)) {
      if (document.documentElement.lang !== message.value) {
        try { localStorage.setItem(LANG_KEY,message.value) } catch (_) {}
        document.documentElement.lang = message.value;
        location.reload();
      }
    }
  });
  window.addEventListener("hashchange", () => {
    const section = location.hash.slice(1);
    announceSection(section === "home" ? "explore" :
      ["games","reviews","community"].includes(section) ? section : "explore");
  });

  const accessScript = document.createElement("script");
  accessScript.src = "./src/access/r96-access-ui.js?v=4.4.0";
  accessScript.defer = true;
  accessScript.dataset.r96AccessUi = "1";
  document.head.appendChild(accessScript);


  const gameCarousel = document.querySelector("#games .r96-carousel");
  if (gameCarousel) {
    // Static cards are design templates only; the live catalog owns this container.
    gameCarousel.replaceChildren();
    gameCarousel.hidden = true;
  }

  const gamesScript = document.createElement("script");
  gamesScript.src = "./src/games/r96-games-ui.js?v=5.4.1";
  gamesScript.defer = true;
  gamesScript.dataset.r96GamesUi = "1";
  document.head.appendChild(gamesScript);

  const developerScript = document.createElement("script");
  developerScript.src = "./src/games/r96-developer-ui.js?v=2.0.0";
  developerScript.defer = true;
  developerScript.dataset.r96DeveloperUi = "1";
  document.head.appendChild(developerScript);

})();

