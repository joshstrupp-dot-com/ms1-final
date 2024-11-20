document.addEventListener("DOMContentLoaded", function () {
  // URL to your CSV file
  const csvUrl = "../final_data_cat.csv";

  let allData = [];

  // Fetch and parse CSV with PapaParse
  fetch(csvUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((csvText) => {
      const results = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });

      if (results.errors.length) {
        console.error("Error parsing CSV:", results.errors);
        return;
      }

      allData = results.data;
      console.log(`Loaded ${allData.length} records from CSV`);

      // Optionally, render all images initially
      renderGallery("all");
    })
    .catch((error) => {
      console.error("Error fetching or processing the CSV file:", error);
    });

  /**
   * Function to render the gallery based on the selected category
   * @param {string} category - The category to group by (e.g., 'Museum', 'Country')
   */

  function renderGallery(category) {
    console.log("Rendering gallery for category:", category);
    const galleryDepth = document.getElementById("gallery-depth");

    // Clear existing content
    galleryDepth.innerHTML = "";
    console.log("Cleared existing gallery content");

    // Add cat-selected class when rendering gallery
    if (category.toLowerCase() !== "all") {
      galleryDepth.classList.add("cat-selected");
      console.log("Added cat-selected class");
    } else {
      galleryDepth.classList.remove("cat-selected");
      console.log("Removed cat-selected class");
    }

    // Determine grouping
    let groupedData;

    if (category.toLowerCase() === "all") {
      groupedData = { "All Items": allData };
    } else {
      // Use D3 to group data by the selected category
      groupedData = d3.group(allData, (d) => d[category]);
    }

    // AFTER: Replace with this new structure
    if (category.toLowerCase() === "all") {
      // Directly render all images without grouping
      const ul = document.createElement("ul");
      ul.className = "gallery-list";

      allData.forEach((item) => {
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
      console.log("Rendered all images:", allData.length);
    } else {
      // Use D3 to group data by the selected category
      groupedData = d3.group(allData, (d) => d[category]);
      console.log("Grouped data by category:", category);
      console.log("Number of groups:", groupedData.size);
    }

    // Iterate over each group and render H3 and images
    groupedData.forEach((items, groupName) => {
      console.log("Rendering group:", groupName);
      console.log("Number of items in group:", items.length);

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

        // Debug log to verify data is being set
        console.log("Setting data attributes for image:", {
          museum: item.Museum,
          medium: item.Medium,
          est_place: item.est_place,
          topic: item.topic,
          est_year: item.est_year,
          title: item.Title,
        });

        li.appendChild(img);
        ul.appendChild(li);
      });

      galleryDepth.appendChild(ul);
      console.log("Finished rendering group:", groupName);
    });
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
});
