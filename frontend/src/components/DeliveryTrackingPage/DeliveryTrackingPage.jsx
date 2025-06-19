import { useState, useEffect, useMemo, useRef } from "react";
import Map from "../Map/Map";
import RunnerETA from "../RunnerETA/RunnerETA";
import FlightInfoSidebar from "../FlightInfoSidebar/FlightInfoSidebar";
import OrderTracking from "../OrderTracking/OrderTracking";
import {
    notifyOrderStatus,
    notifyRunnerLocation,
} from "../../utils/Notifications";
import socket from "../../utils/WebSocket";
import { gateCoordinates } from "../../utils/gateCoordinates";
import "./DeliveryTrackingPage.css";

function DeliveryTrackingPage() {
    const [runnerLocation, setRunnerLocation] = useState(null);
    const [gateLocation, setGateLocation] = useState(null);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [restaurant, setRestaurant] = useState(null); // Only the actual restaurant
    const [showSidebar, setShowSidebar] = useState(false);
    const [flightNumber, setFlightNumber] = useState(null);
    const [date, setDate] = useState(null);
    const [orderStatus, setOrderStatus] = useState("");
    const [error, setError] = useState(null);
    const orderSteps = useMemo(
        () => ["Order Received", "Preparing", "On the Way", "Delivered"],
        []
    );
    const [orderStepIndex, setOrderStepIndex] = useState(0);

    // For smooth animation
    const animationRef = useRef();
    const tRef = useRef(0);

    // Fetch order and set locations
    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch("/api/orders/current");
                if (res.ok) {
                    const data = await res.json();
                    // Set gate location from stored coordinates if available, else from mapping
                    if (data.gateLat && data.gateLng) {
                        setGateLocation({
                            lat: Number(data.gateLat),
                            lng: Number(data.gateLng),
                        });
                    } else if (data.gate) {
                        setGateLocation(gateCoordinates[data.gate]);
                    }
                    // Set restaurant location if available
                    if (
                        data.Restaurant &&
                        data.Restaurant.latitude &&
                        data.Restaurant.longitude
                    ) {
                        setRestaurantLocation({
                            lat: data.Restaurant.latitude,
                            lng: data.Restaurant.longitude,
                        });
                        setRestaurant(data.Restaurant); // Save the actual restaurant object
                        setRunnerLocation({
                            lat: data.Restaurant.latitude,
                            lng: data.Restaurant.longitude,
                        });
                    }
                } else {
                    setError("Unable to fetch order information.");
                }
            } catch (err) {
                console.error(err);
                setError("Unable to fetch order information.");
            }
        }
        fetchOrder();
    }, []);

    // Smoothly animate runner marker from restaurant to gate
    useEffect(() => {
        if (
            orderSteps[orderStepIndex] === "On the Way" &&
            restaurantLocation &&
            gateLocation
        ) {
            tRef.current = 0;
            const animate = () => {
                tRef.current += 0.005; // Adjust for speed (smaller = slower)
                if (tRef.current > 1) tRef.current = 1;
                setRunnerLocation({
                    lat:
                        restaurantLocation.lat +
                        (gateLocation.lat - restaurantLocation.lat) *
                            tRef.current,
                    lng:
                        restaurantLocation.lng +
                        (gateLocation.lng - restaurantLocation.lng) *
                            tRef.current,
                });
                if (tRef.current < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                }
            };
            animationRef.current = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animationRef.current);
        } else if (
            (orderStepIndex === 0 || orderStepIndex === 1) &&
            restaurantLocation
        ) {
            // Always keep runner at restaurant for first two steps
            setRunnerLocation(restaurantLocation);
        } else if (orderStepIndex === 3 && gateLocation) {
            // On delivered, runner is at gate
            setRunnerLocation(gateLocation);
        }
    }, [orderStepIndex, orderSteps, restaurantLocation, gateLocation]);

    // Fetch flight information dynamically (if needed)
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

    // Listen for real-time runner location and order status updates via WebSocket
    useEffect(() => {
        socket.on("runnerLocationUpdate", ({ runnerId, location }) => {
            setRunnerLocation(location);
            notifyRunnerLocation(runnerId, location);
        });
        socket.on("gateChange", ({ gate }) => {
            setGateLocation(gateCoordinates[gate]);
        });
        socket.on("orderStatusUpdate", ({ status }) => {
            setOrderStatus(status);
            notifyOrderStatus(status);
        });
        return () => {
            socket.off("runnerLocationUpdate");
            socket.off("gateChange");
            socket.off("orderStatusUpdate");
        };
    }, []);

    // Simulate order status progression for demo (remove in production)
    useEffect(() => {
        if (orderStepIndex < orderSteps.length - 1) {
            const timer = setTimeout(() => {
                setOrderStepIndex(orderStepIndex + 1);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [orderStepIndex, orderSteps.length]);

    return (
        <div className="delivery-tracking-page">
            <h1>Delivery Tracking</h1>
            {error && <p className="error-message">{error}</p>}
            <OrderTracking orderStatus={orderSteps[orderStepIndex]} />
            <RunnerETA
                runnerLocation={runnerLocation}
                gateLocation={gateLocation}
            />
            {runnerLocation && gateLocation && restaurantLocation && (
                <Map
                    runnerLocation={runnerLocation}
                    gateLocation={gateLocation}
                    restaurantLocation={restaurantLocation}
                    restaurants={restaurant ? [restaurant] : []} // Only the actual restaurant
                    isRunnerView={false}
                />
            )}
            <div>
                <strong>Status:</strong> {orderStatus}
            </div>
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
