document.addEventListener("DOMContentLoaded", function () {
  // Get visualization container
  const vis = d3.select("#visualization");

  // Set up SVG
  const svg = vis.append("svg").attr("width", "100%").attr("height", "100%");

  // Get all category filter buttons
  const categoryButtons = document.querySelectorAll(".category-filter .button");

  // Function to draw rectangle
  function drawRectangle() {
    // Clear any existing rectangles
    svg.selectAll("rect").remove();

    // Draw new rectangle
    const group = svg.append("g").attr("class", "visualization-group");

    group
      .append("rect")
      .attr("x", "10%")
      .attr("y", "10%")
      .attr("width", "80%")
      .attr("height", "80%")
      .attr("fill", "var(--color-Museum)");

    // Add text to rectangle
    group
      .append("text")
      .attr("x", "50%")
      .attr("y", "50%")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .style("font-size", "10px")
      .style("width", "80%")
      .text("bar chart of count");
  }

  // Add click handlers to category buttons
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("active")) {
        // Remove rectangle when deselecting
        svg.selectAll(".visualization-group").remove();
      } else {
        drawRectangle();
      }
    });
  });
});
