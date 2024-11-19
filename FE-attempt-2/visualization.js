// Get the visualization container dimensions
const container = d3.select("#visualization");
const width = container.node().getBoundingClientRect().width;
const height = container.node().getBoundingClientRect().height;

// Create SVG element
const svg = container.append("svg").attr("width", width).attr("height", height);

const circleDepth1 = svg
  .append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2.5)
  .attr("r", 100) // Based on style guide circle size
  .attr("fill", "var(--color-base)")
  .attr("stroke", "#000")
  .attr("fill", "var(--color-base)")
  .attr("stroke-width", 1);
