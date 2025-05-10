const axios = require("axios");

const { Flight } = require("../db/models");

exports.getAllFlights = async (req, res, next) => {
    try {
        const flights = await Flight.findAll();
        res.json(flights);
    } catch (err) {
        next(err);
    }
};

exports.getFlightData = async (req, res, next) => {
    try {
        const { flightNumber, date } = req.query;

        const response = await axios.get(
            "https://api.aviationstack.com/v1/flights",
            {
                params: {
                    access_key: process.env.FLIGHT_API_KEY,
                    flight_iata: flightNumber,
                    flight_date: date,
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error("Error fetching flight data:", err);
        res.status(500).json({ error: "Failed to fetch flight data" });
    }
};
