import { useEffect, useRef } from "react";
import "./Map.css";

const containerStyle = {
    width: "100%",
    height: "400px",
};

function Map({ runnerLocation, gateLocation }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const runnerMarker = useRef(null);
    const gateMarker = useRef(null);
    const directionsRenderer = useRef(null);

    useEffect(() => {
        // Initialize the map
        if (!mapInstance.current && window.google) {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: runnerLocation,
                zoom: 12,
            });

            // Add the runner marker
            if (window.google.maps.marker?.AdvancedMarkerElement) {
                runnerMarker.current =
                    new window.google.maps.marker.AdvancedMarkerElement({
                        map: mapInstance.current,
                        position: runnerLocation,
                        title: "Runner",
                        content: createCustomMarker("🏃", "Runner"),
                    });

                // Add the gate marker
                gateMarker.current =
                    new window.google.maps.marker.AdvancedMarkerElement({
                        map: mapInstance.current,
                        position: gateLocation,
                        title: "Gate",
                        content: createCustomMarker("📍", "Gate"),
                    });
            } else {
                console.warn(
                    "AdvancedMarkerElement is not available. Falling back to Marker."
                );
                runnerMarker.current = new window.google.maps.Marker({
                    map: mapInstance.current,
                    position: runnerLocation,
                    title: "Runner",
                });

                gateMarker.current = new window.google.maps.Marker({
                    map: mapInstance.current,
                    position: gateLocation,
                    title: "Gate",
                });
            }

            // Initialize DirectionsRenderer
            directionsRenderer.current =
                new window.google.maps.DirectionsRenderer({
                    map: mapInstance.current,
                });
        }
    }, [runnerLocation, gateLocation]);

    useEffect(() => {
        // Update the runner marker position dynamically
        if (runnerMarker.current) {
            runnerMarker.current.position = runnerLocation;
        }
    }, [runnerLocation]);

    useEffect(() => {
        // Update the gate marker position dynamically
        if (gateMarker.current) {
            gateMarker.current.position = gateLocation;
        }
    }, [gateLocation]);

    useEffect(() => {
        // Fetch and render directions
        if (runnerLocation && gateLocation && directionsRenderer.current) {
            const directionsService =
                new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: runnerLocation,
                    destination: gateLocation,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        directionsRenderer.current.setDirections(result);
                    } else {
                        console.error(
                            "Directions request failed due to",
                            status
                        );
                    }
                }
            );
        }
    }, [runnerLocation, gateLocation]);

    // Helper function to create custom marker content
    const createCustomMarker = (icon, label) => {
        const markerDiv = document.createElement("div");
        markerDiv.className = "custom-marker";
        markerDiv.innerHTML = `
            <div class="marker-icon">${icon}</div>
            <div class="marker-label">${label}</div>
        `;
        return markerDiv;
    };

    return (
        <div
            ref={mapRef}
            style={containerStyle}
            className="map-container"
        ></div>
    );
}

export default Map;
