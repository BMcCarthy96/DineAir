const PREFIX = "[DineAir Tracking]";

/**
 * @param {...unknown} args
 */
export function trackingLog(...args) {
    if (!import.meta.env.DEV) return;
    console.info(PREFIX, ...args);
}

/**
 * @param {...unknown} args
 */
export function trackingWarn(...args) {
    if (!import.meta.env.DEV) return;
    console.warn(PREFIX, ...args);
}
