const axios = require("axios");
const { Flight } = require("../db/models");
const { getSocket } = require("../utils/socket");

// Fetch all flights from the database
exports.getAllFlights = async (req, res, next) => {
    try {
        const flights = await Flight.findAll();
        res.json(flights);
    } catch (err) {
        next(err);
    }
};

// Fetch flight data from the AviationStack API
exports.getFlightData = async (req, res, next) => {
    try {
        const { flightNumber, date } = req.query;

        console.log("Fetching flight data for:", { flightNumber, date });

        // Real Flight API
        // const response = await axios.get(
        //     "https://api.aviationstack.com/v1/flights",
        //     {
        //         params: {
        //             access_key: process.env.FLIGHT_API_KEY,
        //             flight_iata: flightNumber,
        //             flight_date: date,
        //         },
        //     }
        // );

        // console.log("AviationStack API Response:", response.data);

        // if (!response.data || response.data.error) {
        //     console.error("Flight API Error:", response.data.error);
        //     return res
        //         .status(500)
        //         .json({ error: "Failed to fetch flight data from API" });
        // }

        // const flight = response.data.data[0];
        // if (!flight) {
        //     return res.status(404).json({ error: "Flight not found" });
        // }

        // res.json({
        //     flightNumber: flight.flight.iata,
        //     status: flight.flight_status,
        //     departureGate: flight.departure.gate || "N/A",
        //     departureTerminal: flight.departure.terminal || "N/A",
        //     arrivalGate: flight.arrival.gate || "N/A",
        //     arrivalTerminal: flight.arrival.terminal || "N/A",
        // });

        // Mock data for testing
        const mockResponse = {
            flightNumber: flightNumber || "DL123",
            status: "On Time",
            departureGate: "A5",
            departureTerminal: "T1",
            arrivalGate: "C7",
            arrivalTerminal: "T3",
        };

        // Use mock data for now
        res.json(mockResponse);
    } catch (err) {
        console.error("Error fetching flight data:", err.message);
        res.status(500).json({ error: "Failed to fetch flight data" });
    }
};

// Notify clients about a flight delay
exports.notifyFlightDelay = async (req, res, next) => {
    try {
        const { flightNumber, delayTime } = req.body;

        // Emit the flight delay notification to all connected clients
        const io = getSocket();
        io.emit("flightDelay", { flightNumber, delayTime });

        res.json({
            success: true,
            message: `Flight ${flightNumber} delayed by ${delayTime} minutes.`,
        });
    } catch (err) {
        console.error("Error notifying flight delay:", err);
        res.status(500).json({ error: "Failed to notify flight delay" });
    }
};
