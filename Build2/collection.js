// File: FE-attempt-3/collection.js

import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing collection");

  const collection = document.querySelector("#collection");
  console.log("Collection element:", collection);

  if (!collection) {
    console.error("Collection element with ID 'collection' not found.");
    return;
  }

  // Create a container for collection images if it doesn't exist
  let collectionImages = collection.querySelector("#collection-images");
  console.log("Collection images container:", collectionImages);

  if (!collectionImages) {
    collectionImages = document.createElement("div");
    collectionImages.id = "collection-images";
    collection.appendChild(collectionImages);
    console.log("Created new collection images container");
  }

  // Set up initial state with title and close button
  if (!collection.querySelector(".collection-title")) {
    console.log("Setting up initial collection state");

    // Create and add title
    const title = document.createElement("h2");
    title.textContent = "Your Closet";
    title.classList.add("collection-title");
    collection.insertBefore(title, collectionImages);
    console.log("Added closet title");

    // Create and add subtitle text
    const subtitle = document.createElement("p");
    subtitle.innerHTML =
      "Click and drag to mix and match.<br>Right click to delete or re-order.";
    subtitle.classList.add("collection-subtitle");
    subtitle.style.textAlign = "center";
    collection.insertBefore(subtitle, collectionImages);
    console.log("Added subtitle text");

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.className = "overlay-close";
    collection.appendChild(closeButton);
    console.log("Added close button");

    // Add click handler to close button
    closeButton.addEventListener("click", function (e) {
      e.stopPropagation();
      collection.classList.remove("active");
      console.log("Collection closed via button");
    });
  }

  // Show collection by default
  collection.classList.add("active");
  console.log("Collection shown by default");

  // Add hover event listeners to images to show/hide collection button
  const images = document.querySelectorAll(".image-container img");
  console.log("Found image containers:", images.length);

  images.forEach((img) => {
    const container = img.closest(".image-container");
    const button = container.querySelector(".collection-button");
    console.log("Setting up hover events for image:", img.alt);

    // Initially hide all collection buttons
    if (button) {
      button.style.display = "none";
      console.log("Initially hiding collection button");
    }

    // Show button on hover
    container.addEventListener("mouseenter", () => {
      if (button) {
        button.style.display = "block";
        console.log("Showing collection button on hover");
      }
    });

    // Hide button when mouse leaves
    container.addEventListener("mouseleave", () => {
      if (button) {
        button.style.display = "none";
        console.log("Hiding collection button on mouse leave");
      }
    });
  });

  // Add click event listener to the Collection button
  document.addEventListener(
    "click",
    function (e) {
      if (e.target.matches(".collection-button")) {
        e.stopPropagation(); // Prevent event from bubbling up
        console.log("Collection button clicked");

        // Set title and close button only if they don't exist
        if (!collection.querySelector(".collection-title")) {
          console.log("Setting up collection title and close button");

          // Create and add title
          const title = document.createElement("h2");
          title.textContent = "Closet";
          title.classList.add("collection-title");
          collection.insertBefore(title, collectionImages);
          console.log("Added closet title");

          // Create close button (matching overlay.js style)
          const closeButton = document.createElement("button");
          closeButton.textContent = "×";
          closeButton.className = "overlay-close";
          collection.appendChild(closeButton);
          console.log("Added close button");

          // Add click handler to close button
          closeButton.addEventListener("click", function (e) {
            e.stopPropagation();
            collection.classList.remove("active");
            console.log("Collection closed via button");
          });
        }

        // Show collection overlay
        collection.classList.add("active");
        console.log("Collection overlay activated");
      }
    },
    false // Ensure it's in the bubbling phase
  );

  // Add click handler to collection overlay itself
  collection.addEventListener("click", function (e) {
    if (e.target === collection) {
      // Only close if clicking the background
      collection.classList.remove("active");
      console.log("Collection deactivated by background click");
    }
  });

  // Listen for the custom 'addToCollection' event
  document.addEventListener("addToCollection", function (e) {
    const imageData = e.detail;
    console.log("Adding to collection:", imageData);

    // Get container dimensions
    const containerRect = collectionImages.getBoundingClientRect();
    console.log("Collection container dimensions:", containerRect);

    // Create a wrapper div for the image and resize handles
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";

    if (imageData.isPreloaded) {
      // Set size if provided
      if (imageData.size) {
        wrapper.style.width = imageData.size.width;
        wrapper.style.height = imageData.size.height;
      }
      // Set z-index for layering
      wrapper.style.zIndex = imageData.layer;
    } else {
      wrapper.style.zIndex = "1"; // Default z-index for new images
    }

    addContextMenu(wrapper);

    // Create temporary image to get natural dimensions
    const tempImg = new Image();
    tempImg.src = imageData.src;
    console.log("Loading temporary image for dimensions");

    tempImg.onload = function () {
      console.log("Temporary image loaded");
      const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
      console.log("Image aspect ratio:", aspectRatio);

      // Set initial size maintaining aspect ratio
      const baseSize = 200;
      let initialWidth, initialHeight;

      if (aspectRatio > 1) {
        initialWidth = baseSize;
        initialHeight = baseSize / aspectRatio;
        console.log("Setting landscape dimensions");
      } else {
        initialHeight = baseSize;
        initialWidth = baseSize * aspectRatio;
        console.log("Setting portrait/square dimensions");
      }

      wrapper.style.width = `${initialWidth}px`;
      wrapper.style.height = `${initialHeight}px`;
      console.log("Set initial wrapper dimensions:", {
        width: initialWidth,
        height: initialHeight,
      });

      // Position the wrapper
      if (imageData.isPreloaded && imageData.position) {
        // Use predefined position for preloaded images
        wrapper.style.left = imageData.position.left;
        wrapper.style.top = imageData.position.top;
        console.log("Positioned preloaded image at:", imageData.position);
      } else {
        // Use random positioning for newly added images
        const randomLeft = Math.random() * (containerRect.width - initialWidth);
        const randomTop =
          Math.random() * (containerRect.height - initialHeight);
        wrapper.style.left = `${randomLeft}px`;
        wrapper.style.top = `${randomTop}px`;
        console.log("Positioned new image randomly at:", {
          left: randomLeft,
          top: randomTop,
        });
      }
    };

    wrapper.style.transform = "none";
    wrapper.style.cursor = "move";
    wrapper.style.border = "1px solid #ccc";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.zIndex = "100";
    console.log("Applied wrapper styles");

    // Create the image element
    const newImage = document.createElement("img");
    newImage.src = imageData.src;
    newImage.alt = imageData.alt;
    newImage.style.width = "100%";
    newImage.style.height = "100%";
    newImage.style.display = "block";
    console.log("Created new image element");

    // Add image to wrapper
    wrapper.appendChild(newImage);
    console.log("Added image to wrapper");

    // Add resize handles
    const handleSize = 10; // Size of resize handles in pixels
    const positions = ["nw", "ne", "sw", "se"];
    console.log("Adding resize handles");

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
      console.log(`Added ${pos} resize handle`);
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
        console.log("Started resizing with handle:", currentHandle);
      } else {
        // Start dragging
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = wrapper.getBoundingClientRect();
        initialX = rect.left - containerRect.left;
        initialY = rect.top - containerRect.top;
        e.preventDefault();
        console.log("Started dragging");
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
        // console.log("Dragging to position:", { x: newX, y: newY });
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
        console.log("Resizing to:", {
          width: newWidth,
          height: newHeight,
          left: newLeft,
          top: newTop,
        });
      }
    });

    document.addEventListener("mouseup", function (e) {
      if (isDragging) {
        const rect = wrapper.getBoundingClientRect();
        const containerRect = collectionImages.getBoundingClientRect();
        const leftVw =
          ((rect.left - containerRect.left) / containerRect.width) * 100;
        const topVh =
          ((rect.top - containerRect.top) / containerRect.height) * 100;

        // Get computed z-index
        const zIndex = window.getComputedStyle(wrapper).zIndex;

        // Log position, size, and layer order together
        console.log(`Image: ${newImage.alt}`, {
          position: {
            left: `${leftVw.toFixed(1)}vw`,
            top: `${topVh.toFixed(1)}vh`,
          },
          size: {
            width: `${rect.width.toFixed(1)}px`,
            height: `${rect.height.toFixed(1)}px`,
          },
          layer: zIndex,
        });
      }
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
        console.log("Touch resize started with handle:", currentHandle);
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
        console.log("Touch drag started");
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
        console.log("Touch dragging to:", { x: newX, y: newY });
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
        console.log("Touch resizing to:", {
          width: newWidth,
          height: newHeight,
          left: newLeft,
          top: newTop,
        });
      }
    });

    document.addEventListener("touchend", function (e) {
      if (isDragging) {
        const rect = wrapper.getBoundingClientRect();
        const containerRect = collectionImages.getBoundingClientRect();
        const leftVw =
          ((rect.left - containerRect.left) / containerRect.width) * 100;
        const topVh =
          ((rect.top - containerRect.top) / containerRect.height) * 100;

        // Get computed z-index
        const zIndex = window.getComputedStyle(wrapper).zIndex;

        // Log position, size, and layer order together
        console.log(`Image: ${newImage.alt}`, {
          position: {
            left: `${leftVw.toFixed(1)}vw`,
            top: `${topVh.toFixed(1)}vh`,
          },
          size: {
            width: `${rect.width.toFixed(1)}px`,
            height: `${rect.height.toFixed(1)}px`,
          },
          layer: zIndex,
        });
      }
      isDragging = false;
      isResizing = false;
      currentHandle = null;
    });

    // Append the wrapper to the collection images container
    collectionImages.appendChild(wrapper);
    console.log("Added wrapper to collection");

    // Trigger reflow and then set opacity to 1 for transition
    requestAnimationFrame(() => {
      newImage.style.opacity = "1";
      console.log("Image transition complete");
    });
  });

  // After initial setup but before event listeners
  function preloadCollectionImages() {
    console.log("Preloading collection images");

    const preloadImages = [
      {
        src: "assets/man.png",
        alt: "Man",
        position: { left: "55.1vw", top: "26.7vh" },
        size: { width: "510.9px", height: "558.0px" },
        layer: 1, // backmost
      },
      {
        src: "assets/sleeve-right.png",
        alt: "Sleeve Right",
        position: { left: "53.5vw", top: "39.9vh" },
        size: { width: "142.8px", height: "158.0px" },
        layer: 2,
      },
      {
        src: "assets/dress.png",
        alt: "Dress",
        position: { left: "59.2vw", top: "58.2vh" },
        size: { width: "115.5px", height: "200.0px" },
        layer: 3,
      },
      {
        src: "assets/teddy.png",
        alt: "Teddy",
        position: { left: "62.7vw", top: "22.7vh" },
        size: { width: "162.0px", height: "145.7px" },
        layer: 4,
      },
      {
        src: "assets/sleeve-left.png",
        alt: "Sleeve Left",
        position: { left: "56.9vw", top: "35.9vh" },
        size: { width: "101.8px", height: "108.0px" },
        layer: 5,
      },
      {
        src: "assets/hat.png",
        alt: "Hat",
        position: { left: "62.1vw", top: "10.7vh" },
        size: { width: "157.0px", height: "119.5px" },
        layer: 6,
      },
      {
        src: "assets/boots.png",
        alt: "Boots",
        position: { left: "58.3vw", top: "62.3vh" },
        size: { width: "200.0px", height: "150.0px" }, // Using default size since not provided
        layer: 7, // frontmost
      },
    ];

    preloadImages.forEach((imageData) => {
      const imageEvent = new CustomEvent("addToCollection", {
        detail: {
          src: imageData.src,
          alt: imageData.alt,
          isPreloaded: true,
          position: imageData.position,
          size: imageData.size,
          layer: imageData.layer,
        },
      });

      document.dispatchEvent(imageEvent);
      console.log(
        "Preloaded image:",
        imageData.src,
        "at position:",
        imageData.position,
        "with size:",
        imageData.size,
        "and layer:",
        imageData.layer
      );
    });
  }

  // Call the preload function after collection is initialized
  preloadCollectionImages();

  // Add this function after your other event listeners
  function addContextMenu(wrapper) {
    wrapper.addEventListener("contextmenu", function (e) {
      e.preventDefault(); // Prevent default context menu

      // Create custom context menu with remove option
      const contextMenu = document.createElement("div");
      contextMenu.className = "custom-context-menu";
      contextMenu.innerHTML = `
        <div class="context-menu-item" data-action="bring-front">Bring to Front</div>
        <div class="context-menu-item" data-action="send-back">Send to Back</div>
        <div class="context-menu-item context-menu-delete" data-action="remove">Remove from Closet</div>
      `;

      // Position the menu at click location
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.top = `${e.clientY}px`;
      document.body.appendChild(contextMenu);

      // Handle menu item clicks
      contextMenu.addEventListener("click", function (menuEvent) {
        const action = menuEvent.target.dataset.action;
        if (action === "bring-front") {
          wrapper.style.zIndex = getHighestZIndex() + 1;
        } else if (action === "send-back") {
          const lowestZ = getLowestZIndex();
          if (lowestZ > 1) {
            wrapper.style.zIndex = lowestZ - 1;
          } else {
            wrapper.style.zIndex = 1;
            // Shift all other elements up by 1 if necessary
            const wrappers = document.querySelectorAll(
              "#collection-images > div"
            );
            wrappers.forEach((w) => {
              if (w !== wrapper) {
                const currentZ =
                  parseInt(window.getComputedStyle(w).zIndex) || 1;
                w.style.zIndex = currentZ + 1;
              }
            });
          }
        } else if (action === "remove") {
          // Fade out animation
          wrapper.style.transition = "opacity 0.3s ease-out";
          wrapper.style.opacity = "0";

          // Remove after animation
          setTimeout(() => {
            wrapper.remove();
            console.log("Image removed from collection");
          }, 300);
        }

        // Remove menu after action
        contextMenu.remove();
      });

      // Remove menu when clicking elsewhere
      document.addEventListener("click", function removeMenu() {
        contextMenu.remove();
        document.removeEventListener("click", removeMenu);
      });
    });
  }

  // Helper functions to manage z-index
  function getHighestZIndex() {
    const wrappers = document.querySelectorAll("#collection-images > div");
    let highest = 1; // Start at 1 instead of 0
    wrappers.forEach((w) => {
      const z = parseInt(window.getComputedStyle(w).zIndex) || 0;
      highest = Math.max(highest, z);
    });
    return highest;
  }

  function getLowestZIndex() {
    const wrappers = document.querySelectorAll("#collection-images > div");
    let lowest = 1; // Initialize at 1
    wrappers.forEach((w) => {
      const z = parseInt(window.getComputedStyle(w).zIndex) || 1;
      if (z > 0) {
        // Only consider positive z-indices
        lowest = lowest === 1 ? z : Math.min(lowest, z);
      }
    });
    return lowest;
  }

  // Create and add "Clear All" button
  const clearAllButton = document.createElement("button");
  clearAllButton.textContent = "Clear All";
  clearAllButton.className = "clear-all-button";
  collection.insertBefore(clearAllButton, collection.firstChild);

  // Add click handler to "Clear All" button
  clearAllButton.addEventListener("click", function () {
    const collectionImages = document.querySelector("#collection-images");
    if (collectionImages) {
      collectionImages.innerHTML = ""; // Clear all images
      console.log("All images cleared from collection");
    }
  });
});
