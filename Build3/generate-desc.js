// Import PapaParse if not already included
// Make sure to include PapaParse via a script tag in your HTML or install it via npm if using a bundler

// Configuration
const COLLECTION_SUMMARY_SELECTOR = ".collection-summary";
const DEFAULT_SUMMARY =
  "A layered aesthetic that playfully collages Victorian-era elegance, Ottoman-influenced silhouettes, and subcultural 20th-century platforms, resulting in a surreal fusion of historical grandeur and modern rebellion.";
const API_KEY =
  "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";

// Store collection items
let collectionItems = new Set();

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setDefaultSummary();

  // Listen for addToCollection events
  document.addEventListener("addToCollection", handleAddToCollection);

  // Listen for image removal (from collection.js context menu)
  document.addEventListener("removeFromCollection", handleRemoveFromCollection);

  // Listen for clear collection event
  document.addEventListener("clearCollection", setEmptySummary);
});

function setDefaultSummary() {
  const collectionSummaryDiv = document.querySelector(
    COLLECTION_SUMMARY_SELECTOR
  );
  if (collectionSummaryDiv) {
    collectionSummaryDiv.textContent = DEFAULT_SUMMARY;
    console.log("Default collection summary set");
  }
}

async function handleAddToCollection(event) {
  const imageData = event.detail;
  console.log("Data received in generate-desc:", imageData);

  // Add to collection items
  collectionItems.add(imageData);
  console.log("Added item to collection. Total items:", collectionItems.size);

  // Generate new summary based on all items
  await generateCollectionSummary();
}

function handleRemoveFromCollection(event) {
  const recordId = event.detail.record_id;

  // Remove from collection items
  collectionItems.forEach((item) => {
    if (item.record_id === recordId) {
      collectionItems.delete(item);
    }
  });

  // If collection is empty, reset to default
  if (collectionItems.size === 0) {
    setDefaultSummary();
    return;
  }

  // Generate new summary based on remaining items
  generateCollectionSummary();
}

async function generateCollectionSummary() {
  if (collectionItems.size === 0) {
    setDefaultSummary();
    return;
  }

  // Check if the items array is empty or contains only undefined/null values
  const itemsData = Array.from(collectionItems).map((item) => ({
    museum: item.Museum || item[CONFIG.DATA_KEYS.MUSEUM],
    topic: item.topic || item[CONFIG.DATA_KEYS.TOPIC],
    description: item.Description || item[CONFIG.DATA_KEYS.DESCRIPTION],
    medium: item.Medium || item[CONFIG.DATA_KEYS.MEDIUM],
    est_year: item.est_year || item[CONFIG.DATA_KEYS.EST_YEAR],
    est_place: item.est_place || item[CONFIG.DATA_KEYS.EST_PLACE],
  }));

  // Check if we have actual data before making the API call
  const hasValidData = itemsData.some((item) =>
    Object.values(item).some((value) => value !== undefined && value !== null)
  );

  if (!hasValidData) {
    setDefaultSummary();
    return;
  }

  // Construct prompt for GPT
  const prompt = `You are a fashion critic, an absolute professional at reading descriptions and details ABOUT artwork. Your goal is to analyze the following collection of fashion items and write ONE concise, engaging sentence that captures their collective style. Be brief but impactful, considering:

- Historical context and time periods
- Cultural influences and places of origin
- Materials and construction techniques
- Artistic movements and cultural moments
- Thematic connections between pieces

Remember: Aim for a punchy, concise sentence that captures the essence without being verbose.

Collection Items:
${JSON.stringify(itemsData, null, 2)}

Please provide ONE concise sentence that captures the essence of this collection's style:`;

  try {
    // Make the API request to OpenAI
    const apiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a fashion critic expert at analyzing collections and describing their collective style in engaging ways.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`OpenAI API error: ${apiResponse.statusText}`);
    }

    const completion = await apiResponse.json();
    const generatedSentence = completion.choices[0].message.content.trim();

    // Update the collection summary
    const collectionSummaryDiv = document.querySelector(
      COLLECTION_SUMMARY_SELECTOR
    );
    if (collectionSummaryDiv) {
      collectionSummaryDiv.textContent = generatedSentence;
      console.log("Collection summary updated with new description");
    }
  } catch (error) {
    console.error("Error generating collection summary:", error);
    // Keep existing summary on error
  }
}

const EMPTY_SUMMARY = "Add to your closet to receive your summary.";

function setEmptySummary() {
  const collectionSummaryDiv = document.querySelector(
    COLLECTION_SUMMARY_SELECTOR
  );
  if (collectionSummaryDiv) {
    collectionSummaryDiv.textContent = EMPTY_SUMMARY;
    console.log("Collection summary set to empty message");
  }
}
