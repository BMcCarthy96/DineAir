import { useState, useEffect, useCallback } from "react";
import {
    GoogleMap,
    LoadScript,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";
import { motion } from "framer-motion";
import "./Map.css";
import Cookies from "js-cookie";

const containerStyle = {
    width: "100%",
    height: "400px",
};

function Map({ runnerLocation, gateLocation, isRunnerView }) {
    const [directions, setDirections] = useState(null);

    const fetchDirections = useCallback(async () => {
        if (!runnerLocation || !gateLocation) return;

        const response = await fetch("/api/deliveries/calculate-eta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "XSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({ runnerLocation, gateLocation }),
        });

        const data = await response.json();
        setDirections(data.directions);
    }, [runnerLocation, gateLocation]);

    useEffect(() => {
        if (!isRunnerView) {
            fetchDirections();
        }
    }, [fetchDirections, isRunnerView]);

    if (!runnerLocation || !gateLocation) {
        return <p>Loading map...</p>;
    }

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={runnerLocation}
                zoom={12}
            >
                {/* Runner and Gate Markers */}
                <Marker position={runnerLocation} label="Runner" />
                <Marker position={gateLocation} label="Gate" />

                {/* Animated Runner Icon */}
                <motion.div
                    className="runner-icon"
                    animate={{
                        x: (gateLocation.lat - runnerLocation.lat) * 100000,
                        y: (gateLocation.lng - runnerLocation.lng) * 100000,
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "24px",
                    }}
                >
                    🏃
                </motion.div>

                {/* Directions Renderer */}
                {!isRunnerView && directions && (
                    <DirectionsRenderer directions={directions} />
                )}
            </GoogleMap>
        </LoadScript>
    );
}

export default Map;
