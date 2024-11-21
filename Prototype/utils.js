// utils.js

export function createImageElement(item) {
  const img = document.createElement("img");
  img.width = 200;
  img.height = 200;
  img.dataset.src = item[CONFIG.DATA_KEYS.IMAGE_URL];
  img.src = "placeholder-image.jpg";
  img.alt = item[CONFIG.DATA_KEYS.TITLE] || "Image";

  // Set data attributes
  Object.keys(CONFIG.DATA_KEYS).forEach((key) => {
    const dataKey = CONFIG.DATA_KEYS[key];
    if (item[dataKey]) {
      img.dataset[key.toLowerCase()] = item[dataKey];
    }
  });

  return img;
}
