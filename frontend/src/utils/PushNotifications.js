export async function subscribeToNotifications() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
            // Register the service worker
            const registration = await navigator.serviceWorker.register(
                "/sw.js"
            );

            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
            });

            // Send the subscription to the backend
            const response = await fetch("/api/notifications/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(subscription),
            });

            if (response.ok) {
                console.log("Subscribed to notifications!");
            } else {
                console.error("Failed to subscribe to notifications.");
            }
        } catch (err) {
            console.error("Error subscribing to notifications:", err);
        }
    } else {
        console.error("Push notifications are not supported in this browser.");
    }
}
