import { useState, useEffect } from "react";
import Map from "../Map/Map";
import RunnerETA from "../RunnerETA/RunnerETA";
import FlightInfoSidebar from "../FlightInfoSidebar/FlightInfoSidebar";
import socket from "../../utils/WebSocket";
import "./DeliveryTrackingPage.css";

function DeliveryTrackingPage() {
    const [runnerLocation, setRunnerLocation] = useState(null);
    const [gateLocation, setGateLocation] = useState({ lat: 37.7849, lng: -122.4094 });
    const [showSidebar, setShowSidebar] = useState(false);
    const [flightNumber, setFlightNumber] = useState(null);
    const [date, setDate] = useState(null);
    const [error, setError] = useState(null);

    // Fetch the runner's initial location from the backend
    useEffect(() => {
        async function fetchRunnerLocation() {
            try {
                const response = await fetch("/api/deliveries/runner-location", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setRunnerLocation(data.location);
                } else {
                    throw new Error("Failed to fetch runner location");
                }
            } catch (err) {
                console.error(err);
                setError("Unable to fetch runner location.");
            }
        }

        fetchRunnerLocation();
    }, []);

    // Fetch flight information dynamically
    useEffect(() => {
        async function fetchFlightInfo() {
            try {
                const response = await fetch("/api/flights?flightNumber=DL123&date=2023-10-01"); // Example API call
                if (response.ok) {
                    const data = await response.json();
                    setFlightNumber(data.flightNumber);
                    setDate(data.date || "2023-10-01"); // Use API-provided date or fallback
                } else {
                    throw new Error("Failed to fetch flight information");
                }
            } catch (err) {
                console.error(err);
                setError("Unable to fetch flight information.");
            }
        }

        fetchFlightInfo();
    }, []);

    // Listen for real-time runner location updates via WebSocket
    useEffect(() => {
        socket.on("runnerLocationUpdate", ({ location }) => {
            console.log("Runner location updated:", location);
            setRunnerLocation(location);
        });

        return () => {
            socket.off("runnerLocationUpdate");
        };
    }, []);

    // Listen for gate change notifications via WebSocket
    useEffect(() => {
        socket.on("gateChange", ({ gate, terminal }) => {
            console.log(`Gate changed to ${gate}, Terminal ${terminal}`);
            setGateLocation((prev) => ({
                ...prev,
                gate,
                terminal,
            }));
        });

        return () => {
            socket.off("gateChange");
        };
    }, []);

    return (
        <div className="delivery-tracking-page">
            <h1>Delivery Tracking</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="tracking-info">
                {runnerLocation && (
                    <RunnerETA runnerLocation={runnerLocation} gateLocation={gateLocation} />
                )}
            </div>
            <Map runnerLocation={runnerLocation} gateLocation={gateLocation} isRunnerView={false} />
            <button onClick={() => setShowSidebar(!showSidebar)} className="toggle-sidebar-button">
                {showSidebar ? "Hide Flight Info" : "Show Flight Info"}
            </button>
            {showSidebar && flightNumber && date && (
                <FlightInfoSidebar flightNumber={flightNumber} date={date} />
            )}
        </div>
    );
}

export default DeliveryTrackingPage;
