const ADMIN_SESSION_KEY = "risin96ames-admin-session";
const ADMIN_SESSION_TOKEN_KEY = "risin96ames-admin-token";

function getAdminApiUrl() {
  return String(window.R96_ADMIN_API_URL || localStorage.getItem("r96-admin-api-url") || "").replace(/\/+$/, "");
}

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function setAdminLoggedIn(value, token = "") {
  if (value) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    if (token) sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
  }
}

function showAdminPanel() {
  const login = document.getElementById("adminLogin");
  const panel = document.getElementById("adminPanel");

  if (login) login.hidden = true;
  if (panel) panel.hidden = false;
}

function showAdminLogin() {
  const login = document.getElementById("adminLogin");
  const panel = document.getElementById("adminPanel");

  if (login) login.hidden = false;
  if (panel) panel.hidden = true;
}

function setAdminMessage(text, type = "info") {
  const message = document.getElementById("adminLoginMessage");
  if (!message) return;
  message.textContent = text;
  message.dataset.type = type;
}

function getAdminCredentials() {
  return {
    email: document.getElementById("adminEmail")?.value.trim() || "",
    adminCode: document.getElementById("adminCode")?.value.trim() || "",
    privateCode: document.getElementById("adminPrivateCode")?.value.trim() || ""
  };
}

function buildRedirectUrl(email = "", privateCode = "") {
  const url = new URL(window.location.href);
  if (email) url.searchParams.set("adminEmail", email);
  if (privateCode) url.searchParams.set("privateCode", privateCode);
  return url.toString();
}

async function postAdmin(path, payload) {
  const apiUrl = getAdminApiUrl();

  if (!apiUrl) {
    throw new Error("Falta configurar js/admin-config.js con la URL del Worker.");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || "No se pudo completar la solicitud.");
  }

  return data;
}

async function requestPrivateCode() {
  const { email, adminCode } = getAdminCredentials();

  if (!email || !adminCode) {
    setAdminMessage("Escribe correo electrónico y código de administrador primero.", "error");
    return;
  }

  const button = document.getElementById("requestPrivateCode");
  if (button) button.disabled = true;

  try {
    setAdminMessage("Solicitando código privado...", "info");

    await postAdmin("/request-admin-code", {
      email,
      adminCode,
      redirectUrl: buildRedirectUrl(email)
    });

    setAdminMessage("Código privado enviado. Revisa tu correo.", "success");
  } catch (error) {
    setAdminMessage(error.message, "error");
  } finally {
    if (button) button.disabled = false;
  }
}

async function verifyAdminLogin(event) {
  event.preventDefault();

  const { email, adminCode, privateCode } = getAdminCredentials();

  if (!email || !adminCode || !privateCode) {
    setAdminMessage("Correo, código de administrador y código privado son obligatorios.", "error");
    return;
  }

  try {
    setAdminMessage("Verificando acceso...", "info");

    const data = await postAdmin("/verify-admin-login", {
      email,
      adminCode,
      privateCode
    });

    setAdminLoggedIn(true, data.sessionToken || "");
    setAdminMessage("Acceso autorizado.", "success");
    showAdminPanel();
  } catch (error) {
    setAdminLoggedIn(false);
    setAdminMessage(error.message, "error");
  }
}

function prefillAdminFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("adminEmail") || "";
  const privateCode = params.get("privateCode") || "";

  const emailInput = document.getElementById("adminEmail");
  const privateInput = document.getElementById("adminPrivateCode");

  if (email && emailInput) emailInput.value = email;
  if (privateCode && privateInput) privateInput.value = privateCode;

  if (email || privateCode) {
    setAdminMessage("Datos del enlace cargados. Escribe el código de administrador y entra al panel.", "info");
  }
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function initAdminLogin() {
  const form = document.getElementById("adminLoginForm");
  const requestButton = document.getElementById("requestPrivateCode");

  prefillAdminFromUrl();

  if (isAdminLoggedIn()) {
    showAdminPanel();
  } else {
    showAdminLogin();
  }

  if (requestButton) {
    requestButton.addEventListener("click", requestPrivateCode);
  }

  if (form) {
    form.addEventListener("submit", verifyAdminLogin);
  }
}

function initGameForm() {
  const form = document.getElementById("gameAdminForm");
  const logout = document.getElementById("logoutAdmin");

  if (logout) {
    logout.addEventListener("click", () => {
      setAdminLoggedIn(false);
      showAdminLogin();
    });
  }

  if (!form) return;

  const titleInput = document.getElementById("gameTitle");
  const idInput = document.getElementById("gameId");

  if (titleInput && idInput) {
    titleInput.addEventListener("input", () => {
      if (!idInput.dataset.touched) {
        idInput.value = slugify(titleInput.value);
      }
    });

    idInput.addEventListener("input", () => {
      idInput.dataset.touched = "true";
      idInput.value = slugify(idInput.value);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const id = slugify(document.getElementById("gameId").value);
    const version = document.getElementById("gameVersion").value.trim() || "0.1.0";
    const changelogLines = getLines(document.getElementById("gameChangelog").value);

    const game = {
      id,
      title: document.getElementById("gameTitle").value.trim(),
      slug: id,
      shortDescription: document.getElementById("gameShortDescription").value.trim(),
      longDescription: document.getElementById("gameLongDescription").value.trim(),
      genre: document.getElementById("gameGenre").value.trim(),
      status: document.getElementById("gameStatus").value,
      version,
      testFocus: document.getElementById("gameTestFocus").value.trim(),
      controls: document.getElementById("gameControls").value.trim() || "No especificado",
      thumbnailUrl: document.getElementById("gameThumbnail").value.trim() || "",
      bannerUrl: document.getElementById("gameBanner").value.trim() || "",
      rating: "Pendiente",
      reviews: 0,
      playUrl: `games/${id}/index.html`,
      driveZipUrl: document.getElementById("gameDriveZipUrl").value.trim() || "pendiente",
      isActive: true,
      changelog: [
        {
          version,
          notes: changelogLines.length ? changelogLines : [
            "Primera versión publicada en RISIN96AMES.",
            "Feedback abierto mediante GitHub Issues."
          ]
        }
      ]
    };

    document.getElementById("gameJsonOutput").textContent = JSON.stringify(game, null, 2);
    document.getElementById("gamePathOutput").textContent = `games/${id}/index.html`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminLogin();
  initGameForm();
});
