const express = require("express");
const router = express.Router();
const {
    getFlightData,
    getAllFlights,
    notifyFlightDelay,
} = require("../../controllers/flightController");

router.get("/", getFlightData);

// All flights
router.get("/all", getAllFlights);

// Route to notify flight delay
router.post("/delay", notifyFlightDelay);

module.exports = router;
