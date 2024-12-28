document.addEventListener("DOMContentLoaded", () => {
  const infoIcon = document.querySelector(".info-icon");
  const infoOverlay = document.querySelector(".info-overlay");

  // Toggle info overlay on icon click
  infoIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    infoOverlay.classList.toggle("active");
  });

  // Close overlay when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".info-container")) {
      infoOverlay.classList.remove("active");
    }
  });
});
