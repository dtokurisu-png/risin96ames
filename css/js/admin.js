const ADMIN_CODE = "RISIN96ADMIN";
const ADMIN_SESSION_KEY = "risin96ames-admin-session";

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function setAdminLoggedIn(value) {
  if (value) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
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
  const message = document.getElementById("adminLoginMessage");

  if (isAdminLoggedIn()) {
    showAdminPanel();
  } else {
    showAdminLogin();
  }

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = document.getElementById("adminCode").value.trim();

    if (code === ADMIN_CODE) {
      setAdminLoggedIn(true);
      showAdminPanel();
    } else if (message) {
      message.textContent = "Código incorrecto.";
    }
  });
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
