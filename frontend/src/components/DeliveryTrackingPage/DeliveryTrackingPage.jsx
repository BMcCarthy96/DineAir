import { useState, useEffect, useMemo, useRef } from "react";
import Map from "../Map/Map";
import RunnerETA from "../RunnerETA/RunnerETA";
import FlightInfoSidebar from "../FlightInfoSidebar/FlightInfoSidebar";
import OrderTracking from "../OrderTracking/OrderTracking";
import { notifyOrderStatus } from "../../utils/Notifications";
import socket from "../../utils/WebSocket";
import { gateCoordinates } from "../../utils/gateCoordinates";
import "./DeliveryTrackingPage.css";

function DeliveryTrackingPage() {
    const [gateLocation, setGateLocation] = useState(null);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
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
    const [displayedRunnerLocation, setDisplayedRunnerLocation] =
        useState(null);
    const animationFrame = useRef();
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

    // Animate runner marker based on order step
    useEffect(() => {
        if (!restaurantLocation || !gateLocation) return;

        let animating = true;

        if (orderSteps[orderStepIndex] === "On the Way") {
            tRef.current = 0;
            const animate = () => {
                if (!animating) return;
                tRef.current += 0.003; // Smaller step for smoother animation
                if (tRef.current > 1) tRef.current = 1;
                setDisplayedRunnerLocation({
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
                    animationFrame.current = requestAnimationFrame(animate);
                }
            };
            animationFrame.current = requestAnimationFrame(animate);
        } else if (orderStepIndex === 0 || orderStepIndex === 1) {
            setDisplayedRunnerLocation(restaurantLocation);
            if (animationFrame.current)
                cancelAnimationFrame(animationFrame.current);
        } else if (orderStepIndex === 3) {
            setDisplayedRunnerLocation(gateLocation);
            if (animationFrame.current)
                cancelAnimationFrame(animationFrame.current);
        }

        return () => {
            animating = false;
            if (animationFrame.current)
                cancelAnimationFrame(animationFrame.current);
        };
    }, [orderStepIndex, restaurantLocation, gateLocation, orderSteps]);

    // On mount, set initial runner location to restaurant
    useEffect(() => {
        if (restaurantLocation && !displayedRunnerLocation) {
            setDisplayedRunnerLocation(restaurantLocation);
        }
    }, [restaurantLocation, displayedRunnerLocation]);

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

    // Listen for gate and order status updates via WebSocket
    useEffect(() => {
        socket.on("gateChange", ({ gate }) => {
            setGateLocation(gateCoordinates[gate]);
        });
        socket.on("orderStatusUpdate", ({ status }) => {
            setOrderStatus(status);
            notifyOrderStatus(status);
        });
        return () => {
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
                runnerLocation={displayedRunnerLocation}
                gateLocation={gateLocation}
            />
            {displayedRunnerLocation && gateLocation && restaurantLocation && (
                <Map
                    runnerLocation={displayedRunnerLocation}
                    gateLocation={gateLocation}
                    restaurantLocation={restaurantLocation}
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
