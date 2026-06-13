let RISIN96AMES_REVIEWS = [];

const GITHUB_ISSUES_URL = "https://github.com/dtokurisu-png/risin96ames/issues/new";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadReviews() {
  const response = await fetch("data/reviews.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("No se pudo cargar data/reviews.json");
  }

  RISIN96AMES_REVIEWS = await response.json();
  return RISIN96AMES_REVIEWS;
}

function renderLatestReviews(reviews) {
  const container = document.getElementById("latestReviews");
  const reviewsCount = document.getElementById("reviewsCount");

  if (!container) {
    return;
  }

  if (!reviews.length) {
    container.innerHTML = "<p>Todavía no hay reseñas visibles.</p>";
  } else {
    container.innerHTML = reviews
      .slice(0, 5)
      .map((review) => {
        const userName = escapeHtml(review.userName || "Tester");
        const comment = escapeHtml(review.comment || "");
        const rating = Number(review.rating || 0);
        const gameId = escapeHtml(review.gameId || "unknown");
        const device = escapeHtml(review.device || "Unknown");

        return `
          <article class="review-mini-card">
            <strong>${userName} · ${rating}/5</strong>
            <span>${gameId} · ${device}</span>
            <p>${comment}</p>
          </article>
        `;
      })
      .join("");
  }

  if (reviewsCount) {
    reviewsCount.textContent = String(reviews.length);
  }
}

function buildGitHubIssueUrl(review) {
  const title = `[Review] ${review.gameId} - ${review.rating}/5`;

  const body = [
    "## RISIN96AMES Review",
    "",
    `**Juego:** ${review.gameId}`,
    `**Alias:** ${review.userName}`,
    `**Rating:** ${review.rating}/5`,
    `**Dispositivo:** ${review.device}`,
    "",
    "## Comentario",
    "",
    review.comment,
    "",
    "---",
    "Enviado desde el formulario de RISIN96AMES."
  ].join("\n");

  const params = new URLSearchParams({
    title,
    body,
    labels: "review"
  });

  return `${GITHUB_ISSUES_URL}?${params.toString()}`;
}

function getReviewFromForm() {
  return {
    userName: document.getElementById("reviewName").value.trim() || "Tester",
    gameId: document.getElementById("reviewGame").value,
    rating: Number(document.getElementById("reviewRating").value),
    device: document.getElementById("reviewDevice").value,
    comment: document.getElementById("reviewComment").value.trim(),
    createdAt: new Date().toISOString().slice(0, 10)
  };
}

function updateGitHubIssueButton() {
  const issueButton = document.getElementById("githubIssueButton");

  if (!issueButton) {
    return;
  }

  const review = getReviewFromForm();

  if (!review.gameId || !review.comment) {
    issueButton.href = GITHUB_ISSUES_URL;
    return;
  }

  issueButton.href = buildGitHubIssueUrl(review);
}

function setupReviewForm() {
  const form = document.getElementById("reviewForm");
  const message = document.getElementById("reviewMessage");

  if (!form || !message) {
    return;
  }

  form.addEventListener("input", updateGitHubIssueButton);
  form.addEventListener("change", updateGitHubIssueButton);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const review = getReviewFromForm();

    if (!review.gameId || !review.comment) {
      message.textContent = "Completa el juego y el comentario antes de previsualizar.";
      return;
    }

    const previewReviews = [review, ...RISIN96AMES_REVIEWS];
    renderLatestReviews(previewReviews);

    message.textContent =
      "Reseña previsualizada. Para guardarla de verdad, usa el botón Enviar por GitHub Issue.";

    updateGitHubIssueButton();
  });

  updateGitHubIssueButton();
}
