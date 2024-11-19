// File: FE-attempt-3/overlay.js

document.addEventListener("DOMContentLoaded", function () {
  console.log("Overlay script loaded");

  // Select the overlay element directly
  const overlay = document.querySelector("#overlay");
  console.log("Overlay element:", overlay);

  // Check if the overlay exists
  if (!overlay) {
    console.error("Overlay element with ID 'overlay' not found.");
    return;
  }

  // Add click event listeners to all gallery images
  document.addEventListener("click", function (e) {
    if (e.target.matches("#gallery-depth li img")) {
      console.log("Gallery image clicked:", e.target);
      overlay.classList.add("active");
      console.log("Overlay activated");
    }
  });

  // Add a click listener to the overlay to hide it when clicked
  overlay.addEventListener("click", function () {
    overlay.classList.remove("active");
    console.log("Overlay deactivated");
  });

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×"; // Using × symbol for close
  closeButton.classList.add("button");
  closeButton.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    z-index: 101;
  `;

  overlay.appendChild(closeButton);

  // Add click handler to close button
  closeButton.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent event from bubbling to overlay
    overlay.classList.remove("active");
    console.log("Overlay closed via button");
  });
});
