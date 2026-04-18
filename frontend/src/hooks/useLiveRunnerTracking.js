import { useEffect, useRef, useState } from "react";
import { normalizeLatLng } from "../utils/coordinates";
import { haversineMeters, lerpLatLng } from "../utils/geo";
import { trackingLog, trackingWarn } from "../utils/trackingLog";

/** How often React state syncs from the internal smooth loop (marker still feels smooth). */
const DISPLAY_FLUSH_MS = 90;
/** If no meaningful socket coordinate update in this window, demo movement takes over. */
const SOCKET_STALE_MS = 3000;
const SOCKET_MEANINGFUL_MOVE_M = 2.5;

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
    const lastSocketSeenAtRef = useRef(0);
    const lastSocketMeaningfulAtRef = useRef(0);

    const travelActive =
        orderStatus === "picked_up" || orderStatus === "on_the_way";

    /** Server sim may lead the demo clock; use socket only in that narrow window. */
    const socketDrivesPosition =
        travelActive &&
        isDbTravelStatus(orderDbStatus) &&
        runnerMapProgress < 0.02;
    const socketMsSinceLast =
        lastSocketMeaningfulAtRef.current > 0
            ? Date.now() - lastSocketMeaningfulAtRef.current
            : Number.POSITIVE_INFINITY;
    const socketHealthy = socketDrivesPosition && socketMsSinceLast <= SOCKET_STALE_MS;
    const movementSource = socketHealthy ? "socket" : "demo";
    const socketMsSinceSeen =
        lastSocketSeenAtRef.current > 0
            ? Date.now() - lastSocketSeenAtRef.current
            : Number.POSITIVE_INFINITY;

    useEffect(() => {
        if (!import.meta.env.DEV || orderId == null) return;
        trackingLog("runner movement mode", {
            orderId,
            orderStatus,
            orderDbStatus,
            runnerMapProgress: Number(runnerMapProgress.toFixed(3)),
            travelActive,
            socketDrivesPosition,
            socketHealthy,
            movementSource,
            lastSocketMeaningfulMsAgo:
                Number.isFinite(socketMsSinceLast) && socketMsSinceLast < 1e9
                    ? Math.round(socketMsSinceLast)
                    : null,
            lastSocketSeenMsAgo:
                Number.isFinite(socketMsSinceSeen) && socketMsSinceSeen < 1e9
                    ? Math.round(socketMsSinceSeen)
                    : null,
        });
    }, [
        orderId,
        orderStatus,
        orderDbStatus,
        runnerMapProgress,
        travelActive,
        socketDrivesPosition,
        socketHealthy,
        movementSource,
        socketMsSinceLast,
        socketMsSinceSeen,
    ]);

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
        if (orderId == null || !socket || !restaurantLocation || !gateLocation) {
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
            // Socket is an enhancement only in the early travel window.
            if (!socketDrivesPosition) return;
            const next = normalizeLatLng(payload.location);
            if (!next) return;
            const now = Date.now();
            lastSocketSeenAtRef.current = now;
            const prev = lastSocketSampleRef.current;
            let movedMeters = Number.POSITIVE_INFINITY;
            if (prev) {
                movedMeters = haversineMeters(prev, next);
                // Repeated stale samples should not keep socket in control.
                if (movedMeters < SOCKET_MEANINGFUL_MOVE_M) {
                    trackingLog("socket sample stale — demo fallback eligible", {
                        orderId,
                        movedMeters: Number(movedMeters.toFixed(2)),
                        msSinceMeaningful:
                            lastSocketMeaningfulAtRef.current > 0
                                ? now - lastSocketMeaningfulAtRef.current
                                : null,
                    });
                    return;
                }
            }
            lastSocketSampleRef.current = next;
            lastSocketMeaningfulAtRef.current = now;
            targetRef.current = next;
            trackingLog("runner coordinates", {
                orderId,
                source: payload.source,
                lat: next.lat.toFixed(5),
                lng: next.lng.toFixed(5),
                movedMeters:
                    Number.isFinite(movedMeters) && movedMeters < 1e8
                        ? Number(movedMeters.toFixed(2))
                        : null,
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
            const target = normalizeLatLng(targetRef.current);
            if (target) {
                const prev = displayedRef.current;
                if (!prev) {
                    displayedRef.current = { ...target };
                } else {
                    const prevSafe = normalizeLatLng(prev);
                    if (!prevSafe) {
                        displayedRef.current = { ...target };
                    } else {
                        const d = haversineMeters(prevSafe, target);
                        if (d < 1.2) {
                            displayedRef.current = { ...target };
                        } else {
                            const blend = Math.min(0.2, Math.max(0.05, d / 380));
                            displayedRef.current = lerpLatLng(prevSafe, target, blend);
                        }
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
        const r = normalizeLatLng(restaurantLocation);
        if (!r || displayedRef.current != null) return;
        displayedRef.current = { ...r };
        targetRef.current = { ...r };
        setDisplayedLocation({ ...r });
    }, [restaurantLocation]);

    /**
     * Single demo-aligned path: restaurant → gate by runnerMapProgress (same anchor as status).
     * Socket may override briefly when healthy, but demo always remains the fallback driver.
     */
    useEffect(() => {
        const r = normalizeLatLng(restaurantLocation);
        const g = normalizeLatLng(gateLocation);
        if (!r || !g) return;
        if (socketHealthy) return;

        const p = easePathT(runnerMapProgress);
        const lat = r.lat + (g.lat - r.lat) * p;
        const lng = r.lng + (g.lng - r.lng) * p;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        targetRef.current = { lat, lng };
        if (import.meta.env.DEV) {
            trackingLog("runner path interpolation", {
                orderId,
                t: Number(runnerMapProgress.toFixed(3)),
                easedT: Number(p.toFixed(3)),
                lat: Number(lat.toFixed(5)),
                lng: Number(lng.toFixed(5)),
            });
        }
    }, [
        orderId,
        runnerMapProgress,
        restaurantLocation,
        gateLocation,
        socketHealthy,
    ]);

    useEffect(() => {
        if (!import.meta.env.DEV || orderId == null || !displayedLocation) return;
        trackingLog("runnerLocation emitted to map", {
            orderId,
            source: movementSource,
            lat: Number(displayedLocation.lat.toFixed(5)),
            lng: Number(displayedLocation.lng.toFixed(5)),
        });
    }, [orderId, displayedLocation, movementSource]);

    /** Delivered: ensure gate snap if progress math ever lags. */
    useEffect(() => {
        if (orderStatus !== "delivered") return;
        const g = normalizeLatLng(gateLocation);
        if (!g) return;
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
