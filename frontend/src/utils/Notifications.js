import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifyGateChange = (gate, terminal) => {
    toast.info(`Gate changed to ${gate}, Terminal ${terminal}`, {
        position: toast.POSITION.TOP_CENTER,
    });
};
