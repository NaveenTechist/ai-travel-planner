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
        Generate a realistic travel plan.

        Destination: ${destination}
        Duration: ${durationDays} days
        Budget Tier: ${budgetTier}
        Interests: ${interests.join(", ")}

        Return ONLY valid JSON.

        {
        "destination": "",
        "durationDays": 0,
        "budgetTier": "",
        "interests": [],
        "itinerary": [
            {
            "dayNumber": 1,
            "activities": [
                {
                "title": "",
                "description": "",
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
        "hotels": [],
        "packingList": []
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

module.exports = {
    generateTripPlan,
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