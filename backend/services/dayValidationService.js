const validateGeneratedDay = (day) => {

    if (
        !Number.isInteger(day.dayNumber)
    ) {
        throw new Error(
            "Invalid day number"
        );
    }

    if (
        !Array.isArray(day.activities)
    ) {
        throw new Error(
            "Activities must be array"
        );
    }

    day.activities.forEach(
        (activity, index) => {

            if (
                !activity.title ||
                typeof activity.title !==
                "string"
            ) {
                throw new Error(
                    `Activity title invalid at index ${index}`
                );
            }

            if (
                typeof activity.description !==
                "string"
            ) {
                throw new Error(
                    `Activity description invalid at index ${index}`
                );
            }

            if (
                typeof activity.estimatedCost !==
                "number" ||
                activity.estimatedCost < 0
            ) {
                throw new Error(
                    `Activity cost invalid at index ${index}`
                );
            }
        }
    );

    return true;
};

module.exports = {
    validateGeneratedDay,
};