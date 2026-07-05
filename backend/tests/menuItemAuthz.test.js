const app = require("../app");
const db = require("../db/models");
const { signup } = require("./helpers");

let owner;
let restaurant;

beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    const airport = await db.Airport.create({
        name: "Los Angeles International Airport",
        code: "LAX",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
    });

    owner = await db.User.create({
        firstName: "Owner",
        lastName: "One",
        email: "menuowner@example.com",
        username: "menuowner",
        hashedPassword: "x".repeat(60),
        userType: "restaurantOwner",
    });

    restaurant = await db.Restaurant.create({
        ownerId: owner.id,
        airportId: airport.id,
        name: "Owner's Restaurant",
        terminal: "1",
        gate: "A1",
        cuisineType: "Pizza",
        latitude: 33.9425,
        longitude: -118.408,
    });
});

afterAll(async () => {
    await db.sequelize.close();
});

function itemPayload() {
    return {
        name: "Cheese Slice",
        description: "Classic slice",
        price: 5.5,
        available: true,
        imageUrl: "https://example.com/slice.jpg",
    };
}

describe("menu item authorization", () => {
    it("forbids a customer from creating a menu item", async () => {
        const { agent, csrfToken } = await signup(app, { userType: "customer" });

        const res = await agent
            .post(`/api/restaurants/${restaurant.id}/menu-items`)
            .set("XSRF-Token", csrfToken)
            .send(itemPayload());

        expect(res.status).toBe(403);
    });

    it("forbids a restaurant owner who does not own the restaurant", async () => {
        const { agent, csrfToken } = await signup(app, {
            email: "impersonator@example.com",
            username: "impersonator",
            userType: "restaurantOwner",
        });

        const res = await agent
            .post(`/api/restaurants/${restaurant.id}/menu-items`)
            .set("XSRF-Token", csrfToken)
            .send(itemPayload());

        expect(res.status).toBe(403);
    });

    it("allows the owning restaurant owner to create a menu item", async () => {
        // Sign in as the actual owner rather than the signup helper (which always creates a new user).
        const request = require("supertest");
        const agent = request.agent(app);
        const csrfRes = await agent.get("/api/csrf/restore");
        const csrfToken = csrfRes.body["XSRF-Token"];

        await db.User.update(
            { hashedPassword: require("bcryptjs").hashSync("ownerpassword") },
            { where: { id: owner.id } }
        );

        const loginRes = await agent
            .post("/api/auth/login")
            .set("XSRF-Token", csrfToken)
            .send({ credential: "menuowner@example.com", password: "ownerpassword" });
        expect(loginRes.status).toBe(200);

        const res = await agent
            .post(`/api/restaurants/${restaurant.id}/menu-items`)
            .set("XSRF-Token", csrfToken)
            .send(itemPayload());

        expect(res.status).toBe(201);
        expect(Number(res.body.restaurantId)).toBe(restaurant.id);
        expect(res.body.name).toBe("Cheese Slice");
    });

    it("allows an admin to create a menu item on any restaurant", async () => {
        const { agent, csrfToken } = await signup(app, {
            email: "adminuser@example.com",
            username: "adminuser",
            userType: "customer",
        });
        await db.User.update({ userType: "admin" }, { where: { email: "adminuser@example.com" } });

        // Re-fetch session so req.user reflects the promoted admin userType.
        await agent.get("/api/auth/session");

        const res = await agent
            .post(`/api/restaurants/${restaurant.id}/menu-items`)
            .set("XSRF-Token", csrfToken)
            .send(itemPayload());

        expect(res.status).toBe(201);
    });
});
