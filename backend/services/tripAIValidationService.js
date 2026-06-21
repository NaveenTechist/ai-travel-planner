const validatePackingItems = (
    items,
    category
) => {

    items.forEach(
        (item, index) => {

            if (
                !item ||
                typeof item !==
                "object"
            ) {
                throw new Error(
                    `${category} item ${index} invalid`
                );
            }

            if (
                !item.item ||
                typeof item.item !==
                "string"
            ) {
                throw new Error(
                    `${category} item text invalid`
                );
            }

            if (
                typeof item.checked !==
                "boolean"
            ) {
                throw new Error(
                    `${category} checked must be boolean`
                );
            }
        }
    );
};

const validateAITrip = (trip) => {

    console.log(
        "=== AI VALIDATION STARTED ==="
    );

    // Destination
    if (
        !trip.destination ||
        typeof trip.destination !== "string"
    ) {
        throw new Error(
            "Destination must be string"
        );
    }

    // Duration
    if (
        typeof trip.durationDays !== "number" ||
        trip.durationDays <= 0
    ) {
        throw new Error(
            "Duration must be positive number"
        );
    }

    // Budget Tier
    const validBudgetTiers = [
        "Low",
        "Medium",
        "High",
    ];

    if (
        !validBudgetTiers.includes(
            trip.budgetTier
        )
    ) {
        throw new Error(
            "Invalid budget tier"
        );
    }

    // Interests
    if (
        !Array.isArray(
            trip.interests
        )
    ) {
        throw new Error(
            "Interests must be array"
        );
    }

    // Hotels
    if (
        !Array.isArray(
            trip.hotels
        )
    ) {
        throw new Error(
            "Hotels must be array"
        );
    }

    trip.hotels.forEach(
        (hotel, index) => {

            if (
                typeof hotel !== "string"
            ) {
                throw new Error(
                    `Hotel at index ${index} must be string`
                );
            }
        }
    );

    // Itinerary
    if (
        !Array.isArray(
            trip.itinerary
        )
    ) {
        throw new Error(
            "Itinerary must be array"
        );
    }

    trip.itinerary.forEach(
        (day, dayIndex) => {

            if (
                typeof day.dayNumber !==
                "number"
            ) {
                throw new Error(
                    `Invalid dayNumber at index ${dayIndex}`
                );
            }

            if (
                !Array.isArray(
                    day.activities
                )
            ) {
                throw new Error(
                    `Activities must be array for day ${day.dayNumber}`
                );
            }

            day.activities.forEach(
                (
                    activity,
                    activityIndex
                ) => {

                    if (
                        !activity.title ||
                        typeof activity.title !==
                        "string"
                    ) {
                        throw new Error(
                            `Invalid activity title at day ${day.dayNumber}, activity ${activityIndex}`
                        );
                    }

                    if (
                        typeof activity.description !==
                        "string"
                    ) {
                        throw new Error(
                            `Invalid activity description at day ${day.dayNumber}, activity ${activityIndex}`
                        );
                    }

                    if (
                        typeof activity.estimatedCost !==
                        "number" ||
                        activity.estimatedCost < 0
                    ) {
                        throw new Error(
                            `Invalid activity cost at day ${day.dayNumber}, activity ${activityIndex}`
                        );
                    }
                }
            );
        }
    );

    // Budget
    if (
        !trip.estimatedBudget ||
        typeof trip.estimatedBudget !==
        "object"
    ) {
        throw new Error(
            "Estimated budget invalid"
        );
    }

    const {
        accommodation,
        food,
        activities,
        transport,
    } = trip.estimatedBudget;

    if (
        typeof accommodation !==
        "number" ||
        typeof food !== "number" ||
        typeof activities !== "number" ||
        typeof transport !== "number"
    ) {
        throw new Error(
            "Budget values must be numbers"
        );
    }

    // Packing List
    if (
        !trip.packingList ||
        typeof trip.packingList !==
        "object"
    ) {
        throw new Error(
            "Packing list invalid"
        );
    }

    const {
        crucialDocuments,
        activityEquipment,
        climateWear,
    } = trip.packingList;

    validatePackingItems(
        crucialDocuments,
        "crucialDocuments"
    );

    validatePackingItems(
        activityEquipment,
        "activityEquipment"
    );

    validatePackingItems(
        climateWear,
        "climateWear"
    );

    if (
        !Array.isArray(
            crucialDocuments
        )
    ) {
        throw new Error(
            "crucialDocuments must be array"
        );
    }

    if (
        !Array.isArray(
            activityEquipment
        )
    ) {
        throw new Error(
            "activityEquipment must be array"
        );
    }

    if (
        !Array.isArray(
            climateWear
        )
    ) {
        throw new Error(
            "climateWear must be array"
        );
    }

    console.log(
        "=== AI VALIDATION PASSED ==="
    );

    return true;
};

module.exports = {
    validateAITrip,
};