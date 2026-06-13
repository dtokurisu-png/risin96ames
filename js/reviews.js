function setupReviewForm() {
  const form = document.getElementById('reviewForm');
  const message = document.getElementById('reviewMessage');
  if (!form || !message) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const review = {
      userName: document.getElementById('reviewName').value.trim(),
      gameId: document.getElementById('reviewGame').value,
      rating: document.getElementById('reviewRating').value,
      comment: document.getElementById('reviewComment').value.trim(),
      createdAt: new Date().toISOString()
    };
    console.log('Demo review captured:', review);
    message.textContent = 'Reseña demo capturada en consola. En la siguiente fase se guardará en Firebase.';
    form.reset();
  });
}
