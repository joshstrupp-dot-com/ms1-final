## Data

- Create dummy data
  - title
  - description
  - museum
  - topic
  - country
  - year
  - image_url
  - cropped_image_path
  - cropped_image_area
  - cropped_image_x
  - cropped_image_y

## Filter Logic (Console only)

- Depth 1: Only "museum" option
- Depth 2: Options include "country", "topic", "year", "material"
- Depth 3: Same options as Depth 2, but if already selected/on-screen, not an option

2. Initialize tracking variables:

   - Create selections object to store current selection for each depth (all null initially)
   - Create selectedDepths object with defaults:
     - Depth 1: "museum"
     - Depth 2: "country"
     - Depth 3: "topic"

3. Helper function: getCount

   - Input: dataset and filters object
   - For each item in dataset:
     - Check if item matches all filter criteria
     - Return count of matching items

4. Depth 1 Selection function:

   - Input: museum name and dataset
   - Store museum selection
   - Count items matching museum
   - Get available options for Depth 2:
     - Filter data for selected museum
     - Group remaining data by selected Depth 2 depth
     - Log available options

5. Depth 2 Selection function:

   - Input: selected value and dataset
   - Store Depth 2 selection
   - Count items matching museum AND Depth 2 selection
   - Get available options for Depth 3:
     - Filter data for selected museum and Depth 2 value
     - Group remaining data by selected Depth 3 depth
     - Log available options

6. Depth 3 Selection function:

   - Input: selected value and dataset
   - Store Depth 3 selection
   - Count items matching all three selections
   - Get final filtered dataset:
     - Filter for all three selections
   - For each matching item:
     - Log image URL and cropped image path

7. Depth Change function:
   - Input: depth number, new depth dimension, and dataset
   - Update selected depth for specified depth
   - If changing Depth 2 depth and Depth 1 is selected:
     - Re-run Depth 1 selection to update groupings
   - If changing Depth 3 depth and Depth 2 is selected:
     - Re-run Depth 2 selection to update groupings

## Initiate Circles

- Adjust circle size according to volume of records
- When one depth 1 circle is selected, all other depth 1 circles disappear

## Draw depth 2 and 3 circles

- Within that depth 1 selection, all depth 2 circles are drawn when grouped by THAT depth 1 and 2 selection.
- Repeat for depth 3
- At whatever depth phase is highest and on screen, new selection will replace that one.

## Depth 3 in detail

- clicking on depth 3 will log all associated images
- It will show the first 5 images within selection within the circle
- Clicking on one creates an overlay box

## Overlay

- trigger appearance on click in depth 3
- set clicked image to show related image and info in overlay
- connect button to image
- connect button(s) to cropped images
- when buttons clicked, "add to collection"

## Add to Collection

- Collection is its own page, with just background
- Set collection image to default size
- "back" button just takes back to previous page
- Once added, placed on to collection board at random location
- Enable clicking and dragging around
