import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/apiFetch";

function FlightInfoSidebar({ flightNumber, date }) {
    const [flightData, setFlightData] = useState(null);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFlightData() {
            try {
                const response = await apiFetch(
                    `/api/flights?flightNumber=${flightNumber}&date=${date}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setFlightData(data);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    setErr(
                        errorData.error || "Failed to fetch flight data."
                    );
                }
            } catch {
                setErr("An error occurred while fetching flight data.");
            } finally {
                setLoading(false);
            }
        }

        if (flightNumber && date) {
            fetchFlightData();
        }
    }, [flightNumber, date]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                Loading flight data…
            </div>
        );
    }

    if (err) {
        return (
            <div
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
            >
                {err}
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Flight information
            </h2>
            {flightData ? (
                <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-slate-500 dark:text-slate-400">
                            Flight
                        </dt>
                        <dd className="font-medium text-slate-900 dark:text-white">
                            {flightData.flightNumber}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-slate-500 dark:text-slate-400">
                            Status
                        </dt>
                        <dd className="font-medium text-slate-900 dark:text-white">
                            {flightData.status}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-slate-500 dark:text-slate-400">
                            Departure gate
                        </dt>
                        <dd className="font-medium text-slate-900 dark:text-white">
                            {flightData.departureGate}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-slate-500 dark:text-slate-400">
                            Departure terminal
                        </dt>
                        <dd className="font-medium text-slate-900 dark:text-white">
                            {flightData.departureTerminal}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-slate-500 dark:text-slate-400">
                            Arrival gate
                        </dt>
                        <dd className="font-medium text-slate-900 dark:text-white">
                            {flightData.arrivalGate}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-slate-500 dark:text-slate-400">
                            Arrival terminal
                        </dt>
                        <dd className="font-medium text-slate-900 dark:text-white">
                            {flightData.arrivalTerminal}
                        </dd>
                    </div>
                </dl>
            ) : (
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    No flight data available.
                </p>
            )}
        </div>
    );
}

export default FlightInfoSidebar;
