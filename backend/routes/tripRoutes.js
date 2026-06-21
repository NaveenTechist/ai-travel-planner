const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createTrip,
    getTrips,
    updateTrip,
    deleteTrip,
    getTripById,
    updateDay,
    updatePackingList,
    regenerateDay,

} = require("../controllers/tripController");

const {
    generateTripPlan,
} = require("../services/aiServices");

router.post(
    "/generate",
    auth,
    createTrip
);



router.get("/", auth, getTrips);
router.get("/:tripId", auth, getTripById);

router.post("/", auth, createTrip);
router.put("/:tripId", auth, updateTrip);

router.patch("/:tripId/day/3", auth, updateDay);
router.patch("/:tripId/packing-list", auth, updatePackingList);
router.patch("/:tripId/regenerate-day/:dayNumber", auth, regenerateDay);

router.delete("/:tripId", auth, deleteTrip);

module.exports = router;
