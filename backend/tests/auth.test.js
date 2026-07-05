const app = require("../app");
const db = require("../db/models");
const { getCsrf, signup } = require("./helpers");

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("auth", () => {
    it("signup creates a user, sets a session cookie, and never returns the password", async () => {
        const { res } = await signup(app, { email: "signup1@example.com", username: "signupuser1" });

        expect(res.status).toBe(201);
        expect(res.body.user).toMatchObject({
            email: "signup1@example.com",
            username: "signupuser1",
            userType: "customer",
        });
        expect(res.body.user.hashedPassword).toBeUndefined();
        expect(res.headers["set-cookie"].some((c) => c.startsWith("token="))).toBe(true);
    });

    it("logs in with correct credentials and restores the session from the cookie", async () => {
        await signup(app, { email: "login1@example.com", username: "loginuser1", password: "correcthorse" });

        const { agent, csrfToken } = await getCsrf(app);
        const loginRes = await agent
            .post("/api/auth/login")
            .set("XSRF-Token", csrfToken)
            .send({ credential: "login1@example.com", password: "correcthorse" });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.user.email).toBe("login1@example.com");

        const sessionRes = await agent.get("/api/auth/session");
        expect(sessionRes.status).toBe(200);
        expect(sessionRes.body.user).not.toBeNull();
        expect(sessionRes.body.user.email).toBe("login1@example.com");
    });

    it("rejects login with an incorrect password", async () => {
        await signup(app, { email: "login2@example.com", username: "loginuser2", password: "correcthorse" });

        const { agent, csrfToken } = await getCsrf(app);
        const loginRes = await agent
            .post("/api/auth/login")
            .set("XSRF-Token", csrfToken)
            .send({ credential: "login2@example.com", password: "wrongpassword" });

        expect(loginRes.status).toBe(401);
    });

    it("returns a null user for /api/auth/session when not logged in", async () => {
        const { agent } = await getCsrf(app);
        const sessionRes = await agent.get("/api/auth/session");
        expect(sessionRes.status).toBe(200);
        expect(sessionRes.body.user).toBeNull();
    });
});
