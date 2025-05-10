import { useState } from "react";
import "./FlightSearch.css";

function FlightSearch() {
    const [flightNumber, setFlightNumber] = useState("");
    const [date, setDate] = useState("");
    const [flightData, setFlightData] = useState(null);

    const handleSearch = async () => {
        const response = await fetch(`/api/flights?flightNumber=${flightNumber}&date=${date}`);
        const data = await response.json();
        setFlightData(data);
    };

    return (
        <div className="flight-search">
            <h2>Search Flight</h2>
            <input
                type="text"
                placeholder="Flight Number"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {flightData && (
                <div className="flight-data">
                    <h3>Flight Details</h3>
                    <p>Airline: {flightData.data[0]?.airline?.name}</p>
                    <p>Status: {flightData.data[0]?.flight_status}</p>
                    <p>Departure: {flightData.data[0]?.departure?.airport}</p>
                    <p>Arrival: {flightData.data[0]?.arrival?.airport}</p>
                </div>
            )}
        </div>
    );
}

export default FlightSearch;
