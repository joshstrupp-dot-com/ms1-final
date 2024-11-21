// File: FE-attempt-3/collection.js

document.addEventListener("DOMContentLoaded", function () {
  const collection = document.querySelector("#collection");

  if (!collection) {
    console.error("Collection element with ID 'collection' not found.");
    return;
  }

  // Create a container for collection images if it doesn't exist
  let collectionImages = collection.querySelector("#collection-images");
  if (!collectionImages) {
    collectionImages = document.createElement("div");
    collectionImages.id = "collection-images";
    collection.appendChild(collectionImages);
  }

  // Add click event listener to the Collection button
  document.addEventListener(
    "click",
    function (e) {
      if (e.target.matches(".collection-button")) {
        e.stopPropagation(); // Prevent event from bubbling up
        console.log("Collection button clicked");

        // Set title and close button only if they don't exist
        if (!collection.querySelector(".collection-title")) {
          // Create and add title
          const title = document.createElement("h2");
          title.textContent = "Collection";
          title.classList.add("collection-title");
          collection.insertBefore(title, collectionImages);

          // Create close button (matching overlay.js style)
          const closeButton = document.createElement("button");
          closeButton.textContent = "×";
          closeButton.className = "overlay-close";
          collection.appendChild(closeButton);

          // Add click handler to close button
          closeButton.addEventListener("click", function (e) {
            e.stopPropagation();
            collection.classList.remove("active");
            console.log("Collection closed via button");
          });
        }

        // Show collection overlay
        collection.classList.add("active");
      }
    },
    false // Ensure it's in the bubbling phase
  );

  // Add click handler to collection overlay itself
  collection.addEventListener("click", function (e) {
    if (e.target === collection) {
      // Only close if clicking the background
      collection.classList.remove("active");
      console.log("Collection deactivated");
    }
  });

  // Listen for the custom 'addToCollection' event
  document.addEventListener("addToCollection", function (e) {
    const imageData = e.detail;
    console.log("Adding to collection:", imageData);

    // Create a new image element
    const newImage = document.createElement("img");
    newImage.src = imageData.src;
    newImage.alt = imageData.alt;

    // Set proportional width and height (50% smaller)
    newImage.style.width = "50%";
    newImage.style.height = "auto"; // Maintain aspect ratio

    // Assign a random position within the collection overlay
    newImage.style.position = "absolute";
    newImage.style.top = `${Math.random() * 80 + 10}%`; // Between 10% and 90%
    newImage.style.left = `${Math.random() * 80 + 10}%`; // Between 10% and 90%
    newImage.style.transform = "translate(-50%, -50%)"; // Center the image at the position

    // Optional: Add transition for smooth appearance
    newImage.style.opacity = "0";
    newImage.style.transition = "opacity 0.5s ease";

    // Make the image draggable
    newImage.style.cursor = "move";
    newImage.draggable = false; // Disable default drag behavior

    // Variables to hold the offset when dragging
    let isDragging = false;
    let startX, startY, initialX, initialY;

    // Mouse events for desktop
    newImage.addEventListener("mousedown", function (e) {
      e.preventDefault();
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = newImage.getBoundingClientRect();
      initialX = rect.left + rect.width / 2; // Center X
      initialY = rect.top + rect.height / 2; // Center Y
      newImage.style.transition = "none"; // Disable transition during drag
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e) {
      if (!isDragging) return;
      let dx = e.clientX - startX;
      let dy = e.clientY - startY;
      newImage.style.left = `${initialX + dx}px`;
      newImage.style.top = `${initialY + dy}px`;
      newImage.style.transform = "translate(-50%, -50%)"; // Keep image centered
    }

    function onMouseUp(e) {
      if (!isDragging) return;
      isDragging = false;
      newImage.style.transition = "opacity 0.5s ease"; // Re-enable transition
    }

    // Touch events for mobile
    newImage.addEventListener("touchstart", function (e) {
      e.preventDefault();
      isDragging = true;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      const rect = newImage.getBoundingClientRect();
      initialX = rect.left + rect.width / 2;
      initialY = rect.top + rect.height / 2;
      newImage.style.transition = "none";
    });

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

    function onTouchMove(e) {
      if (!isDragging) return;
      const touch = e.touches[0];
      let dx = touch.clientX - startX;
      let dy = touch.clientY - startY;
      newImage.style.left = `${initialX + dx}px`;
      newImage.style.top = `${initialY + dy}px`;
      newImage.style.transform = "translate(-50%, -50%)";
    }

    function onTouchEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      newImage.style.transition = "opacity 0.5s ease";
    }

    // Append the image to the collection images container
    collectionImages.appendChild(newImage);

    // Trigger reflow and then set opacity to 1 for transition
    requestAnimationFrame(() => {
      newImage.style.opacity = "1";
    });
  });
});
