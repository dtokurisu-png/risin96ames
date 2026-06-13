function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function lines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function value(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function buildGameObject() {
  const id = slugify(value("uploadGameId") || value("uploadGameTitle"));
  const version = value("uploadGameVersion") || "0.1.0";
  const shortDescription = value("uploadGameShort");
  const longDescription = value("uploadGameLong") || shortDescription;
  const focusLines = lines(value("uploadGameFocus"));

  return {
    id,
    title: value("uploadGameTitle"),
    slug: id,
    shortDescription,
    longDescription,
    genre: value("uploadGameGenre") || "No especificado",
    status: value("uploadGameStatus") || "Beta",
    version,
    testFocus: focusLines.length ? focusLines.join(", ") : "Feedback general del juego.",
    controls: value("uploadGameControls") || "No especificado",
    thumbnailUrl: value("uploadGameThumb") || "",
    bannerUrl: value("uploadGameBanner") || "",
    rating: "Pendiente",
    reviews: 0,
    playUrl: `games/${id}/index.html`,
    driveZipUrl: value("uploadGameDrive") || "pendiente",
    isActive: true,
    changelog: [
      {
        version,
        notes: [
          "Juego agregado a RISIN96AMES.",
          "Miniatura y página detallada pueden configurarse después."
        ]
      }
    ]
  };
}

function renderGameObject(game) {
  setText("uploadGameJsonOutput", JSON.stringify(game, null, 2));
  setText("uploadGamePathOutput", `games/${game.id}/index.html`);
}

function initUploadGameForm() {
  const form = document.getElementById("uploadGameForm");
  const title = document.getElementById("uploadGameTitle");
  const id = document.getElementById("uploadGameId");
  const copy = document.getElementById("copyGameJson");
  const message = document.getElementById("uploadGameMessage");

  if (title && id) {
    title.addEventListener("input", () => {
      if (!id.dataset.touched) id.value = slugify(title.value);
    });

    id.addEventListener("input", () => {
      id.dataset.touched = "true";
      id.value = slugify(id.value);
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const game = buildGameObject();
      if (!game.id || !game.title || !game.shortDescription) {
        if (message) message.textContent = "Falta nombre, ID o descripción corta.";
        return;
      }

      renderGameObject(game);
      if (message) message.textContent = "Ficha generada. Copia el JSON o pásame el ZIP del juego y lo integro.";
    });
  }

  if (copy) {
    copy.addEventListener("click", async () => {
      const text = document.getElementById("uploadGameJsonOutput")?.textContent || "";
      if (!text || text.includes("Aquí aparecerá")) {
        if (message) message.textContent = "Primero genera la ficha.";
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        if (message) message.textContent = "JSON copiado.";
      } catch (error) {
        if (message) message.textContent = "No pude copiar. Selecciona el bloque manualmente.";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initUploadGameForm);
