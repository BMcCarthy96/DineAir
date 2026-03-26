import { useState, useEffect, useMemo, useRef } from "react";
import Map from "../Map/Map";
import RunnerETA from "../RunnerETA/RunnerETA";
import FlightInfoSidebar from "../FlightInfoSidebar/FlightInfoSidebar";
import OrderTracking from "../OrderTracking/OrderTracking";
import { notifyOrderStatus } from "../../utils/Notifications";
import socket from "../../utils/WebSocket";
import { gateCoordinates } from "../../utils/gateCoordinates";
import { apiFetch } from "../../utils/apiFetch";
import { FaLocationDot } from "react-icons/fa6";

function DeliveryTrackingPage() {
    const [gateLocation, setGateLocation] = useState(null);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [flightNumber, setFlightNumber] = useState(null);
    const [date, setDate] = useState(null);
    const [orderStatus, setOrderStatus] = useState("");
    const [orderError, setOrderError] = useState(null);
    const [flightError, setFlightError] = useState(null);
    const [deliveryGate, setDeliveryGate] = useState(null);
    const orderSteps = useMemo(
        () => ["Order Received", "Preparing", "On the Way", "Delivered"],
        []
    );
    const [orderStepIndex, setOrderStepIndex] = useState(0);

    const [displayedRunnerLocation, setDisplayedRunnerLocation] =
        useState(null);
    const animationFrame = useRef();
    const tRef = useRef(0);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await apiFetch("/api/orders/current");
                if (res.ok) {
                    const data = await res.json();
                    if (data.gate) setDeliveryGate(data.gate);
                    if (data.gateLat && data.gateLng) {
                        setGateLocation({
                            lat: Number(data.gateLat),
                            lng: Number(data.gateLng),
                        });
                    } else if (data.gate) {
                        setGateLocation(gateCoordinates[data.gate]);
                    }
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
                    setOrderError("No active order to track right now.");
                }
            } catch (err) {
                console.error(err);
                setOrderError("Unable to fetch order information.");
            }
        }
        fetchOrder();
    }, []);

    useEffect(() => {
        if (!restaurantLocation || !gateLocation) return;

        let animating = true;

        if (orderSteps[orderStepIndex] === "On the Way") {
            tRef.current = 0;
            const animate = () => {
                if (!animating) return;
                tRef.current += 0.003;
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

    useEffect(() => {
        if (restaurantLocation && !displayedRunnerLocation) {
            setDisplayedRunnerLocation(restaurantLocation);
        }
    }, [restaurantLocation, displayedRunnerLocation]);

    useEffect(() => {
        async function fetchFlightInfo() {
            try {
                const response = await apiFetch(
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
                setFlightError("Unable to fetch flight information.");
            }
        }
        fetchFlightInfo();
    }, []);

    useEffect(() => {
        socket.on("gateChange", ({ gate }) => {
            setGateLocation(gateCoordinates[gate]);
            if (gate) setDeliveryGate(gate);
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

    useEffect(() => {
        if (orderStepIndex < orderSteps.length - 1) {
            const timer = setTimeout(() => {
                setOrderStepIndex(orderStepIndex + 1);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [orderStepIndex, orderSteps.length]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Live delivery
                    </h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Follow your runner from kitchen to gate.
                    </p>
                </div>
                {deliveryGate && (
                    <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                            <FaLocationDot className="h-5 w-5" aria-hidden />
                        </span>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Delivering to
                            </p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                Gate {deliveryGate}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {orderError && (
                <div
                    className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                    role="alert"
                >
                    {orderError}
                </div>
            )}

            <section className="da-card mb-8 p-6 sm:p-8">
                <h2 className="sr-only">Order status</h2>
                <OrderTracking orderStatus={orderSteps[orderStepIndex]} />
            </section>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">
                <div className="da-card p-6">
                    <RunnerETA
                        runnerLocation={displayedRunnerLocation}
                        gateLocation={gateLocation}
                    />
                    {orderStatus ? (
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-900 dark:text-white">
                                Socket status:
                            </span>{" "}
                            {orderStatus}
                        </p>
                    ) : null}
                </div>
                <div className="flex flex-col justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="da-btn-secondary w-full sm:w-auto"
                    >
                        {showSidebar ? "Hide flight info" : "Show flight info"}
                    </button>
                    {flightError && (
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            {flightError}
                        </p>
                    )}
                    {showSidebar && flightNumber && date && (
                        <FlightInfoSidebar
                            flightNumber={flightNumber}
                            date={date}
                        />
                    )}
                </div>
            </div>

            {displayedRunnerLocation && gateLocation && restaurantLocation && (
                <section className="da-card overflow-hidden p-2 sm:p-4">
                    <h2 className="sr-only">Map</h2>
                    <Map
                        runnerLocation={displayedRunnerLocation}
                        gateLocation={gateLocation}
                        restaurantLocation={restaurantLocation}
                        isRunnerView={false}
                    />
                </section>
            )}
        </div>
    );
}

export default DeliveryTrackingPage;
