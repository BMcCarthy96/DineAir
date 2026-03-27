import { useState, useEffect } from "react";
import { trackingLog } from "../../utils/trackingLog";
import Map from "../Map/Map";
import RunnerETA from "../RunnerETA/RunnerETA";
import FlightInfoSidebar from "../FlightInfoSidebar/FlightInfoSidebar";
import OrderTracking from "../OrderTracking/OrderTracking";
import { notifyOrderStatus } from "../../utils/Notifications";
import socket from "../../utils/WebSocket";
import { gateCoordinates } from "../../utils/gateCoordinates";
import { apiFetch } from "../../utils/apiFetch";
import { normalizeLatLng } from "../../utils/coordinates";
import { FaLocationDot } from "react-icons/fa6";
import { useLiveRunnerTracking } from "../../hooks/useLiveRunnerTracking";
import { useTrackingDemoProgress } from "../../hooks/useTrackingDemoProgress";

function dbStatusToUiLabel(status) {
    const m = {
        pending: "Order Received",
        preparing: "Preparing",
        picked_up: "On the Way",
        on_the_way: "On the Way",
        delivered: "Delivered",
    };
    return m[status] ?? "Order Received";
}

function DeliveryTrackingPage() {
    const [gateLocation, setGateLocation] = useState(null);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [flightNumber, setFlightNumber] = useState(null);
    const [date, setDate] = useState(null);
    const [orderError, setOrderError] = useState(null);
    const [flightError, setFlightError] = useState(null);
    const [deliveryGate, setDeliveryGate] = useState(null);
    const [orderId, setOrderId] = useState(null);
    /** Server/socket truth (DB). Demo timeline merges on top for portfolio progression. */
    const [orderDbStatus, setOrderDbStatus] = useState(null);

    const { effectiveStatus, demoStatus, runnerMapProgress } =
        useTrackingDemoProgress(orderId, orderDbStatus);

    /** Derived each render from effectiveStatus only (no separate memoized label state). */
    const uiOrderStatus = dbStatusToUiLabel(effectiveStatus);

    useEffect(() => {
        if (!import.meta.env.DEV) return;
        trackingLog("status pipeline (visible chip + timeline)", {
            serverStatus: orderDbStatus,
            demoStatus,
            effectiveStatus,
            uiOrderStatus,
            orderTrackingGets: effectiveStatus,
        });
    }, [orderDbStatus, demoStatus, effectiveStatus, uiOrderStatus]);

    const { runnerLocation, connectionMode, isLive } = useLiveRunnerTracking({
        orderId,
        socket,
        restaurantLocation,
        gateLocation,
        orderStatus: effectiveStatus,
        orderDbStatus,
        runnerMapProgress,
    });

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await apiFetch("/api/orders/current");
                if (res.ok) {
                    const data = await res.json();
                    if (data.id != null) setOrderId(data.id);
                    if (data.status) setOrderDbStatus(data.status);
                    if (data.gate) setDeliveryGate(data.gate);
                    const gateFromApi = normalizeLatLng({
                        lat: data.gateLat,
                        lng: data.gateLng,
                    });
                    const gateFromCode =
                        data.gate && gateCoordinates[data.gate]
                            ? normalizeLatLng(gateCoordinates[data.gate])
                            : null;
                    const gateResolved = gateFromApi || gateFromCode;
                    if (gateResolved) setGateLocation(gateResolved);
                    const restResolved = normalizeLatLng({
                        lat: data.Restaurant?.latitude,
                        lng: data.Restaurant?.longitude,
                    });
                    if (restResolved) setRestaurantLocation(restResolved);
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
        const onGate = ({ gate }) => {
            setGateLocation(gateCoordinates[gate]);
            if (gate) setDeliveryGate(gate);
        };
        const onOrderStatus = ({ status }) => {
            if (status) setOrderDbStatus(status);
            notifyOrderStatus(status);
        };
        socket.on("gateChange", onGate);
        socket.on("orderStatusUpdate", onOrderStatus);
        return () => {
            socket.off("gateChange", onGate);
            socket.off("orderStatusUpdate", onOrderStatus);
        };
    }, []);

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
                <div className="flex w-full flex-col items-stretch gap-3 sm:max-w-md sm:items-end">
                    {deliveryGate && (
                        <div className="da-card inline-flex items-center gap-3 self-start px-4 py-3 shadow-soft">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                                <FaLocationDot className="h-5 w-5" aria-hidden />
                            </span>
                            <div className="min-w-0 text-left">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Delivering to
                                </p>
                                <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                    Gate {deliveryGate}
                                </p>
                            </div>
                        </div>
                    )}
                    <div
                        className="da-card flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 text-xs font-medium shadow-soft"
                        aria-live="polite"
                    >
                        {isLive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/10 px-3 py-1 text-brand-800 dark:bg-brand-500/15 dark:text-brand-200">
                                <span
                                    className="h-2 w-2 animate-pulse rounded-full bg-brand-600 dark:bg-brand-400"
                                    aria-hidden
                                />
                                Live
                            </span>
                        ) : connectionMode === "connecting" ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Connecting…
                            </span>
                        ) : (
                            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-900 dark:text-amber-100">
                                Tracking offline
                            </span>
                        )}
                        <span className="text-slate-600 dark:text-slate-400">
                            <span className="text-slate-400 dark:text-slate-500">
                                Status:{" "}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {uiOrderStatus}
                            </span>
                        </span>
                    </div>
                </div>
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
                <OrderTracking effectiveStatus={effectiveStatus} />
            </section>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">
                <div className="da-card p-6">
                    <RunnerETA
                        runnerLocation={runnerLocation}
                        gateLocation={gateLocation}
                        effectiveStatus={effectiveStatus}
                    />
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

            {/* Mount map as soon as gate + restaurant are known; runner can arrive after (avoids late mount / zero-size gray map in prod). */}
            {gateLocation && restaurantLocation && (
                <section className="da-card overflow-hidden p-2 sm:p-4">
                    <h2 className="sr-only">Map</h2>
                    <Map
                        runnerLocation={runnerLocation}
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
