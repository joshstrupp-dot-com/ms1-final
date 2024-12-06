document.addEventListener("DOMContentLoaded", function () {
  // Get visualization container
  const vis = d3.select("#visualization-circles");

  // Set up SVG
  const svg = vis
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "visualization-svg");

  // Get actual dimensions from the container
  const width = parseInt(vis.style("width"));
  const height = parseInt(vis.style("height"));

  // Set viewBox to maintain aspect ratio
  svg.attr("viewBox", `0 0 ${width} ${height}`);

  // Load data once and use it
  window.dataStore.loadData().then(() => {
    const allData = window.dataStore.allData;

    // Start Generation Here
    const nameCounts = {};

    // Get count of each Name
    allData.forEach((d) => {
      if (nameCounts[d.Name]) {
        nameCounts[d.Name] += 1;
      } else {
        nameCounts[d.Name] = 1;
      }
    });

    // Convert nameCounts object into an array of objects for D3
    const data = Object.entries(nameCounts).map(([name, count]) => ({
      name: name,
      count: count,
    }));

    // Color scale: Assign a unique color to each name
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name)) // Get unique names
      .range(d3.schemeCategory10);

    // Size scale: Circle radius based on count
    const size = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.count), d3.max(data, (d) => d.count)]) // Get min and max counts
      .range([10, 50]);

    const Tooltip = vis
      .append("div")
      .attr("class", "visualization-tooltip")
      .style("position", "fixed")
      .style("opacity", 0)
      .style("pointer-events", "none") // Ensures tooltip doesn't interfere with mouse events
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px");

    // Mouse event handlers
    const mouseover = function (event, d) {
      Tooltip.style("opacity", 1);
    };

    const mousemove = function (event, d) {
      const tooltipWidth = 150; // Approximate width of tooltip
      const tooltipHeight = 50; // Approximate height of tooltip

      // Calculate position, keeping tooltip within viewport
      const left = Math.min(
        event.pageX + 10,
        window.innerWidth - tooltipWidth - 10
      );
      const top = Math.min(
        event.pageY - tooltipHeight - 10,
        window.innerHeight - tooltipHeight - 10
      );

      Tooltip.html(`<strong>${d.name}</strong><br>Count: ${d.count}`)
        .style("left", left + "px")
        .style("top", top + "px");
    };

    const mouseleave = function (event, d) {
      Tooltip.style("opacity", 0);
    };

    // Track the currently selected name for toggling
    let currentlySelectedName = null;

    // Create the circles
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "node visualization-circle")
      .attr("r", (d) => size(d.count))
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", (d) => color(d.name))
      .style("fill-opacity", 0.8)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      // Add click event handler
      .on("click", function (event, d) {
        // Log the clicked circle's data
        console.log("Circle clicked:", {
          name: d.name,
          count: d.count,
          items: allData.filter((item) => item.Name === d.name),
        });

        // Get the circle's color
        const circleColor = color(d.name);

        // Select all <li> elements in the gallery
        const allGalleryLi = document.querySelectorAll(
          `#gallery-depth .gallery-list li`
        );

        if (currentlySelectedName === d.name) {
          // **Toggle Off:** Deselect and show all images
          allGalleryLi.forEach((li) => {
            // Remove border
            li.style.border = "2px solid transparent";
            // Show all images
            li.style.display = "flex"; // Adjust based on your CSS layout
          });
          currentlySelectedName = null;
        } else {
          // **Toggle On:** Highlight matching images and hide others
          allGalleryLi.forEach((li) => {
            if (li.getAttribute("data-name") === d.name) {
              // Add border with circle's color
              li.style.border = `3px solid ${circleColor}`;
              // Show the image
              li.style.display = "flex"; // Adjust based on your CSS layout
            } else {
              // Remove any existing border
              li.style.border = "2px solid transparent";
              // Hide non-matching images
              li.style.display = "none";
            }
          });
          currentlySelectedName = d.name;
        }
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Features of the forces applied to the nodes
    const simulation = d3
      .forceSimulation()
      .force(
        "center",
        d3
          .forceCenter()
          .x(width / 2)
          .y(height / 2)
      ) // Attraction to the center
      .force("charge", d3.forceManyBody().strength(0.1)) // Nodes are attracted/repelled
      .force(
        "collide",
        d3
          .forceCollide()
          .strength(0.2)
          .radius((d) => size(d.count) + 3)
          .iterations(1)
      ); // Avoid overlap

    // Apply the simulation to the nodes
    simulation.nodes(data).on("tick", () => {
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    // Drag event handlers
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }
  });
});
