// Import configuration settings from config.js file
import { CONFIG } from "./config.js";

// Import utility functions:
// - observeImages: Sets up lazy loading for images
// - createImageElement: Creates an <img> element with proper attributes
import { observeImages, createImageElement } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // How many images to show at once when loading more
  const ITEMS_PER_PAGE = CONFIG.ITEMS_PER_PAGE;
  // Keep track of what page of results we're on
  let currentPage = 1;
  // Flag to prevent loading more while already loading
  let isLoading = false;
  // Track which category filter is selected
  let currentCategory = "all";
  // Store the current grouped data structure
  let currentGroupedData;

  // Helper function to add images to the page
  function renderImages(items, ul, startIndex, endIndex) {
    items.slice(startIndex, endIndex).forEach((item) => {
      const li = document.createElement("li");
      const imageWrapper = createImageElement(item);
      li.appendChild(imageWrapper);
      ul.appendChild(li);
    });

    // Observe the images within their wrappers
    observeImages(ul.querySelectorAll("img"));
  }

  // Load more images when user scrolls near bottom
  function loadMoreImages() {
    if (isLoading) return;
    isLoading = true;

    // Calculate which items to show based on current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const galleryDepth = document.getElementById("gallery-depth");

    // If showing all items, add them to main list
    if (currentCategory.toLowerCase() === "all") {
      const ul = galleryDepth.querySelector(".gallery-list");
      renderImages(
        window.dataStore.allData,
        ul,
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );
    } else {
      // If filtered by category, add items to their category sections
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

    // Move to next page and mark loading as done
    currentPage++;
    isLoading = false;
  }

  // Reset and rebuild the gallery when category changes
  function renderGallery(category) {
    // Reset to first page
    currentPage = 1;
    currentCategory = category;
    const galleryDepth = document.getElementById("gallery-depth");
    galleryDepth.innerHTML = "";

    // Adjust layout when category is selected
    if (category.toLowerCase() !== "all") {
      galleryDepth.classList.add("cat-selected");
    } else {
      galleryDepth.classList.remove("cat-selected");
    }

    // Group the data based on selected category
    if (category.toLowerCase() === "all") {
      currentGroupedData = { "All Items": window.dataStore.allData };
    } else {
      currentGroupedData = d3.group(
        window.dataStore.allData,
        (d) => d[category]
      );
    }

    // Create the gallery structure
    if (category.toLowerCase() === "all") {
      // For all items, just create one list
      const ul = document.createElement("ul");
      ul.className = "gallery-list";
      galleryDepth.appendChild(ul);
      loadMoreImages();
    } else {
      // For categories, create sections with headers
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
