document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing visualization-circles");

  // Get visualization container
  const vis = d3.select("#visualization-circles");
  console.log("Visualization container:", vis.node());

  // Set up SVG
  const svg = vis
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "visualization-svg");

  // Get actual dimensions from the container
  const width = parseInt(vis.style("width"));
  const height = parseInt(vis.style("height"));
  console.log("Container dimensions:", { width, height });

  // Set viewBox to maintain aspect ratio
  svg.attr("viewBox", `0 0 ${width} ${height}`);

  // Load data once and use it
  window.dataStore.loadData().then(() => {
    console.log("Data loaded successfully");
    const allData = window.dataStore.allData;
    console.log("Total records:", allData.length);

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
    console.log("Name counts:", nameCounts);

    // Convert nameCounts object into an array of objects for D3
    const data = Object.entries(nameCounts).map(([name, count]) => ({
      name: name,
      count: count,
    }));
    console.log("Processed data for visualization:", data);

    // Color scale: Assign a unique color to each name
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name)) // Get unique names
      .range(d3.schemeCategory10);
    console.log("Color scale domain:", color.domain());

    // Size scale: Circle radius based on count
    const size = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.count), d3.max(data, (d) => d.count)]) // Get min and max counts
      .range([10, 50]);
    console.log("Size scale domain:", size.domain());

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
      console.log("Mouseover event:", d.name);
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
      console.log("Mouseleave event:", d.name);
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
        console.log("Circle clicked:", d.name);
        // Determine if the clicked circle is already active
        const isActive = d3.select(this).classed("active-circle");
        console.log("Circle active state:", isActive);

        // Remove active class from all circles
        node.classed("active-circle", false);

        if (!isActive) {
          // Add active class to the clicked circle
          d3.select(this).classed("active-circle", true);
          currentlySelectedName = d.name;
          console.log("Setting active circle:", currentlySelectedName);

          // Update all circles opacity based on selection
          node.style("opacity", (circle) =>
            circle.name === currentlySelectedName ? 1 : 0.3
          );

          // Dispatch filter event
          const filterEvent = new CustomEvent("filterChanged", {
            detail: { name: d.name },
          });
          document.dispatchEvent(filterEvent);
        } else {
          currentlySelectedName = null;
          console.log("Clearing active circle");

          // Reset all circles opacity
          node.style("opacity", 1);

          // Dispatch event to clear filter
          const clearFilterEvent = new CustomEvent("filterChanged", {
            detail: { name: null },
          });
          document.dispatchEvent(clearFilterEvent);
        }
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    console.log("Circles created:", node.size());

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

    console.log("Force simulation initialized");

    // Apply the simulation to the nodes
    simulation.nodes(data).on("tick", () => {
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    // Drag event handlers
    function dragstarted(event, d) {
      console.log("Drag started:", d.name);
      if (!event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      console.log("Drag ended:", d.name);
      if (!event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }

    // Listen for filter changes from other visualizations
    document.addEventListener("filterChanged", function (e) {
      const filterName = e.detail.name;
      console.log("Filter changed event received:", filterName);

      if (filterName) {
        currentlySelectedName = filterName;
        console.log("Updating visualization for filter:", filterName);

        // Update circle states
        node
          .classed("active-circle", (d) => d.name === filterName)
          .style("opacity", (d) => (d.name === filterName ? 1 : 0.3));
      } else {
        currentlySelectedName = null;
        console.log("Clearing visualization filter");

        // Reset circle states
        node.classed("active-circle", false).style("opacity", 1);
      }
    });
  });
});
