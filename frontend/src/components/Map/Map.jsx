import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import "./Map.css";

const containerStyle = {
    width: "100%",
    height: "400px",
};

function Map({ runnerLocation, gateLocation, isRunnerView }) {
    const [directions, setDirections] = useState(null);

    const fetchDirections = useCallback(async () => {
        const response = await fetch("/api/deliveries/calculate-eta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={runnerLocation} zoom={12}>
                {isRunnerView ? (
                    <>
                        <Marker position={runnerLocation} label="You" />
                        <Marker position={gateLocation} label="Destination" />
                    </>
                ) : (
                    directions && <DirectionsRenderer directions={directions} />
                )}
            </GoogleMap>
        </LoadScript>
    );
}

export default Map;
