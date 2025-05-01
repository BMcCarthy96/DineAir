const { User } = require("../db/models");
const bcrypt = require("bcryptjs");
const { setTokenCookie } = require("../utils/auth");
const { Op } = require("sequelize");

exports.signup = async (req, res, next) => {
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

        // Default to 'customer' if no userType is provided
        const finalUserType = userType || "customer";

        // Check for existing username or email
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
};
