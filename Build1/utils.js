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

  return img;
}
