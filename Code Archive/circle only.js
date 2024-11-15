// Constants for the visualization
const width = window.innerWidth;
const height = window.innerHeight;
const nodeRadius = 10;

// Create the SVG container
const svg = d3
  .select("#visualization")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height]);

// Load and process the data from final_data.csv
d3.csv("final_data.csv").then((data) => {
  console.log(data);
});

// From the data, find all unique museums and conosole log them
d3.csv("final_data.csv").then((data) => {
  const uniqueMuseums = new Set(data.map((d) => d.Museum));
  uniqueMuseums.forEach((museum) => {
    const count = new Set(
      data.filter((d) => d.Museum === museum).map((d) => d.Image_URL)
    ).size;
    console.log(`${museum}: ${count}`);
  });
});

// Create a circle labeled {museum} with a radius of {count}
// Create a circle for each museum
// Load the museum data from our CSV file and process it
d3.csv("final_data.csv").then((data) => {
  // Group all the artworks by which museum they belong to
  const museumGroups = d3.group(data, (d) => d.Museum);

  // Convert to array and take just the first museum
  const firstMuseum = Array.from(museumGroups, ([museum, entries]) => ({
    name: museum,
    count: new Set(entries.map((d) => d.Image_URL)).size,
  }))[2];

  // Draw circle for first museum only
  svg
    .selectAll("circle")
    .data([firstMuseum])
    .join("circle")
    .attr("cx", width / 2) // Center horizontally
    .attr("cy", height / 2) // Center vertically
    .attr("r", (d) => Math.sqrt(d.count) * 2) // Scale radius based on count
    .style("fill", "steelblue")
    .style("opacity", 0.7);

  // Add text label for first museum only
  svg
    .selectAll("text")
    .data([firstMuseum])
    .join("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size", "12px")
    .text((d) => `${d.name}: ${d.count}`);
});
