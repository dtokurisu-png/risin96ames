function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`No se pudo cargar ${path}`);
  }

  return response.json();
}

function getGameIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderChangelog(changelog) {
  if (!Array.isArray(changelog) || changelog.length === 0) {
    return "<p>No hay changelog disponible todavía.</p>";
  }

  return changelog.map((entry) => {
    const version = escapeHtml(entry.version || "Versión");
    const notes = Array.isArray(entry.notes) ? entry.notes : [];

    return `
      <article class="detail-panel">
        <h3>v${version}</h3>
        <ul>
          ${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
        </ul>
      </article>
    `;
  }).join("");
}

function renderGameReviews(reviews, gameId) {
  const filtered = reviews.filter((review) => review.gameId === gameId);

  if (!filtered.length) {
    return "<p>Todavía no hay reseñas visibles para este juego.</p>";
  }

  return filtered.map((review) => `
    <article class="review-mini-card">
      <strong>${escapeHtml(review.userName || "Tester")} · ${Number(review.rating || 0)}/5</strong>
      <span>${escapeHtml(review.device || "Unknown")} · ${escapeHtml(review.createdAt || "")}</span>
      <p>${escapeHtml(review.comment || "")}</p>
    </article>
  `).join("");
}

function buildIssueUrl(game) {
  const title = `[Review] ${game.id} - feedback`;
  const body = [
    "## RISIN96AMES Review",
    "",
    `**Juego:** ${game.id}`,
    `**Nombre:** ${game.title}`,
    "",
    "## Comentario",
    "",
    "Escribe aquí tu reseña, bug o sugerencia.",
    "",
    "---",
    "Enviado desde la página de detalle de RISIN96AMES."
  ].join("\n");

  const params = new URLSearchParams({
    title,
    body,
    labels: "review"
  });

  return `https://github.com/dtokurisu-png/risin96ames/issues/new?${params.toString()}`;
}

function renderGameDetail(game, reviews) {
  const container = document.getElementById("gameDetail");
  const driveZipUrl = game.driveZipUrl && game.driveZipUrl !== "pendiente"
    ? `<a class="secondary-button" href="${escapeHtml(game.driveZipUrl)}" target="_blank" rel="noopener">Ver build en Drive</a>`
    : `<button class="ghost-button disabled" type="button">Build en Drive · Pendiente</button>`;

  container.innerHTML = `
    <div class="detail-hero">
      <div>
        <p class="eyebrow">Game detail</p>
        <h1>${escapeHtml(game.title)}</h1>
        <p class="hero-text">${escapeHtml(game.longDescription || game.shortDescription || "")}</p>

        <div class="hero-actions">
          <a class="primary-button" href="${escapeHtml(game.playUrl || "#")}" target="_blank" rel="noopener">Jugar ahora</a>
          <a class="secondary-button" href="${buildIssueUrl(game)}" target="_blank" rel="noopener">Enviar feedback</a>
          ${driveZipUrl}
        </div>
      </div>

      <div class="hero-panel">
        <div class="stat-card">
          <span class="stat-number">${escapeHtml(game.version || "0.1.0")}</span>
          <span class="stat-label">Versión actual</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${escapeHtml(game.status || "Beta")}</span>
          <span class="stat-label">Estado</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${Number(game.reviews || 0)}</span>
          <span class="stat-label">Reseñas</span>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      <article class="detail-panel">
        <h2>Información</h2>
        <p><strong>Género:</strong> ${escapeHtml(game.genre || "Experimental")}</p>
        <p><strong>En prueba:</strong> ${escapeHtml(game.testFocus || "Jugabilidad principal")}</p>
        <p><strong>Controles:</strong> ${escapeHtml(game.controls || "No especificado")}</p>
        <p><strong>Valoración:</strong> ${escapeHtml(game.rating || "Pendiente")}</p>
      </article>

      <article class="detail-panel">
        <h2>Cómo usar esta beta</h2>
        <p>
          Prueba el juego, observa errores, piensa qué se siente confuso o divertido,
          y luego envía feedback por GitHub Issue para que quede registrado.
        </p>
      </article>
    </div>

    <section class="detail-section">
      <h2>Changelog</h2>
      <div class="detail-list">
        ${renderChangelog(game.changelog)}
      </div>
    </section>

    <section class="detail-section">
      <h2>Reseñas de este juego</h2>
      <div class="latest-reviews">
        ${renderGameReviews(reviews, game.id)}
      </div>
    </section>
  `;
}

async function initGameDetail() {
  const container = document.getElementById("gameDetail");

  try {
    const gameId = getGameIdFromUrl();

    if (!gameId) {
      container.innerHTML = "<p>No se indicó ningún juego. Vuelve al inicio y abre un juego desde su tarjeta.</p>";
      return;
    }

    const [games, reviews] = await Promise.all([
      fetchJson("data/games.json"),
      fetchJson("data/reviews.json")
    ]);

    const game = games.find((item) => item.id === gameId);

    if (!game) {
      container.innerHTML = "<p>No encontramos ese juego en data/games.json.</p>";
      return;
    }

    renderGameDetail(game, reviews);
  } catch (error) {
    console.error("Game detail error:", error);
    container.innerHTML = "<p>No se pudo cargar el detalle del juego.</p>";
  }
}

document.addEventListener("DOMContentLoaded", initGameDetail);
