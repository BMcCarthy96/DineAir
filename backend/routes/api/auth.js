const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const {
    setTokenCookie,
    restoreUser,
    requireAuth,
} = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Validation middleware for signup
const validateSignup = [
    check("firstName")
        .exists({ checkFalsy: true })
        .withMessage("First Name is required."),
    check("lastName")
        .exists({ checkFalsy: true })
        .withMessage("Last Name is required."),
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 4 characters."),
    check("username")
        .not()
        .isEmail()
        .withMessage("Username cannot be an email."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be 6 characters or more."),
    check("userType")
        .exists({ checkFalsy: true })
        .isIn(["customer", "runner", "restaurantOwner"])
        .withMessage("User type is required."),
    handleValidationErrors,
];

// Validation middleware for login
const validateLogin = [
    check("credential")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Please provide a valid email or username."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
    handleValidationErrors,
];

// Sign up
router.post("/signup", validateSignup, async (req, res, next) => {
    console.log("Request Body:", req.body); // Log the request body

    const { firstName, lastName, email, password, username, userType } =
        req.body;

    try {
        const validUserTypes = ["customer", "runner", "restaurantOwner"];
        if (userType && !validUserTypes.includes(userType)) {
            return next({
                status: 400,
                message: "Invalid user type",
                errors: {
                    userType: `User type must be one of: ${validUserTypes.join(
                        ", "
                    )}`,
                },
            });
        }

        const finalUserType = userType || "customer";

        const existingUser = await User.findOne({
            where: { [Op.or]: [{ username }, { email }] },
        });

        if (existingUser) {
            return next({
                status: 500,
                message: "User already exists",
                errors: {
                    username: "User with that username already exists",
                    email: "User with that email already exists",
                },
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            hashedPassword: bcrypt.hashSync(password),
            userType: finalUserType,
        });

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            userType: user.userType,
        };

        await setTokenCookie(res, safeUser);

        return res.status(201).json({ user: safeUser });
    } catch (err) {
        return next(err);
    }
});

// Log in
router.post("/login", validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: { username: credential, email: credential },
        },
    });

    if (
        !user ||
        !bcrypt.compareSync(password, user.hashedPassword.toString())
    ) {
        return next({
            status: 401,
            title: "Login failed",
            message: "Invalid credentials",
            errors: { credential: "The provided credentials were invalid." },
        });
    }

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        userType: user.userType,
    };

    await setTokenCookie(res, safeUser);

    return res.status(200).json({ user: safeUser });
});

// Log out
router.delete("/logout", (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "success" });
});

// Restore session user
router.get("/session", restoreUser, (req, res) => {
    const { user } = req;

    if (user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            userType: user.userType,
        };
        return res.json({ user: safeUser });
    }

    return res.status(200).json({ user: null });
});

module.exports = router;
