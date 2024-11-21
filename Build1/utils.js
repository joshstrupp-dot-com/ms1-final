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
