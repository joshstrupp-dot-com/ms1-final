// import { removeAllFilterClasses } from "./utils.js";

// // Define all possible filter classes for easy management
// const FILTER_CLASSES = [
//   "visualization-filter",
//   "museum-filter",
//   "topic-filter",
//   "est_year-filter",
//   // Add any additional filter classes here
// ];

// document.addEventListener("DOMContentLoaded", () => {
//   // Select all category filter buttons
//   const categoryButtons = document.querySelectorAll(".button-category");

//   categoryButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       const activeClass = "active";
//       const isActive = button.classList.contains(activeClass);

//       // Remove active class from all buttons to ensure only one is active
//       categoryButtons.forEach((btn) => btn.classList.remove(activeClass));

//       if (!isActive) {
//         // Activate the clicked button
//         button.classList.add(activeClass);

//         // Retrieve the category from the data-category attribute
//         const category = button.getAttribute("data-category"); // e.g., "Museum", "topic", "est_year"

//         // Dispatch the 'filterChanged' event with the selected category
//         const filterEvent = new CustomEvent("filterChanged", {
//           detail: {
//             category: category, // e.g., "Museum"
//             value: category.toLowerCase(), // e.g., "museum"
//             maintainStyle: false, // Indicates that new filters should not maintain previous styles
//           },
//         });
//         document.dispatchEvent(filterEvent);
//       } else {
//         // If the button was already active, deactivate it and clear filters
//         const clearFilterEvent = new CustomEvent("filterChanged", {
//           detail: {
//             category: null,
//             value: null,
//             maintainStyle: false, // Indicates that styles should be cleared
//           },
//         });
//         document.dispatchEvent(clearFilterEvent);
//       }
//     });
//   });
// });
