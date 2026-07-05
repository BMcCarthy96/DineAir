const request = require("supertest");

let counter = 0;
function uniqueSuffix() {
    counter += 1;
    return `${Date.now().toString(36)}${counter}`;
}

/** Returns a cookie-jar-backed agent plus the CSRF token to send on mutating requests. */
async function getCsrf(app) {
    const agent = request.agent(app);
    const res = await agent.get("/api/csrf/restore");
    return { agent, csrfToken: res.body["XSRF-Token"] };
}

/** Signs up a fresh user (unique email/username) and returns the authenticated agent. */
async function signup(app, overrides = {}) {
    const { agent, csrfToken } = await getCsrf(app);
    const suffix = uniqueSuffix();
    const body = {
        firstName: "Test",
        lastName: "User",
        email: `user${suffix}@example.com`,
        username: `u${suffix}`.slice(0, 25),
        password: "password123",
        userType: "customer",
        ...overrides,
    };
    const res = await agent
        .post("/api/auth/signup")
        .set("XSRF-Token", csrfToken)
        .send(body);
    return { agent, res, csrfToken, body };
}

module.exports = { getCsrf, signup };
