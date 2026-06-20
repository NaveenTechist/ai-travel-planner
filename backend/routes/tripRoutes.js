const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createTrip,
    getTrips,
    updateTrip,
    deleteTrip,
} = require("../controllers/tripController");

router.get("/", auth, (req, res) => {
    res.json({
        message: "Protected Route Success",
        user: req.user
    });
});

router.post("/", auth, createTrip);

router.get("/", auth, getTrips);

router.put("/:tripId", auth, updateTrip);

router.delete("/:tripId", auth, deleteTrip);

module.exports = router;
