// createOrder fires orderLifecycle.start(getSocket(), ...) without awaiting it, and getSocket()
// throws unless initSocket(server) has run — which never happens under supertest. Stub it so the
// request completes and the lifecycle's runner-assignment logic still runs for real.
jest.mock("../utils/socket", () => ({
    getSocket: () => ({ to: () => ({ emit: () => {} }) }),
}));

const app = require("../app");
const db = require("../db/models");
const { signup } = require("./helpers");

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

afterAll(async () => {
    await db.sequelize.close();
});

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("POST /api/orders", () => {
    it("creates an order and assigns a runner via the server-owned lifecycle", async () => {
        const runner = await db.User.create({
            firstName: "Runner",
            lastName: "One",
            email: "runner@example.com",
            username: "runnerone",
            hashedPassword: "x".repeat(60),
            userType: "runner",
        });

        const owner = await db.User.create({
            firstName: "Owner",
            lastName: "One",
            email: "orderowner@example.com",
            username: "orderowner",
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
            name: "Order Test Restaurant",
            terminal: "1",
            gate: "A1",
            cuisineType: "Burgers",
            latitude: 33.9425,
            longitude: -118.408,
        });

        const menuItem = await db.MenuItem.create({
            restaurantId: restaurant.id,
            name: "Test Burger",
            price: 9.5,
        });

        const { agent, csrfToken } = await signup(app, {
            email: "customer@example.com",
            username: "ordercustomer",
            userType: "customer",
        });

        const cart = await db.Cart.create({ userId: (await db.User.findOne({ where: { email: "customer@example.com" } })).id });
        await db.CartItem.create({ cartId: cart.id, menuItemId: menuItem.id, quantity: 2 });

        const res = await agent
            .post("/api/orders")
            .set("XSRF-Token", csrfToken)
            .send({ gate: "A1", gateLat: 33.94, gateLng: -118.4 });

        expect(res.status).toBe(201);
        expect(Number(res.body.totalPrice)).toBeCloseTo(19.0, 2);

        // orderLifecycle.start() is fire-and-forget from the controller; give its first
        // await (the runner lookup) a tick to resolve before asserting on the Delivery row.
        await wait(100);

        const order = await db.Order.findByPk(res.body.id);
        expect(order.runnerId).toBe(runner.id);

        const delivery = await db.Delivery.findOne({ where: { orderId: order.id } });
        expect(delivery).not.toBeNull();
        expect(delivery.runnerId).toBe(runner.id);
        expect(delivery.status).toBe("pending");
    });

    it("returns 400 when the cart is empty", async () => {
        const { agent, csrfToken } = await signup(app, {
            email: "emptycart@example.com",
            username: "emptycartuser",
            userType: "customer",
        });

        const res = await agent
            .post("/api/orders")
            .set("XSRF-Token", csrfToken)
            .send({ gate: "A1", gateLat: 33.94, gateLng: -118.4 });

        expect(res.status).toBe(400);
    });
});
