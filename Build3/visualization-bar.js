import { loadImagesInContainer } from "./utils.js";

// Add this color mapping object at the top of your file
const categoryColors = {
  museum: {
    fill: "rgba(191, 181, 33, 0.18)",
    stroke: "#bfb521",
  },
  topic: {
    fill: "rgba(242, 12, 31, 0.18)",
    stroke: "#f20c1f",
  },
  est_year: {
    fill: "rgba(142, 130, 217, 0.18)",
    stroke: "#8e82d9",
  },
};

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
      const Tooltip = vis
        .append("div")
        .attr("class", "visualization-tooltip")
        .style("position", "fixed")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .style("background-color", "rgba(0, 0, 0, 0.7)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("z-index", 100000);

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
        .style("fill", categoryColors[category.toLowerCase()]?.fill)
        .style("stroke", categoryColors[category.toLowerCase()]?.stroke)
        .style("stroke-width", "2px")
        .attr("rx", "4px")
        .attr("ry", "4px")
        .attr("y", (d) => yScale(d[0]))
        .attr("height", yScale.bandwidth())
        .attr("x", chartWidth)
        .attr("width", 0)
        .transition()
        .delay((d, i) => i * 100) // Add 100ms delay per bar
        .duration(1500)
        .ease(d3.easeElastic)
        .attr("x", (d) => chartWidth - xScale(d[1].length))
        .attr("width", (d) => xScale(d[1].length));

      // Updated click handler
      chartGroup
        .selectAll(".bars")
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
          Tooltip.style("opacity", 1);
        })
        .on("mousemove", function (event, d) {
          const tooltipWidth = 150;
          const tooltipHeight = 50;

          const left = Math.min(
            event.pageX + 10,
            window.innerWidth - tooltipWidth - 10
          );
          const top = Math.min(
            event.pageY - tooltipHeight - 10,
            window.innerHeight - tooltipHeight - 10
          );

          Tooltip.html(`${d[0]}: ${d[1].length}`)
            .style("left", left + "px")
            .style("top", top + "px");
        })
        .on("mouseout", function () {
          console.log("Mouse out of bar");
          Tooltip.style("opacity", 0);
        });

      console.log("Bars added to the chart group");
    }

    // Function to remove visualization
    function removeVisualization() {
      // Remove all content from the SVG
      svg.selectAll("*").remove();
      console.log("Bar visualization removed");
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

    // Add this event listener after other event listeners
    document.addEventListener("removeBarVisualization", function () {
      console.log("Removing bar visualization");
      removeVisualization();
    });
  });
});
