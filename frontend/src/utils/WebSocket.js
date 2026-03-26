import { io } from "socket.io-client";
import {
    notifyGateChange,
    notifyFlightDelay,
    notifyOrderStatus,
    // notifyRunnerLocation,
} from "./Notifications";
import { trackingLog, trackingWarn } from "./trackingLog";

// Use relative URL in production, localhost in development
const backendUrl =
    import.meta.env.MODE === "production"
        ? undefined // relative, same origin as frontend
        : "http://localhost:8000";

const socket = io(backendUrl, {
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
