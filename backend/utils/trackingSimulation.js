/**
 * Demo-friendly runner path simulation: moves along restaurant → gate when order is en route.
 * Pauses ticks when a real runner pushes GPS updates (see socket.js).
 */

const { Order, Restaurant } = require("../db/models");
const { gateCoordinates } = require("./gateCoordinates");

const TICK_MS = 2200;
/** Progress per tick while en route (~2 min full path at defaults). */
const PROGRESS_STEP = 0.012;

const TRAVEL_STATUSES = new Set(["picked_up", "on_the_way"]);

const simulations = new Map();

function resolveGate(order) {
    if (order.gateLat != null && order.gateLng != null) {
        return {
            lat: Number(order.gateLat),
            lng: Number(order.gateLng),
        };
    }
    return gateCoordinates[order.gate] || null;
}

function ease(t) {
    return 1 - (1 - t) ** 1.15;
}

/**
 * @param {import('socket.io').Server} io
 * @param {number} orderId
 */
function tick(io, orderId) {
    const sim = simulations.get(orderId);
    if (!sim || sim.paused) return;

    // Only advance when DB says travel — client demo timeline drives map before that.
    const canMove = TRAVEL_STATUSES.has(sim.orderStatus);
    if (canMove) {
        sim.progress = Math.min(1, sim.progress + PROGRESS_STEP);
    }

    const t = ease(sim.progress);
    const lat =
        sim.origin.lat + (sim.gate.lat - sim.origin.lat) * t;
    const lng =
        sim.origin.lng + (sim.gate.lng - sim.origin.lng) * t;

    io.to(`order:${orderId}`).emit("runnerLocationUpdate", {
        orderId,
        location: { lat, lng },
        source: "simulation",
    });
}

/**
 * @param {import('socket.io').Server} io
 * @param {number} orderId
 */
async function start(io, orderId) {
    if (simulations.has(orderId)) {
        simulations.get(orderId).refCount += 1;
        return;
    }

    const order = await Order.findByPk(orderId, {
        include: [{ model: Restaurant, attributes: ["latitude", "longitude"] }],
    });

    if (!order || !order.Restaurant) return;

    const origin = {
        lat: Number(order.Restaurant.latitude),
        lng: Number(order.Restaurant.longitude),
    };
    const gate = resolveGate(order);
    if (!gate) return;

    const sim = {
        refCount: 1,
        progress: 0,
        origin,
        gate,
        orderStatus: order.status,
        paused: false,
        intervalId: setInterval(() => tick(io, orderId), TICK_MS),
    };

    simulations.set(orderId, sim);
    tick(io, orderId);
}

/**
 * @param {number} orderId
 */
function leave(orderId) {
    const sim = simulations.get(orderId);
    if (!sim) return;
    sim.refCount -= 1;
    if (sim.refCount <= 0) {
        if (sim.intervalId) clearInterval(sim.intervalId);
        simulations.delete(orderId);
    }
}

/**
 * @param {number} orderId
 * @param {string} status
 */
function setOrderStatus(orderId, status) {
    const sim = simulations.get(orderId);
    if (sim) sim.orderStatus = status;
}

/**
 * Stop simulated movement; real GPS takes over.
 * @param {number} orderId
 */
function pauseForRealRunner(orderId) {
    const sim = simulations.get(orderId);
    if (!sim) return;
    sim.paused = true;
    if (sim.intervalId) {
        clearInterval(sim.intervalId);
        sim.intervalId = null;
    }
}

module.exports = {
    start,
    leave,
    setOrderStatus,
    pauseForRealRunner,
    TRAVEL_STATUSES,
};
