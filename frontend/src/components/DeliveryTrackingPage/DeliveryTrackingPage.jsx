import { useState, useEffect } from "react";
import Map from "../Map/Map";
import RunnerETA from "../RunnerETA/RunnerETA";
import socket from "../../utils/WebSocket";
import "./DeliveryTrackingPage.css";

function DeliveryTrackingPage() {
    const [runnerLocation, setRunnerLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Initial mock location
    const [gateLocation, setGateLocation] = useState({ lat: 37.7849, lng: -122.4094 }); // Initial mock gate location
    const [error, setError] = useState(null);

    // Fetch the runner's location when the component mounts
    useEffect(() => {
        async function fetchRunnerLocation() {
            try {
                const response = await fetch("/api/deliveries/runner-location");
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

    // Listen for gate change events via WebSocket
    useEffect(() => {
        socket.on("gateChange", ({ gate, terminal }) => {
            console.log(`Gate changed to ${gate}, Terminal ${terminal}`); // Debugging
            setGateLocation((prevLocation) => ({
                ...prevLocation,
                gate,
                terminal,
            }));
        });

        return () => {
            socket.off("gateChange");
        };
    }, []);

    // Listen for runner location updates via WebSocket
    useEffect(() => {
        socket.on("runnerLocationUpdate", ({ location }) => {
            console.log("Runner location updated:", location); // Debugging
            setRunnerLocation(location);
        });

        return () => {
            socket.off("runnerLocationUpdate");
        };
    }, []);

    return (
        <div className="delivery-tracking-page">
            <h1>Delivery Tracking</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="tracking-info">
                <RunnerETA runnerLocation={runnerLocation} gateLocation={gateLocation} />
            </div>
            <Map runnerLocation={runnerLocation} gateLocation={gateLocation} isRunnerView={false} />
        </div>
    );
}

export default DeliveryTrackingPage;
