import * as PIXI from "pixi.js";
window.PIXI = PIXI;

import createPilingJs, { createImageRenderer } from "piling.js";
import { csv } from "d3"; // Use d3.csv for robust parsing

(async function init() {
  // Use d3.csv to parse the file. d3.csv handles quotes, commas, and complex fields properly.
  const data = await csv("final_data.csv");

  // Inspect one row to verify structure:
  console.log("First row:", data[0]);

  // Create items array. Clean the Image_URL field if necessary.
  const items = data.slice(0, 100).map((row) => {
    let imageUrl = (row["Image_URL"] || "").trim();

    // If the URL is enclosed in quotes or brackets, remove them.
    imageUrl = imageUrl.replace(/[\[\]']/g, "").trim();

    return { src: imageUrl };
  });

  // Create the image renderer
  const imageRenderer = createImageRenderer();

  // Get the DOM element
  const demoEl = document.getElementById("demo");

  // Instantiate piling.js with the cleaned items
  const piling = createPilingJs(demoEl, {
    items,
    renderer: imageRenderer,
    columns: 3,
    darkMode: false,
  });

  // Arrange items by the Name attribute
  piling.arrangeBy("data", "Name");
})();
