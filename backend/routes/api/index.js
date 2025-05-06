const router = require("express").Router();
const authRouter = require("./auth.js");
const adminRouter = require("./admin");
const restaurantOwnersRouter = require("./restaurantOwners");
const usersRouter = require("./users.js");
const searchRouter = require("./search.js");
const cartRouter = require("./carts.js");
const cartItemsRouter = require("./cartItems.js");
const ordersRouter = require("./orders.js");
const deliveryRouter = require("./deliveries.js");
const restaurantRouter = require("./restaurants.js");
const reviewRouter = require("./reviews.js");
const menuItemRouter = require("./menuItems.js");
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/restaurant-owners", restaurantOwnersRouter);
router.use("/users", usersRouter);
router.use("/search", searchRouter);
router.use("/carts", cartRouter);
router.use("/carts/items", cartItemsRouter);
router.use("/orders", ordersRouter);
router.use("/deliveries", deliveryRouter);
router.use("/restaurants", restaurantRouter);

// Add routes for reviews and menu items (under restaurants.js)
router.use("/restaurants/:restaurantId/reviews", reviewRouter);
router.use("/restaurants/:restaurantId/menu-items", menuItemRouter);

// Add CSRF token route
router.get("/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({ "XSRF-Token": csrfToken });
});

module.exports = router;
