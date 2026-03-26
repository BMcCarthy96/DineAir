import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { apiFetch } from "../../utils/apiFetch";

function RunnerETA({ runnerLocation, gateLocation }) {
    const [eta, setEta] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchETA() {
            if (!runnerLocation || !gateLocation) {
                setEta("");
                setError(false);
                return;
            }
            try {
                const response = await apiFetch(
                    "/api/deliveries/calculate-eta",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                            "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                        },
                        body: JSON.stringify({
                            runnerLocation,
                            gateLocation,
                        }),
                    }
                );

                if (!response.ok) {
                    setError(true);
                    setEta("ETA unavailable");
                    return;
                }

                const data = await response.json();
                setEta(data.eta || "");
                setError(false);
            } catch {
                setError(true);
                setEta("ETA unavailable");
            }
        }
        fetchETA();
    }, [runnerLocation, gateLocation]);

    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Runner ETA
            </h3>
            <p
                className={`mt-1 text-2xl font-bold ${
                    error
                        ? "text-slate-500 dark:text-slate-400"
                        : "text-slate-900 dark:text-white"
                }`}
            >
                {eta || "—"}
            </p>
        </div>
    );
}

export default RunnerETA;
