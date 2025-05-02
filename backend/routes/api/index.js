const router = require("express").Router();
const authRouter = require("./auth.js");
const cartRouter = require("./carts.js");
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
router.use("/carts", cartRouter);
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
