let RISIN96AMES_GAMES = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadGames() {
  const response = await fetch("data/games.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("No se pudo cargar data/games.json");
  }

  const games = await response.json();
  RISIN96AMES_GAMES = games.filter((game) => game.isActive);
  return RISIN96AMES_GAMES;
}

function createGameCard(game) {
  const title = escapeHtml(game.title || "Untitled Game");
  const shortDescription = escapeHtml(game.shortDescription || "Beta jugable en desarrollo.");
  const status = escapeHtml(game.status || "Beta");
  const version = escapeHtml(game.version || "0.1.0");
  const genre = escapeHtml(game.genre || "Experimental");
  const testFocus = escapeHtml(game.testFocus || "Jugabilidad principal");
  const rating = escapeHtml(game.rating || "Pendiente");
  const reviews = Number(game.reviews || 0);
  const playUrl = escapeHtml(game.playUrl || "#");
  const detailUrl = `game.html?id=${encodeURIComponent(game.id)}`;

  return `
    <article class="game-card">
      <div class="game-thumb" aria-hidden="true">
        <span>R96</span>
      </div>

      <div class="game-body">
        <h3>${title}</h3>
        <p class="game-description">${shortDescription}</p>

        <div class="game-meta">
          <span><strong>Estado:</strong> ${status}</span>
          <span><strong>Versión:</strong> ${version}</span>
          <span><strong>Género:</strong> ${genre}</span>
          <span><strong>En prueba:</strong> ${testFocus}</span>
          <span><strong>Valoración:</strong> ${rating}</span>
          <span><strong>Reseñas:</strong> ${reviews}</span>
        </div>

        <div class="game-actions">
          <a class="secondary-button" href="${detailUrl}">Ver detalles</a>
          <a class="primary-button" href="${playUrl}" target="_blank" rel="noopener">Jugar</a>
        </div>
      </div>
    </article>
  `;
}

function renderGames(games) {
  const grid = document.getElementById("gamesGrid");
  const gamesCount = document.getElementById("gamesCount");

  if (!grid) {
    return;
  }

  if (!games.length) {
    grid.innerHTML = "<p>No hay juegos activos todavía.</p>";
  } else {
    grid.innerHTML = games.map(createGameCard).join("");
  }

  if (gamesCount) {
    gamesCount.textContent = String(games.length);
  }
}

function populateReviewGameSelect(games) {
  const select = document.getElementById("reviewGame");

  if (!select) {
    return;
  }

  if (!games.length) {
    select.innerHTML = '<option value="">No hay juegos activos</option>';
    return;
  }

  select.innerHTML = games
    .map((game) => `<option value="${escapeHtml(game.id)}">${escapeHtml(game.title || game.id)}</option>`)
    .join("");
}
