import { useMemo, useState, useEffect } from "react";
import { trackingLog } from "../utils/trackingLog";

/** Bump when PHASE_MS changes so session anchors don’t reuse stale timelines. */
const STORAGE_KEY_PREFIX = "dineair_tracking_demo_v3_";

/**
 * Wall-clock demo phases (sessionStorage anchor). Same order as before: pending → preparing → on_the_way → delivered.
 * Tuned for portfolio walkthroughs (~90s full cycle) while still readable on screen.
 */
const PHASE_MS = {
    pending: 9_000,
    preparing: 12_000,
    on_the_way: 22_000,
};

/**
 * Numeric ordering for merging demo timeline with API/socket status.
 * @param {string | null | undefined} s
 */
function orderStatusRank(s) {
    if (!s) return 0;
    if (s === "delivered") return 4;
    if (s === "picked_up" || s === "on_the_way") return 3;
    if (s === "preparing") return 2;
    return 1; // pending
}

/**
 * @param {number} r
 * @returns {string}
 */
function rankToDbStatus(r) {
    if (r >= 4) return "delivered";
    if (r >= 3) return "on_the_way";
    if (r >= 2) return "preparing";
    return "pending";
}

/** Normalize API/socket strings so ranks match (e.g. Sequelize / JSON casing). */
function normalizeServerStatus(s) {
    if (s == null || typeof s !== "string") return null;
    const t = s.trim().toLowerCase();
    return t === "" ? null : t;
}

/**
 * Status implied by elapsed time since demo anchor (sessionStorage).
 * @param {number} elapsedMs
 */
function demoStatusFromElapsed(elapsedMs) {
    let t = 0;
    t += PHASE_MS.pending;
    if (elapsedMs < t) return "pending";
    t += PHASE_MS.preparing;
    if (elapsedMs < t) return "preparing";
    t += PHASE_MS.on_the_way;
    if (elapsedMs < t) return "on_the_way";
    return "delivered";
}

/**
 * 0 = at restaurant, 1 = at gate — aligned with PHASE_MS segments (same anchor as status).
 * @param {number} elapsedMs
 */
function runnerMapProgressFromElapsed(elapsedMs) {
    let t = 0;
    t += PHASE_MS.pending;
    if (elapsedMs < t) return 0;
    t += PHASE_MS.preparing;
    if (elapsedMs < t) return 0;
    const travelStart = PHASE_MS.pending + PHASE_MS.preparing;
    t += PHASE_MS.on_the_way;
    if (elapsedMs < t) {
        return (elapsedMs - travelStart) / PHASE_MS.on_the_way;
    }
    return 1;
}

function readOrInitAnchor(orderId) {
    // Avoid treating 0 as missing; only skip null/undefined/empty.
    if (orderId == null || orderId === "") return null;
    const key = STORAGE_KEY_PREFIX + String(orderId);
    try {
        const raw = sessionStorage.getItem(key);
        if (raw) {
            const parsed = JSON.parse(raw);
            const n = Number(parsed.startedAt);
            if (Number.isFinite(n)) return n;
        }
        const now = Date.now();
        sessionStorage.setItem(key, JSON.stringify({ startedAt: now }));
        return now;
    } catch {
        return Date.now();
    }
}

/**
 * Portfolio demo: advances order phase over time so the timeline and runner match without DB writes.
 * Merges with API/socket status using the more advanced phase.
 *
 * @param {number | null} orderId
 * @param {string | null} serverStatus — from GET /orders/current or socket
 */
export function useTrackingDemoProgress(orderId, serverStatus) {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (orderId == null) return undefined;
        const id = setInterval(() => setTick((n) => n + 1), 1000);
        return () => clearInterval(id);
    }, [orderId]);

    const startedAt = useMemo(() => readOrInitAnchor(orderId), [orderId]);

    const normalizedServer = normalizeServerStatus(serverStatus);

    /**
     * One clock snapshot per `tick` for demo phase + merge (avoids nested memo staleness).
     * Clamp elapsed so a corrupted/future sessionStorage anchor cannot pin the demo in "pending".
     */
    const { effectiveStatus, demoStatus, runnerMapProgress, elapsedMs } = useMemo(() => {
        const elapsedMs =
            orderId == null || startedAt == null
                ? 0
                : Math.max(0, Date.now() - startedAt);
        const demoPhase =
            orderId == null || startedAt == null
                ? null
                : demoStatusFromElapsed(elapsedMs);
        const a = orderStatusRank(normalizedServer);
        const b = orderStatusRank(demoPhase);
        let merged = rankToDbStatus(Math.max(a, b));

        let pathT =
            orderId == null || startedAt == null
                ? 0
                : runnerMapProgressFromElapsed(elapsedMs);

        // Keep map position aligned with visible phase (not ahead of status chip).
        if (merged === "pending" || merged === "preparing") pathT = 0;
        if (pathT >= 0.999) {
            // Completion guarantee: never sit in "on_the_way" once visual progress reached destination.
            merged = "delivered";
            pathT = 1;
        } else if (merged === "delivered") {
            pathT = 1;
        }

        return {
            effectiveStatus: merged,
            demoStatus: demoPhase,
            runnerMapProgress: pathT,
            elapsedMs,
        };
    }, [normalizedServer, orderId, startedAt, tick]);

    useEffect(() => {
        if (!import.meta.env.DEV || orderId == null) return;
        trackingLog("demo timeline tick", {
            orderId,
            elapsedMs,
            serverStatus: normalizedServer,
            demoStatus,
            effectiveStatus,
            runnerMapProgress: Number(runnerMapProgress.toFixed(3)),
            deliveredReached: runnerMapProgress >= 0.999 || effectiveStatus === "delivered",
        });
    }, [
        orderId,
        elapsedMs,
        normalizedServer,
        demoStatus,
        effectiveStatus,
        runnerMapProgress,
    ]);

    return { effectiveStatus, demoStatus, runnerMapProgress };
}
