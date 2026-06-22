const mongoose = require("mongoose");
const Trip = require("../models/Trip");

const {
    validateTripInput
} = require("../services/tripInputValidationService");

const {
    validateAITrip
} = require("../services/tripAIValidationService");

const {
    generateTripPlan
} = require("../services/aiServices");

const {
    regenerateTripDay,
} = require("../services/aiServices");

const {
    validateGeneratedDay,
} = require(
    "../services/dayValidationService"
);


// CREATE TRIP
const createTrip = async (req, res) => {
    console.log("=== CREATE TRIP ===");
    try {

        // BEFORE AI VALIDATE USER DATA
        validateTripInput(req.body);

        const aiTrip = await generateTripPlan(req.body);


        // AFTER AI GEN VALIDATE AI RESPONSE
        validateAITrip(aiTrip);

        aiTrip.estimatedBudget.total =
            aiTrip.estimatedBudget.accommodation +
            aiTrip.estimatedBudget.food +
            aiTrip.estimatedBudget.activities +
            aiTrip.estimatedBudget.transport;

        if (!aiTrip.destination || !aiTrip.durationDays || !aiTrip.budgetTier) {
            return res.status(400).json({
                success: false,
                message: "Destination, duration and budgetTier are required",
            });
        }

        const trip = await Trip.create({
            userId: req.user.userId,
            destination: aiTrip.destination,
            durationDays: aiTrip.durationDays,
            budgetTier: aiTrip.budgetTier,
            interests: aiTrip.interests,
            itinerary: aiTrip.itinerary,
            estimatedBudget: aiTrip.estimatedBudget,
            hotels: aiTrip.hotels,
            packingList: aiTrip.packingList,
        });

        return res.status(201).json({
            success: true,
            message: "Trip created successfully",
            data: trip,
        });

    } catch (error) {
        console.error("CREATE TRIP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const addActivity = async (req, res) => {
    try {
        const { tripId } = req.params;

        const {
            dayNumber,
            title,
            description,
            estimatedCost,
        } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                message: "Title required",
            });
        }

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found",
            });
        }

        console.log("Trip User ID:", trip.userId.toString());
        console.log("Req User:", req.user);
        console.log("Req User ID:", req.user.id);

        if (
            trip.userId.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message: "Unauthorized",
            });
        }

        const day = trip.itinerary.find(
            d => d.dayNumber === dayNumber
        );

        if (!day) {
            return res.status(404).json({
                message: "Day not found",
            });
        }

        day.activities.push({
            title,
            description,
            estimatedCost:
                Number(estimatedCost) || 0,
        });

        await trip.save();

        return res.json(trip);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to add activity",
        });
    }
};

// GET CURRENT USER TRIPS
const getTrips = async (req, res) => {
    console.log("=== GET TRIPS ===");
    try {
        const trips = await Trip.find({
            userId: req.user.userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: trips.length,
            data: trips,
        });

    } catch (error) {
        console.error("GET TRIPS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getTripById = async (req, res) => {

    console.log("=== GET SINGLE TRIP ===");

    try {

        const { tripId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                tripId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip id",
            });
        }

        const trip = await Trip.findOne({
            _id: tripId,
            userId: req.user.userId,
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: trip,
        });

    } catch (error) {

        console.error(
            "GET SINGLE TRIP ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// UPDATE TRIP
const updateTrip = async (req, res) => {
    console.log("============== UPDATE TRIP ===============");

    delete req.body.userId;
    delete req.body._id;

    try {
        const { tripId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip id",
            });
        }

        const trip = await Trip.findOne({
            _id: tripId,
            userId: req.user.userId,
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found",
            });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            {
                _id: tripId,
                userId: req.user.userId,
            },
            {
                $set: req.body,
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            data: updatedTrip,
        });

    } catch (error) {
        console.error("UPDATE TRIP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// UPDATE SINGLE DAY IN A TRIP 
// AFTER CHECK THIS

const updateDay = async (
    req,
    res
) => {

    console.log(
        "=== UPDATE DAY ==="
    );

    try {

        const {
            tripId,
            dayNumber,
        } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                tripId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip id",
            });
        }

        const trip =
            await Trip.findOne({
                _id: tripId,
                userId:
                    req.user.userId,
            });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip not found",
            });
        }

        const day =
            trip.itinerary.find(
                (d) =>
                    d.dayNumber ===
                    Number(
                        dayNumber
                    )
            );

        if (!day) {
            return res.status(404).json({
                success: false,
                message:
                    "Day not found",
            });
        }

        day.activities =
            req.body.activities;

        await trip.save();

        return res.status(200).json({
            success: true,
            message:
                "Day updated successfully",
            data: trip,
        });

    } catch (error) {

        console.error(
            "UPDATE DAY ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Internal server error",
        });
    }
};


