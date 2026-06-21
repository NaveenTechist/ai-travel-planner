const validateTripInput = (data) => {

    if (!data.destination) {
        throw new Error("Destination required");
    }

    if (typeof data.destination !== "string") {
        throw new Error("Destination must be string");
    }

    if (!Number.isInteger(data.durationDays)) {
        throw new Error("Duration must be number");
    }

    if (!["Low", "Medium", "High"].includes(data.budgetTier)) {
        throw new Error("Invalid budget tier");
    }

    if (!Array.isArray(data.interests)) {
        throw new Error("Interests must be array");
    }

    return true;
};

module.exports = {
    validateTripInput
};