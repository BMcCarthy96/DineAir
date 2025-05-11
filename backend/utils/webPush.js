const webPush = require("web-push");
require("dotenv").config(); // Load environment variables

// Configure web-push with VAPID keys from .env
webPush.setVapidDetails(
    "mailto:bmac96.dev@gmail.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

module.exports = webPush;