// UPDATE PACKING LIST
// AFTER CHECK THIS

const updatePackingList =
    async (req, res) => {

        console.log(
            "=== UPDATE PACKING LIST ==="
        );

        try {

            const { tripId } =
                req.params;

            if (
                !mongoose.Types.ObjectId.isValid(
                    tripId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid trip id",
                });
            }

            const updatedTrip =
                await Trip.findOneAndUpdate(
                    {
                        _id: tripId,
                        userId:
                            req.user.userId,
                    },
                    {
                        $set: {
                            packingList:
                                req.body
                                    .packingList,
                        },
                    },
                    {
                        returnDocument:
                            "after",
                        runValidators:
                            true,
                    }
                );

            if (!updatedTrip) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Trip not found",
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Packing list updated",
                data: updatedTrip,
            });

        } catch (error) {

            console.error(
                "PACKING LIST ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Internal server error",
            });
        }
    };

// AFTER CHECK THIS    

const regenerateDay = async (
    req,
    res
) => {

    console.log(
        "=== REGENERATE DAY ==="
    );

    try {

        const {
            tripId,
            dayNumber,
        } = req.params;

        // ObjectId validation
        if (
            !mongoose.Types.ObjectId.isValid(
                tripId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid trip id",
            });
        }

        const dayNum =
            Number(dayNumber);

        if (
            !Number.isInteger(dayNum) ||
            dayNum <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid day number",
            });
        }

        // Ownership validation
        const trip =
            await Trip.findOne({
                _id: tripId,
                userId:
                    req.user.userId,
            });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip not found",
            });
        }

        const existingDay =
            trip.itinerary.find(
                (day) =>
                    day.dayNumber ===
                    dayNum
            );

        if (!existingDay) {
            return res.status(404).json({
                success: false,
                message:
                    "Day not found",
            });
        }

        // AI generation
        const newDay =
            await regenerateTripDay({
                destination:
                    trip.destination,

                budgetTier:
                    trip.budgetTier,

                interests:
                    trip.interests,

                dayNumber: dayNum,
            });

        // Validate AI response
        validateGeneratedDay(
            newDay
        );

        // Replace day
        const dayIndex =
            trip.itinerary.findIndex(
                (day) =>
                    day.dayNumber ===
                    dayNum
            );

        trip.itinerary[
            dayIndex
        ] = newDay;

        await trip.save();

        return res.status(200).json({
            success: true,
            message:
                "Day regenerated successfully",
            data: trip,
        });

    } catch (error) {

        console.error(
            "REGENERATE DAY ERROR:",
            error
        );

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message:
                    "Gemini quota exceeded",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Internal server error",
        });
    }
};

// DELETE TRIP
const deleteTrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip id",
            });
        }
        const trip = await Trip.findOne({
            _id: tripId,
            userId: req.user.userId,
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found",
            });
        }

        await Trip.findByIdAndDelete(tripId);

        return res.status(200).json({
            success: true,
            message: "Trip deleted successfully",
        });

    } catch (error) {
        console.error("DELETE TRIP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    createTrip,
    getTrips,
    updateTrip,
    deleteTrip,
    getTripById,
    updateDay,
    updatePackingList,
    regenerateDay,
    addActivity,
};
