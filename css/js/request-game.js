const REQUEST_ISSUES_URL = "https://github.com/dtokurisu-png/risin96ames/issues/new";

function getRequestData() {
  return {
    title: document.getElementById("requestTitle").value.trim(),
    creator: document.getElementById("requestCreator").value.trim(),
    genre: document.getElementById("requestGenre").value.trim(),
    status: document.getElementById("requestStatus").value,
    description: document.getElementById("requestDescription").value.trim(),
    buildUrl: document.getElementById("requestBuildUrl").value.trim(),
    notes: document.getElementById("requestNotes").value.trim()
  };
}

function buildRequestIssueUrl(data) {
  const title = `[Game Request] ${data.title || "Nuevo juego"}`;
  const body = [
    "## Solicitud para agregar juego a RISIN96AMES",
    "",
    `**Juego:** ${data.title}`,
    `**Creador / estudio:** ${data.creator}`,
    `**Género:** ${data.genre}`,
    `**Estado:** ${data.status}`,
    "",
    "## Descripción",
    "",
    data.description || "Sin descripción.",
    "",
    "## Link al ZIP o build",
    "",
    data.buildUrl || "No incluido.",
    "",
    "## Comentarios para revisión",
    "",
    data.notes || "Sin comentarios adicionales.",
    "",
    "---",
    "Solicitud enviada desde RISIN96AMES."
  ].join("\n");

  const params = new URLSearchParams({
    title,
    body,
    labels: "game-request"
  });

  return `${REQUEST_ISSUES_URL}?${params.toString()}`;
}

function updateRequestButton() {
  const button = document.getElementById("requestIssueButton");
  if (!button) return;
  button.href = buildRequestIssueUrl(getRequestData());
}

function initRequestForm() {
  const form = document.getElementById("requestGameForm");
  const message = document.getElementById("requestMessage");

  if (!form) return;

  form.addEventListener("input", updateRequestButton);
  form.addEventListener("change", updateRequestButton);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateRequestButton();
    if (message) {
      message.textContent = "Solicitud preparada. Usa el botón de GitHub Issue para enviarla.";
    }
  });

  updateRequestButton();
}

document.addEventListener("DOMContentLoaded", initRequestForm);
