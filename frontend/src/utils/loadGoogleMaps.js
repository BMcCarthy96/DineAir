/**
 * Loads the Google Maps JavaScript API once per page session.
 * Key: VITE_GOOGLE_MAPS_API_KEY (Vite injects at build/dev time).
 */

import { devLogMaps, getMapsPresenceSnapshot, hintsForLoadPhase } from "./mapsDiagnostics";

const SCRIPT_SELECTOR = 'script[data-dineair-google-maps="true"]';
/** geometry: distance/polyline; places: common portfolio pattern (Autocomplete, etc.) */
const LIBRARIES = "geometry,places";
const LOAD_TIMEOUT_MS = 25000;

/** In-flight load promise (shared by all callers). Cleared after settle. */
let inFlightLoad = null;

function googleMapsReady() {
    return !!(
        typeof window !== "undefined" &&
        window.google?.maps?.Map
    );
}

/**
 * @param {string} message
 * @param {string} phase
 * @returns {Error & { dineAirMapsPhase?: string }}
 */
function mapsLoadError(message, phase) {
    const err = new Error(message);
    err.dineAirMapsPhase = phase;
    devLogMaps("error", "load failed", { phase, message: err.message });
    devLogMaps("info", "hints:", hintsForLoadPhase(phase));
    devLogMaps("info", "presence:", getMapsPresenceSnapshot());
    return err;
}

/**
 * @param {string} apiKey
 * @returns {Promise<void>}
 */
export function loadGoogleMapsScript(apiKey) {
    if (typeof window === "undefined") {
        return Promise.reject(mapsLoadError("No window", "no-window"));
    }

    const trimmed = (apiKey ?? "").trim();
    if (!trimmed) {
        return Promise.reject(
            mapsLoadError(
                "Missing Google Maps API key (VITE_GOOGLE_MAPS_API_KEY)",
                "missing-key"
            )
        );
    }

    if (googleMapsReady()) {
        devLogMaps("info", "already ready", getMapsPresenceSnapshot());
        return Promise.resolve();
    }

    if (inFlightLoad) {
        return inFlightLoad;
    }

    inFlightLoad = new Promise((resolve, reject) => {
        let timeoutId;
        let pollId;
        let settled = false;

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (pollId) clearInterval(pollId);
        };

        const fail = (err) => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(err instanceof Error ? err : new Error(String(err)));
        };

        const succeed = () => {
            if (settled) return;
            if (!googleMapsReady()) {
                fail(
                    mapsLoadError(
                        "Maps script finished but window.google.maps.Map is missing — likely invalid key, referrer restriction, Maps JavaScript API disabled, or billing not enabled",
                        "post-load-no-maps"
                    )
                );
                return;
            }
            settled = true;
            cleanup();
            devLogMaps("info", "script ready", getMapsPresenceSnapshot());
            resolve();
        };

        timeoutId = setTimeout(() => {
            fail(
                mapsLoadError(
                    `Google Maps did not become ready within ${LOAD_TIMEOUT_MS / 1000}s`,
                    "timeout"
                )
            );
        }, LOAD_TIMEOUT_MS);

        let script = document.querySelector(SCRIPT_SELECTOR);

        const attachToScript = (el) => {
            const onLoad = () => {
                // Google may call onload before maps is fully defined — microtask
                queueMicrotask(() => {
                    if (googleMapsReady()) {
                        succeed();
                    } else {
                        fail(
                            mapsLoadError(
                                "After load, google.maps.Map is still undefined — check API key restrictions, Maps JavaScript API, and billing",
                                "post-load-no-maps"
                            )
                        );
                    }
                });
            };

            if (el.dataset.dineairMapsLoaded === "true") {
                queueMicrotask(onLoad);
                return;
            }

            el.addEventListener("load", onLoad, { once: true });
            el.addEventListener(
                "error",
                () => {
                    fail(
                        mapsLoadError(
                            "Google Maps script element fired error (network, ad-blocker, or CSP)",
                            "script-network"
                        )
                    );
                },
                { once: true }
            );
        };

        if (script) {
            if (googleMapsReady()) {
                succeed();
                return;
            }
            attachToScript(script);
            // If <script> was injected earlier and `load` already fired (e.g. HMR), listeners won't run again.
            pollId = setInterval(() => {
                if (googleMapsReady()) {
                    succeed();
                }
            }, 100);
            return;
        }

        script = document.createElement("script");
        script.setAttribute("data-dineair-google-maps", "true");
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
            trimmed
        )}&libraries=${LIBRARIES}`;

        script.addEventListener(
            "load",
            () => {
                script.dataset.dineairMapsLoaded = "true";
                queueMicrotask(() => {
                    if (googleMapsReady()) {
                        succeed();
                    } else {
                        fail(
                            mapsLoadError(
                                "Maps script onload fired but google.maps.Map is missing — invalid key, ApiTargetBlocked (referrer), or API disabled",
                                "post-load-no-maps"
                            )
                        );
                    }
                });
            },
            { once: true }
        );

        script.addEventListener(
            "error",
            () => {
                fail(
                    mapsLoadError(
                        "Could not fetch maps.googleapis.com (blocked, offline, or bad URL)",
                        "script-network"
                    )
                );
            },
            { once: true }
        );

        document.head.appendChild(script);
    }).finally(() => {
        inFlightLoad = null;
    });

    return inFlightLoad;
}
