const app = require("../app");
const db = require("../db/models");
const { getCsrf } = require("./helpers");

let owner;
let airport;

beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    owner = await db.User.create({
        firstName: "Owner",
        lastName: "One",
        email: "owner@example.com",
        username: "restaurantowner",
        hashedPassword: "x".repeat(60),
        userType: "restaurantOwner",
    });

    airport = await db.Airport.create({
        name: "Los Angeles International Airport",
        code: "LAX",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
    });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("GET /api/restaurants", () => {
    it("computes avgRating/reviewCount as null/0 when a restaurant has no reviews", async () => {
        const restaurant = await db.Restaurant.create({
            ownerId: owner.id,
            airportId: airport.id,
            name: "No Reviews Yet",
            terminal: "1",
            gate: "A1",
            cuisineType: "Sandwiches",
            latitude: 33.9425,
            longitude: -118.408,
        });

        const { agent } = await getCsrf(app);
        const res = await agent.get("/api/restaurants");
        expect(res.status).toBe(200);

        const found = res.body.find((r) => r.id === restaurant.id);
        expect(found).toBeDefined();
        expect(Number(found.reviewCount)).toBe(0);
        expect(found.avgRating == null).toBe(true);
    });

    it("computes avgRating as the mean of submitted review ratings", async () => {
        const restaurant = await db.Restaurant.create({
            ownerId: owner.id,
            airportId: airport.id,
            name: "Well Reviewed Diner",
            terminal: "2",
            gate: "B2",
            cuisineType: "Diner",
            latitude: 33.9425,
            longitude: -118.408,
        });

        const reviewer = await db.User.create({
            firstName: "Reviewer",
            lastName: "One",
            email: "reviewer@example.com",
            username: "reviewerone",
            hashedPassword: "x".repeat(60),
            userType: "customer",
        });

        await db.Review.create({ userId: reviewer.id, restaurantId: restaurant.id, rating: 5 });
        await db.Review.create({ userId: reviewer.id, restaurantId: restaurant.id, rating: 3 });

        const { agent } = await getCsrf(app);
        const res = await agent.get("/api/restaurants");
        const found = res.body.find((r) => r.id === restaurant.id);

        expect(Number(found.reviewCount)).toBe(2);
        expect(Number(found.avgRating)).toBe(4);
    });
});
