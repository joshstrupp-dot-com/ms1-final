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
    CREDIT_LINE: "Credit Line",
    OBJECT_NAME: "Object Name",
    PHYSICAL_DESCRIPTION: "Physical Description",
    PLACE_MADE: "place made",
    SEE_MORE_ITEMS_IN: "see more items in",
    SUBJECT: "Subject",
    ALL_PLACES: "all_places",
    ALL_YEARS: "all_years",
    COMBINED_TOPIC_TEXT: "combined_topic_text",
    COMBINED_MEDIUM_TEXT: "combined_medium_text",
  },
};

window.CONFIG = CONFIG;
