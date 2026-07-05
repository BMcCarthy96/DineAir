const app = require("../app");
const db = require("../db/models");
const { signup } = require("./helpers");

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("DELETE /api/users/:id authorization", () => {
    it("forbids a user from deleting another user's account", async () => {
        const { agent: agentA, csrfToken: tokenA } = await signup(app, {
            email: "userA@example.com",
            username: "userAAccount",
        });
        const { res: signupB } = await signup(app, {
            email: "userB@example.com",
            username: "userBAccount",
        });

        const res = await agentA
            .delete(`/api/users/${signupB.body.user.id}`)
            .set("XSRF-Token", tokenA);

        expect(res.status).toBe(403);
    });

    it("allows a user to delete their own account", async () => {
        const { agent, csrfToken, res: signupRes } = await signup(app, {
            email: "selfdelete@example.com",
            username: "selfdeleteuser",
        });

        const res = await agent
            .delete(`/api/users/${signupRes.body.user.id}`)
            .set("XSRF-Token", csrfToken);

        expect(res.status).toBe(204);
    });

    it("allows an admin to delete any user's account", async () => {
        const { res: targetSignup } = await signup(app, {
            email: "admintarget@example.com",
            username: "admintarget",
        });
        const adminUser = await signup(app, {
            email: "adminacct@example.com",
            username: "adminacct",
        });
        await db.User.update({ userType: "admin" }, { where: { email: "adminacct@example.com" } });

        const res = await adminUser.agent
            .delete(`/api/users/${targetSignup.body.user.id}`)
            .set("XSRF-Token", adminUser.csrfToken);

        expect(res.status).toBe(204);
    });
});
