import { io } from "socket.io-client";
import {
    notifyGateChange,
    notifyFlightDelay,
    notifyOrderStatus,
    notifyRunnerLocation,
} from "./Notifications";

const socket = io("http://localhost:8000");

// Handle gate change notifications
socket.on("gateChange", ({ gate, terminal }) => {
    notifyGateChange(gate, terminal);
});

// Handle flight delay notifications
socket.on("flightDelay", ({ flightNumber, delayTime }) => {
    notifyFlightDelay(flightNumber, delayTime);
});

// Listen for runner location updates
socket.on("runnerLocationUpdate", ({ runnerId, location }) => {
    console.log(`Runner ${runnerId} location updated:`, location);
    notifyRunnerLocation();
});

// Listen for order status updates
socket.on("orderStatusUpdate", ({ orderId, status }) => {
    console.log(`Order ${orderId} status updated: ${status}`);
    notifyOrderStatus(status);
});

export default socket;
