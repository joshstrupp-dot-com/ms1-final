//  * Implements lazy loading for images using the Intersection Observer API.
//  * This function improves page performance by only loading images when they
//  * become visible in the viewport.
export const FILTER_CLASSES = [
  "visualization-filter",
  "museum-filter",
  "topic-filter",
  "est_year-filter",
  // Add other category filter classes here as needed
];

export function observeImages(images) {
  // console.log("Setting up lazy loading for images:", images.length);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };
  // console.log("Intersection Observer options:", options);

  const callback = (entries, observer) => {
    // console.log("Intersection Observer callback triggered");
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // console.log("Loading image:", img.dataset.src);
        img.src = img.dataset.src;
        img.classList.add("loaded");
        observer.unobserve(img);
        // console.log("Image loaded and unobserved");
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);
  // console.log("Created Intersection Observer");

  images.forEach((img) => {
    observer.observe(img);
  });
  // console.log("Started observing all images");
}

// Updated helper function to create and position a bounding box and overlay
export function createBoundingBox(boundingBoxData, imageElement) {
  // console.log("Creating bounding box with data:", boundingBoxData);

  if (!boundingBoxData) {
    // console.log("No bounding box data provided");
    return { boundingBoxDiv: null, overlayDiv: null };
  }

  try {
    const boundingBox = JSON.parse(boundingBoxData);
    // console.log("Parsed bounding box data:", boundingBox);

    // Get the image's displayed dimensions
    const rect = imageElement.getBoundingClientRect();
    const displayedWidth = rect.width;
    const displayedHeight = rect.height;
    // console.log("Image displayed dimensions:", {
    //   displayedWidth,
    //   displayedHeight,
    // });

    // Get the image's intrinsic dimensions
    const naturalWidth = imageElement.naturalWidth;
    const naturalHeight = imageElement.naturalHeight;
    // console.log("Image natural dimensions:", { naturalWidth, naturalHeight });

    // Calculate the scaling ratio while maintaining aspect ratio
    const imageRatio = naturalWidth / naturalHeight;
    const containerRatio = displayedWidth / displayedHeight;
    // console.log("Aspect ratios:", { imageRatio, containerRatio });

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
    // console.log("Scaling factors:", { scaleX, scaleY });

    // Calculate the offset for centering
    const scaledWidth = naturalWidth * scaleX;
    const scaledHeight = naturalHeight * scaleY;
    const offsetX = (displayedWidth - scaledWidth) / 2;
    const offsetY = (displayedHeight - scaledHeight) / 2;
    // console.log("Offsets:", { offsetX, offsetY });

    // Calculate positioned coordinates
    const x1 = boundingBox[0] * scaleX + offsetX;
    const y1 = boundingBox[1] * scaleY + offsetY;
    const x2 = boundingBox[2] * scaleX + offsetX;
    const y2 = boundingBox[3] * scaleY + offsetY;
    // console.log("Calculated coordinates:", { x1, y1, x2, y2 });

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
    // console.log("Created bounding box div");

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
    // console.log("Created overlay div");

    return { boundingBoxDiv, overlayDiv };
  } catch (error) {
    console.error("Error creating bounding box and overlay:", error);
    return { boundingBoxDiv: null, overlayDiv: null };
  }
}

export function createImageElement(item, options = {}) {
  // console.log("Creating image element for item:", item);
  // console.log("Options:", options);

  const img = document.createElement("img");
  img.width = options.width || 200;
  img.height = options.height || 200;
  img.dataset.src = item[CONFIG.DATA_KEYS.IMAGE_URL];
  img.src = options.placeholder || "placeholder-image.jpg";
  img.alt = item[CONFIG.DATA_KEYS.TITLE] || "Image";
  // console.log("Created image element with dimensions:", {
  //   width: img.width,
  //   height: img.height,
  // });

  // Set additional data attributes based on CONFIG.DATA_KEYS
  Object.keys(CONFIG.DATA_KEYS).forEach((key) => {
    const dataKey = CONFIG.DATA_KEYS[key];
    if (item[dataKey]) {
      img.dataset[key.toLowerCase()] = item[dataKey];
    }
  });
  // console.log("Added data attributes to image");

  // Create a wrapper div for the image and bounding box
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block"; // Ensure proper positioning
  wrapper.appendChild(img);
  // console.log("Created wrapper and appended image");

  // Add load event listener to create bounding box and overlay after image loads
  img.addEventListener("load", function () {
    // console.log("Image loaded, creating bounding box and overlay");
    const { boundingBoxDiv, overlayDiv } = createBoundingBox(
      img.dataset.bounding_box,
      img
    );
    if (boundingBoxDiv) {
      wrapper.appendChild(boundingBoxDiv);
      // console.log("Added bounding box to wrapper");
    }
    if (overlayDiv) {
      wrapper.appendChild(overlayDiv);
      // console.log("Added overlay to wrapper");
    }

    // Add hover event listeners to handle overlay and bounding box opacity
    wrapper.addEventListener("mouseenter", () => {
      // console.log("Mouse entered wrapper");
      if (overlayDiv) {
        overlayDiv.style.opacity = "0";
      }
      if (boundingBoxDiv) {
        boundingBoxDiv.style.opacity = "0";
      }
    });

    wrapper.addEventListener("mouseleave", () => {
      // console.log("Mouse left wrapper");
      if (overlayDiv) {
        overlayDiv.style.opacity = "1";
      }
      if (boundingBoxDiv) {
        boundingBoxDiv.style.opacity = "1";
      }
    });
  });

  // console.log("Returning wrapper with image and event listeners");
  return wrapper; // Return the wrapper instead of just the img
}

/**
 * Loads all images within the specified container.
 * @param {HTMLElement} container - The container element containing images to load.
 * @returns {Promise} - Resolves when all images are loaded.
 */
export function loadImagesInContainer(container) {
  // console.log("Loading images in container:", container);
  const images = container.querySelectorAll("img[data-src]");
  // console.log("Found images to load:", images.length);

  const promises = Array.from(images).map((img) => {
    return new Promise((resolve, reject) => {
      if (img.dataset.src && img.src !== img.dataset.src) {
        // console.log("Loading image:", img.dataset.src);
        img.src = img.dataset.src;
        img.onload = () => {
          // console.log("Image loaded successfully:", img.src);
          resolve();
        };
        img.onerror = (error) => {
          console.error("Error loading image:", img.src, error);
          reject(error);
        };
      } else {
        // console.log("Image already loaded or no data-src:", img.src);
        resolve();
      }
    });
  });
  return Promise.all(promises);
}

/**
 * Removes all filter-related classes from the specified element.
 * @param {HTMLElement} element - The element from which to remove filter classes.
 */
export function removeAllFilterClasses(element) {
  FILTER_CLASSES.forEach((filterClass) => {
    element.classList.remove(filterClass);
  });
}
