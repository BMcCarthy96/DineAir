import { useState, useEffect } from "react";
import Map from "../Map/Map";
import socket from "../../utils/WebSocket";
import "./RunnerDashboardPage.css";

// Simulate available runner IDs (replace with real IDs from backend if needed)
const availableRunnerIds = [1, 2, 3, 4, 5];
function getRandomRunnerId() {
    return availableRunnerIds[
        Math.floor(Math.random() * availableRunnerIds.length)
    ];
}

function RunnerDashboardPage() {
    const [runnerId] = useState(getRandomRunnerId());
    const [runnerLocation, setRunnerLocation] = useState({
        lat: 33.9416,
        lng: -118.4085,
    });
    const [deliveries, setDeliveries] = useState([]);
    const [error, setError] = useState(null);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [gateLocation, setGateLocation] = useState(null);
    const [restaurant, setRestaurant] = useState(null); // Only the actual restaurant

    // Fetch assigned deliveries and the actual restaurant for the current delivery
    useEffect(() => {
        async function fetchDeliveries() {
            try {
                const response = await fetch("/api/deliveries", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDeliveries(data);
                    // Optionally set restaurant/gate locations from first delivery
                    if (data.length > 0) {
                        const order = data[0].Order;
                        if (order && order.Restaurant) {
                            setRestaurantLocation({
                                lat: order.Restaurant.latitude,
                                lng: order.Restaurant.longitude,
                            });
                            setRestaurant(order.Restaurant); // Save the actual restaurant object
                        }
                        if (order && order.gateLat && order.gateLng) {
                            setGateLocation({
                                lat: Number(order.gateLat),
                                lng: Number(order.gateLng),
                            });
                        }
                    }
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
                socket.emit("runnerLocationUpdate", { runnerId, location });
            },
            (error) => console.error("Error tracking location:", error),
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [runnerId]);

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
                                    <strong>Order ID:</strong>{" "}
                                    {delivery.Order.id}
                                </p>
                                <p>
                                    <strong>Restaurant:</strong>{" "}
                                    {delivery.Order.Restaurant?.name}
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
                <Map
                    runnerLocation={runnerLocation}
                    gateLocation={gateLocation}
                    restaurantLocation={restaurantLocation}
                    restaurants={restaurant ? [restaurant] : []} // Only the actual restaurant
                    isRunnerView={true}
                />
            </div>
        </div>
    );
}

export default RunnerDashboardPage;
