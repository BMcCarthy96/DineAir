import { useState, useEffect } from "react";
import Map from "../Map/Map";
import socket from "../../utils/WebSocket";
import "./RunnerDashboardPage.css";

function RunnerDashboardPage() {
    const [runnerLocation, setRunnerLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Initial mock location
    const [deliveries, setDeliveries] = useState([]);
    const [error, setError] = useState(null);

    // Fetch assigned deliveries when the component mounts
    useEffect(() => {
        async function fetchDeliveries() {
            try {
                const response = await fetch("/api/deliveries", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDeliveries(data);
                } else {
                    throw new Error("Failed to fetch deliveries");
                }
            } catch (err) {
                console.error(err);
                setError("Unable to fetch deliveries.");
            }
        }

        fetchDeliveries();
    }, []);

    // Track runner's location using Geolocation API
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setRunnerLocation(location);

                // Send updated location to the server
                socket.emit("runnerLocationUpdate", { runnerId: 1, location });
            },
            (error) => console.error("Error tracking location:", error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div className="runner-dashboard-page">
            <h1>Runner Dashboard</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="deliveries">
                <h2>Assigned Deliveries</h2>
                {deliveries.length === 0 ? (
                    <p>No deliveries assigned.</p>
                ) : (
                    <ul>
                        {deliveries.map((delivery) => (
                            <li key={delivery.id}>
                                <p>
                                    <strong>Order ID:</strong> {delivery.Order.id}
                                </p>
                                <p>
                                    <strong>Restaurant:</strong> {delivery.Order.Restaurant.name}
                                </p>
                                <p>
                                    <strong>Status:</strong> {delivery.status}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="runner-map">
                <h2>Your Location</h2>
                <Map runnerLocation={runnerLocation} gateLocation={null} isRunnerView={true} />
            </div>
        </div>
    );
}

export default RunnerDashboardPage;
