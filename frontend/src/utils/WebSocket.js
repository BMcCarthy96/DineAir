import { io } from "socket.io-client";
import {
    notifyGateChange,
    notifyFlightDelay,
    notifyOrderStatus,
    // notifyRunnerLocation,
} from "./Notifications";
import { trackingLog, trackingWarn } from "./trackingLog";
import { getApiBaseUrl } from "./apiBaseUrl";

/**
 * Same host as API: set VITE_API_BASE_URL when the frontend is static on a different origin than the API (Render).
 * Omit for same-origin builds (single service).
 */
const socketOrigin =
    import.meta.env.MODE === "production"
        ? getApiBaseUrl() || undefined
        : "http://localhost:8000";

const socket = io(socketOrigin, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
});

if (import.meta.env.DEV) {
    socket.on("connect", () => {
        trackingLog("socket.io connected", { socketId: socket.id });
    });
    socket.on("connect_error", (err) => {
        trackingWarn("socket.io connect_error", err?.message || String(err));
    });
    socket.on("reconnect_attempt", (attempt) => {
        trackingLog("socket.io reconnect attempt", attempt);
    });
    socket.on("reconnect", (attempt) => {
        trackingLog("socket.io reconnected", { attempt });
    });
    socket.on("reconnect_failed", () => {
        trackingWarn(
            "socket.io reconnect stopped after max attempts — realtime unavailable"
        );
    });
} else {
    socket.on("connect", () => {
        console.info("[DineAir] socket connected", { id: socket.id });
    });
    socket.on("connect_error", (err) => {
        console.warn("[DineAir] socket connect_error", {
            message: err?.message || String(err),
            url: socketOrigin ?? "(same-origin)",
        });
    });
}

// Handle gate change notifications
socket.on("gateChange", ({ gate, terminal }) => {
    notifyGateChange(gate, terminal);
});

// Handle flight delay notifications
socket.on("flightDelay", ({ flightNumber, delayTime }) => {
    notifyFlightDelay(flightNumber, delayTime);
});

// Listen for runner location updates
// socket.on("runnerLocationUpdate", ({ runnerId, location }) => {
//     console.log(`Runner ${runnerId} location updated:`, location);
//     notifyRunnerLocation();
// });

// Listen for order status updates
socket.on("orderStatusUpdate", ({ orderId, status }) => {
    trackingLog("order status push", { orderId, status });
    notifyOrderStatus(status);
});

export default socket;
