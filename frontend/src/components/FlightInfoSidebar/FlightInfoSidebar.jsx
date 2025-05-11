import { useState, useEffect } from "react";
import "./FlightInfoSidebar.css";

function FlightInfoSidebar({ flightNumber, date }) {
    const [flightData, setFlightData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFlightData() {
            try {
                const response = await fetch(`/api/flights?flightNumber=${flightNumber}&date=${date}`);
                if (response.ok) {
                    const data = await response.json();
                    setFlightData(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || "Failed to fetch flight data.");
                }
            } catch (err) {
                console.error("Error fetching flight data:", err);
                setError("An error occurred while fetching flight data.");
            } finally {
                setLoading(false);
            }
        }

        if (flightNumber && date) {
            fetchFlightData();
        }
    }, [flightNumber, date]);

    if (loading) {
        return <div className="flight-info-sidebar">Loading flight data...</div>;
    }

    if (error) {
        return <div className="flight-info-sidebar error-message">{error}</div>;
    }

    return (
        <div className="flight-info-sidebar">
            <h2>Flight Information</h2>
            {flightData ? (
                <div>
                    <p>
                        <strong>Flight Number:</strong> {flightData.flightNumber}
                    </p>
                    <p>
                        <strong>Status:</strong> {flightData.status}
                    </p>
                    <p>
                        <strong>Departure Gate:</strong> {flightData.departureGate}
                    </p>
                    <p>
                        <strong>Departure Terminal:</strong> {flightData.departureTerminal}
                    </p>
                    <p>
                        <strong>Arrival Gate:</strong> {flightData.arrivalGate}
                    </p>
                    <p>
                        <strong>Arrival Terminal:</strong> {flightData.arrivalTerminal}
                    </p>
                </div>
            ) : (
                <p>No flight data available.</p>
            )}
        </div>
    );
}

export default FlightInfoSidebar;
