const mongoose = require("mongoose");
const Trip = require("../models/Trip");

// CREATE TRIP
const createTrip = async (req, res) => {
    console.log("=== CREATE TRIP ===");
    try {
        const {
            destination,
            durationDays,
            budgetTier,
            interests,
            itinerary,
            estimatedBudget,
            hotels,
            packingList,
        } = req.body;

        if (!destination || !durationDays || !budgetTier) {
            return res.status(400).json({
                success: false,
                message: "Destination, duration and budgetTier are required",
            });
        }

        const trip = await Trip.create({
            userId: req.user.userId,
            destination,
            durationDays,
            budgetTier,
            interests,
            itinerary,
            estimatedBudget,
            hotels,
            packingList,
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

// GET CURRENT USER TRIPS
const getTrips = async (req, res) => {
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

// UPDATE TRIP
const updateTrip = async (req, res) => {
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
            tripId,
            req.body,
            {
                new: true,
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
};
