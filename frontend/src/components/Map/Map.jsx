import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsScript } from "../../utils/loadGoogleMaps";
import { normalizeLatLng } from "../../utils/coordinates";
import {
    devLogMaps,
    getMapsPresenceSnapshot,
    hintsForLoadPhase,
    maskApiKeyForDisplay,
} from "../../utils/mapsDiagnostics";
import { haversineMeters } from "../../utils/geo";
import { shouldShowMapsDiagnostics } from "../../utils/mapsDebugFlag";

const containerStyle = {
    width: "100%",
    height: "min(420px, 55vh)",
    minHeight: "280px",
    position: "relative",
    zIndex: 0,
};

/** Used when the API is ready but coordinates are not yet available (avoids a blank map). */
const DEFAULT_CENTER = { lat: 33.9416, lng: -118.4085 };

function MapsDevDiagnostics({
    mapsStatus,
    keyPresent,
    keyMasked,
    presence,
    loadPhase,
    directionsDetail,
}) {
    if (!shouldShowMapsDiagnostics()) return null;

    const origin =
        typeof window !== "undefined" ? window.location.origin : "(no window)";

    return (
        <div
            className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-100/80 px-3 py-2 text-left font-mono text-[10px] leading-relaxed text-slate-700 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-300"
            data-testid="maps-dev-diagnostics"
        >
            <div className="font-semibold text-slate-600 dark:text-slate-400">
                [DineAir Maps] dev diagnostics
            </div>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
                <li>window.location.origin: {origin}</li>
                <li>
                    VITE_GOOGLE_MAPS_API_KEY:{" "}
                    {keyPresent ? `present (${keyMasked})` : "not set"}
                </li>
                <li>
                    Script in DOM: {presence.scriptInDom ? "yes" : "no"}
                    {presence.scriptDatasetLoaded != null &&
                        ` (data-loaded: ${String(presence.scriptDatasetLoaded)})`}
                </li>
                {presence.scriptSrcSanitized && (
                    <li className="break-all">
                        script src: {presence.scriptSrcSanitized}
                    </li>
                )}
                <li>window.google: {presence.hasGoogle ? "yes" : "no"}</li>
                <li>
                    window.google.maps.Map: {presence.hasMapsMap ? "yes" : "no"}
                </li>
                {loadPhase && (
                    <li className="text-amber-800 dark:text-amber-200">
                        last load phase: {loadPhase}
                    </li>
                )}
            </ul>
            {directionsDetail && (
                <p className="mt-2 border-t border-slate-300 pt-2 text-amber-900 dark:border-slate-600 dark:text-amber-200">
                    Directions: {directionsDetail}
                </p>
            )}
            {mapsStatus === "error" && loadPhase && (
                <ul className="mt-2 list-inside list-disc border-t border-slate-300 pt-2 text-slate-600 dark:border-slate-600 dark:text-slate-400">
                    {hintsForLoadPhase(loadPhase).map((h) => (
                        <li key={h}>{h}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function Map({
    runnerLocation,
    gateLocation,
    restaurantLocation,
    restaurants = [],
    isRunnerView = false,
}) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const runnerMarker = useRef(null);
    const gateMarker = useRef(null);
    const restaurantMarkers = useRef([]);
    const directionsRenderer = useRef(null);
    const lastDirectionsAtRef = useRef(0);
    const lastDirectionsRunnerRef = useRef(null);
    const lastGateKeyRef = useRef("");
    const directionsInputWarnedRef = useRef(new Set());

    /** no-key | loading | ready | error */
    const [mapsStatus, setMapsStatus] = useState("loading");
    const [errorDetail, setErrorDetail] = useState("");
    const [loadPhaseState, setLoadPhaseState] = useState(undefined);

    const [devPresence, setDevPresence] = useState(() =>
        getMapsPresenceSnapshot()
    );
    const [directionsDetail, setDirectionsDetail] = useState("");

    const rawEnvKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const trimmedKey =
        typeof rawEnvKey === "string" ? rawEnvKey.trim() : "";
    const keyPresent = trimmedKey.length > 0;
    const keyMasked = maskApiKeyForDisplay(trimmedKey);

    useEffect(() => {
        if (!shouldShowMapsDiagnostics()) return;
        setDevPresence(getMapsPresenceSnapshot());
    }, [mapsStatus, errorDetail, directionsDetail]);

    useEffect(() => {
        if (!shouldShowMapsDiagnostics() || mapsStatus !== "loading") return;
        const id = setInterval(
            () => setDevPresence(getMapsPresenceSnapshot()),
            400
        );
        return () => clearInterval(id);
    }, [mapsStatus]);

    useEffect(() => {
        if (import.meta.env.DEV) {
            if (keyPresent) {
                devLogMaps(
                    "info",
                    "VITE_GOOGLE_MAPS_API_KEY loaded (masked):",
                    keyMasked
                );
            } else {
                devLogMaps(
                    "info",
                    "VITE_GOOGLE_MAPS_API_KEY is empty — showing setup fallback (CI-safe)"
                );
            }
        }

        if (!keyPresent) {
            setLoadPhaseState(undefined);
            setMapsStatus("no-key");
            setErrorDetail("");
            return;
        }

        setMapsStatus("loading");
        setErrorDetail("");
        setLoadPhaseState(undefined);

        loadGoogleMapsScript(trimmedKey)
            .then(() => {
                setLoadPhaseState(undefined);
                setMapsStatus("ready");
                setErrorDetail("");
            })
            .catch((err) => {
                const phase =
                    typeof err?.dineAirMapsPhase === "string"
                        ? err.dineAirMapsPhase
                        : undefined;
                setLoadPhaseState(phase);
                const message =
                    err?.message || "Unknown error loading Google Maps";
                devLogMaps("error", "loadGoogleMapsScript:", err);
                setErrorDetail(
                    phase
                        ? `${message} [phase: ${phase}]`
                        : message
                );
                setMapsStatus("error");
            });
    }, [keyPresent, trimmedKey, keyMasked]);

    const safeRunner = useMemo(
        () => normalizeLatLng(runnerLocation),
        [runnerLocation]
    );
    const safeGate = useMemo(() => normalizeLatLng(gateLocation), [gateLocation]);
    const safeRestaurant = useMemo(
        () => normalizeLatLng(restaurantLocation),
        [restaurantLocation]
    );

    const center = useMemo(
        () => safeRunner || safeGate || safeRestaurant || DEFAULT_CENTER,
        [safeRunner, safeGate, safeRestaurant]
    );
    const fallbackCenterWarnedRef = useRef(false);
    useEffect(() => {
        const noLiveCenter = !safeRunner && !safeGate && !safeRestaurant;
        if (!noLiveCenter || fallbackCenterWarnedRef.current) return;
        fallbackCenterWarnedRef.current = true;
        const detail = { usingFallbackCenter: DEFAULT_CENTER };
        if (import.meta.env.DEV) {
            devLogMaps("info", "No valid live coordinates yet; using fallback center", detail);
        } else {
            console.info("[DineAir Maps] Using fallback center pending valid coordinates", detail);
        }
    }, [safeRunner, safeGate, safeRestaurant]);

    /** Latest center for map init/resize (avoid re-running init when lat/lng change). */
    const centerRef = useRef(center);
    centerRef.current = center;

    const invalidSourceWarnedRef = useRef(new Set());
    useEffect(() => {
        const warnSourceOnce = (source, raw, normalized) => {
            if (!raw || normalized) return;
            if (invalidSourceWarnedRef.current.has(source)) return;
            invalidSourceWarnedRef.current.add(source);
            const detail = { source, raw };
            if (import.meta.env.DEV) {
                devLogMaps(
                    "warn",
                    "Invalid coordinates from source (skipping Google Maps update)",
                    detail
                );
            } else {
                console.warn("[DineAir Maps] Invalid coordinate source skipped", detail);
            }
        };

        warnSourceOnce("runnerLocation", runnerLocation, safeRunner);
        warnSourceOnce("gateLocation", gateLocation, safeGate);
        warnSourceOnce("restaurantLocation", restaurantLocation, safeRestaurant);
    }, [runnerLocation, gateLocation, restaurantLocation, safeRunner, safeGate, safeRestaurant]);

    // Initialize map once when the API is ready (center updates via recenter effect + centerRef).
    // Resize after layout: gray tiles often mean 0×0 canvas until resize fires (common in prod / flex layouts).
    useEffect(() => {
        if (mapsStatus !== "ready" || !mapRef.current || mapInstance.current) {
            return undefined;
        }

        if (!window.google?.maps?.Map) {
            const msg =
                "window.google.maps.Map is not available after load — check API key and console for Google errors";
            devLogMaps("error", msg, getMapsPresenceSnapshot());
            setErrorDetail(`${msg} [step: map-api-not-ready]`);
            setMapsStatus("error");
            return undefined;
        }

        const initialCenter = centerRef.current;

        try {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: initialCenter,
                zoom: 15,
            });

            directionsRenderer.current =
                new window.google.maps.DirectionsRenderer({
                    map: mapInstance.current,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "#e94e3c",
                        strokeWeight: 5,
                    },
                });

            const scheduleResize = () => {
                const m = mapInstance.current;
                if (!m || !window.google?.maps?.event) return;
                window.google.maps.event.trigger(m, "resize");
                const c = centerRef.current;
                if (
                    c &&
                    Number.isFinite(c.lat) &&
                    Number.isFinite(c.lng)
                ) {
                    m.setCenter(c);
                }
            };

            requestAnimationFrame(() => {
                requestAnimationFrame(scheduleResize);
            });
            const t1 = setTimeout(scheduleResize, 120);
            const t2 = setTimeout(scheduleResize, 450);

            const el = mapRef.current;
            let ro = null;
            if (typeof ResizeObserver !== "undefined" && el) {
                ro = new ResizeObserver(() => {
                    scheduleResize();
                });
                ro.observe(el);
            }

            if (import.meta.env.PROD) {
                console.info("[DineAir Maps] map instance created", {
                    centerLat: initialCenter.lat,
                    centerLng: initialCenter.lng,
                });
            }

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                if (ro && el) {
                    ro.unobserve(el);
                    ro.disconnect();
                }
                if (runnerMarker.current) {
                    runnerMarker.current.setMap(null);
                    runnerMarker.current = null;
                }
                if (gateMarker.current) {
                    gateMarker.current.setMap(null);
                    gateMarker.current = null;
                }
                restaurantMarkers.current.forEach((marker) =>
                    marker.setMap(null)
                );
                restaurantMarkers.current = [];
                if (directionsRenderer.current) {
                    directionsRenderer.current.setMap(null);
                    directionsRenderer.current = null;
                }
                mapInstance.current = null;
            };
        } catch (err) {
            const name = err?.name ? `${err.name}: ` : "";
            const msg =
                err?.message != null
                    ? `${name}${err.message}`
                    : "Failed to create map instance — see console for details";
            devLogMaps("error", "Map constructor:", err);
            setErrorDetail(`${msg} [step: map-constructor]`);
            setMapsStatus("error");
            return undefined;
        }
    }, [mapsStatus]);

    // Recenter when locations appear (first real center beats default)
    useEffect(() => {
        if (!mapInstance.current || mapsStatus !== "ready") return;
        const next = safeRunner || safeGate || safeRestaurant;
        if (next) {
            mapInstance.current.setCenter(next);
        }
    }, [mapsStatus, safeRunner, safeGate, safeRestaurant]);

    /** After center changes (or when markers appear), nudge tile redraw — fixes gray map when layout/center updates post-init. */
    useEffect(() => {
        if (mapsStatus !== "ready" || !mapInstance.current) return;
        if (!window.google?.maps?.event) return;
        const m = mapInstance.current;
        window.google.maps.event.trigger(m, "resize");
    }, [mapsStatus, center.lat, center.lng]);

    // Runner marker (update position in place for smooth tracking)
    useEffect(() => {
        if (mapsStatus !== "ready" || !mapInstance.current || !safeRunner) {
            return;
        }
        if (runnerMarker.current) {
            runnerMarker.current.setPosition(safeRunner);
        } else {
            runnerMarker.current = new window.google.maps.Marker({
                map: mapInstance.current,
                position: safeRunner,
                title: "Runner",
                label: {
                    text: "🏃‍♂️",
                    fontSize: "24px",
                },
            });
        }
        if (isRunnerView) {
            mapInstance.current.setCenter(safeRunner);
        }
    }, [mapsStatus, safeRunner, isRunnerView]);

    // Gate marker
    useEffect(() => {
        if (mapsStatus !== "ready" || !mapInstance.current || !safeGate) {
            return;
        }
        if (!gateMarker.current) {
            gateMarker.current = new window.google.maps.Marker({
                map: mapInstance.current,
                position: safeGate,
                title: "Gate",
                label: {
                    text: "📍",
                    fontSize: "24px",
                },
            });
        } else {
            gateMarker.current.setPosition(safeGate);
        }
    }, [mapsStatus, safeGate]);

    // Restaurant markers
    useEffect(() => {
        if (mapsStatus !== "ready" || !mapInstance.current) {
            return;
        }
        restaurantMarkers.current.forEach((marker) => marker.setMap(null));
        restaurantMarkers.current = [];

        if (restaurants?.length > 0) {
            restaurants.forEach((restaurant) => {
                const pos = normalizeLatLng({
                    lat: restaurant.latitude,
                    lng: restaurant.longitude,
                });
                if (!pos) return;
                const marker = new window.google.maps.Marker({
                    position: pos,
                    map: mapInstance.current,
                    title: restaurant.name,
                });
                restaurantMarkers.current.push(marker);
            });
        }
    }, [mapsStatus, restaurants]);

    // Directions (throttled: avoid Directions API spam while runner moves smoothly)
    useEffect(() => {
        if (
            mapsStatus !== "ready" ||
            !safeRunner ||
            !safeGate ||
            !directionsRenderer.current ||
            !window.google
        ) {
            if (mapsStatus === "ready") {
                const warnDirectionsInputOnce = (key, raw, normalized) => {
                    if (!raw || normalized) return;
                    if (directionsInputWarnedRef.current.has(key)) return;
                    directionsInputWarnedRef.current.add(key);
                    const detail = { source: key, raw };
                    if (import.meta.env.DEV) {
                        devLogMaps(
                            "warn",
                            "Directions skipped due to invalid coordinate input",
                            detail
                        );
                    } else {
                        console.warn("[DineAir Maps] Directions skipped (invalid input)", detail);
                    }
                };
                warnDirectionsInputOnce("origin_runnerLocation", runnerLocation, safeRunner);
                warnDirectionsInputOnce("destination_gateLocation", gateLocation, safeGate);
            }
            if (directionsRenderer.current) {
                directionsRenderer.current.setDirections({ routes: [] });
            }
            if ((!safeRunner || !safeGate) && import.meta.env.DEV) {
                setDirectionsDetail("");
            }
            return;
        }

        const gateKey = `${safeGate.lat},${safeGate.lng}`;
        const now = Date.now();
        const minIntervalMs = 12000;
        const minMoveM = 85;
        const prevRunner = lastDirectionsRunnerRef.current;
        const gateChanged = gateKey !== lastGateKeyRef.current;
        let shouldRequest = gateChanged;
        if (!shouldRequest && prevRunner) {
            const moved = haversineMeters(prevRunner, safeRunner);
            shouldRequest =
                moved >= minMoveM ||
                now - lastDirectionsAtRef.current >= minIntervalMs;
        } else if (!prevRunner) {
            shouldRequest = true;
        }
        if (!shouldRequest) {
            return;
        }
        lastDirectionsAtRef.current = now;
        lastDirectionsRunnerRef.current = safeRunner;
        lastGateKeyRef.current = gateKey;

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: safeRunner,
                destination: safeGate,
                travelMode: window.google.maps.TravelMode.WALKING,
            },
            (result, status) => {
                const Status = window.google.maps.DirectionsStatus;
                if (status === Status.OK) {
                    directionsRenderer.current.setDirections(result);
                    if (import.meta.env.DEV) {
                        setDirectionsDetail("");
                    }
                    return;
                }

                directionsRenderer.current.setDirections({ routes: [] });

                if (import.meta.env.DEV) {
                    const routesLen = result?.routes?.length ?? 0;
                    const detail = `DirectionsService.route status=${String(status)} (routes: ${routesLen})`;
                    devLogMaps("warn", "DirectionsService.route failed:", {
                        status,
                        resultSummary: result
                            ? {
                                  routesCount: result.routes?.length,
                                  geocodedWaypoints:
                                      result.geocoded_waypoints?.length,
                              }
                            : null,
                        result,
                    });
                    setDirectionsDetail(detail);
                }
            }
        );
    }, [mapsStatus, safeRunner, safeGate, runnerLocation, gateLocation]);

    const diagnosticsBlock = (
        <MapsDevDiagnostics
            mapsStatus={mapsStatus}
            keyPresent={keyPresent}
            keyMasked={keyMasked}
            presence={devPresence}
            loadPhase={loadPhaseState}
            directionsDetail={directionsDetail}
        />
    );

    if (mapsStatus === "no-key") {
        return (
            <div className="w-full">
                <div
                    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-900/40"
                    style={containerStyle}
                    role="region"
                    aria-label="Map unavailable"
                >
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Map preview disabled
                    </p>
                    <p className="mt-2 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                        Set{" "}
                        <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
                            VITE_GOOGLE_MAPS_API_KEY
                        </code>{" "}
                        in{" "}
                        <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
                            frontend/.env
                        </code>{" "}
                        and restart{" "}
                        <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
                            npm run dev
                        </code>{" "}
                        (see{" "}
                        <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
                            .env.example
                        </code>
                        ).
                    </p>
                </div>
                {diagnosticsBlock}
            </div>
        );
    }

    if (mapsStatus === "error") {
        return (
            <div className="w-full">
                <div
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/40"
                    style={containerStyle}
                    role="alert"
                >
                    <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                        Map failed to load
                    </p>
                    <p className="max-w-md text-xs text-red-800 dark:text-red-200">
                        Check your API key,{" "}
                        <strong>Maps JavaScript API</strong> enabled, billing, and{" "}
                        <strong>HTTP referrer</strong> restrictions (include{" "}
                        <code className="rounded bg-red-100 px-1 dark:bg-red-900/60">
                            http://localhost:5174/*
                        </code>{" "}
                        for local Vite).
                    </p>
                    {errorDetail && (
                        <p className="max-w-lg break-words font-mono text-[11px] text-red-700 dark:text-red-300">
                            {errorDetail}
                        </p>
                    )}
                    {import.meta.env.DEV && (
                        <p className="text-[10px] text-red-600/80 dark:text-red-400/80">
                            Dev: see browser console for [DineAir Maps] logs.
                        </p>
                    )}
                </div>
                {diagnosticsBlock}
            </div>
        );
    }

    if (mapsStatus === "loading") {
        return (
            <div className="w-full">
                <div
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40"
                    style={containerStyle}
                    role="status"
                    aria-label="Loading map"
                >
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-slate-600 dark:border-t-brand-400" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Loading map…
                    </p>
                </div>
                {diagnosticsBlock}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                ref={mapRef}
                style={containerStyle}
                className="min-h-[280px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner dark:border-slate-700"
            />
            {diagnosticsBlock}
        </div>
    );
}

export default Map;
