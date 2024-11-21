import { CONFIG } from "./config.js";
import { observeImages } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  const ITEMS_PER_PAGE = CONFIG.ITEMS_PER_PAGE; // Number of images to load at once
  let currentPage = 1;
  let isLoading = false;
  let currentCategory = "all";
  let currentGroupedData;

  function renderImages(items, ul, startIndex, endIndex) {
    items.slice(startIndex, endIndex).forEach((item) => {
      const li = document.createElement("li");
      const img = document.createElement("img");

      // Set dimensions
      img.width = 200;
      img.height = 200;

      // Set a data attribute for the real image URL
      img.dataset.src = item.Image_URL;
      img.src = "placeholder-image.jpg"; // Placeholder

      img.alt = item.Title || "Image";

      // Set data attributes from CSV data
      img.dataset.museum = item[CONFIG.DATA_KEYS.MUSEUM];
      img.dataset.medium = item[CONFIG.DATA_KEYS.MEDIUM];
      img.dataset.est_place = item[CONFIG.DATA_KEYS.EST_PLACE];
      img.dataset.topic = item[CONFIG.DATA_KEYS.TOPIC];
      img.dataset.est_year = item[CONFIG.DATA_KEYS.EST_YEAR];
      img.dataset.title = item[CONFIG.DATA_KEYS.TITLE];
      img.dataset.description = item[CONFIG.DATA_KEYS.DESCRIPTION];
      img.dataset.cropped_image_path = item.cropped_image_path;
      img.dataset.bounding_box = item[CONFIG.DATA_KEYS.BOUNDING_BOX];
      img.dataset.area = item[CONFIG.DATA_KEYS.AREA];

      li.appendChild(img);
      ul.appendChild(li);
    });

    // After appending, observe the images
    observeImages(ul.querySelectorAll("img"));
  }

  function loadMoreImages() {
    if (isLoading) return;
    isLoading = true;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const galleryDepth = document.getElementById("gallery-depth");

    if (currentCategory.toLowerCase() === "all") {
      const ul = galleryDepth.querySelector(".gallery-list");
      renderImages(
        window.dataStore.allData,
        ul,
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );
    } else {
      currentGroupedData.forEach((items, groupName) => {
        const groupSection = Array.from(galleryDepth.children).find(
          (el) => el.tagName === "H3" && el.textContent === groupName
        );

        if (groupSection) {
          const ul = groupSection.nextElementSibling;
          renderImages(items, ul, startIndex, startIndex + ITEMS_PER_PAGE);
        }
      });
    }

    currentPage++;
    isLoading = false;
  }

  function renderGallery(category) {
    currentPage = 1;
    currentCategory = category;
    const galleryDepth = document.getElementById("gallery-depth");
    galleryDepth.innerHTML = "";

    // Add or remove 'cat-selected' class based on category
    if (category.toLowerCase() !== "all") {
      galleryDepth.classList.add("cat-selected");
    } else {
      galleryDepth.classList.remove("cat-selected");
    }

    // Determine grouping
    if (category.toLowerCase() === "all") {
      currentGroupedData = { "All Items": window.dataStore.allData };
    } else {
      currentGroupedData = d3.group(
        window.dataStore.allData,
        (d) => d[category]
      );
    }

    if (category.toLowerCase() === "all") {
      const ul = document.createElement("ul");
      ul.className = "gallery-list";
      galleryDepth.appendChild(ul);
      loadMoreImages();
    } else {
      currentGroupedData.forEach((items, groupName) => {
        const categoryLabel = document.createElement("h3");
        categoryLabel.textContent = groupName;
        galleryDepth.appendChild(categoryLabel);

        const ul = document.createElement("ul");
        ul.className = "gallery-list";
        galleryDepth.appendChild(ul);
      });
      loadMoreImages();
    }

    document.dispatchEvent(
      new CustomEvent("categoryChanged", { detail: category })
    );
  }

  // Add scroll event listener for infinite scrolling
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 500
    ) {
      loadMoreImages();
    }
  });

  // Add click handlers for all category buttons
  const categoryButtons = Array.from(document.querySelectorAll(".button"));

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Skip Collection button
      if (button.textContent.trim().toLowerCase() === "collection") {
        return;
      }

      const selectedCategory = button.textContent.trim();

      // If button is already active, deactivate it and show all
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        renderGallery("all");
        return;
      }

      // Highlight the active button
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Render the gallery based on the selected category
      renderGallery(selectedCategory);
    });
  });

  // Load data once and render initial gallery
  window.dataStore
    .loadData()
    .then(() => {
      renderGallery("all");
    })
    .catch((error) => {
      console.error("Failed to load data:", error);
    });
});
