const app = require("../app");
const db = require("../db/models");
const { signup } = require("./helpers");

let menuItem;

beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    const owner = await db.User.create({
        firstName: "Owner",
        lastName: "One",
        email: "cartowner@example.com",
        username: "cartowner",
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

    const restaurant = await db.Restaurant.create({
        ownerId: owner.id,
        airportId: airport.id,
        name: "Cart Test Restaurant",
        terminal: "1",
        gate: "A1",
        cuisineType: "Burgers",
        latitude: 33.9425,
        longitude: -118.408,
    });

    menuItem = await db.MenuItem.create({
        restaurantId: restaurant.id,
        name: "Test Burger",
        price: 9.5,
    });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("POST /api/carts/items", () => {
    it("creates a new cart item on first add", async () => {
        const { agent, csrfToken } = await signup(app, {
            email: "cartcustomer1@example.com",
            username: "cartcustomer1",
            userType: "customer",
        });

        const res = await agent
            .post("/api/carts/items")
            .set("XSRF-Token", csrfToken)
            .send({ menuItemId: menuItem.id, quantity: 1 });

        expect(res.status).toBe(201);
        expect(res.body.quantity).toBe(1);
        expect(Number(res.body.menuItemId)).toBe(menuItem.id);

        const listRes = await agent.get("/api/carts/items");
        expect(listRes.body).toHaveLength(1);
    });

    it("increments quantity instead of creating a duplicate row on repeat add", async () => {
        const { agent, csrfToken } = await signup(app, {
            email: "cartcustomer2@example.com",
            username: "cartcustomer2",
            userType: "customer",
        });

        const first = await agent
            .post("/api/carts/items")
            .set("XSRF-Token", csrfToken)
            .send({ menuItemId: menuItem.id, quantity: 1 });
        expect(first.status).toBe(201);

        const second = await agent
            .post("/api/carts/items")
            .set("XSRF-Token", csrfToken)
            .send({ menuItemId: menuItem.id, quantity: 1 });
        expect(second.status).toBe(200);
        expect(second.body.id).toBe(first.body.id);
        expect(second.body.quantity).toBe(2);

        const listRes = await agent.get("/api/carts/items");
        expect(listRes.body).toHaveLength(1);
        expect(listRes.body[0].quantity).toBe(2);
    });
});
