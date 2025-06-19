import { useEffect, useRef } from "react";
import "./Map.css";

const containerStyle = {
    width: "100%",
    height: "400px",
};

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

    // Initialize map
    useEffect(() => {
        if (
            !mapInstance.current &&
            window.google &&
            (runnerLocation || gateLocation || restaurantLocation)
        ) {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: runnerLocation || gateLocation || restaurantLocation,
                zoom: 15,
            });

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
    }, [runnerLocation, gateLocation, restaurantLocation]);

    // Runner marker
    useEffect(() => {
        if (mapInstance.current && runnerLocation) {
            // Remove old marker if it exists
            if (runnerMarker.current) {
                runnerMarker.current.setMap(null);
            }
            runnerMarker.current = new window.google.maps.Marker({
                map: mapInstance.current,
                position: runnerLocation,
                title: "Runner",
                label: {
                    text: "🏃‍♂️",
                    fontSize: "24px",
                },
            });
            if (isRunnerView) {
                mapInstance.current.setCenter(runnerLocation);
            }
        }
    }, [runnerLocation, isRunnerView]);

    // Gate marker
    useEffect(() => {
        if (mapInstance.current && gateLocation) {
            if (!gateMarker.current) {
                gateMarker.current = new window.google.maps.Marker({
                    map: mapInstance.current,
                    position: gateLocation,
                    title: "Gate",
                    label: {
                        text: "📍",
                        fontSize: "24px",
                    },
                });
            } else {
                gateMarker.current.setPosition(gateLocation);
            }
        }
    }, [gateLocation]);

    // Restaurant markers (all restaurants)
    useEffect(() => {
        if (mapInstance.current) {
            // Remove old markers
            restaurantMarkers.current.forEach((marker) => marker.setMap(null));
            restaurantMarkers.current = [];

            if (restaurants && restaurants.length > 0) {
                restaurants.forEach((restaurant) => {
                    if (restaurant.latitude && restaurant.longitude) {
                        const marker = new window.google.maps.Marker({
                            position: {
                                lat: parseFloat(restaurant.latitude),
                                lng: parseFloat(restaurant.longitude),
                            },
                            map: mapInstance.current,
                            title: restaurant.name,
                            // icon: {
                            //     url: "/images/restaurant-icon.png", // Use your own icon or comment out for default
                            //     scaledSize: new window.google.maps.Size(32, 32),
                            // },
                        });
                        restaurantMarkers.current.push(marker);
                    }
                });
            }
        }
    }, [restaurants]);

    // Fetch and render directions (runner to gate)
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
                    travelMode: window.google.maps.TravelMode.WALKING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        directionsRenderer.current.setDirections(result);
                    } else {
                        directionsRenderer.current.setDirections({
                            routes: [],
                        });
                    }
                }
            );
        } else if (directionsRenderer.current) {
            directionsRenderer.current.setDirections({ routes: [] });
        }
    }, [runnerLocation, gateLocation]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (runnerMarker.current) runnerMarker.current.setMap(null);
            if (gateMarker.current) gateMarker.current.setMap(null);
            restaurantMarkers.current.forEach((marker) => marker.setMap(null));
            if (directionsRenderer.current)
                directionsRenderer.current.setMap(null);
        };
    }, []);

    return (
        <div
            ref={mapRef}
            style={containerStyle}
            className="map-container"
        ></div>
    );
}

export default Map;
