"use strict";

const DEFAULT_FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "https://dineair.onrender.com",
];

/** Comma-separated FRONTEND_URLS env override, else the default Vite ports + production origin. */
function getFrontendOrigins() {
    const fromEnv = process.env.FRONTEND_URLS
        ? process.env.FRONTEND_URLS.split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : [];
    return fromEnv.length ? fromEnv : DEFAULT_FRONTEND_ORIGINS;
}

module.exports = { getFrontendOrigins, DEFAULT_FRONTEND_ORIGINS };
