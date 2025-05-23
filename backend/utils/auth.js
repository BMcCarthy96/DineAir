const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie("token", token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax",
    });

    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ["email", "userType", "createdAt", "updatedAt"],
                },
            });
        } catch (e) {
            res.clearCookie("token");
            return next();
        }

        if (!req.user) res.clearCookie("token");

        return next();
    });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) {
        console.log("Authenticated user:", req.user); // Debugging
        return next();
    }

    const err = new Error("Authentication required");
    err.title = "Authentication required";
    err.errors = { message: "Authentication required" };
    err.status = 401;
    return next(err);
};

// Middleware to check if the user is an admin
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.userType === "admin") {
        return next();
    }
    res.status(403).json({ error: "Forbidden: Admin access required" });
};

// Middleware to check if the user is a restaurant owner
const requireRestaurantOwner = (req, res, next) => {
    if (req.user && req.user.userType === "restaurantOwner") {
        return next();
    }
    res.status(403).json({
        error: "Forbidden: Restaurant owner access required",
    });
};

// Middleware to check if the user is a restaurant owner or admin
const requireAdminOrRestaurantOwner = (req, res, next) => {
    if (
        req.user &&
        (req.user.userType === "admin" ||
            req.user.userType === "restaurantOwner")
    ) {
        return next();
    }
    res.status(403).json({
        error: "Forbidden: Admin or Restaurant Owner access required",
    });
};

// Middleware to check if the user is a runner
const requireRunner = (req, res, next) => {
    if (req.user && req.user.userType === "runner") {
        return next();
    }
    res.status(403).json({ error: "Forbidden: Runner access required" });
};

// Middleware to check if the user is a customer
const requireCustomer = (req, res, next) => {
    if (req.user && req.user.userType === "customer") {
        return next();
    }
    res.status(403).json({ error: "Forbidden: Customer access required" });
};

// Middleware to allow access for all user types
const requireAnyUser = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.status(403).json({ error: "Forbidden: User access required" });
};

module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth,
    requireAdmin,
    requireRestaurantOwner,
    requireAdminOrRestaurantOwner,
    requireRunner,
    requireCustomer,
    requireAnyUser,
};
