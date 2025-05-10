import { useState, useEffect } from "react";

function RunnerETA({ runnerLocation, gateLocation }) {
    const [eta, setEta] = useState("");

    useEffect(() => {
        async function fetchETA() {
            const response = await fetch("/api/deliveries/calculate-eta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ runnerLocation, gateLocation }),
            });

            const data = await response.json();
            setEta(data.eta);
        }

        fetchETA();
    }, [runnerLocation, gateLocation]);

    return <p>Runner ETA: {eta}</p>;
}

export default RunnerETA;
