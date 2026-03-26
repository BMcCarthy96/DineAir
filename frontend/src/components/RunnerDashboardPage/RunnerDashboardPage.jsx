import { useState, useEffect } from "react";
import Map from "../Map/Map";
import socket from "../../utils/WebSocket";
import { apiFetch } from "../../utils/apiFetch";
import EmptyState from "../ui/EmptyState";
import { FaTruck } from "react-icons/fa";

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
    const [loading, setLoading] = useState(true);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [gateLocation, setGateLocation] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchDeliveries() {
            setError(null);
            try {
                const response = await apiFetch("/api/deliveries", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (!cancelled) {
                        setDeliveries(data);
                        if (data.length > 0) {
                            const order = data[0].Order;
                            setActiveOrderId(order?.id ?? null);
                            if (order?.Restaurant) {
                                setRestaurantLocation({
                                    lat: order.Restaurant.latitude,
                                    lng: order.Restaurant.longitude,
                                });
                                setRestaurant(order.Restaurant);
                            }
                            if (order?.gateLat && order?.gateLng) {
                                setGateLocation({
                                    lat: Number(order.gateLat),
                                    lng: Number(order.gateLng),
                                });
                            }
                        } else {
                            setActiveOrderId(null);
                        }
                    }
                } else {
                    if (!cancelled) setError("Could not load deliveries.");
                }
            } catch {
                if (!cancelled) setError("Could not load deliveries.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchDeliveries();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) return undefined;
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setRunnerLocation(location);
                socket.emit("runnerLocationUpdate", {
                    runnerId,
                    orderId: activeOrderId,
                    location,
                });
            },
            () => {},
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [runnerId, activeOrderId]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Runner dashboard
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Assigned drops and your live position on the map.
            </p>

            {error && (
                <p
                    className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                    role="alert"
                >
                    {error}
                </p>
            )}

            <section className="da-card mt-8 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Assigned deliveries
                </h2>
                {loading ? (
                    <p className="mt-4 text-sm text-slate-500">Loading…</p>
                ) : deliveries.length === 0 ? (
                    <div className="mt-6">
                        <EmptyState
                            icon={FaTruck}
                            title="No active deliveries"
                            description="When orders are assigned to you, they appear here."
                        />
                    </div>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {deliveries.map((delivery) => (
                            <li
                                key={delivery.id}
                                className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40"
                            >
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    Order #{delivery.Order?.id}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {delivery.Order?.Restaurant?.name}
                                </p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {delivery.status}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="mt-8">
                <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Map
                </h2>
                <Map
                    runnerLocation={runnerLocation}
                    gateLocation={gateLocation}
                    restaurantLocation={restaurantLocation}
                    restaurants={restaurant ? [restaurant] : []}
                    isRunnerView={true}
                />
            </section>
        </div>
    );
}

export default RunnerDashboardPage;
