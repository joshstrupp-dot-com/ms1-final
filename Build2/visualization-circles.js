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

  // Add silhouette as background image
  svg
    .append("image")
    .attr("xlink:href", "./assets/SVG/silo_nobg.svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "background-silhouette");

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

    // Size scale: Circle radius based on count
    const size = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.count), d3.max(data, (d) => d.count)])
      .range([10, 50]);
    console.log("Size scale domain:", size.domain());

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
      .style("font-size", "12px");

    // Define initial positions as percentages
    const initialPositions = {
      sleeve: { xPercent: 0.35, yPercent: 0.4 },
      shoe: { xPercent: 0.45, yPercent: 0.95 },
      belt: { xPercent: 0.5, yPercent: 0.5 },
      "shirt, blouse": { xPercent: 0.5, yPercent: 0.3 },
      hat: { xPercent: 0.6, yPercent: 0.04 },
      skirt: { xPercent: 0.48, yPercent: 0.47 },
      glove: { xPercent: 0.8, yPercent: 0.54 },
      neckline: { xPercent: 0.47, yPercent: 0.17 },
      lapel: { xPercent: 0.35, yPercent: 0.19 },
      tie: { xPercent: 0.5, yPercent: 0.21 },
      "headband, head covering, hair accessory": {
        xPercent: 0.44,
        yPercent: 0.05,
      },
      collar: { xPercent: 0.62, yPercent: 0.15 },
      pants: { xPercent: 0.33, yPercent: 0.66 },
      watch: { xPercent: 0.75, yPercent: 0.47 },
      "top, t-shirt, sweatshirt": { xPercent: 0.36, yPercent: 0.34 },
      pocket: { xPercent: 0.34, yPercent: 0.5 },
      dress: { xPercent: 0.45, yPercent: 0.35 },
      coat: { xPercent: 0.4, yPercent: 0.3 },
      "bag, wallet": { xPercent: 0.65, yPercent: 0.6 },
      jacket: { xPercent: 0.38, yPercent: 0.32 },
      buckle: { xPercent: 0.39, yPercent: 0.32 },
    };

    // Function to calculate actual positions
    function calculatePosition(xPercent, yPercent, width, height) {
      return {
        x: width * xPercent,
        y: height * yPercent,
      };
    }

    // Update positions when container size changes
    function updatePositions() {
      const width = parseInt(vis.style("width"));
      const height = parseInt(vis.style("height"));

      node.each(function (d) {
        if (initialPositions[d.name]) {
          const pos = calculatePosition(
            initialPositions[d.name].xPercent,
            initialPositions[d.name].yPercent,
            width,
            height
          );
          d.fx = pos.x;
          d.fy = pos.y;
          d.fixed = true;
        }
      });
    }

    // Mouse event handlers
    const mouseover = function (event, d) {
      console.log("Mouseover event:", d.name);
      Tooltip.style("opacity", 1);
    };

    const mousemove = function (event, d) {
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
      .style("fill", "rgba(242, 238, 235, 0.40)")
      .style("stroke", "#000")
      .style("stroke-width", "2px")
      .each(function (d) {
        if (initialPositions[d.name]) {
          const pos = calculatePosition(
            initialPositions[d.name].xPercent,
            initialPositions[d.name].yPercent,
            width,
            height
          );
          d.fx = pos.x;
          d.fy = pos.y;
          d.fixed = true;
        }
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", function (event, d) {
        console.log("Circle clicked:", d.name);
        const galleryDepth = document.getElementById("gallery-depth");
        const isActive = d3.select(this).classed("active-circle");
        console.log("Circle active state:", isActive);

        node.classed("active-circle", false);

        if (!isActive) {
          d3.select(this).classed("active-circle", true);
          currentlySelectedName = d.name;
          console.log("Setting active circle:", currentlySelectedName);

          node.style("opacity", (circle) =>
            circle.name === currentlySelectedName ? 1 : 0.3
          );

          galleryDepth.classList.add("cat-selected", "visualization-filter");

          const filterEvent = new CustomEvent("filterChanged", {
            detail: {
              category: "Name",
              value: d.name,
            },
          });
          document.dispatchEvent(filterEvent);
        } else {
          currentlySelectedName = null;
          console.log("Clearing active circle");

          node.style("opacity", 1);
          galleryDepth.classList.remove("cat-selected", "visualization-filter");

          const clearFilterEvent = new CustomEvent("filterChanged", {
            detail: {
              category: null,
              value: null,
            },
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

    // Add resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === vis.node()) {
          updatePositions();
          simulation.alpha(0.3).restart();
        }
      }
    });

    resizeObserver.observe(vis.node());

    console.log("Circles created:", node.size());

    // Remove or simplify the simulation
    const simulation = d3
      .forceSimulation()
      .force("x", d3.forceX().strength(1)) // Strong force to maintain x position
      .force("y", d3.forceY().strength(1)) // Strong force to maintain y position
      .alphaDecay(0.1); // Quick settling

    // Apply the simulation to the nodes
    simulation.nodes(data).on("tick", () => {
      node
        .attr("cx", (d) => (d.fixed ? d.fx : d.x))
        .attr("cy", (d) => (d.fixed ? d.fy : d.y));
    });

    // Simplify drag handlers to just update position
    function dragstarted(event, d) {
      if (!d.fixed) {
        d.fx = d.x;
        d.fy = d.y;
      }
    }

    function dragged(event, d) {
      if (!d.fixed) {
        d.fx = event.x;
        d.fy = event.y;
      }
    }

    function dragended(event, d) {
      console.log(`name: ${d.name}, position: x=${event.x}, y=${event.y}`);
      if (!d.fixed) {
        d.fx = null;
        d.fy = null;
      }
    }

    // Listen for filter changes from other visualizations
    document.addEventListener("filterChanged", function (e) {
      const galleryDepth = document.getElementById("gallery-depth");
      console.log("Filter changed event received:", e.detail);

      if (e.detail.category === "Name" && e.detail.value) {
        currentlySelectedName = e.detail.value;
        console.log(
          "Updating visualization for filter:",
          currentlySelectedName
        );

        node
          .classed("active-circle", (d) => d.name === currentlySelectedName)
          .style("opacity", (d) =>
            d.name === currentlySelectedName ? 1 : 0.3
          );

        galleryDepth.classList.add("cat-selected", "visualization-filter");
      } else if (e.detail.category) {
        // If switching to a different category filter
        currentlySelectedName = null;
        node.classed("active-circle", false).style("opacity", 1);
        galleryDepth.classList.remove("visualization-filter");
      } else if (!e.detail.maintainStyle) {
        // Only clear styles if maintainStyle is false
        currentlySelectedName = null;
        node.classed("active-circle", false).style("opacity", 1);
        galleryDepth.classList.remove("cat-selected", "visualization-filter");
      }
    });
  });
});
