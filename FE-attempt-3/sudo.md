# Style

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

- Use D3 to create bar chart
  - category determines color
  - Height determined by count
  - Sorted ascending
- If time: play with hover

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

# Data Updates

- Consider changing current guesses like "topic" or "Medium" for something more proven, e.g. color.
