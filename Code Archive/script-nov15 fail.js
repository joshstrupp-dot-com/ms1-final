////////////////////////////// SET UP BASE AND DATA ////////////////////////////////////

// Constants for the visualization
const width = window.innerWidth;
const height = window.innerHeight;
const nodeRadius = 10;

// Categories in order
const categories = ["Museum", "Country", "Topic", "Year"];

// Create the SVG container
const svg = d3
  .select("#visualization")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

// Declare variables to hold root and current category
let root;
let currentCategory = categories[0]; // Default category is "Museum"
let currentDepth = 1; // Keep track of current depth level
let sizeScale; // Global sizeScale for nodes

////////////////////////////// CATEGORY CHOOSER ////////////////////////////////

// Create dropdown for selecting category
const categorySelect = d3
  .select("#visualization")
  .insert("select", "svg")
  .style("position", "absolute")
  .style("top", "20px")
  .style("left", "20px");

// Add options to the dropdown
categorySelect
  .selectAll("option")
  .data(categories)
  .enter()
  .append("option")
  .text((d) => d)
  .attr("value", (d) => d);

// Add event listener for dropdown changes
categorySelect.on("change", function (event) {
  const selectedCategory = event.target.value;
  if (currentDepth === 1) {
    // Update depth 1 nodes
    updateVisualization(selectedCategory, data);
  } else if (currentDepth === 2) {
    // Update depth 2 nodes
    updateChildNodes(selectedCategory);
  }
});

////////////////////////////// PHYSICS / FORCE SIMULATION ////////////////////////////////

const simulation = d3
  .forceSimulation()
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force(
    "collision",
    d3.forceCollide().radius((d) => nodeRadius + 10)
  )
  .force("x", d3.forceX(width / 2).strength(0.1))
  .force("y", d3.forceY(height / 2).strength(0.1));

////////////////////////////// BUILD HIERARCHY FUNCTION ////////////////////////////////

function buildHierarchy(data, selectedCategory) {
  // Group data by the selected category
  const groups = d3.group(data, (d) => d[selectedCategory] || "Unknown");

  // Build hierarchy data
  const hierarchyData = {
    name: "root",
    children: Array.from(groups, ([key, values]) => ({
      name: key,
      size: values.length, // Use count for sizing
      originalEntries: values, // Keep original entries for further interactions
    })),
  };

  // Create hierarchy and compute initial positions
  const newRoot = d3.hierarchy(hierarchyData);

  // Assign unique sizes based on counts
  sizeScale = d3
    .scaleLinear()
    .domain([
      1,
      d3.max(
        newRoot.descendants().filter((d) => d.depth === 1),
        (d) => d.data.size
      ),
    ])
    .range([20, 70]);

  console.log("Hierarchy Data:", hierarchyData);
  console.log("D3 Hierarchy Root:", newRoot);

  return newRoot;
}

////////////////////////////// HANDLING CLICK EVENTS ////////////////////////////////

function handleClick(event, d) {
  // Remove existing links and image container
  svg.selectAll(".link").remove();
  d3.select("#image-container").remove();

  if (d.depth === 1) {
    // Determine the next category in the categories list
    let currentCategoryIndex = categories.indexOf(currentCategory);
    let nextCategoryIndex = currentCategoryIndex + 1;

    // If we've reached the end of the categories list
    if (nextCategoryIndex >= categories.length) {
      nextCategoryIndex = 0; // Loop back to the first category
    }

    const nextCategory = categories[nextCategoryIndex];

    // Group data from the clicked node's original entries based on the nextCategory
    const childGroups = d3.group(
      d.data.originalEntries,
      (entry) => entry[nextCategory] || "Unknown"
    );

    // Create child nodes for the next category
    const childNodes = Array.from(childGroups, ([key, values]) => ({
      depth: 2,
      data: {
        name: key,
        size: values.length,
        originalEntries: values,
      },
      x: d.x,
      y: d.y,
      parent: d,
    }));

    // Update the current depth and category
    currentDepth = 2;
    currentChildCategory = nextCategory;

    createForceLayout(d, childNodes);
  } else if (d.depth === 2) {
    // Display images associated with this node
    const imageUrls = Array.from(
      new Set(d.data.originalEntries.map((entry) => entry.Image_URL))
    );

    // Create or select image container
    let imageContainer = d3.select("#image-container");

    if (imageContainer.empty()) {
      imageContainer = d3
        .select("body")
        .append("div")
        .attr("id", "image-container")
        .style("position", "fixed")
        .style("right", "20px")
        .style("top", "20px")
        .style("width", "300px")
        .style("max-height", "90vh")
        .style("overflow-y", "auto")
        .style("background", "white")
        .style("padding", "10px")
        .style("border", "1px solid #ccc");
    }

    // Clear previous images
    imageContainer.html("");

    // Add title
    imageContainer
      .append("h3")
      .text(`${d.data.name} (${imageUrls.length} images)`);

    // Add images
    imageContainer
      .selectAll(".artwork-image")
      .data(imageUrls)
      .join("div")
      .attr("class", "artwork-image")
      .style("margin-bottom", "10px")
      .each(function (url) {
        const div = d3.select(this);
        div
          .append("img")
          .attr("src", url)
          .style("width", "100%")
          .style("height", "auto");
        div
          .append("p")
          .style("margin", "5px 0")
          .style("font-size", "12px")
          .text(url.split("/").pop());
      });
  }
}

