// config.js

export const CONFIG = {
  CSV_URL: "../final_data_cat.csv",
  ITEMS_PER_PAGE: 100,
  CATEGORIES: ["Museum", "Medium", "est_place", "topic", "est_year"],
  DATA_KEYS: {
    MUSEUM: "Museum",
    MEDIUM: "Medium",
    EST_PLACE: "est_place",
    TOPIC: "topic",
    EST_YEAR: "est_year",
    TITLE: "Title",
    DESCRIPTION: "Description",
    IMAGE_URL: "Image_URL",
    BOUNDING_BOX: "bounding_box",
    AREA: "Area",
    CROPPED_IMAGE_PATH: "cropped_image_path",
    NAME: "Name",
  },
};

window.CONFIG = CONFIG;
