## Colors

:root {

```
--color-Medium: #8E82D9;
--color-Country: #F20C1F;
--color-Topic: #BFB521;
--color-Year: #F27B13;
--color-base: #F2EEEB;
--color-base-overlay: #D9D9D9;
--color-base-light: #F2EEEBE5;
```

}

## Layout:

- append svg canvas that is 100vh both ways
- 4/5 left (visualization), 1/5 right (filters)

## Styles

### Base

- background F5F5F5

### Type

- Title
  width: 555px;
  height: 248px;
  flex-shrink: 0;
  color: #000;
  font-family: Avenue;
  font-size: 50px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /_ 50px _/
  letter-spacing: -0.55px;

- H1:

  ```color: #000;
  font-family: Avenue;
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  line-height: 131.6%; /_ 36.848px _/
  letter-spacing: -0.308px;
  ```

- H2:

  ````color: #000;
  font-family: Avenue;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 131.6%;
  letter-spacing: -0.198px;```

  ````

- H2 .inside:

  ```display: flex;
  width: 223.481px;
  height: 50.526px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  ```

- H3:

  ```
  font-family: Gantari;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.154px;
  ```

- H3 .center:

  ```display: flex;
  width: 154.511px;
  height: 16.501px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  text-align: center;
  ```

- H3 .left

  ```
  display: flex;
  width: 139px;
  height: 29px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  font-family: Gantari;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.198px;
  ```

  body
  display: flex;
  width: 343px;
  height: 200px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  font-family: Gantari;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.154px;

## Circles

- Draw each circle depth (JS)
- Define image and place in circle depth 3 (CSS)

## Sidebar Temporary

- Create checkboxes (not styled, html)

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

####################################

# Archive

### Circles

Circle

    width: 295.384px;
    height: 295.384px;
    flex-shrink: 0;
    border-radius: 295.384px;
    border: 1px solid #000;

Circle .legend

.depth1
background: #F2EEEB;

.depth2

```width: 236.574px;
height: 236.574px;
flex-shrink: 0;
fill: #F20C1F;
```

<svg xmlns="http://www.w3.org/2000/svg" width="237" height="237" viewBox="0 0 237 237" fill="none">
<circle cx="118.287" cy="118.287" r="118.287" fill="#F20C1F"/>
</svg>

.depth3

```
width: 278.271px;
height: 270.357px;
transform: rotate(161.28deg);
flex-shrink: 0;
fill: rgba(142, 130, 217, 0.20);
stroke-width: 4px;
stroke: #8E82D9;
```

<svg xmlns="http://www.w3.org/2000/svg" width="288" height="275" viewBox="0 0 288 275" fill="none">
  <path d="M204.001 245.626C282.03 224.586 264 219 276.771 189.291C300.279 134.603 269 123 252 82.0002C225.912 19.0818 227.287 -4.92439 198 5.00001C142.809 23.702 33.6622 -19.048 37.5857 41.1859C40.8956 91.9999 -16.6123 92.4201 9.99968 133C33.8272 169.334 -2.19323 232.885 40.8956 259.718C83.7194 286.385 121.026 267.999 204.001 245.626Z" fill="#8E82D9" fill-opacity="0.2" stroke="#8E82D9" stroke-width="4"/>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" width="350" height="257" viewBox="0 0 350 257" fill="none">
  <path d="M145.833 2.95939C65.1799 -2.15645 73.8329 13.9595 58.8329 32.9594C38.8538 58.2662 64.0357 87.2423 16.1256 138.028C-12.1672 168.019 5.8328 249.993 36.756 249.993C95.029 249.993 152.364 259.99 237.833 249.993C323.302 239.996 356.92 214.992 344.739 168.019C333.833 125.959 337.031 81.201 304.833 41.9595C272.833 2.95939 231.599 8.39959 145.833 2.95939Z" fill="#8E82D9" fill-opacity="0.2" stroke="#8E82D9" stroke-width="4"/>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" width="270" height="298" viewBox="0 0 270 298" fill="none">
  <path d="M124 8.00017C68 -15.9998 53.8508 49.9556 24 91.0002C8 113 65 127 24 162C-17 197 8.99999 230 38 274C67 318 189 284 247 274C305 264 218 215 247 192C276 169 253 141 247 91.0002C241 41.0004 180 32.0002 124 8.00017Z" fill="#8E82D9" fill-opacity="0.2" stroke="#8E82D9" stroke-width="4"/>
</svg>

## Elements

Image

```
width: 51px;
height: auto;
flex-shrink: 0;
margin: 10px; /* Adds space around the image */
object-fit: cover; /* Ensures the image covers the container without distortion */
border-radius: 50%; /* Makes the image itself circular, if desired */
display: block; /* Ensures proper rendering within flex containers */
```

Image .overlay

```
width: 392px;
height: auto;
flex-shrink: 0;
```

Button

```
width: 124px;
height: 35px;
flex-shrink: 0;
border-radius: 5px;
border: 1px solid #000;
background: #FFF;
```

<!-- flex-shrink: 0 prevents this element from shrinking when there is not enough space in its container -->
