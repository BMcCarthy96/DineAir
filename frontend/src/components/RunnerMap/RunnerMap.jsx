import { useState, useEffect } from "react";
import Map from "../Map/Map";
import socket from "../../utils/WebSocket";

function RunnerMap({ gateLocation }) {
    const [runnerLocation, setRunnerLocation] = useState({ lat: 37.7749, lng: -122.4194 });

    useEffect(() => {
        // Use Geolocation API to track the runner's location
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setRunnerLocation(location);

                // Send the updated location to the server
                socket.emit("runnerLocationUpdate", { runnerId: 1, location });
            },
            (error) => console.error("Error tracking location:", error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return <Map runnerLocation={runnerLocation} gateLocation={gateLocation} isRunnerView={true} />;
}

export default RunnerMap;
