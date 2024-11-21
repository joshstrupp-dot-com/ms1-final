# Data Updates

- "Topic" should JUST come from "See more items in" as they all have it.
- Consider changing current guesses like "Medium" for something more proven, e.g. color.
- Consider re-categorizing using LlamaIndex - which should be able to parse csv, add new entry based on prompt
- Ensure supercategory is also exported, and change from "name"
- adjust current final csv so that entries from cropped_images folder that do not have copped_image found are still in dataset. Perhaps use pickle checkpoints to identify data associated with those images?
- When doing data collection, adjust so that entry into final csv includes entries that don't necessarily have fashionpedia recognition.

## Gallery

- For "all" make adjustments for cleaner load
- For filter, create containers for each category that load handful, then enable loading more.

## Overlay

- Append collection button, trigger it to overlay #collection.
- connect "add to collection" button(s) to primary image
- on click, create logic that will save that image's information (that will later be called when populating #collection)
- Logic to overlay cropped image
- connect "add to collection" button functionality to copped images.

## Add to Collection

- Collection is its own page, with just background
- Set collection image to default size
- "back" button just takes back to previous page
- Once added, placed on to collection board at random location
- Enable clicking and dragging around

## Circular Packing

- Add siloutted person
- Determine which "name" goes to what anchored position on person
- Clicking on one will hightlight that coresponding image
- Style the circles

## Remaining Styles

- organize styles
- Organize layout of overlay page
- create and apply styles to overlay page - starting with type
- consistent tooltips

## Performance

-

<!-- # Style

## Gallery-depth1

- Update to create gallery that takes up all current viz space

## Gallery-depth2

- Creates room for visualization
- Create image-category-container style w text and dummy images
- Cascade containers

## visualization

- make space for it (temporary border)

## Sidebar

- Create checkboxes and "category" label
- Dummy Lorem for bottom right

## Overlay

- overlay bg (css)
  - z index
- Position: image and text sections
- tk lorem title and body
- tk temporary image
- Define image on top of image (css, html)
- define button (css, html)
- tk buttons (add to collection, "X")

## Collection

- Same as overlay
- title
- images in random spots
- tk buttons (back)

# Rig

## Gallery-depth2

### Logic

- Click category

  - Console.log array:
    - `{category: {subcategory: [count, [imageURL, imageURL...]]}}`

- Display corresponding subcategory: images

## Visualization

### Count Bar

- Use D3 to create bar chart
  - category determines color
  - Height determined by count
  - Sorted ascending
- If time: play with hover

 -->
