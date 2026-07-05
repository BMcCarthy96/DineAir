const app = require("../app");
const db = require("../db/models");
const { signup } = require("./helpers");

let restaurant;

beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    const owner = await db.User.create({
        firstName: "Owner",
        lastName: "One",
        email: "favowner@example.com",
        username: "favowner",
        hashedPassword: "x".repeat(60),
        userType: "restaurantOwner",
    });

    const airport = await db.Airport.create({
        name: "Los Angeles International Airport",
        code: "LAX",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
    });

    restaurant = await db.Restaurant.create({
        ownerId: owner.id,
        airportId: airport.id,
        name: "Favorite Test Restaurant",
        terminal: "1",
        gate: "A1",
        cuisineType: "Tacos",
        latitude: 33.9425,
        longitude: -118.408,
    });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("favorites round-trip", () => {
    it("adds, lists, and removes a favorite restaurant", async () => {
        const { agent, csrfToken } = await signup(app, {
            email: "favcustomer@example.com",
            username: "favcustomer",
            userType: "customer",
        });

        const addRes = await agent
            .post("/api/favorites")
            .set("XSRF-Token", csrfToken)
            .send({ restaurantId: restaurant.id });
        expect(addRes.status).toBe(201);

        const listRes = await agent.get("/api/favorites");
        expect(listRes.status).toBe(200);
        expect(listRes.body).toHaveLength(1);
        expect(listRes.body[0].id).toBe(restaurant.id);

        const removeRes = await agent
            .delete(`/api/favorites/${restaurant.id}`)
            .set("XSRF-Token", csrfToken);
        expect(removeRes.status).toBe(204);

        const listAfterRemove = await agent.get("/api/favorites");
        expect(listAfterRemove.body).toHaveLength(0);
    });

    it("rejects adding the same favorite twice", async () => {
        const { agent, csrfToken } = await signup(app, {
            email: "favcustomer2@example.com",
            username: "favcustomer2",
            userType: "customer",
        });

        await agent
            .post("/api/favorites")
            .set("XSRF-Token", csrfToken)
            .send({ restaurantId: restaurant.id });

        const dupRes = await agent
            .post("/api/favorites")
            .set("XSRF-Token", csrfToken)
            .send({ restaurantId: restaurant.id });

        expect(dupRes.status).toBe(400);
    });
});
