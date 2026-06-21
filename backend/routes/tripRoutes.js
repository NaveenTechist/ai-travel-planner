const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createTrip,
    getTrips,
    updateTrip,
    deleteTrip,
} = require("../controllers/tripController");

const {
    generateTripPlan,
} = require("../services/aiServices");

router.post(
    "/generate",
    auth,
    createTrip
);

router.post("/", auth, createTrip);

router.get("/", auth, getTrips);

router.put("/:tripId", auth, updateTrip);

router.delete("/:tripId", auth, deleteTrip);

module.exports = router;
