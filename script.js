//////////////////////////////// SET UP BASE AND DATA ////////////////////////////////////

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

// Load and process the data
d3.csv("final_data_cat_test.csv").then((data) => {
  // Process data to get museum hierarchy
  const museumGroups = d3.group(data, (d) => d.Museum);

  //////////////////////////////// MUSEUM CIRCLE SETUP ////////////////////////////////

  // This code organizes museum data into a tree structure where each museum is represented
  // by a circle. The size of each circle shows how many unique images that museum has -
  // bigger circles mean more images. The circles will be sized between 10 and 50 pixels.

  const hierarchyData = {
    name: "root",
    children: Array.from(museumGroups, ([museum, entries]) => ({
      name: museum,
      size: new Set(entries.map((d) => d.Image_URL)).size, // Count unique parent images
      children: [], // Will be populated when clicked
    })),
  };

  // Create hierarchy and calculate initial positions
  const root = d3.hierarchy(hierarchyData);

  // Size nodes based on log scale of unique images
  const sizeScale = d3
    .scaleLog()
    .domain([1, d3.max(root.children, (d) => d.data.size)]) // Set domain to range of sizes
    .range([10, 50]); // Set range of sizes

  // **Define childSizeScale for depth 2 nodes**
  const childSizeScale = d3
    .scaleLog()
    .domain([
      1,
      d3.max(
        root.descendants().filter((d) => d.depth === 2),
        (d) => d.data.size
      ),
    ])
    .range([5, 25]);
  console.log(
    "Max size for childSizeScale:",
    d3.max(
      root.descendants().filter((d) => d.depth === 2),
      (d) => d.data.size
    )
  );

  //////////////////////////////// CATEGORY CHOOSER ////////////////////////////////

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
    .data(["Topic", "Year", "Country"])
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d);
  //////////////////////////////// PHYSICS / FORCE SIMULATION ////////////////////////////////

  // This code creates a physics simulation that makes the circles move naturally:
  // - Circles push away from each other like magnets
  // - Everything is pulled toward the center of the screen
  // - Circles can't overlap each other
  // - Circles are gently kept from going off screen
  const simulation = d3
    .forceSimulation(root.descendants())
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "collision",
      d3.forceCollide().radius((d) => {
        if (d.depth === 0) return 0;
        return (d.depth === 1 ? sizeScale(d.data.size) : nodeRadius) + 20;
      })
    )
    // Reduced strength of boundary forces to allow more spacing
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05));

  //////////////////////////////// MUSEUM CIRCLE DRAWING ////////////////////////////////

  // This code creates interactive circles representing museums on the screen.
  // Each circle's size shows how many images that museum has, and you can
  // click on them. The museum's name appears above each circle.

  // Create nodes
  const nodes = svg
    .selectAll(".node")
    .data(root.descendants().slice(1)) // Skip root node
    .join("circle")
    .attr("class", "node")
    .attr("r", (d) => (d.depth === 1 ? sizeScale(d.data.size) : nodeRadius))
    .style("fill", "steelblue")
    .style("cursor", "pointer")
    .on("click", handleClick);

  // Add museum labels
  const labels = svg
    .selectAll(".label")
    .data(root.descendants().slice(1))
    .join("text")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text((d) => d.data.name);

  //////////////////////////////// MUSEUM CIRCLE POSITIONING ////////////////////////////////

  // This code updates the positions of the circles and labels on each tick
  // of the simulation. It ensures that the circles and labels stay within the
  // bounds of the screen and are positioned correctly.

  simulation.on("tick", () => {
    nodes
      .attr("cx", (d) =>
        Math.max(nodeRadius, Math.min(width - nodeRadius, d.x))
      )
      .attr("cy", (d) =>
        Math.max(nodeRadius, Math.min(height - nodeRadius, d.y))
      );

    labels
      .attr("x", (d) => Math.max(nodeRadius, Math.min(width - nodeRadius, d.x)))
      .attr("y", (d) => {
        const radius = d.depth === 1 ? sizeScale(d.data.size) : nodeRadius;
        return Math.max(radius, Math.min(height - radius, d.y - radius - 5));
      });
  });

  //////////////////////////////// HANDLING CLICK EVENTS ////////////////////////////////

  function handleClick(event, d) {
    // This function handles what happens when someone clicks on a circle

    // First, remove any existing lines between circles
    svg.selectAll(".link").remove();

    if (d.depth === 3) {
      // This code runs when you click on a topic circle (the smallest circles)

      // Get all the image URLs associated with this topic
      // If there are no images, use an empty array instead
      const imageUrls = Array.from(d.data.imageUrls || []);

      // // Look for an existing container on the page where we'll show the images
      // let imageContainer = d3.select("#image-container");

      // // If we can't find the container, create a new one
      // // This creates a white box on the right side of the screen
      // // that can scroll if there are lots of images
      // if (imageContainer.empty()) {
      //   imageContainer = d3
      //     .select("body")
      //     .append("div")
      //     .attr("id", "image-container")
      //     .style("position", "fixed") // Stick it to one spot on the screen
      //     .style("right", "20px") // 20 pixels from the right edge
      //     .style("top", "20px") // 20 pixels from the top
      //     .style("width", "300px") // Make it 300 pixels wide
      //     .style("max-height", "90vh") // Make it at most 90% of screen height
      //     .style("overflow-y", "auto") // Add scrollbar if content is too tall
      //     .style("background", "white")
      //     .style("padding", "10px") // Add some space inside the box
      //     .style("border", "1px solid #ccc"); // Add a gray border
      // }

      // // Remove any images that were shown before
      // imageContainer.html("");

      // // Add a title showing the topic name and how many images there are
      // imageContainer
      //   .append("h3")
      //   .text(`${d.data.name} (${imageUrls.length} images)`);

      // // For each image URL we have:
      // // 1. Create a div to hold the image
      // // 2. Put the actual image inside that div
      // // 3. Add the filename below the image
      // imageContainer
      //   .selectAll(".artwork-image")
      //   .data(imageUrls)
      //   .join("div")
      //   .attr("class", "artwork-image")
      //   .style("margin-bottom", "10px") // Space between images
      //   .each(function (url) {
      //     const div = d3.select(this);
      //     // Add the image itself
      //     div
      //       .append("img")
      //       .attr("src", url)
      //       .style("width", "100%") // Make image fill the container width
      //       .style("height", "auto"); // Keep image proportions correct
      //     // Add the filename under the image
      //     div
      //       .append("p")
      //       .style("margin", "5px 0")
      //       .style("font-size", "12px")
      //       .text(url.split("/").pop()); // Get just the filename from the full URL
      //   });
      displayImagesInCircle(d);
    } else if (d.depth === 1) {
      // When clicking a museum circle (blue):

      // Get all the artwork data for this museum
      const museumEntries = museumGroups.get(d.data.name);

      //////////////////////////////// "PLACE" CIRCLE SETUP ////////////////////////////////

      // Count how many artworks are from each place
      const placeCounts = museumEntries.reduce((acc, entry) => {
        if (entry.est_place) {
          acc[entry.est_place] = (acc[entry.est_place] || 0) + 1;
        }
        return acc;
      }, {});

      // Create new red circles for each place where art was made
      // The size of each circle shows how many artworks are from that place
      const newNodes = Object.entries(placeCounts).map(([place, count]) => ({
        depth: 2,
        data: {
          name: place,
          size: count, // How many artworks from this place
          originalEntries: museumEntries.filter(
            (entry) => entry.est_place === place
          ),
        },
        x: d.x,
        y: d.y,
        parent: d,
      }));

      // Draw the new circles and connect them to the museum circle
      createForceLayout(d, newNodes);
    } else if (d.depth === 2) {
      // When clicking a place circle (red):

      // Get all the artwork data for this place
      const entries = d.data.originalEntries;

      //////////////////////////////// "TOPIC" CIRCLE SETUP ////////////////////////////////
      // Count how many unique artworks are in each topic/category
      const topicCounts = entries.reduce((acc, entry) => {
        if (entry.topic) {
          // We use Image_URL to avoid counting duplicates
          const imageUrl = entry.Image_URL;
          if (!acc[entry.topic]) {
            acc[entry.topic] = new Set();
          }
          acc[entry.topic].add(imageUrl);
        }
        return acc;
      }, {});

      // Get all unique Image_URLs for each topic
      const imageUrlsByTopic = entries.reduce((acc, entry) => {
        if (entry.topic) {
          const topic = entry.topic;
          const imageUrl = entry.Image_URL;
          if (!acc[topic]) {
            acc[topic] = new Set();
          }
          acc[topic].add(imageUrl);
        }
        return acc;
      }, {});

      // Create new orange circles for each topic
      // The size of each circle shows how many unique artworks are in that topic
      const newNodes = Object.entries(topicCounts).map(([topic, imageSet]) => ({
        depth: 3,
        data: {
          name: topic,
          size: imageSet.size,
          imageUrls: Array.from(imageUrlsByTopic[topic] || new Set()),
        },
        x: d.x,
        y: d.y,
        parent: d,
      }));

      //////////////////////////////// IMAGE NODE SETUP ////////////////////////////////

      // Draw the new circles and connect them to the place circle
      createForceLayout(d, newNodes);
    }
  }

  //////////////////////////////// CREATING FORCE LAYOUT ////////////////////////////////

  // This section creates and manages an interactive force-directed graph visualization.
  // It handles:
  // 1. Creating and positioning circles representing museums, places, and topics
  // 2. Drawing connecting lines between related circles
  // 3. Setting up physics-based animations for natural movement
  // 4. Managing circle sizes, colors, labels and click interactions
  // 5. Implementing orbital-like arrangements of child nodes around parents

  function createForceLayout(parentNode, newNodes) {
    // Create a scale to size the child circles based on their data
    // Larger numbers = bigger circles, using a logarithmic scale
    const childSizeScale = d3
      .scaleLog()
      .domain([1, d3.max(newNodes, (d) => d.data.size)])
      .range([10, 50]);

    // Create connections (links) between the parent circle and each child circle
    const links = newNodes.map((node) => ({
      source: parentNode,
      target: node,
    }));

    // Set up physics simulation to make circles move naturally:
    simulation
      .nodes([...root.descendants().slice(1), ...newNodes])
      // Add forces that determine how circles move:
      .force("link", d3.forceLink(links).distance(150).strength(0.5)) // How far apart linked circles should be
      .force(
        "collision",
        d3.forceCollide().radius((d) => {
          if (d.depth === 0) return 0;
          // Add padding around circles to prevent overlap
          return (d.depth === 1 ? sizeScale(d.data.size) : nodeRadius) + 30;
        })
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => (d.depth > 1 ? -200 : -300)) // Makes circles repel each other
      )
      .alpha(1) // Reset the simulation's internal timer
      .restart(); // Start the animation

    // Draw lines connecting parent and child circles
    const linkElements = svg
      .selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .style("stroke", "#999") // Gray color for links
      .style("stroke-opacity", 0.6) // Make lines slightly transparent
      .style("stroke-width", (d) => Math.sqrt(d.target.data.size)); // Thicker lines for bigger datasets

    // Keep track of which circles should be visible:
    // - All museum circles (depth 1)
    // - The circle that was clicked (parent)
    // - The new child circles that appeared
    const allVisibleNodes = [
      ...root
        .descendants()
        .slice(1)
        .filter((n) => n.depth === 1), // Keep all museum nodes
      parentNode, // Keep the clicked parent
      ...newNodes, // Add new child nodes
    ];

    // Add circles to represent each node in our visualization
    // Each circle represents either a museum or a collection within that museum
    const nodeElements = svg
      .selectAll(".node")
      .data(allVisibleNodes) // Use our filtered list of nodes that should be visible
      .join("circle") // Create/update/remove circles as needed
      .attr("class", "node")
      .attr("r", (d) => {
        // Set the size (radius) of each circle based on its level in the hierarchy
        if (d.depth === 1) return sizeScale(d.data.size); // Museum circles - size based on collection size
        if (d.depth > 1) return childSizeScale(d.data.size); // Collection circles - smaller scale
        return nodeRadius; // Default size for other circles
      })
      .style("fill", (d) => {
        // Color code circles based on their level
        if (d.depth === 2) return "red"; // First level collections are red
        if (d.depth === 3) return "orange"; // Second level collections are orange
        return "steelblue"; // Museums are blue
      })
      .style("cursor", "pointer") // Show pointer cursor on hover
      .on("click", handleClick); // Make circles clickable

    // Add text labels for each circle
    const labelElements = svg
      .selectAll(".label")
      .data(allVisibleNodes)
      .join("text") // Create/update/remove labels as needed
      .attr("class", "label")
      .style("text-anchor", "middle") // Center the text
      .style("font-size", "12px")
      .text((d) => d.data.name); // Show the name of the museum/collection

    // This function runs continuously to update the positions of everything
    // as the physics simulation moves the circles around
    simulation.on("tick", () => {
      // Update circle positions
      nodeElements.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      // Update label positions (slightly above their circles)
      labelElements
        .attr("x", (d) => d.x)
        .attr("y", (d) => {
          const circleRadius =
            d.depth === 1 ? sizeScale(d.data.size) : nodeRadius;
          return d.y - circleRadius - 5; // Position label above the circle
        });

      // Update the connecting lines between circles
      linkElements
        .attr("x1", (d) => d.source.x) // Start point of line (parent circle)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x) // End point of line (child circle)
        .attr("y2", (d) => d.target.y);
    });
  }

  //////////////////////////////// DISPLAY IMAGES IN CIRCLE ////////////////////////////////

  function displayImagesInCircle(d) {
    const imageUrls = Array.from(d.data.imageUrls || []);

    // Remove any existing image groups
    svg.selectAll(".image-group").remove();

    // Create a group (<g>) to hold images
    const imageGroup = svg
      .append("g")
      .attr("class", "image-group")
      .attr("transform", `translate(${d.x}, ${d.y})`); // Position at the circle's center

    // Define the radius of the circle
    const radius = d.depth === 3 ? childSizeScale(d.data.size) : nodeRadius;

    // Optional: Add a semi-transparent background within the circle for better visibility
    imageGroup
      .append("circle")
      .attr("r", radius)
      .attr("fill", "rgba(255, 255, 255, 0.8)") // Semi-transparent white
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Calculate layout for images within the circle
    const imagesPerRow = Math.floor(Math.sqrt(imageUrls.length)); // Simple grid calculation
    const imageSize = (radius * 2) / (imagesPerRow + 2); // Adjust image size based on the number of images

    imageGroup
      .selectAll("image")
      .data(imageUrls)
      .join("image")
      .attr("href", (url) => url)
      .attr("width", imageSize)
      .attr("height", imageSize)
      .attr("x", (d, i) => {
        const row = Math.floor(i / imagesPerRow);
        const col = i % imagesPerRow;
        return (col - imagesPerRow / 2) * imageSize + imageSize / 2;
      })
      .attr("y", (d, i) => {
        const row = Math.floor(i / imagesPerRow);
        const col = i % imagesPerRow;
        return (row - Math.floor(imagesPerRow / 2)) * imageSize + imageSize / 2;
      })
      .style("clip-path", "circle(50%)"); // Optional: Clip images to circle boundaries

    // Optional: Add event listener to toggle image display on circle click
    d3.selectAll(".node").on("click", function (event, nodeData) {
      if (nodeData === d) {
        // Remove the image group if the same circle is clicked again
        imageGroup.remove();
      }
      // Else, handle other clicks normally
    });
    console.log(
      `Rendering images for node ${d.data.name} with size ${d.data.size}`
    );
    console.log(`Calculated radius: ${radius}`);
  }

  //////////////////////////////// UPDATE VISUALIZATION ////////////////////////////////

  // This function updates the visualization when the data changes
  // It updates the nodes and labels to reflect the new data

  function update() {
    // Update the simulation with new nodes
    simulation.nodes(root.descendants());

    // Update nodes and labels
    nodes
      .data(root.descendants().slice(1))
      .join("circle")
      .attr("r", (d) => (d.depth === 1 ? sizeScale(d.data.size) : nodeRadius));

    labels
      .data(root.descendants().slice(1))
      .join("text")
      .text((d) => d.data.name);

    // Restart simulation
    simulation.alpha(1).restart();
  }

  // console log each unique est_place per museum and count
  museumGroups.forEach((entries, museum) => {
    const placeCounts = entries.reduce((acc, entry) => {
      if (entry.est_place) {
        acc[entry.est_place] = (acc[entry.est_place] || 0) + 1;
      }
      return acc;
    }, {});
    console.log(`${museum} est_places:`, placeCounts);
  });

  // **Function to Update Visualization Based on Selected Category**
  function updateVisualization(selectedCategory) {
    // Clear existing SVG elements
    svg.selectAll(".node").remove();
    svg.selectAll(".label").remove();
    svg.selectAll(".link").remove();

    // Regroup data based on the selected category
    const groupedData = d3.group(data, (d) => d[selectedCategory]);

    //////////////////////////////// CREATE HIERARCHY DATA ////////////////////////////////

    // const hierarchyData = {
    //   name: "root",
    //   children: Array.from(museumGroups, ([museum, entries]) => ({
    //     // For each museum
    //     name: museum, // Museum name
    //     size: new Set(entries.map((d) => d.Image_URL)).size, // Number of unique images
    //     children: Array.from(
    //       d3.group(entries, (d) => d.est_place), // For each place
    //       ([place, placeEntries]) => ({
    //         name: place, // Place name
    //         size: placeEntries.length, // Number of artworks
    //         children: Array.from(
    //           d3.group(placeEntries, (d) => d.topic),
    //           ([topic, topicEntries]) => ({
    //             name: topic, // Topic name
    //             size: new Set(topicEntries.map((d) => d.Image_URL)).size, // Number of unique images
    //             imageUrls: topicEntries
    //               .map((d) => d.Image_URL)
    //               .filter((url) => url), // Array of image URLs
    //           })
    //         ),
    //       })
    //     ),
    //   })),
    // };

    // // Create hierarchy and update root
    // root = d3.hierarchy(newHierarchyData);

    // Update size scale based on new data
    sizeScale
      .domain([1, d3.max(root.children, (d) => d.data.size)])
      .range([10, 50]);

    // Update simulation with new nodes
    simulation.nodes(root.descendants());

    // Update nodes and labels
    const nodes = svg
      .selectAll(".node")
      .data(root.descendants().slice(1)) // Skip root node
      .join("circle")
      .attr("class", "node")
      .attr("r", (d) => (d.depth === 1 ? sizeScale(d.data.size) : nodeRadius))
      .style("fill", "steelblue")
      .style("cursor", "pointer")
      .on("click", handleClick);

    const labels = svg
      .selectAll(".label")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("class", "label")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text((d) => d.data.name);

    // Restart simulation
    simulation.alpha(1).restart();
  }
});
