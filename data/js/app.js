async function initApp() {
  try {
    const games = await loadGames();
    renderGames(games);
    populateReviewGameSelect(games);

    const reviews = await loadReviews();
    renderLatestReviews(reviews);

    setupReviewForm();

    console.info("RISIN96AMES StaticData v0.2 loaded.");
  } catch (error) {
    console.error("RISIN96AMES init error:", error);

    const gamesGrid = document.getElementById("gamesGrid");
    if (gamesGrid) {
      gamesGrid.innerHTML = `
        <p>
          No se pudieron cargar los datos estáticos. Revisa que existan
          data/games.json y data/reviews.json.
        </p>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", initApp);
