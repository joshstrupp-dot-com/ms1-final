// File: FE-attempt-3/collection.js

import { CONFIG } from "./config.js";

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

    // Get container dimensions
    const containerRect = collectionImages.getBoundingClientRect();

    // Create a wrapper div for the image and resize handles
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";

    // Create temporary image to get natural dimensions
    const tempImg = new Image();
    tempImg.src = imageData.src;

    tempImg.onload = function () {
      const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;

      // Set initial size maintaining aspect ratio
      const baseSize = 200; // Base size for either width or height
      let initialWidth, initialHeight;

      if (aspectRatio > 1) {
        // Landscape image
        initialWidth = baseSize;
        initialHeight = baseSize / aspectRatio;
      } else {
        // Portrait or square image
        initialHeight = baseSize;
        initialWidth = baseSize * aspectRatio;
      }

      wrapper.style.width = `${initialWidth}px`;
      wrapper.style.height = `${initialHeight}px`;

      // Position within container accounting for actual dimensions
      wrapper.style.left = `${
        Math.random() * (containerRect.width - initialWidth)
      }px`;
      wrapper.style.top = `${
        Math.random() * (containerRect.height - initialHeight)
      }px`;
    };

    wrapper.style.transform = "none";
    wrapper.style.cursor = "move";
    wrapper.style.border = "1px solid #ccc";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.zIndex = "100";

    // Create the image element
    const newImage = document.createElement("img");
    newImage.src = imageData.src;
    newImage.alt = imageData.alt;
    newImage.style.width = "100%";
    newImage.style.height = "100%";
    newImage.style.display = "block";

    // Add image to wrapper
    wrapper.appendChild(newImage);

    // Add resize handles
    const handleSize = 10; // Size of resize handles in pixels
    const positions = ["nw", "ne", "sw", "se"];
    positions.forEach((pos) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle ${pos}`;
      handle.style.position = "absolute";
      handle.style.width = `${handleSize}px`;
      handle.style.height = `${handleSize}px`;
      handle.style.backgroundColor = "#fff";
      handle.style.border = "1px solid #666";
      handle.style.borderRadius = "50%";
      handle.style.cursor = `${pos}-resize`;

      // Position handles at corners
      switch (pos) {
        case "nw":
          handle.style.left = `-${handleSize / 2}px`;
          handle.style.top = `-${handleSize / 2}px`;
          break;
        case "ne":
          handle.style.right = `-${handleSize / 2}px`;
          handle.style.top = `-${handleSize / 2}px`;
          break;
        case "sw":
          handle.style.left = `-${handleSize / 2}px`;
          handle.style.bottom = `-${handleSize / 2}px`;
          break;
        case "se":
          handle.style.right = `-${handleSize / 2}px`;
          handle.style.bottom = `-${handleSize / 2}px`;
          break;
        default:
          break;
      }

      wrapper.appendChild(handle);
    });

    // Variables for dragging and resizing
    let isDragging = false;
    let isResizing = false;
    let currentHandle = null;
    let startX, startY;
    let initialX, initialY;
    let initialWidth, initialHeight;

    // Function to clamp values within min and max
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    // Mouse events for dragging
    wrapper.addEventListener("mousedown", function (e) {
      if (e.target.classList.contains("resize-handle")) {
        // Start resizing
        isResizing = true;
        currentHandle = e.target.classList.contains("nw")
          ? "nw"
          : e.target.classList.contains("ne")
          ? "ne"
          : e.target.classList.contains("sw")
          ? "sw"
          : "se";
        startX = e.clientX;
        startY = e.clientY;
        const rect = wrapper.getBoundingClientRect();
        initialWidth = rect.width;
        initialHeight = rect.height;
        initialX = rect.left - containerRect.left;
        initialY = rect.top - containerRect.top;
        e.preventDefault();
      } else {
        // Start dragging
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = wrapper.getBoundingClientRect();
        initialX = rect.left - containerRect.left;
        initialY = rect.top - containerRect.top;
        e.preventDefault();
      }
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        let newX = initialX + dx;
        let newY = initialY + dy;

        // Clamp to container boundaries
        newX = clamp(newX, 0, containerRect.width - wrapper.offsetWidth);
        newY = clamp(newY, 0, containerRect.height - wrapper.offsetHeight);

        wrapper.style.left = `${newX}px`;
        wrapper.style.top = `${newY}px`;
      } else if (isResizing && currentHandle) {
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        let newWidth = initialWidth;
        let newHeight = initialHeight;
        let newLeft = initialX;
        let newTop = initialY;

        // Determine new size based on handle position
        if (currentHandle.includes("e")) {
          newWidth = initialWidth + dx;
        }
        if (currentHandle.includes("s")) {
          newHeight = initialHeight + dy;
        }
        if (currentHandle.includes("w")) {
          newWidth = initialWidth - dx;
          newLeft = initialX + dx;
        }
        if (currentHandle.includes("n")) {
          newHeight = initialHeight - dy;
          newTop = initialY + dy;
        }

        // Set minimum size
        newWidth = clamp(newWidth, 50, containerRect.width - newLeft);
        newHeight = clamp(newHeight, 50, containerRect.height - newTop);

        // Update wrapper size and position
        wrapper.style.width = `${newWidth}px`;
        wrapper.style.height = `${newHeight}px`;
        wrapper.style.left = `${newLeft}px`;
        wrapper.style.top = `${newTop}px`;
      }
    });

    document.addEventListener("mouseup", function (e) {
      isDragging = false;
      isResizing = false;
      currentHandle = null;
    });

    // Touch events for mobile (optional: for better UX)
    wrapper.addEventListener("touchstart", function (e) {
      if (e.target.classList.contains("resize-handle")) {
        // Start resizing
        isResizing = true;
        currentHandle = e.target.classList.contains("nw")
          ? "nw"
          : e.target.classList.contains("ne")
          ? "ne"
          : e.target.classList.contains("sw")
          ? "sw"
          : "se";
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = wrapper.getBoundingClientRect();
        initialWidth = rect.width;
        initialHeight = rect.height;
        initialX = rect.left - containerRect.left;
        initialY = rect.top - containerRect.top;
        e.preventDefault();
      } else {
        // Start dragging
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = wrapper.getBoundingClientRect();
        initialX = rect.left - containerRect.left;
        initialY = rect.top - containerRect.top;
        e.preventDefault();
      }
    });

    document.addEventListener("touchmove", function (e) {
      if (isDragging) {
        const touch = e.touches[0];
        let dx = touch.clientX - startX;
        let dy = touch.clientY - startY;
        let newX = initialX + dx;
        let newY = initialY + dy;

        // Clamp to container boundaries
        newX = clamp(newX, 0, containerRect.width - wrapper.offsetWidth);
        newY = clamp(newY, 0, containerRect.height - wrapper.offsetHeight);

        wrapper.style.left = `${newX}px`;
        wrapper.style.top = `${newY}px`;
      } else if (isResizing && currentHandle) {
        const touch = e.touches[0];
        let dx = touch.clientX - startX;
        let dy = touch.clientY - startY;
        let newWidth = initialWidth;
        let newHeight = initialHeight;
        let newLeft = initialX;
        let newTop = initialY;

        // Determine new size based on handle position
        if (currentHandle.includes("e")) {
          newWidth = initialWidth + dx;
        }
        if (currentHandle.includes("s")) {
          newHeight = initialHeight + dy;
        }
        if (currentHandle.includes("w")) {
          newWidth = initialWidth - dx;
          newLeft = initialX + dx;
        }
        if (currentHandle.includes("n")) {
          newHeight = initialHeight - dy;
          newTop = initialY + dy;
        }

        // Set minimum size
        newWidth = clamp(newWidth, 50, containerRect.width - newLeft);
        newHeight = clamp(newHeight, 50, containerRect.height - newTop);

        // Update wrapper size and position
        wrapper.style.width = `${newWidth}px`;
        wrapper.style.height = `${newHeight}px`;
        wrapper.style.left = `${newLeft}px`;
        wrapper.style.top = `${newTop}px`;
      }
    });

    document.addEventListener("touchend", function (e) {
      isDragging = false;
      isResizing = false;
      currentHandle = null;
    });

    // Append the wrapper to the collection images container
    collectionImages.appendChild(wrapper);

    // Trigger reflow and then set opacity to 1 for transition
    requestAnimationFrame(() => {
      newImage.style.opacity = "1";
    });
  });
});
