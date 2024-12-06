//  * Implements lazy loading for images using the Intersection Observer API.
//  * This function improves page performance by only loading images when they
//  * become visible in the viewport.
export function observeImages(images) {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  images.forEach((img) => {
    observer.observe(img);
  });
}

// Updated helper function to create and position a bounding box and overlay
export function createBoundingBox(boundingBoxData, imageElement) {
  if (!boundingBoxData) return { boundingBoxDiv: null, overlayDiv: null };

  try {
    const boundingBox = JSON.parse(boundingBoxData);

    // Get the image's displayed dimensions
    const rect = imageElement.getBoundingClientRect();
    const displayedWidth = rect.width;
    const displayedHeight = rect.height;

    // Get the image's intrinsic dimensions
    const naturalWidth = imageElement.naturalWidth;
    const naturalHeight = imageElement.naturalHeight;

    // Calculate the scaling ratio while maintaining aspect ratio
    const imageRatio = naturalWidth / naturalHeight;
    const containerRatio = displayedWidth / displayedHeight;

    let scaleX, scaleY;
    if (containerRatio > imageRatio) {
      // Image is constrained by height
      scaleY = displayedHeight / naturalHeight;
      scaleX = scaleY;
    } else {
      // Image is constrained by width
      scaleX = displayedWidth / naturalWidth;
      scaleY = scaleX;
    }

    // Calculate the offset for centering
    const scaledWidth = naturalWidth * scaleX;
    const scaledHeight = naturalHeight * scaleY;
    const offsetX = (displayedWidth - scaledWidth) / 2;
    const offsetY = (displayedHeight - scaledHeight) / 2;

    // Calculate positioned coordinates
    const x1 = boundingBox[0] * scaleX + offsetX;
    const y1 = boundingBox[1] * scaleY + offsetY;
    const x2 = boundingBox[2] * scaleX + offsetX;
    const y2 = boundingBox[3] * scaleY + offsetY;

    // Create and style the bounding box div
    const boundingBoxDiv = document.createElement("div");
    boundingBoxDiv.className = "bounding-box";
    boundingBoxDiv.style.position = "absolute";
    boundingBoxDiv.style.left = `${x1}px`;
    boundingBoxDiv.style.top = `${y1}px`;
    boundingBoxDiv.style.width = `${x2 - x1}px`;
    boundingBoxDiv.style.height = `${y2 - y1}px`;

    boundingBoxDiv.style.boxSizing = "border-box";
    boundingBoxDiv.style.pointerEvents = "none";
    boundingBoxDiv.style.transition = "opacity 0.3s ease";

    // Create and style the overlay div
    const overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay";
    overlayDiv.style.position = "absolute";
    overlayDiv.style.left = "0";
    overlayDiv.style.top = "0";
    overlayDiv.style.width = "100%";
    overlayDiv.style.height = "100%";
    overlayDiv.style.backgroundColor = "rgba(242, 238, 235, 0.5)";
    overlayDiv.style.pointerEvents = "none";
    overlayDiv.style.clipPath = `polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${x1}px ${y1}px,
      ${x1}px ${y2}px,
      ${x2}px ${y2}px,
      ${x2}px ${y1}px,
      ${x1}px ${y1}px
    )`;
    overlayDiv.style.transition = "opacity 0.3s ease";

    return { boundingBoxDiv, overlayDiv };
  } catch (error) {
    console.error("Error creating bounding box and overlay:", error);
    return { boundingBoxDiv: null, overlayDiv: null };
  }
}

export function createImageElement(item, options = {}) {
  const img = document.createElement("img");
  img.width = options.width || 200;
  img.height = options.height || 200;
  img.dataset.src = item[CONFIG.DATA_KEYS.IMAGE_URL];
  img.src = options.placeholder || "placeholder-image.jpg";
  img.alt = item[CONFIG.DATA_KEYS.TITLE] || "Image";

  // Set additional data attributes based on CONFIG.DATA_KEYS
  Object.keys(CONFIG.DATA_KEYS).forEach((key) => {
    const dataKey = CONFIG.DATA_KEYS[key];
    if (item[dataKey]) {
      img.dataset[key.toLowerCase()] = item[dataKey];
    }
  });

  // Create a wrapper div for the image and bounding box
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block"; // Ensure proper positioning
  wrapper.appendChild(img);

  // Add load event listener to create bounding box and overlay after image loads
  img.addEventListener("load", function () {
    const { boundingBoxDiv, overlayDiv } = createBoundingBox(
      img.dataset.bounding_box,
      img
    );
    if (boundingBoxDiv) {
      wrapper.appendChild(boundingBoxDiv);
    }
    if (overlayDiv) {
      wrapper.appendChild(overlayDiv);
    }

    // Add hover event listeners to handle overlay and bounding box opacity
    wrapper.addEventListener("mouseenter", () => {
      if (overlayDiv) {
        overlayDiv.style.opacity = "0";
      }
      if (boundingBoxDiv) {
        boundingBoxDiv.style.opacity = "0";
      }
    });

    wrapper.addEventListener("mouseleave", () => {
      if (overlayDiv) {
        overlayDiv.style.opacity = "1";
      }
      if (boundingBoxDiv) {
        boundingBoxDiv.style.opacity = "1";
      }
    });
  });

  return wrapper; // Return the wrapper instead of just the img
}
