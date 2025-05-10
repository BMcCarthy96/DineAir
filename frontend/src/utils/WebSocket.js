import { io } from "socket.io-client";
import { notifyGateChange } from "./Notifications";

const socket = io("http://localhost:8000");

socket.on("gateChange", ({ gate, terminal }) => {
    notifyGateChange(gate, terminal);
});

export default socket;
