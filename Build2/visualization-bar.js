import { loadImagesInContainer } from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing visualization-bar");

  // Get visualization container
  const vis = d3.select("#visualization-bar");
  console.log("Visualization container:", vis.node());

  // Set up SVG
  const svg = vis
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "visualization-svg");
  console.log("SVG element:", svg.node());

  // Load data once and use it
  window.dataStore.loadData().then(() => {
    console.log("Data loaded successfully");
    const allData = window.dataStore.allData;
    console.log("Total records:", allData.length);

    // Function to draw visualization
    function drawVisualization(category, groupedData) {
      // Clear existing content
      svg.selectAll("*").remove();
      console.log("Drawing visualization for category:", category);
      console.log("Grouped data:", groupedData);

      // Define margins for the chart
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };
      console.log("Chart margins:", margin);

      // Get the width and height of the SVG container
      const svgWidth = parseInt(svg.style("width"));
      const svgHeight = parseInt(svg.style("height"));
      console.log("SVG dimensions:", { width: svgWidth, height: svgHeight });

      // Calculate the width and height of the chart area
      const chartWidth = svgWidth - margin.left - margin.right;
      const chartHeight = svgHeight / 2 - margin.top - margin.bottom; // Half of SVG height
      console.log("Chart dimensions:", {
        width: chartWidth,
        height: chartHeight,
      });

      // Create a group element for the chart and apply margins
      const chartGroup = svg
        .append("g")
        .attr("class", "chart-group")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      console.log("Chart container created:", chartGroup.node());

      // Define the Y Scale (Band Scale for group names)
      const yScale = d3
        .scaleBand()
        .domain(
          Array.from(groupedData.keys())
            .filter((key) => key && key.trim() !== "")
            .sort((a, b) => {
              // For numeric values (like years)
              if (!isNaN(a) && !isNaN(b)) {
                return Number(a) - Number(b);
              }
              // For text values
              return a.localeCompare(b);
            })
        )
        .range([0, chartHeight])
        .padding(0.1);
      console.log("Y scale domain:", yScale.domain());

      // Define the X Scale (Log Scale for item counts)
      const xScale = d3
        .scaleLog()
        .domain([1, d3.max(Array.from(groupedData.values()), (d) => d.length)])
        .range([0, chartWidth]);
      console.log("X scale domain:", xScale.domain());

      // Create a tooltip div if it doesn't exist
      let tooltip = d3.select("body").select("#tooltip");
      if (tooltip.empty()) {
        console.log("Creating new tooltip");
        tooltip = d3
          .select("body")
          .append("div")
          .attr("id", "tooltip")
          .style("position", "absolute")
          .style("background-color", "rgba(0, 0, 0, 0.7)")
          .style("color", "#fff")
          .style("padding", "5px 10px")
          .style("border-radius", "4px")
          .style("pointer-events", "none")
          .style("opacity", 0);
      }

      // Bind the data and create the bars
      console.log("Creating bars with data:", Array.from(groupedData));

      chartGroup
        .selectAll(".bars")
        .data(
          Array.from(groupedData).filter(
            ([key, value]) => key && key.trim() !== ""
          )
        )
        .enter()
        .append("rect")
        .attr("class", "bars")
        .style("cursor", "pointer")
        .attr("y", (d) => {
          console.log("Setting y position for bar:", d[0], yScale(d[0]));
          return yScale(d[0]);
        })
        .attr("height", yScale.bandwidth())
        .attr("x", (d) => {
          console.log(
            "Setting x position for bar:",
            d[0],
            chartWidth - xScale(d[1].length)
          );
          return chartWidth - xScale(d[1].length);
        })
        .attr("width", (d) => {
          console.log("Setting width for bar:", d[0], xScale(d[1].length));
          return xScale(d[1].length);
        })
        // Updated click handler
        .on("click", function (event, d) {
          const selectedCategory = category;
          const selectedValue = d[0];
          console.log("Bar clicked:", selectedCategory, selectedValue);

          const galleryDepth = document.getElementById("gallery-depth");

          // Ensure cat-selected class is present
          galleryDepth.classList.add("cat-selected");

          // Add the appropriate filter class based on category
          galleryDepth.classList.remove(
            "museum-filter",
            "topic-filter",
            "est_year-filter"
          );
          galleryDepth.classList.add(
            `${selectedCategory.toLowerCase()}-filter`
          );

          const filterEvent = new CustomEvent("filterChanged", {
            detail: {
              category: selectedCategory,
              value: selectedValue,
              maintainStyle: true,
            },
          });
          document.dispatchEvent(filterEvent);
        })
        .on("mouseover", function (event, d) {
          console.log("Mouse over bar:", d[0], "Count:", d[1].length);
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`${d[0]}: ${d[1].length}`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          console.log("Mouse out of bar");
          tooltip.transition().duration(500).style("opacity", 0);
        });

      console.log("Bars added to the chart group");
    }

    // Function to remove visualization
    function removeVisualization() {
      console.log("Removing visualization");
      svg.selectAll(".visualization-group, .chart-group").transition().remove();
      console.log("Visualization removed");
    }

    // Listen for the custom 'categoryChanged' event
    document.addEventListener("categoryChanged", function (e) {
      const category = e.detail.trim();
      const galleryDepth = document.getElementById("gallery-depth");

      console.log(`Received categoryChanged event: ${category}`);

      if (category.toLowerCase() === "collection") {
        console.log("Collection category selected - skipping visualization");
        return;
      }

      if (category.toLowerCase() === "all") {
        console.log("All category selected - removing visualization");
        removeVisualization();
        galleryDepth.classList.remove(
          "cat-selected",
          "museum-filter",
          "topic-filter",
          "est_year-filter"
        );
      } else {
        console.log("Category selected:", category);
        galleryDepth.classList.add("cat-selected");
        galleryDepth.classList.add(`${category.toLowerCase()}-filter`);

        const groupedData = d3.group(
          window.dataStore.allData,
          (d) => d[category]
        );
        console.log("Data grouped by category:", groupedData);
        drawVisualization(category, groupedData);
        console.log("Visualization drawn for category:", category);
      }
    });
  });
});
