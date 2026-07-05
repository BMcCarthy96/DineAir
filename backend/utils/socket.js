const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { Order } = require("../db/models");
const trackingSimulation = require("./trackingSimulation");
const orderLifecycle = require("./orderLifecycle");
const { getFrontendOrigins } = require("./corsOrigins");

let io;

function parseTokenFromCookie(cookieHeader) {
    if (!cookieHeader || typeof cookieHeader !== "string") return null;
    const parts = cookieHeader.split(";");
    for (const segment of parts) {
        const idx = segment.indexOf("=");
        if (idx === -1) continue;
        const name = segment.slice(0, idx).trim();
        const value = segment.slice(idx + 1).trim();
        if (name === "token") return decodeURIComponent(value);
    }
    return null;
}

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: getFrontendOrigins(),
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token =
                parseTokenFromCookie(socket.handshake.headers.cookie) ||
                socket.handshake.auth?.token;
            if (!token) {
                socket.userId = null;
                return next();
            }
            const payload = jwt.verify(token, jwtConfig.secret);
            socket.userId = payload.data.id;
            next();
        } catch {
            socket.userId = null;
            next();
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinTracking", async ({ orderId }, cb) => {
            try {
                if (!socket.userId) {
                    cb?.({ ok: false, error: "unauthorized" });
                    return;
                }
                const order = await Order.findByPk(orderId);
                if (!order || order.userId !== socket.userId) {
                    cb?.({ ok: false, error: "forbidden" });
                    return;
                }
                await socket.join(`order:${orderId}`);
                await orderLifecycle.resumeLifecycle(io, orderId);
                await trackingSimulation.start(io, orderId);
                cb?.({ ok: true });
            } catch (e) {
                console.error("joinTracking", e);
                cb?.({ ok: false, error: "server" });
            }
        });

        socket.on("leaveTracking", ({ orderId }) => {
            if (!orderId) return;
            socket.leave(`order:${orderId}`);
            trackingSimulation.leave(orderId);
        });

        socket.on("runnerLocationUpdate", ({ runnerId, location, orderId }) => {
            if (orderId && location) {
                trackingSimulation.pauseForRealRunner(orderId);
                io.to(`order:${orderId}`).emit("runnerLocationUpdate", {
                    orderId,
                    runnerId,
                    location,
                    source: "runner",
                });
            } else {
                io.emit("runnerLocationUpdate", { runnerId, location });
            }
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });

    return io;
}

function getSocket() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = { initSocket, getSocket };
