const express = require("express");
const router = express.Router();
const webPush = require("../../utils/webPush");

let subscriptions = []; // Store subscriptions in memory (use a database in production)

// Endpoint to save subscription
router.post("/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ message: "Subscription saved." });
});

// Endpoint to send a notification
router.post("/send", async (req, res) => {
    const { title, body } = req.body;

    const payload = JSON.stringify({ title, body });

    try {
        for (const subscription of subscriptions) {
            await webPush.sendNotification(subscription, payload);
        }
        res.status(200).json({ message: "Notifications sent." });
    } catch (err) {
        console.error("Error sending notification:", err);
        res.status(500).json({ error: "Failed to send notifications." });
    }
});

module.exports = router;
