import { useState, useEffect } from "react";
import Map from "../Map/Map";
import RunnerETA from "../RunnerETA/RunnerETA";
import FlightInfoSidebar from "../FlightInfoSidebar/FlightInfoSidebar";
import OrderTracking from "../OrderTracking/OrderTracking";
import { notifyOrderStatus } from "../../utils/Notifications";
import socket from "../../utils/WebSocket";
import "./DeliveryTrackingPage.css";

function DeliveryTrackingPage() {
    const [runnerLocation, setRunnerLocation] = useState(null);
    const [gateLocation, setGateLocation] = useState({
        lat: 37.7849,
        lng: -122.4094,
    });
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [flightNumber, setFlightNumber] = useState(null);
    const [date, setDate] = useState(null);
    const [orderStatus, setOrderStatus] = useState("");
    const [error, setError] = useState(null);
    const orderSteps = [
        "Order Received",
        "Preparing",
        "On the Way",
        "Delivered",
    ];
    const [orderStepIndex, setOrderStepIndex] = useState(0);

    useEffect(() => {
        if (orderStepIndex < orderSteps.length - 1) {
            const timer = setTimeout(() => {
                setOrderStepIndex(orderStepIndex + 1);
            }, 4000); // 4 seconds per step
            return () => clearTimeout(timer);
        }
    }, [orderStepIndex]);

    // Simulate runner movement
    function interpolatePosition(start, end, t) {
        return {
            lat: start.lat + (end.lat - start.lat) * t,
            lng: start.lng + (end.lng - start.lng) * t,
        };
    }

    useEffect(() => {
        if (restaurantLocation && gateLocation) {
            let t = 0;
            let animationFrame;
            const animateRunner = () => {
                if (orderSteps[orderStepIndex] === "On the Way") {
                    t += 0.01;
                    if (t > 1) t = 1;
                    setRunnerLocation(
                        interpolatePosition(restaurantLocation, gateLocation, t)
                    );
                    if (t < 1) {
                        animationFrame = requestAnimationFrame(animateRunner);
                    }
                } else if (orderStepIndex < 2) {
                    setRunnerLocation(restaurantLocation);
                } else if (orderStepIndex === 3) {
                    setRunnerLocation(gateLocation);
                }
            };
            animateRunner();
            return () => cancelAnimationFrame(animationFrame);
        }
    }, [orderStepIndex, restaurantLocation, gateLocation]);

    // Fetch restaurant location for the current order
    useEffect(() => {
        async function fetchRestaurantLocation() {
            try {
                const response = await fetch("/api/orders/current");
                if (response.ok) {
                    const data = await response.json();
                    const restLoc = {
                        lat: data.restaurant.latitude,
                        lng: data.restaurant.longitude,
                    };
                    setRestaurantLocation(restLoc);
                    setRunnerLocation(restLoc);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchRestaurantLocation();
    }, []);

    // Fetch all restaurants for airport map markers
    useEffect(() => {
        fetch("/api/restaurants")
            .then((res) => res.json())
            .then(setRestaurants)
            .catch((err) => console.error("Failed to fetch restaurants:", err));
    }, []);

    // Fetch flight information dynamically
    useEffect(() => {
        async function fetchFlightInfo() {
            try {
                const response = await fetch(
                    "/api/flights?flightNumber=DL123&date=2023-10-01"
                );
                if (response.ok) {
                    const data = await response.json();
                    setFlightNumber(data.flightNumber);
                    setDate(data.date || "2023-10-01");
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
            setRunnerLocation(location);
        });

        return () => {
            socket.off("runnerLocationUpdate");
        };
    }, []);

    // Listen for gate change notifications via WebSocket
    useEffect(() => {
        socket.on("gateChange", ({ gate, terminal }) => {
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

    // Listen for order status updates via WebSocket
    useEffect(() => {
        socket.on("orderStatusUpdate", ({ status }) => {
            setOrderStatus(status);
            notifyOrderStatus(status);
        });

        return () => {
            socket.off("orderStatusUpdate");
        };
    }, []);

    return (
        <div className="delivery-tracking-page">
            <h1>Delivery Tracking</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="tracking-info">
                {runnerLocation && (
                    <RunnerETA
                        runnerLocation={runnerLocation}
                        gateLocation={gateLocation}
                    />
                )}
                <OrderTracking orderStatus={orderSteps[orderStepIndex]} />
                {orderStatus && (
                    <p className="order-status">Order Status: {orderStatus}</p>
                )}
            </div>
            <Map
                runnerLocation={runnerLocation}
                gateLocation={gateLocation}
                restaurantLocation={restaurantLocation}
                restaurants={restaurants}
            />
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="toggle-sidebar-button"
            >
                {showSidebar ? "Hide Flight Info" : "Show Flight Info"}
            </button>
            {showSidebar && flightNumber && date && (
                <FlightInfoSidebar flightNumber={flightNumber} date={date} />
            )}
        </div>
    );
}

export default DeliveryTrackingPage;
