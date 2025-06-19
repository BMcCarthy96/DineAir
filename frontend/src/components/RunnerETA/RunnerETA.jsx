import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function RunnerETA({ runnerLocation, gateLocation }) {
    const [eta, setEta] = useState("");

    useEffect(() => {
        async function fetchETA() {
            if (!runnerLocation || !gateLocation) {
                setEta("");
                return;
            }
            try {
                const response = await fetch("/api/deliveries/calculate-eta", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({ runnerLocation, gateLocation }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error response from server:", errorData);
                    throw new Error(
                        errorData.error || "Failed to calculate ETA"
                    );
                }

                const data = await response.json();
                setEta(data.eta);
            } catch (err) {
                console.error(err);
                setEta("Unable to calculate ETA");
            }
        }
        fetchETA();
    }, [runnerLocation, gateLocation]);

    return <p>Runner ETA: {eta}</p>;
}

export default RunnerETA;
