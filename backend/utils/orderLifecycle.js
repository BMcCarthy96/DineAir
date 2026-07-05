"use strict";

/**
 * Server-owned order lifecycle: assigns a runner, creates the Delivery row, and advances
 * order status on a timer independent of whether any client is watching. Replaces the old
 * client-side sessionStorage timeline — the server is now the single source of truth.
 */

const { Order, Delivery, User } = require("../db/models");
const trackingSimulation = require("./trackingSimulation");

const PREP_MS = 10_000;
const PICKUP_MS = 15_000;
const HANDOFF_MS = 3_000;
// Matches trackingSimulation's own pacing (1 / PROGRESS_STEP ticks at TICK_MS each) plus a
// small buffer so the map marker finishes its path before the status flips to delivered.
const TRAVEL_MS = 185_000;

const PREP_AT = PREP_MS;
const PICKED_UP_AT = PREP_AT + PICKUP_MS;
const ON_THE_WAY_AT = PICKED_UP_AT + HANDOFF_MS;
const DELIVERED_AT = ON_THE_WAY_AT + TRAVEL_MS;

let lastRunnerId = null;
const timers = new Map();

function clearTimers(orderId) {
    const existing = timers.get(orderId);
    if (existing) {
        existing.forEach(clearTimeout);
        timers.delete(orderId);
    }
}

async function pickRunnerId() {
    const runners = await User.findAll({
        where: { userType: "runner" },
        attributes: ["id"],
        order: [["id", "ASC"]],
    });
    if (runners.length === 0) return null;
    const ids = runners.map((r) => r.id);
    const currentIdx = lastRunnerId == null ? -1 : ids.indexOf(lastRunnerId);
    const next = ids[(currentIdx + 1) % ids.length];
    lastRunnerId = next;
    return next;
}

async function setStatus(io, orderId, status) {
    const order = await Order.findByPk(orderId);
    if (!order || order.status === "delivered") return;

    order.status = status;
    await order.save();
    trackingSimulation.setOrderStatus(orderId, status);
    io.to(`order:${orderId}`).emit("orderStatusUpdate", { orderId, status });

    if (status === "on_the_way") {
        await trackingSimulation.start(io, orderId);
    }

    if (status === "delivered") {
        const delivery = await Delivery.findOne({ where: { orderId } });
        if (delivery) {
            delivery.status = "delivered";
            await delivery.save();
            io.to(`order:${orderId}`).emit("deliveryCompleted", {
                deliveryId: delivery.id,
            });
        }
        trackingSimulation.stop(orderId);
        clearTimers(orderId);
    }
}

/** Schedules whatever phase transitions remain, given how much time has already elapsed. */
function scheduleRemaining(io, orderId, elapsedMs) {
    clearTimers(orderId);
    const scheduled = [];

    const at = (targetMs, status) => {
        if (elapsedMs >= targetMs) return;
        scheduled.push(
            setTimeout(
                () => setStatus(io, orderId, status),
                targetMs - elapsedMs
            )
        );
    };

    at(PREP_AT, "preparing");
    at(PICKED_UP_AT, "picked_up");
    at(ON_THE_WAY_AT, "on_the_way");
    at(DELIVERED_AT, "delivered");

    timers.set(orderId, scheduled);
}

/** Call once, right after an order is created. */
async function start(io, orderId) {
    const runnerId = await pickRunnerId();
    const order = await Order.findByPk(orderId);
    if (!order) return;

    if (runnerId) {
        order.runnerId = runnerId;
        await order.save();
        await Delivery.create({
            orderId,
            runnerId,
            deliveryTime: new Date(Date.now() + DELIVERED_AT),
            status: "pending",
        });
    }

    scheduleRemaining(io, orderId, 0);
}

/**
 * Call when a client joins tracking for an order that isn't in memory (e.g. after a
 * server restart). Fast-forwards status/DB to where the timeline should be by now.
 */
async function resumeLifecycle(io, orderId) {
    if (timers.has(orderId)) return;

    const order = await Order.findByPk(orderId);
    if (!order || order.status === "delivered") return;

    const elapsedMs = Date.now() - new Date(order.createdAt).getTime();

    let targetStatus = "pending";
    if (elapsedMs >= DELIVERED_AT) targetStatus = "delivered";
    else if (elapsedMs >= ON_THE_WAY_AT) targetStatus = "on_the_way";
    else if (elapsedMs >= PICKED_UP_AT) targetStatus = "picked_up";
    else if (elapsedMs >= PREP_AT) targetStatus = "preparing";

    if (targetStatus !== order.status) {
        await setStatus(io, orderId, targetStatus);
    } else if (targetStatus === "on_the_way") {
        await trackingSimulation.start(io, orderId);
    }

    if (targetStatus !== "delivered") {
        scheduleRemaining(io, orderId, elapsedMs);
    }
}

module.exports = { start, resumeLifecycle };
