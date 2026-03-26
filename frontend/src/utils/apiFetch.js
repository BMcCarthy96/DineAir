/**
 * Same-origin API fetch with cookies (JWT is httpOnly; Bearer header is optional legacy).
 */
export function apiFetch(url, options = {}) {
    return fetch(url, {
        credentials: "include",
        ...options,
        headers: {
            ...options.headers,
        },
    });
}
