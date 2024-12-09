// Import configuration settings from config.js file
import { CONFIG } from "./config.js";

// Import utility functions:
// - observeImages: Sets up lazy loading for images
// - createImageElement: Creates an <img> element with proper attributes
import {
  observeImages,
  createImageElement,
  loadImagesInContainer,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing gallery-depth");

  // How many images to show at once when loading more
  const ITEMS_PER_PAGE = CONFIG.ITEMS_PER_PAGE;
  console.log("Items per page:", ITEMS_PER_PAGE);

  // Keep track of what page of results we're on
  let currentPage = 1;
  // Flag to prevent loading more while already loading
  let isLoading = false;
  // Track which category filter is selected
  let currentCategory = "all";
  // Store the current grouped data structure
  let currentGroupedData;

  // === Start: Add Filter State Variables ===
  let currentFilter = null; // Holds the current filter (e.g., { category: 'est_year', value: '1840' })
  // === End: Add Filter State Variables ===

  // Helper function to add images to the page
  function renderImages(items, ul, startIndex, endIndex) {
    console.log("Rendering images:", {
      startIndex,
      endIndex,
      itemCount: items.length,
    });

    items.slice(startIndex, endIndex).forEach((item) => {
      const li = document.createElement("li");
      li.setAttribute("data-name", item[CONFIG.DATA_KEYS.NAME]); // Add data-name attribute
      const imageWrapper = createImageElement(item);
      li.appendChild(imageWrapper);
      ul.appendChild(li);
    });

    console.log("Finished rendering images");

    // Observe the images within their wrappers
    observeImages(ul.querySelectorAll("img"));
  }

  // === Start: Add applyFilter and clearFilter Functions ===
  /**
   * Applies a filter to show only items matching the category and value.
   * @param {string} category - The category to filter by (e.g., "est_year").
   * @param {string} value - The value to filter by (e.g., "1840").
   */
  function applyFilter(category, value) {
    console.log("Applying filter:", { category, value });

    // Toggle filter if the same filter is clicked again
    if (
      currentFilter &&
      currentFilter.category === category &&
      currentFilter.value === value
    ) {
      console.log("Same filter clicked - clearing filter");
      clearFilter();
      return;
    }

    currentFilter = { category, value };

    // Reset pagination
    currentPage = 1;

    // Clear existing gallery
    const galleryDepth = document.getElementById("gallery-depth");
    galleryDepth.innerHTML = "";

    // Create the gallery structure for the filtered category
    const groupName = value;
    const categoryLabel = document.createElement("h3");
    categoryLabel.textContent = `${groupName}`;
    galleryDepth.appendChild(categoryLabel);

    const ul = document.createElement("ul");
    ul.className = "gallery-list";
    galleryDepth.appendChild(ul);

    // Load all items for this filter
    loadFilteredImages();
  }

  /**
   * Clears any active filters and restores the full gallery view.
   */
  function clearFilter() {
    console.log("Clearing filter");
    currentFilter = null;

    // Reset pagination
    currentPage = 1;

    // Clear existing gallery
    const galleryDepth = document.getElementById("gallery-depth");
    galleryDepth.innerHTML = "";

    // Remove active state from category buttons
    const categoryButtons = Array.from(document.querySelectorAll(".button"));
    categoryButtons.forEach((btn) => btn.classList.remove("active"));

    // Create the gallery structure for "all"
    const ul = document.createElement("ul");
    ul.className = "gallery-list";
    galleryDepth.appendChild(ul);

    // Load the first page of all items
    loadMoreImages();
  }

  /**
   * Loads images that match the current filter.
   */
  function loadFilteredImages() {
    console.log("Loading filtered images");
    const galleryDepth = document.getElementById("gallery-depth");
    const ul = galleryDepth.querySelector(".gallery-list");

    // Filter items based on the selected category and value
    const filteredItems = window.dataStore.allData.filter(
      (item) => item[currentFilter.category] === currentFilter.value
    );
    console.log("Filtered items count:", filteredItems.length);

    // Render filtered images with pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    renderImages(filteredItems, ul, startIndex, endIndex);

    currentPage++;
  }
  // === End: Add applyFilter and clearFilter Functions ===

  // Load more images when user scrolls near bottom
  function loadMoreImages() {
    if (isLoading) {
      console.log("Already loading images - skipping");
      return;
    }
    console.log("Loading more images");
    isLoading = true;

    const galleryDepth = document.getElementById("gallery-depth");

    // If a filter is active, load filtered images
    if (currentFilter) {
      console.log("Loading filtered images");
      loadFilteredImages();
      isLoading = false;
      return;
    }

    // Calculate which items to show based on current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // If showing all items, add them to main list
    if (currentCategory.toLowerCase() === "all") {
      console.log("Loading all items");
      const ul = galleryDepth.querySelector(".gallery-list");
      renderImages(window.dataStore.allData, ul, startIndex, endIndex);
    } else {
      console.log("Loading items by category:", currentCategory);
      // If grouped by category, add items to their category sections
      currentGroupedData.forEach((items, groupName) => {
        const groupSection = Array.from(galleryDepth.children).find(
          (el) => el.tagName === "H3" && el.textContent === groupName
        );

        if (groupSection) {
          const ul = groupSection.nextElementSibling;
          renderImages(items, ul, startIndex, endIndex);
        }
      });
    }

    // Move to next page and mark loading as done
    currentPage++;
    isLoading = false;
    // console.log("Finished loading more images");
  }

  // === Start: Listen for 'filterChanged' Event ===
  document.addEventListener("filterChanged", function (e) {
    // console.log("Filter changed event received:", e.detail);
    const { category, value } = e.detail;

    if (category && value) {
      // Apply the filter
      applyFilter(category, value);
    } else {
      // Clear the filter
      clearFilter();
    }
  });
  // === End: Listen for 'filterChanged' Event ===

  // Reset and rebuild the gallery when category changes
  function renderGallery(category) {
    // console.log("Rendering gallery for category:", category);
    // Reset to first page
    currentPage = 1;
    currentCategory = category;
    currentFilter = null; // Clear any active filter

    const galleryDepth = document.getElementById("gallery-depth");
    galleryDepth.innerHTML = "";

    // Remove any existing filter classes
    galleryDepth.classList.remove(
      "museum-filter",
      "topic-filter",
      "est_year-filter"
    );

    // Adjust layout when category is selected
    if (category.toLowerCase() !== "all") {
      galleryDepth.classList.add("cat-selected");
      // Add the category-specific filter class
      galleryDepth.classList.add(`${category.toLowerCase()}-filter`);
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
    console.log("Grouped data:", currentGroupedData);

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
      console.log("Scroll threshold reached - loading more images");
      loadMoreImages();
    }
  });

  // Add click handlers for all category buttons
  const categoryButtons = Array.from(
    document.querySelectorAll(".button-category")
  );
  console.log("Category buttons found:", categoryButtons.length);

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Category button clicked:", button.textContent.trim());

      // Get category from data attribute instead of text content
      const selectedCategory =
        button.dataset.category || button.textContent.trim();

      // If button is already active, deactivate it and show all
      if (button.classList.contains("active")) {
        console.log("Deactivating active category");
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

  // Add this new function to handle initial load
  function handleInitialLoad() {
    console.log("Handling initial load");
    const fromIntro = document.referrer.includes("intro.html");
    console.log("Coming from intro page:", fromIntro);

    if (fromIntro) {
      // Force immediate load of first batch of images
      window.dataStore
        .loadData()
        .then(() => {
          console.log("Data loaded - rendering gallery");
          renderGallery("all");
          // Immediately trigger a scroll event to load more images
          window.dispatchEvent(new Event("scroll"));
        })
        .catch((error) => {
          console.error("Failed to load data:", error);
        });
    } else {
      // Normal load behavior
      window.dataStore
        .loadData()
        .then(() => {
          console.log("Data loaded - rendering gallery");
          renderGallery("all");
        })
        .catch((error) => {
          console.error("Failed to load data:", error);
        });
    }
  }

  // Replace the existing data load at the bottom with handleInitialLoad
  handleInitialLoad();
});
