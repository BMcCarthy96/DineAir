import { io } from "socket.io-client";
import { notifyGateChange, notifyFlightDelay } from "./Notifications";

const socket = io("http://localhost:8000");

// Handle gate change notifications
socket.on("gateChange", ({ gate, terminal }) => {
    notifyGateChange(gate, terminal);
});

// Handle flight delay notifications
socket.on("flightDelay", ({ flightNumber, delayTime }) => {
    notifyFlightDelay(flightNumber, delayTime);
});

export default socket;
