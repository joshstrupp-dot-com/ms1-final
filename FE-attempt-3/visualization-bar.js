document.addEventListener("DOMContentLoaded", function () {
  // Get visualization container
  const vis = d3.select("#visualization-bar");

  // Set up SVG
  const svg = vis
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "visualization-svg");
  console.log("SVG element:", svg.node());

  // Load data once and use it
  window.dataStore.loadData().then(() => {
    const allData = window.dataStore.allData;

    // Function to draw visualization
    function drawVisualization(category, groupedData) {
      // Clear existing content
      svg.selectAll("*").remove();
      // console.log("Drawing visualization for:", category);

      // Define margins for the chart
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };

      // Get the width and height of the SVG container
      const svgWidth = parseInt(svg.style("width"));
      const svgHeight = parseInt(svg.style("height"));

      // Calculate the width and height of the chart area
      const chartWidth = svgWidth - margin.left - margin.right;
      const chartHeight = svgHeight / 2 - margin.top - margin.bottom; // Half of SVG height

      // Create a group element for the chart and apply margins
      const chartGroup = svg
        .append("g")
        .attr("class", "chart-group")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      console.log("Chart container created:", chartGroup.node());

      // Define the Y Scale (Band Scale for group names)
      const yScale = d3
        .scaleBand()
        .domain(Array.from(groupedData.keys()))
        .range([0, chartHeight])
        .padding(0.1); // Adjust padding as needed

      // Define the X Scale (Log Scale for item counts)
      const xScale = d3
        .scaleLog()
        .domain([1, d3.max(Array.from(groupedData.values()), (d) => d.length)])
        .range([0, chartWidth]);

      // Create a tooltip div if it doesn't exist
      let tooltip = d3.select("body").select("#tooltip");
      if (tooltip.empty()) {
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
      chartGroup
        .selectAll(".bars")
        .data(Array.from(groupedData))
        .enter()
        .append("rect")
        .attr("class", "bars")
        .attr("y", (d) => yScale(d[0]))
        .attr("height", yScale.bandwidth())
        .attr("x", (d) => chartWidth - xScale(d[1].length)) // Position from right
        .attr("width", (d) => xScale(d[1].length)) // Width based on data
        .on("mouseover", function (event, d) {
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
          tooltip.transition().duration(500).style("opacity", 0);
        });

      console.log("Bars added to the chart group");
    }

    // Function to remove visualization
    function removeVisualization() {
      svg
        .selectAll(".visualization-group, .chart-group")
        .transition()

        .remove();
      console.log("Visualization removed");
    }

    // Listen for the custom 'categoryChanged' event
    document.addEventListener("categoryChanged", function (e) {
      const category = e.detail.trim();

      console.log(`Received categoryChanged event: ${category}`);

      if (category.toLowerCase() === "all") {
        // Remove visualization when "all" is selected
        removeVisualization();
      } else {
        // Group the data by the selected category
        const groupedData = d3.group(allData, (d) => d[category]);

        // Log counts for each value in the category
        console.log(`\nCounts for ${category}:`);
        groupedData.forEach((items, groupName) => {
          console.log(`${groupName}: ${items.length} items`);
        });

        // Draw new visualization
        drawVisualization(category, groupedData);
        console.log("Visualization drawn");
      }
    });
  });
});
