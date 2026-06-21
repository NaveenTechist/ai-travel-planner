const validateAITrip = (trip) => {
    console.log("=== After Validating Trip ===");

    if (!trip.destination) {
        throw new Error("AI destination missing");
    }

    if (!Array.isArray(trip.hotels)) {
        throw new Error("Hotels must be array");
    }

    if (!Array.isArray(trip.packingList)) {
        throw new Error("Packing list must be array");
    }

    if (!Array.isArray(trip.itinerary)) {
        throw new Error("Itinerary must be array");
    }

    if (
        typeof trip.estimatedBudget !== "object" ||
        trip.estimatedBudget === null
    ) {
        throw new Error("Estimated budget invalid");
    }

    return true;
};

module.exports = {
    validateAITrip
};