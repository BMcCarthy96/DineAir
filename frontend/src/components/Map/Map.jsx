import { useEffect, useRef } from "react";
import "./Map.css";

const containerStyle = {
    width: "100%",
    height: "400px",
};

function Map({ runnerLocation, gateLocation, restaurants = [] }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const runnerMarker = useRef(null);
    const gateMarker = useRef(null);
    const restaurantMarkers = useRef([]);
    const directionsRenderer = useRef(null);

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

    useEffect(() => {
        if (
            !mapInstance.current &&
            window.google &&
            (runnerLocation || gateLocation)
        ) {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: runnerLocation || gateLocation,
                zoom: 15,
            });

            // Runner marker
            if (runnerLocation) {
                if (window.google.maps.marker?.AdvancedMarkerElement) {
                    runnerMarker.current =
                        new window.google.maps.marker.AdvancedMarkerElement({
                            map: mapInstance.current,
                            position: runnerLocation,
                            title: "Runner",
                            content: createCustomMarker("🏃‍♂️", "Runner"),
                        });
                } else {
                    runnerMarker.current = new window.google.maps.Marker({
                        map: mapInstance.current,
                        position: runnerLocation,
                        title: "Runner",
                        label: {
                            text: "🏃‍♂️",
                            fontSize: "24px",
                        },
                    });
                }
            }

            // Gate marker
            if (gateLocation) {
                if (window.google.maps.marker?.AdvancedMarkerElement) {
                    gateMarker.current =
                        new window.google.maps.marker.AdvancedMarkerElement({
                            map: mapInstance.current,
                            position: gateLocation,
                            title: "Gate",
                            content: createCustomMarker("📍", "Gate"),
                        });
                } else {
                    gateMarker.current = new window.google.maps.Marker({
                        map: mapInstance.current,
                        position: gateLocation,
                        title: "Gate",
                        label: {
                            text: "📍",
                            fontSize: "24px",
                        },
                    });
                }
            }

            // DirectionsRenderer for route line
            directionsRenderer.current =
                new window.google.maps.DirectionsRenderer({
                    map: mapInstance.current,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "#ff6f61",
                        strokeWeight: 5,
                    },
                });
        }
    }, [runnerLocation, gateLocation]);

    // Update runner marker position
    useEffect(() => {
        if (runnerMarker.current && runnerLocation) {
            runnerMarker.current.setPosition(runnerLocation);
            if (mapInstance.current) {
                mapInstance.current.setCenter(runnerLocation);
            }
        }
    }, [runnerLocation]);

    // Update gate marker position
    useEffect(() => {
        if (gateMarker.current && gateLocation) {
            gateMarker.current.setPosition(gateLocation);
        }
    }, [gateLocation]);

    // Add restaurant markers
    useEffect(() => {
        if (mapInstance.current && restaurants.length > 0) {
            // Remove old markers
            restaurantMarkers.current.forEach((marker) => marker.setMap(null));
            restaurantMarkers.current = [];

            restaurants.forEach((restaurant) => {
                const marker = new window.google.maps.Marker({
                    map: mapInstance.current,
                    position: {
                        lat: parseFloat(restaurant.latitude),
                        lng: parseFloat(restaurant.longitude),
                    },
                    icon: {
                        url: "/images/restaurant-icon.png", // Use your own icon or comment out for default
                        scaledSize: new window.google.maps.Size(32, 32),
                    },
                    title: restaurant.name,
                });
                restaurantMarkers.current.push(marker);
            });
        }
    }, [restaurants]);

    // Fetch and render directions
    useEffect(() => {
        if (
            runnerLocation &&
            gateLocation &&
            directionsRenderer.current &&
            window.google
        ) {
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

    return (
        <div
            ref={mapRef}
            style={containerStyle}
            className="map-container"
        ></div>
    );
}

export default Map;
