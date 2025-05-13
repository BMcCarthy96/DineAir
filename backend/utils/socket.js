const { Server } = require("socket.io");

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5174", "http://127.0.0.1:5174"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("runnerLocationUpdate", ({ runnerId, location }) => {
            console.log(`Runner ${runnerId} location updated:`, location);
            io.emit("runnerLocationUpdate", { runnerId, location });
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
