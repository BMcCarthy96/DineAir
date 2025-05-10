const express = require("express");
const router = express.Router();
const {
    getFlightData,
    getAllFlights,
} = require("../../controllers/flightController");

router.get("/", getFlightData);

// All flights
router.get("/all", getAllFlights);

module.exports = router;
