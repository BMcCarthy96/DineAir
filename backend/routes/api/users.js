const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { handleValidationErrors } = require("../../utils/validation");
const { signup } = require("../../controllers/userController");

// Validation middleware
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
    handleValidationErrors,
];

// Sign up route
router.post("/", validateSignup, signup);

module.exports = router;
