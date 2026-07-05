import { toast } from "react-toastify";
import { orderStatusLabel } from "./orderStatusLabel";

export const notifyGateChange = (gate, terminal) => {
    toast.info(`Gate updated to ${gate} (Terminal ${terminal})`, {
        position: "top-center",
    });
};

export const notifyFlightDelay = (flightNumber, delayTime) => {
    toast.warn(`Flight ${flightNumber} delayed by ${delayTime} minutes.`, {
        position: "top-center",
    });
};

let lastStatus = null;

export const notifyOrderStatus = (status) => {
    if (status !== lastStatus) {
        const message =
            status === "delivered"
                ? "🎉 Delivered! Enjoy your meal."
                : `Order status: ${orderStatusLabel(status)}`;
        toast.success(message, { position: "top-center" });
        lastStatus = status;
    }
};
