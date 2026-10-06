import {
  subscribeAuth,
  signInWithGoogle,
  signOut
} from "./r96-auth-core.js";

let menu = null;
let shell = null;
let accountButton = null;
let heroLoginButton = null;

function esc(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function initial(value) {
  return String(value || "R").trim().charAt(0).toUpperCase() || "R";
}

function closeMenu() {
  if (menu) menu.hidden = true;
  accountButton?.setAttribute("aria-expanded", "false");
}

function ensureShell() {
  accountButton = document.querySelector(".r96-account-visual");
  heroLoginButton = Array.from(
    document.querySelectorAll(".r96-actions .r96-secondary")
  ).find((button) => button.textContent.trim() === "Iniciar sesión") || null;

  if (!accountButton) return false;

  if (!accountButton.parentElement?.classList.contains("r96-auth-account-shell")) {
    shell = document.createElement("div");
    shell.className = "r96-auth-account-shell";

    accountButton.parentElement.insertBefore(shell, accountButton);
    shell.appendChild(accountButton);
  } else {
    shell = accountButton.parentElement;
  }

  if (!menu) {
    menu = document.createElement("div");
    menu.className = "r96-auth-menu";
    menu.hidden = true;
    shell.appendChild(menu);
  }

  accountButton.removeAttribute("aria-disabled");
  accountButton.removeAttribute("title");
  accountButton.setAttribute("aria-haspopup", "menu");
  accountButton.setAttribute("aria-expanded", "false");

  if (heroLoginButton) {
    heroLoginButton.removeAttribute("aria-disabled");
  }

  return true;
}

function renderAvatar(member) {
  if (member?.photoUrl) {
    return '<img class="r96-auth-avatar" src="' +
      esc(member.photoUrl) +
      '" alt="">';
  }

  return '<span class="r96-auth-avatar-fallback">' +
    esc(initial(member?.displayName || member?.email)) +
    "</span>";
}

function renderSignedOut() {
  if (!accountButton) return;

  accountButton.innerHTML = `
    <span class="r96-account-icon r96-auth-google-mark" aria-hidden="true">G</span>
    <span class="r96-account-copy">
      <strong>Iniciar sesión</strong>
      <small>Continuar con Google</small>
    </span>
    <span class="r96-account-caret">›</span>
  `;

  accountButton.dataset.authState = "signedOut";
  accountButton.disabled = false;

  if (heroLoginButton) {
    heroLoginButton.disabled = false;
    heroLoginButton.textContent = "Iniciar sesión";
  }

  closeMenu();
}

function renderSigningIn() {
  if (!accountButton) return;

  accountButton.querySelector(".r96-account-copy strong").textContent =
    "Conectando…";
  accountButton.querySelector(".r96-account-copy small").textContent =
    "Abriendo Google";
  accountButton.disabled = true;

  if (heroLoginButton) {
    heroLoginButton.disabled = true;
    heroLoginButton.textContent = "Conectando…";
  }
}

function renderSignedIn(member) {
  if (!accountButton) return;

  accountButton.innerHTML = `
    <span class="r96-account-icon r96-auth-avatar-wrap">
      ${renderAvatar(member)}
    </span>
    <span class="r96-account-copy">
      <strong>${esc(member.displayName)}</strong>
      <small>${esc(member.email)}</small>
    </span>
    <span class="r96-account-caret">⌄</span>
  `;

  accountButton.dataset.authState = "signedIn";
  accountButton.disabled = false;

  if (heroLoginButton) {
    heroLoginButton.disabled = true;
    heroLoginButton.textContent = "Sesión iniciada";
  }

  menu.innerHTML = `
    <div class="r96-auth-menu-head">
      <strong>${esc(member.displayName)}</strong>
      <span>${esc(member.email)}</span>
    </div>
    <button class="r96-auth-menu-action" type="button" data-r96-auth-logout>
      Cerrar sesión
    </button>
  `;

  menu
    .querySelector("[data-r96-auth-logout]")
    ?.addEventListener("click", async () => {
      closeMenu();
      await signOut();
    });
}

function renderError(message) {
  renderSignedOut();

  if (!menu) return;

  menu.hidden = false;
  menu.innerHTML = `
    <div class="r96-auth-error">
      ${esc(message || "No se pudo iniciar sesión.")}
    </div>
  `;

  accountButton?.setAttribute("aria-expanded", "true");
}

function bindEvents() {
  accountButton?.addEventListener("click", async (event) => {
    event.stopPropagation();

    const state = accountButton.dataset.authState;

    if (state === "signedIn") {
      menu.hidden = !menu.hidden;
      accountButton.setAttribute(
        "aria-expanded",
        menu.hidden ? "false" : "true"
      );
      return;
    }

    if (state === "signedOut") {
      await signInWithGoogle();
    }
  });

  heroLoginButton?.addEventListener("click", async () => {
    if (!heroLoginButton.disabled) {
      await signInWithGoogle();
    }
  });

  document.addEventListener("click", (event) => {
    if (!shell?.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

export function mountAuthUi() {
  if (!ensureShell()) return;

  bindEvents();

  subscribeAuth((state) => {
    if (state.status === "signedIn" && state.member) {
      renderSignedIn(state.member);
      return;
    }

    if (state.status === "signingIn") {
      renderSigningIn();
      return;
    }

    if (state.status === "error") {
      renderError(state.error);
      return;
    }

    renderSignedOut();
  });
}
