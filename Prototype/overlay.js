// File: FE-attempt-3/overlay.js

document.addEventListener("DOMContentLoaded", function () {
  // Select the overlay element directly
  const overlay = document.querySelector("#overlay");

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

      // Clear any existing content in overlay
      overlay.innerHTML = "";

      // Create a container for the image and the add button
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");
      imageContainer.style.position = "relative"; // Ensure positioning context

      // Create and display image in overlay
      const overlayImage = document.createElement("img");
      overlayImage.src = e.target.src;
      overlayImage.alt = e.target.alt;
      overlayImage.className = "overlay-image"; // Add a class for styling
      imageContainer.appendChild(overlayImage);

      // Retrieve bounding_box data
      const boundingBoxData = e.target.dataset.bounding_box; // e.g., "[x1, y1, x2, y2]"

      // Append the image container to the overlay
      overlay.appendChild(imageContainer);

      // After the image loads, draw the bounding box
      overlayImage.onload = function () {
        if (boundingBoxData) {
          try {
            // Parse the bounding_box data
            const boundingBox = JSON.parse(boundingBoxData); // [x1, y1, x2, y2]

            // Get the natural dimensions of the image
            const naturalWidth = overlayImage.naturalWidth;
            const naturalHeight = overlayImage.naturalHeight;

            // Get the displayed dimensions of the image
            const displayedWidth = overlayImage.clientWidth;
            const displayedHeight = overlayImage.clientHeight;

            // Calculate the scale factors
            const scaleX = displayedWidth / naturalWidth;
            const scaleY = displayedHeight / naturalHeight;

            // Calculate the bounding box position and size on the displayed image
            const x1 = boundingBox[0] * scaleX;
            const y1 = boundingBox[1] * scaleY;
            const x2 = boundingBox[2] * scaleX;
            const y2 = boundingBox[3] * scaleY;

            // Create and style the bounding box div
            const boundingBoxDiv = document.createElement("div");
            boundingBoxDiv.className = "bounding-box";
            boundingBoxDiv.style.position = "absolute";
            boundingBoxDiv.style.left = `${x1}px`;
            boundingBoxDiv.style.top = `${y1}px`;
            boundingBoxDiv.style.width = `${x2 - x1}px`;
            boundingBoxDiv.style.height = `${y2 - y1}px`;
            boundingBoxDiv.style.border = "2px solid red";
            boundingBoxDiv.style.boxSizing = "border-box";
            boundingBoxDiv.style.pointerEvents = "none"; // Allow clicks through the box

            // Append the bounding box div to the image container
            imageContainer.appendChild(boundingBoxDiv);
          } catch (error) {
            console.error("Error parsing bounding_box data:", error);
          }
        }
      };

      // Create the "+ Add to Collection" button
      const addToCollectionButton = document.createElement("button");
      addToCollectionButton.textContent = "+ Add to Collection";
      addToCollectionButton.className = "button add-to-collection";
      imageContainer.appendChild(addToCollectionButton);

      // Append the image container to the overlay
      overlay.appendChild(imageContainer);

      // Create text box div
      const textBox = document.createElement("div");
      textBox.classList.add("text-box");

      // Create formatted content with proper styling
      textBox.innerHTML = `
        <h2 class="title">${e.target.dataset.title || "Untitled"}</h2>
        <div class="metadata">
          <p class="H3"><strong>Museum:</strong> ${
            e.target.dataset.museum || "Unknown"
          }</p>
          <p class="H3"><strong>Medium:</strong> ${
            e.target.dataset.medium || "Unknown"
          }</p>
          <p class="H3"><strong>Place:</strong> ${
            e.target.dataset.est_place || "Unknown"
          }</p>
          <p class="H3"><strong>Topic:</strong> ${
            e.target.dataset.topic || "Unknown"
          }</p>
          <p class="H3"><strong>Year:</strong> ${
            e.target.dataset.est_year || "Unknown"
          }</p>
          <p class="H3 description"><strong>Description:</strong> ${
            e.target.dataset.description || "No description available"
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

      // Add click handler to close button
      closeButton.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent event from bubbling to overlay
        overlay.classList.remove("active");
        console.log("Overlay closed via button");
      });

      // Add click handler to the "+ Add to Collection" button
      addToCollectionButton.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent event from bubbling to overlay
        // Add clicked class
        this.classList.add("clicked");

        // Change button text
        this.textContent = "Added to Collection";

        // Implement your add to collection logic here
        console.log("+ Add to Collection button clicked");

        // Retrieve image details
        const imageSrc = overlayImage.src;
        const imageAlt = overlayImage.alt;

        // Create an object with image details
        const imageData = {
          src: imageSrc,
          alt: imageAlt,
        };

        // Dispatch a custom event to add the image to the collection
        const addToCollectionEvent = new CustomEvent("addToCollection", {
          detail: imageData,
        });
        document.dispatchEvent(addToCollectionEvent);
      });
    }
  });

  // Add click listener to the overlay to hide it when clicked outside content
  overlay.addEventListener("click", function () {
    overlay.classList.remove("active");
    console.log("Overlay deactivated");
  });
});
