const { GoogleGenerativeAI } = require("@google/generative-ai");

// Validate environment variable during startup
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

/**
 * Generate AI travel plan
 * @param {Object} tripDetails
 * @returns {Promise<Object>}
 */
const generateTripPlan = async (tripDetails) => {
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

        const result = await model.generateContent(prompt);

        if (!result) {
            throw new Error(
                "Gemini returned empty result"
            );
        }

        const response = result.response;

        if (!response) {
            throw new Error(
                "Gemini response is missing"
            );
        }

        const text = response.text();

        if (!text) {
            throw new Error(
                "Gemini returned empty text"
            );
        }

        // Remove markdown code blocks if Gemini adds them
        const cleanedResponse = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let parsedData;

        try {
            parsedData = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error(
                "[AI SERVICE] JSON Parse Error:",
                cleanedResponse
            );

            throw new Error(
                "Gemini returned invalid JSON"
            );
        }
        console.log(
            "[AI SERVICE] Trip generation successful"
        );
        console.log(parsedData)
        return parsedData;

    } catch (error) {
        console.error(
            "[AI SERVICE] Error:",
            error.message
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