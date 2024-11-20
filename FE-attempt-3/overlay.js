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
    position: fixed;
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

    // Add click event listener to gallery images to show metadata
    document.addEventListener("click", function (e) {
      if (e.target.matches("#gallery-depth li img")) {
        const clickedImage = e.target;
        const rowData = {
          Museum: clickedImage.dataset.museum,
          Medium: clickedImage.dataset.medium,
          est_place: clickedImage.dataset.est_place,
          topic: clickedImage.dataset.topic,
          est_year: clickedImage.dataset.est_year,
          title: clickedImage.dataset.title,
          description: clickedImage.dataset.description,
          img_url: clickedImage.src,
          cropped_image_path: clickedImage.dataset.cropped_image_path,
          "Bounding Box": clickedImage.dataset.bounding_box,
          Area: clickedImage.dataset.area,
          Title: clickedImage.dataset.title,
        };

        console.log("Clicked image metadata:", rowData);
        // Clear any existing content in overlay
        overlay.innerHTML = "";

        // Create and display image in overlay
        const overlayImage = document.createElement("img");
        overlayImage.src = clickedImage.src;
        overlay.appendChild(overlayImage);
        overlay.classList.add("active");

        // Create text box div
        const textBox = document.createElement("div");
        textBox.classList.add("text-box");

        // Create formatted content with proper styling
        textBox.innerHTML = `
                 <h2 class="title">${rowData.Title || "Untitled"}</h2>
                 <div class="metadata">
                   <p class="H3"><strong>Museum:</strong> ${
                     rowData.Museum || "Unknown"
                   }</p>
                   <p class="H3"><strong>Medium:</strong> ${
                     rowData.Medium || "Unknown"
                   }</p>
                   <p class="H3"><strong>Place:</strong> ${
                     rowData.est_place || "Unknown"
                   }</p>
                   <p class="H3"><strong>Topic:</strong> ${
                     rowData.topic || "Unknown"
                   }</p>
                   <p class="H3"><strong>Year:</strong> ${
                     rowData.est_year || "Unknown"
                   }</p>
                   <p class="H3 description"><strong>Description:</strong> ${
                     rowData.description || "No description available"
                   }</p>
                 </div>
               `;

        // Add text box to overlay
        overlay.appendChild(textBox);

        // Create close button
        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        closeButton.className = "overlay-close";
        overlay.appendChild(closeButton);

        // Show overlay
        overlay.classList.add("active");

        // Add click handler to close button
        closeButton.addEventListener("click", function (e) {
          e.stopPropagation(); // Prevent event from bubbling to overlay
          overlay.classList.remove("active");
        });
      }
    });

    // Add click handler to overlay itself
    overlay.addEventListener("click", function () {
      overlay.classList.remove("active");
    });
  });
});
