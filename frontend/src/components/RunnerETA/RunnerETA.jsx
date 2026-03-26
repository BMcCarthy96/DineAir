import { useState, useEffect, useRef, useMemo } from "react";
import Cookies from "js-cookie";
import { apiFetch } from "../../utils/apiFetch";
import { haversineMeters, estimateWalkMinutes } from "../../utils/geo";
import { trackingLog } from "../../utils/trackingLog";

const API_THROTTLE_MS = 32000;

/**
 * Normalize API/map points (handles string decimals from Sequelize/JSON).
 * @param {unknown} p
 * @returns {{ lat: number, lng: number } | null}
 */
function normalizePoint(p) {
    if (!p || typeof p !== "object") return null;
    const lat = Number(p.lat);
    const lng = Number(p.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
}

/**
 * @param {number} minutes
 */
function formatEtaLabel(minutes) {
    const m = Math.max(1, Math.round(minutes));
    const low = Math.max(1, m - 1);
    const high = m + 2;
    if (high - low <= 2) {
        return `About ${m} min away`;
    }
    return `Arriving in ${low}–${high} min`;
}

/**
 * @param {{
 *   runnerLocation: unknown,
 *   gateLocation: unknown,
 *   effectiveStatus?: string | null,
 * }} props
 */
function RunnerETA({ runnerLocation, gateLocation, effectiveStatus }) {
    /** Optional override from Google Directions (throttled). */
    const [apiEtaText, setApiEtaText] = useState(null);
    const lastApiAtRef = useRef(0);
    const lastFetchKeyRef = useRef("");
    const pendingApiRef = useRef(null);

    const enRouteForEta =
        effectiveStatus == null ||
        effectiveStatus === "picked_up" ||
        effectiveStatus === "on_the_way";

    /** Distance + walking pace — only meaningful once the runner is en route (demo-aligned). */
    const distanceEtaLabel = useMemo(() => {
        if (!enRouteForEta) return null;
        const from = normalizePoint(runnerLocation);
        const to = normalizePoint(gateLocation);
        if (!from || !to) return null;
        const meters = haversineMeters(from, to);
        const minutes = estimateWalkMinutes(meters);
        return formatEtaLabel(minutes);
    }, [runnerLocation, gateLocation, enRouteForEta]);

    const phasePrimary = useMemo(() => {
        if (effectiveStatus == null) return null;
        if (effectiveStatus === "pending") return "Order received";
        if (effectiveStatus === "preparing") return "Preparing your order";
        if (effectiveStatus === "delivered") return "Delivered";
        return null;
    }, [effectiveStatus]);

    const phaseSub = useMemo(() => {
        if (effectiveStatus === "pending") {
            return "Runner will head to your gate once prep is done";
        }
        if (effectiveStatus === "preparing") {
            return "Hang tight — ETA updates when the runner is en route";
        }
        if (effectiveStatus === "delivered") {
            return "Runner is at your gate";
        }
        if (enRouteForEta) {
            return "Based on walking pace to your gate";
        }
        return null;
    }, [effectiveStatus, enRouteForEta]);

    const displayLabel = useMemo(() => {
        if (effectiveStatus === "pending" || effectiveStatus === "preparing") {
            return phasePrimary;
        }
        if (effectiveStatus === "delivered") {
            return phasePrimary;
        }
        if (apiEtaText != null && apiEtaText !== "") {
            return apiEtaText;
        }
        return distanceEtaLabel ?? "—";
    }, [
        effectiveStatus,
        phasePrimary,
        apiEtaText,
        distanceEtaLabel,
    ]);

    /** Drop Directions text when the distance-based label changes so we don't show stale Google copy. */
    useEffect(() => {
        setApiEtaText(null);
    }, [distanceEtaLabel]);

    useEffect(() => {
        const clearPending = () => {
            if (pendingApiRef.current) {
                clearTimeout(pendingApiRef.current);
                pendingApiRef.current = null;
            }
        };

        let cancelled = false;

        if (!enRouteForEta) {
            setApiEtaText(null);
            return () => {
                cancelled = true;
                clearPending();
            };
        }

        const from = normalizePoint(runnerLocation);
        const to = normalizePoint(gateLocation);
        if (!from || !to) {
            setApiEtaText(null);
            return () => {
                cancelled = true;
                clearPending();
            };
        }

        const meters = haversineMeters(from, to);
        const now = Date.now();
        const fetchKey = `${Math.round(meters / 50)}:${to.lat.toFixed(4)}`;
        const shouldFetchApi =
            now - lastApiAtRef.current >= API_THROTTLE_MS &&
            fetchKey !== lastFetchKeyRef.current;

        if (!shouldFetchApi) {
            return () => {
                cancelled = true;
                clearPending();
            };
        }

        lastApiAtRef.current = now;
        lastFetchKeyRef.current = fetchKey;

        clearPending();
        pendingApiRef.current = setTimeout(async () => {
            pendingApiRef.current = null;
            try {
                const response = await apiFetch("/api/deliveries/calculate-eta", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                        "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                    },
                    body: JSON.stringify({
                        runnerLocation: from,
                        gateLocation: to,
                    }),
                });

                if (!response.ok || cancelled) return;

                const data = await response.json();
                const apiText = data.eta || "";
                if (!apiText || cancelled) return;

                setApiEtaText(
                    apiText.includes("min") ? apiText : `About ${apiText}`
                );
                trackingLog("ETA from Directions API", apiText);
            } catch {
                /* keep distance-based label */
            }
        }, 400);

        return () => {
            cancelled = true;
            clearPending();
        };
    }, [runnerLocation, gateLocation, enRouteForEta]);

    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Runner ETA
            </h3>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {displayLabel}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {phaseSub ?? "—"}
            </p>
        </div>
    );
}

export default RunnerETA;
