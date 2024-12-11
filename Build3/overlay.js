document.addEventListener("DOMContentLoaded", function () {
  // Select the overlay element directly
  const overlay = document.querySelector("#overlay");

  // Check if the overlay exists
  if (!overlay) {
    console.error("Overlay element with ID 'overlay' not found.");
    return;
  }

  const galleryDepth = document.querySelector("#gallery-depth");

  galleryDepth.addEventListener("click", function (e) {
    if (e.target.matches("li img")) {
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

      // Copy all data attributes from the clicked image to the overlay image
      Object.keys(e.target.dataset).forEach((key) => {
        overlayImage.dataset[key] = e.target.dataset[key];
      });

      // Log the copied data attributes
      console.log("Copied data attributes:", overlayImage.dataset);

      imageContainer.appendChild(overlayImage);

      // Retrieve bounding_box data
      const boundingBoxData = e.target.dataset.bounding_box; // e.g., "[x1, y1, x2, y2]"

      // Append the image container to the overlay
      overlay.appendChild(imageContainer);

      // After the image loads, draw the bounding box
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
            boundingBoxDiv.style.border = "2px dashed white";
            boundingBoxDiv.style.boxSizing = "border-box";
            boundingBoxDiv.style.pointerEvents = "none"; // Allow clicks through the box
            boundingBoxDiv.style.filter =
              "drop-shadow(0 0 2px rgba(0,0,0,0.5))";

            // Append the bounding box div to the image container
            imageContainer.appendChild(boundingBoxDiv);
          } catch (error) {
            console.error("Error parsing bounding_box data:", error);
          }
        }
      };

      // Create the "+ Add to Collection" button
      const addToCollectionButton = document.createElement("button");
      addToCollectionButton.textContent = "+ Entire Image";
      addToCollectionButton.className = "button add-to-collection";
      imageContainer.appendChild(addToCollectionButton);

      // Create the "+ Crop" button
      const addCropButton = document.createElement("button");
      addCropButton.textContent = "+ Crop";
      addCropButton.className = "button add-crop";
      addCropButton.style.position = "absolute";
      addCropButton.style.display = "none"; // Initially hidden
      imageContainer.appendChild(addCropButton);

      // Append the image container to the overlay
      overlay.appendChild(imageContainer);

      // Add hover effect to show "+ Crop" button
      overlayImage.addEventListener("mouseenter", function () {
        addCropButton.style.display = "block";
      });

      overlayImage.addEventListener("mouseleave", function () {
        addCropButton.style.display = "none";
      });

      // Move "+ Crop" button with cursor
      overlayImage.addEventListener("mousemove", function (e) {
        const rect = overlayImage.getBoundingClientRect();
        addCropButton.style.left = `${e.clientX - rect.left}px`;
        addCropButton.style.top = `${e.clientY - rect.top}px`;
      });

      // Add click handler to the "+ Add to Collection" button
      addToCollectionButton.addEventListener("click", function (e) {
        e.stopPropagation();
        addToCollectionButton.classList.add("clicked");
        addToCollectionButton.textContent = "Added to Closet";

        const imageSrc = overlayImage.src;
        const imageAlt = overlayImage.alt;
        const croppedImagePath =
          overlayImage.dataset.cropped_image_path || "Unknown";

        const imageData = getImageData(
          overlayImage,
          imageSrc,
          imageAlt,
          croppedImagePath
        );
        console.log("Adding to collection with data:", imageData);

        const addToCollectionEvent = new CustomEvent("addToCollection", {
          detail: imageData,
        });
        document.dispatchEvent(addToCollectionEvent);
      });

      // Add click handler to the image for "+ Crop"
      overlayImage.addEventListener("click", function (e) {
        e.stopPropagation();
        addCropButton.classList.add("clicked");
        addCropButton.textContent = "Added to Closet";

        const croppedImagePath =
          "../" + (overlayImage.dataset.cropped_image_path || "Unknown");
        const imageData = getImageData(
          overlayImage,
          croppedImagePath,
          overlayImage.alt,
          croppedImagePath
        );

        console.log("Adding cropped image to collection with data:", imageData);

        const addToCollectionEvent = new CustomEvent("addToCollection", {
          detail: imageData,
        });
        document.dispatchEvent(addToCollectionEvent);
      });

      // Create text box div
      const textBox = document.createElement("div");
      textBox.classList.add("text-box");

      // Function to safely retrieve dataset values
      const getValidData = (data) => {
        return data && data !== "Unknown" ? data : null;
      };

      // Retrieve and validate dataset values
      const title = getValidData(e.target.dataset.title) || "Untitled";
      const museum = getValidData(e.target.dataset.museum);
      const medium = getValidData(e.target.dataset.medium);
      const place = getValidData(e.target.dataset.est_place);
      const topic = getValidData(e.target.dataset.topic);
      const year = getValidData(e.target.dataset.est_year);
      const description = getValidData(e.target.dataset.description);

      // Initialize metadata HTML
      let metadataHTML = '<div class="metadata">';

      // Conditionally add each field if it's valid
      if (museum) {
        metadataHTML += `<p class="h3"><strong>Museum:</strong> <span class="museum-span">${museum}</span></p>`;
      }
      if (medium) {
        metadataHTML += `<p class="h3"><strong>Medium:</strong> ${medium}</p>`;
      }
      if (place) {
        metadataHTML += `<p class="h3"><strong>Place:</strong> ${place}</p>`;
      }
      if (topic) {
        metadataHTML += `<p class="h3"><strong>Topic:</strong> <span class="topic-span">${topic}</span></p>`;
      }
      if (year) {
        metadataHTML += `<p class="h3"><strong>Year:</strong> <span class="year-span">${year}</span></p>`;
      }
      if (description) {
        metadataHTML += `<p class="h3 description"><strong>Description:</strong> ${description}</p>`;
      }

      metadataHTML += "</div>";

      // Construct the final innerHTML
      textBox.innerHTML = `
        <h2 class="title">${title}</h2>
        ${metadataHTML}
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
    }
  });

  // Feature deactivated as per instructions
});

function getImageData(overlayImage, imageSrc, imageAlt, croppedImagePath) {
  // Debug: Log all available dataset attributes
  console.log("All available dataset attributes:", {
    raw: overlayImage.dataset,
    keys: Object.keys(overlayImage.dataset),
    recordId: overlayImage.dataset.recordId,
    museum: overlayImage.dataset.museum,
    // ... add other attributes you expect to have
  });

  const data = {
    src: imageSrc,
    alt: imageAlt,
    croppedImagePath: croppedImagePath,
    record_id: overlayImage.dataset.recordId,
    [CONFIG.DATA_KEYS.MUSEUM]: overlayImage.dataset.museum,
    [CONFIG.DATA_KEYS.MEDIUM]: overlayImage.dataset.medium,
    [CONFIG.DATA_KEYS.EST_PLACE]: overlayImage.dataset.estPlace,
    [CONFIG.DATA_KEYS.TOPIC]: overlayImage.dataset.topic,
    [CONFIG.DATA_KEYS.EST_YEAR]: overlayImage.dataset.estYear,
    [CONFIG.DATA_KEYS.DESCRIPTION]: overlayImage.dataset.description,
    [CONFIG.DATA_KEYS.CREDIT_LINE]: overlayImage.dataset.creditLine,
    [CONFIG.DATA_KEYS.OBJECT_NAME]: overlayImage.dataset.objectName,
    [CONFIG.DATA_KEYS.PHYSICAL_DESCRIPTION]:
      overlayImage.dataset.physicalDescription,
    [CONFIG.DATA_KEYS.PLACE_MADE]: overlayImage.dataset.placeMade,
    [CONFIG.DATA_KEYS.SEE_MORE_ITEMS_IN]: overlayImage.dataset.seeMoreItemsIn,
    [CONFIG.DATA_KEYS.SUBJECT]: overlayImage.dataset.subject,
    [CONFIG.DATA_KEYS.ALL_PLACES]: overlayImage.dataset.allPlaces,
    [CONFIG.DATA_KEYS.ALL_YEARS]: overlayImage.dataset.allYears,
    [CONFIG.DATA_KEYS.COMBINED_TOPIC_TEXT]:
      overlayImage.dataset.combinedTopicText,
    [CONFIG.DATA_KEYS.COMBINED_MEDIUM_TEXT]:
      overlayImage.dataset.combinedMediumText,
  };

  console.log("Data being sent from overlay:", data);
  console.log("Raw dataset from overlayImage:", overlayImage.dataset);
  return data;
}
