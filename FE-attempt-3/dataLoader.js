// dataLoader.js

// Create a global dataStore object
window.dataStore = {
  allData: [],
  isLoaded: false,
  loadData: function () {
    if (this.isLoaded) {
      return Promise.resolve(this.allData);
    }

    const csvUrl = "../final_data_cat.csv"; // Ensure the path is correct

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