////////////////////////////// CREATING FORCE LAYOUT ////////////////////////////////

function createForceLayout(parentNode, newNodes) {
  // Create a scale to size the child circles based on their data
  const childSizeScale = d3
    .scaleLinear()
    .domain([1, d3.max(newNodes, (d) => d.data.size)])
    .range([10, 50]);

  // Create connections (links) between the parent circle and each child circle
  const links = newNodes.map((node) => ({
    source: parentNode,
    target: node,
  }));

  // Update simulation with new nodes
  simulation
    .nodes([...simulation.nodes(), ...newNodes])
    .force("link", d3.forceLink(links).distance(150).strength(0.5))
    .force(
      "collision",
      d3.forceCollide().radius((d) => {
        if (d.depth === 1) return sizeScale(d.data.size) + 10;
        if (d.depth === 2) return childSizeScale(d.data.size) + 10;
        return nodeRadius + 20;
      })
    )
    .force(
      "charge",
      d3.forceManyBody().strength((d) => (d.depth > 1 ? -150 : -300))
    )
    .alpha(1)
    .restart();

  // Draw lines connecting parent and child circles
  const linkElements = svg
    .selectAll(".link")
    .data(links)
    .join("line")
    .attr("class", "link")
    .style("stroke", "#999")
    .style("stroke-opacity", 0.6)
    .style("stroke-width", 1);

  // Keep track of visible nodes
  const allVisibleNodes = [...simulation.nodes()];

  // Assign unique IDs if not present
  let i = 0; // Counter for unique IDs
  allVisibleNodes.forEach((d) => {
    if (!d.data.id) {
      d.data.id = `node-${i++}`;
    }
  });

  // Add circles for new nodes with unique keys
  const nodeElements = svg
    .selectAll(".node")
    .data(allVisibleNodes, (d) => d.data.id)
    .join("circle")
    .attr("class", "node")
    .attr("r", (d) => {
      if (d.depth === 1) return sizeScale(d.data.size);
      if (d.depth === 2) return childSizeScale(d.data.size);
      return nodeRadius;
    })
    .style("fill", (d) => {
      if (d.depth === 2) return "red";
      return "steelblue";
    })
    .style("cursor", "pointer")
    .on("click", handleClick);

  // Add labels for new nodes with unique keys
  const labelElements = svg
    .selectAll(".label")
    .data(allVisibleNodes, (d) => d.data.id)
    .join("text")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text((d) => d.data.name);

  // Update simulation tick
  simulation.on("tick", () => {
    nodeElements
      .attr("cx", (d) => {
        d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x));
        return d.x;
      })
      .attr("cy", (d) => {
        d.y = Math.max(nodeRadius, Math.min(height - nodeRadius, d.y));
        return d.y;
      });

    labelElements
      .attr("x", (d) => d.x)
      .attr("y", (d) => {
        const radius =
          d.depth === 1 ? sizeScale(d.data.size) : childSizeScale(d.data.size);
        return d.y - radius - 5;
      });

    linkElements
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  });

  // Restart the simulation
  simulation.alpha(1).restart();
}

////////////////////////////// UPDATE VISUALIZATION ////////////////////////////////

function updateVisualization(selectedCategory, data) {
  currentCategory = selectedCategory;
  currentDepth = 1;

  // Rebuild hierarchy based on the new category
  root = buildHierarchy(data, selectedCategory);

  // Clear existing SVG elements
  svg.selectAll(".node").remove();
  svg.selectAll(".label").remove();
  svg.selectAll(".link").remove();
  d3.select("#image-container").remove(); // Remove image container if exists

  // Create nodes
  const nodes = svg
    .selectAll(".node")
    .data(root.children) // Use depth 1 nodes
    .join("circle")
    .attr("class", "node")
    .attr("r", (d) => sizeScale(d.data.size))
    .style("fill", "steelblue")
    .style("cursor", "pointer")
    .on("click", handleClick);

  // Add labels
  const labels = svg
    .selectAll(".label")
    .data(root.children)
    .join("text")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text((d) => d.data.name);

  // Update simulation with new nodes
  simulation.nodes(root.children);

  // Restart simulation
  simulation.alpha(1).restart();
}

function updateChildNodes(selectedCategory) {
  // Remove existing depth 2 nodes and links
  svg.selectAll(".link").remove();
  svg
    .selectAll(".node")
    .filter((d) => d.depth === 2)
    .remove();
  svg
    .selectAll(".label")
    .filter((d) => d.depth === 2)
    .remove();

  // For each parent node, generate new child nodes based on the selectedCategory
  root.children.forEach((parentNode) => {
    const childGroups = d3.group(
      parentNode.data.originalEntries,
      (entry) => entry[selectedCategory] || "Unknown"
    );

    const childNodes = Array.from(childGroups, ([key, values]) => ({
      depth: 2,
      data: {
        name: key,
        size: values.length,
        originalEntries: values,
      },
      x: parentNode.x,
      y: parentNode.y,
      parent: parentNode,
    }));

    createForceLayout(parentNode, childNodes);
  });

  currentChildCategory = selectedCategory;
}

////////////////////////////// INITIAL DATA LOAD ////////////////////////////////

let data;

d3.csv("final_data_cat_test.csv")
  .then((loadedData) => {
    data = loadedData;
    console.log("Data Loaded:", data); // Debugging statement

    updateVisualization(currentCategory, data);
  })
  .catch((error) => {
    console.error("Error loading the data:", error);
  });
