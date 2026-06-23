require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error(
        "GEMINI_API_KEY is missing"
    );
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate AI travel plan
 * @param {Object} tripDetails
 * @returns {Promise<Object>}
 */
const generateTripPlan = async (tripDetails) => {
    console.log("=== GENERATING TRIP ===");
    try {
        const {
            destination,
            durationDays,
            budgetTier,
            interests,
        } = tripDetails;

        const prompt = `
        You are an expert travel planner.

        Generate a realistic travel plan.

        Destination: ${destination}
        Duration: ${durationDays} days
        Budget Tier: ${budgetTier}
        Interests: ${interests.join(", ")}

        IMPORTANT RULES:

        1. Return ONLY valid JSON.
        2. No markdown.
        3. No code blocks.
        4. No explanations.
        5. No notes.
        6. No text before JSON.
        7. No text after JSON.
        8. Response must be valid for JSON.parse().
        9. Generate exactly ${durationDays} itinerary days.
        10. Hotels must be array of strings only.
        11. Budget values must be numbers only.
        12. Activity costs must be numbers only.
        13. All fields are mandatory.
        14. Every day must contain at least 2 activities.
        15. Packing list must follow the exact schema below.

        JSON SCHEMA:

        {
        "destination": "string",
        "durationDays": 0,
        "budgetTier": "Low",
        "interests": [
            "string"
        ],
        "itinerary": [
            {
            "dayNumber": 1,
            "activities": [
                {
                "title": "string",
                "description": "string",
                "estimatedCost": 0
                }
            ]
            }
        ],
        "estimatedBudget": {
            "accommodation": 0,
            "food": 0,
            "activities": 0,
            "transport": 0
        },
        "hotels": [
            "Hotel Name 1",
            "Hotel Name 2",
            "Hotel Name 3",
            "Hotel Name 4"
        ],
        "packingList": {
            "crucialDocuments": [
            {
                "item": "Passport",
                "checked": false
            }
            ],
            "activityEquipment": [
            {
                "item": "Hiking Shoes",
                "checked": false
            }
            ],
            "climateWear": [
            {
                "item": "Rain Jacket",
                "checked": false
            }
            ]
        }
        }
        `;

        console.log(
            `[AI SERVICE] Generating trip for ${destination}`
        );

        const response =
            await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

        const text =
            response.text.trim();

        const cleanedResponse = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(
            cleanedResponse
        );

    } catch (error) {

        console.error(
            "[AI SERVICE ERROR]",
            error
        );

        throw error;
    }
};


const regenerateTripDay = async ({
    destination,
    budgetTier,
    interests,
    dayNumber,
}) => {

    try {

        const prompt = `
        Generate itinerary for ONLY day ${dayNumber}.

        Destination: ${destination}
        Budget: ${budgetTier}
        Interests: ${interests.join(", ")}

        Return ONLY JSON.

        {
            "dayNumber": ${dayNumber},
            "activities": [
                {
                    "title": "",
                    "description": "",
                    "estimatedCost": 0
                }
            ]
        }
        `;

        const response =
            await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

        const text = response.text.trim();

        console.log("RAW TEXT:", text);

        const cleanedResponse = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        console.log(cleanedResponse);

        return JSON.parse(cleanedResponse);

    } catch (error) {

        console.error(
            "REGENERATE DAY ERROR:",
            error
        );

        throw error;
    }
};

module.exports = {
    generateTripPlan,
    regenerateTripDay
};







// Generate a travel plan.

// Destination: Japan
// Duration: 5 days
// Budget Tier: Medium
// Interests: Food, Nature

// Return ONLY valid JSON.

// {
//   "destination": "",
//   "durationDays": 0,
//   "budgetTier": "",
//   "interests": [],
//   "itinerary": [],
//   "estimatedBudget": {
//     "accommodation": 0,
//     "food": 0,
//     "activities": 0,
//     "transport": 0
//   },
//   "hotels": [],
//   "packingList": []
// }