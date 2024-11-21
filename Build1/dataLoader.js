import { CONFIG } from "./config.js";

// Create a global dataStore object
window.dataStore = {
  allData: [],
  isLoaded: false,
  loadData: function () {
    if (this.isLoaded) {
      return Promise.resolve(this.allData);
    }

    const csvUrl = CONFIG.CSV_URL; // Use the CSV_URL from CONFIG

    return d3
      .csv(csvUrl)
      .then((data) => {
        this.allData = data;
        this.isLoaded = true;
        console.log(`Data loaded: ${data.length} records`);
        return this.allData;
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        throw error;
      });
  },
};
