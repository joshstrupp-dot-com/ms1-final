document.addEventListener("DOMContentLoaded", function () {
  /**
   * Function to render the gallery based on the selected category
   * @param {string} category - The category to group by (e.g., 'Museum', 'Country')
   */
  function renderGallery(category) {
    // console.log("Rendering gallery for category:", category);
    const galleryDepth = document.getElementById("gallery-depth");

    // Clear existing content
    galleryDepth.innerHTML = "";
    // console.log("Cleared existing gallery content");

    // Add or remove 'cat-selected' class based on category
    if (category.toLowerCase() !== "all") {
      galleryDepth.classList.add("cat-selected");
      // console.log("Added cat-selected class");
    } else {
      galleryDepth.classList.remove("cat-selected");
      // console.log("Removed cat-selected class");
    }

    // Determine grouping
    let groupedData;

    if (category.toLowerCase() === "all") {
      groupedData = { "All Items": window.dataStore.allData };
    } else {
      // Use D3 to group data by the selected category
      groupedData = d3.group(window.dataStore.allData, (d) => d[category]);
    }

    if (category.toLowerCase() === "all") {
      // Directly render all images without grouping
      const ul = document.createElement("ul");
      ul.className = "gallery-list";

      window.dataStore.allData.forEach((item) => {
        const li = document.createElement("li");
        const img = document.createElement("img");

        // Set source and basic attributes
        img.src = item.Image_URL;
        img.alt = item.Title || "Image";
        img.loading = "lazy";

        // Set data attributes from CSV data
        img.dataset.museum = item.Museum;
        img.dataset.medium = item.Medium;
        img.dataset.est_place = item.est_place;
        img.dataset.topic = item.topic;
        img.dataset.est_year = item.est_year;
        img.dataset.title = item.Title;
        img.dataset.description = item.Description;
        img.dataset.cropped_image_path = item.cropped_image_path;
        img.dataset.bounding_box = item.bounding_box;
        img.dataset.area = item.Area;

        li.appendChild(img);
        ul.appendChild(li);
      });

      galleryDepth.appendChild(ul);
      console.log(`Rendered all images: ${window.dataStore.allData.length}`);
    } else {
      // Iterate over each group and render H3 and images
      groupedData.forEach((items, groupName) => {
        console.log(`Rendering group: ${groupName} with ${items.length} items`);

        // Create H3 label for the group
        const categoryLabel = document.createElement("h3");
        categoryLabel.textContent = groupName;
        galleryDepth.appendChild(categoryLabel);

        // Create UL for images
        const ul = document.createElement("ul");
        ul.className = "gallery-list"; // For styling purposes

        items.forEach((item) => {
          const li = document.createElement("li");
          const img = document.createElement("img");

          img.src = item.Image_URL;
          img.alt = item.Title || "Image";
          img.loading = "lazy";

          // Set data attributes from CSV data
          img.dataset.museum = item.Museum;
          img.dataset.medium = item.Medium;
          img.dataset.est_place = item.est_place;
          img.dataset.topic = item.topic;
          img.dataset.est_year = item.est_year;
          img.dataset.title = item.Title;
          img.dataset.description = item.Description;
          img.dataset.cropped_image_path = item.cropped_image_path;
          img.dataset.bounding_box = item.bounding_box;
          img.dataset.area = item.Area;

          li.appendChild(img);
          ul.appendChild(li);
        });

        galleryDepth.appendChild(ul);
        // console.log(`Finished rendering group: ${groupName}`);
      });
    }

    // Dispatch a custom event to notify other scripts about the category change
    document.dispatchEvent(
      new CustomEvent("categoryChanged", { detail: category })
    );
    // console.log("Category changed:", category);
  }

  // Add click handlers for all category buttons
  const categoryButtons = Array.from(document.querySelectorAll(".button"));

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
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
