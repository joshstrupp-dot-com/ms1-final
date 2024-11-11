#03B

## Data Exploraiton
I use a combination of object and language detection frameworks to build a function that:
1. Scrapes SI website (for more information than is available via API)
2. Creates a df with data and saves image
3. Detects and labels key words with NER (e.g. PERSON or ORGANIZATION)
4. Detects 12 categories of clothing in the image (e.g. headwear, pants, etc) and 46 sub-categories, labels them, then extracts them from the image as separate images.

![image](https://github.com/user-attachments/assets/9f84ac57-9f5d-4b18-9c9c-bf94c69065e1)

![image](https://github.com/user-attachments/assets/3bcec15f-aa57-47c4-86b7-da69d6e9a7ad)
![image](https://github.com/user-attachments/assets/9a983a32-2af5-4e85-9b4e-675be398c019)



## Mock Design
Below are preliminary designs that will guide application of the data:
![Home](https://github.com/user-attachments/assets/0aa6b97d-793f-4995-ae11-9c7d0d9693ca)
![Drilldown](https://github.com/user-attachments/assets/4532b662-0f77-4f82-af99-b0016392df66)

![Item Overlay](https://github.com/user-attachments/assets/49fd084a-4f05-41bc-82ae-ef6441d5a69e)

![Alt Drilldown](https://github.com/user-attachments/assets/750c1ba6-0a46-4110-87b5-14eefbf232db)


# sketches / wires

**Title**: From Collection to Closet
**What are questions that you want to explore with this visualization?**
- What fits feel fitting even across decades and materials?
- How can we use the collection to make micro collections that are themselves expressions of creativity?
- How can you make the collection _you're own?_

**Why are you creating an interactive/narrative version of it?** 
So that it feels akin to pulling pieces while shopping. 

**What will narrativity and interactivity add to this project that was not possible in static form?**
I will use an introductory screen that underscores the significance of the experience, then use taxonomy (pulls, closet, wardrobe, outfits) that abstracts above "artifacts" and <divs>.

**Which dataset is used? **
Keywords in hats (headware, helmets), shoes (sneakers, footwear, heels), and tops (dresses, outerwear, shirts). 

**What are the properties of the data set? How many data points, what's the quality of the data etc?**
I'm relying on titles, materials, notes, and colors from vibrant.js.

**Which visualization method is used and why?**
In a way, this has become a product more than a visualization. It leverages data as filters.

![MacBook Pro 14_ - 10-4](https://github.com/user-attachments/assets/2a5c2bdb-fae7-403f-9ddb-278ad8ac1ff2)
![MacBook Pro 14_ - 10-3](https://github.com/user-attachments/assets/60d57636-755f-4648-99fe-7a1221dee2c4)
![MacBook Pro 14_ - 10-2](https://github.com/user-attachments/assets/765fe75d-b2d6-4463-99ff-8c16b1757741)
![MacBook Pro 14_ - 10](https://github.com/user-attachments/assets/46af7f8d-2190-457a-a318-eef92f63b6ab)
![MacBook Pro 14_ - 10-1](https://github.com/user-attachments/assets/913a06cc-e603-460c-96be-87acf980a540)
