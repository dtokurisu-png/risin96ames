const RISIN96AMES_GAMES = [
  {
    id: 'demo-game',
    title: 'Beta Test Game',
    shortDescription: 'Una experiencia beta genérica para comprobar la estructura inicial de RISIN96AMES antes de cargar juegos reales.',
    status: 'Beta',
    version: '0.1.0',
    genre: 'Experimental',
    testFocus: 'Flujo de juego, botón jugar y reseñas demo',
    rating: 'Pendiente',
    reviews: 0,
    playUrl: 'games/demo-game/index.html',
    detailUrl: '#games'
  }
];

function createGameCard(game) {
  return `
    <article class="game-card">
      <div class="game-thumb" aria-hidden="true"><span>R96</span></div>
      <div class="game-body">
        <h3>${game.title}</h3>
        <p class="game-description">${game.shortDescription}</p>
        <div class="game-meta">
          <span><strong>Estado:</strong> ${game.status}</span>
          <span><strong>Versión:</strong> ${game.version}</span>
          <span><strong>Género:</strong> ${game.genre}</span>
          <span><strong>En prueba:</strong> ${game.testFocus}</span>
          <span><strong>Valoración:</strong> ${game.rating}</span>
          <span><strong>Reseñas:</strong> ${game.reviews}</span>
        </div>
        <div class="game-actions">
          <a class="secondary-button" href="${game.detailUrl}">Ver detalles</a>
          <a class="primary-button" href="${game.playUrl}" target="_blank" rel="noopener">Jugar</a>
        </div>
      </div>
    </article>`;
}

function renderGames() {
  const grid = document.getElementById('gamesGrid');
  if (!grid) return;
  grid.innerHTML = RISIN96AMES_GAMES.map(createGameCard).join('');
}
