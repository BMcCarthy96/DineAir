import { toast } from "react-toastify";

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
        toast.success(`Order status: ${status}`, {
            position: "top-center",
        });
        lastStatus = status;
    }
};

export const notifyRunnerLocation = () => {
    toast.info("Runner is on the way!", {
        position: "top-center",
    });
};
