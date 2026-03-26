import { useEffect, useRef, useState } from "react";
import { haversineMeters, lerpLatLng } from "../utils/geo";
import { trackingLog, trackingWarn } from "../utils/trackingLog";

/** How often React state syncs from the internal smooth loop (marker still feels smooth). */
const DISPLAY_FLUSH_MS = 90;

function easePathT(t) {
    const c = Math.min(1, Math.max(0, t));
    return 1 - (1 - c) ** 1.15;
}

function isDbTravelStatus(s) {
    return s === "picked_up" || s === "on_the_way";
}

/**
 * @param {{
 *   orderId: number | null,
 *   socket: import("socket.io-client").Socket,
 *   restaurantLocation: { lat: number, lng: number } | null,
 *   gateLocation: { lat: number, lng: number } | null,
 *   orderStatus: string | null,
 *   orderDbStatus: string | null,
 *   runnerMapProgress: number,
 * }} opts
 */
export function useLiveRunnerTracking({
    orderId,
    socket,
    restaurantLocation,
    gateLocation,
    orderStatus,
    orderDbStatus,
    runnerMapProgress,
}) {
    const [connectionMode, setConnectionMode] = useState("connecting");
    const [displayedLocation, setDisplayedLocation] = useState(null);

    const targetRef = useRef(null);
    const displayedRef = useRef(null);
    const joinedRef = useRef(false);
    /** Coalesce noisy GPS / duplicate socket payloads */
    const lastSocketSampleRef = useRef(null);
    const lastSocketSampleAtRef = useRef(0);

    const travelActive =
        orderStatus === "picked_up" || orderStatus === "on_the_way";

    /** Server sim may lead the demo clock; use socket only in that narrow window. */
    const socketDrivesPosition =
        travelActive &&
        isDbTravelStatus(orderDbStatus) &&
        runnerMapProgress < 0.02;

    useEffect(() => {
        if (orderId == null) {
            setConnectionMode("fallback");
            return;
        }
        setConnectionMode("connecting");
    }, [orderId]);

    useEffect(() => {
        if (orderId == null) return undefined;
        const t = setTimeout(() => {
            setConnectionMode((m) => (m === "connecting" ? "fallback" : m));
        }, 5000);
        return () => clearTimeout(t);
    }, [orderId]);

    /** Socket subscription — single effect, named handlers, full cleanup (incl. socket.once leak). */
    useEffect(() => {
        if (!orderId || !socket || !restaurantLocation || !gateLocation) {
            return undefined;
        }

        const runJoin = () => {
            socket.emit("joinTracking", { orderId }, (ack) => {
                if (ack?.ok) {
                    joinedRef.current = true;
                    setConnectionMode("live");
                    trackingLog("subscribed order id", orderId);
                } else {
                    setConnectionMode("fallback");
                    trackingWarn("joinTracking failed — fallback", ack);
                }
            });
        };

        const onUpdate = (payload) => {
            if (payload?.orderId !== orderId || !payload?.location) return;
            if (!travelActive) return;
            // Demo timeline + runnerMapProgress drive the marker once "On the Way" by time.
            if (!socketDrivesPosition) return;
            const next = {
                lat: Number(payload.location.lat),
                lng: Number(payload.location.lng),
            };
            const now = Date.now();
            const prev = lastSocketSampleRef.current;
            if (prev) {
                const d = haversineMeters(prev, next);
                if (d < 2.5 && now - lastSocketSampleAtRef.current < 900) {
                    return;
                }
            }
            lastSocketSampleRef.current = next;
            lastSocketSampleAtRef.current = now;
            targetRef.current = next;
            trackingLog("runner coordinates", {
                orderId,
                source: payload.source,
                lat: next.lat.toFixed(5),
                lng: next.lng.toFixed(5),
            });
        };

        const onConnect = () => {
            trackingLog("socket connection");
            runJoin();
        };
        const onDisconnect = () => {
            setConnectionMode("fallback");
            trackingWarn("socket disconnect — fallback active");
        };
        const onConnectError = () => {
            setConnectionMode("fallback");
            trackingWarn("socket connect_error — fallback active");
        };

        socket.on("runnerLocationUpdate", onUpdate);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);

        if (socket.connected) {
            runJoin();
        }

        return () => {
            socket.off("runnerLocationUpdate", onUpdate);
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            if (joinedRef.current && orderId) {
                socket.emit("leaveTracking", { orderId });
                joinedRef.current = false;
                trackingLog("unsubscribed order id", orderId);
            }
        };
    }, [
        orderId,
        socket,
        restaurantLocation,
        gateLocation,
        travelActive,
        socketDrivesPosition,
    ]);

    /** Smooth loop: update refs every frame; flush to React on DISPLAY_FLUSH_MS cadence. */
    useEffect(() => {
        let raf = 0;
        let lastFlush = performance.now();

        const step = () => {
            const target = targetRef.current;
            if (target) {
                const prev = displayedRef.current;
                if (!prev) {
                    displayedRef.current = { ...target };
                } else {
                    const d = haversineMeters(prev, target);
                    if (d < 1.2) {
                        displayedRef.current = { ...target };
                    } else {
                        const blend = Math.min(0.2, Math.max(0.05, d / 380));
                        displayedRef.current = lerpLatLng(prev, target, blend);
                    }
                }
            }

            const now = performance.now();
            if (
                displayedRef.current &&
                now - lastFlush >= DISPLAY_FLUSH_MS
            ) {
                lastFlush = now;
                setDisplayedLocation({ ...displayedRef.current });
            }

            raf = requestAnimationFrame(step);
        };

        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        if (restaurantLocation && displayedRef.current == null) {
            displayedRef.current = { ...restaurantLocation };
            targetRef.current = { ...restaurantLocation };
            setDisplayedLocation({ ...restaurantLocation });
        }
    }, [restaurantLocation]);

    /**
     * Single demo-aligned path: restaurant → gate by runnerMapProgress (same anchor as status).
     * When socketDrivesPosition is true, onUpdate sets targetRef instead.
     */
    useEffect(() => {
        if (!restaurantLocation || !gateLocation) return;
        if (socketDrivesPosition) return;

        const p = easePathT(runnerMapProgress);
        const lat =
            restaurantLocation.lat +
            (gateLocation.lat - restaurantLocation.lat) * p;
        const lng =
            restaurantLocation.lng +
            (gateLocation.lng - restaurantLocation.lng) * p;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        targetRef.current = { lat, lng };
    }, [
        runnerMapProgress,
        restaurantLocation,
        gateLocation,
        socketDrivesPosition,
    ]);

    /** Delivered: ensure gate snap if progress math ever lags. */
    useEffect(() => {
        if (orderStatus !== "delivered" || !gateLocation) return;
        const g = {
            lat: Number(gateLocation.lat),
            lng: Number(gateLocation.lng),
        };
        if (!Number.isFinite(g.lat) || !Number.isFinite(g.lng)) return;
        targetRef.current = { ...g };
        displayedRef.current = { ...g };
        setDisplayedLocation({ ...g });
    }, [orderStatus, gateLocation]);

    return {
        runnerLocation: displayedLocation,
        connectionMode,
        isLive: connectionMode === "live",
    };
}
