import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Notify gate change
export const notifyGateChange = (gate, terminal) => {
    toast.info(`Gate changed to ${gate}, Terminal ${terminal}`, {
        position: toast.POSITION.TOP_CENTER,
    });
};

// Notify flight delay
export const notifyFlightDelay = (flightNumber, delayTime) => {
    toast.warn(`Flight ${flightNumber} delayed by ${delayTime} minutes.`, {
        position: toast.POSITION.TOP_CENTER,
    });
};

// Notify order status update
export const notifyOrderStatus = (status) => {
    toast.success(`Order status updated: ${status}`, {
        position: toast.POSITION.TOP_CENTER,
    });
};

console.log(toast.POSITION); // Log the POSITION object

// Notify runner location update
export const notifyRunnerLocation = () => {
    toast.info("Runner is on the way!", {
        position: "top-center",
    });
};
