const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { initSocket } = require("./utils/socket");
const { getFrontendOrigins, DEFAULT_FRONTEND_ORIGINS } = require("./utils/corsOrigins");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

const { ValidationError } = require("sequelize");

app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());

// CORS: required when the SPA and API are on different origins (e.g. two Render services).
if (isProduction) {
    app.use(
        cors({
            origin: getFrontendOrigins(),
            credentials: true,
        })
    );
} else {
    app.use(
        cors({
            origin: DEFAULT_FRONTEND_ORIGINS.filter((o) => o.startsWith("http://")),
            credentials: true,
        })
    );
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://maps.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'"],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "https://*.googleapis.com",
                "https://*.gstatic.com",
                "https://images.unsplash.com",
                "https://upload.wikimedia.org",
                "https://commons.wikimedia.org",
            ],
            connectSrc: [
                "'self'",
                "https://maps.googleapis.com",
                "ws:",
                "wss:",
            ],
            // canvas-confetti (delivery celebration) renders via a blob: Web Worker by
            // default for performance. Without this, worker-src falls back to script-src,
            // which doesn't allow blob: — the Worker silently never runs (no thrown error,
            // no console warning) and confetti just never appears.
            workerSrc: ["'self'", "blob:"],
        },
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        },
    })
);

app.use(routes); // Connect all the routes

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = "Validation error";
        err.errors = errors;
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    console.error("Error stack trace:", err.stack);
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack,
    });
});

if (require.main === module) {
    const http = require("http");
    const server = http.createServer(app);
    initSocket(server);
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
} else {
    module.exports = app;
}
